'use client';

import { ReactNode, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { orgService } from '@/lib/orgService';
import { formatPence } from '@/lib/orgOperations';

interface OrgLayoutProps {
  children: ReactNode;
  /** Page title shown in topbar */
  title?: string;
  /** Subtitle / breadcrumb */
  subtitle?: string;
}

type NavItem = {
  href: string;
  label: string;
  badge?: string;
};

function pageMeta(pathname: string): { title: string; subtitle: string } {
  const map: Record<string, { title: string; subtitle: string }> = {
    '/org/dashboard': { title: 'Overview', subtitle: 'Control Centre' },
    '/org/families': { title: 'Families', subtitle: 'Households & UC' },
    '/org/tasks': { title: 'Staff tasks', subtitle: 'Operations' },
    '/org/students': { title: 'Students', subtitle: 'Records & status' },
    '/org/classes': { title: 'Classes', subtitle: 'Teachers & rosters' },
    '/org/attendance': { title: 'Attendance', subtitle: 'Sessions & risk' },
    '/org/payments': { title: 'Payments', subtitle: 'Finance' },
    '/org/expenses': { title: 'Expenses', subtitle: 'Finance' },
    '/org/flags': { title: 'Flags & concerns', subtitle: 'Operations' },
    '/org/contacts': { title: 'Contacts', subtitle: 'Parents & guardians' },
    '/org/trips': { title: 'Trips & events', subtitle: 'Planning' },
    '/org/calendar': { title: 'Calendar', subtitle: 'Schedule' },
    '/org/reports': { title: 'Reports', subtitle: 'Documents' },
    '/org/settings': { title: 'Settings', subtitle: 'Organisation' },
  };
  if (pathname.startsWith('/org/students/')) return { title: 'Student record', subtitle: 'Students' };
  if (pathname.startsWith('/org/families/')) return { title: 'Family', subtitle: 'Families' };
  return map[pathname] ?? { title: 'Nova Org', subtitle: 'Control Centre' };
}

export default function OrgLayout({ children, title, subtitle }: OrgLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useAuth();
  const [search, setSearch] = useState('');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const org = orgService.getOrganisation();
  const meta = pageMeta(pathname);
  const pageTitle = title ?? meta.title;
  const pageSubtitle = subtitle ?? meta.subtitle;

  const navBadges = useMemo(() => {
    const tasks = orgService.listStaffTasks().filter((t) => t.orgId === org.id && t.status === 'open');
    const records = orgService.listOrgStudentRecords();
    const outstanding = records.reduce((s, r) => s + (r.amountOwedPence ?? 0), 0);
    const attendance = orgService.listAttendance();
    const month = new Date();
    const m = month.getMonth();
    const y = month.getFullYear();
    const monthStart = `${y}-${String(m + 1).padStart(2, '0')}-01`;
    const lastD = new Date(y, m + 1, 0).getDate();
    const monthEnd = `${y}-${String(m + 1).padStart(2, '0')}-${String(lastD).padStart(2, '0')}`;
    const monthSessions = attendance.filter((a) => a.sessionDate >= monthStart && a.sessionDate <= monthEnd);
    const present = monthSessions.filter((a) => a.status === 'present' || a.status === 'late').length;
    const attPct = monthSessions.length ? Math.round((present / monthSessions.length) * 100) : 0;
    const flagged = records.filter((r) => r.flaggedIssues && r.flaggedIssues.length > 0).length;
    return {
      tasks: tasks.length > 0 ? String(tasks.length) : undefined,
      finance: outstanding > 0 ? formatPence(outstanding).replace('.00', '') : '£',
      attendance: `${attPct}%`,
      flags: flagged > 0 ? String(flagged) : undefined,
    };
  }, [org.id]);

  const navItems: NavItem[] = [
    { href: '/org/dashboard', label: 'Overview', badge: 'Live' },
    { href: '/org/tasks', label: 'Operations', badge: navBadges.tasks },
    { href: '/org/payments', label: 'Finance', badge: navBadges.finance },
    { href: '/org/attendance', label: 'Attendance', badge: navBadges.attendance },
    { href: '/org/students', label: 'Students', badge: String(orgService.listStudents().length) },
    { href: '/org/families', label: 'Families' },
    { href: '/org/classes', label: 'Classes' },
    { href: '/org/flags', label: 'Flags', badge: navBadges.flags },
    { href: '/org/contacts', label: 'Contacts' },
    { href: '/org/calendar', label: 'Calendar' },
    { href: '/org/trips', label: 'Trips' },
    { href: '/org/expenses', label: 'Expenses' },
    { href: '/org/reports', label: 'Reports' },
    { href: '/org/settings', label: 'Settings' },
  ];

  const filteredNav = search.trim()
    ? navItems.filter((n) => n.label.toLowerCase().includes(search.toLowerCase()))
    : navItems;

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/login');
    } catch (e) {
      console.error(e);
    }
  };

  const taskProgress = Math.min(
    100,
    Math.round(
      (orgService.listStaffTasks().filter((t) => t.status === 'done').length /
        Math.max(1, orgService.listStaffTasks().length)) *
        100
    )
  );

  const mobileTabs = [
    { href: '/org/dashboard', label: 'Overview' },
    { href: '/org/tasks', label: 'Ops' },
    { href: '/org/students', label: 'Add', action: true },
    { href: '/org/payments', label: 'Finance' },
    { href: '/org/attendance', label: 'Attend' },
  ];

  return (
    <div className="org-shell">
      <div className="w-full max-w-[1480px] mx-auto px-2.5 sm:px-4 py-3 sm:py-5 lg:grid lg:grid-cols-[286px_minmax(0,1fr)] lg:gap-[18px]">
        {/* Sidebar */}
        <aside className="org-surface hidden lg:flex flex-col sticky top-[22px] h-[calc(100vh-44px)] rounded-[34px] p-[18px] gap-[18px]">
          <div className="flex items-center gap-3 pb-4 border-b border-[var(--org-line)]">
            <div className="w-11 h-11 rounded-[14px] bg-white grid place-items-center shadow-[inset_0_0_0_1px_rgba(0,0,0,0.06),0_8px_18px_rgba(0,0,0,0.04)] overflow-hidden shrink-0">
              <Image
                src="https://i.imghippo.com/files/tyq3865Jxs.png"
                alt="Nova"
                width={29}
                height={29}
                className="w-[29px] h-[29px] object-contain"
              />
            </div>
            <div>
              <div className="text-[15px] font-extrabold tracking-tight">Nova Org</div>
              <div className="text-xs text-[var(--org-muted)] mt-0.5">Control Centre</div>
            </div>
          </div>

          <nav className="grid gap-2 overflow-y-auto custom-scrollbar flex-1 min-h-0" aria-label="Org navigation">
            {filteredNav.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between gap-3 px-3 py-3 rounded-[18px] text-sm font-bold transition-colors ${
                    active
                      ? 'bg-white text-[var(--org-ink)] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.04)]'
                      : 'text-[#5f6067] hover:bg-white/75'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <span
                      className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                        active ? 'bg-[var(--org-royal)] shadow-[0_0_0_4px_var(--org-royal-soft)]' : 'bg-[#cfd2da]'
                      }`}
                    />
                    {item.label}
                  </span>
                  {item.badge && (
                    <span className="text-[11px] font-extrabold text-[var(--org-muted)] bg-black/[0.04] px-2 py-1 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto p-[18px] rounded-[28px] bg-[var(--org-lilac)] border border-black/[0.03]">
            <h3 className="text-lg font-bold tracking-tight m-0 mb-2">{org.name}</h3>
            <p className="text-[13px] leading-snug text-[#62656d] m-0 mb-3.5">
              {org.location} — weekly ops at {taskProgress}% complete.
            </p>
            <div className="h-[9px] rounded-full bg-white/84 overflow-hidden">
              <span
                className="block h-full rounded-full bg-[var(--org-green-strong)] shadow-[0_0_12px_var(--org-green-glow)]"
                style={{ width: `${taskProgress}%` }}
              />
            </div>
          </div>
        </aside>

        {/* Main column */}
        <main className="min-w-0 pb-24 lg:pb-0">
          <header className="org-surface sticky top-2 lg:top-[22px] z-20 min-h-[76px] rounded-[34px] flex flex-wrap items-center justify-between gap-3 px-4 sm:px-5 py-3">
            <div className="flex flex-col gap-0.5 min-w-0">
              <strong className="text-[15px] truncate">{pageTitle}</strong>
              <span className="text-xs text-[var(--org-muted)] truncate">{pageSubtitle}</span>
            </div>

            <label className="flex-1 max-w-[520px] hidden sm:flex items-center gap-2.5 bg-white/94 border border-black/[0.05] rounded-full px-4 py-2.5 text-[var(--org-muted)] min-w-[140px]">
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search navigation…"
                className="w-full border-0 outline-none bg-transparent text-sm text-[var(--org-ink)] font-inherit"
              />
            </label>

            <div className="flex items-center gap-2 shrink-0">
              <span className="hidden md:inline-flex h-[42px] items-center px-4 rounded-full border border-black/[0.06] bg-white text-[13px] font-bold shadow-[0_6px_18px_rgba(0,0,0,0.03)]">
                Private workspace
              </span>
              <Link
                href="/org/tasks"
                className="w-[42px] h-[42px] rounded-full border border-black/[0.06] bg-white grid place-items-center text-[var(--org-royal)] shadow-[0_6px_18px_rgba(0,0,0,0.03)]"
                title="Tasks"
              >
                ●
              </Link>
              <Link
                href="/org/students"
                className="text-[13px] font-bold text-[var(--org-royal)] underline underline-offset-[0.16em] px-1"
              >
                New record
              </Link>
              <button
                type="button"
                onClick={handleSignOut}
                className="lg:hidden w-[42px] h-[42px] rounded-full border border-black/[0.06] bg-white text-xs font-bold"
                aria-label="Sign out"
              >
                ↪
              </button>
            </div>
          </header>

          <div className="pt-[18px]">{children}</div>
        </main>
      </div>

      {/* Mobile nav */}
      <nav
        className="lg:hidden fixed left-1/2 -translate-x-1/2 bottom-3.5 z-[100] w-[min(430px,calc(100%-28px))] min-h-[78px] grid grid-cols-5 items-center gap-0.5 px-2.5 py-2 rounded-full org-surface backdrop-blur-2xl saturate-[1.7] shadow-[0_18px_48px_rgba(0,0,0,0.14)]"
        aria-label="Mobile navigation"
      >
        {mobileTabs.map((tab) => {
          const active = pathname === tab.href;
          if (tab.action) {
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className="w-[62px] h-[62px] justify-self-center rounded-full bg-[var(--org-royal)] text-white grid place-items-center shadow-[0_14px_28px_rgba(0,122,255,0.28)]"
                aria-label="Students"
              >
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </Link>
            );
          }
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`rounded-full min-h-[58px] py-1.5 flex flex-col items-center justify-center gap-1 text-[10px] font-extrabold ${
                active
                  ? 'bg-white/88 text-[var(--org-royal)] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.04)]'
                  : 'text-[#72747c]'
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-current opacity-20" aria-hidden />
              {tab.label}
            </Link>
          );
        })}
      </nav>

      {/* Mobile sidebar drawer trigger */}
      <button
        type="button"
        onClick={() => setMobileNavOpen(!mobileNavOpen)}
        className="lg:hidden fixed top-4 left-4 z-30 w-10 h-10 rounded-full org-surface grid place-items-center"
        aria-label="Open menu"
      >
        ☰
      </button>

      {mobileNavOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 bg-black/30 z-40"
            onClick={() => setMobileNavOpen(false)}
          />
          <aside className="lg:hidden fixed left-3 right-3 top-16 z-50 org-surface rounded-[28px] p-4 max-h-[70vh] overflow-y-auto">
            <nav className="grid gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileNavOpen(false)}
                  className="flex items-center justify-between px-3 py-3 rounded-2xl font-bold text-sm hover:bg-white/80"
                >
                  {item.label}
                  {item.badge && <span className="text-xs text-[var(--org-muted)]">{item.badge}</span>}
                </Link>
              ))}
            </nav>
          </aside>
        </>
      )}
    </div>
  );
}
