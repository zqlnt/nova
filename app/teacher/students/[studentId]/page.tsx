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
import { mockClassStudents } from '@/lib/mockData';
import { masteryService, pointsService, curriculumService } from '@/lib/services';
import { StrandMastery } from '@/lib/types';

export default function StudentDetail({ params }: { params: { studentId: string } }) {
  const student = mockClassStudents.find(s => s.id === params.studentId) || mockClassStudents[0];
  const [novaQuery, setNovaQuery] = useState('');
  const [mathsStrands, setMathsStrands] = useState<StrandMastery[]>([]);
  const [weeklyActivity, setWeeklyActivity] = useState<{ day: string; minutes: number }[]>([]);

  useEffect(() => {
    // Get mastery data for this student
    const strands = masteryService.getStrandMastery('Mathematics');
    setMathsStrands(strands);
    
    // Get weekly activity
    setWeeklyActivity(pointsService.getWeeklyActivity());
  }, []);

  const handleAskNova = () => {
    alert(`Nova will analyze: "${novaQuery}"\n\n(This is a placeholder - AI analysis will be implemented later)`);
  };

  // Calculate totals
  const totalSecure = mathsStrands.reduce((sum, s) => sum + s.secure, 0);
  const totalDeveloping = mathsStrands.reduce((sum, s) => sum + s.developing, 0);
  const totalNotStarted = mathsStrands.reduce((sum, s) => sum + s.notStarted, 0);
  const totalObjectives = totalSecure + totalDeveloping + totalNotStarted;

  // Mock student level/points data
  const studentLevel = 5;
  const studentPoints = 2450;

  return (
    <Layout role="teacher">
      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr),380px] gap-6 max-w-6xl">
        <div className="space-y-6">
        {/* Student Profile Header */}
        <Card decorative className="border border-gray-200 bg-white relative overflow-hidden">
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
                <p className="text-gray-500">Year 10 • Mathematics</p>
              </div>
            </div>
            
            <div className="flex-1">
              <div className="hidden md:block mb-4">
                <h1 className="text-2xl font-bold text-gray-900">{student.name}</h1>
                <div className="flex gap-2 mt-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700">
                    Year 10 Mathematics
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-50 text-emerald-700">
                    Higher Tier
                  </span>
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
                    <div className="text-2xl font-bold text-amber-600">{student.lessonsCompleted % 10 || 7} days</div>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-gray-500 uppercase">Last Active</div>
                    <div className="text-lg font-medium text-gray-700">{student.lastActive}</div>
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
              secure={totalSecure || 5}
              developing={totalDeveloping || 8}
              notStarted={totalNotStarted || 12}
              size={140}
            />
            <div className="flex gap-4 mt-4 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span>{totalSecure || 5} Secure</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <span>{totalDeveloping || 8} Dev</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-gray-200" />
                <span>{totalNotStarted || 12} New</span>
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
          <StrandProgressBars strands={mathsStrands.length > 0 ? mathsStrands : [
            { subject: 'Mathematics', strand: 'Number', secure: 3, developing: 4, notStarted: 5, nextObjective: null },
            { subject: 'Mathematics', strand: 'Algebra', secure: 2, developing: 3, notStarted: 6, nextObjective: null },
            { subject: 'Mathematics', strand: 'Geometry and Measures', secure: 1, developing: 2, notStarted: 4, nextObjective: null },
            { subject: 'Mathematics', strand: 'Statistics', secure: 1, developing: 1, notStarted: 2, nextObjective: null },
          ]} />
        </Card>

        {/* Strand Comparison Chart */}
        <Card>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Secure Objectives by Strand</h2>
          <BarChart 
            data={(mathsStrands.length > 0 ? mathsStrands : [
              { subject: 'Mathematics', strand: 'Number', secure: 3, developing: 4, notStarted: 5, nextObjective: null },
              { subject: 'Mathematics', strand: 'Algebra', secure: 2, developing: 3, notStarted: 6, nextObjective: null },
              { subject: 'Mathematics', strand: 'Geometry and Measures', secure: 1, developing: 2, notStarted: 4, nextObjective: null },
              { subject: 'Mathematics', strand: 'Statistics', secure: 1, developing: 1, notStarted: 2, nextObjective: null },
            ]).map(s => ({
              label: s.strand.split(' ')[0],
              value: s.secure,
              max: s.secure + s.developing + s.notStarted,
              color: s.secure > s.developing ? '#10b981' : '#f59e0b',
            }))}
            height={160}
          />
        </Card>

        {/* Areas Needing Attention */}
        <Card>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Areas Needing Attention</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {student.weakAreas.map((area, index) => {
              const progress = 75 - (index * 15);
              return (
                <div key={index} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">{area}</span>
                    <span className={`text-sm font-semibold ${
                      progress < 50 ? 'text-red-600' : progress < 70 ? 'text-amber-600' : 'text-emerald-600'
                    }`}>
                      {progress}%
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        progress < 50 ? 'bg-red-500' : progress < 70 ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="mt-2 flex gap-2">
                    <button className="text-xs text-blue-600 hover:underline">Assign Practice →</button>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Recent Activity Timeline */}
        <Card>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {[
              { action: 'Completed: Linear Equations', score: '85%', time: '2 hours ago', type: 'practice', points: '+75' },
              { action: 'Mastered: Expanding Brackets', score: 'Secure', time: '1 day ago', type: 'mastery', points: '+100' },
              { action: 'Practice Quiz: Algebra', score: '78%', time: '1 day ago', type: 'quiz', points: '+50' },
              { action: 'Asked Nova about Geometry', score: '3 questions', time: '2 days ago', type: 'chat', points: '+15' },
            ].map((activity, index) => (
              <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  activity.type === 'mastery' ? 'bg-emerald-100 text-emerald-600' :
                  activity.type === 'practice' ? 'bg-blue-100 text-blue-600' :
                  activity.type === 'quiz' ? 'bg-purple-100 text-purple-600' :
                  'bg-gray-100 text-gray-600'
                }`}>
                  {activity.type === 'mastery' && (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                  )}
                  {activity.type === 'practice' && (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                    </svg>
                  )}
                  {activity.type === 'quiz' && (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  )}
                  {activity.type === 'chat' && (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                    </svg>
                  )}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{activity.action}</div>
                  <div className="text-sm text-gray-500">{activity.score}</div>
                </div>
                <div className="text-right">
                  <div className="text-emerald-600 font-medium text-sm">{activity.points} XP</div>
                  <div className="text-xs text-gray-400">{activity.time}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Performance Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="text-center">
            <div className="text-sm font-medium text-gray-500 mb-1">Total XP</div>
            <div className="text-2xl font-bold text-amber-600">{studentPoints.toLocaleString()}</div>
          </Card>
          <Card className="text-center">
            <div className="text-sm font-medium text-gray-500 mb-1">Current Streak</div>
            <div className="text-2xl font-bold text-orange-600">7 days</div>
          </Card>
          <Card className="text-center">
            <div className="text-sm font-medium text-gray-500 mb-1">Avg. Study/Week</div>
            <div className="text-2xl font-bold text-blue-600">3.5 hrs</div>
          </Card>
          <Card className="text-center">
            <div className="text-sm font-medium text-gray-500 mb-1">Nova Chats</div>
            <div className="text-2xl font-bold text-purple-600">18</div>
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
