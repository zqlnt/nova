'use client';

import Link from 'next/link';
import Layout from '@/components/Layout';
import Card from '@/components/Card';
import { orgService } from '@/lib/orgService';
import { enrichStudentsWithOrgData, FLAG_LABELS } from '@/lib/orgOperations';

export default function OrgFlagsPage() {
  const students = orgService.listStudents();
  const records = orgService.listOrgStudentRecords();
  const enrollments = orgService.listEnrollments();
  const classes = orgService.listClasses();
  const teachers = orgService.listTeachers();
  const attendance = orgService.listAttendance();
  const notes = orgService.listNotes();

  const enriched = enrichStudentsWithOrgData(students, records, enrollments, classes, teachers, attendance);
  const flagged = enriched.filter((s) => s.record?.flaggedIssues && s.record.flaggedIssues.length > 0);

  const byFlag = (flag: string) => flagged.filter((s) => s.record?.flaggedIssues?.includes(flag));

  return (
    <Layout role="org">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Flags & concerns</h1>
          <p className="text-gray-600 mt-1">Low attendance, overdue payments, parent contact, follow-ups</p>
        </div>

        {/* Flag categories */}
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
          {Object.entries(FLAG_LABELS).map(([key, label]) => {
            const count = byFlag(key).length;
            return (
              <Card key={key} className="p-4">
                <div className="text-sm text-gray-500">{label}</div>
                <div className="text-2xl font-bold text-gray-900 mt-1">{count}</div>
              </Card>
            );
          })}
        </div>

        {/* All flagged students */}
        <Card className="p-5">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Flagged students</h2>
          {flagged.length === 0 ? (
            <p className="text-sm text-gray-500">No flagged students</p>
          ) : (
            <div className="space-y-2">
              {flagged.map((s) => (
                <Link key={s.id} href={`/org/students/${s.id}`}>
                  <div className="flex items-center justify-between py-3 px-4 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-100 transition-colors">
                    <div>
                      <span className="font-medium text-gray-900">{s.name}</span>
                      <span className="text-gray-500 text-sm ml-2">Y{s.yearGroup} • {s.className}</span>
                    </div>
                    <div className="flex flex-wrap gap-1 justify-end">
                      {s.record?.flaggedIssues?.map((f) => (
                        <span key={f} className="px-2 py-0.5 rounded-full text-xs bg-amber-200 text-amber-900 font-medium">
                          {FLAG_LABELS[f] ?? f}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </Card>

        {/* Recent notes / follow-ups */}
        <Card className="p-5">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Recent notes & follow-ups</h2>
          {notes.length === 0 ? (
            <p className="text-sm text-gray-500">No notes</p>
          ) : (
            <div className="space-y-2">
              {notes.slice().reverse().map((n) => {
                const student = students.find((s) => s.id === n.studentId);
                return (
                  <Link key={n.id} href={`/org/students/${n.studentId}`}>
                    <div className="py-3 px-4 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-100 transition-colors">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-900">{student?.name}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          n.risk === 'high' ? 'bg-rose-100 text-rose-800' :
                          n.risk === 'medium' ? 'bg-amber-100 text-amber-800' : 'bg-gray-200 text-gray-600'
                        }`}>
                          {n.type} • {n.risk ?? 'low'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{n.text}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </Card>
      </div>
    </Layout>
  );
}
