/**
 * Firebase Admin: upsert GCSE starter subcollections under orgs/{orgId}/.
 *
 * Prereqs:
 * - Download a service account key JSON from Firebase Console (Project settings → Service accounts).
 * - export GOOGLE_APPLICATION_CREDENTIALS=/path/to/serviceAccount.json
 *   OR pass the path as the first CLI argument.
 *
 * Usage:
 *   npx tsx scripts/import-gcse-firestore.ts [path/to/serviceAccount.json] [orgId]
 *
 * Default orgId: org_ttutors (or NOVA_ORG_ID env).
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import * as admin from 'firebase-admin';

const root = join(__dirname, '..');
const integration = JSON.parse(
  readFileSync(join(root, 'lib/gcseImport/generatedIntegration.json'), 'utf8')
) as {
  firestore: {
    gcseStudentsMaster: Array<Record<string, unknown> & { id: string }>;
    gcseBillingGroups: Array<Record<string, unknown> & { id: string }>;
    gcseAttendance: Array<Record<string, unknown> & { id: string }>;
    gcseClassClosures: Array<Record<string, unknown> & { id: string }>;
    gcseMonthlyBilling: Array<Record<string, unknown> & { id: string }>;
  };
};

function initAdmin(): void {
  if (admin.apps.length) return;
  const keyPath = process.argv[2] || process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (keyPath && existsSync(keyPath)) {
    const sa = JSON.parse(readFileSync(keyPath, 'utf8')) as admin.ServiceAccount;
    admin.initializeApp({ credential: admin.credential.cert(sa) });
    console.info('[import-gcse] Using credentials file:', keyPath);
    return;
  }
  admin.initializeApp();
  console.info('[import-gcse] Using application default credentials');
}

async function upsertCollection(
  db: admin.firestore.Firestore,
  orgId: string,
  sub: string,
  docs: Array<Record<string, unknown> & { id: string }>
): Promise<void> {
  const col = db.collection('orgs').doc(orgId).collection(sub);
  let n = 0;
  for (const d of docs) {
    const { id, ...rest } = d;
    await col.doc(id).set(rest as admin.firestore.DocumentData, { merge: true });
    n += 1;
  }
  console.info(`[import-gcse] ${sub}: ${n} documents`);
}

async function main(): Promise<void> {
  initAdmin();
  const orgId = process.argv[3] || process.env.NOVA_ORG_ID || 'org_ttutors';
  const db = admin.firestore();
  const f = integration.firestore;

  await upsertCollection(db, orgId, 'gcseStudentsMaster', f.gcseStudentsMaster);
  await upsertCollection(db, orgId, 'gcseBillingGroups', f.gcseBillingGroups);
  await upsertCollection(db, orgId, 'gcseAttendance', f.gcseAttendance);
  await upsertCollection(db, orgId, 'gcseClassClosures', f.gcseClassClosures);
  await upsertCollection(db, orgId, 'gcseMonthlyBilling', f.gcseMonthlyBilling);

  console.info('[import-gcse] Done for org', orgId);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
