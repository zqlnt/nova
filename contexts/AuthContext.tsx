'use client';

import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import {
  User,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { auth, getFirebaseInitError, isFirebaseAuthAvailable } from '@/lib/firebase';

const isDev = process.env.NODE_ENV === 'development';

interface AuthContextType {
  user: User | null;
  /** True until first Firebase auth snapshot (signed in or not). False immediately if Firebase failed to initialize. */
  loading: boolean;
  /** Non-null when the Firebase web app could not be initialized (bad/missing config). */
  firebaseInitError: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (ctx === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const firebaseInitError = useMemo(() => getFirebaseInitError(), []);

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(() => {
    if (firebaseInitError || !isFirebaseAuthAvailable()) return false;
    return true;
  });

  useEffect(() => {
    if (firebaseInitError || !auth) return;
    void setPersistence(auth, browserLocalPersistence).catch((e) => {
      if (isDev) console.warn('[auth] setPersistence:', e);
    });
  }, [firebaseInitError]);

  useEffect(() => {
    // No auth instance: nothing to listen to; UI shows firebaseInitError or "auth unavailable".
    if (firebaseInitError || !auth) {
      setUser(null);
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(
      auth,
      (next) => {
        setUser(next);
        setLoading(false);
      },
      (err) => {
        if (isDev) console.error('[auth] onAuthStateChanged error:', err);
        setUser(null);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [firebaseInitError]);

  const signIn = async (email: string, password: string) => {
    if (!auth) throw new Error('Sign-in is unavailable. Firebase did not initialize. Check configuration and reload.');
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signUp = async (email: string, password: string) => {
    if (!auth) throw new Error('Sign-up is unavailable. Firebase did not initialize. Check configuration and reload.');
    await createUserWithEmailAndPassword(auth, email, password);
  };

  const signInWithGoogle = async () => {
    if (!auth) throw new Error('Google sign-in is unavailable. Firebase did not initialize. Check configuration and reload.');
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const signOut = async () => {
    if (!auth) return;
    await firebaseSignOut(auth);
  };

  const value: AuthContextType = {
    user,
    loading,
    firebaseInitError,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
