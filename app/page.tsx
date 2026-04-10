'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { firebaseAuthMessage } from '@/lib/authErrors';
import { useState } from 'react';
import WelcomeAnimations from '@/components/WelcomeAnimations';

export default function Home() {
  const router = useRouter();
  const { signInWithGoogle, firebaseInitError, user, loading: authLoading } = useAuth();

  const portalHref = (path: string) => {
    if (authLoading) return path;
    if (!user) return `/login?next=${encodeURIComponent(path)}`;
    return path;
  };
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGoogleSignIn = async () => {
    if (firebaseInitError || loading) return;
    setLoading(true);
    setError('');
    try {
      await signInWithGoogle();
      router.push('/student/dashboard');
    } catch (err: unknown) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[home] Google sign-in:', err);
      }
      setError(firebaseAuthMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const portals = [
    {
      href: '/student/dashboard',
      label: 'Nova Student',
      desc: 'Learn, practice, track progress',
      tags: ['Dashboard', 'AI Chat', 'Practice'],
      color: 'from-blue-500/10 to-blue-600/5',
      border: 'border-blue-200',
      icon: '●',
    },
    {
      href: '/teacher/dashboard',
      label: 'Nova Teacher',
      desc: 'Classes, curriculum, Student Nova Agent',
      tags: ['Classes', 'Progress', 'Insights'],
      color: 'from-blue-500/10 to-blue-600/5',
      border: 'border-blue-200',
      icon: '■',
    },
    {
      href: '/org/dashboard',
      label: 'Nova Org',
      desc: 'Attendance, payments, student records',
      tags: ['Attendance', 'Payments', 'Records'],
      color: 'from-emerald-500/10 to-emerald-600/5',
      border: 'border-emerald-200',
      icon: '▲',
    },
  ];

  return (
    <div className="h-screen min-h-[568px] bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 min-w-[320px] overflow-hidden flex flex-col">
      {/* Grid lines overlay */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-[0.4]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(59, 130, 246, 0.08) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(59, 130, 246, 0.08) 1px, transparent 1px)
            `,
            backgroundSize: '48px 48px',
          }}
        />
      </div>

      {/* Animated squircles, orbs, math symbols - premium subtle motion */}
      <WelcomeAnimations />

      <div className="relative z-10 flex flex-1 min-h-0 flex-col lg:flex-row">
        {/* Left - Branding (50%) - centered content */}
        <div className="hidden lg:flex lg:w-1/2 nova-frost-sheet border-r border-white/50 flex-col p-6 xl:p-10 relative overflow-hidden shrink-0">
          {/* Subtle grid on left panel */}
          <div className="absolute inset-0 opacity-[0.3]" style={{ backgroundImage: 'linear-gradient(to right, rgba(59, 130, 246, 0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(59, 130, 246, 0.06) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
          <div className="flex-1 flex flex-col justify-center items-center relative z-10">
            <div className="space-y-6 w-full max-w-md text-left">
            <Link href="/" className="inline-block">
              <Image src="https://i.imghippo.com/files/tyq3865Jxs.png" alt="Nova" width={120} height={36} className="h-9 w-auto" />
            </Link>
            <div className="space-y-3">
              <h1 className="text-3xl xl:text-4xl font-bold text-gray-900 leading-tight tracking-tight">
                AI-Powered
                <br />
                Personalized
                <br />
                Learning
              </h1>
              <p className="text-gray-600 text-sm max-w-sm leading-relaxed">
                Nova adapts to each student&apos;s learning style with curriculum-aligned support.
              </p>
              <p className="text-gray-500 text-sm max-w-sm leading-relaxed">
                Built for GCSE students, teachers, and tuition centres. Track progress, identify gaps, and support every learner with AI that understands the curriculum.
              </p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {['●', '■', '▲', '◆', '◇', '✦', '◈', '◎'].map((sym, i) => {
                const colors = [
                  'bg-red-500/20 text-red-600',
                  'bg-amber-500/20 text-amber-600',
                  'bg-yellow-500/20 text-yellow-600',
                  'bg-emerald-500/20 text-emerald-600',
                  'bg-blue-500/20 text-blue-600',
                  'bg-violet-500/20 text-violet-600',
                  'bg-pink-500/20 text-pink-600',
                  'bg-indigo-500/20 text-indigo-600',
                ];
                return (
                  <span key={i} className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium ${colors[i % colors.length]}`}>
                    {sym}
                  </span>
                );
              })}
            </div>
            <div className="space-y-2">
              {['Intelligent tutoring', 'Curriculum progress', 'Personalized experience'].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-sm text-gray-600">
                  <span className="w-6 h-6 rounded-full bg-blue-500/15 flex items-center justify-center text-blue-600 flex-shrink-0">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </span>
                  {item}
                </div>
              ))}
            </div>
            <div className="pt-2 border-t border-gray-200/60">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">What&apos;s included</p>
              <div className="space-y-1.5">
                {['AQA & Pearson Edexcel aligned', 'Real-time mastery tracking', 'AI chat tutor support', 'Practice questions & diagnostics', 'Teacher & org dashboards'].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500/60 flex-shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
            </div>
          </div>
          <div className="relative z-10 flex items-center justify-center gap-3 pt-4 shrink-0">
            <span className="text-xs text-gray-400">© 2025 Nova</span>
            <span className="text-gray-300">·</span>
            <span className="flex gap-1.5 text-gray-400">
              {['◈', '✦', '◎'].map((s, i) => <span key={i} className="text-[10px] opacity-70">{s}</span>)}
            </span>
          </div>
        </div>

        {/* Right - Welcome & portal grid (50%) - left-aligned content */}
        <div className="flex-1 lg:w-1/2 min-h-0 flex flex-col justify-center items-start px-4 py-4 sm:px-6 sm:py-6 lg:px-10 lg:py-8 overflow-y-auto relative">
          {/* Subtle dotted pattern on right */}
          <div className="absolute inset-0 opacity-[0.25] pointer-events-none" style={{ backgroundImage: 'radial-gradient(rgba(59, 130, 246, 0.15) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
          <div className="w-full max-w-2xl space-y-4 relative z-10 py-2 text-left">
            <div className="lg:hidden shrink-0">
              <Link href="/">
                <Image src="https://i.imghippo.com/files/tyq3865Jxs.png" alt="Nova" width={100} height={30} className="h-8 w-auto" />
              </Link>
            </div>

            <div className="space-y-1.5 shrink-0">
              <div className="flex items-center justify-start gap-1.5 mb-1 flex-wrap">
                {['●', '■', '▲', '◆', '◇', '✦'].map((s, i) => {
                  const colors = [
                    'bg-red-500/20 text-red-600',
                    'bg-amber-500/20 text-amber-600',
                    'bg-yellow-500/20 text-yellow-600',
                    'bg-emerald-500/20 text-emerald-600',
                    'bg-blue-500/20 text-blue-600',
                    'bg-violet-500/20 text-violet-600',
                  ];
                  return (
                    <span key={i} className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-medium ${colors[i % colors.length]}`}>
                      {s}
                    </span>
                  );
                })}
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Welcome to Nova</h2>
              <p className="text-gray-500 text-sm">Choose your portal to get started</p>
              <div className="flex items-center justify-start gap-3 text-[11px] text-gray-400 flex-wrap">
                <span>◎ GCSE aligned</span>
                <span>◎ AI tutor</span>
                <span>◎ Real-time progress</span>
              </div>
            </div>

            {/* Portal cards - wide horizontal bars, shorter height */}
            <div className="flex flex-col gap-2 sm:gap-3 shrink-0 w-full max-w-2xl">
              {portals.map((p) => (
                <Link key={p.href} href={portalHref(p.href)} className="block">
                  <div className={`rounded-xl border-2 ${p.border} bg-white/58 backdrop-blur-xl backdrop-saturate-150 px-4 py-3 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.82),0_4px_24px_-8px_rgba(15,23,42,0.08)] hover:shadow-lg hover:shadow-blue-100/40 hover:border-blue-300/60 transition-all duration-300 group flex flex-wrap items-center gap-3 sm:gap-4 text-left`}>
                    <span className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/10 to-blue-600/5 flex items-center justify-center text-gray-700 font-semibold text-lg group-hover:from-blue-500/20 group-hover:to-blue-600/10 group-hover:text-blue-600 transition-colors flex-shrink-0">
                      {p.icon}
                    </span>
                    <div className="min-w-0 flex-1 text-left flex items-baseline gap-2 flex-wrap">
                      <span className="font-semibold text-gray-900 text-base sm:text-lg">{p.label}</span>
                      <span className="text-gray-400">·</span>
                      <span className="text-sm text-gray-500">{p.desc}</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 items-center flex-shrink-0">
                      {p.tags.map((tag) => (
                        <span key={tag} className="inline-flex px-2 py-0.5 rounded text-xs font-medium bg-gray-100/80 text-gray-600">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>

            {/* Auth */}
            <div className="space-y-2 pt-0 shrink-0">
              {firebaseInitError && (
                <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs" role="alert">
                  {firebaseInitError}
                </div>
              )}
              {error && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs">{error}</div>
              )}
              <button
                onClick={handleGoogleSignIn}
                disabled={loading || !!firebaseInitError}
                className="w-full py-2.5 sm:py-3 px-4 rounded-xl nova-frost-btn hover:bg-white/90 font-medium text-sm text-gray-700 flex items-center justify-center gap-2 disabled:opacity-50 transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                {loading ? 'Signing in...' : 'Continue with Google'}
              </button>
              <div className="grid grid-cols-2 gap-2">
                <Link href="/login">
                  <button className="w-full py-2.5 rounded-xl nova-frost-btn hover:bg-white/90 font-medium text-sm text-gray-700 transition-colors">Sign In</button>
                </Link>
                <Link href="/signup">
                  <button className="w-full py-2.5 rounded-xl text-white font-medium text-sm bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg shadow-blue-500/25 transition-all">Get Started</button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
