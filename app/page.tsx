'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';

export default function Home() {
  const router = useRouter();
  const { signInWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    try {
      await signInWithGoogle();
      router.push('/student/dashboard');
    } catch (error: any) {
      console.error('Error signing in with Google:', error);
      setError(error.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="h-screen flex overflow-hidden bg-gray-50 min-w-[320px]">
      {/* Glowing orbs background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-20 left-10 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-float"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-float-delayed"></div>
        <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float"></div>
      </div>

      {/* Left Section - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-white border-r border-gray-200 flex-col justify-between p-12 relative z-10">
        <div>
          <Link href="/" className="inline-block mb-12">
            <Image 
              src="https://i.imghippo.com/files/tyq3865Jxs.png" 
              alt="Nova Logo" 
              width={180} 
              height={54}
              className="h-14 w-auto"
            />
          </Link>
          
          <h1 className="text-5xl font-bold mb-6 text-gray-900 leading-tight">
            AI-Powered<br />
            Personalized<br />
            Learning
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Nova adapts to each student's unique learning style, providing personalized guidance and support every step of the way.
          </p>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: '#007AFF' }}>
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Intelligent Tutoring</h3>
                <p className="text-sm text-gray-600">Get instant help from Nova, your AI learning companion</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: '#007AFF' }}>
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Track Progress</h3>
                <p className="text-sm text-gray-600">Monitor learning outcomes and identify areas for improvement</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: '#007AFF' }}>
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Personalized Experience</h3>
                <p className="text-sm text-gray-600">Tailored content and pacing for each learner</p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-sm text-gray-500">
          © 2025 Nova. All rights reserved.
        </div>
      </div>

      {/* Right Section - Portal Selection */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8 lg:p-12 relative z-10 min-w-0 overflow-y-auto">
        <div className="w-full max-w-lg">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <Link href="/" className="inline-block">
              <Image 
                src="https://i.imghippo.com/files/tyq3865Jxs.png" 
                alt="Nova Logo" 
                width={150} 
                height={45}
                className="h-12 w-auto"
              />
            </Link>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Nova</h2>
            <p className="text-gray-600">Choose your portal to get started</p>
          </div>

          <div className="flex flex-col gap-6">
            <Link href="/student/dashboard" className="block">
              <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:border-ios-blue hover:shadow-lg transition-all duration-300 cursor-pointer group">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-1 group-hover:text-ios-blue transition-colors">
                      Student Portal
                    </h3>
                    <p className="text-gray-600 text-sm mb-3">
                      Access your personalized learning dashboard, chat with Nova, and track your progress
                    </p>
                  </div>
                  <svg className="w-6 h-6 text-gray-400 group-hover:text-ios-blue group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                    Dashboard
                  </span>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                    AI Chat
                  </span>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                    Progress Tracking
                  </span>
                </div>
              </div>
            </Link>

            <Link href="/teacher/dashboard" className="block">
              <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:border-ios-blue hover:shadow-lg transition-all duration-300 cursor-pointer group">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-1 group-hover:text-ios-blue transition-colors">
                      Teacher Portal
                    </h3>
                    <p className="text-gray-600 text-sm mb-3">
                      Manage your classes, monitor student progress, and get AI-powered insights
                    </p>
                  </div>
                  <svg className="w-6 h-6 text-gray-400 group-hover:text-ios-blue group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                    Class Management
                  </span>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                    Student Analytics
                  </span>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                    AI Insights
                  </span>
                </div>
              </div>
            </Link>
          </div>

          <div className="mt-10">
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-gray-50 text-gray-500">Quick Access</span>
              </div>
            </div>

            <div className="space-y-3">
              {error && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                  {error}
                </div>
              )}
              
              <button
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full bg-white border border-gray-300 rounded-xl px-6 py-3 hover:bg-gray-50 hover:border-gray-400 transition-all font-medium text-sm text-gray-700 flex items-center justify-center gap-3 disabled:opacity-50"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                {loading ? 'Signing in...' : 'Continue with Google'}
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-3 bg-gray-50 text-gray-400">or</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Link href="/login" className="block">
                  <button className="w-full px-6 py-3 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all font-medium text-sm">
                    Sign In
                  </button>
                </Link>
                <Link href="/signup" className="block">
                  <button className="w-full px-6 py-3 rounded-xl text-white hover:shadow-lg transition-all font-medium text-sm" style={{ backgroundColor: '#007AFF' }}>
                    Get Started
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

