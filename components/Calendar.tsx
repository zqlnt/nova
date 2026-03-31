'use client';

import { useState } from 'react';
import type { CalendarEvent, TermDate } from '@/lib/calendarTypes';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const EVENT_COLORS: Record<string, string> = {
  term: 'bg-blue-100 border-blue-300 text-blue-800',
  holiday: 'bg-amber-100 border-amber-300 text-amber-800',
  half_term: 'bg-emerald-100 border-emerald-300 text-emerald-800',
  class: 'bg-violet-100 border-violet-300 text-violet-800',
  lesson: 'bg-indigo-100 border-indigo-300 text-indigo-800',
  exam: 'bg-rose-100 border-rose-300 text-rose-800',
  revision: 'bg-cyan-100 border-cyan-300 text-cyan-800',
  trip: 'bg-pink-100 border-pink-300 text-pink-800',
  event: 'bg-slate-100 border-slate-300 text-slate-800',
  task: 'bg-gray-100 border-gray-300 text-gray-800',
  reminder: 'bg-amber-50 border-amber-200 text-amber-700',
  attendance_session: 'bg-blue-50 border-blue-200 text-blue-700',
  payment_due: 'bg-amber-50 border-amber-200 text-amber-800',
  payment_received: 'bg-emerald-50 border-emerald-200 text-emerald-800',
  admin_reminder: 'bg-slate-100 border-slate-200 text-slate-700',
  uc_payment: 'bg-violet-100 border-violet-300 text-violet-800',
  uc_journal_check: 'bg-fuchsia-100 border-fuchsia-300 text-fuchsia-800',
  staff_task_due: 'bg-orange-100 border-orange-300 text-orange-800',
};

interface CalendarProps {
  events?: CalendarEvent[];
  termDates?: TermDate[];
  onDateClick?: (date: string) => void;
  mode?: 'student' | 'teacher' | 'org';
}

export default function Calendar({ events = [], termDates = [], onDateClick, mode = 'org' }: CalendarProps) {
  const today = new Date();
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startPad = (firstDay.getDay() + 6) % 7; // Monday = 0
  const daysInMonth = lastDay.getDate();

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1));

  const getEventsForDate = (d: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const fromEvents = events.filter((e) => e.startDate <= dateStr && (e.endDate ?? e.startDate) >= dateStr);
    const fromTerms = termDates.filter((t) => t.startDate <= dateStr && t.endDate >= dateStr);
    return [...fromTerms.map((t) => ({ ...t, title: t.name, endDate: t.endDate } as CalendarEvent)), ...fromEvents];
  };

  const grid: (number | null)[] = [];
  for (let i = 0; i < startPad; i++) grid.push(null);
  for (let d = 1; d <= daysInMonth; d++) grid.push(d);

  return (
    <div className="nova-frost-panel rounded-3xl p-5 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          {MONTHS[month]} {year}
        </h3>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={prevMonth}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <button
            type="button"
            onClick={nextMonth}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-gray-500 mb-2">
        {DAYS.map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {grid.map((d, i) => {
          if (d === null) return <div key={i} />;
          const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
          const dayEvents = getEventsForDate(d);
          const isToday = today.getFullYear() === year && today.getMonth() === month && today.getDate() === d;
          const isWeekend = (startPad + i) % 7 >= 5;

          return (
            <button
              key={i}
              type="button"
              onClick={() => onDateClick?.(dateStr)}
              className={`min-h-[72px] p-2 rounded-lg text-left text-sm transition-colors ${
                isToday ? 'ring-2 ring-blue-400 bg-blue-50' : 'hover:bg-gray-50'
              } ${isWeekend ? 'bg-gray-50/50' : ''}`}
            >
              <span className={`font-medium ${isToday ? 'text-blue-600' : 'text-gray-900'}`}>{d}</span>
              <div className="mt-1 space-y-0.5">
                {dayEvents.slice(0, 2).map((e) => (
                  <div
                    key={e.id}
                    className={`truncate px-1.5 py-0.5 rounded text-[10px] border ${EVENT_COLORS[e.type] || 'bg-gray-100'}`}
                    title={e.title}
                  >
                    {e.title}
                  </div>
                ))}
                {dayEvents.length > 2 && (
                  <div className="text-[10px] text-gray-500">+{dayEvents.length - 2}</div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap gap-2 text-xs">
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded bg-blue-200" /> Term</span>
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded bg-amber-200" /> Holiday</span>
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded bg-emerald-200" /> Half term</span>
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded bg-pink-200" /> Trip/Event</span>
      </div>
    </div>
  );
}
