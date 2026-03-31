'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { useStudent } from '@/contexts/StudentContext';
import { Subject, YearGroup, MathsTier, MasteryStatus } from '@/lib/types';
import { practiceService, masteryService, curriculumService } from '@/lib/services';

type OnboardingStep = 'welcome' | 'year' | 'subjects' | 'tier' | 'baseline' | 'complete';

interface BaselineQuestion {
  objectiveId: string;
  objectiveTitle: string;
  question: string;
  answer: string;
  isCorrect?: boolean;
}

export default function Onboarding() {
  const router = useRouter();
  const { completeOnboarding, updateProfile } = useStudent();
  
  const [step, setStep] = useState<OnboardingStep>('welcome');
  const [yearGroup, setYearGroup] = useState<YearGroup>(10);
  const [selectedSubjects, setSelectedSubjects] = useState<Subject[]>(['Mathematics', 'English']);
  const [mathsTier, setMathsTier] = useState<MathsTier>('Higher');
  const [baselineQuestions, setBaselineQuestions] = useState<BaselineQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [showingFeedback, setShowingFeedback] = useState(false);

  const years: YearGroup[] = [7, 8, 9, 10, 11];
  const subjects: { id: Subject; name: string }[] = [
    { id: 'Mathematics', name: 'Mathematics' },
    { id: 'English', name: 'English' },
  ];
  const tiers: { id: MathsTier; name: string; desc: string }[] = [
    { id: 'Foundation', name: 'Foundation', desc: 'Grades 1-5' },
    { id: 'Higher', name: 'Higher', desc: 'Grades 4-9' },
    { id: 'Unsure', name: 'Not sure yet', desc: 'We\'ll help you decide' },
  ];

  const toggleSubject = (subject: Subject) => {
    setSelectedSubjects(prev => 
      prev.includes(subject) 
        ? prev.filter(s => s !== subject)
        : [...prev, subject]
    );
  };

  const generateBaselineQuestions = (): BaselineQuestion[] => {
    const questions: BaselineQuestion[] = [];
    
    // Get 3 questions per selected subject
    selectedSubjects.forEach(subject => {
      const objectives = curriculumService.getObjectivesByYearAndTier(
        yearGroup, 
        subject, 
        subject === 'Mathematics' ? mathsTier : undefined
      ).slice(0, 3);
      
      objectives.forEach(obj => {
        const generated = practiceService.generateQuestion(obj.id);
        if (generated) {
          questions.push({
            objectiveId: obj.id,
            objectiveTitle: obj.title,
            question: generated.prompt,
            answer: '',
          });
        }
      });
    });

    return questions.slice(0, 6); // Max 6 questions
  };

  const startBaseline = () => {
    const questions = generateBaselineQuestions();
    setBaselineQuestions(questions);
    setCurrentQuestionIndex(0);
    setStep('baseline');
  };

  const submitBaselineAnswer = () => {
    const currentQ = baselineQuestions[currentQuestionIndex];
    // For baseline, we're doing a simple assessment - mark as correct if they provided an answer
    // In a real app, you'd validate this properly
    const isCorrect = answer.trim().length > 0;
    
    const updated = [...baselineQuestions];
    updated[currentQuestionIndex] = { ...currentQ, answer, isCorrect };
    setBaselineQuestions(updated);
    setShowingFeedback(true);
  };

  const nextBaselineQuestion = () => {
    setAnswer('');
    setShowingFeedback(false);
    
    if (currentQuestionIndex < baselineQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Complete baseline
      completeBaselineAndFinish();
    }
  };

  const completeBaselineAndFinish = () => {
    // Set mastery based on baseline results
    baselineQuestions.forEach(q => {
      const status: MasteryStatus = q.isCorrect ? 'developing' : 'not_started';
      masteryService.updateMastery(q.objectiveId, { status });
    });

    // Complete onboarding
    completeOnboarding(yearGroup, selectedSubjects, 
      selectedSubjects.includes('Mathematics') ? mathsTier : undefined
    );
    
    setStep('complete');
  };

  const skipBaseline = () => {
    completeOnboarding(yearGroup, selectedSubjects,
      selectedSubjects.includes('Mathematics') ? mathsTier : undefined
    );
    router.push('/student/dashboard');
  };

  const currentQuestion = baselineQuestions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Progress */}
        {step !== 'welcome' && step !== 'complete' && (
          <div className="mb-6">
            <div className="flex gap-2">
              {['year', 'subjects', 'tier', 'baseline'].map((s, i) => (
                <div 
                  key={s}
                  className={`h-1 flex-1 rounded-full ${
                    ['year', 'subjects', 'tier', 'baseline'].indexOf(step) >= i 
                      ? 'bg-blue-500' 
                      : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Welcome */}
        {step === 'welcome' && (
          <Card className="text-center">
            <div className="w-16 h-16 mx-auto mb-6 text-blue-500">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Nova!</h1>
            <p className="text-gray-600 mb-8">
              Your AI-powered GCSE learning companion for Maths and English.
              Let's set up your personalised learning experience.
            </p>
            <Button onClick={() => setStep('year')} className="w-full">
              Get Started →
            </Button>
          </Card>
        )}

        {/* Year Group */}
        {step === 'year' && (
          <Card>
            <h2 className="text-xl font-bold text-gray-900 mb-2">What year are you in?</h2>
            <p className="text-gray-600 mb-6">This helps us show you the right content.</p>
            
            <div className="grid grid-cols-5 gap-3 mb-6">
              {years.map(year => (
                <button
                  key={year}
                  onClick={() => setYearGroup(year)}
                  className={`py-4 rounded-xl font-bold text-lg transition-all ${
                    yearGroup === year
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {year}
                </button>
              ))}
            </div>

            <Button onClick={() => setStep('subjects')} className="w-full">
              Continue →
            </Button>
          </Card>
        )}

        {/* Subjects */}
        {step === 'subjects' && (
          <Card>
            <h2 className="text-xl font-bold text-gray-900 mb-2">What subjects do you want to study?</h2>
            <p className="text-gray-600 mb-6">Select one or both.</p>
            
            <div className="space-y-3 mb-6">
              {subjects.map(subject => (
                <button
                  key={subject.id}
                  onClick={() => toggleSubject(subject.id)}
                  className={`w-full p-4 rounded-xl text-left flex items-center gap-4 transition-all ${
                    selectedSubjects.includes(subject.id)
                      ? 'bg-blue-50 border-2 border-blue-500'
                      : 'bg-gray-50 border-2 border-transparent hover:border-gray-200'
                  }`}
                >
                  <div className="w-8 h-8 text-gray-600">
                    {subject.id === 'Mathematics' ? (
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    ) : (
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    )}
                  </div>
                  <span className="font-medium text-gray-900">{subject.name}</span>
                  {selectedSubjects.includes(subject.id) && (
                    <svg className="ml-auto w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <Button variant="secondary" onClick={() => setStep('year')}>
                ← Back
              </Button>
              <Button 
                onClick={() => setStep(selectedSubjects.includes('Mathematics') ? 'tier' : 'baseline')} 
                className="flex-1"
                disabled={selectedSubjects.length === 0}
              >
                Continue →
              </Button>
            </div>
          </Card>
        )}

        {/* Maths Tier */}
        {step === 'tier' && (
          <Card>
            <h2 className="text-xl font-bold text-gray-900 mb-2">What tier are you studying?</h2>
            <p className="text-gray-600 mb-6">For GCSE Maths, there are two tiers.</p>
            
            <div className="space-y-3 mb-6">
              {tiers.map(tier => (
                <button
                  key={tier.id}
                  onClick={() => setMathsTier(tier.id)}
                  className={`w-full p-4 rounded-xl text-left transition-all ${
                    mathsTier === tier.id
                      ? 'bg-blue-50 border-2 border-blue-500'
                      : 'bg-gray-50 border-2 border-transparent hover:border-gray-200'
                  }`}
                >
                  <div className="font-medium text-gray-900">{tier.name}</div>
                  <div className="text-sm text-gray-500">{tier.desc}</div>
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <Button variant="secondary" onClick={() => setStep('subjects')}>
                ← Back
              </Button>
              <Button onClick={startBaseline} className="flex-1">
                Continue →
              </Button>
            </div>
          </Card>
        )}

        {/* Baseline Quiz */}
        {step === 'baseline' && currentQuestion && (
          <Card>
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-sm text-gray-500">Quick Assessment</div>
                <div className="font-medium text-gray-900">{currentQuestion.objectiveTitle}</div>
              </div>
              <div className="text-sm text-gray-500">
                {currentQuestionIndex + 1} / {baselineQuestions.length}
              </div>
            </div>

            <div className="mb-6">
              <div className="text-gray-900 mb-4">{currentQuestion.question}</div>
              
              {!showingFeedback ? (
                <>
                  <input
                    type="text"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && answer.trim() && submitBaselineAnswer()}
                    placeholder="Type your answer..."
                    className="w-full px-4 py-3 border border-white/45 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    autoFocus
                  />
                  <div className="flex gap-3 mt-4">
                    <Button 
                      variant="secondary" 
                      onClick={() => {
                        setAnswer('skipped');
                        submitBaselineAnswer();
                      }}
                    >
                      Skip
                    </Button>
                    <Button 
                      onClick={submitBaselineAnswer} 
                      disabled={!answer.trim()}
                      className="flex-1"
                    >
                      Submit
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="p-3 bg-blue-50 rounded-lg text-blue-800 text-sm mb-4">
                    Thanks! We've recorded your answer. This helps us personalise your learning.
                  </div>
                  <Button onClick={nextBaselineQuestion} className="w-full">
                    {currentQuestionIndex < baselineQuestions.length - 1 ? 'Next Question →' : 'Finish Setup'}
                  </Button>
                </>
              )}
            </div>

            <button 
              onClick={skipBaseline}
              className="w-full text-center text-sm text-gray-500 hover:text-gray-700"
            >
              Skip assessment and start learning
            </button>
          </Card>
        )}

        {/* Complete */}
        {step === 'complete' && (
          <Card className="text-center">
            <div className="w-16 h-16 mx-auto mb-6 text-emerald-500">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">You're all set!</h1>
            <p className="text-gray-600 mb-8">
              Nova is ready to help you master GCSE {selectedSubjects.join(' and ')}.
              Let's start learning!
            </p>
            <Button onClick={() => router.push('/student/dashboard')} className="w-full">
              Go to Dashboard →
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}

