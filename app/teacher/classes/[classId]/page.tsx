'use client';

import Link from 'next/link';
import Image from 'next/image';
import Layout from '@/components/Layout';
import Card from '@/components/Card';
import Badge from '@/components/Badge';
import Button from '@/components/Button';
import { mockClasses, mockClassStudents } from '@/lib/mockData';
import { useMemo, useState } from 'react';

export default function ClassDetail({ params }: { params: { classId: string } }) {
  const classData = mockClasses.find(c => c.id === params.classId) || mockClasses[0];
  const [query, setQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');

  const getRisk = (student: typeof mockClassStudents[number]) => {
    // Minimal heuristic scaffolding. Will be replaced by analytics rollups.
    const lastActive = student.lastActive.toLowerCase();
    const inactive =
      lastActive.includes('day') || lastActive.includes('days') || lastActive.includes('week');

    if (inactive) return 'high';
    if (student.overallProgress < 75) return 'medium';
    return 'low';
  };

  const filteredStudents = useMemo(() => {
    const q = query.trim().toLowerCase();
    return mockClassStudents
      .filter((s) => (q ? s.name.toLowerCase().includes(q) : true))
      .filter((s) => (riskFilter === 'all' ? true : getRisk(s) === riskFilter))
      .sort((a, b) => {
        const order = { high: 0, medium: 1, low: 2 };
        return order[getRisk(a)] - order[getRisk(b)];
      });
  }, [query, riskFilter]);

  const needingAttention = useMemo(() => {
    return filteredStudents.filter((s) => getRisk(s) !== 'low').slice(0, 5);
  }, [filteredStudents]);

  return (
    <Layout role="teacher">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-8 relative">
          {/* Decorative element */}
          <div className="absolute -right-10 -top-10 opacity-5 hidden lg:block">
            <svg width="150" height="150" viewBox="0 0 150 150" fill="none">
              <circle cx="75" cy="75" r="70" stroke="currentColor" className="text-gray-900" strokeWidth="3"/>
              <path d="M75 20V130M20 75H130" stroke="currentColor" className="text-gray-900" strokeWidth="2" opacity="0.5"/>
              <circle cx="75" cy="75" r="40" fill="currentColor" className="text-gray-900" opacity="0.2"/>
            </svg>
          </div>
          <div className="relative">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-900">
                {classData.name}
              </h1>
              <Badge variant="default" className="bg-gray-100 text-gray-700">{classData.studentCount} students</Badge>
            </div>
            <p className="text-gray-600">{classData.recentActivity}</p>
          </div>
          <Button variant="secondary">
            Export Report
          </Button>
        </div>

        {/* Class Stats */}
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          <Card className="text-center border border-gray-200">
            <div className="text-sm font-medium text-gray-600 mb-2">Average Progress</div>
            <div className="text-3xl font-bold text-gray-900">{classData.averageProgress}%</div>
          </Card>
          <Card className="text-center border border-gray-200">
            <div className="text-sm font-medium text-gray-600 mb-2">Active Students</div>
            <div className="text-3xl font-bold text-gray-900">{classData.activeStudents}</div>
          </Card>
          <Card className="text-center border border-gray-200">
            <div className="text-sm font-medium text-gray-600 mb-2">Areas to Focus</div>
            <div className="text-3xl font-bold text-gray-900">{classData.weakTopics.length}</div>
          </Card>
        </div>

        {/* Common Weak Topics */}
        <Card className="border border-gray-200 bg-white mb-8">
          <h3 className="font-semibold text-base mb-3 text-gray-900">Areas Needing Attention</h3>
          <div className="flex flex-wrap gap-2 mb-3">
            {classData.weakTopics.map((topic, index) => (
              <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700">
                {topic}
              </span>
            ))}
          </div>
          <p className="text-sm text-gray-500">
            These topics show lower understanding across multiple students
          </p>
        </Card>

        {/* Students Table */}
        <Card className="border border-gray-200">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Student Progress</h2>
              <p className="text-sm text-gray-600 mt-1">
                Filter and triage. Click a student to open profile + Student Nova Agent.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search students…"
                  className="w-full sm:w-64 px-4 py-2.5 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-ios-blue"
                />
                {query && (
                  <button
                    onClick={() => setQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    aria-label="Clear search"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>

              <select
                value={riskFilter}
                onChange={(e) => setRiskFilter(e.target.value as any)}
                className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-ios-blue"
                aria-label="Risk filter"
              >
                <option value="all">All students</option>
                <option value="high">High risk</option>
                <option value="medium">Medium risk</option>
                <option value="low">Low risk</option>
              </select>
            </div>
          </div>

          {needingAttention.length > 0 && (
            <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-sm font-semibold text-amber-900">Students needing attention</div>
                  <div className="text-xs text-amber-800 mt-1">
                    Heuristic triage (activity + progress). Will become evidence-based rollups.
                  </div>
                </div>
                <div className="text-xs text-amber-900 font-semibold">{needingAttention.length} flagged</div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {needingAttention.map((s) => (
                  <Link
                    key={s.id}
                    href={`/teacher/students/${s.id}`}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-amber-200 hover:border-ios-blue transition-colors"
                  >
                    <span className="text-sm font-medium text-gray-900">{s.name}</span>
                    <span className="text-xs text-gray-500">{s.lastActive}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
          
          <div className="overflow-x-auto -mx-6 px-6">
            <table className="w-full min-w-[640px]">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Student</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Risk</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Progress</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Lessons</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Last Active</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Weak Areas</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => {
                  const risk = getRisk(student);
                  const riskStyle =
                    risk === 'high'
                      ? 'bg-red-50 text-red-700 border-red-200'
                      : risk === 'medium'
                        ? 'bg-amber-50 text-amber-800 border-amber-200'
                        : 'bg-emerald-50 text-emerald-700 border-emerald-200';

                  return (
                  <tr key={student.id} className="border-b border-gray-100 hover:bg-white/50 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm p-1.5">
                          <Image 
                            src="https://i.imghippo.com/files/tyq3865Jxs.png" 
                            alt="Nova" 
                            width={32} 
                            height={32}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <span className="font-medium text-gray-900">{student.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${riskStyle}`}>
                        {risk === 'high' ? 'High' : risk === 'medium' ? 'Medium' : 'Low'}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex flex-col items-center">
                        <span className="font-semibold mb-1">{student.overallProgress}%</span>
                        <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full rounded-full"
                            style={{ width: `${student.overallProgress}%`, backgroundColor: '#007AFF' }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      {student.lessonsCompleted}
                    </td>
                    <td className="py-4 px-4 text-center text-sm text-gray-600">
                      {student.lastActive}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex flex-wrap gap-1">
                        {student.weakAreas.map((area, index) => (
                          <span key={index} className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-600">
                            {area}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <Link href={`/teacher/students/${student.id}`}>
                        <Button variant="secondary" size="sm">
                          View
                        </Button>
                      </Link>
                    </td>
                  </tr>
                )})}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </Layout>
  );
}

