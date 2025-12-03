import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getAnalytics, isSupported } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyAJSr7LsZEIU0wZ1KfsLXH-F5xSgvfebjg",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "nova-f3764.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "nova-f3764",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "nova-f3764.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "700426428836",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:700426428836:web:60f00c8c7ce6c4f611e131",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-MDPB7BGQH7"
};

// Initialize Firebase (only once)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Firebase services
export const auth = getAuth(app);

// Initialize Analytics (only in browser)
let analytics = null;
if (typeof window !== 'undefined') {
  isSupported().then(yes => {
    if (yes) {
      analytics = getAnalytics(app);
    }
  });
}

export { analytics };
export default app;

