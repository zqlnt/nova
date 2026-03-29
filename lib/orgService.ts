'use client';

import { useState, useEffect } from 'react';
import type {
  Organisation,
  OrgAdmin,
  Teacher,
  Class,
  Student,
  Family,
  OrgStudentRecord,
  Enrollment,
  AttendanceRecord,
  StaffNote,
  StaffTask,
  BillingAccount,
  Invoice,
  Payment,
  TuitionPlan,
  IncomeRecord,
  Expense,
  UserAccount,
} from '@/lib/orgTypes';
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
} from '@/lib/orgSeed';
import { seedIncomeRecords, seedExpenses } from '@/lib/incomeExpenseSeed';
import { seedUserAccounts } from '@/lib/userAccountSeed';
import {
  DEFAULT_ORG_ID,
  getFirestoreDb,
  subscribeOrgDocument,
  subscribeOrgSubcollection,
  setOrgDoc,
  deleteOrgDoc,
  replaceOrgSubcollection,
  setOrgDocument,
  isOrgStudentsEmpty,
  seedOrgCollections,
  shouldSeedEmptyOrg,
  type OrgSubKey,
} from '@/lib/orgFirestore';

const ORG_ID = DEFAULT_ORG_ID;

type OrgCache = {
  organisation: Organisation;
  admins: OrgAdmin[];
  teachers: Teacher[];
  classes: Class[];
  students: Student[];
  orgStudentRecords: OrgStudentRecord[];
  enrollments: Enrollment[];
  attendance: AttendanceRecord[];
  notes: StaffNote[];
  billingAccounts: BillingAccount[];
  invoices: Invoice[];
  payments: Payment[];
  tuitionPlans: TuitionPlan[];
  income: IncomeRecord[];
  expenses: Expense[];
  userAccounts: UserAccount[];
  families: Family[];
  staffTasks: StaffTask[];
};

function memorySeedCache(): OrgCache {
  return {
    organisation: seedOrg,
    admins: seedAdmins,
    teachers: seedTeachers,
    classes: seedClasses,
    students: seedStudents,
    orgStudentRecords: seedOrgStudentRecords,
    enrollments: seedEnrollments,
    attendance: seedAttendance,
    notes: seedNotes,
    billingAccounts: seedBillingAccounts,
    invoices: seedInvoices,
    payments: seedPayments,
    tuitionPlans: seedTuitionPlans,
    income: seedIncomeRecords,
    expenses: seedExpenses,
    userAccounts: seedUserAccounts,
    families: seedFamilies,
    staffTasks: seedStaffTasks,
  };
}

let cache: OrgCache = memorySeedCache();
let persistenceEnabled = false;
const syncListeners = new Set<() => void>();

export type OrgSyncState = {
  loading: boolean;
  error: string | null;
  ready: boolean;
  persistenceEnabled: boolean;
};

let syncState: OrgSyncState = {
  loading: true,
  error: null,
  ready: false,
  persistenceEnabled: false,
};

function setSyncState(partial: Partial<OrgSyncState>) {
  syncState = { ...syncState, ...partial };
  bump();
}

function bump() {
  syncListeners.forEach((fn) => fn());
}

export function getOrgSyncState(): OrgSyncState {
  return syncState;
}

/** Subscribe to org data updates (Firestore snapshots or writes). Re-render when cache changes. */
export function useOrgSync(): number {
  const [n, setN] = useState(0);
  useEffect(() => {
    const fn = () => setN((x) => x + 1);
    syncListeners.add(fn);
    return () => {
      syncListeners.delete(fn);
    };
  }, []);
  return n;
}

let unsubscribers: Array<() => void> = [];
let bootstrapStarted = false;

function mergeOrgDoc(data: Record<string, unknown> | undefined) {
  if (!data) {
    cache.organisation = seedOrg;
    return;
  }
  const { id, name, slug, location, createdAt, settings } = data as Partial<Organisation>;
  cache.organisation = {
    id: (id as string) ?? seedOrg.id,
    name: (name as string) ?? seedOrg.name,
    slug: (slug as string) ?? seedOrg.slug,
    location: location as string | undefined,
    createdAt: (createdAt as string) ?? seedOrg.createdAt,
    settings: (settings as Organisation['settings']) ?? seedOrg.settings,
  };
}

function attachListeners(firestore: NonNullable<ReturnType<typeof getFirestoreDb>>) {
  unsubscribers.forEach((u) => u());
  unsubscribers = [];

  const sub = <T extends { id: string }>(key: OrgSubKey, assign: (rows: T[]) => void) => {
    const u = subscribeOrgSubcollection<T>(
      firestore,
      ORG_ID,
      key,
      (rows) => {
        assign(rows);
        setSyncState({ ready: true, loading: false, error: null });
        bump();
      },
      (e) => {
        setSyncState({ error: e.message, loading: false, ready: syncState.ready });
        bump();
      }
    );
    unsubscribers.push(u);
  };

  const u0 = subscribeOrgDocument(
    firestore,
    ORG_ID,
    (data) => {
      mergeOrgDoc(data as Record<string, unknown> | undefined);
      setSyncState({ ready: true, loading: false, error: null });
      bump();
    },
    (e) => {
      setSyncState({ error: e.message, loading: false });
      bump();
    }
  );
  unsubscribers.push(u0);

  sub<OrgAdmin>('admins', (rows) => {
    cache.admins = rows;
  });
  sub<Teacher>('teachers', (rows) => {
    cache.teachers = rows;
  });
  sub<Class>('classes', (rows) => {
    cache.classes = rows;
  });
  sub<Student>('students', (rows) => {
    cache.students = rows;
  });
  sub<OrgStudentRecord>('orgStudentRecords', (rows) => {
    cache.orgStudentRecords = rows;
  });
  sub<Enrollment>('enrollments', (rows) => {
    cache.enrollments = rows;
  });
  sub<AttendanceRecord>('attendance', (rows) => {
    cache.attendance = rows;
  });
  sub<StaffNote>('staffNotes', (rows) => {
    cache.notes = rows;
  });
  sub<BillingAccount>('billingAccounts', (rows) => {
    cache.billingAccounts = rows;
  });
  sub<Invoice>('invoices', (rows) => {
    cache.invoices = rows;
  });
  sub<Payment>('payments', (rows) => {
    cache.payments = rows;
  });
  sub<TuitionPlan>('tuitionPlans', (rows) => {
    cache.tuitionPlans = rows;
  });
  sub<IncomeRecord>('income', (rows) => {
    cache.income = rows;
  });
  sub<Expense>('expenses', (rows) => {
    cache.expenses = rows;
  });
  sub<UserAccount>('userAccounts', (rows) => {
    cache.userAccounts = rows;
  });
  sub<Family>('families', (rows) => {
    cache.families = rows;
  });
  sub<StaffTask>('staffTasks', (rows) => {
    cache.staffTasks = rows;
  });
}

async function initFirestore() {
  const firestore = getFirestoreDb();
  if (!firestore) {
    cache = memorySeedCache();
    persistenceEnabled = false;
    setSyncState({
      loading: false,
      error: 'Firestore is not available.',
      ready: true,
      persistenceEnabled: false,
    });
    return;
  }

  persistenceEnabled = true;
  setSyncState({ loading: true, error: null, persistenceEnabled: true });

  try {
    await setOrgDocument(firestore, ORG_ID, stripForOrgRoot(cache.organisation));

    if (shouldSeedEmptyOrg() && (await isOrgStudentsEmpty(firestore, ORG_ID))) {
      await seedOrgCollections(firestore, ORG_ID);
    }

    attachListeners(firestore);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    cache = memorySeedCache();
    persistenceEnabled = false;
    setSyncState({
      loading: false,
      error: msg,
      ready: true,
      persistenceEnabled: false,
    });
  }
}

function stripForOrgRoot(org: Organisation): Record<string, unknown> {
  return {
    id: org.id,
    name: org.name,
    slug: org.slug,
    location: org.location,
    createdAt: org.createdAt,
    settings: org.settings,
  };
}

async function writeErr<T>(fn: () => Promise<T>): Promise<T | undefined> {
  try {
    return await fn();
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    setSyncState({ error: msg });
    bump();
    console.error('orgService write failed:', e);
    return undefined;
  }
}

export const orgService = {
  bootstrap() {
    if (typeof window === 'undefined') return;
    if (bootstrapStarted) return;
    bootstrapStarted = true;

    const firestore = getFirestoreDb();
    if (!firestore) {
      cache = memorySeedCache();
      persistenceEnabled = false;
      setSyncState({ loading: false, error: null, ready: true, persistenceEnabled: false });
      return;
    }

    void initFirestore();
  },

  getSyncState(): OrgSyncState {
    return syncState;
  },

  listIncome(): IncomeRecord[] {
    return cache.income;
  },

  listExpenses(): Expense[] {
    return cache.expenses;
  },

  listUserAccounts(): UserAccount[] {
    return cache.userAccounts;
  },

  listAdmins(): OrgAdmin[] {
    return cache.admins;
  },

  getOrgStudentRecord(studentId: string): OrgStudentRecord | undefined {
    return cache.orgStudentRecords.find((r) => r.studentId === studentId);
  },

  listOrgStudentRecords(): OrgStudentRecord[] {
    return cache.orgStudentRecords;
  },

  getOrganisation(): Organisation {
    return cache.organisation;
  },

  listTeachers(): Teacher[] {
    return cache.teachers;
  },

  listClasses(): Class[] {
    return cache.classes;
  },

  listStudents(): Student[] {
    return cache.students;
  },

  listEnrollments(): Enrollment[] {
    return cache.enrollments;
  },

  listAttendance(): AttendanceRecord[] {
    return cache.attendance;
  },

  listNotes(): StaffNote[] {
    return cache.notes;
  },

  listFamilies(): Family[] {
    return cache.families;
  },

  listStaffTasks(): StaffTask[] {
    return cache.staffTasks;
  },

  getFamily(id: string): Family | undefined {
    return cache.families.find((f) => f.id === id);
  },

  async saveFamilies(families: Family[]) {
    const fs = getFirestoreDb();
    if (!fs) {
      cache.families = families;
      bump();
      return;
    }
    await writeErr(() =>
      replaceOrgSubcollection(fs, ORG_ID, 'families', families, new Set(cache.families.map((f) => f.id)))
    );
  },

  async upsertFamily(family: Family) {
    const fs = getFirestoreDb();
    if (!fs) {
      const list = orgService.listFamilies();
      const i = list.findIndex((x) => x.id === family.id);
      cache.families = i >= 0 ? list.map((x) => (x.id === family.id ? family : x)) : [...list, family];
      bump();
      return;
    }
    await writeErr(() => setOrgDoc(fs, ORG_ID, 'families', family));
  },

  async deleteFamily(id: string) {
    const fs = getFirestoreDb();
    if (!fs) {
      cache.families = cache.families.filter((f) => f.id !== id);
      bump();
      return;
    }
    await writeErr(() => deleteOrgDoc(fs, ORG_ID, 'families', id));
  },

  async saveStaffTasks(tasks: StaffTask[]) {
    const fs = getFirestoreDb();
    if (!fs) {
      cache.staffTasks = tasks;
      bump();
      return;
    }
    await writeErr(() =>
      replaceOrgSubcollection(fs, ORG_ID, 'staffTasks', tasks, new Set(cache.staffTasks.map((t) => t.id)))
    );
  },

  async upsertStaffTask(task: StaffTask) {
    const fs = getFirestoreDb();
    if (!fs) {
      const list = orgService.listStaffTasks();
      const i = list.findIndex((t) => t.id === task.id);
      cache.staffTasks = i >= 0 ? list.map((x) => (x.id === task.id ? task : x)) : [...list, task];
      bump();
      return;
    }
    await writeErr(() => setOrgDoc(fs, ORG_ID, 'staffTasks', task));
  },

  async deleteStaffTask(id: string) {
    const fs = getFirestoreDb();
    if (!fs) {
      cache.staffTasks = cache.staffTasks.filter((t) => t.id !== id);
      bump();
      return;
    }
    await writeErr(() => deleteOrgDoc(fs, ORG_ID, 'staffTasks', id));
  },

  async saveNotes(notes: StaffNote[]) {
    const fs = getFirestoreDb();
    if (!fs) {
      cache.notes = notes;
      bump();
      return;
    }
    await writeErr(() =>
      replaceOrgSubcollection(fs, ORG_ID, 'staffNotes', notes, new Set(cache.notes.map((n) => n.id)))
    );
  },

  async appendNote(note: StaffNote) {
    await orgService.saveNotes([...orgService.listNotes(), note]);
  },

  listBillingAccounts(): BillingAccount[] {
    return cache.billingAccounts;
  },

  listInvoices(): Invoice[] {
    return cache.invoices;
  },

  listPayments(): Payment[] {
    return cache.payments;
  },

  listTuitionPlans(): TuitionPlan[] {
    return cache.tuitionPlans;
  },

  async saveStudents(students: Student[]) {
    const fs = getFirestoreDb();
    if (!fs) {
      cache.students = students;
      bump();
      return;
    }
    await writeErr(() =>
      replaceOrgSubcollection(fs, ORG_ID, 'students', students, new Set(cache.students.map((s) => s.id)))
    );
  },

  async saveOrgStudentRecords(records: OrgStudentRecord[]) {
    const fs = getFirestoreDb();
    if (!fs) {
      cache.orgStudentRecords = records;
      bump();
      return;
    }
    await writeErr(() =>
      replaceOrgSubcollection(fs, ORG_ID, 'orgStudentRecords', records, new Set(cache.orgStudentRecords.map((r) => r.id)))
    );
  },

  async saveEnrollments(enrollments: Enrollment[]) {
    const fs = getFirestoreDb();
    if (!fs) {
      cache.enrollments = enrollments;
      bump();
      return;
    }
    await writeErr(() =>
      replaceOrgSubcollection(fs, ORG_ID, 'enrollments', enrollments, new Set(cache.enrollments.map((e) => e.id)))
    );
  },

  async saveInvoices(invoices: Invoice[]) {
    const fs = getFirestoreDb();
    if (!fs) {
      cache.invoices = invoices;
      bump();
      return;
    }
    await writeErr(() =>
      replaceOrgSubcollection(fs, ORG_ID, 'invoices', invoices, new Set(cache.invoices.map((i) => i.id)))
    );
  },

  async savePayments(payments: Payment[]) {
    const fs = getFirestoreDb();
    if (!fs) {
      cache.payments = payments;
      bump();
      return;
    }
    await writeErr(() =>
      replaceOrgSubcollection(fs, ORG_ID, 'payments', payments, new Set(cache.payments.map((p) => p.id)))
    );
  },

  async saveAttendance(attendance: AttendanceRecord[]) {
    const fs = getFirestoreDb();
    if (!fs) {
      cache.attendance = attendance;
      bump();
      return;
    }
    await writeErr(() =>
      replaceOrgSubcollection(fs, ORG_ID, 'attendance', attendance, new Set(cache.attendance.map((a) => a.id)))
    );
  },

  async saveExpenses(expenses: Expense[]) {
    const fs = getFirestoreDb();
    if (!fs) {
      cache.expenses = expenses;
      bump();
      return;
    }
    await writeErr(() =>
      replaceOrgSubcollection(fs, ORG_ID, 'expenses', expenses, new Set(cache.expenses.map((e) => e.id)))
    );
  },

  async saveIncome(income: IncomeRecord[]) {
    const fs = getFirestoreDb();
    if (!fs) {
      cache.income = income;
      bump();
      return;
    }
    await writeErr(() =>
      replaceOrgSubcollection(fs, ORG_ID, 'income', income, new Set(cache.income.map((i) => i.id)))
    );
  },
};
