'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Layout from '@/components/Layout';
import Card from '@/components/Card';
import { orgService } from '@/lib/orgService';
import { enrichStudentsWithOrgData, formatPence, FLAG_LABELS } from '@/lib/orgOperations';
import StudentForm from '@/components/StudentForm';
import type { Student, OrgStudentRecord } from '@/lib/orgTypes';

export default function OrgStudentsPage() {
  const searchParams = useSearchParams();
  const editId = searchParams.get('edit');
  const org = orgService.getOrganisation();
  const [students, setStudents] = useState(orgService.listStudents());
  const [records, setRecords] = useState(orgService.listOrgStudentRecords());
  const [enrollments, setEnrollments] = useState(orgService.listEnrollments());
  const classes = orgService.listClasses();
  const teachers = orgService.listTeachers();
  const attendance = orgService.listAttendance();

  const enriched = enrichStudentsWithOrgData(students, records, enrollments, classes, teachers, attendance);

  const [filterFunding, setFilterFunding] = useState<'all' | 'private' | 'universal_credit'>('all');
  const [filterFlagged, setFilterFlagged] = useState(false);
  const [search, setSearch] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    if (editId) setEditingId(editId);
  }, [editId]);

  const filtered = enriched.filter((s) => {
    if (filterFunding !== 'all' && s.record?.paymentFundingType !== filterFunding) return false;
    if (filterFlagged && (!s.record?.flaggedIssues || s.record.flaggedIssues.length === 0)) return false;
    if (search && !s.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleSaveStudent = (student: Student, record: OrgStudentRecord, classIds: string[]) => {
    const newStudents = editingId
      ? students.map((s) => (s.id === student.id ? student : s))
      : [...students.filter((s) => s.id !== student.id), student];
    const newRecords = records.filter((r) => r.studentId !== student.id);
    newRecords.push(record);
    const newEnrollments = enrollments.filter((e) => e.studentId !== student.id);
    classIds.forEach((classId) => {
      newEnrollments.push({
        id: `en_${student.id}_${classId}_${Date.now()}`,
        orgId: org.id,
        classId,
        studentId: student.id,
        startDate: new Date().toISOString().slice(0, 10),
      });
    });
    setStudents(newStudents);
    setRecords(newRecords);
    setEnrollments(newEnrollments);
    orgService.saveStudents(newStudents);
    orgService.saveOrgStudentRecords(newRecords);
    orgService.saveEnrollments(newEnrollments);
    setShowAddForm(false);
    setEditingId(null);
  };

  return (
    <Layout role="org">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Students</h1>
            <p className="text-gray-600 mt-1">Student records, attendance, payments, and flags</p>
          </div>
          <button
            onClick={() => { setShowAddForm(true); setEditingId(null); }}
            className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700"
          >
            + Add student
          </button>
        </div>

        {showAddForm && (
          <StudentForm
            orgId={org.id}
            enrollments={[]}
            classes={classes.map((c) => ({ id: c.id, name: c.name }))}
            families={orgService.listFamilies()}
            onSave={handleSaveStudent}
            onCancel={() => setShowAddForm(false)}
          />
        )}

        {editingId && (() => {
          const s = students.find((x) => x.id === editingId);
          const r = records.find((x) => x.studentId === editingId);
          const enr = enrollments.filter((e) => e.studentId === editingId);
          if (!s) return null;
          return (
            <StudentForm
              orgId={org.id}
              student={s}
              record={r}
              enrollments={enr}
              classes={classes.map((c) => ({ id: c.id, name: c.name }))}
              families={orgService.listFamilies()}
              onSave={handleSaveStudent}
              onCancel={() => setEditingId(null)}
            />
          );
        })()}

        {/* Filters */}
        <Card className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="search"
                placeholder="Search by name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <select
                value={filterFunding}
                onChange={(e) => setFilterFunding(e.target.value as typeof filterFunding)}
                className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm"
              >
                <option value="all">All funding</option>
                <option value="private">Private</option>
                <option value="universal_credit">Universal Credit</option>
              </select>
              <label className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm cursor-pointer">
                <input type="checkbox" checked={filterFlagged} onChange={(e) => setFilterFlagged(e.target.checked)} />
                Flagged only
              </label>
            </div>
          </div>
        </Card>

        {/* Student records table */}
        <Card className="p-5 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left text-gray-500 font-medium">
                <th className="py-3 pr-4">Student</th>
                <th className="py-3 pr-4">Teacher</th>
                <th className="py-3 pr-4">Class</th>
                <th className="py-3 pr-4">Attendance</th>
                <th className="py-3 pr-4">Hours</th>
                <th className="py-3 pr-4">Funding</th>
                <th className="py-3 pr-4">Owed</th>
                <th className="py-3 pr-4">Status</th>
                <th className="py-3 pr-4">Parent contact</th>
                <th className="py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 pr-4">
                    <Link href={`/org/students/${s.id}`} className="font-medium text-gray-900 hover:text-indigo-600">
                      {s.name}
                    </Link>
                    <span className="text-gray-400 ml-1">Y{s.yearGroup}</span>
                    {s.age != null && <span className="text-gray-400 ml-1">({s.age})</span>}
                  </td>
                  <td className="py-3 pr-4 text-gray-600">{s.teacherName ?? '—'}</td>
                  <td className="py-3 pr-4 text-gray-600">{s.className ?? '—'}</td>
                  <td className="py-3 pr-4">{s.attendanceRate != null ? `${s.attendanceRate}%` : '—'}</td>
                  <td className="py-3 pr-4">{s.record?.hoursCompleted ?? '—'}</td>
                  <td className="py-3 pr-4">
                    <span className={s.record?.paymentFundingType === 'private' ? 'text-violet-600' : 'text-indigo-600'}>
                      {s.record?.paymentFundingType === 'universal_credit' ? 'UC' : s.record?.paymentFundingType ?? '—'}
                    </span>
                  </td>
                  <td className="py-3 pr-4">
                    {(s.record?.amountOwedPence ?? 0) > 0 ? (
                      <span className="text-rose-600 font-medium">{formatPence(s.record!.amountOwedPence!)}</span>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td className="py-3 pr-4">
                    <span className={`px-2 py-0.5 rounded text-xs ${
                      s.record?.paymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-800' :
                      s.record?.paymentStatus === 'overdue' ? 'bg-rose-100 text-rose-800' :
                      s.record?.paymentStatus === 'partial' ? 'bg-amber-100 text-amber-800' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {s.record?.paymentStatus ?? '—'}
                    </span>
                  </td>
                  <td className="py-3 pr-4">
                    {s.record?.parentGuardianPhone ? (
                      <span className="text-emerald-600 text-xs">✓</span>
                    ) : (
                      <span className="text-amber-600 text-xs">Missing</span>
                    )}
                  </td>
                  <td className="py-3">
                    <button
                      onClick={() => { setEditingId(s.id); setShowAddForm(false); }}
                      className="text-indigo-600 hover:underline text-sm"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-12 text-center text-gray-500">No students match your filters</div>
          )}
        </Card>
      </div>
    </Layout>
  );
}
