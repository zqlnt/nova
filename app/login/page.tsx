'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/Button';
import Card from '@/components/Card';
import { firebaseAuthMessage } from '@/lib/authErrors';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signIn, signInWithGoogle, user, loading: authLoading } = useAuth();

  const nextPath = searchParams.get('next') || '/student/dashboard';

  useEffect(() => {
    if (authLoading || !user) return;
    router.replace(nextPath.startsWith('/') ? nextPath : '/student/dashboard');
  }, [authLoading, user, router, nextPath]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signIn(email, password);
      router.replace(nextPath.startsWith('/') ? nextPath : '/student/dashboard');
    } catch (err: unknown) {
      setError(firebaseAuthMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);

    try {
      await signInWithGoogle();
      router.replace(nextPath.startsWith('/') ? nextPath : '/student/dashboard');
    } catch (err: unknown) {
      setError(firebaseAuthMessage(err));
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="h-9 w-9 border-2 border-ios-blue border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gray-50 flex items-center justify-center p-4 safe-area-pb">
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-20 left-10 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-float" />
        <div className="absolute top-40 right-20 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-float-delayed" />
        <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <Image
              src="https://i.imghippo.com/files/tyq3865Jxs.png"
              alt="Nova"
              width={150}
              height={45}
              className="h-12 w-auto mx-auto"
            />
          </Link>
          <p className="text-gray-600 mt-2">E-Learning Platform</p>
        </div>

        <Card className="border border-white/45">
          <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">Welcome Back</h1>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="login-email">
                Email
              </label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full bg-gray-50 border border-white/45 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-ios-blue transition-all"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="login-password">
                Password
              </label>
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="w-full bg-gray-50 border border-white/45 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-ios-blue transition-all"
                placeholder="••••••••"
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign In'}
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/35" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 py-0.5 rounded-md bg-white/72 backdrop-blur-md text-gray-500">Or continue with</span>
            </div>
          </div>

          <Button variant="secondary" onClick={handleGoogleSignIn} disabled={loading} className="w-full">
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" aria-hidden>
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Sign in with Google
          </Button>

          <p className="text-center text-sm text-gray-600 mt-6">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-ios-blue font-medium hover:underline">
              Sign up
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="h-9 w-9 border-2 border-ios-blue border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
