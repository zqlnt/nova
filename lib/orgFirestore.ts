/**
 * Firestore paths and sync helpers for Nova Org data.
 * Separated from orgService so production persistence stays clear of dev-only seed logic.
 */

import {
  type Firestore,
  collection,
  doc,
  writeBatch,
  onSnapshot,
  getDocs,
  setDoc,
  deleteDoc,
  type DocumentData,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { seedOrg } from '@/lib/orgSeed';
import {
  seedAdmins,
  seedTeachers,
  seedClasses,
  seedStudents,
  seedOrgStudentRecords,
  seedEnrollments,
  seedAttendance,
  seedNotes,
  seedBillingAccounts,
  seedInvoices,
  seedPayments,
  seedTuitionPlans,
  seedFamilies,
  seedStaffTasks,
  seedGcseStudentsMasterDocs,
  seedGcseBillingGroupsDocs,
  seedGcseAttendanceDocs,
  seedGcseClassClosuresDocs,
  seedGcseMonthlyBillingDocs,
} from '@/lib/orgSeed';
import { seedIncomeRecords, seedExpenses } from '@/lib/incomeExpenseSeed';
import { seedUserAccounts, PRIMARY_OWNER_EMAIL } from '@/lib/userAccountSeed';

export const DEFAULT_ORG_ID =
  (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_NOVA_ORG_ID) || seedOrg.id;

/** Subcollection names under orgs/{orgId}/ */
export const ORG_SUBCOLLECTIONS = {
  students: 'students',
  families: 'families',
  staffTasks: 'staffTasks',
  attendance: 'attendance',
  payments: 'payments',
  income: 'income',
  expenses: 'expenses',
  staffNotes: 'staffNotes',
  orgStudentRecords: 'orgStudentRecords',
  enrollments: 'enrollments',
  classes: 'classes',
  teachers: 'teachers',
  admins: 'admins',
  billingAccounts: 'billingAccounts',
  invoices: 'invoices',
  tuitionPlans: 'tuitionPlans',
  userAccounts: 'userAccounts',
  gcseStudentsMaster: 'gcseStudentsMaster',
  gcseBillingGroups: 'gcseBillingGroups',
  /** Starter attendance sheet import (separate from operational `attendance`). */
  gcseAttendance: 'gcseAttendance',
  gcseClassClosures: 'gcseClassClosures',
  gcseMonthlyBilling: 'gcseMonthlyBilling',
} as const;

export type OrgSubKey = keyof typeof ORG_SUBCOLLECTIONS;

/** Opt-in only: set NEXT_PUBLIC_FIRESTORE_SEED_ON_EMPTY=true for local/dev seeding. Never defaults on in production. */
export function shouldSeedEmptyOrg(): boolean {
  if (typeof process === 'undefined') return false;
  return process.env.NEXT_PUBLIC_FIRESTORE_SEED_ON_EMPTY === 'true';
}

export function stripUndefined<T extends Record<string, unknown>>(obj: T): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v === undefined) continue;
    if (v !== null && typeof v === 'object' && !Array.isArray(v)) {
      out[k] = stripUndefined(v as Record<string, unknown>);
    } else {
      out[k] = v;
    }
  }
  return out;
}

function chunk<T>(arr: T[], size: number): T[][] {
  const res: T[][] = [];
  for (let i = 0; i < arr.length; i += size) res.push(arr.slice(i, i + size));
  return res;
}

const BATCH_LIMIT = 450;

export async function commitBatches(
  firestore: Firestore,
  build: (batch: ReturnType<typeof writeBatch>, index: number) => void,
  batchCount: number
): Promise<void> {
  for (let i = 0; i < batchCount; i++) {
    const batch = writeBatch(firestore);
    build(batch, i);
    await batch.commit();
  }
}

/** Push all seed documents into Firestore (dev / first-run empty org). */
export async function seedOrgCollections(firestore: Firestore, orgId: string): Promise<void> {
  const orgRef = doc(firestore, 'orgs', orgId);
  await setDoc(orgRef, stripUndefined({ ...seedOrg }), { merge: true });

  const writeMaps: Array<{ col: OrgSubKey; rows: { id: string }[] }> = [
    { col: 'admins', rows: seedAdmins },
    { col: 'teachers', rows: seedTeachers },
    { col: 'classes', rows: seedClasses },
    { col: 'students', rows: seedStudents },
    { col: 'orgStudentRecords', rows: seedOrgStudentRecords },
    { col: 'enrollments', rows: seedEnrollments },
    { col: 'attendance', rows: seedAttendance },
    { col: 'staffNotes', rows: seedNotes },
    { col: 'billingAccounts', rows: seedBillingAccounts },
    { col: 'invoices', rows: seedInvoices },
    { col: 'payments', rows: seedPayments },
    { col: 'tuitionPlans', rows: seedTuitionPlans },
    { col: 'income', rows: seedIncomeRecords },
    { col: 'expenses', rows: seedExpenses },
    { col: 'userAccounts', rows: seedUserAccounts },
    { col: 'families', rows: seedFamilies },
    { col: 'staffTasks', rows: seedStaffTasks },
    { col: 'gcseStudentsMaster', rows: seedGcseStudentsMasterDocs },
    { col: 'gcseBillingGroups', rows: seedGcseBillingGroupsDocs },
    { col: 'gcseAttendance', rows: seedGcseAttendanceDocs },
    { col: 'gcseClassClosures', rows: seedGcseClassClosuresDocs },
    { col: 'gcseMonthlyBilling', rows: seedGcseMonthlyBillingDocs },
  ];

  for (const { col, rows } of writeMaps) {
    const name = ORG_SUBCOLLECTIONS[col];
    for (const part of chunk(rows, BATCH_LIMIT)) {
      const batch = writeBatch(firestore);
      for (const row of part) {
        const ref = doc(firestore, 'orgs', orgId, name, row.id);
        batch.set(ref, stripUndefined(row as unknown as Record<string, unknown>));
      }
      await batch.commit();
    }
  }
}

export async function isOrgStudentsEmpty(firestore: Firestore, orgId: string): Promise<boolean> {
  const snap = await getDocs(collection(firestore, 'orgs', orgId, ORG_SUBCOLLECTIONS.students));
  return snap.empty;
}

/**
 * Keep Firestore admin / teacher / userAccount rows for the primary owner in sync with seed
 * (so `zain01gul@gmail.com` works even if the org was seeded with an older email).
 */
export async function mergePrimaryOwnerProfile(firestore: Firestore, orgId: string): Promise<void> {
  const admin = seedAdmins.find((a) => a.id === 'admin_001');
  const teacher = seedTeachers.find((t) => t.id === 'teacher_zain');
  if (admin) {
    await setDoc(
      doc(firestore, 'orgs', orgId, ORG_SUBCOLLECTIONS.admins, admin.id),
      stripUndefined(admin as unknown as Record<string, unknown>),
      { merge: true }
    );
  }
  if (teacher) {
    await setDoc(
      doc(firestore, 'orgs', orgId, ORG_SUBCOLLECTIONS.teachers, teacher.id),
      stripUndefined(teacher as unknown as Record<string, unknown>),
      { merge: true }
    );
  }
  for (const row of seedUserAccounts) {
    if (row.email !== PRIMARY_OWNER_EMAIL) continue;
    await setDoc(
      doc(firestore, 'orgs', orgId, ORG_SUBCOLLECTIONS.userAccounts, row.id),
      stripUndefined(row as unknown as Record<string, unknown>),
      { merge: true }
    );
  }
}

export type OrgDocListener = (data: DocumentData | undefined, exists: boolean) => void;

export function subscribeOrgDocument(
  firestore: Firestore,
  orgId: string,
  onData: OrgDocListener,
  onError: (e: Error) => void
): () => void {
  const ref = doc(firestore, 'orgs', orgId);
  return onSnapshot(
    ref,
    (snap) => onData(snap.data(), snap.exists()),
    (e) => onError(e instanceof Error ? e : new Error(String(e)))
  );
}

export type SubListener<T extends { id: string }> = (rows: T[]) => void;

export function subscribeOrgSubcollection<T extends { id: string }>(
  firestore: Firestore,
  orgId: string,
  key: OrgSubKey,
  onRows: SubListener<T>,
  onError: (e: Error) => void
): () => void {
  const name = ORG_SUBCOLLECTIONS[key];
  const ref = collection(firestore, 'orgs', orgId, name);
  return onSnapshot(
    ref,
    (snap) => {
      const rows = snap.docs.map((d) => ({ id: d.id, ...d.data() } as T));
      onRows(rows);
    },
    (e) => onError(e instanceof Error ? e : new Error(String(e)))
  );
}

export async function setOrgDocument(firestore: Firestore, orgId: string, data: Record<string, unknown>): Promise<void> {
  await setDoc(doc(firestore, 'orgs', orgId), stripUndefined(data), { merge: true });
}

export async function setOrgDoc<T extends { id: string }>(
  firestore: Firestore,
  orgId: string,
  key: OrgSubKey,
  row: T
): Promise<void> {
  const name = ORG_SUBCOLLECTIONS[key];
  await setDoc(
    doc(firestore, 'orgs', orgId, name, row.id),
    stripUndefined(row as unknown as Record<string, unknown>)
  );
}

export async function deleteOrgDoc(
  firestore: Firestore,
  orgId: string,
  key: OrgSubKey,
  id: string
): Promise<void> {
  const name = ORG_SUBCOLLECTIONS[key];
  await deleteDoc(doc(firestore, 'orgs', orgId, name, id));
}

/** Replace entire subcollection contents (delete missing ids, upsert all rows). */
export async function replaceOrgSubcollection<T extends { id: string }>(
  firestore: Firestore,
  orgId: string,
  key: OrgSubKey,
  rows: T[],
  previousIds: Set<string>
): Promise<void> {
  const name = ORG_SUBCOLLECTIONS[key];
  const nextIds = new Set(rows.map((r) => r.id));
  const toDelete = Array.from(previousIds).filter((id) => !nextIds.has(id));

  for (const part of chunk(toDelete, BATCH_LIMIT)) {
    const batch = writeBatch(firestore);
    for (const id of part) {
      batch.delete(doc(firestore, 'orgs', orgId, name, id));
    }
    await batch.commit();
  }

  for (const part of chunk(rows, BATCH_LIMIT)) {
    const batch = writeBatch(firestore);
    for (const row of part) {
      batch.set(
        doc(firestore, 'orgs', orgId, name, row.id),
        stripUndefined(row as unknown as Record<string, unknown>)
      );
    }
    await batch.commit();
  }
}

export function getFirestoreDb(): Firestore | null {
  return db;
}
