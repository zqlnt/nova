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

function monthRangeISO(d: Date): { start: string; end: string } {
  const y = d.getFullYear();
  const m = d.getMonth();
  const start = `${y}-${String(m + 1).padStart(2, '0')}-01`;
  const last = new Date(y, m + 1, 0);
  const end = `${y}-${String(m + 1).padStart(2, '0')}-${String(last.getDate()).padStart(2, '0')}`;
  return { start, end };
}

/** Monday 00:00 and Sunday end of current week (ISO date strings yyyy-mm-dd). */
function thisWeekRangeISO(): { start: string; end: string } {
  const now = new Date();
  const day = now.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;
  const monday = new Date(now);
  monday.setDate(now.getDate() + diffToMonday);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  const fmt = (x: Date) =>
    `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, '0')}-${String(x.getDate()).padStart(2, '0')}`;
  return { start: fmt(monday), end: fmt(sunday) };
}

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
  const { start: monthStart, end: monthEnd } = monthRangeISO(new Date());
  const paymentDateStr = (p: Payment) => (p.paidAt || p.paymentDate || '').slice(0, 10);
  const thisMonthPayments = payments.filter((p) => {
    const d = paymentDateStr(p);
    return d.length >= 10 && d >= monthStart && d <= monthEnd && p.status === 'succeeded';
  });
  const amountReceived = thisMonthPayments.reduce((s, p) => s + p.amountPence, 0);
  const totalOutstanding = records.reduce((s, r) => s + (r.amountOwedPence ?? 0), 0);
  const privateCount = records.filter((r) => r.paymentFundingType === 'private').length;
  const ucCount = records.filter((r) => r.paymentFundingType === 'universal_credit').length;
  const flagged = records.filter((r) => r.flaggedIssues && r.flaggedIssues.length > 0).length;
  const contactsNeeded = records.filter((r) => !r.parentGuardianPhone && !r.parentGuardianEmail).length;

  const { start: weekStart, end: weekEnd } = thisWeekRangeISO();
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

function isoDate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/** Sum payments into W1–W4 buckets for the given calendar month (real data only). */
export function buildRevenueWeeksInMonth(
  payments: Payment[],
  monthRef: Date = new Date()
): { label: string; valuePence: number }[] {
  const y = monthRef.getFullYear();
  const m = monthRef.getMonth();
  const lastD = new Date(y, m + 1, 0).getDate();
  const monthStart = `${y}-${String(m + 1).padStart(2, '0')}-01`;
  const monthEnd = `${y}-${String(m + 1).padStart(2, '0')}-${String(lastD).padStart(2, '0')}`;

  const monthPayments = payments.filter((p) => {
    const d = (p.paidAt || p.paymentDate || '').slice(0, 10);
    return d.length >= 10 && d >= monthStart && d <= monthEnd && p.status === 'succeeded';
  });

  return [1, 2, 3, 4].map((w) => {
    const startDay = (w - 1) * 7 + 1;
    const endDay = Math.min(w * 7, lastD);
    let sum = 0;
    monthPayments.forEach((p) => {
      const day = parseInt((p.paidAt || p.paymentDate || '').slice(8, 10), 10);
      if (!Number.isFinite(day)) return;
      if (day >= startDay && day <= endDay) sum += p.amountPence;
    });
    return { label: `W${w}`, valuePence: sum };
  });
}

/** Last four rolling 7-day windows (oldest → newest), attendance rate % (0 if no sessions). */
export function buildAttendanceTrendWeeks(attendance: AttendanceRecord[]): { label: string; ratePct: number }[] {
  const blocks: { label: string; ratePct: number }[] = [];
  for (let w = 3; w >= 0; w--) {
    const end = new Date();
    end.setDate(end.getDate() - w * 7);
    const start = new Date(end);
    start.setDate(end.getDate() - 6);
    const s = isoDate(start);
    const e = isoDate(end);
    const rec = attendance.filter((a) => a.sessionDate >= s && a.sessionDate <= e);
    const ratePct =
      rec.length === 0
        ? 0
        : Math.round(
            (rec.filter((a) => a.status === 'present' || a.status === 'late').length / rec.length) * 100
          );
    blocks.push({ label: `W${4 - w}`, ratePct });
  }
  return blocks;
}

/** Session counts Mon–Sun for the current ISO week (real attendance only). */
export function buildWeekdayAttendanceBars(attendance: AttendanceRecord[]): { label: string; value: number }[] {
  const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const now = new Date();
  const day = now.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;
  const monday = new Date(now);
  monday.setDate(now.getDate() + diffToMonday);
  monday.setHours(0, 0, 0, 0);

  return labels.map((label, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const ds = isoDate(d);
    const value = attendance.filter(
      (a) => a.sessionDate === ds && (a.status === 'present' || a.status === 'late')
    ).length;
    return { label, value };
  });
}
