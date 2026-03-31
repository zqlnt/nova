'use client';

import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import Card from '@/components/Card';
import Button from '@/components/Button';
import MasteryChip from '@/components/MasteryChip';
import ObjectiveCard from '@/components/ObjectiveCard';
import { LevelBadge, PointsDisplay, RadialProgress } from '@/components/ProgressCharts';
import { useStudent } from '@/contexts/StudentContext';
import { masteryService, curriculumService, pointsService } from '@/lib/services';
import { Objective, SubjectMastery } from '@/lib/types';
import Link from 'next/link';
import MathSymbolAnimation from '@/components/MathSymbolAnimation';
import MiniCalendar from '@/components/MiniCalendar';
import TaskWidget from '@/components/TaskWidget';
import { SoftDonut, SoftBarChart } from '@/components/NovaCharts';
import { studentCalendarEvents } from '@/lib/studentCalendarSeed';

export default function StudentDashboard() {
  const { 
    profile, 
    isLoading, 
    nextObjective, 
    todayProgress, 
    getMasteryForObjective,
    chatScope,
  } = useStudent();

  const [mathsMastery, setMathsMastery] = useState<SubjectMastery | null>(null);
  const [englishMastery, setEnglishMastery] = useState<SubjectMastery | null>(null);
  const [weakObjectives, setWeakObjectives] = useState<{ maths: Objective[], english: Objective[] }>({
    maths: [],
    english: [],
  });

  useEffect(() => {
    if (!isLoading) {
      setMathsMastery(masteryService.getSubjectMastery('Mathematics'));
      setEnglishMastery(masteryService.getSubjectMastery('English'));
      setWeakObjectives({
        maths: masteryService.getLowestMasteryObjectives('Mathematics', 3),
        english: masteryService.getLowestMasteryObjectives('English', 3),
      });
    }
  }, [isLoading]);

  if (isLoading) {
    return (
      <Layout role="student">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-pulse text-gray-500">Loading...</div>
        </div>
      </Layout>
    );
  }

  const studentName = profile?.name?.split(' ')[0] || 'Student';

  return (
    <Layout role="student">
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              Welcome back, {studentName}!
              <MathSymbolAnimation size="sm" colorIndex={0} />
            </h1>
            <p className="text-gray-600 mt-1">
              Year {profile?.yearGroup} • {profile?.subjects?.join(' & ')}
              {profile?.mathsTier && ` • ${profile.mathsTier} Tier`}
            </p>
            <span className="inline-block mt-2 text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
              GCSE • AQA & Pearson Edexcel
            </span>
          </div>
          
          {/* Level Badge */}
          <div className="flex items-center">
            <LevelBadge 
              level={profile?.level || 1}
              points={profile?.totalPoints || 0}
              pointsToNext={pointsService.getPointsToNextLevel(profile?.totalPoints || 0)}
              size="md"
            />
          </div>
        </div>

        {/* Today's Progress Stats - Bento gradient bubbles */}
        <Card className="p-5">
          <div className="text-sm font-medium text-gray-600 mb-3">Today&apos;s Progress</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 p-4 text-white shadow-sm">
              <div className="flex items-center justify-between">
                <svg className="w-6 h-6 opacity-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <span className="text-2xl font-bold tabular-nums">{todayProgress.minutesSpent}</span>
              </div>
              <div className="text-xs text-white/90 mt-1">mins today</div>
            </div>
            <div className="rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 p-4 text-white shadow-sm">
              <div className="flex items-center justify-between">
                <svg className="w-6 h-6 opacity-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <span className="text-2xl font-bold tabular-nums">{todayProgress.questionsCorrect}</span>
              </div>
              <div className="text-xs text-white/90 mt-1">correct</div>
            </div>
            <div className="rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 p-4 text-white shadow-sm">
              <div className="flex items-center justify-between">
                <svg className="w-6 h-6 opacity-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"/>
                </svg>
                <span className="text-2xl font-bold tabular-nums">{profile?.currentStreak || 0}</span>
              </div>
              <div className="text-xs text-white/90 mt-1">day streak</div>
            </div>
            <div className="rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 p-4 text-white shadow-sm">
              <div className="flex items-center justify-between">
                <svg className="w-6 h-6 opacity-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
                </svg>
                <span className="text-2xl font-bold tabular-nums">{todayProgress.objectivesPracticed.length}</span>
              </div>
              <div className="text-xs text-white/90 mt-1">objectives</div>
            </div>
          </div>
        </Card>

        {/* Bento: Mini Calendar, Tasks, Countdown, Activity Chart */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MiniCalendar
            events={studentCalendarEvents}
            href="/student/calendar"
            title="This month"
          />
          <TaskWidget
            title="My tasks"
            href="/student/calendar"
            tasks={[
              { id: '1', title: 'Algebra revision block', due: 'Mar 24', href: '/student/calendar' },
              { id: '2', title: 'Practice 50 questions', due: 'Mar 15', href: '/student/practice' },
              { id: '3', title: 'Revision checkpoint', due: 'Apr 15', href: '/student/calendar' },
              { id: '4', title: 'Next objective practice', href: '/student/practice' },
            ]}
          />
          <Card className="p-4 bg-gradient-to-br from-rose-50 to-pink-50 border-rose-100">
            <h3 className="text-sm font-semibold text-gray-800 mb-2">Exam countdown</h3>
            <div className="text-3xl font-bold text-rose-600 tabular-nums">
              {Math.max(0, Math.ceil((new Date('2026-05-11').getTime() - Date.now()) / (1000 * 60 * 60 * 24)))}
            </div>
            <p className="text-xs text-gray-600 mt-1">days to GCSE exams</p>
            <Link href="/student/calendar" className="text-xs text-indigo-600 hover:underline mt-2 block">View calendar →</Link>
          </Card>
          <Card className="p-4">
            <h3 className="text-sm font-semibold text-gray-800 mb-3">Weekly activity</h3>
            <SoftBarChart
              data={[
                { label: 'Mon', value: Math.min(todayProgress.questionsAttempted + 10, 20) },
                { label: 'Tue', value: Math.min(todayProgress.questionsCorrect + 8, 18) },
                { label: 'Wed', value: todayProgress.minutesSpent + 5 },
                { label: 'Thu', value: todayProgress.objectivesPracticed.length + 3 },
                { label: 'Today', value: todayProgress.questionsAttempted + todayProgress.minutesSpent },
              ]}
              height={80}
            />
          </Card>
        </div>

        {/* Primary CTA - Learning Loop */}
        <Card className="bg-gradient-to-br from-blue-600 to-blue-700 text-white border-0">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 rounded bg-white/20 text-white text-xs font-medium">
                  {nextObjective ? 'Next Objective' : 'Continue Learning'}
                </span>
              </div>
              <h2 className="text-xl font-bold mb-1">
                {nextObjective?.title || 'Start Today\'s Practice'}
              </h2>
              <p className="text-blue-100 text-sm">
                {nextObjective?.description || 'Complete a 10-minute practice session to keep your streak going!'}
              </p>
              {nextObjective && (
                <div className="flex items-center gap-3 mt-3 text-sm text-blue-100">
                  <span>{nextObjective.strand}</span>
                  <span>•</span>
                  <span>{'★'.repeat(nextObjective.difficulty)}{'☆'.repeat(5 - nextObjective.difficulty)}</span>
                </div>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Link href={`/student/practice${nextObjective ? `?objective=${nextObjective.id}` : ''}`}>
                <button className="w-full px-6 py-3 bg-white text-blue-600 font-medium rounded-xl hover:bg-blue-50 transition-all">
                  Start 10-min Practice →
                </button>
              </Link>
              <Link href="/student/chat">
                <button className="w-full px-6 py-3 text-white/80 font-medium rounded-xl hover:text-white hover:bg-white/10 transition-all">
                  Ask Nova for Help
                </button>
              </Link>
            </div>
          </div>
        </Card>

        {/* Learning Loop Steps */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="text-center border-2 border-blue-200 bg-blue-50/50">
            <div className="w-8 h-8 mx-auto mb-2 text-blue-600">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900">Learn</h3>
            <p className="text-xs text-gray-600 mt-1">Short explanation</p>
          </Card>
          <Card className="text-center border-2 border-amber-200 bg-amber-50/50">
            <div className="w-8 h-8 mx-auto mb-2 text-amber-600">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900">Practice</h3>
            <p className="text-xs text-gray-600 mt-1">Questions + feedback</p>
          </Card>
          <Card className="text-center border-2 border-emerald-200 bg-emerald-50/50">
            <div className="w-8 h-8 mx-auto mb-2 text-emerald-600">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900">Prove</h3>
            <p className="text-xs text-gray-600 mt-1">Quick check quiz</p>
          </Card>
        </div>

        {/* Mastery Summary */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Maths Mastery */}
          {mathsMastery && profile?.subjects?.includes('Mathematics') && (
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">Mathematics</h2>
                <Link href="/student/learning-map?subject=Mathematics" className="text-sm text-blue-600 hover:underline">
                  View Map →
                </Link>
              </div>
              
              <div className="flex items-center gap-6">
                {/* Radial Progress */}
                <RadialProgress 
                  percentage={mathsMastery.totalObjectives > 0 
                    ? ((mathsMastery.secureCount + mathsMastery.developingCount * 0.5) / mathsMastery.totalObjectives) * 100 
                    : 0}
                  size={100}
                  strokeWidth={8}
                  color="#10b981"
                />
                
                {/* Stats */}
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-emerald-500" />
                      <span className="text-sm text-gray-600">Secure</span>
                    </div>
                    <span className="font-semibold">{mathsMastery.secureCount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-amber-400" />
                      <span className="text-sm text-gray-600">Developing</span>
                    </div>
                    <span className="font-semibold">{mathsMastery.developingCount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-gray-200" />
                      <span className="text-sm text-gray-600">Not Started</span>
                    </div>
                    <span className="font-semibold">{mathsMastery.notStartedCount}</span>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* English Mastery */}
          {englishMastery && profile?.subjects?.includes('English') && (
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">English</h2>
                <Link href="/student/learning-map?subject=English" className="text-sm text-blue-600 hover:underline">
                  View Map →
                </Link>
              </div>
              
              <div className="flex items-center gap-6">
                {/* Radial Progress */}
                <RadialProgress 
                  percentage={englishMastery.totalObjectives > 0 
                    ? ((englishMastery.secureCount + englishMastery.developingCount * 0.5) / englishMastery.totalObjectives) * 100 
                    : 0}
                  size={100}
                  strokeWidth={8}
                  color="#3b82f6"
                />
                
                {/* Stats */}
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-emerald-500" />
                      <span className="text-sm text-gray-600">Secure</span>
                    </div>
                    <span className="font-semibold">{englishMastery.secureCount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-amber-400" />
                      <span className="text-sm text-gray-600">Developing</span>
                    </div>
                    <span className="font-semibold">{englishMastery.developingCount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-gray-200" />
                      <span className="text-sm text-gray-600">Not Started</span>
                    </div>
                    <span className="font-semibold">{englishMastery.notStartedCount}</span>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Revision summary - mini donut */}
        {mathsMastery && (
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-5 flex flex-row items-center gap-6">
              <SoftDonut
                data={[
                  { label: 'Secure', value: mathsMastery.secureCount },
                  { label: 'Developing', value: mathsMastery.developingCount },
                  { label: 'Not started', value: mathsMastery.notStartedCount },
                ]}
                size={90}
                strokeWidth={8}
                centerValue={mathsMastery.secureCount}
                centerLabel="secure"
              />
              <div>
                <h3 className="font-semibold text-gray-800">Maths readiness</h3>
                <p className="text-sm text-gray-500 mt-1">
                  {mathsMastery.totalObjectives > 0
                    ? Math.round(((mathsMastery.secureCount + mathsMastery.developingCount * 0.5) / mathsMastery.totalObjectives) * 100)
                    : 0}% ready for exam
                </p>
              </div>
            </Card>
            {englishMastery && profile?.subjects?.includes('English') && (
              <Card className="p-5 flex flex-row items-center gap-6">
                <SoftDonut
                  data={[
                    { label: 'Secure', value: englishMastery.secureCount },
                    { label: 'Developing', value: englishMastery.developingCount },
                    { label: 'Not started', value: englishMastery.notStartedCount },
                  ]}
                  size={90}
                  strokeWidth={8}
                  centerValue={englishMastery.secureCount}
                  centerLabel="secure"
                />
                <div>
                  <h3 className="font-semibold text-gray-800">English readiness</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {englishMastery.totalObjectives > 0
                      ? Math.round(((englishMastery.secureCount + englishMastery.developingCount * 0.5) / englishMastery.totalObjectives) * 100)
                      : 0}% ready for exam
                  </p>
                </div>
              </Card>
            )}
          </div>
        )}

        {/* Areas to Improve */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Areas to Improve</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Maths Weak Areas */}
            {profile?.subjects?.includes('Mathematics') && weakObjectives.maths.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-3">Mathematics</h3>
                <div className="space-y-3">
                  {weakObjectives.maths.map(obj => (
                    <ObjectiveCard
                      key={obj.id}
                      objective={obj}
                      masteryStatus={getMasteryForObjective(obj.id)?.status || 'not_started'}
                      showDescription={false}
                      onStartPractice={() => window.location.href = `/student/practice?objective=${obj.id}`}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* English Weak Areas */}
            {profile?.subjects?.includes('English') && weakObjectives.english.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-3">English</h3>
                <div className="space-y-3">
                  {weakObjectives.english.map(obj => (
                    <ObjectiveCard
                      key={obj.id}
                      objective={obj}
                      masteryStatus={getMasteryForObjective(obj.id)?.status || 'not_started'}
                      showDescription={false}
                      onStartPractice={() => window.location.href = `/student/practice?objective=${obj.id}`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick action thumbnails - visual shortcuts */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Quick access</h2>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            <Link href="/student/chat">
              <Card hover className="p-5 cursor-pointer border border-white/45 hover:border-blue-300 group">
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mb-3 group-hover:bg-blue-200 transition-colors">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900">Chat with Nova</h3>
                <p className="text-xs text-gray-500 mt-0.5">Get help anytime</p>
              </Card>
            </Link>
            <Link href="/student/practice">
              <Card hover className="p-5 cursor-pointer border border-white/45 hover:border-amber-300 group">
                <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center mb-3 group-hover:bg-amber-200 transition-colors">
                  <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900">Practice</h3>
                <p className="text-xs text-gray-500 mt-0.5">Questions & quizzes</p>
              </Card>
            </Link>
            <Link href="/student/learning-map">
              <Card hover className="p-5 cursor-pointer border border-white/45 hover:border-emerald-300 group">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center mb-3 group-hover:bg-emerald-200 transition-colors">
                  <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900">Learning Map</h3>
                <p className="text-xs text-gray-500 mt-0.5">All objectives</p>
              </Card>
            </Link>
            <Link href="/student/calendar">
              <Card hover className="p-5 cursor-pointer border border-white/45 hover:border-violet-300 group">
                <div className="w-12 h-12 rounded-xl bg-violet-100 flex items-center justify-center mb-3 group-hover:bg-violet-200 transition-colors">
                  <svg className="w-6 h-6 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900">Calendar</h3>
                <p className="text-xs text-gray-500 mt-0.5">Exams & revision</p>
              </Card>
            </Link>
            <Link href="/student/settings">
              <Card hover className="p-5 cursor-pointer border border-white/45 hover:border-slate-300 group">
                <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mb-3 group-hover:bg-slate-200 transition-colors">
                  <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900">Settings</h3>
                <p className="text-xs text-gray-500 mt-0.5">Preferences</p>
              </Card>
            </Link>
          </div>
        </div>

      </div>
    </Layout>
  );
}
