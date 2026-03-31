/** Map Firebase Auth error codes to short, actionable messages. */
export function firebaseAuthMessage(err: unknown): string {
  const code =
    err && typeof err === 'object' && 'code' in err
      ? String((err as { code?: string }).code)
      : '';
  const fallback = err instanceof Error ? err.message : 'Something went wrong. Please try again.';
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
    'auth/operation-not-allowed': 'This sign-in method is not enabled. Contact support.',
  };
  return map[code] ?? fallback;
}
