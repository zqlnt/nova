'use client';

import { useState } from 'react';
import Layout from '@/components/Layout';
import Card from '@/components/Card';
import Calendar from '@/components/Calendar';
import { uk2026TermDates } from '@/lib/calendarSeed';
import { buildOrgCalendarEvents } from '@/lib/orgCalendarEvents';
import { orgService } from '@/lib/orgService';
import MathSymbolAnimation from '@/components/MathSymbolAnimation';

export default function OrgCalendarPage() {
  const org = orgService.getOrganisation();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const attendance = orgService.listAttendance();
  const invoices = orgService.listInvoices();
  const payments = orgService.listPayments();
  const students = orgService.listStudents().map((s) => ({ id: s.id, name: s.name }));
  const families = orgService.listFamilies();
  const staffTasks = orgService.listStaffTasks();

  const orgEvents = buildOrgCalendarEvents(org.id, attendance, invoices, payments, students, families, staffTasks);

  const selectedEvents = selectedDate
    ? [
        ...uk2026TermDates.filter((t) => t.startDate <= selectedDate && t.endDate >= selectedDate),
        ...orgEvents.filter((e) => e.startDate <= selectedDate && (e.endDate ?? e.startDate) >= selectedDate),
      ]
    : [];

  return (
    <Layout role="org">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">Calendar <MathSymbolAnimation size="sm" colorIndex={3} /></h1>
          <p className="text-gray-600 mt-1">Term dates, events, trips, and organisation schedule</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Calendar
              events={orgEvents}
              termDates={uk2026TermDates}
              onDateClick={setSelectedDate}
              mode="org"
            />
          </div>

          <div className="space-y-4">
            <Card className="p-5">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Legend</h3>
              <div className="flex flex-wrap gap-2 text-[10px] mb-4">
                <span className="px-2 py-0.5 rounded border bg-violet-100 border-violet-200 text-violet-800">UC payment</span>
                <span className="px-2 py-0.5 rounded border bg-fuchsia-100 border-fuchsia-200 text-fuchsia-800">Journal check</span>
                <span className="px-2 py-0.5 rounded border bg-orange-100 border-orange-200 text-orange-800">Staff task</span>
              </div>
            </Card>

            <Card className="p-5">
              <h3 className="text-sm font-medium text-gray-600 mb-3">UK 2026 term dates</h3>
              <p className="text-xs text-gray-500 mb-3">Editable defaults — varies by local authority</p>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {uk2026TermDates.map((t) => (
                  <div key={t.id} className="flex items-center gap-2 text-sm">
                    <span
                      className={`w-2 h-2 rounded flex-shrink-0 ${
                        t.type === 'term' ? 'bg-blue-400' : t.type === 'holiday' ? 'bg-amber-400' : 'bg-emerald-400'
                      }`}
                    />
                    <span className="text-gray-700">{t.name}</span>
                    <span className="text-gray-400 text-xs">
                      {t.startDate} – {t.endDate}
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            {selectedDate && (
              <Card className="p-5">
                <h3 className="text-sm font-medium text-gray-600 mb-3">{selectedDate}</h3>
                <div className="space-y-2">
                  {selectedEvents.length === 0 ? (
                    <p className="text-sm text-gray-500">No events</p>
                  ) : (
                    selectedEvents.map((e) => (
                      <div key={e.id} className="p-3 rounded-lg bg-gray-50 border border-gray-100">
                        {'type' in e && e.type && (
                          <span className="text-[10px] uppercase tracking-wide text-gray-500">{String(e.type).replace(/_/g, ' ')}</span>
                        )}
                        <div className="font-medium text-gray-900">{'title' in e ? e.title : e.name}</div>
                        {'description' in e && e.description && <div className="text-sm text-gray-500 mt-0.5">{e.description}</div>}
                        {'costPence' in e && e.costPence && (
                          <div className="text-sm text-gray-600 mt-1">£{(e.costPence / 100).toFixed(2)}</div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </Card>
            )}

            <Card className="p-5">
              <h3 className="text-sm font-medium text-gray-600 mb-3">Upcoming trips & events</h3>
              <div className="space-y-2">
                {orgEvents.slice(0, 5).map((e) => (
                  <div key={e.id} className="flex items-center justify-between text-sm">
                    <span className="text-gray-700">{e.title}</span>
                    <span className="text-gray-400 text-xs">{e.startDate}</span>
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
