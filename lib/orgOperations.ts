/**
 * Derived operations for Nova Org dashboard.
 * Computes attendance stats, payment summaries, flags, etc. from raw org data.
 */

import type {
  Student,
  OrgStudentRecord,
  Class,
  Teacher,
  Enrollment,
  AttendanceRecord,
  Payment,
  Invoice,
  StaffNote,
} from '@/lib/orgTypes';

const MARCH_2026_START = '2026-03-01';
const MARCH_2026_END = '2026-03-31';

export interface OrgDashboardStats {
  totalStudents: number;
  activeClasses: number;
  attendanceThisWeek: number;
  attendanceRiskCount: number;
  amountReceivedThisMonth: number;
  totalOutstandingPence: number;
  privatePayingCount: number;
  universalCreditCount: number;
  flaggedCount: number;
  contactsNeededCount: number;
}

export function computeDashboardStats(
  students: Student[],
  records: OrgStudentRecord[],
  classes: Class[],
  attendance: AttendanceRecord[],
  payments: Payment[],
  invoices: Invoice[],
  notes: StaffNote[]
): OrgDashboardStats {
  const thisMonthPayments = payments.filter(
    (p) => p.paidAt && p.paidAt >= MARCH_2026_START && p.paidAt <= MARCH_2026_END && p.status === 'succeeded'
  );
  const amountReceived = thisMonthPayments.reduce((s, p) => s + p.amountPence, 0);
  const totalOutstanding = records.reduce((s, r) => s + (r.amountOwedPence ?? 0), 0);
  const privateCount = records.filter((r) => r.paymentFundingType === 'private').length;
  const ucCount = records.filter((r) => r.paymentFundingType === 'universal_credit').length;
  const flagged = records.filter((r) => r.flaggedIssues && r.flaggedIssues.length > 0).length;
  const contactsNeeded = records.filter((r) => !r.parentGuardianPhone && !r.parentGuardianEmail).length;

  const weekStart = '2026-03-10';
  const weekEnd = '2026-03-14';
  const attendanceThisWeek = attendance.filter(
    (a) => a.sessionDate >= weekStart && a.sessionDate <= weekEnd && (a.status === 'present' || a.status === 'late')
  ).length;

  const atRisk = records.filter((r) => {
    const hrs = r.hoursCompleted ?? 0;
    const days = r.daysAttended ?? 0;
    return r.flaggedIssues?.includes('low_attendance') || (days < 4 && hrs < 8);
  }).length;

  return {
    totalStudents: students.length,
    activeClasses: classes.filter((c) => c.active).length,
    attendanceThisWeek,
    attendanceRiskCount: atRisk,
    amountReceivedThisMonth: amountReceived,
    totalOutstandingPence: totalOutstanding,
    privatePayingCount: privateCount,
    universalCreditCount: ucCount,
    flaggedCount: flagged,
    contactsNeededCount: contactsNeeded,
  };
}

export interface StudentWithOrgData extends Student {
  record?: OrgStudentRecord;
  teacherName?: string;
  className?: string;
  attendanceRate?: number;
  attendanceSessions?: number;
  totalSessions?: number;
}

export function enrichStudentsWithOrgData(
  students: Student[],
  records: OrgStudentRecord[],
  enrollments: Enrollment[],
  classes: Class[],
  teachers: Teacher[],
  attendance: AttendanceRecord[]
): StudentWithOrgData[] {
  const classMap = new Map(classes.map((c) => [c.id, c]));
  const teacherMap = new Map(teachers.map((t) => [t.id, t]));
  const recordMap = new Map(records.map((r) => [r.studentId, r]));

  const sessionsByStudent = new Map<string, { present: number; total: number }>();
  attendance.forEach((a) => {
    const cur = sessionsByStudent.get(a.studentId) ?? { present: 0, total: 0 };
    cur.total += 1;
    if (a.status === 'present' || a.status === 'late') cur.present += 1;
    sessionsByStudent.set(a.studentId, cur);
  });

  return students.map((s) => {
    const record = recordMap.get(s.id);
    const enr = enrollments.find((e) => e.studentId === s.id);
    const cls = enr ? classMap.get(enr.classId) : undefined;
    const teacher = cls ? teacherMap.get(cls.teacherId) : undefined;
    const sess = sessionsByStudent.get(s.id);
    const rate = sess && sess.total > 0 ? Math.round((sess.present / sess.total) * 100) : undefined;

    return {
      ...s,
      record,
      teacherName: teacher?.name,
      className: cls?.name,
      attendanceRate: rate,
      attendanceSessions: sess?.present,
      totalSessions: sess?.total,
    };
  });
}

export const FLAG_LABELS: Record<string, string> = {
  low_attendance: 'Low attendance',
  overdue_payment: 'Overdue payment',
  parent_contact_needed: 'Parent contact needed',
  follow_up_required: 'Follow-up required',
  safeguarding: 'Safeguarding concern',
  behaviour: 'Behaviour concern',
};

export function formatPence(pence: number): string {
  return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(pence / 100);
}
