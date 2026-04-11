/**
 * Teacher UI: derive class lists and rosters from live org data (no mock classes).
 */
'use client';

import { orgService } from '@/lib/orgService';
import type { Class, Student } from '@/lib/orgTypes';
import { PRIMARY_OWNER_EMAIL } from '@/lib/userAccountSeed';

/** Resolve Firebase user email → teacherId from synced userAccounts. */
export function getTeacherIdForEmail(email: string | null | undefined): string | null {
  if (!email) return null;
  const n = email.toLowerCase().trim();
  const ua = orgService
    .listUserAccounts()
    .find((u) => u.email.toLowerCase() === n && u.role === 'teacher' && u.teacherId);
  return ua?.teacherId ?? null;
}

export function getClassIdsForTeacher(teacherId: string): string[] {
  return orgService.listClasses().filter((c) => c.teacherId === teacherId).map((c) => c.id);
}

export function getStudentIdsForTeacherClasses(classIds: string[]): Set<string> {
  const set = new Set<string>();
  const ids = new Set(classIds);
  for (const e of orgService.listEnrollments()) {
    if (ids.has(e.classId)) set.add(e.studentId);
  }
  return set;
}

export interface TeacherClassSummary {
  id: string;
  name: string;
  subject: string;
  studentCount: number;
}

export function getTeacherClassSummaries(): TeacherClassSummary[] {
  const classes = orgService.listClasses();
  const enrollments = orgService.listEnrollments();
  return classes.map((c) => ({
    id: c.id,
    name: c.name,
    subject: c.subject,
    studentCount: enrollments.filter((e) => e.classId === c.id).length,
  }));
}

/** Classes for the signed-in teacher (roster counts). Falls back to all classes if no teacher mapping. */
export function getTeacherClassSummariesForUser(userEmail: string | null | undefined): TeacherClassSummary[] {
  let tid = getTeacherIdForEmail(userEmail);
  if (!tid && userEmail?.toLowerCase().trim() === PRIMARY_OWNER_EMAIL.toLowerCase()) {
    tid = 'teacher_zain';
  }
  const classes = tid
    ? orgService.listClasses().filter((c) => c.teacherId === tid)
    : orgService.listClasses();
  const enrollments = orgService.listEnrollments();
  return classes.map((c) => ({
    id: c.id,
    name: c.name,
    subject: c.subject,
    studentCount: enrollments.filter((e) => e.classId === c.id).length,
  }));
}

export function getClassById(classId: string): Class | undefined {
  return orgService.listClasses().find((c) => c.id === classId);
}

export function getStudentsForClass(classId: string): Student[] {
  const ids = new Set(
    orgService.listEnrollments().filter((e) => e.classId === classId).map((e) => e.studentId)
  );
  return orgService.listStudents().filter((s) => ids.has(s.id));
}

/** Distinct students across this teacher’s classes (for dashboard counts). */
export function getStudentCountForTeacherUser(userEmail: string | null | undefined): number {
  const summaries = getTeacherClassSummariesForUser(userEmail);
  const ids = new Set<string>();
  for (const c of summaries) {
    for (const s of getStudentsForClass(c.id)) {
      ids.add(s.id);
    }
  }
  return ids.size;
}
