'use client';

import { ReactNode, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import ChatSidebar from './ChatSidebar';

function initialsFromDisplay(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

interface LayoutProps {
  children: ReactNode;
  role: 'student' | 'teacher' | 'org';
}

export default function Layout({ children, role }: LayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { signOut, user } = useAuth();
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
  
  const iconClass = 'w-5 h-5 flex-shrink-0';

  const studentLinks = [
    { href: '/student/dashboard', label: 'Dashboard', description: 'Your learning hub', icon: (
      <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
    )},
    { href: '/student/practice', label: 'Practice', description: 'Questions & quizzes', icon: (
      <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
    )},
    { href: '/student/learning-map', label: 'Learning Map', description: 'All objectives', icon: (
      <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
    )},
    { href: '/student/calendar', label: 'Calendar', description: 'Exams, revision, topics', icon: (
      <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
    )},
    { href: '/student/chat', label: 'Chat with Nova', description: 'Get help anytime', icon: (
      <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
    )},
    { href: '/student/settings', label: 'Settings', description: 'Preferences', icon: (
      <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
    )},
  ];
  
  const teacherLinks = [
    { href: '/teacher/dashboard', label: 'Dashboard', description: 'Triage & overview', icon: (
      <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
    )},
    { href: '/teacher/classes', label: 'Classes', description: 'Rosters & assignments', icon: (
      <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
    )},
    { href: '/teacher/students', label: 'Students', description: 'All learners', icon: (
      <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
    )},
    { href: '/teacher/calendar', label: 'Calendar', description: 'Lessons & planning', icon: (
      <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
    )},
    { href: '/teacher/insights', label: 'Insights', description: 'Trends & risks', icon: (
      <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
    )},
    { href: '/teacher/settings', label: 'Settings', description: 'Account settings', icon: (
      <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
    )},
  ];

  const orgLinks = [
    { href: '/org/dashboard', label: 'Overview', description: 'Operations & health', icon: (
      <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
    )},
    { href: '/org/families', label: 'Families', description: 'Households & UC', icon: (
      <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
    )},
    { href: '/org/tasks', label: 'Staff tasks', description: 'Reminders & ops', icon: (
      <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
    )},
    { href: '/org/students', label: 'Students', description: 'Records & status', icon: (
      <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
    )},
    { href: '/org/classes', label: 'Classes', description: 'Teachers & rosters', icon: (
      <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
    )},
    { href: '/org/attendance', label: 'Attendance', description: 'Sessions & risk', icon: (
      <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    )},
    { href: '/org/payments', label: 'Payments', description: 'Billing & funding', icon: (
      <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    )},
    { href: '/org/expenses', label: 'Expenses', description: 'Track spending', icon: (
      <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
    )},
    { href: '/org/flags', label: 'Flags & Concerns', description: 'Issues & follow-ups', icon: (
      <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" /></svg>
    )},
    { href: '/org/contacts', label: 'Contacts', description: 'Parents & guardians', icon: (
      <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
    )},
    { href: '/org/trips', label: 'Trips & Events', description: 'Extracurricular planning', icon: (
      <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0h.5a2.5 2.5 0 002.5-2.5V3.935M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    )},
    { href: '/org/calendar', label: 'Calendar', description: 'Terms, events, schedule', icon: (
      <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
    )},
    { href: '/org/reports', label: 'Reports', description: 'Exports & analytics', icon: (
      <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
    )},
    { href: '/org/settings', label: 'Settings', description: 'Organisation', icon: (
      <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
    )},
  ];
  
  const links = role === 'student' ? studentLinks : role === 'teacher' ? teacherLinks : orgLinks;
  const fallbackName =
    role === 'student' ? 'Student' : role === 'teacher' ? 'Teacher' : 'Organisation';
  const userName =
    user?.displayName?.trim() ||
    user?.email?.split('@')[0] ||
    fallbackName;
  const userInitials = initialsFromDisplay(userName);

  const modeLabel = role === 'student' ? 'Nova Student' : role === 'teacher' ? 'Nova Teacher' : 'Nova Org';
  const modeSymbol = role === 'student' ? '●' : role === 'teacher' ? '■' : '▲';
  
  return (
    <div className="flex h-screen bg-transparent min-w-[320px] overflow-hidden relative">
      {/* Pulsating, drifting colored orbs (behind UI) */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0" aria-hidden>
        <div className="absolute -top-32 -left-40 w-[30rem] h-[30rem] animate-nova-orb-1">
          <div className="w-full h-full rounded-full bg-sky-400/35 blur-[100px] animate-nova-glow" />
        </div>
        <div className="absolute top-[12%] -right-24 w-[26rem] h-[26rem] animate-nova-orb-2 [animation-delay:-4s]">
          <div className="w-full h-full rounded-full bg-fuchsia-400/28 blur-[95px] animate-nova-glow [animation-delay:-2s]" />
        </div>
        <div className="absolute top-[40%] left-[5%] w-[22rem] h-[22rem] animate-nova-orb-3 [animation-delay:-8s]">
          <div className="w-full h-full rounded-full bg-cyan-400/25 blur-[88px] animate-nova-glow [animation-delay:-5s]" />
        </div>
        <div className="absolute bottom-[-8%] left-[20%] w-[28rem] h-[24rem] animate-nova-orb-4 [animation-delay:-6s]">
          <div className="w-full h-full rounded-full bg-blue-500/22 blur-[100px] animate-nova-glow [animation-delay:-3s]" />
        </div>
        <div className="absolute bottom-[15%] right-[8%] w-[20rem] h-[20rem] animate-nova-orb-5 [animation-delay:-10s]">
          <div className="w-full h-full rounded-full bg-violet-400/22 blur-[90px] animate-nova-glow [animation-delay:-7s]" />
        </div>
      </div>
      {/* Subtle dot grid background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 opacity-[0.35]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #d1d5db 1px, transparent 0)', backgroundSize: '24px 24px' }} />

      {/* Mobile Overlay */}
      {!sidebarCollapsed && (
        <div 
          className="fixed inset-0 bg-black/30 z-30 lg:hidden"
          onClick={() => setSidebarCollapsed(true)}
        />
      )}

      {/* Left Sidebar - Light white with blue accents */}
      <aside
        className={`
        fixed lg:relative
        flex flex-col flex-shrink-0 z-40 lg:z-10 overflow-hidden
        transition-all duration-300 ease-in-out
        h-screen
        border-r border-gray-200/60
        ${sidebarCollapsed ? 'w-0 -translate-x-full lg:-translate-x-0 lg:w-0' : 'w-64 translate-x-0'}
      `}
        style={{
          background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 50%, #f1f5f9 100%)',
          boxShadow: '4px 0 24px -4px rgba(0, 0, 0, 0.06)',
        }}
      >
        {/* Light blue blurred orbs background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-20 -left-20 w-40 h-40 rounded-full bg-blue-200/25 blur-3xl" />
          <div className="absolute top-1/2 -right-16 w-32 h-32 rounded-full bg-sky-200/20 blur-3xl" />
          <div className="absolute bottom-20 -left-10 w-36 h-36 rounded-full bg-blue-100/30 blur-3xl" />
        </div>

        {/* Logo Section */}
        <div className={`p-5 border-b border-gray-200/60 relative flex items-center justify-between ${sidebarCollapsed ? 'opacity-0' : 'opacity-100'} transition-opacity`}>
          <div className="flex items-center gap-3 min-w-0">
            <Link href="/" className="flex items-center group whitespace-nowrap">
              <Image 
                src="https://i.imghippo.com/files/tyq3865Jxs.png" 
                alt="Nova" 
                width={120} 
                height={36}
                className="h-9 w-auto transition-transform group-hover:scale-105"
              />
            </Link>
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-100">
              <span className="text-blue-600 text-sm font-semibold" aria-hidden="true">{modeSymbol}</span>
              <span className="text-blue-700 text-sm font-semibold truncate">{modeLabel}</span>
            </div>
          </div>
          
          {/* Desktop Collapse Button */}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="hidden lg:block p-1.5 rounded-lg hover:bg-blue-50 transition-colors text-gray-500 hover:text-blue-600 flex-shrink-0"
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
        <div className={`p-4 border-b border-gray-200/60 relative ${sidebarCollapsed ? 'opacity-0' : 'opacity-100'} transition-opacity`}>
          <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50/70 transition-colors group whitespace-nowrap">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0 text-white font-bold text-sm shadow-sm">
              {userInitials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{userName}</p>
              <p className="text-xs text-gray-500 capitalize">{role}</p>
            </div>
            <button
              onClick={handleSignOut}
              className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-blue-100 transition-all text-gray-500 hover:text-blue-600"
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
            <h2 className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
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
                  className={`group flex items-start gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-50 border border-blue-100 shadow-sm'
                      : 'hover:bg-blue-50/60 border border-transparent'
                  }`}
                >
                  <span className={`mt-0.5 ${isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-blue-500'}`}>
                    {link.icon}
                  </span>
                  <div className="flex-1 min-w-0">
                    <span className={`font-medium text-sm block ${isActive ? 'text-blue-700' : 'text-gray-700 group-hover:text-blue-600'}`}>
                      {link.label}
                    </span>
                    <span className={`text-xs mt-0.5 block ${isActive ? 'text-blue-600/80' : 'text-gray-500 group-hover:text-gray-600'}`}>
                      {link.description}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </nav>
        
        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-200/60 relative">
          <div className="rounded-xl bg-blue-50/80 border border-blue-100/60 p-3">
            <p className="text-xs font-medium text-blue-800">Nova GCSE</p>
            <p className="text-xs text-blue-600/80 mt-0.5">AQA & Edexcel</p>
          </div>
        </div>
      </aside>
      
      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden relative z-10 w-full min-w-0">
        {/* Top Navigation Bar - Shows on mobile always, on desktop when sidebar collapsed */}
        <div className={`nova-frost-chrome border-b border-white/55 px-4 py-3 flex items-center justify-between flex-shrink-0 sticky top-0 z-30 ${sidebarCollapsed ? 'flex' : 'flex lg:hidden'}`}>
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <div className="flex items-center gap-2 min-w-0">
            <Link href="/" className="flex items-center">
              <Image 
                src="https://i.imghippo.com/files/tyq3865Jxs.png" 
                alt="Nova" 
                width={100} 
                height={30}
                className="h-8 w-auto"
              />
            </Link>
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-gray-50 border border-gray-200">
              <span className="text-gray-900 text-sm font-semibold" aria-hidden="true">{modeSymbol}</span>
              <span className="text-gray-900 text-sm font-semibold truncate max-w-[140px]">{modeLabel}</span>
            </div>
          </div>

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
          <footer className="nova-frost-chrome border-t border-white/55">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
              <div className="flex flex-col md:flex-row justify-between items-center gap-3 text-xs sm:text-sm text-gray-600">
                <div className="flex items-center gap-4 sm:gap-6 flex-wrap justify-center">
                  <Link href="/about" className="hover:text-ios-blue transition-colors">About</Link>
                  <Link href="/help" className="hover:text-ios-blue transition-colors">Help</Link>
                  <Link href="/privacy" className="hover:text-ios-blue transition-colors">Privacy</Link>
                  <Link href="/terms" className="hover:text-ios-blue transition-colors">Terms</Link>
                </div>
                <div className="text-gray-500 text-xs">
                  © 2026 Nova. All rights reserved.
                </div>
              </div>
            </div>
          </footer>
        </div>
      </main>
      
      {/* Right Chat Sidebar - Always a side panel (slides in from right) */}
      <aside className={`
        nova-frost-chrome border-l border-white/55 flex-col transition-all duration-300 shadow-[-8px_0_32px_-8px_rgba(15,23,42,0.1)]
        ${chatCollapsed ? 'hidden' : 'flex'}
        fixed top-0 right-0 bottom-0 w-80 max-w-[90vw] z-50 lg:relative lg:z-10 lg:flex-shrink-0 lg:shadow-none
      `}>
        <ChatSidebar collapsed={chatCollapsed} onToggle={() => setChatCollapsed(!chatCollapsed)} />
      </aside>
      
      {/* Chat Overlay - dims main content when chat is open on smaller screens */}
      {!chatCollapsed && (
        <div 
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
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

