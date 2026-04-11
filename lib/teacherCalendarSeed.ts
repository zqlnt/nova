import type { CalendarEvent } from '@/lib/calendarTypes';

/** UK term bands — shared with org/student calendar defaults. */
export { uk2026TermDates } from '@/lib/calendarSeed';

/** @deprecated Live events come from `buildTeacherCalendarFromOrg` + Firestore org data. */
export const teacherCalendarEvents: CalendarEvent[] = [];
