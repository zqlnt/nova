/**
 * Import-ready types for GCSE starter CSVs (column names match files exactly on the wire).
 * Parsed/normalized shapes add derived fields and never drop incomplete rows.
 */

/** Raw row as key-value from CSV (empty string for blank cells). */
export type GcseRawRow = Record<string, string>;

export interface GcseRowResult<T> {
  rowIndex: number;
  data: T;
  /** Human-readable issues; row is still imported when non-empty. */
  issues: string[];
}

// --- Students master (gcse_students_master.csv) ---

export interface GcseStudentsMasterRow {
  studentExternalId: string;
  studentFirstName: string | null;
  studentLastName: string | null;
  academicYearRaw: string | null;
  /** Parsed 7–11 when derivable from e.g. "Yr 11" */
  yearGroup: 7 | 8 | 9 | 10 | 11 | null;
  className: string | null;
  tutorName: string | null;
  fundingTypeRaw: string | null;
  fundingTypeNormalized: 'private' | 'universal_credit' | 'unknown';
  monthlyFeeRaw: string | null;
  /** Whole GBP amount → pence (e.g. 120 → 12000); null if unparseable */
  monthlyFeePence: number | null;
  billingGroupId: string | null;
  scheduleDays: string | null;
  statusRaw: string | null;
  joinDate: string | null;
  parentName: string | null;
  parentEmail: string | null;
  parentPhone: string | null;
  usualPaymentTiming: string | null;
  expectedPaymentDay: string | null;
  invoiceLeadDays: string | null;
  statementLeadDays: string | null;
  notes: string | null;
  dataCompleteness: 'complete' | 'provisional' | 'incomplete';
}

// --- Billing groups (gcse_billing_groups.csv) ---

export interface GcseBillingGroupRow {
  billingGroupId: string;
  fundingTypeRaw: string | null;
  fundingTypeNormalized: 'private' | 'universal_credit' | 'unknown';
  billingType: string | null;
  monthlyAmountRaw: string | null;
  monthlyAmountPence: number | null;
  usualPaymentTiming: string | null;
  invoiceLeadDays: string | null;
  statementLeadDays: string | null;
  specificBillingNotes: string | null;
  membersDescription: string | null;
}

// --- Attendance (gcse_attendance_mar_apr_2026.csv) ---

export interface GcseAttendanceRow {
  attendanceExternalId: string;
  studentExternalId: string;
  studentName: string | null;
  className: string | null;
  tutorName: string | null;
  date: string | null;
  /** ISO YYYY-MM-DD when valid */
  sessionDate: string | null;
  statusRaw: string | null;
  statusNormalized: 'present' | 'absent' | 'late' | 'excused' | 'unknown';
  sourceName: string | null;
  notes: string | null;
}

// --- Class closures (gcse_class_closures.csv) ---

export interface GcseClassClosureRow {
  closureExternalId: string;
  className: string | null;
  tutorName: string | null;
  startDate: string | null;
  endDate: string | null;
  status: string | null;
  notes: string | null;
}

// --- Monthly billing / UC workflow (gcse_monthly_billing_starter_mar_apr_2026.csv) ---

export interface GcseMonthlyBillingRow {
  billingRecordExternalId: string;
  billingPeriod: string | null;
  billingGroupId: string | null;
  studentExternalId: string | null;
  studentDisplayName: string | null;
  fundingTypeRaw: string | null;
  fundingTypeNormalized: 'private' | 'universal_credit' | 'unknown';
  amountDueRaw: string | null;
  amountDuePence: number | null;
  expectedPaymentDate: string | null;
  invoiceTargetSubmissionDate: string | null;
  statementReadyDate: string | null;
  invoiceSubmittedDate: string | null;
  amountPaidRaw: string | null;
  amountPaidPence: number | null;
  datePaid: string | null;
  paymentStatusRaw: string | null;
  flaggedIssueRaw: string | null;
  /** true when flaggedIssue column indicates a case flag (e.g. "yes") */
  flaggedIssue: boolean;
  notes: string | null;
}

/** Firestore-aligned doc (orgs/{orgId}/gcseStudentsMaster/{studentExternalId}) */
export interface GcseStudentMasterFirestoreDoc {
  id: string;
  orgId: string;
  source: 'gcse_starter_csv';
  importedAt: string;
  importIssues: string[];
  row: GcseStudentsMasterRow;
}

export interface GcseBillingGroupFirestoreDoc {
  id: string;
  orgId: string;
  source: 'gcse_starter_csv';
  importedAt: string;
  importIssues: string[];
  row: GcseBillingGroupRow;
}

export interface GcseAttendanceFirestoreDoc {
  id: string;
  orgId: string;
  source: 'gcse_starter_csv';
  importedAt: string;
  importIssues: string[];
  row: GcseAttendanceRow;
}

export interface GcseClassClosureFirestoreDoc {
  id: string;
  orgId: string;
  source: 'gcse_starter_csv';
  importedAt: string;
  importIssues: string[];
  row: GcseClassClosureRow;
}

export interface GcseMonthlyBillingFirestoreDoc {
  id: string;
  orgId: string;
  source: 'gcse_starter_csv';
  importedAt: string;
  importIssues: string[];
  row: GcseMonthlyBillingRow;
}
