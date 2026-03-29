'use client';

import Link from 'next/link';
import Layout from '@/components/Layout';
import Card from '@/components/Card';
import { orgService } from '@/lib/orgService';

export default function OrgClassesPage() {
  const classes = orgService.listClasses();
  const teachers = orgService.listTeachers();
  const enrollments = orgService.listEnrollments();
  const records = orgService.listOrgStudentRecords();
  const students = orgService.listStudents();

  return (
    <Layout role="org">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Classes</h1>
          <p className="text-gray-600 mt-1">Teachers, rosters, attendance and payment status</p>
        </div>

        <div className="grid gap-4">
          {classes.map((c) => {
            const teacher = teachers.find((t) => t.id === c.teacherId);
            const classEnrollments = enrollments.filter((e) => e.classId === c.id);
            const classStudents = classEnrollments.map((e) => students.find((s) => s.id === e.studentId)).filter(Boolean);
            const flaggedCount = classEnrollments.filter(
              (e) => records.find((r) => r.studentId === e.studentId)?.flaggedIssues?.length
            ).length;
            const owedCount = classEnrollments.filter(
              (e) => (records.find((r) => r.studentId === e.studentId)?.amountOwedPence ?? 0) > 0
            ).length;

            return (
              <Link key={c.id} href={`/teacher/classes/${c.id}`}>
                <Card hover className="p-5 cursor-pointer">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-lg font-bold text-gray-900">{c.name}</h2>
                      <p className="text-sm text-gray-500 mt-0.5">{teacher?.name}</p>
                      <p className="text-xs text-gray-400 mt-1">{c.subjects?.join(', ') || c.subject} • Year {c.yearGroup}</p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <span className="px-3 py-1 rounded-lg bg-gray-100 text-gray-700 text-sm font-medium">
                        {classStudents.length} students
                      </span>
                      {flaggedCount > 0 && (
                        <span className="px-3 py-1 rounded-lg bg-amber-100 text-amber-800 text-sm font-medium">
                          {flaggedCount} flagged
                        </span>
                      )}
                      {owedCount > 0 && (
                        <span className="px-3 py-1 rounded-lg bg-rose-100 text-rose-800 text-sm font-medium">
                          {owedCount} with balance
                        </span>
                      )}
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}
