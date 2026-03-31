'use client';

import Link from 'next/link';
import Layout from '@/components/Layout';
import Card from '@/components/Card';
import Badge from '@/components/Badge';
import { RadialProgress, BarChart, MasteryDonut, StrandProgressBars } from '@/components/ProgressCharts';
import type { StrandMastery } from '@/lib/types';
import MathSymbolAnimation from '@/components/MathSymbolAnimation';
import MiniCalendar from '@/components/MiniCalendar';
import TaskWidget from '@/components/TaskWidget';
import { SoftBarChart } from '@/components/NovaCharts';
import { teacherCalendarEvents } from '@/lib/teacherCalendarSeed';
import { getTeacherClassSummaries } from '@/lib/teacherOrgData';
import { orgService, useOrgSync } from '@/lib/orgService';
import { masteryService } from '@/lib/services';

export default function TeacherDashboard() {
  useOrgSync();
  const classSummaries = getTeacherClassSummaries();
  const totalStudents = orgService.listStudents().length;
  const topByPoints = [...orgService.listStudents()].sort((a, b) => b.totalPoints - a.totalPoints).slice(0, 5);

  const mathsStrands: StrandMastery[] = masteryService.getStrandMastery('Mathematics');
  const totalSecure = mathsStrands.reduce((sum, s) => sum + s.secure, 0);
  const totalDeveloping = mathsStrands.reduce((sum, s) => sum + s.developing, 0);
  const totalNotStarted = mathsStrands.reduce((sum, s) => sum + s.notStarted, 0);
  const totalM = totalSecure + totalDeveloping + totalNotStarted;
  const avgProgress =
    totalM > 0 ? Math.round((totalSecure / totalM) * 100) : 0;

  const classPerformance = classSummaries.map((c) => ({
    label: c.name.split(/\s+/)[0] || c.name,
    value: c.studentCount > 0 ? Math.min(100, avgProgress || 0) : 0,
    max: 100,
    color: '#6b7280',
  }));

  return (
    <Layout role="teacher">
      <div className="space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2 flex-wrap">
              Teacher Dashboard
              <MathSymbolAnimation size="sm" colorIndex={2} />
            </h1>
            <p className="text-gray-600 mt-1">Classes and students from your organisation</p>
          </div>
        </div>

        <Card className="p-5">
          <div className="text-sm font-medium text-gray-600 mb-3">Overview</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="rounded-xl bg-gradient-to-br from-slate-500 to-slate-600 p-4 text-white shadow-sm">
              <div className="flex items-center justify-between gap-2">
                <svg className="w-6 h-6 opacity-90 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <span className="text-2xl font-bold tabular-nums">{classSummaries.length}</span>
              </div>
              <div className="text-xs text-white/90 mt-1">Classes</div>
            </div>
            <div className="rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 p-4 text-white shadow-sm">
              <div className="flex items-center justify-between gap-2">
                <svg className="w-6 h-6 opacity-90 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <span className="text-2xl font-bold tabular-nums">{totalStudents}</span>
              </div>
              <div className="text-xs text-white/90 mt-1">Students (org)</div>
            </div>
            <div className="rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 p-4 text-white shadow-sm">
              <div className="flex items-center justify-between gap-2">
                <svg className="w-6 h-6 opacity-90 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                <span className="text-2xl font-bold tabular-nums">—</span>
              </div>
              <div className="text-xs text-white/90 mt-1">Live activity</div>
            </div>
            <div className="rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 p-4 text-white shadow-sm">
              <div className="flex items-center justify-between gap-2">
                <svg className="w-6 h-6 opacity-90 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-2xl font-bold tabular-nums">{avgProgress}%</span>
              </div>
              <div className="text-xs text-white/90 mt-1">Mastery (this device)</div>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MiniCalendar events={teacherCalendarEvents} href="/teacher/calendar" title="Teaching calendar" />
          <TaskWidget
            title="Reminders"
            href="/teacher/calendar"
            tasks={[]}
            emptyMessage="No calendar reminders — add events in your calendar"
          />
          <Card className="p-4 bg-amber-50/80 border-amber-200/60 min-w-0">
            <h3 className="text-sm font-semibold text-gray-800 mb-2">Follow-ups</h3>
            <p className="text-sm text-gray-600">Use Students and Classes to review learners. Deeper analytics will tie to saved progress.</p>
            <Link href="/teacher/students" className="text-xs text-indigo-600 hover:underline mt-2 block">
              Open students →
            </Link>
          </Card>
          <Card className="p-4 min-w-0 overflow-x-auto">
            <h3 className="text-sm font-semibold text-gray-800 mb-3">Enrolment by class</h3>
            {classSummaries.length === 0 ? (
              <p className="text-sm text-gray-500">No classes in Nova Org yet.</p>
            ) : (
              <SoftBarChart
                data={classSummaries.map((c) => ({
                  label: c.name.length > 10 ? `${c.name.slice(0, 8)}…` : c.name,
                  value: c.studentCount,
                }))}
                height={80}
              />
            )}
          </Card>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <Card className="flex flex-col items-center py-6">
            <h3 className="text-sm font-medium text-gray-500 mb-4">Overall mastery (local)</h3>
            <RadialProgress
              percentage={avgProgress}
              size={140}
              color={avgProgress >= 70 ? '#10b981' : avgProgress >= 50 ? '#f59e0b' : '#6b7280'}
              label="Average"
              sublabel="maths strands"
            />
          </Card>

          <Card className="flex flex-col items-center py-6">
            <h3 className="text-sm font-medium text-gray-500 mb-4">Mastery distribution</h3>
            {totalM === 0 ? (
              <p className="text-sm text-gray-500 px-4 text-center">Complete practice to build mastery data on this device.</p>
            ) : (
              <>
                <MasteryDonut secure={totalSecure} developing={totalDeveloping} notStarted={totalNotStarted} size={140} />
                <div className="flex gap-3 mt-4 text-xs">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>{Math.round((totalSecure / totalM) * 100)}% Secure</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-amber-400" />
                    <span>{Math.round((totalDeveloping / totalM) * 100)}% Dev</span>
                  </div>
                </div>
              </>
            )}
          </Card>

          <Card className="py-6 min-w-0 overflow-x-auto">
            <h3 className="text-sm font-medium text-gray-500 mb-4 text-center">Class size</h3>
            {classSummaries.length === 0 ? (
              <p className="text-sm text-gray-500 text-center px-2">No classes</p>
            ) : (
              <BarChart data={classPerformance} height={140} />
            )}
          </Card>
        </div>

        <Card>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Progress by topic strand</h2>
          {mathsStrands.length === 0 ? (
            <p className="text-sm text-gray-500">No strand data yet. Practice objectives on the student app to populate mastery.</p>
          ) : (
            <StrandProgressBars strands={mathsStrands} />
          )}
        </Card>

        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Quick access</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Link href="/teacher/classes">
              <Card hover className="p-5 cursor-pointer border border-white/45 hover:border-blue-300 group">
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mb-3 group-hover:bg-blue-200">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900">Classes</h3>
                <p className="text-xs text-gray-500 mt-0.5">{classSummaries.length} classes</p>
              </Card>
            </Link>
            <Link href="/teacher/students">
              <Card hover className="p-5 cursor-pointer border border-white/45 hover:border-emerald-300 group">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center mb-3 group-hover:bg-emerald-200">
                  <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900">Students</h3>
                <p className="text-xs text-gray-500 mt-0.5">{totalStudents} total</p>
              </Card>
            </Link>
            <Link href="/teacher/calendar">
              <Card hover className="p-5 cursor-pointer border border-white/45 hover:border-violet-300 group">
                <div className="w-12 h-12 rounded-xl bg-violet-100 flex items-center justify-center mb-3 group-hover:bg-violet-200">
                  <svg className="w-6 h-6 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900">Calendar</h3>
                <p className="text-xs text-gray-500 mt-0.5">Lessons & planning</p>
              </Card>
            </Link>
            <Link href="/teacher/insights">
              <Card hover className="p-5 cursor-pointer border border-white/45 hover:border-amber-300 group">
                <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center mb-3 group-hover:bg-amber-200">
                  <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900">Insights</h3>
                <p className="text-xs text-gray-500 mt-0.5">Trends & risks</p>
              </Card>
            </Link>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Your classes</h2>
          <div className="grid gap-4">
            {classSummaries.length === 0 ? (
              <Card className="p-8 text-center text-gray-500">
                <p>No classes found in Nova Org.</p>
                <p className="text-sm mt-2">Add classes and enrolments in Nova Org, then refresh.</p>
              </Card>
            ) : (
              classSummaries.map((classItem, index) => (
                <Link key={classItem.id} href={`/teacher/classes/${classItem.id}`}>
                  <Card hover className="cursor-pointer border border-white/45 hover:border-blue-500 hover:shadow-lg relative overflow-hidden">
                    <div className="absolute -right-6 -top-6 text-8xl font-bold opacity-[0.03] text-gray-900">{index + 1}</div>
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 truncate">{classItem.name}</h3>
                          <Badge variant="default" className="bg-gray-100 text-gray-700 flex-shrink-0">
                            {classItem.studentCount} students
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500">{classItem.subject}</p>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))
            )}
          </div>
        </div>

        <Card>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Points leaders (org)</h2>
          {topByPoints.length === 0 ? (
            <p className="text-sm text-gray-500">No students in the organisation yet.</p>
          ) : (
            <div className="space-y-3">
              {topByPoints.map((student, index) => (
                <div key={student.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white flex-shrink-0 ${
                      index === 0 ? 'bg-amber-400' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-amber-700' : 'bg-gray-300'
                    }`}
                  >
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 truncate">{student.name}</div>
                    <div className="text-sm text-gray-500">Year {student.yearGroup}</div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="font-bold text-amber-600">{student.totalPoints} pts</div>
                    <div className="text-xs text-gray-500">Level {student.level}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </Layout>
  );
}
