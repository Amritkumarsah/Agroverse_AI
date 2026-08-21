import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration object with environment variables & sensible defaults for demo environments
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAZ0RCP3QQmTQLeZuNcNUMo98A-R1ppLw",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "agrinexsus-1b0ff.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "agrinexsus-1b0ff",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "agrinexsus-1b0ff.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "484099478076",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:484099478076:web:5f3d7bb3258fd1ce6fa939"
};

// Initialize Firebase App singleton
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Export Firebase services
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export const db = getFirestore(app);

export default app;
