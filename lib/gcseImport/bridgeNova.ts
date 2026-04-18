import type {
  AttendanceRecord,
  Class,
  Enrollment,
  Family,
  OrgStudentRecord,
  PaymentFundingType,
  PaymentStatusType,
  Student,
} from '@/lib/orgTypes';
import {
  toAttendanceDocs,
  toBillingGroupDocs,
  toClosureDocs,
  toMonthlyBillingDocs,
  toStudentMasterDocs,
} from '@/lib/gcseImport/firestoreDocs';
import type { GcseMonthlyBillingRow, GcseStudentsMasterRow } from '@/lib/gcseImport/types';
import {
  parseGcseAttendanceCsv,
  parseGcseBillingGroupsCsv,
  parseGcseClassClosuresCsv,
  parseGcseMonthlyBillingCsv,
  parseGcseStudentsMasterCsv,
} from '@/lib/gcseImport/parsers';

export const GCSE_CLASS_ID = 'class_gcse_zain';

export function gcseStudentId(externalId: string): string {
  return `gcse_${externalId}`;
}

export function gcseFamilyId(billingGroupId: string): string {
  return `fam_gcse_${billingGroupId}`;
}

function displayName(s: GcseStudentsMasterRow): string {
  const f = s.studentFirstName ?? '';
  const l = s.studentLastName ?? '';
  const t = `${f} ${l}`.trim();
  return t || s.studentExternalId;
}

function defaultYearGroup(s: GcseStudentsMasterRow): 7 | 8 | 9 | 10 | 11 {
  return (s.yearGroup ?? 10) as 7 | 8 | 9 | 10 | 11;
}

function fundingToOrgType(ft: GcseStudentsMasterRow['fundingTypeNormalized']): PaymentFundingType {
  if (ft === 'private') return 'private';
  if (ft === 'universal_credit') return 'universal_credit';
  return 'private';
}

function pickLatestMonthlyForStudent(
  rows: GcseMonthlyBillingRow[],
  studentExternalId: string
): GcseMonthlyBillingRow | undefined {
  const list = rows.filter((r) => r.studentExternalId === studentExternalId);
  if (list.length === 0) return undefined;
  return [...list].sort((a, b) => (b.billingPeriod ?? '').localeCompare(a.billingPeriod ?? ''))[0];
}

function mapBillingToPaymentStatus(raw: string | null | undefined): PaymentStatusType | undefined {
  if (!raw) return undefined;
  const t = raw.trim().toLowerCase();
  if (t === 'paid') return 'paid';
  if (t === 'unpaid' || t === 'unsubmitted') return 'unpaid';
  if (t === 'partial') return 'partial';
  if (t === 'overdue') return 'overdue';
  if (t === 'flagged_in_progress') return 'unpaid';
  return undefined;
}

export interface GcseNovaIntegration {
  gcseClass: Class;
  students: Student[];
  families: Family[];
  enrollments: Enrollment[];
  attendance: AttendanceRecord[];
  orgStudentRecords: OrgStudentRecord[];
  firestore: {
    /** Starter-file mirror (not the operational \`attendance\` AttendanceRecord collection). */
    gcseAttendance: ReturnType<typeof toAttendanceDocs>;
    gcseStudentsMaster: ReturnType<typeof toStudentMasterDocs>;
    gcseBillingGroups: ReturnType<typeof toBillingGroupDocs>;
    gcseClassClosures: ReturnType<typeof toClosureDocs>;
    gcseMonthlyBilling: ReturnType<typeof toMonthlyBillingDocs>;
  };
}

export function buildGcseNovaIntegration(
  orgId: string,
  teacherId: string,
  files: {
    studentsMaster: string;
    billingGroups: string;
    attendance: string;
    closures: string;
    monthlyBilling: string;
  }
): GcseNovaIntegration {
  const pStudents = parseGcseStudentsMasterCsv(files.studentsMaster);
  const pGroups = parseGcseBillingGroupsCsv(files.billingGroups);
  const pAtt = parseGcseAttendanceCsv(files.attendance);
  const pClose = parseGcseClassClosuresCsv(files.closures);
  const pMonthly = parseGcseMonthlyBillingCsv(files.monthlyBilling);

  const monthlyRows = pMonthly.rows.map((r) => r.data);

  const families: Family[] = pGroups.rows.map((gr) => {
    const g = gr.data;
    const uc = g.fundingTypeNormalized === 'universal_credit';
    return {
      id: gcseFamilyId(g.billingGroupId),
      orgId,
      billingGroupId: g.billingGroupId,
      name: g.membersDescription ?? `Billing group ${g.billingGroupId}`,
      universalCreditActive: uc,
      ucNotes: g.specificBillingNotes ?? undefined,
      createdAt: '2026-03-01T10:00:00Z',
      updatedAt: '2026-03-18T10:00:00Z',
    };
  });

  const students: Student[] = pStudents.rows.map((sr) => {
    const s = sr.data;
    const y = defaultYearGroup(s);
    const fam = s.billingGroupId ? gcseFamilyId(s.billingGroupId) : undefined;
    return {
      id: gcseStudentId(s.studentExternalId),
      orgId,
      familyId: fam,
      studentExternalId: s.studentExternalId,
      billingGroupId: s.billingGroupId ?? undefined,
      dataCompleteness: s.dataCompleteness,
      name: displayName(s),
      yearGroup: y,
      subjects: ['Mathematics', 'English', 'Science'],
      mathsTier: 'Higher',
      createdAt: '2026-03-01T10:00:00Z',
      totalPoints: 0,
      level: 1,
    };
  });

  const gcseClass: Class = {
    id: GCSE_CLASS_ID,
    orgId,
    teacherId,
    name: 'GCSE class',
    subject: 'Mathematics',
    subjects: ['English', 'Mathematics', 'Science'],
    yearGroup: 10,
    active: true,
    createdAt: '2026-03-01T10:00:00Z',
  };

  const enrollments: Enrollment[] = students.map((st) => ({
    id: `en_${st.id}`,
    orgId,
    classId: GCSE_CLASS_ID,
    studentId: st.id,
    startDate: '2026-03-01',
  }));

  const attendance: AttendanceRecord[] = pAtt.rows.map((ar) => {
    const a = ar.data;
    const status: AttendanceRecord['status'] =
      a.statusNormalized === 'unknown' ? 'excused' : a.statusNormalized;
    const note =
      [a.notes, a.statusNormalized === 'unknown' ? 'import:attendance_status_unknown' : null]
        .filter(Boolean)
        .join(' | ') || undefined;
    return {
      id: a.attendanceExternalId,
      orgId,
      classId: GCSE_CLASS_ID,
      studentId: gcseStudentId(a.studentExternalId),
      sessionDate: a.sessionDate ?? '2026-01-01',
      status,
      note: a.sessionDate ? note : [note, 'import:missing_session_date'].filter(Boolean).join(' | '),
    };
  });

  const orgStudentRecords: OrgStudentRecord[] = students.map((st) => {
    const master = pStudents.rows.find((r) => r.data.studentExternalId === st.studentExternalId)?.data;
    const latest = pickLatestMonthlyForStudent(monthlyRows, st.studentExternalId ?? '');
    const flags: string[] = [];
    if (master?.dataCompleteness === 'provisional') flags.push('provisional_roster');
    if (master?.dataCompleteness === 'incomplete') flags.push('incomplete_roster');
    if (latest?.flaggedIssue) flags.push('uc_flagged');
    if (latest?.paymentStatusRaw === 'flagged_in_progress') flags.push('uc_flagged_in_progress');

    const ps = mapBillingToPaymentStatus(latest?.paymentStatusRaw);

    return {
      id: `osr_${st.id}`,
      orgId,
      studentId: st.id,
      paymentFundingType: master ? fundingToOrgType(master.fundingTypeNormalized) : 'private',
      expectedPaymentAmountPence: master?.monthlyFeePence ?? latest?.amountDuePence ?? undefined,
      amountOwedPence:
        latest?.amountDuePence != null && latest.paymentStatusRaw !== 'paid'
          ? latest.amountDuePence
          : master?.monthlyFeePence ?? undefined,
      paymentStatus: ps,
      expectedPaymentDate: latest?.expectedPaymentDate ?? undefined,
      invoiceTargetSubmissionDate: latest?.invoiceTargetSubmissionDate ?? undefined,
      statementReadyDate: latest?.statementReadyDate ?? undefined,
      billingWorkflowStatus: latest?.paymentStatusRaw ?? undefined,
      ucCaseFlagged: latest?.flaggedIssue ?? false,
      parentGuardianName: master?.parentName ?? undefined,
      parentGuardianEmail: master?.parentEmail ?? undefined,
      parentGuardianPhone: master?.parentPhone ?? undefined,
      flaggedIssues: flags.length ? flags : undefined,
      adminNotes: [master?.notes, latest?.notes].filter(Boolean).join('\n') || undefined,
      createdAt: '2026-03-01T10:00:00Z',
      updatedAt: '2026-03-18T10:00:00Z',
    };
  });

  return {
    gcseClass,
    students,
    families,
    enrollments,
    attendance,
    orgStudentRecords,
    firestore: {
      gcseStudentsMaster: toStudentMasterDocs(orgId, pStudents.rows),
      gcseBillingGroups: toBillingGroupDocs(orgId, pGroups.rows),
      gcseAttendance: toAttendanceDocs(orgId, pAtt.rows),
      gcseClassClosures: toClosureDocs(orgId, pClose.rows),
      gcseMonthlyBilling: toMonthlyBillingDocs(orgId, pMonthly.rows),
    },
  };
}
