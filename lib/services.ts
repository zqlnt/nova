// Service Layer for Nova - Mocked APIs

import { 
  Objective, 
  Mastery, 
  MasteryStatus,
  Subject, 
  Strand,
  YearGroup,
  MathsTier,
  StrandMastery,
  SubjectMastery,
  GeneratedQuestion,
  QuestionAttempt,
  LearningSession,
  DailyProgress,
  StudentProfile,
  ChatScope,
  ChatMessage,
  LearningEvent,
} from './types';
import { 
  mathsObjectives, 
  englishObjectives, 
  allObjectives,
  questionTemplates,
  createInitialMastery,
  defaultStudentProfile,
} from './seedData';

// ============================================
// LOCAL STORAGE KEYS
// ============================================

const STORAGE_KEYS = {
  STUDENT_PROFILE: 'nova_student_profile',
  MASTERY_DATA: 'nova_mastery_data',
  DAILY_PROGRESS: 'nova_daily_progress',
  LEARNING_EVENTS: 'nova_learning_events',
  CHAT_HISTORY: 'nova_chat_history',
};

function readJsonFromStorage<T>(
  key: string,
  fallback: () => T,
  validate?: (value: unknown) => value is T
): T {
  if (typeof window === 'undefined') return fallback();
  const stored = localStorage.getItem(key);
  if (stored == null || stored === '') return fallback();
  try {
    const parsed: unknown = JSON.parse(stored);
    if (validate && !validate(parsed)) throw new Error('invalid shape');
    return parsed as T;
  } catch {
    try {
      localStorage.removeItem(key);
    } catch {
      /* ignore */
    }
    if (process.env.NODE_ENV === 'development') {
      console.warn(`[nova] Cleared invalid localStorage key: ${key}`);
    }
    return fallback();
  }
}

// ============================================
// CURRICULUM SERVICE
// ============================================

export const curriculumService = {
  getAllObjectives: (): Objective[] => {
    return allObjectives;
  },

  getObjectivesBySubject: (subject: Subject): Objective[] => {
    if (subject === 'English') {
      return allObjectives.filter(o => o.subject === 'English Language' || o.subject === 'English Literature');
    }
    return allObjectives.filter(obj => obj.subject === subject);
  },

  getObjectivesByStrand: (strand: Strand): Objective[] => {
    return allObjectives.filter(obj => obj.strand === strand);
  },

  getObjectivesByYearAndTier: (
    yearGroup: YearGroup, 
    subject: Subject,
    tier?: MathsTier
  ): Objective[] => {
    const bySubject = curriculumService.getObjectivesBySubject(subject);
    return bySubject.filter(obj => {
      const yearMatch = obj.yearMin <= yearGroup && obj.yearMax >= yearGroup;
      const tierMatch = !obj.tier || tier === 'Unsure' || obj.tier === tier;
      return yearMatch && tierMatch;
    });
  },

  getObjectiveById: (id: string): Objective | undefined => {
    return allObjectives.find(obj => obj.id === id);
  },

  getStrandsForSubject: (subject: Subject): Strand[] => {
    if (subject === 'Mathematics') {
      return ['Number', 'Algebra', 'Ratio, Proportion and Rates of Change', 'Geometry and Measures', 'Statistics', 'Probability'];
    }
    if (subject === 'English' || subject === 'English Language') {
      return ['Reading', 'Writing', 'SPaG and Vocabulary'];
    }
    if (subject === 'English Literature') {
      return ['Shakespeare', '19th-century novel', 'Modern prose/drama', 'Poetry anthology', 'Unseen poetry', 'Essay skills'];
    }
    return ['Reading', 'Writing', 'SPaG and Vocabulary'];
  },

  getPrerequisites: (objectiveId: string): Objective[] => {
    const objective = allObjectives.find(obj => obj.id === objectiveId);
    if (!objective) return [];
    return objective.prerequisites
      .map(id => allObjectives.find(obj => obj.id === id))
      .filter((obj): obj is Objective => obj !== undefined);
  },

  /** Curriculum: get objectives by exam board */
  getObjectivesByExamBoard: (examBoard: 'AQA' | 'Pearson Edexcel'): Objective[] => {
    return allObjectives.filter(o => !o.examBoards || o.examBoards.includes(examBoard));
  },
};

// ============================================
// MASTERY SERVICE
// ============================================

export const masteryService = {
  getMasteryData: (): Mastery[] => {
    if (typeof window === 'undefined') return createInitialMastery(allObjectives);
    return readJsonFromStorage<Mastery[]>(
      STORAGE_KEYS.MASTERY_DATA,
      () => {
        const initial = createInitialMastery(allObjectives);
        localStorage.setItem(STORAGE_KEYS.MASTERY_DATA, JSON.stringify(initial));
        return initial;
      },
      (v): v is Mastery[] => Array.isArray(v)
    );
  },

  saveMasteryData: (data: Mastery[]): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.MASTERY_DATA, JSON.stringify(data));
  },

  getMasteryForObjective: (objectiveId: string): Mastery | undefined => {
    const data = masteryService.getMasteryData();
    return data.find(m => m.objectiveId === objectiveId);
  },

  updateMastery: (objectiveId: string, update: Partial<Mastery>): Mastery => {
    const data = masteryService.getMasteryData();
    const index = data.findIndex(m => m.objectiveId === objectiveId);
    if (index === -1) {
      throw new Error(`Mastery not found for objective: ${objectiveId}`);
    }
    data[index] = { ...data[index], ...update };
    masteryService.saveMasteryData(data);
    return data[index];
  },

  recordAttempt: (objectiveId: string, isCorrect: boolean): Mastery => {
    const mastery = masteryService.getMasteryForObjective(objectiveId);
    if (!mastery) throw new Error(`Mastery not found: ${objectiveId}`);

    const newAttempts = mastery.attempts + 1;
    const newCorrectAttempts = mastery.correctAttempts + (isCorrect ? 1 : 0);
    const newStreakCorrect = isCorrect ? mastery.streakCorrect + 1 : 0;

    // Determine new status
    let newStatus: MasteryStatus = mastery.status;
    if (mastery.status === 'not_started' && newAttempts >= 1) {
      newStatus = 'developing';
    }
    if (mastery.status === 'developing' && newStreakCorrect >= 5 && mastery.provePassedAt) {
      newStatus = 'secure';
    }

    return masteryService.updateMastery(objectiveId, {
      attempts: newAttempts,
      correctAttempts: newCorrectAttempts,
      streakCorrect: newStreakCorrect,
      lastPracticedAt: new Date(),
      status: newStatus,
    });
  },

  recordProvePassed: (objectiveId: string): Mastery => {
    const mastery = masteryService.getMasteryForObjective(objectiveId);
    if (!mastery) throw new Error(`Mastery not found: ${objectiveId}`);

    let newStatus: MasteryStatus = mastery.status;
    if (mastery.streakCorrect >= 5) {
      newStatus = 'secure';
    }

    return masteryService.updateMastery(objectiveId, {
      provePassedAt: new Date(),
      status: newStatus,
    });
  },

  getStrandMastery: (subject: Subject): StrandMastery[] => {
    const strands = curriculumService.getStrandsForSubject(subject);
    const masteryData = masteryService.getMasteryData();
    const subjectMatch = (o: Objective) =>
      subject === 'English'
        ? (o.subject === 'English Language' || o.subject === 'English Literature')
        : o.subject === subject;

    return strands.map(strand => {
      const objectives = allObjectives.filter(
        obj => subjectMatch(obj) && obj.strand === strand
      );
      
      const masteries = objectives.map(obj => 
        masteryData.find(m => m.objectiveId === obj.id)
      );

      const secure = masteries.filter(m => m?.status === 'secure').length;
      const developing = masteries.filter(m => m?.status === 'developing').length;
      const notStarted = masteries.filter(m => m?.status === 'not_started').length;

      // Find next objective (first not_started or developing with lowest difficulty)
      const notSecure = objectives.filter(obj => {
        const mastery = masteryData.find(m => m.objectiveId === obj.id);
        return mastery?.status !== 'secure';
      }).sort((a, b) => a.difficulty - b.difficulty);

      return {
        strand,
        subject,
        secure,
        developing,
        notStarted,
        nextObjective: notSecure[0] || null,
      };
    });
  },

  getSubjectMastery: (subject: Subject): SubjectMastery => {
    const strands = masteryService.getStrandMastery(subject);
    return {
      subject,
      strands,
      totalObjectives: strands.reduce((sum, s) => sum + s.secure + s.developing + s.notStarted, 0),
      secureCount: strands.reduce((sum, s) => sum + s.secure, 0),
      developingCount: strands.reduce((sum, s) => sum + s.developing, 0),
      notStartedCount: strands.reduce((sum, s) => sum + s.notStarted, 0),
    };
  },

  getLowestMasteryObjectives: (subject: Subject, count: number = 3): Objective[] => {
    const masteryData = masteryService.getMasteryData();
    const objectives = curriculumService.getObjectivesBySubject(subject);

    // Sort by status (not_started < developing < secure) then by attempts (fewer = lower)
    const sorted = objectives.sort((a, b) => {
      const mA = masteryData.find(m => m.objectiveId === a.id);
      const mB = masteryData.find(m => m.objectiveId === b.id);
      
      const statusOrder = { not_started: 0, developing: 1, secure: 2 };
      const statusDiff = statusOrder[mA?.status || 'not_started'] - statusOrder[mB?.status || 'not_started'];
      
      if (statusDiff !== 0) return statusDiff;
      return (mA?.correctAttempts || 0) / Math.max(mA?.attempts || 1, 1) - 
             (mB?.correctAttempts || 0) / Math.max(mB?.attempts || 1, 1);
    });

    return sorted.slice(0, count);
  },

  getNextRecommendedObjective: (
    subject: Subject, 
    yearGroup: YearGroup,
    tier?: MathsTier
  ): Objective | null => {
    const masteryData = masteryService.getMasteryData();
    const eligible = curriculumService.getObjectivesByYearAndTier(yearGroup, subject, tier);

    // Find developing objectives first, then not_started
    const developing = eligible.filter(obj => {
      const mastery = masteryData.find(m => m.objectiveId === obj.id);
      return mastery?.status === 'developing';
    });

    if (developing.length > 0) {
      return developing.sort((a, b) => a.difficulty - b.difficulty)[0];
    }

    const notStarted = eligible.filter(obj => {
      const mastery = masteryData.find(m => m.objectiveId === obj.id);
      return mastery?.status === 'not_started';
    });

    // Check prerequisites are met
    const ready = notStarted.filter(obj => {
      const prereqs = curriculumService.getPrerequisites(obj.id);
      return prereqs.every(prereq => {
        const mastery = masteryData.find(m => m.objectiveId === prereq.id);
        return mastery?.status !== 'not_started';
      });
    });

    return ready.sort((a, b) => a.difficulty - b.difficulty)[0] || notStarted[0] || null;
  },
};

// ============================================
// PRACTICE SERVICE
// ============================================

export const practiceService = {
  generateQuestion: (objectiveId: string, difficulty?: number): GeneratedQuestion | null => {
    const templates = questionTemplates.filter(t => t.objectiveId === objectiveId);
    if (templates.length === 0) return null;

    // Pick a template (prefer matching difficulty if specified)
    let template = templates[0];
    if (difficulty) {
      const matching = templates.filter(t => t.difficulty === difficulty);
      template = matching.length > 0 ? matching[Math.floor(Math.random() * matching.length)] : templates[Math.floor(Math.random() * templates.length)];
    } else {
      template = templates[Math.floor(Math.random() * templates.length)];
    }

    // Generate random params
    const params: Record<string, number | string> = {};
    for (const [key, schema] of Object.entries(template.paramsSchema)) {
      if (schema.type === 'integer' && schema.min !== undefined && schema.max !== undefined) {
        params[key] = Math.floor(Math.random() * (schema.max - schema.min + 1)) + schema.min;
      } else if (schema.type === 'string' && schema.options) {
        params[key] = schema.options[Math.floor(Math.random() * schema.options.length)];
      }
    }

    // Generate prompt with params
    let prompt = template.promptTemplate;
    for (const [key, value] of Object.entries(params)) {
      prompt = prompt.replace(new RegExp(`{{${key}}}`, 'g'), String(value));
    }

    // Generate hints with params
    const hints = template.hints.map(hint => {
      let h = hint;
      for (const [key, value] of Object.entries(params)) {
        h = h.replace(new RegExp(`{{${key}}}`, 'g'), String(value));
      }
      return h;
    });

    // Calculate answer (simplified - real implementation would be more robust)
    let correctAnswer: string | number = '';
    if (template.type === 'numeric') {
      try {
        // Simple eval for basic math (in production, use a proper math parser)
        const evalStr = template.solutionGenerator
          .replace(/a/g, String(params.a || 0))
          .replace(/b/g, String(params.b || 0))
          .replace(/c/g, String(params.c || 0))
          .replace(/d/g, String(params.d || 0))
          .replace(/sqrt\(([^)]+)\)/g, 'Math.sqrt($1)');
        correctAnswer = Math.round(eval(evalStr) * 100) / 100;
      } catch {
        correctAnswer = 0;
      }
    } else if (template.type === 'algebraic') {
      // For algebraic, we'd need proper symbolic math
      // For now, return a placeholder
      correctAnswer = template.solutionGenerator;
    }

    return {
      id: `q-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      templateId: template.id,
      objectiveId,
      type: template.type,
      prompt,
      params,
      correctAnswer,
      hints,
      difficulty: template.difficulty,
    };
  },

  checkAnswer: (question: GeneratedQuestion, userAnswer: string): { isCorrect: boolean; feedback: string } => {
    const normalizedAnswer = userAnswer.trim().toLowerCase();
    
    if (question.type === 'numeric') {
      const numAnswer = parseFloat(normalizedAnswer);
      const correct = typeof question.correctAnswer === 'number' 
        ? question.correctAnswer 
        : parseFloat(String(question.correctAnswer));
      
      const isCorrect = Math.abs(numAnswer - correct) < 0.01;
      
      return {
        isCorrect,
        feedback: isCorrect 
          ? 'Correct! Well done.' 
          : `Not quite. The correct answer is ${correct}. Let's try another one to reinforce this concept.`,
      };
    }

    if (question.type === 'algebraic') {
      // Simplified algebraic checking - would need proper CAS in production
      // For now, do basic string comparison with normalization
      const normalizedCorrect = String(question.correctAnswer).toLowerCase().replace(/\s/g, '');
      const normalizedUser = normalizedAnswer.replace(/\s/g, '');
      
      const isCorrect = normalizedUser === normalizedCorrect || 
        normalizedUser.includes(normalizedCorrect.split('=')[0]);
      
      return {
        isCorrect,
        feedback: isCorrect 
          ? 'Correct! Your algebraic expression is right.' 
          : `Not quite. Check your working and try again.`,
      };
    }

    // For short answer / extended answer (English), return pending for teacher review
    return {
      isCorrect: false, // Will be reviewed
      feedback: 'Your answer has been recorded. Check the marking criteria to self-assess.',
    };
  },

  getQuestionsForSession: (objectiveId: string, count: number = 5): GeneratedQuestion[] => {
    const questions: GeneratedQuestion[] = [];
    for (let i = 0; i < count; i++) {
      const q = practiceService.generateQuestion(objectiveId);
      if (q) questions.push(q);
    }
    return questions;
  },
};

// ============================================
// STUDENT SERVICE
// ============================================

export const studentService = {
  getProfile: (): StudentProfile => {
    if (typeof window === 'undefined') return defaultStudentProfile;
    const raw = readJsonFromStorage<Record<string, unknown> | null>(
      STORAGE_KEYS.STUDENT_PROFILE,
      () => null,
      (v): v is Record<string, unknown> => v !== null && typeof v === 'object' && !Array.isArray(v)
    );
    if (!raw) return defaultStudentProfile;
    try {
      const profile = raw as unknown as StudentProfile & {
        createdAt: string | Date;
        baselineCompletedAt?: string | Date | null;
      };
      return {
        ...profile,
        createdAt: new Date(profile.createdAt as string | number | Date),
        baselineCompletedAt: profile.baselineCompletedAt
          ? new Date(profile.baselineCompletedAt as string | number | Date)
          : null,
      };
    } catch {
      localStorage.removeItem(STORAGE_KEYS.STUDENT_PROFILE);
      return defaultStudentProfile;
    }
  },

  saveProfile: (profile: StudentProfile): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.STUDENT_PROFILE, JSON.stringify(profile));
  },

  updateProfile: (update: Partial<StudentProfile>): StudentProfile => {
    const current = studentService.getProfile();
    const updated = { ...current, ...update };
    studentService.saveProfile(updated);
    return updated;
  },

  completeOnboarding: (
    yearGroup: YearGroup,
    subjects: Subject[],
    mathsTier?: MathsTier
  ): StudentProfile => {
    return studentService.updateProfile({
      yearGroup,
      subjects,
      mathsTier,
      onboardingCompleted: true,
    });
  },

  completeBaseline: (results: { objectiveId: string; status: MasteryStatus }[]): void => {
    // Update mastery based on baseline results
    for (const result of results) {
      masteryService.updateMastery(result.objectiveId, { status: result.status });
    }
    studentService.updateProfile({ baselineCompletedAt: new Date() });
  },
};

// ============================================
// PROGRESS SERVICE
// ============================================

export const progressService = {
  getTodayProgress: (): DailyProgress => {
    if (typeof window === 'undefined') {
      return {
        date: new Date().toISOString().split('T')[0],
        minutesSpent: 0,
        objectivesPracticed: [],
        questionsAttempted: 0,
        questionsCorrect: 0,
        sessionsCompleted: 0,
      };
    }
    
    const today = new Date().toISOString().split('T')[0];
    const stored = localStorage.getItem(STORAGE_KEYS.DAILY_PROGRESS);

    if (stored) {
      try {
        const progress = JSON.parse(stored) as DailyProgress;
        if (progress && progress.date === today) {
          return progress;
        }
      } catch {
        try {
          localStorage.removeItem(STORAGE_KEYS.DAILY_PROGRESS);
        } catch {
          /* ignore */
        }
        if (process.env.NODE_ENV === 'development') {
          console.warn(`[nova] Cleared invalid localStorage key: ${STORAGE_KEYS.DAILY_PROGRESS}`);
        }
      }
    }
    
    // New day, reset progress
    const newProgress: DailyProgress = {
      date: today,
      minutesSpent: 0,
      objectivesPracticed: [],
      questionsAttempted: 0,
      questionsCorrect: 0,
      sessionsCompleted: 0,
    };
    localStorage.setItem(STORAGE_KEYS.DAILY_PROGRESS, JSON.stringify(newProgress));
    return newProgress;
  },

  updateTodayProgress: (update: Partial<DailyProgress>): DailyProgress => {
    const current = progressService.getTodayProgress();
    const updated = { ...current, ...update };
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.DAILY_PROGRESS, JSON.stringify(updated));
    }
    return updated;
  },

  recordPractice: (objectiveId: string, isCorrect: boolean, minutesSpent: number): DailyProgress => {
    const current = progressService.getTodayProgress();
    const objectives = current.objectivesPracticed.includes(objectiveId)
      ? current.objectivesPracticed
      : [...current.objectivesPracticed, objectiveId];
    
    return progressService.updateTodayProgress({
      minutesSpent: current.minutesSpent + minutesSpent,
      objectivesPracticed: objectives,
      questionsAttempted: current.questionsAttempted + 1,
      questionsCorrect: current.questionsCorrect + (isCorrect ? 1 : 0),
    });
  },
};

// ============================================
// CHAT SERVICE
// ============================================

export const chatService = {
  getChatHistory: (scope: ChatScope): ChatMessage[] => {
    if (typeof window === 'undefined') return [];
    const allMessages = readJsonFromStorage<ChatMessage[]>(
      STORAGE_KEYS.CHAT_HISTORY,
      () => [],
      (v): v is ChatMessage[] => Array.isArray(v)
    );
    // Filter by scope (same subject and objective)
    return allMessages.filter(m => 
      m.scope.subject === scope.subject && 
      m.scope.objectiveId === scope.objectiveId
    );
  },

  saveMessage: (message: ChatMessage): void => {
    if (typeof window === 'undefined') return;
    const messages = readJsonFromStorage<ChatMessage[]>(
      STORAGE_KEYS.CHAT_HISTORY,
      () => [],
      (v): v is ChatMessage[] => Array.isArray(v)
    );
    messages.push(message);
    // Keep last 1000 messages
    const trimmed = messages.slice(-1000);
    localStorage.setItem(STORAGE_KEYS.CHAT_HISTORY, JSON.stringify(trimmed));
  },

  clearHistory: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEYS.CHAT_HISTORY);
  },

  // Build system prompt for curriculum-locked chat
  buildSystemPrompt: (scope: ChatScope, objective: Objective | null): string => {
    const basePrompt = `You are Nova, a friendly and encouraging AI tutor helping UK GCSE students learn ${scope.subject}.

IMPORTANT RULES:
1. Stay focused on the current scope: ${scope.subject}, Year ${scope.yearGroup}${scope.tier ? `, ${scope.tier} tier` : ''}
2. Current objective: ${objective?.title || 'General help'}
3. If the student asks about something outside this scope, politely offer to switch: "That's a great question! Would you like me to switch to [topic]?"
4. NEVER just give answers to practice questions. Always:
   - Explain the method step by step
   - Ask a follow-up question to check understanding
5. Use clear, simple language appropriate for a UK Year ${scope.yearGroup} student
6. Be encouraging and supportive

${scope.subject === 'Mathematics' ? `
MATHS FORMATTING:
- Use proper mathematical notation
- For powers, write x² or x³ 
- For fractions, write them clearly like 3/4 or ³⁄₄
- For square roots, write √
- Show working step by step
- Use "×" for multiplication, "÷" for division
` : `
ENGLISH GUIDANCE:
- Use quotes when referencing texts
- Explain terminology clearly
- Give examples from familiar contexts
- Encourage use of PEE/PEEL paragraphs
`}

Current topic: ${objective?.description || 'General ' + scope.subject + ' help'}`;

    return basePrompt;
  },
};

// ============================================
// POINTS & LEVELS SERVICE
// ============================================

export const pointsService = {
  // Points awarded for different actions
  POINTS: {
    CORRECT_ANSWER: 10,
    STREAK_BONUS: 5, // Per question in streak
    OBJECTIVE_DEVELOPING: 50,
    OBJECTIVE_SECURE: 100,
    DAILY_GOAL_MET: 25,
    PROVE_PASSED: 75,
  },

  // Calculate level from points (500 XP per level)
  calculateLevel: (points: number): number => {
    return Math.floor(points / 500) + 1;
  },

  // Get points needed for next level
  getPointsToNextLevel: (points: number): number => {
    const currentLevel = pointsService.calculateLevel(points);
    const nextLevelPoints = currentLevel * 500;
    return nextLevelPoints - points;
  },

  // Get level info
  getLevelInfo: (level: number): { title: string; color: string } => {
    if (level >= 20) return { title: 'Master', color: 'text-amber-500' };
    if (level >= 15) return { title: 'Expert', color: 'text-purple-500' };
    if (level >= 10) return { title: 'Advanced', color: 'text-blue-500' };
    if (level >= 5) return { title: 'Intermediate', color: 'text-cyan-500' };
    return { title: 'Beginner', color: 'text-gray-600' };
  },

  // Award points
  awardPoints: (amount: number, reason: string): number => {
    const profile = studentService.getProfile();
    const newPoints = profile.totalPoints + amount;
    const newLevel = pointsService.calculateLevel(newPoints);
    
    studentService.updateProfile({ 
      totalPoints: newPoints,
      level: newLevel,
    });

    // Log the points award
    loggingService.logEvent({
      studentId: profile.id,
      eventType: 'practice_attempt',
      objectiveId: '',
      metadata: { pointsAwarded: amount, reason, newTotal: newPoints },
    });

    return newPoints;
  },

  // Get weekly activity data
  getWeeklyActivity: (): { day: string; minutes: number }[] => {
    // Mock data - in production this would come from actual logs
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const today = new Date().getDay();
    
    return days.map((day, index) => ({
      day,
      minutes: index <= today ? Math.floor(Math.random() * 45) + 15 : 0,
    }));
  },
};

// ============================================
// LOGGING SERVICE
// ============================================

export const loggingService = {
  logEvent: (event: Omit<LearningEvent, 'id' | 'createdAt'>): void => {
    if (typeof window === 'undefined') return;
    
    const fullEvent: LearningEvent = {
      ...event,
      id: `evt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
    };

    const events = readJsonFromStorage<LearningEvent[]>(
      STORAGE_KEYS.LEARNING_EVENTS,
      () => [],
      (v): v is LearningEvent[] => Array.isArray(v)
    );
    events.push(fullEvent);
    
    // Keep last 10000 events
    const trimmed = events.slice(-10000);
    localStorage.setItem(STORAGE_KEYS.LEARNING_EVENTS, JSON.stringify(trimmed));
  },

  getRecentEvents: (studentId: string, limit: number = 100): LearningEvent[] => {
    if (typeof window === 'undefined') return [];
    const events = readJsonFromStorage<LearningEvent[]>(
      STORAGE_KEYS.LEARNING_EVENTS,
      () => [],
      (v): v is LearningEvent[] => Array.isArray(v)
    );
    return events
      .filter(e => e.studentId === studentId)
      .slice(-limit);
  },
};

