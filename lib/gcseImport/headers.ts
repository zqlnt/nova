/** Exact column names from GCSE starter CSVs / XLSX sheets — source of truth. */

export const GCSE_STUDENTS_MASTER_HEADERS = [
  'studentExternalId',
  'studentFirstName',
  'studentLastName',
  'academicYear',
  'className',
  'tutorName',
  'fundingType',
  'monthlyFee',
  'billingGroupId',
  'scheduleDays',
  'status',
  'joinDate',
  'parentName',
  'parentEmail',
  'parentPhone',
  'usualPaymentTiming',
  'expectedPaymentDay',
  'invoiceLeadDays',
  'statementLeadDays',
  'notes',
] as const;

export const GCSE_BILLING_GROUPS_HEADERS = [
  'billingGroupId',
  'fundingType',
  'billingType',
  'monthlyAmount',
  'usualPaymentTiming',
  'invoiceLeadDays',
  'statementLeadDays',
  'specificBillingNotes',
  'membersDescription',
] as const;

export const GCSE_ATTENDANCE_HEADERS = [
  'attendanceExternalId',
  'studentExternalId',
  'studentName',
  'className',
  'tutorName',
  'date',
  'status',
  'sourceName',
  'notes',
] as const;

export const GCSE_CLASS_CLOSURES_HEADERS = [
  'closureExternalId',
  'className',
  'tutorName',
  'startDate',
  'endDate',
  'status',
  'notes',
] as const;

export const GCSE_MONTHLY_BILLING_HEADERS = [
  'billingRecordExternalId',
  'billingPeriod',
  'billingGroupId',
  'studentExternalId',
  'studentDisplayName',
  'fundingType',
  'amountDue',
  'expectedPaymentDate',
  'invoiceTargetSubmissionDate',
  'statementReadyDate',
  'invoiceSubmittedDate',
  'amountPaid',
  'datePaid',
  'paymentStatus',
  'flaggedIssue',
  'notes',
] as const;

export type GcseStudentsMasterHeader = (typeof GCSE_STUDENTS_MASTER_HEADERS)[number];
export type GcseBillingGroupsHeader = (typeof GCSE_BILLING_GROUPS_HEADERS)[number];
export type GcseAttendanceHeader = (typeof GCSE_ATTENDANCE_HEADERS)[number];
export type GcseClassClosuresHeader = (typeof GCSE_CLASS_CLOSURES_HEADERS)[number];
export type GcseMonthlyBillingHeader = (typeof GCSE_MONTHLY_BILLING_HEADERS)[number];
