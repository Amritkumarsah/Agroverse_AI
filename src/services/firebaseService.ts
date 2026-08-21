import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  signInWithRedirect,
  getRedirectResult,
  sendPasswordResetEmail,
  sendEmailVerification,
  GoogleAuthProvider,
  signOut, 
  updateProfile,
  User as FirebaseUser 
} from 'firebase/auth';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  deleteDoc, 
  query, 
  where 
} from 'firebase/firestore';
import { auth, googleProvider, db } from '../config/firebase';
import { FarmerProfile, UserRole } from '../types';

export interface UserProfileData {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: UserRole;
  location?: string;
  createdAt: string;
  emailVerified?: boolean;
}

export class FirebaseService {
  /**
   * Register a new user with Email & Password in Firebase Auth, send verification link, and save to Firestore
   */
  async signUpWithEmail(
    email: string, 
    pass: string, 
    name: string, 
    role: UserRole = 'farmer',
    avatarUrl?: string
  ): Promise<UserProfileData> {
    console.log('[AUTH DEBUG] createUserWithEmailAndPassword started');
    const userCred = await createUserWithEmailAndPassword(auth, email, pass);
    const user = userCred.user;
    console.log('[AUTH DEBUG] Firebase signup success', { uid: user.uid, email: user.email });

    try {
      await updateProfile(user, {
        displayName: name,
        photoURL: avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'
      });
    } catch (e) {}

    try {
      console.log('[AUTH DEBUG] sendEmailVerification started');
      const actionCodeSettings = {
        url: window.location.origin || 'http://localhost:5173',
        handleCodeInApp: false
      };
      await sendEmailVerification(user, actionCodeSettings);
      console.log('[AUTH DEBUG] sendEmailVerification success');
    } catch (e) {
      console.warn('[AUTH DEBUG] sendEmailVerification error notice:', e);
    }

    const profileData: UserProfileData = {
      uid: user.uid,
      email: user.email,
      displayName: name,
      photoURL: avatarUrl || user.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      role,
      createdAt: new Date().toISOString(),
      emailVerified: user.emailVerified
    };

    // Persist user profile to Firestore database
    await setDoc(doc(db, 'users', profileData.uid), profileData, { merge: true });

    return profileData;
  }

  /**
   * Resend Firebase Email Verification Link to currently signed-in user
   */
  async resendVerificationEmail(): Promise<void> {
    if (auth.currentUser) {
      console.log('[AUTH DEBUG] resendVerificationEmail started');
      const actionCodeSettings = {
        url: window.location.origin || 'http://localhost:5173',
        handleCodeInApp: false
      };
      await sendEmailVerification(auth.currentUser, actionCodeSettings);
      console.log('[AUTH DEBUG] resendVerificationEmail success');
    } else {
      throw new Error('No user signed in to resend verification email.');
    }
  }

  /**
   * Reload current Firebase User and check if Gmail has been verified
   */
  async checkEmailVerified(): Promise<boolean> {
    if (auth.currentUser) {
      try {
        await auth.currentUser.reload();
        return auth.currentUser.emailVerified;
      } catch (e) {
        return false;
      }
    }
    return false;
  }

  /**
   * Sign in existing user with Email & Password, persisting selected role to Firestore
   */
  async signInWithEmail(email: string, pass: string, role?: UserRole): Promise<UserProfileData> {
    console.log('[AUTH DEBUG] signInWithEmail started');
    const userCred = await signInWithEmailAndPassword(auth, email, pass);
    const user = userCred.user;

    if (role) {
      try {
        await setDoc(doc(db, 'users', user.uid), { role }, { merge: true });
      } catch (e) {}
    }

    const profile = await this.getUserProfile(user, role);
    if (profile) return profile;

    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || email.split('@')[0],
      photoURL: user.photoURL,
      role: role || 'farmer',
      createdAt: new Date().toISOString(),
      emailVerified: user.emailVerified
    };
  }

  /**
   * Send Password Reset email via Firebase Auth
   */
  async sendPasswordReset(email: string): Promise<void> {
    await sendPasswordResetEmail(auth, email);
  }

  /**
   * Real Firebase Google OAuth Sign-In (Pure signInWithPopup & Strict Firestore Agent Authorization)
   * The Google popup stays open naturally until the user selects an account or cancels.
   * Authentication != Authorization: Unregistered Google accounts are REJECTED and signed out.
   */
  async signInWithGoogle(role: UserRole = 'farmer'): Promise<UserProfileData> {
    console.log('[AUTH DEBUG] signInWithGoogle started');
    console.log('[AUTH DEBUG] signInWithPopup started', new Date().toISOString());
    googleProvider.setCustomParameters({ prompt: 'select_account' });
    
    // Execute real Firebase Auth OAuth popup with explicit Google Account Chooser
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    console.log('[AUTH DEBUG] Google popup success', {
      uid: user.uid,
      email: user.email,
      emailVerified: user.emailVerified
    });

    // STEP 2: Strict Application Authorization Check against Cloud Firestore
    console.log('[AUTH DEBUG] Firestore authorization started');
    let profileData: UserProfileData | null = null;
    try {
      const userDocRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(userDocRef);

      if (docSnap.exists()) {
        profileData = docSnap.data() as UserProfileData;
        profileData.role = role || profileData.role || 'farmer';
        profileData.emailVerified = true;
        
        // Sync role if requested
        try {
          await setDoc(userDocRef, { role: profileData.role, emailVerified: true }, { merge: true });
        } catch (e) {}
      } else if (user.email) {
        // Query by email in case account was registered with email
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('email', '==', user.email));
        const querySnap = await getDocs(q);

        if (!querySnap.empty) {
          const matchedDoc = querySnap.docs[0];
          profileData = matchedDoc.data() as UserProfileData;
          profileData.role = role || profileData.role || 'farmer';
          profileData.emailVerified = true;
        }
      }
    } catch (e) {
      console.warn('Firestore authorization lookup warning:', e);
    }

    // IF UNREGISTERED IN AGENT DATABASE -> DENY ACCESS & SIGN OUT IMMEDIATELY
    if (!profileData) {
      console.log('[AUTH DEBUG] Firestore authorization result: DENIED');
      console.log('[AUTH DEBUG] Executing Firebase signOut() and blocking dashboard redirect');
      await signOut(auth);
      const authErr: any = new Error('Your Google account is not registered as an Agent. Please register first or contact the administrator.');
      authErr.code = 'auth/unregistered-agent';
      throw authErr;
    }

    console.log('[AUTH DEBUG] Firestore authorization result: AUTHORIZED');
    return profileData;
  }

  /**
   * Get user profile details from Firestore or Auth object with Authorization Check
   */
  async getUserProfile(user: FirebaseUser, fallbackRole?: UserRole): Promise<UserProfileData | null> {
    try {
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data() as UserProfileData;
        data.emailVerified = user.emailVerified;
        if (fallbackRole && data.role !== fallbackRole) {
          data.role = fallbackRole;
          try {
            await setDoc(docRef, { role: fallbackRole }, { merge: true });
          } catch {}
        }
        return data;
      }

      // Check by email query
      if (user.email) {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('email', '==', user.email));
        const querySnap = await getDocs(q);
        if (!querySnap.empty) {
          const data = querySnap.docs[0].data() as UserProfileData;
          data.emailVerified = user.emailVerified;
          return data;
        }
      }
    } catch (e) {
      console.warn('Could not fetch user document from Firestore:', e);
    }

    return null;
  }

  /**
   * Log out current user from Firebase Auth
   */
  async logout(): Promise<void> {
    await signOut(auth);
  }

  /**
   * Save or Update a Farm parcel document in Firestore
   */
  async saveFarmToFirestore(farm: FarmerProfile, userId?: string): Promise<void> {
    try {
      const farmRef = doc(db, 'farms', farm.id);
      await setDoc(farmRef, {
        ...farm,
        userId: userId || auth.currentUser?.uid || 'guest',
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (e) {
      console.warn('Firestore farm save warning:', e);
    }
  }

  /**
   * Delete a Farm parcel from Firestore
   */
  async deleteFarmFromFirestore(farmId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'farms', farmId));
    } catch (e) {
      console.warn('Firestore farm delete warning:', e);
    }
  }

  /**
   * Fetch all persistent farms from Firestore
   */
  async getFarmsFromFirestore(): Promise<FarmerProfile[]> {
    try {
      const farmsRef = collection(db, 'farms');
      const querySnap = await getDocs(farmsRef);
      const fetched: FarmerProfile[] = [];
      querySnap.forEach((docSnap) => {
        fetched.push(docSnap.data() as FarmerProfile);
      });
      return fetched;
    } catch (e) {
      console.warn('Firestore load farms warning:', e);
      return [];
    }
  }
}

export const firebaseService = new FirebaseService();
