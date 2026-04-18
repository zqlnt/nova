/**
 * Writes the full Nova org demo seed (GCSE class, students, attendance, gcse* imports, etc.)
 * using Firebase Admin — bypasses Firestore security rules.
 *
 * Use when the console only shows orgs/org_ttutors + admins/teachers/userAccounts
 * but no students, classes, families, etc.
 *
 *   export GOOGLE_APPLICATION_CREDENTIALS=/path/to/serviceAccount.json
 *   npm run seed:org-firestore
 *
 * Or: npx tsx scripts/seed-full-org-firestore.ts /path/to/serviceAccount.json [orgId]
 */

import * as admin from 'firebase-admin';
import { readFileSync, existsSync } from 'fs';
import {
  seedOrg,
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
} from '../lib/orgSeed';
import { seedIncomeRecords, seedExpenses } from '../lib/incomeExpenseSeed';
import { seedUserAccounts } from '../lib/userAccountSeed';

function stripUndefined<T extends Record<string, unknown>>(obj: T): Record<string, unknown> {
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

const BATCH = 450;

/** Paths must match lib/orgFirestore ORG_SUBCOLLECTIONS. */
const WRITE_MAP: Array<{ name: string; rows: { id: string }[] }> = [
  { name: 'admins', rows: seedAdmins },
  { name: 'teachers', rows: seedTeachers },
  { name: 'classes', rows: seedClasses },
  { name: 'students', rows: seedStudents },
  { name: 'orgStudentRecords', rows: seedOrgStudentRecords },
  { name: 'enrollments', rows: seedEnrollments },
  { name: 'attendance', rows: seedAttendance },
  { name: 'staffNotes', rows: seedNotes },
  { name: 'billingAccounts', rows: seedBillingAccounts },
  { name: 'invoices', rows: seedInvoices },
  { name: 'payments', rows: seedPayments },
  { name: 'tuitionPlans', rows: seedTuitionPlans },
  { name: 'income', rows: seedIncomeRecords },
  { name: 'expenses', rows: seedExpenses },
  { name: 'userAccounts', rows: seedUserAccounts },
  { name: 'families', rows: seedFamilies },
  { name: 'staffTasks', rows: seedStaffTasks },
  { name: 'gcseStudentsMaster', rows: seedGcseStudentsMasterDocs },
  { name: 'gcseBillingGroups', rows: seedGcseBillingGroupsDocs },
  { name: 'gcseAttendance', rows: seedGcseAttendanceDocs },
  { name: 'gcseClassClosures', rows: seedGcseClassClosuresDocs },
  { name: 'gcseMonthlyBilling', rows: seedGcseMonthlyBillingDocs },
];

function initAdmin(): void {
  if (admin.apps.length) return;
  const keyPath = process.argv[2] || process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (keyPath && existsSync(keyPath)) {
    const sa = JSON.parse(readFileSync(keyPath, 'utf8')) as admin.ServiceAccount;
    admin.initializeApp({ credential: admin.credential.cert(sa) });
    console.info('[seed-org] Using', keyPath);
    return;
  }
  admin.initializeApp();
  console.info('[seed-org] Using application default credentials');
}

async function main(): Promise<void> {
  initAdmin();
  const db = admin.firestore();
  const orgId = process.argv[3] || process.env.NOVA_ORG_ID || seedOrg.id;

  await db
    .collection('orgs')
    .doc(orgId)
    .set(stripUndefined({ ...seedOrg } as unknown as Record<string, unknown>), { merge: true });
  console.info('[seed-org] org root:', orgId);

  for (const { name, rows } of WRITE_MAP) {
    for (let i = 0; i < rows.length; i += BATCH) {
      const batch = db.batch();
      const part = rows.slice(i, i + BATCH);
      for (const row of part) {
        const ref = db.collection('orgs').doc(orgId).collection(name).doc(row.id);
        batch.set(ref, stripUndefined(row as unknown as Record<string, unknown>), { merge: true });
      }
      await batch.commit();
    }
    console.info(`[seed-org] ${name}: ${rows.length} docs`);
  }

  console.info('[seed-org] Finished. Refresh the Firebase console and the app.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
