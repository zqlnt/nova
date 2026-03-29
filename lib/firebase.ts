import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAnalytics, isSupported, Analytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyAJSr7LsZEIU0wZ1KfsLXH-F5xSgvfebjg",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "nova-f3764.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "nova-f3764",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "nova-f3764.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "700426428836",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:700426428836:web:60f00c8c7ce6c4f611e131",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-MDPB7BGQH7"
};

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

try {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0] as FirebaseApp;
  auth = getAuth(app);
  db = getFirestore(app);
} catch (e) {
  console.warn('Firebase init failed, auth disabled:', e);
}

export { auth, db };

// Initialize Analytics (only in browser)
let analytics: Analytics | null = null;
if (typeof window !== 'undefined' && app) {
  isSupported().then(yes => {
    if (yes && app) {
      try {
        analytics = getAnalytics(app);
      } catch {
        // Ignore analytics errors
      }
    }
  }).catch(() => {});
}

export { analytics };
export default app;

