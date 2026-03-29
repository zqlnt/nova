/**
 * T Tutors - Muath Trust Centre
 * First real organisation, class, and students
 */

import type {
  Organisation,
  OrgAdmin,
  Teacher,
  Class,
  Student,
  Enrollment,
  OrgStudentRecord,
  AttendanceRecord,
  StaffNote,
  BillingAccount,
  Invoice,
  Payment,
  TuitionPlan,
} from '@/lib/orgTypes';

const ORG_ID = 'org_ttutors';
const TEACHER_ZAIN = 'teacher_zain_gul';
const CLASS_ZAIN = 'class_zain_first';

export const ttutorsOrg: Organisation = {
  id: ORG_ID,
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

export const ttutorsAdmins: OrgAdmin[] = [
  { id: 'admin_zain', orgId: ORG_ID, name: 'Zain Gul', email: 'zain@ttutors.co.uk', role: 'super_admin', active: true, createdAt: '2026-03-01T10:00:00Z' },
  { id: 'admin_bilal', orgId: ORG_ID, name: 'Bilal Pilgrim', email: 'bilal@ttutors.co.uk', role: 'admin', active: true, createdAt: '2026-03-01T10:00:00Z' },
  { id: 'admin_ibraheem', orgId: ORG_ID, name: 'Ibraheem Ridhwaan', email: 'ibraheem@ttutors.co.uk', role: 'admin', active: true, createdAt: '2026-03-01T10:00:00Z' },
];

export const ttutorsTeachers: Teacher[] = [
  { id: TEACHER_ZAIN, orgId: ORG_ID, name: 'Zain Gul', email: 'zain@ttutors.co.uk', active: true, createdAt: '2026-03-01T10:00:00Z' },
];

export const ttutorsClasses: Class[] = [
  {
    id: CLASS_ZAIN,
    orgId: ORG_ID,
    teacherId: TEACHER_ZAIN,
    name: "Zain Gul's Class",
    subject: 'Mathematics',
    subjects: ['English', 'Mathematics', 'Science'],
    yearGroup: 10,
    active: true,
    createdAt: '2026-03-01T10:00:00Z',
  },
];

const STUDENT_NAMES = [
  'Aahil Ali',
  'Aliza Ali',
  'Ares Ali',
  'Muhammed Subhan',
  'Elijah Martina',
  'Aliyah Martina',
  'Ibrahim Abdille',
  'Suraya Abdi Adille',
  'Christobel Manu',
  'Aisha Hassan',
  'Tahreem Abbas',
  'Rudaina Ahmed',
  'Zaynab Wasim',
  'Muhammad Ismaeel',
  'Hzar Abdirahman',
  'Suraya Robinson',
  'Zain Patel',
  'Faiza Al-Ashai',
  'Annam Mehmood',
];

function uid(prefix: string, i: number) {
  return `${prefix}_${String(i).padStart(3, '0')}`;
}

export const ttutorsStudents: Student[] = STUDENT_NAMES.map((name, i) => ({
  id: uid('s', i + 1),
  orgId: ORG_ID,
  name,
  yearGroup: 10,
  subjects: ['English', 'Mathematics', 'Science'],
  mathsTier: 'Higher' as const,
  examBoard: undefined,
  literatureTexts: undefined,
  createdAt: '2026-03-01T10:00:00Z',
  totalPoints: 0,
  level: 1,
}));

export const ttutorsEnrollments: Enrollment[] = ttutorsStudents.map((s, i) => ({
  id: uid('en', i + 1),
  orgId: ORG_ID,
  classId: CLASS_ZAIN,
  studentId: s.id,
  startDate: '2026-03-01',
}));

export const ttutorsOrgRecords: OrgStudentRecord[] = ttutorsStudents.map((s) => ({
  id: `orgrec_${s.id}`,
  orgId: ORG_ID,
  studentId: s.id,
  daysAttended: undefined,
  hoursCompleted: undefined,
  amountOwedPence: undefined,
  paymentFundingType: undefined,
  parentGuardianName: undefined,
  parentGuardianPhone: undefined,
  parentGuardianEmail: undefined,
  flaggedIssues: undefined,
  adminNotes: undefined,
  createdAt: '2026-03-01T10:00:00Z',
  updatedAt: '2026-03-01T10:00:00Z',
}));

export const ttutorsTuitionPlans: TuitionPlan[] = [
  { id: 'plan_tt_weekly', orgId: ORG_ID, name: 'Weekly', pricePence: 3500, cadence: 'weekly', active: true },
  { id: 'plan_tt_monthly', orgId: ORG_ID, name: 'Monthly', pricePence: 12000, cadence: 'monthly', active: true },
];

export const ttutorsBillingAccounts: BillingAccount[] = ttutorsStudents.map((s) => ({
  id: `ba_${s.id}`,
  orgId: ORG_ID,
  studentId: s.id,
  planId: ttutorsTuitionPlans[0].id,
  status: 'active' as const,
  balancePence: 0,
}));

export const ttutorsAttendance: AttendanceRecord[] = [];
export const ttutorsNotes: StaffNote[] = [];
export const ttutorsInvoices: Invoice[] = [];
export const ttutorsPayments: Payment[] = [];
