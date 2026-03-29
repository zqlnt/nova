// Curriculum-Aware Types for Nova GCSE Learning Platform
// Structure: Subject → Exam Board → Tier/Pathway → Strand → Topic → Objective → Question/Explanation/Assessment

// ============================================
// EXAM BOARD & PATHWAY
// ============================================

export type ExamBoard = 'AQA' | 'Pearson Edexcel';

export type MathsTier = 'Foundation' | 'Higher' | 'Unsure';

export type YearGroup = 7 | 8 | 9 | 10 | 11;

// ============================================
// SUBJECTS (GCSE-specific)
// ============================================

export type Subject = 'Mathematics' | 'English Language' | 'English Literature';

// Legacy alias for backward compatibility during migration
export type SubjectLegacy = 'Mathematics' | 'English';

// ============================================
// MATHS STRANDS (AQA/Edexcel aligned)
// ============================================

export type MathsStrand =
  | 'Number'
  | 'Algebra'
  | 'Ratio, Proportion and Rates of Change'
  | 'Geometry and Measures'
  | 'Probability'
  | 'Statistics';

// ============================================
// ENGLISH LANGUAGE SKILLS (transferable across boards)
// ============================================

export type EnglishLanguageSkill =
  | 'Reading comprehension'
  | 'Inference'
  | 'Retrieval of explicit information'
  | 'Language analysis'
  | 'Structure analysis'
  | 'Comparing writers\' ideas and perspectives'
  | 'Analysing viewpoint, tone, and methods'
  | 'Rhetorical methods and persuasive techniques'
  | 'Summary and synthesis'
  | 'Transactional writing'
  | 'Descriptive writing'
  | 'Narrative writing'
  | 'Audience, purpose, and form'
  | 'Sentence control, punctuation, grammar, vocabulary, spelling'
  | 'Editing and improving writing'
  | 'Spoken language / presentation';

// ============================================
// ENGLISH LITERATURE AREAS
// ============================================

export type LiteratureTextCategory =
  | 'Shakespeare'
  | '19th-century novel'
  | 'Modern prose/drama'
  | 'Poetry anthology'
  | 'Unseen poetry';

export type LiteratureSkill =
  | 'Comparison writing'
  | 'Context'
  | 'Language/form/structure analysis'
  | 'Theme tracking'
  | 'Character analysis'
  | 'Quotation knowledge and recall'
  | 'Essay planning and timed literary response';

// ============================================
// TOPIC (Strand → Topic hierarchy)
// ============================================

export interface Topic {
  id: string;
  strand: string; // MathsStrand | EnglishLanguageSkill | LiteratureTextCategory
  subject: Subject;
  title: string;
  description?: string;
  examBoards: ExamBoard[];
  tier?: MathsTier; // Maths only
}

// ============================================
// CURRICULUM OBJECTIVE (full GCSE mapping)
// ============================================

export type AssessmentStyle =
  | 'calculator'
  | 'non-calculator'
  | 'extended_response'
  | 'short_answer'
  | 'multiple_choice'
  | 'essay'
  | 'comparison';

export interface CurriculumObjective {
  id: string;
  subject: Subject;
  strand: string; // MathsStrand | EnglishLanguageSkill | LiteratureTextCategory
  topicId: string;
  topicTitle: string;
  title: string;
  description: string;
  yearMin: YearGroup;
  yearMax: YearGroup;
  tier?: MathsTier; // Maths only
  examBoards: ExamBoard[];
  prerequisites: string[];
  difficulty: 1 | 2 | 3 | 4 | 5;
  keywords: string[];
  assessmentStyle?: AssessmentStyle;
  // English Literature: link to text area
  literatureTextCategory?: LiteratureTextCategory;
  literatureSkill?: LiteratureSkill;
}

// ============================================
// LITERATURE SET TEXT (configurable per school/class)
// ============================================

export interface LiteratureSetText {
  id: string;
  category: LiteratureTextCategory;
  title: string;
  author: string;
  examBoards: ExamBoard[];
  paperMapping?: string; // e.g. "Paper 1 Section A"
}

export interface PoetryAnthology {
  id: string;
  title: string;
  examBoard: ExamBoard;
  cluster?: string;
  poems: { id: string; title: string; poet: string }[];
}

export interface ClassLiteratureConfig {
  classId: string;
  examBoard: ExamBoard;
  shakespeare?: LiteratureSetText;
  nineteenthCenturyNovel?: LiteratureSetText;
  modernProseDrama?: LiteratureSetText;
  poetryAnthology?: PoetryAnthology;
}

// ============================================
// MASTERY (curriculum-linked)
// ============================================

export type MasteryStatus = 'not_started' | 'developing' | 'secure';

export interface Mastery {
  objectiveId: string;
  status: MasteryStatus;
  lastPracticedAt: Date | null;
  streakCorrect: number;
  attempts: number;
  correctAttempts: number;
  provePassedAt: Date | null;
  examBoard?: ExamBoard; // For curriculum-level reporting
}

// ============================================
// STRAND MASTERY (for dashboards)
// ============================================

export interface StrandMasterySummary {
  strand: string;
  subject: Subject;
  secure: number;
  developing: number;
  notStarted: number;
  total: number;
  nextObjective: CurriculumObjective | null;
  examBoard?: ExamBoard;
}

export interface SubjectMasterySummary {
  subject: Subject;
  strands: StrandMasterySummary[];
  totalObjectives: number;
  secureCount: number;
  developingCount: number;
  notStartedCount: number;
}

// ============================================
// STUDENT PROFILE (curriculum-aware)
// ============================================

export interface StudentCurriculumConfig {
  examBoard: ExamBoard;
  mathsTier?: MathsTier;
  subjects: Subject[];
  yearGroup: YearGroup;
  literatureConfig?: ClassLiteratureConfig;
}
