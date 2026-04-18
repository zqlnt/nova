/** Demo org data — GCSE class roster & ops from `data/gcse-import/*.csv` + Elevate Youth demo class. */
import generatedGcse from '@/lib/gcseImport/generatedIntegration';
import type {
  Organisation,
  OrgAdmin,
  Teacher,
  Class,
  Student,
  Family,
  OrgStudentRecord,
  Enrollment,
  TuitionPlan,
  BillingAccount,
  Invoice,
  Payment,
  AttendanceRecord,
  StaffNote,
  StaffTask,
} from '@/lib/orgTypes';

// ============================================
// T TUTORS - Organisation
// ============================================

export const seedOrg: Organisation = {
  id: 'org_ttutors',
  name: 'T Tutors',
  slug: 't-tutors',
  location: 'Muath Trust Centre',
  createdAt: '2026-03-01T10:00:00Z',
  settings: {
    timezone: 'Europe/London',
    academicYear: '2025-2026',
    defaultCurrency: 'GBP',
  },
};

export const seedAdmins: OrgAdmin[] = [
  { id: 'admin_001', orgId: seedOrg.id, name: 'Zain Gul', email: 'zain01gul@gmail.com', role: 'super_admin', active: true, createdAt: '2026-03-01T10:00:00Z' },
  { id: 'admin_002', orgId: seedOrg.id, name: 'Bilal Pilgrim', email: 'bilal@ttutors.co.uk', role: 'admin', active: true, createdAt: '2026-03-01T10:00:00Z' },
  { id: 'admin_003', orgId: seedOrg.id, name: 'Ibraheem Ridhwaan', email: 'ibraheem@ttutors.co.uk', role: 'admin', active: true, createdAt: '2026-03-01T10:00:00Z' },
];

export const seedTeachers: Teacher[] = [
  { id: 'teacher_zain', orgId: seedOrg.id, name: 'Zain Gul', email: 'zain01gul@gmail.com', active: true, createdAt: '2026-03-01T10:00:00Z' },
  { id: 'teacher_elevate', orgId: seedOrg.id, name: 'Elevate Lead', email: 'elevate@ttutors.co.uk', active: true, createdAt: '2026-03-01T10:00:00Z' },
];

export const seedClasses: Class[] = [
  generatedGcse.gcseClass,
  {
    id: 'class_elevate_youth',
    orgId: seedOrg.id,
    teacherId: seedTeachers[1].id,
    name: 'Elevate Youth Class (8–16)',
    subject: 'Mathematics',
    subjects: ['English', 'Mathematics', 'Science'],
    yearGroup: 10 as const,
    active: true,
    createdAt: '2026-03-02T10:00:00Z',
  },
];

/** Billing groups / households from GCSE starter + Elevate-only families. */
export const seedFamilies: Family[] = [
  ...generatedGcse.families,
  {
    id: 'fam_ey_ali',
    orgId: seedOrg.id,
    name: 'Ali household (Elevate)',
    primaryContactName: 'Sarah Ali',
    primaryContactPhone: '07400333444',
    primaryContactEmail: 'ali.family@example.com',
    universalCreditActive: false,
    createdAt: '2026-03-02T10:00:00Z',
    updatedAt: '2026-03-15T10:00:00Z',
  },
  {
    id: 'fam_ey_martina',
    orgId: seedOrg.id,
    name: 'Martina household (Elevate)',
    primaryContactName: 'James Martina',
    universalCreditActive: true,
    nextUcPaymentDate: '2026-04-12',
    nextJournalCheckDate: '2026-03-30',
    ucNotes: 'Journal check before month-end payroll.',
    createdAt: '2026-03-02T10:00:00Z',
    updatedAt: '2026-03-15T10:00:00Z',
  },
];

function gcseSid(ext: string): string {
  return `gcse_${ext}`;
}

// Elevate Youth Class (8–16) - full roster with unique IDs for duplicate names
const ELEVATE_YOUTH_NAMES = [
  'Aahil Ali', 'Aliza Ali', 'Ares Ali', 'Muhammed Subhan', 'Elijah Martina', 'Aliyah Martina',
  'Ibrahim Abdille', 'Suraya Abdi Adille', 'Magda Al-Ashai', 'Zaynab Al-Ashai', 'Faiza Al-Ashai',
  'Christobel Manu', 'Aisha Hassan', 'Tahreem Abbas', 'Rudaina Ahmed', 'Zaynab Wasim',
  'Muhammad Ismaeel', 'Hzar Abdirahman', 'Suraya Robinson', 'Saif', 'Aisha',
  'Mukhlis Mussa', 'Nesma Mussa', 'Khalid Mohammed', 'Fatima Mohammed', 'Yahya Mohammed',
  'Zain Patel', 'Annam Mehmood', 'Daniel Manu', 'Ismaeel', 'Saif', 'Idriss', 'Taqwa', 'Osman', 'Tahira',
];

const elevateYouthStudents: Student[] = ELEVATE_YOUTH_NAMES.map((name, i) => {
  const id = `s_ey_${String(i + 1).padStart(3, '0')}`;
  let familyId: string | undefined;
  if (i <= 2) familyId = 'fam_ey_ali';
  else if (i === 4 || i === 5) familyId = 'fam_ey_martina';
  return {
    id,
    orgId: seedOrg.id,
    familyId,
    name,
    yearGroup: 10 as const,
    subjects: ['Mathematics', 'English', 'Science'] as Array<'Mathematics' | 'English' | 'Science'>,
    mathsTier: 'Higher' as const,
    examBoard: undefined,
    literatureTexts: undefined,
    createdAt: '2026-03-02T10:00:00Z',
    totalPoints: 0,
    level: 1,
  };
});

// Org records for Elevate Youth (mix of private/UC, some flags)
const eyFunding: Array<'private' | 'universal_credit'> = [...Array(20)].map((_, i) => (i < 12 ? 'private' : 'universal_credit'));
const eyOrgRecords: OrgStudentRecord[] = elevateYouthStudents.map((s, i) => ({
  id: `osr_${s.id}`,
  orgId: seedOrg.id,
  studentId: s.id,
  daysAttended: 5 + (i % 8),
  hoursCompleted: 8 + (i % 12),
  amountOwedPence: i % 7 === 0 ? 3500 : 0,
  paymentFundingType: eyFunding[i],
  parentGuardianName: `Guardian of ${s.name}`,
  parentGuardianPhone: i < 25 ? `07${500000000 + i}00` : undefined,
  parentGuardianEmail: i < 20 ? `ey_parent${i + 1}@example.com` : undefined,
  flaggedIssues: i % 9 === 0 ? ['low_attendance'] : undefined,
  adminNotes: undefined,
  createdAt: '2026-03-02T10:00:00Z',
  updatedAt: '2026-03-15T10:00:00Z',
}));

export const seedStudents: Student[] = [...generatedGcse.students, ...elevateYouthStudents];
export const seedOrgStudentRecords: OrgStudentRecord[] = [...generatedGcse.orgStudentRecords, ...eyOrgRecords];

export const seedEnrollments: Enrollment[] = [
  ...generatedGcse.enrollments,
  ...elevateYouthStudents.map((s) => ({
    id: `en_${s.id}`,
    orgId: seedOrg.id,
    classId: seedClasses[1].id,
    studentId: s.id,
    startDate: '2026-03-02',
  })),
];

export const seedTuitionPlans: TuitionPlan[] = [
  { id: 'plan_weekly_1h', orgId: seedOrg.id, name: 'Weekly 1hr', pricePence: 3500, cadence: 'weekly', active: true },
  { id: 'plan_monthly_4h', orgId: seedOrg.id, name: 'Monthly 4hrs', pricePence: 12000, cadence: 'monthly', active: true },
];

export const seedBillingAccounts: BillingAccount[] = seedStudents.map((s) => {
  const rec = seedOrgStudentRecords.find((r) => r.studentId === s.id);
  return {
    id: `ba_${s.id}`,
    orgId: seedOrg.id,
    studentId: s.id,
    planId: seedTuitionPlans[0].id,
    status: 'active' as const,
    balancePence: rec?.amountOwedPence ?? 0,
  };
});

// Sample invoices (amounts in pence) — GCSE student ids from starter roster
export const seedInvoices: Invoice[] = [
  { id: 'inv_1', orgId: seedOrg.id, studentId: gcseSid('STU003'), periodStart: '2026-02-01', periodEnd: '2026-02-28', amountPence: 12500, status: 'overdue', dueDate: '2026-03-07' },
  { id: 'inv_2', orgId: seedOrg.id, studentId: gcseSid('STU014'), periodStart: '2026-02-01', periodEnd: '2026-02-28', amountPence: 7000, status: 'overdue', dueDate: '2026-03-01' },
  { id: 'inv_3', orgId: seedOrg.id, studentId: gcseSid('STU006'), periodStart: '2026-03-01', periodEnd: '2026-03-31', amountPence: 14000, status: 'sent', dueDate: '2026-04-07' },
  { id: 'inv_4', orgId: seedOrg.id, studentId: gcseSid('STU001'), periodStart: '2026-03-01', periodEnd: '2026-03-31', amountPence: 12000, status: 'paid', dueDate: '2026-04-07' },
  { id: 'inv_5', orgId: seedOrg.id, studentId: gcseSid('STU002'), periodStart: '2026-03-01', periodEnd: '2026-03-31', amountPence: 12000, status: 'paid', dueDate: '2026-04-07' },
  { id: 'inv_6', orgId: seedOrg.id, studentId: gcseSid('STU008'), periodStart: '2026-03-01', periodEnd: '2026-03-31', amountPence: 14000, status: 'partial', dueDate: '2026-04-07' },
];

export const seedPayments: Payment[] = [
  { id: 'pay_1', orgId: seedOrg.id, studentId: gcseSid('STU001'), invoiceId: 'inv_4', amountPence: 12000, status: 'succeeded', paidAt: '2026-03-05T10:00:00Z', paymentDate: '2026-03-05', paymentMethod: 'card', paymentType: 'private' },
  { id: 'pay_2', orgId: seedOrg.id, studentId: gcseSid('STU002'), invoiceId: 'inv_5', amountPence: 12000, status: 'succeeded', paidAt: '2026-03-08T14:00:00Z', paymentDate: '2026-03-08', paymentMethod: 'bank', paymentType: 'private' },
  { id: 'pay_3', orgId: seedOrg.id, studentId: gcseSid('STU004'), amountPence: 12500, status: 'succeeded', paidAt: '2026-03-10T09:00:00Z', paymentDate: '2026-03-10', paymentMethod: 'UC', paymentType: 'universal_credit' },
  { id: 'pay_4', orgId: seedOrg.id, studentId: gcseSid('STU005'), amountPence: 14000, status: 'succeeded', paidAt: '2026-03-12T11:00:00Z', paymentDate: '2026-03-12', paymentMethod: 'card', paymentType: 'private' },
];

// Attendance: last 2 weeks, mix of present/absent/late
const SESSION_DATES = ['2026-03-03', '2026-03-04', '2026-03-05', '2026-03-06', '2026-03-07', '2026-03-10', '2026-03-11', '2026-03-12', '2026-03-13', '2026-03-14'];

function genAttendance(students: Student[], classId: string): AttendanceRecord[] {
  return students.flatMap((s, si) =>
    SESSION_DATES.flatMap((d, di) => {
      const roll = (si * 7 + di * 3) % 10;
      let status: 'present' | 'absent' | 'late' | 'excused' = 'present';
      if (roll === 0) status = 'absent';
      else if (roll === 1) status = 'late';
      else if (roll === 2 && di < 3) status = 'absent';
      if (status === 'absent' && di >= 5) return [];
      return [{
        id: `att_${s.id}_${classId}_${d}`,
        orgId: seedOrg.id,
        classId,
        studentId: s.id,
        sessionDate: d,
        status,
        minutesAttended: status === 'present' || status === 'late' ? 60 : undefined,
      }];
    })
  );
}

export const seedAttendance: AttendanceRecord[] = [
  ...generatedGcse.attendance,
  ...genAttendance(elevateYouthStudents, seedClasses[1].id),
];

export const seedNotes: StaffNote[] = [
  { id: 'n1', orgId: seedOrg.id, studentId: gcseSid('STU014'), teacherId: seedTeachers[0].id, authorOrgAdminId: 'admin_001', createdAt: '2026-03-14T09:00:00Z', type: 'parent_call', risk: 'medium', text: 'Parent requested call re payment plan', pinned: true },
  { id: 'n2', orgId: seedOrg.id, studentId: gcseSid('STU002'), teacherId: seedTeachers[0].id, createdAt: '2026-03-13T14:00:00Z', type: 'follow_up', risk: 'low', text: 'Low attendance - 2 sessions missed this week' },
  { id: 'n3', orgId: seedOrg.id, studentId: gcseSid('STU008'), teacherId: seedTeachers[0].id, createdAt: '2026-03-12T10:00:00Z', type: 'follow_up', risk: 'low', text: 'Follow-up required' },
  { id: 'n4', orgId: seedOrg.id, studentId: gcseSid('STU012'), teacherId: seedTeachers[0].id, createdAt: '2026-03-11T11:00:00Z', type: 'intervention', risk: 'high', text: 'Multiple absences - welfare check needed' },
  { id: 'n5', orgId: seedOrg.id, familyId: 'fam_gcse_FAM003', authorOrgAdminId: 'admin_002', createdAt: '2026-03-10T15:00:00Z', type: 'follow_up', risk: 'medium', text: 'Household-level: confirm UC childcare costs submitted for both children.', pinned: false },
];

/** GCSE starter mirrors for Firestore (`orgs/{orgId}/gcse*`). */
export const seedGcseStudentsMasterDocs = generatedGcse.firestore.gcseStudentsMaster;
export const seedGcseBillingGroupsDocs = generatedGcse.firestore.gcseBillingGroups;
export const seedGcseAttendanceDocs = generatedGcse.firestore.gcseAttendance;
export const seedGcseClassClosuresDocs = generatedGcse.firestore.gcseClassClosures;
export const seedGcseMonthlyBillingDocs = generatedGcse.firestore.gcseMonthlyBilling;

export const seedStaffTasks: StaffTask[] = [
  {
    id: 'st_1',
    orgId: seedOrg.id,
    title: 'Check UC journal — Martina household (GCSE billing group)',
    dueDate: '2026-03-26',
    status: 'open',
    relatedFamilyId: 'fam_gcse_FAM003',
    assigneeTeacherId: seedTeachers[0].id,
    notes: 'After next UC payment date',
    createdAt: '2026-03-14T10:00:00Z',
    updatedAt: '2026-03-14T10:00:00Z',
  },
  {
    id: 'st_2',
    orgId: seedOrg.id,
    title: 'Chase overdue invoice',
    dueDate: '2026-03-24',
    status: 'open',
    relatedStudentId: gcseSid('STU003'),
    createdAt: '2026-03-14T10:00:00Z',
    updatedAt: '2026-03-14T10:00:00Z',
  },
  {
    id: 'st_3',
    orgId: seedOrg.id,
    title: 'Welcome pack — Elevate Ali siblings',
    dueDate: '2026-03-29',
    status: 'open',
    relatedFamilyId: 'fam_ey_ali',
    createdAt: '2026-03-14T10:00:00Z',
    updatedAt: '2026-03-14T10:00:00Z',
  },
];
