'use client';

import { useState } from 'react';
import Layout from '@/components/Layout';
import Card from '@/components/Card';
import Calendar from '@/components/Calendar';
import { studentCalendarEvents, uk2026TermDates } from '@/lib/studentCalendarSeed';

export default function StudentCalendarPage() {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const examDate = new Date('2026-05-11');
  const today = new Date();
  const daysToExam = Math.ceil((examDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  const selectedEvents = selectedDate
    ? [
        ...uk2026TermDates.filter((t) => t.startDate <= selectedDate && t.endDate >= selectedDate),
        ...studentCalendarEvents.filter((e) => e.startDate <= selectedDate && (e.endDate ?? e.startDate) >= selectedDate),
      ]
    : [];

  return (
    <Layout role="student">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Calendar</h1>
          <p className="text-gray-600 mt-1">Curriculum plan, revision, and exam countdown</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Calendar
              events={studentCalendarEvents}
              termDates={uk2026TermDates}
              onDateClick={setSelectedDate}
              mode="student"
            />
          </div>

          <div className="space-y-4">
            <Card className="p-5 bg-white/95">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Exam countdown</h3>
              <div className="text-3xl font-bold text-gray-900 tabular-nums">{daysToExam}</div>
              <p className="text-sm text-gray-500 mt-0.5">days until GCSE exams</p>
            </Card>

            <Card className="p-5">
              <h3 className="text-sm font-medium text-gray-600 mb-3">This week</h3>
              <div className="mt-3 space-y-2">
                {studentCalendarEvents.slice(0, 3).map((e) => (
                  <div key={e.id} className="p-2 rounded-lg bg-gray-50 text-sm">
                    <span className="font-medium text-gray-900">{e.title}</span>
                    {e.description && <span className="text-gray-500 block text-xs mt-0.5">{e.description}</span>}
                  </div>
                ))}
              </div>
            </Card>

            {selectedDate && (
              <Card className="p-5">
                <h3 className="text-sm font-medium text-gray-600 mb-3">{selectedDate}</h3>
                {selectedEvents.length === 0 ? (
                  <p className="text-sm text-gray-500">No events</p>
                ) : (
                  <div className="space-y-2">
                    {selectedEvents.map((e) => (
                      <div key={e.id} className="p-3 rounded-lg bg-gray-50 border border-gray-100">
                        <div className="font-medium text-gray-900">{'title' in e ? e.title : e.name}</div>
                        {'description' in e && e.description && <div className="text-sm text-gray-500 mt-0.5">{e.description}</div>}
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            )}

            <Card className="p-5">
              <h3 className="text-sm font-medium text-gray-600 mb-3">Term dates</h3>
              <div className="space-y-1.5 max-h-48 overflow-y-auto text-xs">
                {uk2026TermDates.map((t) => (
                  <div key={t.id} className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded flex-shrink-0 ${t.type === 'term' ? 'bg-blue-400' : t.type === 'holiday' ? 'bg-amber-400' : 'bg-emerald-400'}`} />
                    <span className="text-gray-700">{t.name}</span>
                    <span className="text-gray-400">{t.startDate} – {t.endDate}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
