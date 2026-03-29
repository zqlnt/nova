'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Layout from '@/components/Layout';
import Card from '@/components/Card';
import ObjectiveCard from '@/components/ObjectiveCard';
import {
  RadialProgress,
  StrandProgressBars,
  MasteryDonut,
  LevelBadge,
  WeeklyActivity,
  BarChart,
} from '@/components/ProgressCharts';
import { useStudent } from '@/contexts/StudentContext';
import { masteryService, curriculumService, pointsService } from '@/lib/services';
import { Subject, Strand, StrandMastery, Objective } from '@/lib/types';

export default function LearningMapClient() {
  const searchParams = useSearchParams();
  const initialSubject = (searchParams.get('subject') as Subject) || 'Mathematics';

  const { profile, getMasteryForObjective } = useStudent();
  const [selectedSubject, setSelectedSubject] = useState<Subject>(initialSubject);
  const [strandMasteries, setStrandMasteries] = useState<StrandMastery[]>([]);
  const [expandedStrand, setExpandedStrand] = useState<string | null>(null);
  const [strandObjectives, setStrandObjectives] = useState<Record<string, Objective[]>>({});
  const [weeklyActivity, setWeeklyActivity] = useState<{ day: string; minutes: number }[]>([]);

  useEffect(() => {
    const masteries = masteryService.getStrandMastery(selectedSubject);
    setStrandMasteries(masteries);

    const objectives: Record<string, Objective[]> = {};
    masteries.forEach((m) => {
      objectives[m.strand] = curriculumService.getObjectivesByStrand(m.strand);
    });
    setStrandObjectives(objectives);

    setWeeklyActivity(pointsService.getWeeklyActivity());
  }, [selectedSubject]);

  const subjects: Subject[] = ['Mathematics', 'English'];

  const getStrandIcon = (strand: Strand): JSX.Element => {
    const iconClass = 'w-6 h-6';
    const icons: Record<string, JSX.Element> = {
      Number: (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
        </svg>
      ),
      Algebra: (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
        </svg>
      ),
      'Ratio, Proportion and Rates of Change': (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
        </svg>
      ),
      'Geometry and Measures': (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
        </svg>
      ),
      Statistics: (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      Probability: (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      Reading: (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      Writing: (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
      ),
      'SPaG and Vocabulary': (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
        </svg>
      ),
    };

    return icons[strand] || (
      <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    );
  };

  const totalObjectives = strandMasteries.reduce((sum, s) => sum + s.secure + s.developing + s.notStarted, 0);
  const totalSecure = strandMasteries.reduce((sum, s) => sum + s.secure, 0);
  const totalDeveloping = strandMasteries.reduce((sum, s) => sum + s.developing, 0);
  const overallProgress = totalObjectives > 0 ? ((totalSecure + totalDeveloping * 0.5) / totalObjectives) * 100 : 0;

  return (
    <Layout role="student">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Learning Map</h1>
            <p className="text-gray-600 mt-1">Track your progress across all objectives</p>
          </div>
          <div className="flex gap-2">
            {subjects.map((subject) => (
              <button
                key={subject}
                onClick={() => setSelectedSubject(subject)}
                className={`px-4 py-2 rounded-xl font-medium transition-all ${
                  selectedSubject === subject
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {subject === 'Mathematics' ? 'Maths' : 'English'}
              </button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <Card className="flex flex-col items-center justify-center py-6">
            <RadialProgress
              percentage={overallProgress}
              size={140}
              color={overallProgress > 60 ? '#10b981' : overallProgress > 30 ? '#f59e0b' : '#6b7280'}
              label="Overall"
              sublabel={`${totalSecure} secure`}
            />
          </Card>

          <Card className="flex flex-col items-center justify-center py-6">
            <MasteryDonut
              secure={totalSecure}
              developing={totalDeveloping}
              notStarted={totalObjectives - totalSecure - totalDeveloping}
              size={140}
            />
          </Card>

          <Card className="py-6">
            <div className="flex flex-col items-center">
              <LevelBadge
                level={profile?.level || 1}
                points={profile?.totalPoints || 0}
                pointsToNext={pointsService.getPointsToNextLevel(profile?.totalPoints || 0)}
              />
              <div className="mt-4 w-full">
                <div className="text-xs text-gray-500 mb-2 text-center">This Week</div>
                <WeeklyActivity data={weeklyActivity} goal={30} />
              </div>
            </div>
          </Card>
        </div>

        <Card>
          <h2 className="text-lg font-bold text-gray-900 mb-4">{selectedSubject} Progress by Strand</h2>
          <StrandProgressBars strands={strandMasteries} />
        </Card>

        <Card>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Objectives by Strand</h2>
          <BarChart
            data={strandMasteries.map((s) => ({
              label: s.strand.split(' ')[0],
              value: s.secure,
              max: s.secure + s.developing + s.notStarted,
              color: s.secure > s.developing ? '#10b981' : '#f59e0b',
            }))}
            height={180}
          />
        </Card>

        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-900">All Strands</h2>
          {strandMasteries.map((strandMastery) => {
            const isExpanded = expandedStrand === strandMastery.strand;
            const objectives = strandObjectives[strandMastery.strand] || [];

            return (
              <Card key={strandMastery.strand} className="overflow-hidden">
                <button
                  onClick={() => setExpandedStrand(isExpanded ? null : strandMastery.strand)}
                  className="w-full text-left"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-gray-600">{getStrandIcon(strandMastery.strand)}</span>
                      <div>
                        <h3 className="font-semibold text-gray-900">{strandMastery.strand}</h3>
                        <p className="text-sm text-gray-500">
                          {strandMastery.secure + strandMastery.developing + strandMastery.notStarted} objectives
                        </p>
                      </div>
                    </div>
                    <svg
                      className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>

                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
                    {objectives.map((obj) => {
                      const mastery = getMasteryForObjective(obj.id);
                      const isNext = strandMastery.nextObjective?.id === obj.id;
                      return (
                        <ObjectiveCard
                          key={obj.id}
                          objective={obj}
                          masteryStatus={mastery?.status || 'not_started'}
                          isNext={isNext}
                          onClick={() => (window.location.href = `/student/chat?objective=${obj.id}`)}
                          onStartPractice={() => (window.location.href = `/student/practice?objective=${obj.id}`)}
                        />
                      );
                    })}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}

