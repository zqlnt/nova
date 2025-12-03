'use client';

import { useState } from 'react';
import Image from 'next/image';
import Layout from '@/components/Layout';
import Card from '@/components/Card';
import Badge from '@/components/Badge';
import Button from '@/components/Button';
import { mockClassStudents, mockStudent } from '@/lib/mockData';

export default function StudentDetail({ params }: { params: { studentId: string } }) {
  const student = mockClassStudents.find(s => s.id === params.studentId) || mockClassStudents[0];
  const [novaQuery, setNovaQuery] = useState('');

  const handleAskNova = () => {
    alert(`Nova will analyze: "${novaQuery}"\n\n(This is a placeholder - AI analysis will be implemented later)`);
  };

  return (
    <Layout role="teacher">
      <div className="space-y-8 max-w-4xl">
        {/* Student Profile Header */}
        <Card decorative className="border border-gray-200 bg-white mb-8 relative overflow-hidden">
          {/* Decorative achievement stars */}
          <div className="absolute -right-12 top-8 opacity-5">
            <svg width="100" height="100" viewBox="0 0 100 100">
              <path d="M50 10L60 40L90 40L65 60L75 90L50 70L25 90L35 60L10 40L40 40L50 10Z" fill="currentColor" className="text-gray-900"/>
            </svg>
          </div>
          <div className="absolute -left-8 bottom-12 opacity-5">
            <svg width="80" height="80" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" stroke="currentColor" className="text-gray-900" strokeWidth="3" fill="none"/>
              <path d="M30 50L45 65L70 35" stroke="currentColor" className="text-gray-900" strokeWidth="4" fill="none"/>
            </svg>
          </div>
          <div className="flex items-start gap-6 relative">
            <div className="w-24 h-24 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center shadow-md p-4">
              <Image 
                src="https://i.imghippo.com/files/tyq3865Jxs.png" 
                alt="Nova" 
                width={80} 
                height={80}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold mb-2 text-gray-900">{student.name}</h1>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700">
                  Year 10 Mathematics
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700">
                  Active Learner
                </span>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Overall Progress</div>
                  <div className="text-2xl font-bold text-gray-900">{student.overallProgress}%</div>
                </div>
                <div>
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Lessons Completed</div>
                  <div className="text-2xl font-bold text-gray-900">{student.lessonsCompleted}</div>
                </div>
                <div>
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Last Active</div>
                  <div className="text-base font-medium text-gray-700">{student.lastActive}</div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Progress Details */}
        <Card className="border border-gray-200 mb-8">
          <h2 className="text-xl font-semibold mb-6 text-gray-900">Learning Progress</h2>
          
          <div className="space-y-6">
            {/* Overall Progress Bar */}
            <div>
              <div className="flex justify-between mb-2">
                <span className="font-medium">Overall Understanding</span>
                <span className="font-semibold">{student.overallProgress}%</span>
              </div>
              <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${student.overallProgress}%`, backgroundColor: '#007AFF' }}
                />
              </div>
            </div>

            {/* Weak Areas */}
            <div>
              <h3 className="font-semibold mb-3">Areas Needing Improvement</h3>
              <div className="space-y-3">
                {student.weakAreas.map((area, index) => {
                  const progress = 75 - (index * 10); // Mock progress values
                  return (
                    <div key={index} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                      <div className="flex justify-between mb-2">
                        <span className="font-medium text-gray-900">{area}</span>
                        <span className="text-sm font-semibold text-gray-600">{progress}%</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full"
                          style={{ width: `${progress}%`, backgroundColor: '#007AFF' }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recent Activity */}
            <div>
              <h3 className="font-semibold mb-3 text-gray-900">Recent Activity</h3>
              <div className="space-y-2">
                <div className="bg-gray-50 rounded-xl p-4 flex items-center justify-between border border-gray-200">
                  <div>
                    <div className="font-medium text-gray-900">Completed: Quadratic Functions</div>
                    <div className="text-sm text-gray-500">Score: 85%</div>
                  </div>
                  <div className="text-sm text-gray-400">2 hours ago</div>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 flex items-center justify-between border border-gray-200">
                  <div>
                    <div className="font-medium text-gray-900">Practice Quiz: Algebra</div>
                    <div className="text-sm text-gray-500">Score: 78%</div>
                  </div>
                  <div className="text-sm text-gray-400">1 day ago</div>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 flex items-center justify-between border border-gray-200">
                  <div>
                    <div className="font-medium text-gray-900">Asked Nova about Geometry</div>
                    <div className="text-sm text-gray-500">3 questions</div>
                  </div>
                  <div className="text-sm text-gray-400">2 days ago</div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Ask Nova About This Student */}
        <Card className="border border-gray-200 bg-white mb-8">
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2 text-gray-900">Ask Nova About This Student</h2>
            <p className="text-gray-600 text-sm">
              Get AI-powered insights about {student.name.split(' ')[0]}'s learning patterns, strengths, and personalized recommendations
            </p>
          </div>

          <div className="space-y-4">
            <textarea
              value={novaQuery}
              onChange={(e) => setNovaQuery(e.target.value)}
              placeholder="e.g., 'What teaching approach would work best for this student?' or 'Suggest practice materials for their weak areas'"
              rows={4}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-ios-blue transition-all resize-none"
            />
            
            <div className="flex gap-3">
              <Button onClick={handleAskNova} disabled={!novaQuery.trim()}>
                Ask Nova
              </Button>
              <Button variant="secondary" onClick={() => setNovaQuery('')}>
                Clear
              </Button>
            </div>

            {/* Quick Question Suggestions */}
            <div>
              <p className="text-sm text-gray-600 mb-2">Quick questions:</p>
              <div className="flex flex-wrap gap-2">
                {[
                  'What are their learning strengths?',
                  'Recommend practice materials',
                  'Suggest intervention strategies',
                  'Compare to class average'
                ].map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => setNovaQuery(suggestion)}
                    className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm hover:bg-gray-100 hover:border-ios-blue transition-all"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-4">
          <Card className="text-center border border-gray-200">
            <div className="text-sm font-medium text-gray-600 mb-2">Learning Streak</div>
            <div className="text-3xl font-bold text-gray-900">7 days</div>
          </Card>
          <Card className="text-center border border-gray-200">
            <div className="text-sm font-medium text-gray-600 mb-2">Avg. Study Time/Week</div>
            <div className="text-3xl font-bold text-gray-900">3.5 hrs</div>
          </Card>
          <Card className="text-center border border-gray-200">
            <div className="text-sm font-medium text-gray-600 mb-2">Nova Interactions</div>
            <div className="text-3xl font-bold text-gray-900">18</div>
          </Card>
        </div>
      </div>
    </Layout>
  );
}

