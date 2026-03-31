'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { teacherAgentService } from '@/lib/teacherAgentService';
import type { StudentAgentMessage, TeacherAgentScope } from '@/lib/teacherAgentTypes';

interface StudentNovaAgentPanelProps {
  scope: TeacherAgentScope;
}

export default function StudentNovaAgentPanel({ scope }: StudentNovaAgentPanelProps) {
  const thread = useMemo(() => teacherAgentService.getOrCreateThread(scope), [scope.orgId, scope.teacherId, scope.studentId]);
  const [messages, setMessages] = useState<StudentAgentMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages(teacherAgentService.listMessages(thread.id));
  }, [thread.id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;

    setInput('');
    const teacherMsg = teacherAgentService.appendMessage({ threadId: thread.id, role: 'teacher', content: text });
    setMessages((prev) => [...prev, teacherMsg]);

    setLoading(true);
    try {
      const res = await fetch('/api/teacher/student-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scope,
          threadId: thread.id,
          message: text,
          history: teacherAgentService.listMessages(thread.id).slice(-12),
        }),
      });
      const data = await res.json();
      const agentMsg = teacherAgentService.appendMessage({
        threadId: thread.id,
        role: 'agent',
        content: data.response || 'No response available.',
      });
      setMessages((prev) => [...prev, agentMsg]);
    } catch {
      const agentMsg = teacherAgentService.appendMessage({
        threadId: thread.id,
        role: 'agent',
        content: 'I could not respond right now. Please try again.',
      });
      setMessages((prev) => [...prev, agentMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-0 overflow-hidden border-white/45">
      <div className="px-4 py-3 border-b border-white/45 nova-frost-strip">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Student Nova Agent</div>
            <div className="text-sm font-semibold text-gray-900 truncate">Evidence-based teacher copilot</div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-900" aria-hidden="true">■</span>
            <span className="text-xs font-semibold text-gray-900">Nova Teacher</span>
          </div>
        </div>
      </div>

      <div className="h-[420px] overflow-y-auto px-4 py-3 space-y-3 bg-gray-50/55 backdrop-blur-[2px] custom-scrollbar">
        {messages.length === 0 && (
          <div className="text-sm text-gray-600">
            Ask about progress, weakest areas, what changed, or what to assign next.
          </div>
        )}

        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.role === 'teacher' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[90%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                m.role === 'teacher'
                  ? 'bg-gray-900 text-white'
                  : 'nova-frost-bubble text-gray-900'
              }`}
            >
              <div className="whitespace-pre-wrap">{m.content}</div>
              <div className={`mt-2 text-[11px] ${m.role === 'teacher' ? 'text-white/60' : 'text-gray-400'}`}>
                {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="nova-frost-bubble rounded-2xl px-4 py-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="px-4 py-3 border-t border-white/45 nova-frost-strip">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') send();
            }}
            placeholder="Ask Nova about this student…"
            className="flex-1 px-4 py-2.5 rounded-xl nova-frost-field focus:outline-none focus:ring-2 focus:ring-gray-900/30"
            disabled={loading}
          />
          <Button onClick={send} disabled={loading || !input.trim()} className="bg-gray-900 hover:bg-black">
            Ask
          </Button>
        </div>

        <div className="mt-2 flex flex-wrap gap-2">
          {[
            'How is this student doing overall?',
            'What are the weakest areas this week?',
            'What changed in the last 7 days?',
            'What should I assign next?',
          ].map((q) => (
            <button
              key={q}
              onClick={() => setInput(q)}
              className="text-xs px-2.5 py-1.5 rounded-lg bg-gray-50 border border-gray-200 hover:bg-gray-100 text-gray-700"
            >
              {q}
            </button>
          ))}
        </div>
      </div>
    </Card>
  );
}

