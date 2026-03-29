export type CalendarEventType =
  | 'term' | 'holiday' | 'half_term' | 'class' | 'lesson' | 'exam' | 'revision' | 'trip' | 'event' | 'task' | 'reminder'
  | 'attendance_session' | 'payment_due' | 'payment_received' | 'admin_reminder'
  | 'uc_payment' | 'uc_journal_check' | 'staff_task_due';

export interface CalendarEvent {
  id: string;
  title: string;
  startDate: string; // YYYY-MM-DD
  endDate?: string; // YYYY-MM-DD
  type: CalendarEventType;
  description?: string;
  location?: string;
  metadata?: Record<string, unknown>;
}

export interface OrgCalendarEvent extends CalendarEvent {
  orgId: string;
  classId?: string;
  studentId?: string;
  costPence?: number;
  costBreakdown?: { item: string; amountPence: number }[];
  attendanceIds?: string[];
  paymentId?: string;
  invoiceId?: string;
}

export interface TermDate {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  type: 'term' | 'half_term' | 'holiday';
}
