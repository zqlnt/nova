// Core Types for Nova GCSE Learning Platform
// Curriculum structure: Subject → Exam Board → Tier/Pathway → Strand → Topic → Objective

export type {
  EnglishLanguageSkill,
  LiteratureTextCategory,
  LiteratureSkill,
  CurriculumObjective,
  StrandMasterySummary,
  SubjectMasterySummary,
} from './curriculumTypes';

// ============================================
// CURRICULUM TYPES
// ============================================

export type Subject = 'Mathematics' | 'English Language' | 'English Literature' | 'English';
// 'English' = aggregate of English Language + English Literature (backward compat)
export type MathsTier = 'Foundation' | 'Higher' | 'Unsure';
export type YearGroup = 7 | 8 | 9 | 10 | 11;
export type MasteryStatus = 'not_started' | 'developing' | 'secure';

export type MathsStrand =
  | 'Number'
  | 'Algebra'
  | 'Ratio, Proportion and Rates of Change'
  | 'Geometry and Measures'
  | 'Statistics'
  | 'Probability';

export type EnglishStrand =
  | 'Reading'
  | 'Writing'
  | 'SPaG and Vocabulary';

export type EnglishLiteratureStrand =
  | 'Shakespeare'
  | '19th-century novel'
  | 'Modern prose/drama'
  | 'Poetry anthology'
  | 'Unseen poetry'
  | 'Essay skills';

export type Strand = MathsStrand | EnglishStrand | EnglishLiteratureStrand;

export type ExamBoard = 'AQA' | 'Pearson Edexcel';

export interface Objective {
  id: string;
  subject: Subject;
  strand: Strand | string;
  title: string;
  description: string;
  yearMin: YearGroup;
  yearMax: YearGroup;
  tier?: MathsTier;
  prerequisites: string[];
  difficulty: 1 | 2 | 3 | 4 | 5;
  keywords: string[];
  /** Curriculum: exam boards this objective applies to */
  examBoards?: ExamBoard[];
  /** Curriculum: topic within strand */
  topicId?: string;
  topicTitle?: string;
}

// ============================================
// MASTERY TYPES
// ============================================

export interface Mastery {
  objectiveId: string;
  status: MasteryStatus;
  lastPracticedAt: Date | null;
  streakCorrect: number;
  attempts: number;
  correctAttempts: number;
  provePassedAt: Date | null;
}

export interface StrandMastery {
  strand: Strand;
  subject: Subject;
  secure: number;
  developing: number;
  notStarted: number;
  nextObjective: Objective | null;
}

export interface SubjectMastery {
  subject: Subject;
  strands: StrandMastery[];
  totalObjectives: number;
  secureCount: number;
  developingCount: number;
  notStartedCount: number;
}

// ============================================
// QUESTION TYPES
// ============================================

export type QuestionType = 
  | 'multiple_choice' 
  | 'numeric' 
  | 'algebraic' 
  | 'short_answer' 
  | 'extended_answer';

export interface QuestionTemplate {
  id: string;
  objectiveId: string;
  type: QuestionType;
  promptTemplate: string; // e.g., "Solve: {{a}}x + {{b}} = {{c}}"
  paramsSchema: Record<string, ParamSchema>;
  solutionGenerator: string; // Function name or formula
  hints: string[];
  difficulty: 1 | 2 | 3 | 4 | 5;
}

export interface ParamSchema {
  type: 'integer' | 'decimal' | 'string';
  min?: number;
  max?: number;
  options?: string[];
}

export interface GeneratedQuestion {
  id: string;
  templateId: string;
  objectiveId: string;
  type: QuestionType;
  prompt: string;
  params: Record<string, number | string>;
  correctAnswer: string | number;
  acceptableAnswers?: (string | number)[]; // For algebraic equivalence
  options?: string[]; // For multiple choice
  hints: string[];
  difficulty: 1 | 2 | 3 | 4 | 5;
}

export interface QuestionAttempt {
  id: string;
  questionId: string;
  objectiveId: string;
  answer: string;
  isCorrect: boolean;
  feedback: string;
  hintsUsed: number;
  timeSpentSeconds: number;
  createdAt: Date;
}

// ============================================
// LEARNING SESSION TYPES
// ============================================

export type SessionPhase = 'learn' | 'practice' | 'prove';

export interface LearningSession {
  id: string;
  objectiveId: string;
  phase: SessionPhase;
  startedAt: Date;
  completedAt: Date | null;
  questionsAttempted: number;
  questionsCorrect: number;
  timeSpentSeconds: number;
}

export interface DailyProgress {
  date: string; // YYYY-MM-DD
  minutesSpent: number;
  objectivesPracticed: string[];
  questionsAttempted: number;
  questionsCorrect: number;
  sessionsCompleted: number;
}

// ============================================
// STUDENT PROFILE TYPES
// ============================================

export interface StudentProfile {
  id: string;
  name: string;
  yearGroup: YearGroup;
  subjects: Subject[];
  mathsTier?: MathsTier;
  onboardingCompleted: boolean;
  baselineCompletedAt: Date | null;
  currentStreak: number;
  longestStreak: number;
  totalMinutesLearned: number;
  totalPoints: number;
  level: number;
  createdAt: Date;
}

// Points and Levels
export interface PointsConfig {
  correctAnswer: number;
  perfectStreak: number;
  objectiveMastered: number;
  dailyGoalMet: number;
  lessonCompleted: number;
}

export interface LevelInfo {
  level: number;
  title: string;
  minPoints: number;
  maxPoints: number;
  color: string;
}

export interface OnboardingData {
  yearGroup: YearGroup | null;
  subjects: Subject[];
  mathsTier: MathsTier | null;
  baselineResults: BaselineResult[];
}

export interface BaselineResult {
  objectiveId: string;
  questionId: string;
  isCorrect: boolean;
  suggestedStatus: MasteryStatus;
}

// ============================================
// CHAT TYPES
// ============================================

export interface ChatScope {
  subject: Subject;
  yearGroup: YearGroup;
  tier?: MathsTier;
  objectiveId: string | null;
  objectiveTitle: string | null;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  scope: ChatScope;
  timestamp: Date;
  quickAction?: QuickAction;
}

export type QuickAction = 
  | 'explain_simply'
  | 'show_example'
  | 'practice_question'
  | 'check_answer';

// ============================================
// UI STATE TYPES
// ============================================

export interface AppState {
  student: StudentProfile | null;
  currentObjective: Objective | null;
  nextObjective: Objective | null;
  chatScope: ChatScope | null;
  onboarding: OnboardingData;
  todayProgress: DailyProgress;
  isLoading: boolean;
}

// ============================================
// EVIDENCE LOGGING
// ============================================

export interface LearningEvent {
  id: string;
  studentId: string;
  eventType: 'learn_start' | 'learn_complete' | 'practice_attempt' | 'prove_attempt' | 'chat_message' | 'objective_change';
  objectiveId: string;
  metadata: Record<string, any>;
  createdAt: Date;
}

