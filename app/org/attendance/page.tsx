'use client';

import { useState } from 'react';
import Link from 'next/link';
import Layout from '@/components/Layout';
import Card from '@/components/Card';
import { orgService } from '@/lib/orgService';
import { enrichStudentsWithOrgData } from '@/lib/orgOperations';
import type { AttendanceRecord, AttendanceStatus } from '@/lib/orgTypes';

export default function OrgAttendancePage() {
  const org = orgService.getOrganisation();
  const [students, setStudents] = useState(orgService.listStudents());
  const [attendance, setAttendance] = useState(orgService.listAttendance());
  const records = orgService.listOrgStudentRecords();
  const enrollments = orgService.listEnrollments();
  const classes = orgService.listClasses();
  const teachers = orgService.listTeachers();

  const enriched = enrichStudentsWithOrgData(students, records, enrollments, classes, teachers, attendance);

  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
  const [selectedClassId, setSelectedClassId] = useState<string>(classes[0]?.id ?? '');

  const presentCount = attendance.filter((a) => a.status === 'present' || a.status === 'late').length;
  const absentCount = attendance.filter((a) => a.status === 'absent').length;
  const lateCount = attendance.filter((a) => a.status === 'late').length;
  const atRisk = enriched.filter((s) => (s.attendanceRate ?? 100) < 70 || s.record?.flaggedIssues?.includes('low_attendance'));

  const classStudents = selectedClassId
    ? enrollments.filter((e) => e.classId === selectedClassId).map((e) => students.find((s) => s.id === e.studentId)).filter(Boolean) as typeof students
    : students;

  const byDay = attendance.reduce((acc, a) => {
    acc[a.sessionDate] = (acc[a.sessionDate] || { present: 0, absent: 0, late: 0 });
    if (a.status === 'present') acc[a.sessionDate].present++;
    else if (a.status === 'absent') acc[a.sessionDate].absent++;
    else if (a.status === 'late') acc[a.sessionDate].late++;
    return acc;
  }, {} as Record<string, { present: number; absent: number; late: number }>);

  const sortedDays = Object.keys(byDay).sort().reverse();

  const getAttendanceForStudent = (studentId: string) => {
    return attendance.find(
      (a) => a.studentId === studentId && a.sessionDate === selectedDate && (a.classId === selectedClassId || !selectedClassId)
    );
  };

  const setAttendanceForStudent = (studentId: string, status: AttendanceStatus) => {
    const classId = selectedClassId || (enrollments.find((e) => e.studentId === studentId)?.classId);
    if (!classId) return;
    const existing = attendance.find(
      (a) => a.studentId === studentId && a.sessionDate === selectedDate && a.classId === classId
    );
    let newAttendance: AttendanceRecord[];
    if (existing) {
      newAttendance = attendance.map((a) =>
        a.id === existing.id ? { ...a, status } : a
      );
    } else {
      newAttendance = [
        ...attendance,
        {
          id: `att_${studentId}_${classId}_${selectedDate}`,
          orgId: org.id,
          classId,
          studentId,
          sessionDate: selectedDate,
          status,
          minutesAttended: status === 'present' || status === 'late' ? 60 : undefined,
        },
      ];
    }
    setAttendance(newAttendance);
    orgService.saveAttendance(newAttendance);
  };

  return (
    <Layout role="org">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Attendance</h1>
          <p className="text-gray-600 mt-1">Mark students present or absent by date. Connects to calendar.</p>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="text-sm text-gray-500">Present / Late</div>
            <div className="text-2xl font-bold text-emerald-600">{presentCount}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-gray-500">Absent</div>
            <div className="text-2xl font-bold text-rose-600">{absentCount}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-gray-500">Late arrivals</div>
            <div className="text-2xl font-bold text-amber-600">{lateCount}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-gray-500">At risk</div>
            <div className="text-2xl font-bold text-amber-600">{atRisk.length}</div>
          </Card>
        </div>

        {/* Mark attendance by date */}
        <Card className="p-5">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Mark attendance</h2>
          <div className="flex flex-wrap gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-4 py-2 rounded-xl border border-gray-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
              <select
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
                className="px-4 py-2 rounded-xl border border-gray-200"
              >
                <option value="">All students</option>
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left text-gray-500">
                  <th className="py-2 pr-4">Student</th>
                  <th className="py-2 pr-4">Present</th>
                  <th className="py-2 pr-4">Absent</th>
                  <th className="py-2 pr-4">Late</th>
                  <th className="py-2">Excused</th>
                </tr>
              </thead>
              <tbody>
                {(selectedClassId ? classStudents : students).map((s) => {
                  const a = getAttendanceForStudent(s.id);
                  const status = a?.status ?? null;
                  return (
                    <tr key={s.id} className="border-b border-gray-100">
                      <td className="py-2 pr-4 font-medium">{s.name}</td>
                      <td className="py-2 pr-4">
                        <button
                          type="button"
                          onClick={() => setAttendanceForStudent(s.id, 'present')}
                          className={`px-3 py-1 rounded-lg text-xs font-medium ${
                            status === 'present' ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          ✓
                        </button>
                      </td>
                      <td className="py-2 pr-4">
                        <button
                          type="button"
                          onClick={() => setAttendanceForStudent(s.id, 'absent')}
                          className={`px-3 py-1 rounded-lg text-xs font-medium ${
                            status === 'absent' ? 'bg-rose-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          ✗
                        </button>
                      </td>
                      <td className="py-2 pr-4">
                        <button
                          type="button"
                          onClick={() => setAttendanceForStudent(s.id, 'late')}
                          className={`px-3 py-1 rounded-lg text-xs font-medium ${
                            status === 'late' ? 'bg-amber-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          Late
                        </button>
                      </td>
                      <td className="py-2">
                        <button
                          type="button"
                          onClick={() => setAttendanceForStudent(s.id, 'excused')}
                          className={`px-3 py-1 rounded-lg text-xs font-medium ${
                            status === 'excused' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          Excused
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Attendance by session */}
        <Card className="p-5">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Attendance by session</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left text-gray-500">
                  <th className="py-2 pr-4">Date</th>
                  <th className="py-2 pr-4">Present</th>
                  <th className="py-2 pr-4">Absent</th>
                  <th className="py-2">Late</th>
                </tr>
              </thead>
              <tbody>
                {sortedDays.map((d) => (
                  <tr key={d} className="border-b border-gray-100">
                    <td className="py-2 pr-4 font-medium">{d}</td>
                    <td className="py-2 pr-4 text-emerald-600">{byDay[d].present}</td>
                    <td className="py-2 pr-4 text-rose-600">{byDay[d].absent}</td>
                    <td className="py-2 text-amber-600">{byDay[d].late}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Students at attendance risk */}
        <Card className="p-5">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Students at attendance risk</h2>
          {atRisk.length === 0 ? (
            <p className="text-sm text-gray-500">No students at risk</p>
          ) : (
            <div className="space-y-2">
              {atRisk.map((s) => (
                <Link key={s.id} href={`/org/students/${s.id}`}>
                  <div className="flex items-center justify-between py-3 px-4 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-100 transition-colors">
                    <div>
                      <span className="font-medium text-gray-900">{s.name}</span>
                      <span className="text-gray-500 text-sm ml-2">Y{s.yearGroup} • {s.className}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-amber-700 font-medium">{s.attendanceRate ?? 0}%</span>
                      <span className="text-gray-500 ml-2">{s.record?.hoursCompleted ?? 0} hrs</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </Card>
      </div>
    </Layout>
  );
}
