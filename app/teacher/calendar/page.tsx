'use client';

import { useState, useMemo } from 'react';
import Layout from '@/components/Layout';
import Card from '@/components/Card';
import Calendar from '@/components/Calendar';
import { uk2026TermDates } from '@/lib/teacherCalendarSeed';
import { buildTeacherCalendarFromOrg } from '@/lib/teacherCalendarFromOrg';
import { getTeacherIdForEmail, getClassIdsForTeacher } from '@/lib/teacherOrgData';
import { orgService, useOrgSync } from '@/lib/orgService';
import { useAuth } from '@/contexts/AuthContext';

export default function TeacherCalendarPage() {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const sync = useOrgSync();
  const teacherEvents = useMemo(
    () => buildTeacherCalendarFromOrg(user?.email ?? null),
    [user?.email, sync]
  );

  const selectedEvents = selectedDate
    ? [
        ...uk2026TermDates.filter((t) => t.startDate <= selectedDate && t.endDate >= selectedDate),
        ...teacherEvents.filter((e) => e.startDate <= selectedDate && (e.endDate ?? e.startDate) >= selectedDate),
      ]
    : [];

  const tid = getTeacherIdForEmail(user?.email ?? null);
  const classCount = tid ? getClassIdsForTeacher(tid).length : orgService.listClasses().length;

  return (
    <Layout role="teacher">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Teaching Calendar</h1>
          <p className="text-gray-600 mt-1">
            Attendance, billing, and tasks from your organisation ({classCount} class
            {classCount === 1 ? '' : 'es'}), plus term bands
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Calendar
              events={teacherEvents}
              termDates={uk2026TermDates}
              onDateClick={setSelectedDate}
              mode="teacher"
            />
          </div>

          <div className="space-y-4">
            <Card className="p-5">
              <h3 className="text-sm font-medium text-gray-600 mb-3">UK 2026 term dates</h3>
              <p className="text-xs text-gray-500 mb-3">Shared defaults</p>
              <div className="space-y-1.5 max-h-48 overflow-y-auto text-xs">
                {uk2026TermDates.map((t) => (
                  <div key={t.id} className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded flex-shrink-0 ${t.type === 'term' ? 'bg-blue-400' : t.type === 'holiday' ? 'bg-amber-400' : 'bg-emerald-400'}`}
                    />
                    <span className="text-gray-700">{t.name}</span>
                    <span className="text-gray-400">
                      {t.startDate} – {t.endDate}
                    </span>
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
                        <div className="font-medium text-gray-900">
                          {'title' in e ? e.title : e.name}
                        </div>
                        {'description' in e && e.description ? (
                          <div className="text-sm text-gray-500 mt-0.5">{e.description}</div>
                        ) : null}
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
