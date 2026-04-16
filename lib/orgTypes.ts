export type ID = string;

export type Currency = 'GBP';

export type PaymentFundingType = 'private' | 'universal_credit';

/** Payment status for student/invoice: paid, unpaid, partial, overdue */
export type PaymentStatusType = 'paid' | 'unpaid' | 'partial' | 'overdue';

/** Nova user roles - for future Firebase auth */
export type NovaUserRole = 'student' | 'teacher' | 'org';

export interface Organisation {
  id: ID;
  name: string;
  slug: string;
  location?: string;
  createdAt: string;
  settings: OrgSettings;
}

export interface OrgSettings {
  timezone: string;
  academicYear: string;
  defaultCurrency: Currency;
}

export interface OrgAdmin {
  id: ID;
  orgId: ID;
  name: string;
  email: string;
  role: 'admin' | 'super_admin';
  active: boolean;
  createdAt: string;
}

export interface Teacher {
  id: ID;
  orgId: ID;
  name: string;
  email: string;
  active: boolean;
  createdAt: string;
}

/** Household / billing unit for daycare & tuition ops (Nova Org only). */
export interface Family {
  id: ID;
  orgId: ID;
  /** Display name e.g. "Smith household" */
  name: string;
  primaryContactName?: string;
  primaryContactPhone?: string;
  primaryContactEmail?: string;
  addressLine1?: string;
  addressLine2?: string;
  postcode?: string;
  /** Universal Credit — expected payment into account */
  nextUcPaymentDate?: string; // YYYY-MM-DD
  /** When to review parent’s UC journal / childcare element */
  nextJournalCheckDate?: string; // YYYY-MM-DD
  universalCreditActive?: boolean;
  ucNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Student {
  id: ID;
  orgId: ID;
  /** Links child to household (Nova Org). Optional for legacy rows. */
  familyId?: ID;
  name: string;
  age?: number;
  yearGroup: 7 | 8 | 9 | 10 | 11;
  subjects: Array<'Mathematics' | 'English' | 'Science'>;
  mathsTier?: 'Foundation' | 'Higher' | 'Unsure';
  examBoard?: string;
  literatureTexts?: string[];
  createdAt: string;
  totalPoints: number;
  level: number;
}

export interface Class {
  id: ID;
  orgId: ID;
  teacherId: ID;
  name: string;
  subject: 'Mathematics' | 'English' | 'Science';
  subjects: string[];
  yearGroup: 7 | 8 | 9 | 10 | 11;
  active: boolean;
  createdAt: string;
}

export interface OrgStudentRecord {
  id: ID;
  orgId: ID;
  studentId: ID;
  daysAttended?: number;
  hoursCompleted?: number;
  amountOwedPence?: number;
  expectedPaymentAmountPence?: number;
  paymentDueDate?: string;
  paymentPaidDate?: string;
  paymentStatus?: PaymentStatusType;
  paymentFundingType?: PaymentFundingType;
  parentGuardianName?: string;
  parentGuardianPhone?: string;
  parentGuardianEmail?: string;
  flaggedIssues?: string[];
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Enrollment {
  id: ID;
  orgId: ID;
  classId: ID;
  studentId: ID;
  startDate: string; // YYYY-MM-DD
  endDate?: string; // YYYY-MM-DD
}

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';

export interface AttendanceRecord {
  id: ID;
  orgId: ID;
  classId: ID;
  studentId: ID;
  sessionDate: string; // YYYY-MM-DD
  status: AttendanceStatus;
  minutesAttended?: number;
  note?: string;
}

export type NoteType = 'note' | 'parent_call' | 'intervention' | 'follow_up';
export type RiskLevel = 'low' | 'medium' | 'high';

/** Follow-up / operational notes (Nova Org). Use studentId and/or familyId. */
export interface StaffNote {
  id: ID;
  orgId: ID;
  /** Child-specific follow-up */
  studentId?: ID;
  /** Household-level follow-up */
  familyId?: ID;
  teacherId?: ID;
  authorOrgAdminId?: ID;
  createdAt: string;
  type: NoteType;
  risk?: RiskLevel;
  text: string;
  pinned?: boolean;
}

export type StaffTaskStatus = 'open' | 'done' | 'cancelled';

/** Staff operational tasks & reminders (Nova Org). */
export interface StaffTask {
  id: ID;
  orgId: ID;
  title: string;
  dueDate?: string; // YYYY-MM-DD
  status: StaffTaskStatus;
  assigneeTeacherId?: ID;
  relatedStudentId?: ID;
  relatedFamilyId?: ID;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TuitionPlan {
  id: ID;
  orgId: ID;
  name: string;
  pricePence: number;
  cadence: 'weekly' | 'monthly';
  active: boolean;
}

export interface BillingAccount {
  id: ID;
  orgId: ID;
  studentId: ID;
  planId: ID;
  status: 'active' | 'paused' | 'cancelled';
  balancePence: number;
}

export interface Invoice {
  id: ID;
  orgId: ID;
  studentId: ID;
  periodStart: string;
  periodEnd: string;
  amountPence: number;
  status: 'draft' | 'sent' | 'paid' | 'partial' | 'overdue';
  dueDate: string;
}

export interface Payment {
  id: ID;
  orgId: ID;
  studentId: ID;
  invoiceId?: ID;
  amountPence: number;
  status: 'succeeded' | 'failed' | 'pending';
  paidAt?: string;
  paymentDate?: string;
  paymentMethod?: string;
  paymentType?: PaymentFundingType;
  note?: string;
}

// ============ INCOME (Dec–Mar for dashboards/reports) ============

export interface IncomeRecord {
  id: ID;
  orgId: ID;
  month: string;
  year: number;
  amountPence: number;
  source: 'tuition' | 'late_fees' | 'other';
  studentId?: ID;
  paymentId?: ID;
  receivedAt?: string;
  notes?: string;
  createdAt: string;
}

// ============ EXPENSES (by category, where money went) ============

export interface Expense {
  id: ID;
  orgId: ID;
  name: string;
  category: string;
  amountPence: number;
  date: string;
  recipient?: string;
  notes?: string;
  createdAt: string;
}

// ============ USER ACCOUNTS (Nova Student / Teacher / Org) ============

export interface UserAccount {
  id: ID;
  email: string;
  role: NovaUserRole;
  orgId?: ID;
  studentId?: ID;
  teacherId?: ID;
  /** Optional Firebase Auth uid for admin scripts / support */
  firebaseUid?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

