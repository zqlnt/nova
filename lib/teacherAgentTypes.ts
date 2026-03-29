export type TeacherRiskLevel = 'low' | 'medium' | 'high';

export interface TeacherAgentScope {
  orgId: string;
  teacherId: string;
  studentId: string;
}

export interface StudentAgentThread {
  id: string;
  scope: TeacherAgentScope;
  createdAt: string;
  lastMessageAt: string | null;
}

export interface StudentAgentMessage {
  id: string;
  threadId: string;
  role: 'teacher' | 'agent';
  content: string;
  createdAt: string;
}

export interface StudentContextPacket {
  student: {
    id: string;
    name: string;
    yearGroup: number;
    subjects: string[];
    mathsTier?: string;
  };
  mastery: {
    byStrand: Array<{
      subject: string;
      strand: string;
      secure: number;
      developing: number;
      notStarted: number;
      nextObjectiveTitle?: string | null;
    }>;
    weakestObjectives: Array<{
      subject: string;
      strand: string;
      title: string;
      status: 'not_started' | 'developing' | 'secure';
    }>;
  };
  engagement: {
    lastActiveLabel: string;
    streakDays: number;
    minutesThisWeek: number;
  };
  performance: {
    accuracy7d: number | null;
    accuracy30d: number | null;
    trend: 'up' | 'down' | 'flat' | 'unknown';
  };
  recommendations: Array<{
    type: 'assign_practice' | 're-teach' | 'confidence' | 'engagement';
    title: string;
    rationale: string;
  }>;
  evidence: Array<{
    label: string;
    value: string;
  }>;
}

