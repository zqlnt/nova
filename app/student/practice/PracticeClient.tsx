'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Layout from '@/components/Layout';
import Card from '@/components/Card';
import { MathBlock } from '@/components/MathDisplay';
import { practiceService, masteryService, progressService, pointsService, curriculumService } from '@/lib/services';
import { useStudent } from '@/contexts/StudentContext';
import { GeneratedQuestion } from '@/lib/types';

export default function PracticeClient() {
  const searchParams = useSearchParams();
  const objectiveIdParam = searchParams.get('objective');
  const { profile, nextObjective, refreshMastery, refreshProgress } = useStudent();

  const [objectiveId, setObjectiveId] = useState<string | null>(null);
  const [objectiveTitle, setObjectiveTitle] = useState<string>('');
  const [question, setQuestion] = useState<GeneratedQuestion | null>(null);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);
  const [sessionStats, setSessionStats] = useState({ attempted: 0, correct: 0 });
  const [sessionComplete, setSessionComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Resolve which objective to practice
  useEffect(() => {
    if (objectiveIdParam) {
      const obj = curriculumService.getObjectiveById(objectiveIdParam);
      if (obj) {
        setObjectiveId(obj.id);
        setObjectiveTitle(obj.title);
        return;
      }
    }
    // Fallback to next objective from curriculum
    if (nextObjective) {
      setObjectiveId(nextObjective.id);
      setObjectiveTitle(nextObjective.title);
      return;
    }
    // Last resort: pick first objective with templates
    const objectives = curriculumService.getObjectivesByYearAndTier(
      profile?.yearGroup || 10,
      'Mathematics',
      profile?.mathsTier
    );
    for (const obj of objectives) {
      const q = practiceService.generateQuestion(obj.id);
      if (q) {
        setObjectiveId(obj.id);
        setObjectiveTitle(obj.title);
        return;
      }
    }
    setError('No practice questions available. Complete onboarding to get started.');
  }, [objectiveIdParam, nextObjective, profile?.yearGroup, profile?.mathsTier]);

  // Generate first question when objective is set
  useEffect(() => {
    if (!objectiveId || error) return;
    const q = practiceService.generateQuestion(objectiveId);
    if (q) {
      setQuestion(q);
      setAnswer('');
      setFeedback(null);
    } else {
      setError(`No practice questions available for this objective yet.`);
    }
  }, [objectiveId, error]);

  const handleSubmit = () => {
    if (!question || !answer.trim()) return;

    const result = practiceService.checkAnswer(question, answer);
    setFeedback({ isCorrect: result.isCorrect, text: result.feedback });

    // Record attempt
    masteryService.recordAttempt(question.objectiveId, result.isCorrect);
    progressService.recordPractice(question.objectiveId, result.isCorrect, 2);

    // Award points
    const points = result.isCorrect ? pointsService.POINTS.CORRECT_ANSWER : 0;
    if (points > 0) pointsService.awardPoints(points, 'Correct answer');

    setSessionStats((s) => ({
      attempted: s.attempted + 1,
      correct: s.correct + (result.isCorrect ? 1 : 0),
    }));

    refreshMastery();
    refreshProgress();
  };

  const handleNext = () => {
    if (!objectiveId) return;
    const q = practiceService.generateQuestion(objectiveId);
    if (q) {
      setQuestion(q);
      setAnswer('');
      setFeedback(null);
    } else {
      setSessionComplete(true);
    }
  };

  const handleFinish = () => {
    setSessionComplete(true);
  };

  if (error) {
    return (
      <Layout role="student">
        <div className="max-w-xl mx-auto">
          <Card>
            <div className="text-center py-8">
              <div className="w-12 h-12 mx-auto mb-4 text-amber-500">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <p className="text-gray-700 mb-6">{error}</p>
              <Link href="/student/dashboard">
                <button className="px-6 py-2 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700">
                  Back to Dashboard
                </button>
              </Link>
            </div>
          </Card>
        </div>
      </Layout>
    );
  }

  if (sessionComplete) {
    return (
      <Layout role="student">
        <div className="max-w-xl mx-auto">
          <Card>
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 text-emerald-500">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Session complete!</h2>
              <p className="text-gray-600 mb-6">
                You got {sessionStats.correct} out of {sessionStats.attempted} correct.
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => {
                    setSessionComplete(false);
                    setSessionStats({ attempted: 0, correct: 0 });
                    if (objectiveId) {
                      const q = practiceService.generateQuestion(objectiveId);
                      if (q) {
                        setQuestion(q);
                        setAnswer('');
                        setFeedback(null);
                      }
                    }
                  }}
                  className="px-6 py-2 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700"
                >
                  Practice More
                </button>
                <Link href="/student/dashboard">
                  <button className="px-6 py-2 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200">
                    Back to Dashboard
                  </button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </Layout>
    );
  }

  if (!question) {
    return (
      <Layout role="student">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-pulse text-gray-500">Loading question…</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout role="student">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Practice</h1>
            <p className="text-sm text-gray-500">{objectiveTitle}</p>
          </div>
          <div className="text-sm text-gray-500">
            {sessionStats.attempted > 0 && (
              <span>{sessionStats.correct}/{sessionStats.attempted} correct</span>
            )}
          </div>
        </div>

        <Card>
          <div className="space-y-6">
            <div>
              <div className="text-sm text-gray-500 mb-2">Question</div>
              <div className="text-gray-900">
                {question.objectiveId.startsWith('math-') ? (
                  <MathBlock content={question.prompt} />
                ) : (
                  <p className="text-lg">{question.prompt}</p>
                )}
              </div>
            </div>

            {!feedback ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Your answer</label>
                  <input
                    type="text"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && answer.trim() && handleSubmit()}
                    placeholder="Type your answer..."
                    className="w-full px-4 py-3 border border-white/45 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    autoFocus
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleSubmit}
                    disabled={!answer.trim()}
                    className="flex-1 px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Check Answer
                  </button>
                  <Link href="/student/dashboard">
                    <button className="px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200">
                      Exit
                    </button>
                  </Link>
                </div>
              </>
            ) : (
              <>
                <div
                  className={`p-4 rounded-xl ${
                    feedback.isCorrect ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-800'
                  }`}
                >
                  <div className="font-medium mb-1">
                    {feedback.isCorrect ? 'Correct!' : 'Not quite'}
                  </div>
                  <p className="text-sm">{feedback.text}</p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleNext}
                    className="flex-1 px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700"
                  >
                    Next Question →
                  </button>
                  <button
                    onClick={handleFinish}
                    className="px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200"
                  >
                    Finish Session
                  </button>
                </div>
              </>
            )}
          </div>
        </Card>
      </div>
    </Layout>
  );
}
