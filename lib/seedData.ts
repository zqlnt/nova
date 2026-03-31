// Seed Data for Nova - GCSE Maths & English (AQA & Pearson Edexcel)
// Curriculum: Subject → Exam Board → Tier → Strand → Topic → Objective

import { 
  Objective, 
  QuestionTemplate, 
  Mastery, 
  StudentProfile,
  GeneratedQuestion 
} from './types';
import { mathsObjectivesAqaEdexcel } from './curriculum/objectives';
import { englishLanguageObjectives, englishLiteratureObjectives } from './curriculum/englishObjectives';

// ============================================
// CURRICULUM OBJECTIVES (AQA & Edexcel)
// ============================================

export const mathsObjectives = mathsObjectivesAqaEdexcel;

export const englishObjectives: Objective[] = [
  ...englishLanguageObjectives,
  ...englishLiteratureObjectives,
];

export const allObjectives: Objective[] = [
  ...mathsObjectives,
  ...englishObjectives,
];


// ============================================
// QUESTION TEMPLATES - Seed Data
// ============================================

export const questionTemplates: QuestionTemplate[] = [
  // Linear Equations
  {
    id: 'qt-alg-006-01',
    objectiveId: 'math-alg-006',
    type: 'numeric',
    promptTemplate: 'Solve the equation: {{a}}x + {{b}} = {{c}}',
    paramsSchema: {
      a: { type: 'integer', min: 2, max: 9 },
      b: { type: 'integer', min: 1, max: 20 },
      c: { type: 'integer', min: 10, max: 50 },
    },
    solutionGenerator: '(c - b) / a',
    hints: [
      'First, subtract {{b}} from both sides',
      'Then divide both sides by {{a}}',
    ],
    difficulty: 2,
  },
  {
    id: 'qt-alg-006-02',
    objectiveId: 'math-alg-006',
    type: 'numeric',
    promptTemplate: 'Solve: {{a}}x - {{b}} = {{c}}x + {{d}}',
    paramsSchema: {
      a: { type: 'integer', min: 4, max: 10 },
      b: { type: 'integer', min: 1, max: 15 },
      c: { type: 'integer', min: 1, max: 3 },
      d: { type: 'integer', min: 1, max: 20 },
    },
    solutionGenerator: '(d + b) / (a - c)',
    hints: [
      'Collect x terms on one side',
      'Collect number terms on the other side',
      'Divide to find x',
    ],
    difficulty: 3,
  },
  
  // Expanding Brackets
  {
    id: 'qt-alg-002-01',
    objectiveId: 'math-alg-002',
    type: 'algebraic',
    promptTemplate: 'Expand: {{a}}({{b}}x + {{c}})',
    paramsSchema: {
      a: { type: 'integer', min: 2, max: 6 },
      b: { type: 'integer', min: 1, max: 4 },
      c: { type: 'integer', min: 1, max: 9 },
    },
    solutionGenerator: '(a*b)x + (a*c)',
    hints: [
      'Multiply {{a}} by each term inside the bracket',
      '{{a}} × {{b}}x = ?',
      '{{a}} × {{c}} = ?',
    ],
    difficulty: 2,
  },
  
  // Expanding Double Brackets
  {
    id: 'qt-alg-003-01',
    objectiveId: 'math-alg-003',
    type: 'algebraic',
    promptTemplate: 'Expand and simplify: (x + {{a}})(x + {{b}})',
    paramsSchema: {
      a: { type: 'integer', min: 1, max: 6 },
      b: { type: 'integer', min: 1, max: 6 },
    },
    solutionGenerator: 'x² + (a+b)x + (a*b)',
    hints: [
      'Use FOIL: First, Outside, Inside, Last',
      'First: x × x = x²',
      'Outside: x × {{b}} = {{b}}x',
      'Inside: {{a}} × x = {{a}}x',
      'Last: {{a}} × {{b}} = ?',
      'Collect like terms',
    ],
    difficulty: 3,
  },
  
  // Factorising Quadratics
  {
    id: 'qt-alg-005-01',
    objectiveId: 'math-alg-005',
    type: 'algebraic',
    promptTemplate: 'Factorise: x² + {{sum}}x + {{product}}',
    paramsSchema: {
      sum: { type: 'integer', min: 3, max: 12 },
      product: { type: 'integer', min: 2, max: 36 },
    },
    solutionGenerator: '(x + a)(x + b) where a+b=sum and a*b=product',
    hints: [
      'Find two numbers that add to {{sum}}',
      'Those same two numbers must multiply to give {{product}}',
      'Write as (x + ?)(x + ?)',
    ],
    difficulty: 3,
  },
  
  // Pythagoras
  {
    id: 'qt-geo-003-01',
    objectiveId: 'math-geo-003',
    type: 'numeric',
    promptTemplate: 'A right-angled triangle has shorter sides of {{a}} cm and {{b}} cm. Find the length of the hypotenuse.',
    paramsSchema: {
      a: { type: 'integer', min: 3, max: 8 },
      b: { type: 'integer', min: 4, max: 12 },
    },
    solutionGenerator: 'sqrt(a² + b²)',
    hints: [
      'Use Pythagoras: c² = a² + b²',
      'c² = {{a}}² + {{b}}²',
      'Find c² first, then square root',
    ],
    difficulty: 3,
  },
  
  // Percentages
  {
    id: 'qt-num-004-01',
    objectiveId: 'math-num-004',
    type: 'numeric',
    promptTemplate: 'A price of £{{original}} is increased by {{percent}}%. What is the new price?',
    paramsSchema: {
      original: { type: 'integer', min: 20, max: 200 },
      percent: { type: 'integer', min: 5, max: 40 },
    },
    solutionGenerator: 'original * (1 + percent/100)',
    hints: [
      'Find {{percent}}% of £{{original}} first',
      '{{percent}}% means {{percent}}/100',
      'Add this increase to the original',
    ],
    difficulty: 2,
  },

  // English - Inference
  {
    id: 'qt-eng-read-002-01',
    objectiveId: 'eng-read-002',
    type: 'short_answer',
    promptTemplate: 'Read the extract below and explain what you can infer about the character\'s feelings.\n\n"{{extract}}"',
    paramsSchema: {
      extract: { 
        type: 'string', 
        options: [
          'Sarah slammed the door behind her and threw her bag across the room. She slumped onto the bed, staring at the ceiling.',
          'Tom checked his watch for the third time, his foot tapping against the cold floor. He peered through the window at the empty street.',
          'Maya smiled as she read the letter, her eyes glistening. She pressed it to her chest and looked out at the garden.',
        ]
      },
    },
    solutionGenerator: 'rubric_inference',
    hints: [
      'Look at the character\'s actions',
      'What do their physical movements suggest?',
      'Use evidence from the text',
    ],
    difficulty: 2,
  },

  // English - Language Analysis
  {
    id: 'qt-eng-read-003-01',
    objectiveId: 'eng-read-003',
    type: 'short_answer',
    promptTemplate: 'Analyse the effect of the word "{{word}}" in the following sentence:\n\n"{{sentence}}"',
    paramsSchema: {
      word: { type: 'string', options: ['piercing', 'crept', 'shattered', 'whispered'] },
      sentence: { 
        type: 'string', 
        options: [
          'The piercing cold cut through her thin coat.',
          'Doubt crept into his mind as he waited.',
          'The news shattered her hopes completely.',
          'The leaves whispered secrets in the breeze.',
        ]
      },
    },
    solutionGenerator: 'rubric_language_analysis',
    hints: [
      'What does this word literally mean?',
      'What connotations does it have?',
      'What effect does it create for the reader?',
    ],
    difficulty: 3,
  },

  // English - Paragraph Structure
  {
    id: 'qt-eng-writ-001-01',
    objectiveId: 'eng-writ-001',
    type: 'extended_answer',
    promptTemplate: 'Write a PEEL paragraph about: {{topic}}',
    paramsSchema: {
      topic: { 
        type: 'string', 
        options: [
          'why mobile phones should be banned in schools',
          'the importance of reading for young people',
          'why exercise is important for teenagers',
        ]
      },
    },
    solutionGenerator: 'rubric_peel',
    hints: [
      'P = Point: Start with your main point',
      'E = Evidence: Give an example or fact',
      'E = Explain: Say why this matters',
      'L = Link: Connect back to the question',
    ],
    difficulty: 2,
  },
];

// ============================================
// INITIAL MASTERY STATE
// ============================================

export const createInitialMastery = (objectives: Objective[]): Mastery[] => {
  return objectives.map(obj => ({
    objectiveId: obj.id,
    status: 'not_started',
    lastPracticedAt: null,
    streakCorrect: 0,
    attempts: 0,
    correctAttempts: 0,
    provePassedAt: null,
  }));
};

// ============================================
// DEFAULT STUDENT PROFILE
// ============================================

export const defaultStudentProfile: StudentProfile = {
  id: 'local',
  name: '',
  yearGroup: 10,
  subjects: ['Mathematics', 'English'],
  mathsTier: 'Higher',
  onboardingCompleted: false,
  baselineCompletedAt: null,
  currentStreak: 0,
  longestStreak: 0,
  totalMinutesLearned: 0,
  totalPoints: 0,
  level: 1,
  createdAt: new Date(),
};

