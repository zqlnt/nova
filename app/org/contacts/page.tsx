'use client';

import Link from 'next/link';
import Layout from '@/components/Layout';
import Card from '@/components/Card';
import { orgService } from '@/lib/orgService';
import { enrichStudentsWithOrgData } from '@/lib/orgOperations';

export default function OrgContactsPage() {
  const students = orgService.listStudents();
  const records = orgService.listOrgStudentRecords();
  const enrollments = orgService.listEnrollments();
  const classes = orgService.listClasses();
  const teachers = orgService.listTeachers();
  const attendance = orgService.listAttendance();

  const enriched = enrichStudentsWithOrgData(students, records, enrollments, classes, teachers, attendance);

  const missingContact = enriched.filter((s) => !s.record?.parentGuardianPhone && !s.record?.parentGuardianEmail);
  const contactNeeded = enriched.filter((s) => s.record?.flaggedIssues?.includes('parent_contact_needed'));
  const hasContact = enriched.filter((s) => s.record?.parentGuardianPhone || s.record?.parentGuardianEmail);

  return (
    <Layout role="org">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contacts</h1>
          <p className="text-gray-600 mt-1">Parent and guardian contact details</p>
        </div>

        <Card className="p-4 bg-violet-50/90 border-violet-100">
          <p className="text-sm text-violet-900">
            <span className="font-semibold">Households & UC:</span>{' '}
            Manage families, Universal Credit dates, and linked children on{' '}
            <Link href="/org/families" className="text-indigo-600 font-medium hover:underline">Families</Link>
            .
          </p>
        </Card>

        {/* Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="text-sm text-gray-500">With contact</div>
            <div className="text-2xl font-bold text-emerald-600">{hasContact.length}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-gray-500">Missing contact</div>
            <div className="text-2xl font-bold text-amber-600">{missingContact.length}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-gray-500">Contact needed</div>
            <div className="text-2xl font-bold text-rose-600">{contactNeeded.length}</div>
          </Card>
        </div>

        {/* Contact needed (flagged) */}
        {contactNeeded.length > 0 && (
          <Card className="p-5">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Contact needed</h2>
            <div className="space-y-2">
              {contactNeeded.map((s) => (
                <Link key={s.id} href={`/org/students/${s.id}`}>
                  <div className="flex items-center justify-between py-3 px-4 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-100 transition-colors">
                    <div>
                      <span className="font-medium text-gray-900">{s.name}</span>
                      <span className="text-gray-500 text-sm ml-2">Y{s.yearGroup}</span>
                    </div>
                    <span className="text-sm text-rose-600">Parent contact needed</span>
                  </div>
                </Link>
              ))}
            </div>
          </Card>
        )}

        {/* Missing contact */}
        <Card className="p-5">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Missing contact details</h2>
          {missingContact.length === 0 ? (
            <p className="text-sm text-gray-500">All students have contact details</p>
          ) : (
            <div className="space-y-2">
              {missingContact.map((s) => (
                <Link key={s.id} href={`/org/students/${s.id}`}>
                  <div className="flex items-center justify-between py-3 px-4 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-100 transition-colors">
                    <div>
                      <span className="font-medium text-gray-900">{s.name}</span>
                      <span className="text-gray-500 text-sm ml-2">Y{s.yearGroup} • {s.className}</span>
                    </div>
                    <span className="text-sm text-amber-700">Add contact</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </Card>

        {/* All contacts */}
        <Card className="p-5">
          <h2 className="text-lg font-bold text-gray-900 mb-4">All contacts</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200/45 text-left text-gray-500">
                  <th className="py-2 pr-4">Student</th>
                  <th className="py-2 pr-4">Parent / Guardian</th>
                  <th className="py-2 pr-4">Phone</th>
                  <th className="py-2">Email</th>
                </tr>
              </thead>
              <tbody>
                {enriched.map((s) => (
                  <tr key={s.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-2 pr-4">
                      <Link href={`/org/students/${s.id}`} className="font-medium text-gray-900 hover:text-indigo-600">
                        {s.name}
                      </Link>
                      <span className="text-gray-400 ml-1">Y{s.yearGroup}</span>
                    </td>
                    <td className="py-2 pr-4 text-gray-600">{s.record?.parentGuardianName ?? '—'}</td>
                    <td className="py-2 pr-4 text-gray-600">{s.record?.parentGuardianPhone ?? '—'}</td>
                    <td className="py-2 text-gray-600">{s.record?.parentGuardianEmail ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </Layout>
  );
}
