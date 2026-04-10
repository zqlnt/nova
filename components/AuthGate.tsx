'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Wraps role dashboards: waits for auth, then requires a signed-in user.
 * Unauthenticated users go to /login?next=<current path> (internal paths only).
 */
export function AuthGate({ children }: { children: ReactNode }) {
  const { user, loading, firebaseInitError } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading || firebaseInitError) return;
    if (user) return;
    const next = encodeURIComponent(pathname || '/');
    router.replace(`/login?next=${next}`);
  }, [loading, user, router, pathname, firebaseInitError]);

  if (firebaseInitError) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3 px-4">
        <p className="text-sm text-red-800 text-center max-w-md" role="alert">
          {firebaseInitError}
        </p>
        <p className="text-xs text-gray-500 text-center max-w-sm">
          Add Firebase keys to <code className="rounded bg-gray-100 px-1">.env.local</code> (see{' '}
          <code className="rounded bg-gray-100 px-1">.env.example</code>) and reload the page.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3 px-4">
        <div
          className="h-9 w-9 border-2 border-ios-blue border-t-transparent rounded-full animate-spin"
          aria-hidden
        />
        <p className="text-sm text-gray-600">Checking your session…</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center px-4">
        <p className="text-sm text-gray-500">Redirecting to sign in…</p>
      </div>
    );
  }

  return <>{children}</>;
}
