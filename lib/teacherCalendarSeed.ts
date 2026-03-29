import type { CalendarEvent } from '@/lib/calendarTypes';
import { uk2026TermDates } from '@/lib/calendarSeed';

export const teacherCalendarEvents: CalendarEvent[] = [
  { id: 't_lesson1', title: "Zain's Class - Algebra", startDate: '2026-03-17', type: 'lesson', description: 'Quadratic equations' },
  { id: 't_lesson2', title: "Zain's Class - Number", startDate: '2026-03-19', type: 'lesson', description: 'Fractions and decimals' },
  { id: 't_lesson3', title: "Zain's Class - Geometry", startDate: '2026-03-21', type: 'lesson', description: 'Area and perimeter' },
  { id: 't_assess', title: 'Assessment checkpoint', startDate: '2026-03-25', type: 'task', description: 'Class progress assessment' },
  { id: 't_rev', title: 'Revision window', startDate: '2026-04-01', endDate: '2026-04-07', type: 'revision', description: 'Mock exam revision focus' },
  { id: 't_interv', title: 'Intervention reminder', startDate: '2026-03-20', type: 'reminder', description: 'Follow up with at-risk students' },
  { id: 't_plan', title: 'Lesson planning', startDate: '2026-03-22', type: 'task', description: 'Plan next week lessons' },
  { id: 't_mock', title: 'Mock Exams Week', startDate: '2026-03-17', endDate: '2026-03-21', type: 'exam', description: 'GCSE mock examinations' },
];

export { uk2026TermDates };
