/**
 * User accounts - Nova Student, Nova Teacher, Nova Org.
 * For future Firebase auth; access restricted by email and permissions.
 */

import type { UserAccount } from '@/lib/orgTypes';

const ORG_ID = 'org_ttutors';

/** Must match the Firebase Auth email for the org owner (org + teacher portals). */
export const PRIMARY_OWNER_EMAIL = 'zain01gul@gmail.com';

export const seedUserAccounts: UserAccount[] = [
  {
    id: 'ua_org_1',
    email: PRIMARY_OWNER_EMAIL,
    role: 'org',
    orgId: ORG_ID,
    firebaseUid: 'upix9xtoGtZ5PVdwECSzjQc5Rrj1',
    active: true,
    createdAt: '2026-03-01T10:00:00Z',
    updatedAt: '2026-03-01T10:00:00Z',
  },
  { id: 'ua_org_2', email: 'bilal@ttutors.co.uk', role: 'org', orgId: ORG_ID, active: true, createdAt: '2026-03-01T10:00:00Z', updatedAt: '2026-03-01T10:00:00Z' },
  {
    id: 'ua_teacher_1',
    email: PRIMARY_OWNER_EMAIL,
    role: 'teacher',
    orgId: ORG_ID,
    teacherId: 'teacher_zain',
    firebaseUid: 'upix9xtoGtZ5PVdwECSzjQc5Rrj1',
    active: true,
    createdAt: '2026-03-01T10:00:00Z',
    updatedAt: '2026-03-01T10:00:00Z',
  },
  { id: 'ua_teacher_2', email: 'elevate@ttutors.co.uk', role: 'teacher', orgId: ORG_ID, teacherId: 'teacher_elevate', active: true, createdAt: '2026-03-01T10:00:00Z', updatedAt: '2026-03-01T10:00:00Z' },
  { id: 'ua_student_1', email: 'alex@example.com', role: 'student', orgId: ORG_ID, studentId: 's_tt_001', active: true, createdAt: '2026-03-01T10:00:00Z', updatedAt: '2026-03-01T10:00:00Z' },
];
