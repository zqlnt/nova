import type {
  GcseAttendanceFirestoreDoc,
  GcseBillingGroupFirestoreDoc,
  GcseClassClosureFirestoreDoc,
  GcseMonthlyBillingFirestoreDoc,
  GcseRowResult,
  GcseStudentMasterFirestoreDoc,
} from '@/lib/gcseImport/types';

function nowIso(): string {
  return new Date().toISOString();
}

export function toStudentMasterDocs(
  orgId: string,
  rows: GcseRowResult<import('@/lib/gcseImport/types').GcseStudentsMasterRow>[]
): GcseStudentMasterFirestoreDoc[] {
  return rows.map((r) => ({
    id: r.data.studentExternalId,
    orgId,
    source: 'gcse_starter_csv',
    importedAt: nowIso(),
    importIssues: [...(r.issues ?? [])],
    row: r.data,
  }));
}

export function toBillingGroupDocs(
  orgId: string,
  rows: GcseRowResult<import('@/lib/gcseImport/types').GcseBillingGroupRow>[]
): GcseBillingGroupFirestoreDoc[] {
  return rows.map((r) => ({
    id: r.data.billingGroupId,
    orgId,
    source: 'gcse_starter_csv',
    importedAt: nowIso(),
    importIssues: [...(r.issues ?? [])],
    row: r.data,
  }));
}

export function toAttendanceDocs(
  orgId: string,
  rows: GcseRowResult<import('@/lib/gcseImport/types').GcseAttendanceRow>[]
): GcseAttendanceFirestoreDoc[] {
  return rows.map((r) => ({
    id: r.data.attendanceExternalId,
    orgId,
    source: 'gcse_starter_csv',
    importedAt: nowIso(),
    importIssues: [...(r.issues ?? [])],
    row: r.data,
  }));
}

export function toClosureDocs(
  orgId: string,
  rows: GcseRowResult<import('@/lib/gcseImport/types').GcseClassClosureRow>[]
): GcseClassClosureFirestoreDoc[] {
  return rows.map((r) => ({
    id: r.data.closureExternalId,
    orgId,
    source: 'gcse_starter_csv',
    importedAt: nowIso(),
    importIssues: [...(r.issues ?? [])],
    row: r.data,
  }));
}

export function toMonthlyBillingDocs(
  orgId: string,
  rows: GcseRowResult<import('@/lib/gcseImport/types').GcseMonthlyBillingRow>[]
): GcseMonthlyBillingFirestoreDoc[] {
  return rows.map((r) => ({
    id: r.data.billingRecordExternalId,
    orgId,
    source: 'gcse_starter_csv',
    importedAt: nowIso(),
    importIssues: [...(r.issues ?? [])],
    row: r.data,
  }));
}
