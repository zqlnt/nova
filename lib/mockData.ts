// Mock data for the application

export const mockStudent = {
  id: '1',
  name: 'Alex Johnson',
  initials: 'AJ',
  ageGroup: '14-15',
  yearGroup: 'Year 10',
  interests: 'Science, Mathematics, Technology, Space Exploration',
  weakAreas: [
    { subject: 'Mathematics', topic: 'Quadratic Equations', progress: 45 },
    { subject: 'Physics', topic: 'Thermodynamics', progress: 60 },
    { subject: 'Chemistry', topic: 'Organic Chemistry', progress: 55 },
  ],
  currentLesson: {
    subject: 'Mathematics',
    title: 'Advanced Algebra: Quadratic Functions',
    progress: 67,
    nextUp: 'Solving Complex Equations',
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
    content: 'Hello Alex! I\'m Nova, your AI learning companion. I\'m here to help you understand any topic you\'re curious about. What would you like to learn today?',
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
    content: 'Of course! Quadratic equations are polynomial equations of degree 2. They take the form ax² + bx + c = 0, where a, b, and c are constants and a ≠ 0. Would you like me to walk you through solving one step by step?',
    timestamp: '10:32 AM',
  },
];

export const mockClasses = [
  {
    id: '1',
    name: 'Year 10 Mathematics',
    studentCount: 28,
    activeStudents: 24,
    averageProgress: 78,
    weakTopics: ['Quadratic Equations', 'Trigonometry'],
    recentActivity: '5 students active today',
  },
  {
    id: '2',
    name: 'Year 10 Physics',
    studentCount: 25,
    activeStudents: 22,
    averageProgress: 72,
    weakTopics: ['Thermodynamics', 'Wave Motion'],
    recentActivity: '8 students active today',
  },
  {
    id: '3',
    name: 'Year 11 Chemistry',
    studentCount: 22,
    activeStudents: 20,
    averageProgress: 85,
    weakTopics: ['Organic Chemistry', 'Chemical Bonding'],
    recentActivity: '3 students active today',
  },
];

export const mockClassStudents = [
  {
    id: '1',
    name: 'Alex Johnson',
    initials: 'AJ',
    overallProgress: 82,
    lessonsCompleted: 42,
    lastActive: '2 hours ago',
    weakAreas: ['Quadratic Equations', 'Functions'],
  },
  {
    id: '2',
    name: 'Sarah Williams',
    initials: 'SW',
    overallProgress: 91,
    lessonsCompleted: 48,
    lastActive: '1 hour ago',
    weakAreas: ['Statistics'],
  },
  {
    id: '3',
    name: 'James Brown',
    initials: 'JB',
    overallProgress: 76,
    lessonsCompleted: 38,
    lastActive: '1 day ago',
    weakAreas: ['Geometry', 'Algebra'],
  },
  {
    id: '4',
    name: 'Emily Davis',
    initials: 'ED',
    overallProgress: 88,
    lessonsCompleted: 45,
    lastActive: '3 hours ago',
    weakAreas: ['Trigonometry'],
  },
  {
    id: '5',
    name: 'Michael Chen',
    initials: 'MC',
    overallProgress: 79,
    lessonsCompleted: 40,
    lastActive: '5 hours ago',
    weakAreas: ['Calculus Basics', 'Functions'],
  },
];

export const subjects = [
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'English',
  'History',
  'Computer Science',
];

