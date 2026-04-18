import { parseCsv, rowsToObjects } from '@/lib/gcseImport/csv';
import {
  GCSE_ATTENDANCE_HEADERS,
  GCSE_BILLING_GROUPS_HEADERS,
  GCSE_CLASS_CLOSURES_HEADERS,
  GCSE_MONTHLY_BILLING_HEADERS,
  GCSE_STUDENTS_MASTER_HEADERS,
} from '@/lib/gcseImport/headers';
import {
  headersMatch,
  inferDataCompleteness,
  normalizeAttendanceStatus,
  normalizeFundingType,
  parseFlaggedIssue,
  parseGbpToPence,
  parseIsoDate,
  parseYearGroupFromAcademicYear,
  trimToNull,
} from '@/lib/gcseImport/parseHelpers';
import type {
  GcseAttendanceRow,
  GcseBillingGroupRow,
  GcseClassClosureRow,
  GcseMonthlyBillingRow,
  GcseRawRow,
  GcseRowResult,
  GcseStudentsMasterRow,
} from '@/lib/gcseImport/types';

export interface GcseParseFileResult<T> {
  file: string;
  headerOk: boolean;
  headerIssues: string[];
  rows: GcseRowResult<T>[];
}

function fileResult<T>(
  file: string,
  headerOk: boolean,
  headerIssues: string[],
  rows: GcseRowResult<T>[]
): GcseParseFileResult<T> {
  return { file, headerOk, headerIssues, rows };
}

export function parseGcseStudentsMasterCsv(content: string, file = 'gcse_students_master.csv'): GcseParseFileResult<GcseStudentsMasterRow> {
  const grid = parseCsv(content.trim());
  if (grid.length === 0) {
    return fileResult(file, false, ['empty_file'], []);
  }
  const [headerRow, ...dataRows] = grid;
  const issues: string[] = [];
  if (!headersMatch(headerRow, GCSE_STUDENTS_MASTER_HEADERS)) {
    issues.push('header_mismatch_expected_gcse_students_master_columns');
  }
  const objects = rowsToObjects(headerRow, dataRows);
  const out: GcseRowResult<GcseStudentsMasterRow>[] = objects.map((raw, idx) =>
    parseStudentsMasterRow(raw, idx + 2)
  );
  return fileResult(file, issues.length === 0, issues, out);
}

function parseStudentsMasterRow(raw: GcseRawRow, rowIndex: number): GcseRowResult<GcseStudentsMasterRow> {
  const issues: string[] = [];
  const id = trimToNull(raw.studentExternalId);
  if (!id) issues.push('missing_studentExternalId');

  const { year, issues: yIssues } = parseYearGroupFromAcademicYear(trimToNull(raw.academicYear));
  issues.push(...yIssues);

  const fundNorm = normalizeFundingType(trimToNull(raw.fundingType));
  const { pence: feePence, issues: feeIssues } = parseGbpToPence(trimToNull(raw.monthlyFee));
  issues.push(...feeIssues);

  const completeness = inferDataCompleteness(trimToNull(raw.notes), year, fundNorm, feePence);
  if (completeness !== 'complete') issues.push(`data_completeness:${completeness}`);

  const data: GcseStudentsMasterRow = {
    studentExternalId: id ?? `__row_${rowIndex}`,
    studentFirstName: trimToNull(raw.studentFirstName),
    studentLastName: trimToNull(raw.studentLastName),
    academicYearRaw: trimToNull(raw.academicYear),
    yearGroup: year,
    className: trimToNull(raw.className),
    tutorName: trimToNull(raw.tutorName),
    fundingTypeRaw: trimToNull(raw.fundingType),
    fundingTypeNormalized: fundNorm,
    monthlyFeeRaw: trimToNull(raw.monthlyFee),
    monthlyFeePence: feePence,
    billingGroupId: trimToNull(raw.billingGroupId),
    scheduleDays: trimToNull(raw.scheduleDays),
    statusRaw: trimToNull(raw.status),
    joinDate: trimToNull(raw.joinDate),
    parentName: trimToNull(raw.parentName),
    parentEmail: trimToNull(raw.parentEmail),
    parentPhone: trimToNull(raw.parentPhone),
    usualPaymentTiming: trimToNull(raw.usualPaymentTiming),
    expectedPaymentDay: trimToNull(raw.expectedPaymentDay),
    invoiceLeadDays: trimToNull(raw.invoiceLeadDays),
    statementLeadDays: trimToNull(raw.statementLeadDays),
    notes: trimToNull(raw.notes),
    dataCompleteness: completeness,
  };
  return { rowIndex, data, issues };
}

export function parseGcseBillingGroupsCsv(content: string, file = 'gcse_billing_groups.csv'): GcseParseFileResult<GcseBillingGroupRow> {
  const grid = parseCsv(content.trim());
  if (grid.length === 0) {
    return fileResult(file, false, ['empty_file'], []);
  }
  const [headerRow, ...dataRows] = grid;
  const hi: string[] = [];
  if (!headersMatch(headerRow, GCSE_BILLING_GROUPS_HEADERS)) {
    hi.push('header_mismatch_expected_gcse_billing_groups_columns');
  }
  const objects = rowsToObjects(headerRow, dataRows);
  const out = objects.map((raw, idx) => parseBillingGroupRow(raw, idx + 2));
  return fileResult(file, hi.length === 0, hi, out);
}

function parseBillingGroupRow(raw: GcseRawRow, rowIndex: number): GcseRowResult<GcseBillingGroupRow> {
  const issues: string[] = [];
  const id = trimToNull(raw.billingGroupId);
  if (!id) issues.push('missing_billingGroupId');
  const fundNorm = normalizeFundingType(trimToNull(raw.fundingType));
  const { pence, issues: pi } = parseGbpToPence(trimToNull(raw.monthlyAmount));
  issues.push(...pi);
  if (pence == null && trimToNull(raw.monthlyAmount)) issues.push('monthly_amount_unparsed_kept_raw');

  const data: GcseBillingGroupRow = {
    billingGroupId: id ?? `__bg_${rowIndex}`,
    fundingTypeRaw: trimToNull(raw.fundingType),
    fundingTypeNormalized: fundNorm,
    billingType: trimToNull(raw.billingType),
    monthlyAmountRaw: trimToNull(raw.monthlyAmount),
    monthlyAmountPence: pence,
    usualPaymentTiming: trimToNull(raw.usualPaymentTiming),
    invoiceLeadDays: trimToNull(raw.invoiceLeadDays),
    statementLeadDays: trimToNull(raw.statementLeadDays),
    specificBillingNotes: trimToNull(raw.specificBillingNotes),
    membersDescription: trimToNull(raw.membersDescription),
  };
  return { rowIndex, data, issues };
}

export function parseGcseAttendanceCsv(content: string, file = 'gcse_attendance_mar_apr_2026.csv'): GcseParseFileResult<GcseAttendanceRow> {
  const grid = parseCsv(content.trim());
  if (grid.length === 0) {
    return fileResult(file, false, ['empty_file'], []);
  }
  const [headerRow, ...dataRows] = grid;
  const hi: string[] = [];
  if (!headersMatch(headerRow, GCSE_ATTENDANCE_HEADERS)) {
    hi.push('header_mismatch_expected_gcse_attendance_columns');
  }
  const objects = rowsToObjects(headerRow, dataRows);
  const out = objects.map((raw, idx) => parseAttendanceRow(raw, idx + 2));
  return fileResult(file, hi.length === 0, hi, out);
}

function parseAttendanceRow(raw: GcseRawRow, rowIndex: number): GcseRowResult<GcseAttendanceRow> {
  const issues: string[] = [];
  const aid = trimToNull(raw.attendanceExternalId);
  const sid = trimToNull(raw.studentExternalId);
  if (!aid) issues.push('missing_attendanceExternalId');
  if (!sid) issues.push('missing_studentExternalId');
  const { iso, issues: di } = parseIsoDate(trimToNull(raw.date));
  issues.push(...di);
  const st = normalizeAttendanceStatus(trimToNull(raw.status));
  if (st === 'unknown' && trimToNull(raw.status)) issues.push(`attendance_status_unmapped:${raw.status}`);

  const data: GcseAttendanceRow = {
    attendanceExternalId: aid ?? `__att_${rowIndex}`,
    studentExternalId: sid ?? `__stu_${rowIndex}`,
    studentName: trimToNull(raw.studentName),
    className: trimToNull(raw.className),
    tutorName: trimToNull(raw.tutorName),
    date: trimToNull(raw.date),
    sessionDate: iso,
    statusRaw: trimToNull(raw.status),
    statusNormalized: st,
    sourceName: trimToNull(raw.sourceName),
    notes: trimToNull(raw.notes),
  };
  return { rowIndex, data, issues };
}

export function parseGcseClassClosuresCsv(content: string, file = 'gcse_class_closures.csv'): GcseParseFileResult<GcseClassClosureRow> {
  const grid = parseCsv(content.trim());
  if (grid.length === 0) {
    return fileResult(file, false, ['empty_file'], []);
  }
  const [headerRow, ...dataRows] = grid;
  const hi: string[] = [];
  if (!headersMatch(headerRow, GCSE_CLASS_CLOSURES_HEADERS)) {
    hi.push('header_mismatch_expected_gcse_class_closures_columns');
  }
  const objects = rowsToObjects(headerRow, dataRows);
  const out = objects.map((raw, idx) => parseClosureRow(raw, idx + 2));
  return fileResult(file, hi.length === 0, hi, out);
}

function parseClosureRow(raw: GcseRawRow, rowIndex: number): GcseRowResult<GcseClassClosureRow> {
  const issues: string[] = [];
  const id = trimToNull(raw.closureExternalId);
  if (!id) issues.push('missing_closureExternalId');
  const data: GcseClassClosureRow = {
    closureExternalId: id ?? `__cls_${rowIndex}`,
    className: trimToNull(raw.className),
    tutorName: trimToNull(raw.tutorName),
    startDate: trimToNull(raw.startDate),
    endDate: trimToNull(raw.endDate),
    status: trimToNull(raw.status),
    notes: trimToNull(raw.notes),
  };
  return { rowIndex, data, issues };
}

export function parseGcseMonthlyBillingCsv(
  content: string,
  file = 'gcse_monthly_billing_starter_mar_apr_2026.csv'
): GcseParseFileResult<GcseMonthlyBillingRow> {
  const grid = parseCsv(content.trim());
  if (grid.length === 0) {
    return fileResult(file, false, ['empty_file'], []);
  }
  const [headerRow, ...dataRows] = grid;
  const hi: string[] = [];
  if (!headersMatch(headerRow, GCSE_MONTHLY_BILLING_HEADERS)) {
    hi.push('header_mismatch_expected_gcse_monthly_billing_columns');
  }
  const objects = rowsToObjects(headerRow, dataRows);
  const out = objects.map((raw, idx) => parseMonthlyBillingRow(raw, idx + 2));
  return fileResult(file, hi.length === 0, hi, out);
}

function parseMonthlyBillingRow(raw: GcseRawRow, rowIndex: number): GcseRowResult<GcseMonthlyBillingRow> {
  const issues: string[] = [];
  const id = trimToNull(raw.billingRecordExternalId);
  if (!id) issues.push('missing_billingRecordExternalId');

  const fundNorm = normalizeFundingType(trimToNull(raw.fundingType));
  const { pence: dueP, issues: di1 } = parseGbpToPence(trimToNull(raw.amountDue));
  issues.push(...di1);
  const { pence: paidP, issues: di2 } = parseGbpToPence(trimToNull(raw.amountPaid));
  issues.push(...di2);

  const flagged = parseFlaggedIssue(trimToNull(raw.flaggedIssue));
  if (trimToNull(raw.flaggedIssue) && !['yes', 'y', 'no', 'n', 'true', 'false', '1', '0', ''].includes((raw.flaggedIssue ?? '').trim().toLowerCase())) {
    issues.push(`flagged_issue_nonstandard:${raw.flaggedIssue}`);
  }

  const data: GcseMonthlyBillingRow = {
    billingRecordExternalId: id ?? `__mbr_${rowIndex}`,
    billingPeriod: trimToNull(raw.billingPeriod),
    billingGroupId: trimToNull(raw.billingGroupId),
    studentExternalId: trimToNull(raw.studentExternalId),
    studentDisplayName: trimToNull(raw.studentDisplayName),
    fundingTypeRaw: trimToNull(raw.fundingType),
    fundingTypeNormalized: fundNorm,
    amountDueRaw: trimToNull(raw.amountDue),
    amountDuePence: dueP,
    expectedPaymentDate: trimToNull(raw.expectedPaymentDate),
    invoiceTargetSubmissionDate: trimToNull(raw.invoiceTargetSubmissionDate),
    statementReadyDate: trimToNull(raw.statementReadyDate),
    invoiceSubmittedDate: trimToNull(raw.invoiceSubmittedDate),
    amountPaidRaw: trimToNull(raw.amountPaid),
    amountPaidPence: paidP,
    datePaid: trimToNull(raw.datePaid),
    paymentStatusRaw: trimToNull(raw.paymentStatus),
    flaggedIssueRaw: trimToNull(raw.flaggedIssue),
    flaggedIssue: flagged,
    notes: trimToNull(raw.notes),
  };

  return { rowIndex, data, issues };
}

/** Parse all five starter files in one call (for scripts / tests). */
export function parseGcseStarterPack(files: {
  studentsMaster: string;
  billingGroups: string;
  attendance: string;
  closures: string;
  monthlyBilling: string;
}) {
  return {
    studentsMaster: parseGcseStudentsMasterCsv(files.studentsMaster),
    billingGroups: parseGcseBillingGroupsCsv(files.billingGroups),
    attendance: parseGcseAttendanceCsv(files.attendance),
    closures: parseGcseClassClosuresCsv(files.closures),
    monthlyBilling: parseGcseMonthlyBillingCsv(files.monthlyBilling),
  };
}
