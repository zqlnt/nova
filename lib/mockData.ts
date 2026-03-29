// Mock data for the application - GCSE Maths & English Focus

// GCSE Mathematics Curriculum based on Edexcel (9-1) Specification
export const mathsCurriculum = {
  subject: 'Mathematics',
  examBoard: 'Edexcel',
  qualification: 'GCSE (9-1)',
  code: '1MA1',
  tiers: ['Foundation', 'Higher'],
  strands: [
    {
      id: 'number',
      name: 'Number',
      topics: [
        { id: 'n1', name: 'Structure and calculation', subtopics: ['Order positive and negative integers', 'Apply four operations', 'Order of operations (BIDMAS)', 'Understand place value', 'Factors, multiples and primes', 'Prime factorisation including HCF and LCM'] },
        { id: 'n2', name: 'Fractions, decimals and percentages', subtopics: ['Work with fractions', 'Calculate percentages', 'Convert between fractions, decimals and percentages', 'Percentage change', 'Reverse percentages', 'Compound interest and depreciation'] },
        { id: 'n3', name: 'Measures and accuracy', subtopics: ['Use standard units', 'Round to decimal places and significant figures', 'Estimate answers', 'Upper and lower bounds', 'Calculate with bounds'] },
        { id: 'n4', name: 'Indices and surds', subtopics: ['Laws of indices', 'Standard form', 'Work with surds', 'Simplify surds', 'Rationalise denominators'] },
      ]
    },
    {
      id: 'algebra',
      name: 'Algebra',
      topics: [
        { id: 'a1', name: 'Notation, vocabulary and manipulation', subtopics: ['Use algebraic notation', 'Substitute numerical values', 'Simplify expressions', 'Expand brackets', 'Factorise expressions', 'Algebraic fractions'] },
        { id: 'a2', name: 'Graphs', subtopics: ['Plot and interpret graphs', 'Recognise and sketch graphs', 'Straight line graphs (y = mx + c)', 'Quadratic graphs', 'Other polynomial and reciprocal graphs', 'Exponential graphs', 'Gradients of curves'] },
        { id: 'a3', name: 'Solving equations and inequalities', subtopics: ['Solve linear equations', 'Solve quadratic equations', 'Solve simultaneous equations', 'Solve linear inequalities', 'Solve quadratic inequalities', 'Approximate solutions using iteration'] },
        { id: 'a4', name: 'Sequences', subtopics: ['Generate sequences', 'nth term of arithmetic sequences', 'nth term of quadratic sequences', 'Recognise geometric sequences', 'Fibonacci-type sequences'] },
        { id: 'a5', name: 'Functions', subtopics: ['Function notation', 'Composite functions', 'Inverse functions', 'Transformations of functions'] },
      ]
    },
    {
      id: 'ratio',
      name: 'Ratio, Proportion and Rates of Change',
      topics: [
        { id: 'r1', name: 'Ratio and proportion', subtopics: ['Use ratio notation', 'Divide in a given ratio', 'Express as a ratio', 'Compare ratios', 'Solve ratio problems'] },
        { id: 'r2', name: 'Proportional reasoning', subtopics: ['Direct proportion', 'Inverse proportion', 'Proportion graphs', 'Compound measures (speed, density, pressure)', 'Unit conversions'] },
        { id: 'r3', name: 'Rates of change', subtopics: ['Compare rates of change', 'Interpret gradient as rate of change', 'Calculate average rate of change', 'Estimate instantaneous rate of change'] },
      ]
    },
    {
      id: 'geometry',
      name: 'Geometry and Measures',
      topics: [
        { id: 'g1', name: 'Properties and constructions', subtopics: ['Points, lines, vertices, edges, faces', 'Parallel and perpendicular lines', 'Angles (acute, obtuse, reflex)', 'Angle facts', 'Properties of polygons', 'Constructions with compass and ruler', 'Loci'] },
        { id: 'g2', name: 'Mensuration and calculation', subtopics: ['Perimeter and area of 2D shapes', 'Surface area and volume of 3D shapes', 'Circle calculations (circumference, area)', 'Arc length and sector area', 'Volume of prisms, cylinders, cones, spheres', 'Compound shapes'] },
        { id: 'g3', name: 'Congruence and similarity', subtopics: ['Congruent triangles', 'Similar shapes', 'Scale factors for length, area, volume', 'Trigonometric ratios'] },
        { id: 'g4', name: 'Pythagoras and trigonometry', subtopics: ['Pythagoras theorem', 'Trigonometry in right-angled triangles', 'Exact values of sin, cos, tan', 'Sine rule', 'Cosine rule', 'Area of triangle using sine', '3D trigonometry'] },
        { id: 'g5', name: 'Vectors', subtopics: ['Vector notation', 'Vector arithmetic', 'Parallel vectors', 'Position vectors', 'Vector geometry proofs'] },
        { id: 'g6', name: 'Transformations', subtopics: ['Reflections', 'Rotations', 'Translations', 'Enlargements', 'Describe transformations', 'Combine transformations'] },
      ]
    },
    {
      id: 'probability',
      name: 'Probability',
      topics: [
        { id: 'p1', name: 'Basic probability', subtopics: ['Probability scale 0 to 1', 'Calculate theoretical probability', 'Relative frequency', 'Expected outcomes', 'Mutually exclusive events'] },
        { id: 'p2', name: 'Combined events', subtopics: ['Sample space diagrams', 'Venn diagrams', 'Tree diagrams', 'Independent events', 'Conditional probability'] },
      ]
    },
    {
      id: 'statistics',
      name: 'Statistics',
      topics: [
        { id: 's1', name: 'Data collection', subtopics: ['Primary and secondary data', 'Sampling methods', 'Bias in sampling', 'Questionnaire design'] },
        { id: 's2', name: 'Data processing and representation', subtopics: ['Tables and frequency tables', 'Bar charts and pictograms', 'Pie charts', 'Line graphs and scatter graphs', 'Histograms', 'Cumulative frequency', 'Box plots'] },
        { id: 's3', name: 'Data analysis', subtopics: ['Mean, median, mode, range', 'Averages from grouped data', 'Quartiles and interquartile range', 'Compare distributions', 'Correlation and lines of best fit'] },
      ]
    },
  ],
  assessmentObjectives: [
    { id: 'AO1', name: 'Use and apply standard techniques', weight: '40% Foundation / 50% Higher', description: 'Students should be able to accurately recall facts, terminology and definitions, use and interpret notation correctly, and accurately carry out routine procedures' },
    { id: 'AO2', name: 'Reason, interpret and communicate mathematically', weight: '30%', description: 'Students should be able to make deductions, inferences and draw conclusions, construct chains of reasoning, interpret and communicate information' },
    { id: 'AO3', name: 'Solve problems within mathematics and other contexts', weight: '30% Foundation / 20% Higher', description: 'Students should be able to translate problems into mathematical processes, make and use connections, interpret results and evaluate methods' },
  ],
  formulaeProvided: [
    'Curved surface area of cone = πrl',
    'Surface area of sphere = 4πr²',
    'Volume of sphere = (4/3)πr³',
    'Volume of cone = (1/3)πr²h',
  ]
};

// GCSE English Curriculum based on AQA/Edexcel specifications
export const englishCurriculum = {
  subject: 'English',
  components: ['English Language', 'English Literature'],
  language: {
    name: 'English Language',
    examBoard: 'AQA/Edexcel',
    qualification: 'GCSE (9-1)',
    strands: [
      {
        id: 'reading',
        name: 'Reading',
        topics: [
          { id: 'r1', name: 'Comprehension', subtopics: ['Identify explicit information', 'Identify implicit information', 'Synthesise information from texts', 'Summary skills'] },
          { id: 'r2', name: 'Language analysis', subtopics: ['Analyse word choice', 'Analyse language features', 'Analyse sentence forms', 'Effects on reader', 'Writer\'s methods'] },
          { id: 'r3', name: 'Structure analysis', subtopics: ['Structural features', 'How writers structure texts', 'Beginnings and endings', 'Narrative perspective', 'Shifts in focus'] },
          { id: 'r4', name: 'Evaluation', subtopics: ['Evaluate texts critically', 'Support with textual evidence', 'Compare writers\' perspectives', 'Evaluate effectiveness'] },
        ]
      },
      {
        id: 'writing',
        name: 'Writing',
        topics: [
          { id: 'w1', name: 'Creative writing', subtopics: ['Narrative writing', 'Descriptive writing', 'Creating characters', 'Setting and atmosphere', 'Engaging openings', 'Effective endings'] },
          { id: 'w2', name: 'Transactional writing', subtopics: ['Writing to argue', 'Writing to persuade', 'Writing to advise', 'Writing to inform', 'Writing to explain', 'Letters, articles, speeches, leaflets'] },
          { id: 'w3', name: 'Technical accuracy', subtopics: ['Sentence structures', 'Punctuation', 'Spelling', 'Paragraphing', 'Vocabulary choices', 'Register and tone'] },
        ]
      },
      {
        id: 'spoken',
        name: 'Spoken Language',
        topics: [
          { id: 'sp1', name: 'Presentation skills', subtopics: ['Presenting information', 'Responding to questions', 'Use of Standard English', 'Speaking clearly and fluently'] },
        ]
      },
    ],
    assessmentObjectives: [
      { id: 'AO1', name: 'Identify and interpret information', weight: '~12.5%', description: 'Identify and interpret explicit and implicit information and ideas' },
      { id: 'AO2', name: 'Explain and analyse language', weight: '~12.5%', description: 'Explain, comment on and analyse how writers use language and structure to achieve effects' },
      { id: 'AO3', name: 'Compare texts', weight: '~7.5%', description: 'Compare writers\' ideas and perspectives' },
      { id: 'AO4', name: 'Evaluate critically', weight: '~7.5%', description: 'Evaluate texts critically and support this with appropriate textual references' },
      { id: 'AO5', name: 'Communicate effectively', weight: '~30%', description: 'Communicate clearly, effectively and imaginatively, selecting and adapting tone, style and register' },
      { id: 'AO6', name: 'Technical accuracy', weight: '~30%', description: 'Use a range of vocabulary and sentence structures with accurate spelling and punctuation' },
    ],
  },
  literature: {
    name: 'English Literature',
    examBoard: 'AQA/Edexcel',
    qualification: 'GCSE (9-1)',
    strands: [
      {
        id: 'shakespeare',
        name: 'Shakespeare',
        topics: [
          { id: 'sh1', name: 'Set texts', subtopics: ['Macbeth', 'Romeo and Juliet', 'The Tempest', 'Merchant of Venice', 'Much Ado About Nothing', 'Julius Caesar'] },
          { id: 'sh2', name: 'Analysis skills', subtopics: ['Character analysis', 'Theme exploration', 'Language analysis', 'Context', 'Dramatic techniques', 'Tragedy and comedy conventions'] },
        ]
      },
      {
        id: 'c19novel',
        name: '19th Century Novel',
        topics: [
          { id: 'n1', name: 'Set texts', subtopics: ['A Christmas Carol', 'Great Expectations', 'Jane Eyre', 'Frankenstein', 'Pride and Prejudice', 'The Sign of Four', 'Dr Jekyll and Mr Hyde'] },
          { id: 'n2', name: 'Analysis skills', subtopics: ['Narrative voice', 'Characterisation', 'Setting and atmosphere', 'Social and historical context', 'Victorian themes', 'Genre conventions'] },
        ]
      },
      {
        id: 'modern',
        name: 'Modern Texts',
        topics: [
          { id: 'm1', name: 'Set texts (prose)', subtopics: ['An Inspector Calls', 'Blood Brothers', 'Animal Farm', 'Lord of the Flies', 'Never Let Me Go', 'The Curious Incident'] },
          { id: 'm2', name: 'Set texts (drama)', subtopics: ['An Inspector Calls', 'Blood Brothers', 'A Taste of Honey', 'The History Boys', 'DNA'] },
          { id: 'm3', name: 'Analysis skills', subtopics: ['Modern themes', 'Social commentary', 'Dramatic techniques', 'Stage directions', 'Character development'] },
        ]
      },
      {
        id: 'poetry',
        name: 'Poetry',
        topics: [
          { id: 'po1', name: 'Poetry anthology', subtopics: ['Power and conflict poems', 'Love and relationships poems', 'Comparing poems', 'Unseen poetry'] },
          { id: 'po2', name: 'Poetry analysis', subtopics: ['Form and structure', 'Imagery and symbolism', 'Sound devices', 'Tone and mood', 'Poetic voice', 'Historical and social context'] },
        ]
      },
    ],
    assessmentObjectives: [
      { id: 'AO1', name: 'Response to texts', weight: '~15%', description: 'Read, understand and respond to texts using textual references' },
      { id: 'AO2', name: 'Analyse language and structure', weight: '~15%', description: 'Analyse the language, form and structure used by a writer' },
      { id: 'AO3', name: 'Show understanding of context', weight: '~15%', description: 'Show understanding of the relationships between texts and contexts' },
      { id: 'AO4', name: 'Use written expression', weight: '~5%', description: 'Use a range of vocabulary and sentence structures with accurate spelling and punctuation' },
    ],
  }
};

// Subject list - Maths and English only
export const subjects = [
  'Mathematics',
  'English Language',
  'English Literature',
];

export const mockStudent = {
  id: '1',
  name: 'Alex Johnson',
  initials: 'AJ',
  ageGroup: '14-15',
  yearGroup: 'Year 10',
  interests: 'Problem solving, Creative writing, Reading',
  weakAreas: [
    { subject: 'Mathematics', topic: 'Quadratic Equations', strand: 'Algebra', progress: 45 },
    { subject: 'Mathematics', topic: 'Trigonometry', strand: 'Geometry and Measures', progress: 55 },
    { subject: 'English Language', topic: 'Language Analysis', strand: 'Reading', progress: 60 },
  ],
  currentLesson: {
    subject: 'Mathematics',
    title: 'Solving Quadratic Equations',
    topic: 'Factorising and using the quadratic formula',
    progress: 67,
    nextUp: 'Completing the Square',
  },
  stats: {
    lessonsCompleted: 42,
    streakDays: 7,
    totalPoints: 1250,
    averageScore: 82,
  }
};

export const mockChatMessages = [
  {
    id: '1',
    sender: 'nova' as const,
    content: 'Hello Alex! I\'m Nova, your AI learning companion. I specialise in GCSE Maths and English. What would you like to work on today?',
    timestamp: '10:30 AM',
  },
  {
    id: '2',
    sender: 'user' as const,
    content: 'Can you help me understand quadratic equations?',
    timestamp: '10:32 AM',
  },
  {
    id: '3',
    sender: 'nova' as const,
    content: 'Of course! Quadratic equations are polynomial equations of degree 2. They take the form ax² + bx + c = 0, where a, b, and c are constants and a ≠ 0.\n\nThere are three main methods to solve them:\n1. **Factorising** - finding two brackets that multiply to give the equation\n2. **Quadratic formula** - x = (-b ± √(b²-4ac)) / 2a\n3. **Completing the square** - rewriting in the form (x + p)² + q\n\nWould you like me to walk you through one of these methods step by step?',
    timestamp: '10:32 AM',
  },
];

import { seedClasses, seedStudents } from '@/lib/orgSeed';

export const mockClasses = [
  {
    id: seedClasses[0].id,
    name: seedClasses[0].name,
    subject: 'Mathematics',
    studentCount: seedStudents.length,
    activeStudents: Math.floor(seedStudents.length * 0.7),
    averageProgress: 72,
    weakTopics: ['Algebra', 'Number', 'Ratio & Proportion'],
    recentActivity: `${Math.min(5, seedStudents.length)} students active today`,
  },
];

const getInitials = (name: string) =>
  name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

export const mockClassStudents = seedStudents.map((s, i) => ({
  id: s.id,
  name: s.name,
  initials: getInitials(s.name),
  overallProgress: 65 + (i % 5) * 8,
  lessonsCompleted: 20 + i * 2,
  lastActive: i < 5 ? '2 hours ago' : i < 12 ? '1 day ago' : '3 days ago',
  weakAreas: ['Algebra', 'Number'].slice(0, 1 + (i % 2)),
  subjects: s.subjects,
}));

// Helper function to get topics for a subject
export const getTopicsForSubject = (subjectName: string) => {
  if (subjectName === 'Mathematics') {
    return mathsCurriculum.strands.flatMap(strand => 
      strand.topics.map(topic => ({
        ...topic,
        strand: strand.name,
      }))
    );
  }
  if (subjectName === 'English Language') {
    return englishCurriculum.language.strands.flatMap(strand =>
      strand.topics.map(topic => ({
        ...topic,
        strand: strand.name,
      }))
    );
  }
  if (subjectName === 'English Literature') {
    return englishCurriculum.literature.strands.flatMap(strand =>
      strand.topics.map(topic => ({
        ...topic,
        strand: strand.name,
      }))
    );
  }
  return [];
};

// Get curriculum by subject
export const getCurriculum = (subjectName: string) => {
  if (subjectName === 'Mathematics') return mathsCurriculum;
  if (subjectName === 'English Language') return englishCurriculum.language;
  if (subjectName === 'English Literature') return englishCurriculum.literature;
  return null;
};
