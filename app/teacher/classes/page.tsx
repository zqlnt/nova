'use client';

import Link from 'next/link';
import Layout from '@/components/Layout';
import Card from '@/components/Card';
import { mockClasses } from '@/lib/mockData';

export default function TeacherClasses() {
  return (
    <Layout role="teacher">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Classes</h1>
          <p className="text-gray-600 mt-1">Rosters, progress, and assignments</p>
        </div>

        <div className="grid gap-4">
          {mockClasses.map((c) => (
            <Link key={c.id} href={`/teacher/classes/${c.id}`}>
              <Card hover className="cursor-pointer border border-gray-200 hover:border-ios-blue hover:shadow-lg">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="font-semibold text-gray-900">{c.name}</div>
                    <div className="text-sm text-gray-500 mt-1">{c.studentCount} students • {c.activeStudents} active today</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">Avg mastery</div>
                    <div className="text-xl font-bold text-gray-900">{c.averageProgress}%</div>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
}

