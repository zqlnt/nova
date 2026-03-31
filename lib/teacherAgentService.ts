'use client';

import { masteryService, curriculumService, pointsService } from '@/lib/services';
import { orgService } from '@/lib/orgService';
import type {
  StudentAgentMessage,
  StudentAgentThread,
  StudentContextPacket,
  TeacherAgentScope,
} from '@/lib/teacherAgentTypes';

const STORAGE_KEYS = {
  THREADS: 'nova_teacher_agent_threads_v1',
  MESSAGES: 'nova_teacher_agent_messages_v1',
  NOTES: 'nova_teacher_student_notes_v1',
};

function nowIso() {
  return new Date().toISOString();
}

function uid(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export const teacherAgentService = {
  getOrCreateThread(scope: TeacherAgentScope): StudentAgentThread {
    const threads = teacherAgentService.listThreads();
    const existing = threads.find(
      (t) =>
        t.scope.orgId === scope.orgId &&
        t.scope.teacherId === scope.teacherId &&
        t.scope.studentId === scope.studentId
    );
    if (existing) return existing;

    const thread: StudentAgentThread = {
      id: uid('thread'),
      scope,
      createdAt: nowIso(),
      lastMessageAt: null,
    };
    teacherAgentService.saveThread(thread);
    return thread;
  },

  listThreads(): StudentAgentThread[] {
    if (typeof window === 'undefined') return [];
    const raw = localStorage.getItem(STORAGE_KEYS.THREADS);
    return raw ? JSON.parse(raw) : [];
  },

  saveThread(thread: StudentAgentThread) {
    if (typeof window === 'undefined') return;
    const threads = teacherAgentService.listThreads();
    const idx = threads.findIndex((t) => t.id === thread.id);
    if (idx >= 0) threads[idx] = thread;
    else threads.push(thread);
    localStorage.setItem(STORAGE_KEYS.THREADS, JSON.stringify(threads));
  },

  listMessages(threadId: string): StudentAgentMessage[] {
    if (typeof window === 'undefined') return [];
    const raw = localStorage.getItem(STORAGE_KEYS.MESSAGES);
    const all: StudentAgentMessage[] = raw ? JSON.parse(raw) : [];
    return all.filter((m) => m.threadId === threadId).sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  },

  appendMessage(message: Omit<StudentAgentMessage, 'id' | 'createdAt'>): StudentAgentMessage {
    const full: StudentAgentMessage = { ...message, id: uid('msg'), createdAt: nowIso() };
    if (typeof window !== 'undefined') {
      const raw = localStorage.getItem(STORAGE_KEYS.MESSAGES);
      const all: StudentAgentMessage[] = raw ? JSON.parse(raw) : [];
      all.push(full);
      localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(all.slice(-2000)));
    }
    return full;
  },

  buildStudentContextPacket(scope: TeacherAgentScope): StudentContextPacket {
    const orgStudent = orgService.listStudents().find((s) => s.id === scope.studentId);
    const yearGroup = (orgStudent?.yearGroup ?? 10) as 7 | 8 | 9 | 10 | 11;
    const mathsTier = (orgStudent?.mathsTier ?? 'Higher') as 'Foundation' | 'Higher';

    // Curriculum-linked: Maths strands (AQA/Edexcel)
    const byStrandMaths = masteryService.getStrandMastery('Mathematics').map((s) => ({
      subject: 'Mathematics',
      strand: String(s.strand),
      secure: s.secure,
      developing: s.developing,
      notStarted: s.notStarted,
      nextObjectiveTitle: s.nextObjective?.title ?? null,
    }));

    // Curriculum-linked: English Language + Literature strands
    const byStrandEnglish = masteryService.getStrandMastery('English').map((s) => ({
      subject: 'English',
      strand: String(s.strand),
      secure: s.secure,
      developing: s.developing,
      notStarted: s.notStarted,
      nextObjectiveTitle: s.nextObjective?.title ?? null,
    }));

    const byStrandEnglishLit = masteryService.getStrandMastery('English Literature').map((s) => ({
      subject: 'English Literature',
      strand: String(s.strand),
      secure: s.secure,
      developing: s.developing,
      notStarted: s.notStarted,
      nextObjectiveTitle: s.nextObjective?.title ?? null,
    }));

    const weakestMaths = masteryService.getLowestMasteryObjectives('Mathematics', 4).map((o) => ({
      subject: 'Mathematics',
      strand: String(o.strand),
      title: o.title,
      status: masteryService.getMasteryForObjective(o.id)?.status ?? 'not_started',
    }));

    const weakestEnglish = masteryService.getLowestMasteryObjectives('English', 4).map((o) => ({
      subject: o.subject,
      strand: String(o.strand),
      title: o.title,
      status: masteryService.getMasteryForObjective(o.id)?.status ?? 'not_started',
    }));

    const nextMaths = masteryService.getNextRecommendedObjective('Mathematics', yearGroup, mathsTier);
    const nextEnglish = masteryService.getNextRecommendedObjective('English', yearGroup);

    const weekly = pointsService.getWeeklyActivity();
    const minutesThisWeek = weekly.reduce((sum, d) => sum + d.minutes, 0);
    const streakDays = 7;
    const lastActiveLabel = orgStudent ? 'See Nova org attendance' : '—';

    const recommendations: StudentContextPacket['recommendations'] = [
      nextMaths && {
        type: 'assign_practice' as const,
        title: `Assign practice: ${nextMaths.title}`,
        rationale: `Next best Maths objective in curriculum. Strand: ${nextMaths.strand}.`,
      },
      nextEnglish && {
        type: 'assign_practice' as const,
        title: `Assign practice: ${nextEnglish.title}`,
        rationale: `Next best English objective. Strand: ${nextEnglish.strand}.`,
      },
      {
        type: 're-teach' as const,
        title: 'Re-teach one core method with a worked example',
        rationale: 'For developing objectives, a short re-teach improves confidence and reduces careless errors.',
      },
      {
        type: 'engagement' as const,
        title: 'Set a minimum weekly routine',
        rationale: 'Consistency is usually the fastest lever for improvement.',
      },
    ].filter(Boolean) as StudentContextPacket['recommendations'];

    return {
      student: {
        id: scope.studentId,
        name: orgStudent?.name ?? 'Student',
        yearGroup,
        subjects: orgStudent?.subjects ?? ['Mathematics', 'English', 'Science'],
        mathsTier,
      },
      mastery: {
        byStrand: [...byStrandMaths, ...byStrandEnglish, ...byStrandEnglishLit],
        weakestObjectives: [...weakestMaths, ...weakestEnglish],
      },
      engagement: {
        lastActiveLabel,
        streakDays,
        minutesThisWeek,
      },
      performance: {
        accuracy7d: null,
        accuracy30d: null,
        trend: 'unknown' as const,
      },
      recommendations,
      evidence: [
        { label: 'Last active', value: lastActiveLabel },
        { label: 'Minutes this week', value: String(minutesThisWeek) },
        { label: 'Weak objectives', value: String(weakestMaths.length + weakestEnglish.length) },
        { label: 'Exam pathway', value: 'AQA / Pearson Edexcel' },
        { label: 'Maths tier', value: mathsTier },
      ],
    };
  },
};

