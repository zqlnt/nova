'use client';

import { ReactNode, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import ChatSidebar from './ChatSidebar';

interface LayoutProps {
  children: ReactNode;
  role: 'student' | 'teacher';
}

export default function Layout({ children, role }: LayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useAuth();
  const [chatCollapsed, setChatCollapsed] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
  
  const studentLinks = [
    { href: '/student/dashboard', label: 'Dashboard', description: 'View your progress' },
    { href: '/student/chat', label: 'Chat with Nova', description: 'Ask questions' },
    { href: '/student/settings', label: 'Settings', description: 'Manage preferences' },
  ];
  
  const teacherLinks = [
    { href: '/teacher/dashboard', label: 'Dashboard', description: 'Overview & classes' },
    { href: '/teacher/settings', label: 'Settings', description: 'Account settings' },
  ];
  
  const links = role === 'student' ? studentLinks : teacherLinks;
  const userName = role === 'student' ? 'Alex Johnson' : 'Prof. Smith';
  const userInitials = role === 'student' ? 'AJ' : 'PS';
  
  return (
    <div className="flex h-screen bg-gray-50 min-w-[320px] overflow-hidden">
      {/* Glowing orbs background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-20 left-10 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-float"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-float-delayed"></div>
        <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float"></div>
      </div>

      {/* Mobile Overlay */}
      {!sidebarCollapsed && (
        <div 
          className="fixed inset-0 bg-black/30 z-30 lg:hidden"
          onClick={() => setSidebarCollapsed(true)}
        />
      )}

      {/* Left Sidebar */}
      <aside className={`
        fixed lg:relative
        bg-white border-r border-gray-200 flex flex-col flex-shrink-0 z-40 lg:z-10 overflow-hidden
        transition-all duration-300 ease-in-out
        h-screen
        ${sidebarCollapsed ? 'w-0 -translate-x-full lg:-translate-x-0 lg:w-0' : 'w-64 translate-x-0'}
      `}>
        {/* Decorative Background Pattern */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
          <div className="absolute top-0 right-0 w-32 h-32 bg-ios-blue rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-0 w-24 h-24 bg-ios-blue rounded-full blur-3xl"></div>
        </div>
        
        {/* Logo Section */}
        <div className={`p-6 border-b border-gray-200 relative flex items-center justify-between ${sidebarCollapsed ? 'opacity-0' : 'opacity-100'} transition-opacity`}>
          <Link href="/" className="flex items-center group whitespace-nowrap">
            <Image 
              src="https://i.imghippo.com/files/tyq3865Jxs.png" 
              alt="Nova" 
              width={120} 
              height={36}
              className="h-9 w-auto transition-transform group-hover:scale-105"
            />
          </Link>
          
          {/* Desktop Collapse Button */}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="hidden lg:block p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-600 flex-shrink-0"
            aria-label="Toggle sidebar"
          >
            <svg 
              className="w-5 h-5 transition-transform"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>
        </div>

        {/* User Profile */}
        <div className={`p-4 border-b border-gray-200 relative ${sidebarCollapsed ? 'opacity-0' : 'opacity-100'} transition-opacity`}>
          <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group whitespace-nowrap">
            <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center flex-shrink-0 shadow-sm p-1.5">
              <Image 
                src="https://i.imghippo.com/files/tyq3865Jxs.png" 
                alt="Nova" 
                width={32} 
                height={32}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{userName}</p>
              <p className="text-xs text-gray-500 capitalize">{role}</p>
            </div>
            <button
              onClick={handleSignOut}
              className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-gray-100 transition-all text-gray-600"
              title="Sign out"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 relative custom-scrollbar">
          <div className="mb-3">
            <h2 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Menu
            </h2>
          </div>
          <div className="space-y-1">
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`group flex flex-col px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-ios-blue/10 border border-ios-blue/20'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <span className={`font-medium text-sm ${isActive ? 'text-ios-blue' : 'text-gray-700 group-hover:text-gray-900'}`}>
                    {link.label}
                  </span>
                  <span className={`text-xs mt-0.5 ${isActive ? 'text-ios-blue/70' : 'text-gray-500 group-hover:text-gray-600'}`}>
                    {link.description}
                  </span>
                </Link>
              );
            })}
          </div>
        </nav>
        
        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-200 relative">
          <div className="flex flex-col items-start gap-3 py-2 px-3">
            <Link href="/" className="group">
              <Image 
                src="https://i.imghippo.com/files/tyq3865Jxs.png" 
                alt="Nova" 
                width={100} 
                height={30}
                className="h-7 w-auto opacity-40 group-hover:opacity-70 transition-opacity"
              />
            </Link>
            <p className="text-xs text-gray-400">Version 1.0.0</p>
          </div>
        </div>
      </aside>
      
      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden relative z-10 w-full min-w-0">
        {/* Top Navigation Bar - Shows on mobile always, on desktop when sidebar collapsed */}
        <div className={`bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between flex-shrink-0 sticky top-0 z-30 ${sidebarCollapsed ? 'flex' : 'flex lg:hidden'}`}>
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <Link href="/" className="flex items-center">
            <Image 
              src="https://i.imghippo.com/files/tyq3865Jxs.png" 
              alt="Nova" 
              width={100} 
              height={30}
              className="h-8 w-auto"
            />
          </Link>

          <button
            onClick={() => setChatCollapsed(!chatCollapsed)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Toggle chat"
          >
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </button>
        </div>

        {/* Subtle Grid Pattern Overlay */}
        <div className="absolute inset-0 opacity-[0.015] pointer-events-none" 
             style={{
               backgroundImage: `radial-gradient(circle at 1px 1px, rgb(0, 122, 255) 1px, transparent 0)`,
               backgroundSize: '40px 40px'
             }}>
        </div>

        
        {/* Content */}
        <div className="flex-1 overflow-y-auto relative custom-scrollbar">
          <div className="px-4 sm:px-6 lg:px-8 pb-4 sm:pb-6 lg:pb-8 pt-6 lg:pt-8 min-w-0">
            <div className="max-w-7xl mx-auto min-w-0">
              {children}
            </div>
          </div>
          
          {/* Footer */}
          <footer className="border-t border-gray-200 bg-white/80 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
              <div className="flex flex-col md:flex-row justify-between items-center gap-3 text-xs sm:text-sm text-gray-600">
                <div className="flex items-center gap-4 sm:gap-6 flex-wrap justify-center">
                  <Link href="/about" className="hover:text-ios-blue transition-colors">About</Link>
                  <Link href="/help" className="hover:text-ios-blue transition-colors">Help</Link>
                  <Link href="/privacy" className="hover:text-ios-blue transition-colors">Privacy</Link>
                  <Link href="/terms" className="hover:text-ios-blue transition-colors">Terms</Link>
                </div>
                <div className="text-gray-500 text-xs">
                  © 2025 Nova. All rights reserved.
                </div>
              </div>
            </div>
          </footer>
        </div>
      </main>
      
      {/* Right Chat Sidebar - Full screen on mobile/tablet, side panel on desktop */}
      <aside className={`
        bg-white border-l border-gray-200 flex-col transition-all duration-300
        ${chatCollapsed ? 'hidden' : 'flex'}
        fixed inset-0 z-50 xl:relative xl:inset-auto xl:z-10 xl:w-80 xl:flex-shrink-0
      `}>
        <ChatSidebar collapsed={chatCollapsed} onToggle={() => setChatCollapsed(!chatCollapsed)} />
      </aside>
      
      {/* Chat Overlay for Mobile/Tablet */}
      {!chatCollapsed && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 xl:hidden"
          onClick={() => setChatCollapsed(true)}
        />
      )}

      {/* Floating Chat Button (when chat is collapsed AND sidebar is open on desktop) */}
      {chatCollapsed && !sidebarCollapsed && (
        <button
          onClick={() => setChatCollapsed(false)}
          className="hidden lg:flex fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-lg hover:shadow-xl transition-all"
          style={{ backgroundColor: '#007AFF' }}
          aria-label="Open chat"
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </button>
      )}
    </div>
  );
}

