/**
 * Build org calendar events from live data (attendance, invoices, payments)
 * plus static events. Used by the Calendar page.
 */

import type { OrgCalendarEvent } from '@/lib/calendarTypes';
import type { AttendanceRecord, Invoice, Payment, Family, StaffTask } from '@/lib/orgTypes';
import { seedOrgCalendarEvents } from '@/lib/calendarSeed';

export function buildOrgCalendarEvents(
  orgId: string,
  attendance: AttendanceRecord[],
  invoices: Invoice[],
  payments: Payment[],
  students: { id: string; name: string }[],
  families: Family[] = [],
  staffTasks: StaffTask[] = []
): OrgCalendarEvent[] {
  const events: OrgCalendarEvent[] = [...seedOrgCalendarEvents.filter((e) => e.orgId === orgId)];

  const studentMap = new Map(students.map((s) => [s.id, s.name]));

  attendance
    .filter((a) => a.status === 'present' || a.status === 'late')
    .forEach((a, i) => {
      const name = studentMap.get(a.studentId) ?? 'Student';
      events.push({
        id: `att_ev_${a.id}`,
        orgId,
        title: `Attendance: ${name}`,
        startDate: a.sessionDate,
        type: 'attendance_session',
        classId: a.classId,
        studentId: a.studentId,
      });
    });

  invoices.forEach((inv) => {
    const name = studentMap.get(inv.studentId) ?? 'Student';
    events.push({
      id: `due_ev_${inv.id}`,
      orgId,
      title: `Due: ${name} – £${(inv.amountPence / 100).toFixed(0)}`,
      startDate: inv.dueDate,
      type: 'payment_due',
      invoiceId: inv.id,
      studentId: inv.studentId,
      costPence: inv.amountPence,
    });
  });

  payments
    .filter((p) => p.paidAt || p.paymentDate)
    .forEach((p) => {
      const dateStr = p.paymentDate ?? p.paidAt?.slice(0, 10);
      if (!dateStr) return;
      const name = studentMap.get(p.studentId) ?? 'Student';
      events.push({
        id: `recv_ev_${p.id}`,
        orgId,
        title: `Received: ${name} – £${(p.amountPence / 100).toFixed(0)}`,
        startDate: dateStr,
        type: 'payment_received',
        paymentId: p.id,
        studentId: p.studentId,
        costPence: p.amountPence,
      });
    });

  families
    .filter((f) => f.orgId === orgId)
    .forEach((f) => {
      if (f.nextUcPaymentDate) {
        events.push({
          id: `uc_pay_${f.id}`,
          orgId,
          title: `UC payment due: ${f.name}`,
          startDate: f.nextUcPaymentDate,
          type: 'uc_payment',
          metadata: { familyId: f.id },
        });
      }
      if (f.nextJournalCheckDate) {
        events.push({
          id: `uc_journal_${f.id}`,
          orgId,
          title: `UC journal check: ${f.name}`,
          startDate: f.nextJournalCheckDate,
          type: 'uc_journal_check',
          metadata: { familyId: f.id },
        });
      }
    });

  staffTasks
    .filter((t) => t.orgId === orgId && t.status === 'open' && t.dueDate)
    .forEach((t) => {
      events.push({
        id: `staff_task_${t.id}`,
        orgId,
        title: `Task: ${t.title}`,
        startDate: t.dueDate!,
        type: 'staff_task_due',
        metadata: { taskId: t.id, relatedFamilyId: t.relatedFamilyId, relatedStudentId: t.relatedStudentId },
      });
    });

  return events.sort((a, b) => a.startDate.localeCompare(b.startDate));
}
