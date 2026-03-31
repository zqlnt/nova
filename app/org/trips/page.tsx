'use client';

import Link from 'next/link';
import Layout from '@/components/Layout';
import Card from '@/components/Card';
import { orgService, useOrgSync } from '@/lib/orgService';
import { buildOrgCalendarEvents } from '@/lib/orgCalendarEvents';
import MathSymbolAnimation from '@/components/MathSymbolAnimation';
import MiniCalendar from '@/components/MiniCalendar';
import TaskWidget from '@/components/TaskWidget';
import { SoftBarChart } from '@/components/NovaCharts';

export default function OrgTripsPage() {
  useOrgSync();
  const org = orgService.getOrganisation();

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

  const miniEvents = liveCalendarSlice.map((e) => ({ startDate: e.startDate, title: e.title }));

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

  const tripLike = liveCalendarSlice.filter((e) =>
    ['trip', 'event', 'exam'].includes(e.type as string)
  );

  const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const now = new Date();
  const tripCountsByMonth = monthLabels.map((label, i) => {
    const m = i;
    const y = now.getFullYear();
    const count = tripLike.filter((e) => {
      const [ey, em] = e.startDate.split('-').map(Number);
      return ey === y && em === m + 1;
    }).length;
    return { label, value: count };
  });

  const todoItems = openStaffTasks.slice(9, 14).map((t) => ({
    id: t.id,
    title: t.title,
    done: false,
  }));

  return (
    <Layout role="org">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              Trips & Planning
              <MathSymbolAnimation size="sm" colorIndex={0} />
            </h1>
            <p className="text-gray-600 mt-1">Extracurricular trips, events, and planning tasks from your live data</p>
          </div>
        </div>

        <Card className="p-5 bg-gradient-to-br from-indigo-50 to-blue-50 border-indigo-100">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-14 h-14 rounded-xl bg-indigo-100 flex items-center justify-center flex-shrink-0">
                <svg className="w-7 h-7 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <div className="min-w-0">
                <h2 className="text-lg font-bold text-gray-900">Programme calendar</h2>
                <p className="text-sm text-gray-600">View all scheduled items in one place</p>
              </div>
            </div>
            <Link href="/org/calendar">
              <button type="button" className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors w-full sm:w-auto">
                Open calendar →
              </button>
            </Link>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MiniCalendar events={miniEvents} href="/org/calendar" title="This month" />
          <TaskWidget
            title="Staff tasks"
            href="/org/tasks"
            tasks={planningTasks}
            emptyMessage="No open staff tasks — add some under Staff tasks"
          />
          <Card className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 border-amber-100 min-w-0">
            <h3 className="text-sm font-semibold text-gray-800 mb-2">Outstanding tasks</h3>
            {outstandingTasks.length === 0 ? (
              <p className="text-sm text-gray-500">None</p>
            ) : (
              <ul className="space-y-2">
                {outstandingTasks.slice(0, 3).map((t) => (
                  <li key={t.id} className="flex items-center gap-2 text-sm min-w-0">
                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${t.priority === 'high' ? 'bg-rose-500' : 'bg-amber-400'}`} />
                    <span className="text-gray-700 truncate flex-1">{t.title}</span>
                    {t.due && <span className="text-[10px] text-gray-400 flex-shrink-0">{t.due}</span>}
                  </li>
                ))}
              </ul>
            )}
            <Link href="/org/tasks" className="text-xs text-indigo-600 hover:underline mt-2 block">
              Manage staff tasks →
            </Link>
          </Card>
          <Card className="p-4 min-w-0">
            <h3 className="text-sm font-semibold text-gray-800 mb-3">Trips & events (by month)</h3>
            <p className="text-xs text-gray-500 mb-2">Counts from saved calendar items (trips/events/exams)</p>
            <SoftBarChart data={tripCountsByMonth} height={80} />
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="p-5 min-w-0">
            <h3 className="text-sm font-semibold text-gray-800 mb-3">Term planning</h3>
            <p className="text-sm text-gray-500">
              Configure official term dates in organisation settings when you add them. This page focuses on operational items from your live calendar.
            </p>
            <Link href="/org/calendar" className="text-xs text-indigo-600 hover:underline mt-3 block">
              Full calendar →
            </Link>
          </Card>

          <Card className="p-5 min-w-0">
            <h3 className="text-sm font-semibold text-gray-800 mb-3">To do list</h3>
            {todoItems.length === 0 ? (
              <p className="text-sm text-gray-500">No extra tasks in this slice — see Staff tasks for the full list.</p>
            ) : (
              <ul className="space-y-2">
                {todoItems.map((t) => (
                  <li key={t.id} className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-gray-50">
                    <span className="w-4 h-4 rounded border border-gray-300 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{t.title}</span>
                  </li>
                ))}
              </ul>
            )}
            <Link href="/org/tasks" className="text-xs text-indigo-600 hover:underline mt-3 inline-block">
              Open Staff tasks →
            </Link>
          </Card>
        </div>

        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Trips & events</h2>
          <div className="grid lg:grid-cols-2 gap-6">
            {tripLike.length === 0 ? (
              <Card className="p-8 text-center col-span-full">
                <p className="text-gray-600">No trip or event entries yet.</p>
                <p className="text-sm text-gray-500 mt-2">
                  When you add trips or events to your org workflow and store them as calendar records, they will appear here.
                </p>
                <Link href="/org/calendar" className="text-indigo-600 text-sm font-medium mt-4 inline-block">
                  View calendar
                </Link>
              </Card>
            ) : (
              tripLike.map((trip) => (
                <Card key={trip.id} className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <span className="inline-block px-2 py-0.5 rounded text-xs font-medium mb-2 bg-slate-100 text-slate-800">
                        {String(trip.type).replace(/_/g, ' ')}
                      </span>
                      <h3 className="text-lg font-semibold text-gray-900">{trip.title}</h3>
                      {'description' in trip && trip.description && <p className="text-sm text-gray-500 mt-1">{trip.description}</p>}
                      <p className="text-xs text-gray-400 mt-2">
                        {trip.startDate}
                        {'endDate' in trip && trip.endDate && trip.endDate !== trip.startDate ? ` – ${trip.endDate}` : ''}
                      </p>
                    </div>
                    {'costPence' in trip && trip.costPence !== undefined && (
                      <div className="text-right flex-shrink-0">
                        <div className="text-xl font-bold text-gray-900">£{(trip.costPence / 100).toFixed(2)}</div>
                      </div>
                    )}
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>

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
                <p className="text-xs text-gray-500 mt-0.5">Schedule</p>
              </Card>
            </Link>
            <Link href="/org/calendar">
              <Card hover className="p-5 cursor-pointer border border-gray-200 hover:border-pink-300 group">
                <div className="w-12 h-12 rounded-xl bg-pink-100 flex items-center justify-center mb-3 group-hover:bg-pink-200 transition-colors">
                  <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0h.5a2.5 2.5 0 002.5-2.5V3.935M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900">Programme</h3>
                <p className="text-xs text-gray-500 mt-0.5">Browse dates</p>
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
            <Link href="/org/tasks">
              <Card hover className="p-5 cursor-pointer border border-gray-200 hover:border-amber-300 group">
                <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center mb-3 group-hover:bg-amber-200 transition-colors">
                  <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900">Planning</h3>
                <p className="text-xs text-gray-500 mt-0.5">Tasks</p>
              </Card>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
