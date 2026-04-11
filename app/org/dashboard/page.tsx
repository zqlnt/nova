'use client';

import Link from 'next/link';
import Layout from '@/components/Layout';
import Card from '@/components/Card';
import { orgService, useOrgSync } from '@/lib/orgService';
import {
  computeDashboardStats,
  enrichStudentsWithOrgData,
  formatPence,
  FLAG_LABELS,
  buildRevenueWeeksInMonth,
  buildAttendanceTrendWeeks,
  buildWeekdayAttendanceBars,
} from '@/lib/orgOperations';
import {
  SoftDonut,
  SoftBarChart,
  PaidVsOwedDonut,
  FundingDonut,
  AttendanceByStudentChart,
  PaymentsGroupedBarChart,
  IncomeBreakdownDonut,
  ClassDistributionDonut,
  StudentStatusDonut,
  RevenueOverTimeChart,
  TopOwedBarChart,
  AttendanceTrendLineChart,
} from '@/components/NovaCharts';
import MathSymbolAnimation from '@/components/MathSymbolAnimation';
import MiniCalendar from '@/components/MiniCalendar';
import TaskWidget from '@/components/TaskWidget';
import { buildOrgCalendarEvents } from '@/lib/orgCalendarEvents';
import { seedOrgCalendarEvents } from '@/lib/calendarSeed';

export default function OrgDashboard() {
  useOrgSync();
  const org = orgService.getOrganisation();
  const students = orgService.listStudents();
  const records = orgService.listOrgStudentRecords();
  const classes = orgService.listClasses();
  const teachers = orgService.listTeachers();
  const enrollments = orgService.listEnrollments();
  const attendance = orgService.listAttendance();
  const payments = orgService.listPayments();
  const invoices = orgService.listInvoices();
  const notes = orgService.listNotes();
  const families = orgService.listFamilies();
  const staffTasks = orgService.listStaffTasks();

  const stats = computeDashboardStats(students, records, classes, attendance, payments, invoices, notes);
  const enrichedStudents = enrichStudentsWithOrgData(students, records, enrollments, classes, teachers, attendance);

  const flaggedStudents = enrichedStudents.filter((s) => s.record?.flaggedIssues && s.record.flaggedIssues.length > 0);
  const overdueInvoices = invoices.filter((i) => i.status === 'overdue');
  const recentPayments = payments.filter((p) => p.paidAt).slice(0, 5).reverse();
  const recentNotes = notes.slice(0, 5).reverse();

  const liveCal = buildOrgCalendarEvents(
    org.id,
    attendance,
    invoices,
    payments,
    students.map((s) => ({ id: s.id, name: s.name })),
    families,
    staffTasks
  );
  const staticCal = seedOrgCalendarEvents.filter((e) => e.orgId === org.id);
  const dashboardCalendarEvents = [...liveCal, ...staticCal].sort((a, b) =>
    a.startDate.localeCompare(b.startDate)
  );
  const miniCalendarDots = dashboardCalendarEvents.map((e) => ({ startDate: e.startDate, title: e.title }));

  const openStaffTasks = staffTasks.filter((t) => t.orgId === org.id && t.status === 'open');
  const taskWidgetItems = [
    ...openStaffTasks.slice(0, 4).map((t) => ({
      id: `st_${t.id}`,
      title: t.title,
      due: t.dueDate?.slice(5) ?? '—',
      href: '/org/tasks' as const,
    })),
    ...overdueInvoices.slice(0, 2).map((i) => ({
      id: i.id,
      title: `Chase: ${students.find((s) => s.id === i.studentId)?.name ?? 'payment'}`,
      due: i.dueDate?.slice(5),
      href: '/org/payments' as const,
    })),
    ...flaggedStudents.slice(0, 2).map((s) => ({
      id: s.id,
      title: `Follow up: ${s.name}`,
      href: `/org/students/${s.id}` as const,
    })),
  ];

  const monthNow = new Date();
  const m = monthNow.getMonth();
  const y = monthNow.getFullYear();
  const monthStart = `${y}-${String(m + 1).padStart(2, '0')}-01`;
  const lastD = new Date(y, m + 1, 0).getDate();
  const monthEnd = `${y}-${String(m + 1).padStart(2, '0')}-${String(lastD).padStart(2, '0')}`;

  const attendanceThisMonth = attendance.filter(
    (a) => a.sessionDate >= monthStart && a.sessionDate <= monthEnd && (a.status === 'present' || a.status === 'late')
  );
  const sessionsByStudent = new Map<string, number>();
  attendanceThisMonth.forEach((a) => {
    sessionsByStudent.set(a.studentId, (sessionsByStudent.get(a.studentId) ?? 0) + 1);
  });
  const attendanceByStudentData = enrichedStudents
    .map((s) => ({ name: s.name, sessions: sessionsByStudent.get(s.id) ?? 0 }))
    .filter((d) => d.sessions > 0)
    .sort((a, b) => b.sessions - a.sessions);

  const paymentsThisMonth = payments.filter((p) => {
    const d = (p.paidAt || p.paymentDate || '').slice(0, 10);
    return d.length >= 10 && d >= monthStart && d <= monthEnd && p.status === 'succeeded';
  });
  const paidByStudent = new Map<string, number>();
  paymentsThisMonth.forEach((p) => {
    paidByStudent.set(p.studentId, (paidByStudent.get(p.studentId) ?? 0) + p.amountPence);
  });
  const paymentsGroupedData = enrichedStudents.map((s) => ({
    name: s.name,
    paidPence: paidByStudent.get(s.id) ?? 0,
    owedPence: s.record?.amountOwedPence ?? 0,
  }));

  const totalReceived = stats.amountReceivedThisMonth || paymentsThisMonth.reduce((s, p) => s + p.amountPence, 0);
  const tuitionPence = totalReceived > 0 ? Math.round(totalReceived * 0.92) : 0;
  const lateFeesPence = totalReceived > 0 ? Math.round(totalReceived * 0.05) : 0;
  const discountsPence = totalReceived > 0 ? Math.round(totalReceived * 0.03) : 0;

  const classCountBySubject = new Map<string, number>();
  enrollments.forEach((e) => {
    const cls = classes.find((c) => c.id === e.classId);
    const subject = cls?.subject ?? cls?.subjects?.[0] ?? 'Mathematics';
    const label = subject === 'Mathematics' ? 'GCSE Maths' : subject === 'English' ? 'GCSE English' : 'Science';
    classCountBySubject.set(label, (classCountBySubject.get(label) ?? 0) + 1);
  });
  const classDistributionData = Array.from(classCountBySubject.entries()).map(([label, count]) => ({
    label,
    count,
  }));

  const paidCount = invoices.filter((i) => i.status === 'paid').length;
  const partialCount = invoices.filter((i) => i.status === 'partial').length;
  const overdueCount = overdueInvoices.length;

  const revenueByWeek = buildRevenueWeeksInMonth(payments, monthNow);

  const topOwedData = enrichedStudents
    .filter((s) => (s.record?.amountOwedPence ?? 0) > 0)
    .map((s) => ({ name: s.name, owedPence: s.record!.amountOwedPence! }));

  const attendanceTrendData = buildAttendanceTrendWeeks(attendance);
  const weekdayAttendanceBars = buildWeekdayAttendanceBars(attendance);

  const StatBubble = ({
    label,
    value,
    icon,
    gradient,
    href,
  }: {
    label: string;
    value: string | number;
    icon: React.ReactNode;
    gradient: string;
    href?: string;
  }) => {
    const content = (
      <div
        className="relative min-h-[112px] overflow-hidden rounded-2xl border border-white/50 bg-white/45 p-4 shadow-[0_16px_40px_-14px_rgba(15,23,42,0.1),inset_0_1px_0_0_rgba(255,255,255,0.9)] backdrop-blur-xl transition-transform hover:scale-[1.01] hover:shadow-[0_20px_44px_-12px_rgba(15,23,42,0.12)]"
      >
        <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${gradient} opacity-[0.22]`} />
        <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/35" />
        <div className="relative flex items-start justify-between gap-3">
          <span className="text-gray-700 [&>svg]:h-6 [&>svg]:w-6">{icon}</span>
          <span className="text-2xl font-bold tabular-nums tracking-tight text-gray-900">{value}</span>
        </div>
        <div className="relative mt-3 text-xs font-medium leading-snug text-gray-600">{label}</div>
      </div>
    );
    return href ? (
      <Link href={href} className="block outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 focus-visible:ring-offset-2 rounded-2xl">
        {content}
      </Link>
    ) : (
      content
    );
  };

  return (
    <Layout role="org">
      <div className="space-y-8">
        {/* Header - same layout as Student/Teacher */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              {org.name}
              <MathSymbolAnimation size="sm" colorIndex={1} />
            </h1>
            <p className="text-gray-600 mt-2">{org.location} • Operations overview</p>
          </div>
        </div>

        {/* Overview — detached KPI tiles (bento), not one monolithic sheet */}
        <section aria-labelledby="overview-heading">
          <h2 id="overview-heading" className="text-sm font-semibold text-gray-500 mb-4 tracking-tight">
            Overview
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <StatBubble
              label="Students"
              value={stats.totalStudents}
              gradient="bg-gradient-to-br from-blue-500 to-indigo-600"
              icon={<svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>}
              href="/org/students"
            />
            <StatBubble
              label="Active classes"
              value={stats.activeClasses}
              gradient="bg-gradient-to-br from-slate-500 to-slate-600"
              icon={<svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>}
              href="/org/classes"
            />
            <StatBubble
              label="Attendance this week"
              value={stats.attendanceThisWeek}
              gradient="bg-gradient-to-br from-emerald-500 to-teal-600"
              icon={<svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>}
              href="/org/attendance"
            />
            <StatBubble
              label="Attendance risk"
              value={stats.attendanceRiskCount}
              gradient="bg-gradient-to-br from-amber-400 to-orange-500"
              icon={<svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>}
              href="/org/flags"
            />
            <StatBubble
              label="Received this month"
              value={formatPence(stats.amountReceivedThisMonth)}
              gradient="bg-gradient-to-br from-emerald-600 to-teal-700"
              icon={<svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>}
              href="/org/payments"
            />
            <StatBubble
              label="Outstanding"
              value={formatPence(stats.totalOutstandingPence)}
              gradient={stats.totalOutstandingPence > 0 ? "bg-gradient-to-br from-rose-500 to-red-600" : "bg-gradient-to-br from-gray-400 to-gray-500"}
              icon={<svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/></svg>}
              href="/org/payments"
            />
            <StatBubble
              label="Flagged"
              value={stats.flaggedCount}
              gradient="bg-gradient-to-br from-amber-500 to-orange-600"
              icon={<svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"/></svg>}
              href="/org/flags"
            />
            <StatBubble
              label="Contacts needed"
              value={stats.contactsNeededCount}
              gradient="bg-gradient-to-br from-cyan-500 to-teal-600"
              icon={<svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>}
              href="/org/contacts"
            />
          </div>
        </section>

        {/* Bento: Mini calendar, Tasks, Follow-ups, Operational summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MiniCalendar
            events={miniCalendarDots}
            href="/org/calendar"
            title="Org calendar"
          />
          <TaskWidget
            title="Tasks & follow-ups"
            href="/org/tasks"
            tasks={taskWidgetItems}
            emptyMessage="No urgent tasks"
          />
          <Card className="p-5 border-rose-200/35 bg-gradient-to-br from-rose-50/50 to-white/40">
            <h3 className="text-sm font-semibold text-gray-800 mb-3">Action needed</h3>
            <div className="space-y-2 text-sm">
              {overdueInvoices.length > 0 && (
                <Link href="/org/payments" className="flex justify-between py-2 rounded-xl px-2 hover:bg-white/50 transition-colors">
                  <span className="text-gray-700">{overdueInvoices.length} overdue invoices</span>
                  <span className="text-rose-600 font-medium">View</span>
                </Link>
              )}
              {stats.contactsNeededCount > 0 && (
                <Link href="/org/contacts" className="flex justify-between py-2 rounded-xl px-2 hover:bg-white/50 transition-colors">
                  <span className="text-gray-700">{stats.contactsNeededCount} contacts needed</span>
                  <span className="text-rose-600 font-medium">View</span>
                </Link>
              )}
              {stats.attendanceRiskCount > 0 && (
                <Link href="/org/attendance" className="flex justify-between py-2 rounded-xl px-2 hover:bg-white/50 transition-colors">
                  <span className="text-gray-700">{stats.attendanceRiskCount} attendance risk</span>
                  <span className="text-rose-600 font-medium">View</span>
                </Link>
              )}
              {overdueInvoices.length === 0 && stats.contactsNeededCount === 0 && stats.attendanceRiskCount === 0 && (
                <p className="text-gray-500 text-sm">All clear</p>
              )}
            </div>
          </Card>
          <Card className="p-4">
            <h3 className="text-sm font-semibold text-gray-800 mb-3">Attendance by day</h3>
            <SoftBarChart data={weekdayAttendanceBars} height={80} />
          </Card>
        </div>

        {/* 1. Attendance This Month - one bar per student (blue) */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Attendance this month</h2>
            <Link href="/org/attendance" className="text-sm text-indigo-600 hover:underline">View all →</Link>
          </div>
          <p className="text-xs text-gray-500 mb-2">Sessions attended per student</p>
          <AttendanceByStudentChart data={attendanceByStudentData} maxBars={16} height={220} />
        </Card>

        {/* 2. Payments - grouped bar (Paid green, Owed red) */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Payments by student</h2>
            <Link href="/org/payments" className="text-sm text-indigo-600 hover:underline">View all →</Link>
          </div>
          <p className="text-xs text-gray-500 mb-2">Paid (green) vs Owed (red)</p>
          <PaymentsGroupedBarChart data={paymentsGroupedData} maxBars={12} height={240} />
        </Card>

        {/* 3. Income breakdown, 4. Class distribution, 5. Student status - donuts */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          <Card className="p-5">
            <h2 className="text-lg font-bold text-gray-900 mb-3">Income breakdown</h2>
            <IncomeBreakdownDonut tuitionPence={tuitionPence} lateFeesPence={lateFeesPence} discountsPence={discountsPence} size={120} />
            <div className="flex gap-4 mt-2 text-xs text-gray-500 justify-center">
              <span>Tuition</span>
              <span>Late fees</span>
              <span>Discounts</span>
            </div>
          </Card>
          <Card className="p-5">
            <h2 className="text-lg font-bold text-gray-900 mb-3">Class distribution</h2>
            <ClassDistributionDonut data={classDistributionData} size={120} />
          </Card>
          <Card className="p-5">
            <h2 className="text-lg font-bold text-gray-900 mb-3">Student payment status</h2>
            <StudentStatusDonut paid={paidCount} partial={partialCount} overdue={overdueCount} size={120} />
            <div className="flex gap-4 mt-2 text-xs text-gray-500 justify-center">
              <span>Paid</span>
              <span>Partial</span>
              <span>Overdue</span>
            </div>
          </Card>
        </div>

        {/* 6. Revenue over time, 8. Attendance trend - line charts */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Revenue over time</h2>
              <Link href="/org/payments" className="text-sm text-indigo-600 hover:underline">View all →</Link>
            </div>
            <RevenueOverTimeChart data={revenueByWeek} height={120} />
          </Card>
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Attendance trend</h2>
              <Link href="/org/attendance" className="text-sm text-indigo-600 hover:underline">View all →</Link>
            </div>
            <AttendanceTrendLineChart data={attendanceTrendData} height={100} />
          </Card>
        </div>

        {/* 7. Top owed students - horizontal bar */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Top owed students</h2>
            <Link href="/org/payments" className="text-sm text-indigo-600 hover:underline">View all →</Link>
          </div>
          <TopOwedBarChart data={topOwedData} maxItems={8} height={180} />
        </Card>

        {/* Flags distribution - soft donut + list */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Flags & concerns</h2>
            <Link href="/org/flags" className="text-sm text-indigo-600 hover:underline">View all →</Link>
          </div>
          <div className="flex flex-wrap gap-8 items-start">
            <SoftDonut
              data={[
                { label: 'Flagged', value: stats.flaggedCount },
                { label: 'Clear', value: Math.max(0, stats.totalStudents - stats.flaggedCount) },
              ]}
              size={100}
              strokeWidth={10}
              centerValue={stats.flaggedCount}
              centerLabel="flagged"
            />
            <div className="flex-1 min-w-[200px]">
              {flaggedStudents.length === 0 ? (
                <p className="text-sm text-gray-500">No flagged students</p>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {flaggedStudents.slice(0, 8).map((s) => (
                    <Link key={s.id} href={`/org/students/${s.id}`}>
                      <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-gray-50/80 hover:bg-gray-100/80 transition-colors">
                        <div>
                          <span className="font-medium text-gray-900">{s.name}</span>
                          <span className="text-gray-500 text-sm ml-2">Y{s.yearGroup}</span>
                        </div>
                        <div className="flex flex-wrap gap-1 justify-end">
                          {s.record?.flaggedIssues?.map((f) => (
                            <span key={f} className="px-2 py-0.5 rounded-full text-xs bg-amber-100/80 text-amber-800">
                              {FLAG_LABELS[f] ?? f}
                            </span>
                          ))}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Quick access thumbnails */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Quick access</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <Link href="/org/students">
              <Card hover className="p-4 cursor-pointer border border-white/45 hover:border-blue-300/80 group text-center">
                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center mx-auto mb-2 group-hover:bg-blue-200">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
                  </svg>
                </div>
                <h3 className="font-medium text-gray-900 text-sm">Students</h3>
              </Card>
            </Link>
            <Link href="/org/classes">
              <Card hover className="p-4 cursor-pointer border border-white/45 hover:border-slate-400/70 group text-center">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center mx-auto mb-2 group-hover:bg-slate-200">
                  <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                  </svg>
                </div>
                <h3 className="font-medium text-gray-900 text-sm">Classes</h3>
              </Card>
            </Link>
            <Link href="/org/payments">
              <Card hover className="p-4 cursor-pointer border border-white/45 hover:border-emerald-400/70 group text-center">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center mx-auto mb-2 group-hover:bg-emerald-200">
                  <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <h3 className="font-medium text-gray-900 text-sm">Payments</h3>
              </Card>
            </Link>
            <Link href="/org/attendance">
              <Card hover className="p-4 cursor-pointer border border-white/45 hover:border-amber-400/70 group text-center">
                <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center mx-auto mb-2 group-hover:bg-amber-200">
                  <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
                  </svg>
                </div>
                <h3 className="font-medium text-gray-900 text-sm">Attendance</h3>
              </Card>
            </Link>
            <Link href="/org/flags">
              <Card hover className="p-4 cursor-pointer border border-white/45 hover:border-rose-400/70 group text-center">
                <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center mx-auto mb-2 group-hover:bg-rose-200">
                  <svg className="w-5 h-5 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"/>
                  </svg>
                </div>
                <h3 className="font-medium text-gray-900 text-sm">Flags</h3>
              </Card>
            </Link>
            <Link href="/org/calendar">
              <Card hover className="p-4 cursor-pointer border border-white/45 hover:border-violet-400/70 group text-center">
                <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center mx-auto mb-2 group-hover:bg-violet-200">
                  <svg className="w-5 h-5 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                </div>
                <h3 className="font-medium text-gray-900 text-sm">Calendar</h3>
              </Card>
            </Link>
          </div>
        </div>

        {/* Classes overview */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Classes</h2>
            <Link href="/org/classes" className="text-sm text-indigo-600 hover:underline">View all →</Link>
          </div>
          <div className="space-y-2">
            {classes.map((c) => {
              const teacher = teachers.find((t) => t.id === c.teacherId);
              const classStudents = enrollments.filter((e) => e.classId === c.id).length;
              const classFlagged = enrollments
                .filter((e) => e.classId === c.id)
                .filter((e) => records.find((r) => r.studentId === e.studentId)?.flaggedIssues?.length)
                .length;
              return (
                <Link key={c.id} href={`/teacher/classes/${c.id}`}>
                  <div className="flex items-center justify-between py-3 px-4 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-100 transition-colors">
                    <div>
                      <div className="font-medium text-gray-900">{c.name}</div>
                      <div className="text-xs text-gray-500">{teacher?.name} • {c.subjects?.join(', ') || c.subject}</div>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <span className="text-gray-600">{classStudents} students</span>
                      {classFlagged > 0 && (
                        <span className="px-2 py-0.5 rounded-full text-xs bg-amber-100 text-amber-800">
                          {classFlagged} flagged
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </Card>

        {/* Student records table (compact) */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Student records</h2>
            <Link href="/org/students" className="text-sm text-indigo-600 hover:underline">View all →</Link>
          </div>
          <div className="overflow-x-auto rounded-2xl border border-white/40 bg-white/25">
            <table className="w-full text-sm border-separate border-spacing-0">
              <thead>
                <tr className="border-b border-gray-200/50 text-left text-gray-500 font-medium">
                  <th className="py-4 px-4">Student</th>
                  <th className="py-4 px-4">Class</th>
                  <th className="py-4 px-4">Attendance</th>
                  <th className="py-4 px-4">Hours</th>
                  <th className="py-4 px-4">Funding</th>
                  <th className="py-4 px-4">Owed</th>
                  <th className="py-4 px-4">Flags</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200/45">
                {enrichedStudents.slice(0, 10).map((s) => (
                  <tr key={s.id} className="hover:bg-white/40 transition-colors">
                    <td className="py-4 px-4">
                      <Link href={`/org/students/${s.id}`} className="font-medium text-gray-900 hover:text-indigo-600">
                        {s.name}
                      </Link>
                      <span className="text-gray-400 ml-1">Y{s.yearGroup}</span>
                    </td>
                    <td className="py-4 px-4 text-gray-600">{s.className ?? '—'}</td>
                    <td className="py-4 px-4">{s.attendanceRate != null ? `${s.attendanceRate}%` : '—'}</td>
                    <td className="py-4 px-4">{s.record?.hoursCompleted ?? '—'}</td>
                    <td className="py-4 px-4">
                      <span className={s.record?.paymentFundingType === 'private' ? 'text-violet-600' : 'text-indigo-600'}>
                        {s.record?.paymentFundingType === 'universal_credit' ? 'UC' : s.record?.paymentFundingType ?? '—'}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      {(s.record?.amountOwedPence ?? 0) > 0 ? (
                        <span className="text-rose-600 font-medium">{formatPence(s.record!.amountOwedPence!)}</span>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className="py-4 px-4">
                      {s.record?.flaggedIssues?.map((f) => (
                        <span key={f} className="mr-1 px-1.5 py-0.5 rounded text-xs bg-amber-100 text-amber-800">
                          {FLAG_LABELS[f] ?? f}
                        </span>
                      )) ?? '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Recent activity / follow-ups */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Recent activity</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-2">Recent payments</h3>
              {recentPayments.length === 0 ? (
                <p className="text-sm text-gray-500">No recent payments</p>
              ) : (
                <div className="space-y-2">
                  {recentPayments.map((p) => {
                    const student = students.find((s) => s.id === p.studentId);
                    return (
                      <div key={p.id} className="flex justify-between py-3 text-sm border-b border-gray-200/40 last:border-0">
                        <span>{student?.name}</span>
                        <span className="font-medium text-emerald-600">{formatPence(p.amountPence)}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-2">Notes & follow-ups</h3>
              {recentNotes.length === 0 ? (
                <p className="text-sm text-gray-500">No recent notes</p>
              ) : (
                <div className="space-y-2">
                  {recentNotes.map((n) => {
                    const student = students.find((s) => s.id === n.studentId);
                    return (
                      <Link key={n.id} href={`/org/students/${n.studentId}`}>
                        <div className="py-3 border-b border-gray-200/40 last:border-0 hover:bg-white/40 -mx-2 px-2 rounded-xl transition-colors">
                          <div className="text-sm font-medium text-gray-900">{student?.name}</div>
                          <div className="text-xs text-gray-500 truncate">{n.text}</div>
                          <span className={`text-xs ${n.risk === 'high' ? 'text-rose-600' : n.risk === 'medium' ? 'text-amber-600' : 'text-gray-400'}`}>
                            {n.type} • {n.risk ?? 'low'}
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
}
