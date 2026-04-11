/**
 * Teacher calendar: merge org Firestore-derived events (attendance, billing, tasks)
 * with static org calendar entries, scoped to the signed-in teacher when possible.
 */

import type { CalendarEvent, OrgCalendarEvent } from '@/lib/calendarTypes';
import { buildOrgCalendarEvents } from '@/lib/orgCalendarEvents';
import { orgService } from '@/lib/orgService';
import { seedOrgCalendarEvents } from '@/lib/calendarSeed';
import { PRIMARY_OWNER_EMAIL } from '@/lib/userAccountSeed';
import {
  getTeacherIdForEmail,
  getClassIdsForTeacher,
  getStudentIdsForTeacherClasses,
} from '@/lib/teacherOrgData';

/** Keep org events relevant to this teacher’s classes and roster. */
export function filterOrgEventsForTeacher(
  events: OrgCalendarEvent[],
  teacherId: string,
  classIds: string[],
  studentIds: Set<string>
): OrgCalendarEvent[] {
  const classSet = new Set(classIds);
  const tasks = orgService.listStaffTasks();
  return events.filter((ev) => {
    if (ev.type === 'attendance_session' && ev.classId && classSet.has(ev.classId)) return true;
    if (
      (ev.type === 'payment_due' || ev.type === 'payment_received') &&
      ev.studentId &&
      studentIds.has(ev.studentId)
    )
      return true;
    if (ev.type === 'uc_payment' || ev.type === 'uc_journal_check') {
      return true;
    }
    if (ev.type === 'staff_task_due') {
      const taskId = ev.metadata?.taskId as string | undefined;
      const t = taskId ? tasks.find((x) => x.id === taskId) : undefined;
      if (!t) return false;
      if (t.assigneeTeacherId === teacherId) return true;
      if (!t.assigneeTeacherId && (t.relatedStudentId == null || studentIds.has(t.relatedStudentId)))
        return true;
      return false;
    }
    return false;
  });
}

/**
 * Full calendar for teacher: live org events (filtered) + static org trips/exams from seed.
 */
export function buildTeacherCalendarFromOrg(userEmail: string | null | undefined): CalendarEvent[] {
  const org = orgService.getOrganisation();
  let teacherId = getTeacherIdForEmail(userEmail);
  if (!teacherId && userEmail?.toLowerCase().trim() === PRIMARY_OWNER_EMAIL.toLowerCase()) {
    teacherId = 'teacher_zain';
  }

  const attendance = orgService.listAttendance();
  const invoices = orgService.listInvoices();
  const payments = orgService.listPayments();
  const students = orgService.listStudents().map((s) => ({ id: s.id, name: s.name }));
  const families = orgService.listFamilies();
  const staffTasks = orgService.listStaffTasks();

  const orgEvents = buildOrgCalendarEvents(
    org.id,
    attendance,
    invoices,
    payments,
    students,
    families,
    staffTasks
  );

  const staticOrg = seedOrgCalendarEvents.filter((e) => e.orgId === org.id);

  if (!teacherId) {
    return [...orgEvents, ...staticOrg].sort((a, b) => a.startDate.localeCompare(b.startDate));
  }

  const classIds = getClassIdsForTeacher(teacherId);
  const studentIds = getStudentIdsForTeacherClasses(classIds);
  const filtered = filterOrgEventsForTeacher(orgEvents, teacherId, classIds, studentIds);

  return [...filtered, ...staticOrg].sort((a, b) => a.startDate.localeCompare(b.startDate));
}
