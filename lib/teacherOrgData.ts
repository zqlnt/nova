/**
 * Teacher UI: derive class lists and rosters from live org data (no mock classes).
 */
'use client';

import { orgService } from '@/lib/orgService';
import type { Class, Student } from '@/lib/orgTypes';

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

export function getClassById(classId: string): Class | undefined {
  return orgService.listClasses().find((c) => c.id === classId);
}

export function getStudentsForClass(classId: string): Student[] {
  const ids = new Set(
    orgService.listEnrollments().filter((e) => e.classId === classId).map((e) => e.studentId)
  );
  return orgService.listStudents().filter((s) => ids.has(s.id));
}
