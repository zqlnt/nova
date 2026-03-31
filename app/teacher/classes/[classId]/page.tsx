'use client';

import Link from 'next/link';
import Image from 'next/image';
import Layout from '@/components/Layout';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { getClassById, getStudentsForClass } from '@/lib/teacherOrgData';
import { useOrgSync } from '@/lib/orgService';
import { useMemo, useState } from 'react';

export default function ClassDetail({ params }: { params: { classId: string } }) {
  useOrgSync();
  const classData = getClassById(params.classId);
  const roster = getStudentsForClass(params.classId);
  const [query, setQuery] = useState('');

  const filteredStudents = useMemo(() => {
    const q = query.trim().toLowerCase();
    return roster.filter((s) => (q ? s.name.toLowerCase().includes(q) : true));
  }, [roster, query]);

  if (!classData) {
    return (
      <Layout role="teacher">
        <Card className="p-8 text-center text-gray-500">
          <p>Class not found.</p>
          <Link href="/teacher/classes" className="text-ios-blue mt-4 inline-block">
            Back to classes
          </Link>
        </Card>
      </Layout>
    );
  }

  return (
    <Layout role="teacher">
      <div className="space-y-8 max-w-6xl">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 break-words">{classData.name}</h1>
            <p className="text-gray-600 mt-1">
              {classData.subject} · {roster.length} students
            </p>
          </div>
          <Button variant="secondary" type="button" className="self-start">
            Export report
          </Button>
        </div>

        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-4">
          <Card className="text-center border border-white/45">
            <div className="text-sm font-medium text-gray-600 mb-2">Enrolled</div>
            <div className="text-3xl font-bold text-gray-900">{roster.length}</div>
          </Card>
          <Card className="text-center border border-white/45">
            <div className="text-sm font-medium text-gray-600 mb-2">Year groups</div>
            <div className="text-lg font-semibold text-gray-900">
              {Array.from(new Set(roster.map((s) => s.yearGroup))).sort((a, b) => a - b).join(', ') || '—'}
            </div>
          </Card>
          <Card className="text-center border border-white/45">
            <div className="text-sm font-medium text-gray-600 mb-2">Org record</div>
            <div className="text-sm text-gray-700">Live roster from Nova Org</div>
          </Card>
        </div>

        <Card className="border border-white/45">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Students</h2>
              <p className="text-sm text-gray-600 mt-1">Click a student to open their profile.</p>
            </div>
            <div className="relative w-full sm:max-w-xs">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search students…"
                className="w-full px-4 py-2.5 rounded-xl nova-frost-field border-white/50 focus:outline-none focus:ring-2 focus:ring-ios-blue/40"
              />
            </div>
          </div>

          <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
            <table className="w-full min-w-[600px] text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-2 font-semibold text-gray-700">Student</th>
                  <th className="text-center py-3 px-2 font-semibold text-gray-700">Year</th>
                  <th className="text-center py-3 px-2 font-semibold text-gray-700">Points</th>
                  <th className="text-center py-3 px-2 font-semibold text-gray-700">Level</th>
                  <th className="text-center py-3 px-2 font-semibold text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => {
                  return (
                    <tr key={student.id} className="border-b border-gray-100 hover:bg-gray-50/80">
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-9 h-9 rounded-full nova-frost-field flex items-center justify-center flex-shrink-0 p-1">
                            <Image
                              src="https://i.imghippo.com/files/tyq3865Jxs.png"
                              alt=""
                              width={28}
                              height={28}
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <span className="font-medium text-gray-900 truncate">{student.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-2 text-center">{student.yearGroup}</td>
                      <td className="py-3 px-2 text-center">{student.totalPoints}</td>
                      <td className="py-3 px-2 text-center">{student.level}</td>
                      <td className="py-3 px-2 text-center">
                        <Link href={`/teacher/students/${student.id}`}>
                          <Button variant="secondary" size="sm">
                            View
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filteredStudents.length === 0 && (
              <p className="text-center text-gray-500 py-8">No students match your search.</p>
            )}
          </div>
        </Card>
      </div>
    </Layout>
  );
}
