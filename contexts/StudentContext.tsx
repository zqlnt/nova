'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  StudentProfile, 
  Objective, 
  ChatScope, 
  DailyProgress,
  Subject,
  YearGroup,
  MathsTier,
  Mastery,
} from '@/lib/types';
import { 
  studentService, 
  masteryService, 
  progressService, 
  curriculumService 
} from '@/lib/services';

interface StudentContextType {
  // Profile
  profile: StudentProfile | null;
  isLoading: boolean;
  updateProfile: (update: Partial<StudentProfile>) => void;
  
  // Mastery
  masteryData: Mastery[];
  refreshMastery: () => void;
  getMasteryForObjective: (objectiveId: string) => Mastery | undefined;
  
  // Objectives
  currentObjective: Objective | null;
  nextObjective: Objective | null;
  setCurrentObjective: (objective: Objective | null) => void;
  
  // Chat Scope
  chatScope: ChatScope;
  setChatScope: (scope: Partial<ChatScope>) => void;
  
  // Progress
  todayProgress: DailyProgress;
  refreshProgress: () => void;
  
  // Onboarding
  needsOnboarding: boolean;
  completeOnboarding: (yearGroup: YearGroup, subjects: Subject[], mathsTier?: MathsTier) => void;
}

const StudentContext = createContext<StudentContextType | undefined>(undefined);

export function StudentProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [masteryData, setMasteryData] = useState<Mastery[]>([]);
  const [currentObjective, setCurrentObjective] = useState<Objective | null>(null);
  const [nextObjective, setNextObjective] = useState<Objective | null>(null);
  const [todayProgress, setTodayProgress] = useState<DailyProgress>({
    date: new Date().toISOString().split('T')[0],
    minutesSpent: 0,
    objectivesPracticed: [],
    questionsAttempted: 0,
    questionsCorrect: 0,
    sessionsCompleted: 0,
  });
  const [chatScope, setChatScopeState] = useState<ChatScope>({
    subject: 'Mathematics',
    yearGroup: 10,
    tier: 'Higher',
    objectiveId: null,
    objectiveTitle: null,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Initialize on mount
  useEffect(() => {
    const loadData = () => {
      try {
        const studentProfile = studentService.getProfile();
        setProfile(studentProfile);
        
        const mastery = masteryService.getMasteryData();
        setMasteryData(mastery);
        
        const progress = progressService.getTodayProgress();
        setTodayProgress(progress);

        if (studentProfile) {
          setChatScopeState(prev => ({
            ...prev,
            yearGroup: studentProfile.yearGroup,
            tier: studentProfile.mathsTier,
            subject: studentProfile.subjects?.[0] || 'Mathematics',
          }));

          const next = masteryService.getNextRecommendedObjective(
            studentProfile.subjects?.[0] || 'Mathematics',
            studentProfile.yearGroup,
            studentProfile.mathsTier
          );
          setNextObjective(next);
        }
      } catch (e) {
        console.warn('StudentContext init:', e);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const updateProfile = (update: Partial<StudentProfile>) => {
    const updated = studentService.updateProfile(update);
    setProfile(updated);
  };

  const refreshMastery = () => {
    const mastery = masteryService.getMasteryData();
    setMasteryData(mastery);
  };

  const getMasteryForObjective = (objectiveId: string) => {
    return masteryData.find(m => m.objectiveId === objectiveId);
  };

  const setChatScope = (scopeUpdate: Partial<ChatScope>) => {
    setChatScopeState(prev => {
      const updated = { ...prev, ...scopeUpdate };
      
      // If objective changes, update the title
      if (scopeUpdate.objectiveId !== undefined) {
        if (scopeUpdate.objectiveId) {
          const obj = curriculumService.getObjectiveById(scopeUpdate.objectiveId);
          updated.objectiveTitle = obj?.title || null;
        } else {
          updated.objectiveTitle = null;
        }
      }
      
      return updated;
    });
  };

  const refreshProgress = () => {
    const progress = progressService.getTodayProgress();
    setTodayProgress(progress);
  };

  const needsOnboarding = profile ? !profile.onboardingCompleted : true;

  const completeOnboarding = (yearGroup: YearGroup, subjects: Subject[], mathsTier?: MathsTier) => {
    const updated = studentService.completeOnboarding(yearGroup, subjects, mathsTier);
    setProfile(updated);
    setChatScopeState(prev => ({
      ...prev,
      yearGroup,
      tier: mathsTier,
      subject: subjects[0],
    }));
  };

  return (
    <StudentContext.Provider value={{
      profile,
      isLoading,
      updateProfile,
      masteryData,
      refreshMastery,
      getMasteryForObjective,
      currentObjective,
      nextObjective,
      setCurrentObjective,
      chatScope,
      setChatScope,
      todayProgress,
      refreshProgress,
      needsOnboarding,
      completeOnboarding,
    }}>
      {children}
    </StudentContext.Provider>
  );
}

export function useStudent() {
  const context = useContext(StudentContext);
  if (context === undefined) {
    throw new Error('useStudent must be used within a StudentProvider');
  }
  return context;
}



