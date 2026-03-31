'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Layout from '@/components/Layout';
import Card from '@/components/Card';
import Button from '@/components/Button';
import StudentNovaAgentPanel from '@/components/teacher/StudentNovaAgentPanel';
import { 
  RadialProgress, 
  LevelBadge, 
  MasteryDonut, 
  StrandProgressBars,
  WeeklyActivity,
  BarChart 
} from '@/components/ProgressCharts';
import { orgService, useOrgSync } from '@/lib/orgService';
import { masteryService, pointsService, curriculumService } from '@/lib/services';
import { StrandMastery } from '@/lib/types';

export default function StudentDetail({ params }: { params: { studentId: string } }) {
  useOrgSync();
  const student = orgService.listStudents().find((s) => s.id === params.studentId);
  const [novaQuery, setNovaQuery] = useState('');
  const [mathsStrands, setMathsStrands] = useState<StrandMastery[]>([]);
  const [weeklyActivity, setWeeklyActivity] = useState<{ day: string; minutes: number }[]>([]);

  useEffect(() => {
    const strands = masteryService.getStrandMastery('Mathematics');
    setMathsStrands(strands);
    setWeeklyActivity(pointsService.getWeeklyActivity());
  }, []);

  const handleAskNova = () => {
    if (!novaQuery.trim()) return;
    alert('Request queued for Nova (teacher agent).');
  };

  const totalSecure = mathsStrands.reduce((sum, s) => sum + s.secure, 0);
  const totalDeveloping = mathsStrands.reduce((sum, s) => sum + s.developing, 0);
  const totalNotStarted = mathsStrands.reduce((sum, s) => sum + s.notStarted, 0);
  const totalObjectives = totalSecure + totalDeveloping + totalNotStarted;

  if (!student) {
    return (
      <Layout role="teacher">
        <Card className="p-8 text-center text-gray-500">
          <p>Student not found in Nova Org.</p>
        </Card>
      </Layout>
    );
  }

  const orgRecord = orgService.getOrgStudentRecord(student.id);
  const flagAreas = orgRecord?.flaggedIssues ?? [];
  const studentLevel = student.level;
  const studentPoints = student.totalPoints;

  return (
    <Layout role="teacher">
      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr),380px] gap-6 max-w-6xl">
        <div className="space-y-6">
        {/* Student Profile Header */}
        <Card decorative className="border border-white/50 relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute -right-12 top-8 opacity-5">
            <svg width="100" height="100" viewBox="0 0 100 100">
              <path d="M50 10L60 40L90 40L65 60L75 90L50 70L25 90L35 60L10 40L40 40L50 10Z" fill="currentColor" className="text-gray-900"/>
            </svg>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-start gap-6 relative">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                {student.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="md:hidden">
                <h1 className="text-xl font-bold text-gray-900">{student.name}</h1>
                <p className="text-gray-500">Year {student.yearGroup} · {student.subjects.join(', ')}</p>
              </div>
            </div>
            
            <div className="flex-1">
              <div className="hidden md:block mb-4">
                <h1 className="text-2xl font-bold text-gray-900">{student.name}</h1>
                <div className="flex gap-2 mt-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700">
                    Year {student.yearGroup}
                  </span>
                  {student.mathsTier && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-50 text-emerald-700">
                      {student.mathsTier} tier
                    </span>
                  )}
                </div>
              </div>
              
              {/* Level Badge */}
              <div className="flex items-center gap-6">
                <LevelBadge 
                  level={studentLevel}
                  points={studentPoints}
                  pointsToNext={pointsService.getPointsToNextLevel(studentPoints)}
                  size="md"
                />
                
                {/* Quick Stats */}
                <div className="hidden md:flex gap-6">
                  <div>
                    <div className="text-xs font-medium text-gray-500 uppercase">Streak</div>
                    <div className="text-2xl font-bold text-amber-600">—</div>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-gray-500 uppercase">Org status</div>
                    <div className="text-lg font-medium text-gray-700">{orgRecord?.paymentStatus ?? '—'}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Progress Overview Charts */}
        <div className="grid md:grid-cols-3 gap-4">
          {/* Overall Progress */}
          <Card className="flex flex-col items-center py-6">
            <h3 className="text-sm font-medium text-gray-500 mb-4">Overall Mastery</h3>
            <RadialProgress 
              percentage={totalObjectives > 0 ? ((totalSecure + totalDeveloping * 0.5) / totalObjectives) * 100 : 0}
              size={140}
              color="#10b981"
              label="Complete"
              sublabel={`${totalSecure} secure`}
            />
          </Card>

          {/* Mastery Breakdown */}
          <Card className="flex flex-col items-center py-6">
            <h3 className="text-sm font-medium text-gray-500 mb-4">Objectives Breakdown</h3>
            <MasteryDonut 
              secure={totalSecure}
              developing={totalDeveloping}
              notStarted={totalNotStarted}
              size={140}
            />
            <div className="flex gap-4 mt-4 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span>{totalSecure} Secure</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <span>{totalDeveloping} Dev</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-gray-200" />
                <span>{totalNotStarted} New</span>
              </div>
            </div>
          </Card>

          {/* Weekly Activity */}
          <Card className="py-6">
            <h3 className="text-sm font-medium text-gray-500 mb-4 text-center">This Week's Activity</h3>
            <WeeklyActivity data={weeklyActivity} goal={30} />
          </Card>
        </div>

        {/* Strand Progress */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Progress by Strand</h2>
            <span className="text-sm text-gray-500">{totalObjectives} objectives total</span>
          </div>
          <StrandProgressBars strands={mathsStrands} />
        </Card>

        {/* Strand Comparison Chart */}
        <Card>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Secure Objectives by Strand</h2>
          <BarChart 
            data={mathsStrands.map(s => ({
              label: s.strand.split(' ')[0],
              value: s.secure,
              max: Math.max(1, s.secure + s.developing + s.notStarted),
              color: s.secure > s.developing ? '#10b981' : '#f59e0b',
            }))}
            height={160}
          />
        </Card>

        {/* Areas Needing Attention */}
        <Card>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Flags & follow-ups</h2>
          {flagAreas.length === 0 ? (
            <p className="text-sm text-gray-500">No flags recorded in Nova Org for this student.</p>
          ) : (
            <ul className="space-y-2">
              {flagAreas.map((area) => (
                <li key={area} className="px-3 py-2 rounded-lg bg-amber-50 border border-amber-100 text-sm text-gray-800">
                  {area.replace(/_/g, ' ')}
                </li>
              ))}
            </ul>
          )}
        </Card>

        {/* Recent Activity Timeline */}
        <Card>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Recent activity</h2>
          <p className="text-sm text-gray-500">
            Session history will appear here as this learner uses Nova Student (practice, chat, and milestones).
          </p>
        </Card>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="text-center">
            <div className="text-sm font-medium text-gray-500 mb-1">Total points</div>
            <div className="text-2xl font-bold text-amber-600">{studentPoints.toLocaleString()}</div>
          </Card>
          <Card className="text-center">
            <div className="text-sm font-medium text-gray-500 mb-1">Level</div>
            <div className="text-2xl font-bold text-orange-600">{studentLevel}</div>
          </Card>
          <Card className="text-center">
            <div className="text-sm font-medium text-gray-500 mb-1">Attendance (org)</div>
            <div className="text-2xl font-bold text-blue-600">{orgRecord?.daysAttended ?? '—'}</div>
          </Card>
          <Card className="text-center">
            <div className="text-sm font-medium text-gray-500 mb-1">Hours (org)</div>
            <div className="text-2xl font-bold text-purple-600">{orgRecord?.hoursCompleted ?? '—'}</div>
          </Card>
        </div>

        {/* Ask Nova */}
        <Card className="border border-gray-200">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-gray-900">Ask Nova About This Student</h2>
            <p className="text-gray-600 text-sm mt-1">
              Get AI-powered insights about {student.name.split(' ')[0]}'s learning patterns
            </p>
          </div>

          <div className="space-y-4">
            <textarea
              value={novaQuery}
              onChange={(e) => setNovaQuery(e.target.value)}
              placeholder="e.g., 'What teaching approach would work best for this student?'"
              rows={3}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
            />
            
            <div className="flex gap-3">
              <Button onClick={handleAskNova} disabled={!novaQuery.trim()}>
                Ask Nova
              </Button>
              <Button variant="secondary" onClick={() => setNovaQuery('')}>
                Clear
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              {[
                'Learning strengths',
                'Recommend practice',
                'Intervention strategies',
                'Compare to class'
              ].map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => setNovaQuery(suggestion)}
                  className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm hover:bg-gray-100 hover:border-blue-500 transition-all"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </Card>
        </div>

        {/* Student Nova Agent (dedicated thread) */}
        <div className="xl:sticky xl:top-6 h-fit">
          <StudentNovaAgentPanel
            scope={{
              orgId: 'org_nova_demo',
              teacherId: 'teacher_demo',
              studentId: student.id,
            }}
          />
        </div>
      </div>
    </Layout>
  );
}
