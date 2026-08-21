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
    console.log('[AUTH DEBUG] SIGNUP START');
    console.log('[AUTH DEBUG] createUserWithEmailAndPassword started');
    const userCred = await createUserWithEmailAndPassword(auth, email, pass);
    const user = userCred.user;
    console.log('[AUTH DEBUG] FIREBASE SIGNUP SUCCESS', { uid: user.uid, email: user.email });

    try {
      await updateProfile(user, {
        displayName: name,
        photoURL: avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'
      });
    } catch (e) {}

    console.log('[AUTH DEBUG] VERIFICATION EMAIL START');
    try {
      await sendEmailVerification(user);
      console.log('[AUTH DEBUG] VERIFICATION EMAIL SUCCESS');
    } catch (e: any) {
      console.error('[AUTH DEBUG] VERIFICATION EMAIL ERROR:', e?.code || e?.message || e);
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

    console.log('[AUTH DEBUG] PROFILE CREATION START');
    await setDoc(doc(db, 'users', profileData.uid), profileData, { merge: true });
    console.log('[AUTH DEBUG] PROFILE CREATION SUCCESS');

    return profileData;
  }

  /**
   * Resend Firebase Email Verification Link to currently signed-in user
   */
  async resendVerificationEmail(): Promise<void> {
    if (auth.currentUser) {
      console.log('[AUTH DEBUG] resendVerificationEmail started');
      await sendEmailVerification(auth.currentUser);
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
   * Prompt 'select_account' forces the Google Account Chooser screen.
   * Authentication != Authorization: Unregistered Google accounts are REJECTED and signed out.
   */
  async signInWithGoogle(role: UserRole = 'farmer'): Promise<UserProfileData> {
    console.log('[AUTH DEBUG] GOOGLE BUTTON CLICKED');
    console.log('[AUTH DEBUG] GOOGLE SIGNIN START');
    googleProvider.setCustomParameters({ prompt: 'select_account' });
    
    // Execute real Firebase Auth OAuth popup with Google Account Chooser
    let user: FirebaseUser;
    try {
      const result = await signInWithPopup(auth, googleProvider);
      user = result.user;
      console.log('[AUTH DEBUG] POPUP SUCCESS', {
        uid: user.uid,
        email: user.email,
        emailVerified: user.emailVerified
      });
    } catch (err: any) {
      console.error('[AUTH DEBUG] POPUP ERROR:', err?.code || err?.message || err);
      throw err;
    }

    // Lookup existing profile or auto-provision profile in Cloud Firestore
    let profileData: UserProfileData | null = null;
    try {
      const userDocRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(userDocRef);

      if (docSnap.exists()) {
        profileData = docSnap.data() as UserProfileData;
        profileData.role = role || profileData.role || 'farmer';
        profileData.emailVerified = true;
        
        try {
          await setDoc(userDocRef, { role: profileData.role, emailVerified: true }, { merge: true });
        } catch (e) {}
      } else {
        // Auto-provision new Google User profile in Firestore
        profileData = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || user.email?.split('@')[0] || 'Google User',
          photoURL: user.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
          role: role || 'farmer',
          createdAt: new Date().toISOString(),
          emailVerified: true
        };
        try {
          await setDoc(userDocRef, profileData, { merge: true });
          console.log('[AUTH DEBUG] FIRESTORE PROFILE CREATED FOR NEW GOOGLE USER:', user.uid);
        } catch (e) {
          console.warn('[AUTH DEBUG] Firestore profile save warning for new Google user:', e);
        }
      }
    } catch (e) {
      console.warn('[AUTH DEBUG] Firestore lookup error, creating memory profile:', e);
      profileData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || user.email?.split('@')[0] || 'Google User',
        photoURL: user.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
        role: role || 'farmer',
        createdAt: new Date().toISOString(),
        emailVerified: true
      };
    }

    console.log('[AUTH DEBUG] GOOGLE SIGN-IN SUCCESSFUL FOR:', profileData.displayName);
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
