'use client';

import Link from 'next/link';
import Layout from '@/components/Layout';
import Card from '@/components/Card';
import Badge from '@/components/Badge';
import { 
  RadialProgress, 
  BarChart, 
  MasteryDonut,
  StrandProgressBars 
} from '@/components/ProgressCharts';
import { mockClasses } from '@/lib/mockData';
import type { StrandMastery } from '@/lib/types';
import MathSymbolAnimation from '@/components/MathSymbolAnimation';
import MiniCalendar from '@/components/MiniCalendar';
import TaskWidget from '@/components/TaskWidget';
import { SoftBarChart, SoftDonut } from '@/components/NovaCharts';
import { teacherCalendarEvents } from '@/lib/teacherCalendarSeed';

export default function TeacherDashboard() {
  // Calculate aggregate stats
  const totalStudents = mockClasses.reduce((sum, c) => sum + c.studentCount, 0);
  const activeToday = mockClasses.reduce((sum, c) => sum + c.activeStudents, 0);
  const avgProgress = Math.round(mockClasses.reduce((sum, c) => sum + c.averageProgress, 0) / mockClasses.length);

  // Mock class mastery data for visualization
  const classPerformance = mockClasses.map(c => ({
    label: c.name.split(' ')[0], // Just year group
    value: c.averageProgress,
    max: 100,
    color: c.averageProgress >= 70 ? '#10b981' : c.averageProgress >= 50 ? '#f59e0b' : '#ef4444',
  }));

  // Mock strand data for all students
  const aggregateStrands: StrandMastery[] = [
    { subject: 'Mathematics', strand: 'Number', secure: 45, developing: 60, notStarted: 30, nextObjective: null },
    { subject: 'Mathematics', strand: 'Algebra', secure: 32, developing: 55, notStarted: 48, nextObjective: null },
    { subject: 'Mathematics', strand: 'Ratio, Proportion and Rates of Change', secure: 28, developing: 42, notStarted: 65, nextObjective: null },
    { subject: 'Mathematics', strand: 'Geometry and Measures', secure: 38, developing: 48, notStarted: 49, nextObjective: null },
    { subject: 'Mathematics', strand: 'Statistics', secure: 40, developing: 35, notStarted: 60, nextObjective: null },
  ];

  const totalSecure = aggregateStrands.reduce((s, a) => s + a.secure, 0);
  const totalDeveloping = aggregateStrands.reduce((s, a) => s + a.developing, 0);
  const totalNotStarted = aggregateStrands.reduce((s, a) => s + a.notStarted, 0);

  return (
    <Layout role="teacher">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              Teacher Dashboard
              <MathSymbolAnimation size="sm" colorIndex={2} />
            </h1>
            <p className="text-gray-600 mt-1">Monitor student progress across all classes</p>
          </div>
        </div>

        {/* Overview Stats - Bento gradient bubbles */}
        <Card className="p-5">
          <div className="text-sm font-medium text-gray-600 mb-3">Overview</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="rounded-xl bg-gradient-to-br from-slate-500 to-slate-600 p-4 text-white shadow-sm">
              <div className="flex items-center justify-between">
                <svg className="w-6 h-6 opacity-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                </svg>
                <span className="text-2xl font-bold tabular-nums">{mockClasses.length}</span>
              </div>
              <div className="text-xs text-white/90 mt-1">Classes</div>
            </div>
            <div className="rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 p-4 text-white shadow-sm">
              <div className="flex items-center justify-between">
                <svg className="w-6 h-6 opacity-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
                </svg>
                <span className="text-2xl font-bold tabular-nums">{totalStudents}</span>
              </div>
              <div className="text-xs text-white/90 mt-1">Total Students</div>
            </div>
            <div className="rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 p-4 text-white shadow-sm">
              <div className="flex items-center justify-between">
                <svg className="w-6 h-6 opacity-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
                </svg>
                <span className="text-2xl font-bold tabular-nums">{activeToday}</span>
              </div>
              <div className="text-xs text-white/90 mt-1">Active Today</div>
            </div>
            <div className="rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 p-4 text-white shadow-sm">
              <div className="flex items-center justify-between">
                <svg className="w-6 h-6 opacity-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <span className="text-2xl font-bold tabular-nums">{avgProgress}%</span>
              </div>
              <div className="text-xs text-white/90 mt-1">Avg. Mastery</div>
            </div>
          </div>
        </Card>

        {/* Bento: Calendar, Tasks, Interventions, Class trends */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MiniCalendar events={teacherCalendarEvents} href="/teacher/calendar" title="Teaching calendar" />
          <TaskWidget
            title="Tasks & reminders"
            href="/teacher/calendar"
            tasks={[
              { id: '1', title: 'Intervention: at-risk students', due: 'Mar 20', href: '/teacher/students' },
              { id: '2', title: 'Lesson planning', due: 'Mar 22', href: '/teacher/calendar' },
              { id: '3', title: 'Assessment checkpoint', due: 'Mar 25', href: '/teacher/classes' },
              { id: '4', title: 'Mock exam prep', due: 'Mar 17', href: '/teacher/classes' },
            ]}
          />
          <Card className="p-4 bg-amber-50/80 border-amber-200/60">
            <h3 className="text-sm font-semibold text-gray-800 mb-2">Intervention reminders</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-700">8 students inactive 3+ days</span>
                <Link href="/teacher/students" className="text-xs text-indigo-600 hover:underline">View</Link>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-700">Algebra needs attention</span>
                <Link href="/teacher/classes" className="text-xs text-indigo-600 hover:underline">View</Link>
              </div>
            </div>
          </Card>
          <Card className="p-4 bg-white/95">
            <h3 className="text-sm font-semibold text-gray-800 mb-3">Class trends</h3>
            <SoftBarChart
              data={mockClasses.map((c) => ({
                label: c.name.split(' ')[0],
                value: c.averageProgress,
              }))}
              height={80}
            />
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid md:grid-cols-3 gap-4">
          {/* Overall Progress */}
          <Card className="flex flex-col items-center py-6">
            <h3 className="text-sm font-medium text-gray-500 mb-4">Overall Progress</h3>
            <RadialProgress 
              percentage={avgProgress}
              size={140}
              color={avgProgress >= 70 ? '#10b981' : avgProgress >= 50 ? '#f59e0b' : '#6b7280'}
              label="Average"
              sublabel="all students"
            />
          </Card>

          {/* Mastery Distribution */}
          <Card className="flex flex-col items-center py-6">
            <h3 className="text-sm font-medium text-gray-500 mb-4">Mastery Distribution</h3>
            <MasteryDonut 
              secure={totalSecure}
              developing={totalDeveloping}
              notStarted={totalNotStarted}
              size={140}
            />
            <div className="flex gap-3 mt-4 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>{Math.round((totalSecure / (totalSecure + totalDeveloping + totalNotStarted)) * 100)}% Secure</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-amber-400" />
                <span>{Math.round((totalDeveloping / (totalSecure + totalDeveloping + totalNotStarted)) * 100)}% Dev</span>
              </div>
            </div>
          </Card>

          {/* Class Comparison */}
          <Card className="py-6">
            <h3 className="text-sm font-medium text-gray-500 mb-4 text-center">Class Progress</h3>
            <BarChart data={classPerformance} height={140} />
          </Card>
        </div>

        {/* Strand Progress */}
        <Card>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Progress by Topic Strand</h2>
          <StrandProgressBars strands={aggregateStrands} />
        </Card>

        {/* Quick action thumbnails */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Quick access</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Link href="/teacher/classes">
              <Card hover className="p-5 cursor-pointer border border-gray-200 hover:border-blue-300 group">
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mb-3 group-hover:bg-blue-200">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900">Classes</h3>
                <p className="text-xs text-gray-500 mt-0.5">{mockClasses.length} classes</p>
              </Card>
            </Link>
            <Link href="/teacher/students">
              <Card hover className="p-5 cursor-pointer border border-gray-200 hover:border-emerald-300 group">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center mb-3 group-hover:bg-emerald-200">
                  <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900">Students</h3>
                <p className="text-xs text-gray-500 mt-0.5">{totalStudents} total</p>
              </Card>
            </Link>
            <Link href="/teacher/calendar">
              <Card hover className="p-5 cursor-pointer border border-gray-200 hover:border-violet-300 group">
                <div className="w-12 h-12 rounded-xl bg-violet-100 flex items-center justify-center mb-3 group-hover:bg-violet-200">
                  <svg className="w-6 h-6 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900">Calendar</h3>
                <p className="text-xs text-gray-500 mt-0.5">Lessons & planning</p>
              </Card>
            </Link>
            <Link href="/teacher/insights">
              <Card hover className="p-5 cursor-pointer border border-gray-200 hover:border-amber-300 group">
                <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center mb-3 group-hover:bg-amber-200">
                  <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900">Insights</h3>
                <p className="text-xs text-gray-500 mt-0.5">Trends & risks</p>
              </Card>
            </Link>
          </div>
        </div>

        {/* Classes List */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Your Classes</h2>
          <div className="grid gap-4">
            {mockClasses.map((classItem, index) => (
              <Link key={classItem.id} href={`/teacher/classes/${classItem.id}`}>
                <Card hover className="cursor-pointer border border-gray-200 hover:border-blue-500 hover:shadow-lg relative overflow-hidden">
                  {/* Class number decoration */}
                  <div className="absolute -right-6 -top-6 text-8xl font-bold opacity-[0.03] text-gray-900">
                    {index + 1}
                  </div>
                  
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    {/* Progress Ring */}
                    <div className="hidden md:block">
                      <div className="relative w-16 h-16">
                        <svg className="w-16 h-16 -rotate-90">
                          <circle cx="32" cy="32" r="28" fill="none" stroke="#e5e7eb" strokeWidth="4" />
                          <circle 
                            cx="32" cy="32" r="28" fill="none" 
                            stroke={classItem.averageProgress >= 70 ? '#10b981' : classItem.averageProgress >= 50 ? '#f59e0b' : '#6b7280'}
                            strokeWidth="4" 
                            strokeDasharray={`${classItem.averageProgress * 1.76} 176`}
                            strokeLinecap="round"
                          />
                        </svg>
                        <span className="absolute inset-0 flex items-center justify-center text-sm font-bold">
                          {classItem.averageProgress}%
                        </span>
                      </div>
                    </div>
                    
                    {/* Class Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{classItem.name}</h3>
                        <Badge variant="default" className="bg-gray-100 text-gray-700">{classItem.studentCount} students</Badge>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <div className="text-gray-500">Active</div>
                          <div className="font-semibold text-emerald-600">{classItem.activeStudents} today</div>
                        </div>
                        <div>
                          <div className="text-gray-500">Progress</div>
                          <div className="font-semibold">{classItem.averageProgress}%</div>
                        </div>
                        <div>
                          <div className="text-gray-500">Recent</div>
                          <div className="font-medium text-gray-700">{classItem.recentActivity}</div>
                        </div>
                      </div>
                    </div>

                    {/* Weak Topics */}
                    <div className="md:text-right">
                      <div className="text-xs text-gray-500 mb-1">Needs attention:</div>
                      <div className="flex flex-wrap gap-1 justify-start md:justify-end">
                        {classItem.weakTopics.slice(0, 2).map((topic, idx) => (
                          <span key={idx} className="px-2 py-1 rounded-full text-xs bg-amber-50 text-amber-700 border border-amber-200">
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Quick Insights */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="bg-emerald-50 border-emerald-200">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-emerald-900">Most Improved</h3>
                <p className="text-sm text-emerald-700 mt-1">Trigonometry shows 15% improvement this week</p>
              </div>
            </div>
          </Card>
          
          <Card className="bg-amber-50 border-amber-200">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-amber-900">Needs Attention</h3>
                <p className="text-sm text-amber-700 mt-1">8 students inactive for 3+ days</p>
              </div>
            </div>
          </Card>

          <Card className="bg-blue-50 border-blue-200">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-blue-900">New Mastery</h3>
                <p className="text-sm text-blue-700 mt-1">12 objectives mastered today across classes</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Top Performers */}
        <Card>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Top Performers This Week</h2>
          <div className="space-y-3">
            {[
              { name: 'Emma Wilson', class: 'Year 10', xp: 450, level: 7 },
              { name: 'James Chen', class: 'Year 11', xp: 380, level: 6 },
              { name: 'Sophie Brown', class: 'Year 10', xp: 340, level: 5 },
              { name: 'Oliver Davis', class: 'Year 9', xp: 320, level: 5 },
              { name: 'Amelia Taylor', class: 'Year 11', xp: 290, level: 5 },
            ].map((student, index) => (
              <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                  index === 0 ? 'bg-amber-400' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-amber-700' : 'bg-gray-300'
                }`}>
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{student.name}</div>
                  <div className="text-sm text-gray-500">{student.class}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-amber-600">+{student.xp} XP</div>
                  <div className="text-xs text-gray-500">Level {student.level}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </Layout>
  );
}
