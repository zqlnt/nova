'use client';

import Link from 'next/link';
import Layout from '@/components/Layout';
import Card from '@/components/Card';
import { getTeacherClassSummaries } from '@/lib/teacherOrgData';
import { useOrgSync } from '@/lib/orgService';

export default function TeacherClassesPage() {
  useOrgSync();
  const summaries = getTeacherClassSummaries();

  return (
    <Layout role="teacher">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Classes</h1>
          <p className="text-gray-600 mt-1">Rosters from Nova Org</p>
        </div>

        <div className="grid gap-3">
          {summaries.length === 0 ? (
            <Card className="p-8 text-center text-gray-500">No classes yet. Add them in Nova Org.</Card>
          ) : (
            summaries.map((c) => (
              <Link key={c.id} href={`/teacher/classes/${c.id}`}>
                <Card hover className="cursor-pointer border border-white/45 hover:border-ios-blue hover:shadow-lg">
                  <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div className="min-w-0">
                      <div className="font-semibold text-gray-900 truncate">{c.name}</div>
                      <div className="text-sm text-gray-500">{c.subject}</div>
                    </div>
                    <div className="text-sm text-gray-600 flex-shrink-0">{c.studentCount} students</div>
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
