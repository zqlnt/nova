import type { GcseMonthlyBillingFirestoreDoc } from '@/lib/gcseImport/types';

/** Rows suitable for “upcoming statement dates” widgets (UC workflow). */
export function upcomingStatementReadyDates(
  rows: GcseMonthlyBillingFirestoreDoc[],
  opts?: { fromIsoDate?: string; limit?: number }
): GcseMonthlyBillingFirestoreDoc[] {
  const from = opts?.fromIsoDate ?? new Date().toISOString().slice(0, 10);
  const lim = opts?.limit ?? 50;
  return rows
    .filter((d) => d.row.statementReadyDate && d.row.statementReadyDate >= from)
    .sort((a, b) => (a.row.statementReadyDate ?? '').localeCompare(b.row.statementReadyDate ?? ''))
    .slice(0, lim);
}

/** Upcoming invoice submission targets (e.g. before journal deadline). */
export function upcomingInvoiceSubmissionDates(
  rows: GcseMonthlyBillingFirestoreDoc[],
  opts?: { fromIsoDate?: string; limit?: number }
): GcseMonthlyBillingFirestoreDoc[] {
  const from = opts?.fromIsoDate ?? new Date().toISOString().slice(0, 10);
  const lim = opts?.limit ?? 50;
  return rows
    .filter((d) => d.row.invoiceTargetSubmissionDate && d.row.invoiceTargetSubmissionDate >= from)
    .sort((a, b) =>
      (a.row.invoiceTargetSubmissionDate ?? '').localeCompare(b.row.invoiceTargetSubmissionDate ?? '')
    )
    .slice(0, lim);
}

export function monthlyBillingUnpaidOrFlagged(rows: GcseMonthlyBillingFirestoreDoc[]): GcseMonthlyBillingFirestoreDoc[] {
  return rows.filter((d) => {
    const s = (d.row.paymentStatusRaw ?? '').toLowerCase();
    if (d.row.flaggedIssue) return true;
    if (s === 'flagged_in_progress') return true;
    if (s === 'unsubmitted' || s === 'unpaid' || s === 'unknown') return true;
    return false;
  });
}

export function monthlyBillingPaid(rows: GcseMonthlyBillingFirestoreDoc[]): GcseMonthlyBillingFirestoreDoc[] {
  return rows.filter((d) => (d.row.paymentStatusRaw ?? '').toLowerCase() === 'paid');
}

/** Group operational attendance (Nova \`AttendanceRecord\`) by YYYY-MM. */
export function attendanceCountsByMonth(
  records: Array<{ sessionDate: string; status: string }>
): Record<string, { present: number; absent: number; late: number; excused: number }> {
  const out: Record<string, { present: number; absent: number; late: number; excused: number }> = {};
  for (const r of records) {
    const month = r.sessionDate.slice(0, 7);
    if (!out[month]) out[month] = { present: 0, absent: 0, late: 0, excused: 0 };
    const b = out[month];
    switch (r.status) {
      case 'present':
        b.present += 1;
        break;
      case 'absent':
        b.absent += 1;
        break;
      case 'late':
        b.late += 1;
        break;
      case 'excused':
        b.excused += 1;
        break;
      default:
        break;
    }
  }
  return out;
}
