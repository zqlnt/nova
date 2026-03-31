'use client';

import Link from 'next/link';
import Layout from '@/components/Layout';
import Card from '@/components/Card';
import { orgService, useOrgSync } from '@/lib/orgService';

export default function TeacherStudents() {
  useOrgSync();
  const students = orgService.listStudents();

  return (
    <Layout role="teacher">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Students</h1>
          <p className="text-gray-600 mt-1">Directory from Nova Org</p>
        </div>

        <div className="grid gap-3">
          {students.length === 0 ? (
            <Card className="p-8 text-center text-gray-500">No students yet. Add them in Nova Org.</Card>
          ) : (
            students.map((s) => (
              <Link key={s.id} href={`/teacher/students/${s.id}`}>
                <Card hover className="cursor-pointer border border-gray-200 hover:border-ios-blue hover:shadow-lg">
                  <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div className="min-w-0">
                      <div className="font-semibold text-gray-900 truncate">{s.name}</div>
                      <div className="text-sm text-gray-500">Year {s.yearGroup}</div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-xs text-gray-500">Points</div>
                      <div className="text-lg font-bold text-gray-900">{s.totalPoints}</div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
}
