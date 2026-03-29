import type { CalendarEvent } from '@/lib/calendarTypes';
import { uk2026TermDates } from '@/lib/calendarSeed';

export const studentCalendarEvents: CalendarEvent[] = [
  { id: 's_exam', title: 'GCSE Exams', startDate: '2026-05-11', endDate: '2026-06-19', type: 'exam', description: 'GCSE examination period' },
  { id: 's_mock', title: 'Mock Exams', startDate: '2026-03-17', endDate: '2026-03-21', type: 'exam', description: 'Practice exams' },
  { id: 's_rev1', title: 'Algebra revision block', startDate: '2026-03-24', endDate: '2026-03-30', type: 'revision', description: 'Focus on algebra objectives' },
  { id: 's_rev2', title: 'Number revision block', startDate: '2026-04-07', endDate: '2026-04-13', type: 'revision', description: 'Focus on number objectives' },
  { id: 's_rev3', title: 'Geometry revision block', startDate: '2026-04-21', endDate: '2026-04-27', type: 'revision', description: 'Focus on geometry objectives' },
  { id: 's_prac1', title: 'Practice milestone: 50 questions', startDate: '2026-03-15', type: 'task', description: 'Complete 50 practice questions' },
  { id: 's_prac2', title: 'Practice milestone: 100 questions', startDate: '2026-04-01', type: 'task', description: 'Complete 100 practice questions' },
  { id: 's_check1', title: 'Revision checkpoint', startDate: '2026-04-15', type: 'reminder', description: 'Review weak topics' },
  { id: 's_check2', title: 'Revision checkpoint', startDate: '2026-05-01', type: 'reminder', description: 'Final topic review' },
];

export { uk2026TermDates };
