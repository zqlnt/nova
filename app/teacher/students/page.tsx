'use client';

import Link from 'next/link';
import Layout from '@/components/Layout';
import Card from '@/components/Card';
import { mockClassStudents } from '@/lib/mockData';

export default function TeacherStudents() {
  return (
    <Layout role="teacher">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Students</h1>
          <p className="text-gray-600 mt-1">Directory (scaffolding)</p>
        </div>

        <div className="grid gap-3">
          {mockClassStudents.map((s) => (
            <Link key={s.id} href={`/teacher/students/${s.id}`}>
              <Card hover className="cursor-pointer border border-gray-200 hover:border-ios-blue hover:shadow-lg">
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <div className="font-semibold text-gray-900 truncate">{s.name}</div>
                    <div className="text-sm text-gray-500">Last active: {s.lastActive}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-500">Overall</div>
                    <div className="text-lg font-bold text-gray-900">{s.overallProgress}%</div>
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

