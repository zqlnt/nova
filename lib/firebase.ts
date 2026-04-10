import { initializeApp, getApps, FirebaseApp, type FirebaseOptions } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAnalytics, isSupported, Analytics } from 'firebase/analytics';

const isDev = process.env.NODE_ENV === 'development';
const isProd = process.env.NODE_ENV === 'production';

/**
 * Firebase Web SDK config — must use NEXT_PUBLIC_* so Next.js inlines values at build time.
 * Local: put values in `.env.local` (loaded automatically).
 * Render: add the same keys in Dashboard → Environment (available at build + runtime for NEXT_PUBLIC_*).
 * Server-only secrets (e.g. LLM keys) must NOT use NEXT_PUBLIC_ — use plain names in API routes only.
 */
function readEnv() {
  return {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? '',
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? '',
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? '',
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? '',
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? '',
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? '',
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID ?? '',
  };
}

/** Dev-only fallbacks when .env.local is missing (never used in production). */
const FALLBACK_CONFIG = {
  apiKey: 'AIzaSyAJSr7LsZEIU0wZ1KfsLXH-F5xSgvfebjg',
  authDomain: 'nova-f3764.firebaseapp.com',
  projectId: 'nova-f3764',
  storageBucket: 'nova-f3764.firebasestorage.app',
  messagingSenderId: '700426428836',
  appId: '1:700426428836:web:60f00c8c7ce6c4f611e131',
  measurementId: 'G-MDPB7BGQH7',
};

const PROD_REQUIRED: { key: keyof ReturnType<typeof readEnv>; envName: string }[] = [
  { key: 'apiKey', envName: 'NEXT_PUBLIC_FIREBASE_API_KEY' },
  { key: 'authDomain', envName: 'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN' },
  { key: 'projectId', envName: 'NEXT_PUBLIC_FIREBASE_PROJECT_ID' },
  { key: 'storageBucket', envName: 'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET' },
  { key: 'messagingSenderId', envName: 'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID' },
  { key: 'appId', envName: 'NEXT_PUBLIC_FIREBASE_APP_ID' },
];

function mergeWithFallback(env: ReturnType<typeof readEnv>): FirebaseOptions {
  return {
    apiKey: env.apiKey || FALLBACK_CONFIG.apiKey,
    authDomain: env.authDomain || FALLBACK_CONFIG.authDomain,
    projectId: env.projectId || FALLBACK_CONFIG.projectId,
    storageBucket: env.storageBucket || FALLBACK_CONFIG.storageBucket,
    messagingSenderId: env.messagingSenderId || FALLBACK_CONFIG.messagingSenderId,
    appId: env.appId || FALLBACK_CONFIG.appId,
    measurementId: env.measurementId || FALLBACK_CONFIG.measurementId,
  };
}

function buildConfig(): { config: FirebaseOptions | null; initError: string | null } {
  const env = readEnv();

  if (isProd) {
    const missing = PROD_REQUIRED.filter(({ key }) => !String(env[key] ?? '').trim()).map(({ envName }) => envName);
    if (missing.length > 0) {
      return {
        config: null,
        initError: `Firebase is not configured. Set these in Render (Environment): ${missing.join(', ')}. NEXT_PUBLIC_* vars must be present at build time.`,
      };
    }
    const measurementId = env.measurementId.trim();
    const prodConfig: FirebaseOptions = {
      apiKey: env.apiKey.trim(),
      authDomain: env.authDomain.trim(),
      projectId: env.projectId.trim(),
      storageBucket: env.storageBucket.trim(),
      messagingSenderId: env.messagingSenderId.trim(),
      appId: env.appId.trim(),
    };
    if (measurementId) prodConfig.measurementId = measurementId;
    return { config: prodConfig, initError: null };
  }

  const merged = mergeWithFallback(env);
  if (isDev && !env.apiKey) {
    console.warn(
      '[firebase] NEXT_PUBLIC_FIREBASE_* not set in .env.local — using dev fallbacks. Use .env.example as a template.'
    );
  }
  return { config: merged, initError: null };
}

let firebaseInitError: string | null = null;

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

try {
  const { config, initError } = buildConfig();
  if (initError || !config) {
    firebaseInitError = initError;
    if (isDev && initError) console.error('[firebase]', initError);
  } else if (!config.apiKey || !config.authDomain || !config.projectId || !config.appId) {
    firebaseInitError =
      'Firebase configuration is incomplete. Set NEXT_PUBLIC_FIREBASE_* in .env.local or your host (e.g. Render).';
    if (isDev) console.error('[firebase]', firebaseInitError);
  } else {
    app = getApps().length === 0 ? initializeApp(config) : (getApps()[0] as FirebaseApp);
    auth = getAuth(app);
    db = getFirestore(app);
    if (isDev) {
      console.info('[firebase] OK — project:', config.projectId);
    }
  }
} catch (e) {
  firebaseInitError =
    e instanceof Error ? e.message : 'Firebase failed to initialize. Check env vars and Firebase console.';
  if (isDev) {
    console.error('[firebase] initializeApp / getAuth failed:', e);
  }
  app = null;
  auth = null;
  db = null;
}

export { auth, db };

export function getFirebaseInitError(): string | null {
  return firebaseInitError;
}

export function isFirebaseAuthAvailable(): boolean {
  return auth !== null;
}

let analytics: Analytics | null = null;
if (typeof window !== 'undefined' && app) {
  isSupported()
    .then((yes) => {
      if (yes && app) {
        try {
          analytics = getAnalytics(app);
        } catch {
          // optional
        }
      }
    })
    .catch(() => {});
}

export { analytics };
export default app;
