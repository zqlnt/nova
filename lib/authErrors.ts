/** Map Firebase Auth error codes to short, actionable messages. */

function extractCode(err: unknown): string {
  if (!err || typeof err !== 'object') return '';
  const o = err as { code?: unknown; message?: unknown };
  if (typeof o.code === 'string' && o.code.length > 0) return o.code;
  if (typeof o.message === 'string') {
    const m = o.message.match(/\(auth\/[a-z0-9_-]+\)/i);
    if (m) return m[0].slice(1, -1);
    const m2 = o.message.match(/\bauth\/[a-z0-9_-]+\b/i);
    if (m2) return m2[0];
  }
  return '';
}

function extractMessage(err: unknown): string {
  if (!err || typeof err !== 'object') return '';
  const m = (err as { message?: unknown }).message;
  return typeof m === 'string' ? m : '';
}

export function firebaseAuthMessage(err: unknown): string {
  if (typeof err === 'string' && err.trim()) return err;

  const code = extractCode(err);
  const rawMessage = extractMessage(err);

  const map: Record<string, string> = {
    'auth/invalid-email': 'Enter a valid email address.',
    'auth/user-disabled': 'This account has been disabled. Contact your organisation.',
    'auth/user-not-found': 'No account found for that email. Check the address or sign up.',
    'auth/wrong-password': 'Incorrect password. Try again or reset your password.',
    'auth/invalid-credential': 'Email or password is incorrect.',
    'auth/invalid-login-credentials': 'Email or password is incorrect.',
    'auth/too-many-requests': 'Too many attempts. Wait a few minutes and try again.',
    'auth/email-already-in-use': 'That email is already registered. Sign in instead.',
    'auth/weak-password': 'Password should be at least 6 characters.',
    'auth/popup-closed-by-user': 'Sign-in was cancelled. Try again when ready.',
    'auth/network-request-failed': 'Network error. Check your connection and try again.',
    'auth/operation-not-allowed':
      'Email/password or Google sign-in is not enabled for this app. In Firebase Console → Authentication → Sign-in method, enable Email/Password and Google.',
    'auth/unauthorized-domain':
      'This site’s domain is not allowed for sign-in. In Firebase Console → Authentication → Settings → Authorized domains, add your site URL (e.g. your Render or Vercel domain and localhost).',
    'auth/invalid-api-key':
      'Invalid Firebase API key. Check NEXT_PUBLIC_FIREBASE_* in .env.local and that the same values are set on your host at build time.',
    'auth/account-exists-with-different-credential':
      'An account already exists with this email using a different sign-in method. Use the original method or link accounts in Firebase.',
    'auth/web-storage-unsupported':
      'This browser blocks storage needed for sign-in. Try another browser or disable strict tracking prevention for this site.',
    'auth/internal-error': 'Firebase returned an internal error. Check Firebase project status, API key, and authorized domains.',
    'auth/configuration-not-found': 'Firebase configuration is missing or wrong. Verify NEXT_PUBLIC_FIREBASE_* environment variables.',
    'auth/missing-password': 'Enter your password.',
    'auth/invalid-app-credential': 'The app credential is invalid. Check Firebase Web app config and API key restrictions in Google Cloud.',
    'auth/cancelled-popup-request': 'Another sign-in window is already open. Close it and try again.',
  };

  if (code && map[code]) return map[code];

  if (rawMessage && rawMessage.length > 0 && rawMessage.length < 280) {
    if (rawMessage.startsWith('Firebase:') || rawMessage.includes('auth/')) {
      return `${rawMessage} If this persists, check Firebase Console → Authentication (sign-in methods and authorized domains).`;
    }
    return rawMessage;
  }

  if (code) {
    return `Sign-in failed (${code}). Check Firebase Authentication settings and your environment variables.`;
  }

  return 'Something went wrong. Please try again.';
}
