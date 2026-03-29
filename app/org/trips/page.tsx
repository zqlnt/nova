'use client';

import Link from 'next/link';
import Layout from '@/components/Layout';
import Card from '@/components/Card';
import { seedOrgCalendarEvents, uk2026TermDates } from '@/lib/calendarSeed';
import { orgService } from '@/lib/orgService';
import { buildOrgCalendarEvents } from '@/lib/orgCalendarEvents';
import MathSymbolAnimation from '@/components/MathSymbolAnimation';
import MiniCalendar from '@/components/MiniCalendar';
import TaskWidget from '@/components/TaskWidget';
import { SoftBarChart } from '@/components/NovaCharts';

export default function OrgTripsPage() {
  const org = orgService.getOrganisation();
  const trips = seedOrgCalendarEvents.filter((e) => e.orgId === org.id && (e.type === 'trip' || e.type === 'event'));
  const allOrgEvents = seedOrgCalendarEvents.filter((e) => e.orgId === org.id);

  const students = orgService.listStudents();
  const attendance = orgService.listAttendance();
  const invoices = orgService.listInvoices();
  const payments = orgService.listPayments();
  const families = orgService.listFamilies();
  const staffTasks = orgService.listStaffTasks();
  const liveCalendarSlice = buildOrgCalendarEvents(
    org.id,
    attendance,
    invoices,
    payments,
    students.map((s) => ({ id: s.id, name: s.name })),
    families,
    staffTasks
  );
  const miniEvents = [
    ...allOrgEvents.map((e) => ({ startDate: e.startDate, title: e.title })),
    ...liveCalendarSlice
      .filter((e) => ['staff_task_due', 'uc_payment', 'uc_journal_check'].includes(e.type))
      .map((e) => ({ startDate: e.startDate, title: e.title })),
  ];

  const openStaffTasks = staffTasks.filter((t) => t.orgId === org.id && t.status === 'open');
  const mapTask = (t: (typeof openStaffTasks)[0], suffix: string) => ({
    id: `${suffix}_${t.id}`,
    title: t.title,
    due: t.dueDate?.slice(5),
    href: '/org/tasks' as const,
    priority: 'high' as const,
  });
  const planningTasks = openStaffTasks.slice(0, 5).map((t) => mapTask(t, 'p'));
  const outstandingTasks = openStaffTasks.slice(5, 9).map((t) => mapTask(t, 'o'));

  const todayStr = new Date().toISOString().split('T')[0];
  const upcomingTerms = uk2026TermDates.filter((t) => t.endDate >= todayStr).slice(0, 6);

  const todoItems = openStaffTasks.slice(9, 14).map((t) => ({
    id: t.id,
    title: t.title,
    done: false,
  }));

  return (
    <Layout role="org">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              Trips & Planning
              <MathSymbolAnimation size="sm" colorIndex={0} />
            </h1>
            <p className="text-gray-600 mt-1">
              Extracurricular trips, term dates, events, and planning tasks
            </p>
          </div>
        </div>

        {/* Look up programme - prominent quick action */}
        <Card className="p-5 bg-gradient-to-br from-indigo-50 to-blue-50 border-indigo-100">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-indigo-100 flex items-center justify-center flex-shrink-0">
                <svg className="w-7 h-7 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Look up programme</h2>
                <p className="text-sm text-gray-600">Search curriculum, term dates, and scheduled events</p>
              </div>
            </div>
            <Link href="/org/calendar">
              <button className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors">
                Open programme →
              </button>
            </Link>
          </div>
        </Card>

        {/* Bento: Mini Calendar, Tasks, Term dates, Outstandings */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MiniCalendar
            events={miniEvents}
            href="/org/calendar"
            title="This month"
          />
          <TaskWidget
            title="Staff tasks"
            href="/org/tasks"
            tasks={planningTasks}
            emptyMessage="No open staff tasks — add some under Staff tasks"
          />
          <Card className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 border-amber-100">
            <h3 className="text-sm font-semibold text-gray-800 mb-2">Outstanding tasks</h3>
            <ul className="space-y-2">
              {outstandingTasks.slice(0, 3).map((t) => (
                <li key={t.id} className="flex items-center gap-2 text-sm">
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${t.priority === 'high' ? 'bg-rose-500' : 'bg-amber-400'}`} />
                  <span className="text-gray-700 truncate flex-1">{t.title}</span>
                  {t.due && <span className="text-[10px] text-gray-400">{t.due}</span>}
                </li>
              ))}
            </ul>
            <Link href="/org/tasks" className="text-xs text-indigo-600 hover:underline mt-2 block">Manage staff tasks →</Link>
          </Card>
          <Card className="p-4 bg-white/95">
            <h3 className="text-sm font-semibold text-gray-800 mb-3">Trips this term</h3>
            <SoftBarChart
              data={[
                { label: 'Mar', value: 2 },
                { label: 'Apr', value: 1 },
                { label: 'May', value: 1 },
                { label: 'Jun', value: 0 },
              ]}
              height={80}
            />
          </Card>
        </div>

        {/* Term dates & half term breaks */}
        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="p-5">
            <h3 className="text-sm font-semibold text-gray-800 mb-3">Term dates & half term breaks</h3>
            <p className="text-xs text-gray-500 mb-3">UK 2026/27 academic year — varies by local authority</p>
            <div className="space-y-2 max-h-72 overflow-y-auto">
              {upcomingTerms.map((t) => (
                <div
                  key={t.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border ${
                    t.type === 'term' ? 'bg-blue-50/50 border-blue-100' : t.type === 'holiday' ? 'bg-amber-50/50 border-amber-100' : 'bg-emerald-50/50 border-emerald-100'
                  }`}
                >
                  <span
                    className={`w-3 h-3 rounded-full flex-shrink-0 ${
                      t.type === 'term' ? 'bg-blue-400' : t.type === 'holiday' ? 'bg-amber-400' : 'bg-emerald-400'
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 text-sm">{t.name}</div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {t.startDate} – {t.endDate}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Link href="/org/calendar" className="text-xs text-indigo-600 hover:underline mt-3 block">Full calendar →</Link>
          </Card>

          {/* To do list */}
          <Card className="p-5">
            <h3 className="text-sm font-semibold text-gray-800 mb-3">To do list</h3>
            <ul className="space-y-2">
              {todoItems.map((t) => (
                <li key={t.id} className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-gray-50">
                  <span className="w-4 h-4 rounded border border-gray-300 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{t.title}</span>
                </li>
              ))}
            </ul>
            <Link href="/org/tasks" className="text-xs text-indigo-600 hover:underline mt-3 inline-block">Open Staff tasks →</Link>
          </Card>
        </div>

        {/* Trips & events grid */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Upcoming trips & events</h2>
          <div className="grid lg:grid-cols-2 gap-6">
            {trips.map((trip) => (
              <Card key={trip.id} className="p-5 bg-white/95">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-xs font-medium mb-2 ${
                        trip.type === 'trip' ? 'bg-pink-100 text-pink-800' : 'bg-slate-100 text-slate-800'
                      }`}
                    >
                      {trip.type === 'trip' ? 'Trip' : 'Event'}
                    </span>
                    <h3 className="text-lg font-semibold text-gray-900">{trip.title}</h3>
                    {trip.description && <p className="text-sm text-gray-500 mt-1">{trip.description}</p>}
                    <p className="text-xs text-gray-400 mt-2">
                      {trip.startDate}
                      {trip.endDate && trip.endDate !== trip.startDate ? ` – ${trip.endDate}` : ''}
                    </p>
                  </div>
                  {'costPence' in trip && trip.costPence !== undefined && (
                    <div className="text-right">
                      <div className="text-xl font-bold text-gray-900">£{(trip.costPence / 100).toFixed(2)}</div>
                      {trip.costBreakdown && (
                        <div className="mt-2 space-y-1 text-xs text-gray-500">
                          {trip.costBreakdown.map((item, i) => (
                            <div key={i}>
                              {item.item}: £{(item.amountPence / 100).toFixed(2)}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>

          {trips.length === 0 && (
            <Card className="p-8 text-center">
              <p className="text-gray-500">No trips or events planned yet.</p>
              <p className="text-sm text-gray-400 mt-1">Add trips with cost breakdowns from the calendar.</p>
            </Card>
          )}
        </div>

        {/* Quick access */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Quick access</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Link href="/org/calendar">
              <Card hover className="p-5 cursor-pointer border border-gray-200 hover:border-indigo-300 group">
                <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center mb-3 group-hover:bg-indigo-200 transition-colors">
                  <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900">Calendar</h3>
                <p className="text-xs text-gray-500 mt-0.5">Term dates & events</p>
              </Card>
            </Link>
            <Link href="/org/calendar">
              <Card hover className="p-5 cursor-pointer border border-gray-200 hover:border-pink-300 group">
                <div className="w-12 h-12 rounded-xl bg-pink-100 flex items-center justify-center mb-3 group-hover:bg-pink-200 transition-colors">
                  <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0h.5a2.5 2.5 0 002.5-2.5V3.935M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900">Look up programme</h3>
                <p className="text-xs text-gray-500 mt-0.5">Search curriculum</p>
              </Card>
            </Link>
            <Link href="/org/dashboard">
              <Card hover className="p-5 cursor-pointer border border-gray-200 hover:border-slate-300 group">
                <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mb-3 group-hover:bg-slate-200 transition-colors">
                  <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900">Dashboard</h3>
                <p className="text-xs text-gray-500 mt-0.5">Overview</p>
              </Card>
            </Link>
            <Link href="/org/calendar">
              <Card hover className="p-5 cursor-pointer border border-gray-200 hover:border-amber-300 group">
                <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center mb-3 group-hover:bg-amber-200 transition-colors">
                  <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900">Planning</h3>
                <p className="text-xs text-gray-500 mt-0.5">Tasks & deadlines</p>
              </Card>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
