'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/Card';
import Button from '@/components/Button';

type Workspace = 'student' | 'teacher' | 'org';

const STORAGE_KEY = 'nova_workspace_v1';

export default function WorkspaceOnboarding() {
  const router = useRouter();
  const [workspace, setWorkspace] = useState<Workspace>('student');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const saved = localStorage.getItem(STORAGE_KEY) as Workspace | null;
    if (saved) setWorkspace(saved);
  }, []);

  const continueToWorkspace = (w: Workspace) => {
    if (typeof window !== 'undefined') localStorage.setItem(STORAGE_KEY, w);

    if (w === 'student') router.push('/student/onboarding');
    if (w === 'teacher') router.push('/teacher/dashboard');
    if (w === 'org') router.push('/org/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg space-y-4">
        <Card className="text-center">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Choose workspace</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Nova</h1>
          <p className="text-gray-600 mb-6">
            Select the workspace you are using. Students will only access Nova Student.
          </p>

          <div className="grid gap-3">
            <button
              onClick={() => setWorkspace('student')}
              className={`w-full px-4 py-4 rounded-2xl border text-left transition-colors ${
                workspace === 'student'
                  ? 'border-gray-900 bg-gray-900 text-white'
                  : 'border-gray-200 bg-white hover:bg-gray-50 text-gray-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-lg font-semibold" aria-hidden="true">●</span>
                <div className="flex-1">
                  <div className="font-semibold">Nova Student</div>
                  <div className={`text-sm ${workspace === 'student' ? 'text-white/70' : 'text-gray-500'}`}>
                    Learn → Practice → Prove, mastery, XP, curriculum-locked chat
                  </div>
                </div>
              </div>
            </button>

            <button
              onClick={() => setWorkspace('teacher')}
              className={`w-full px-4 py-4 rounded-2xl border text-left transition-colors ${
                workspace === 'teacher'
                  ? 'border-gray-900 bg-gray-900 text-white'
                  : 'border-gray-200 bg-white hover:bg-gray-50 text-gray-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-lg font-semibold" aria-hidden="true">■</span>
                <div className="flex-1">
                  <div className="font-semibold">Nova Teacher</div>
                  <div className={`text-sm ${workspace === 'teacher' ? 'text-white/70' : 'text-gray-500'}`}>
                    Classes, student profiles, Student Nova Agent
                  </div>
                </div>
              </div>
            </button>

            <button
              onClick={() => setWorkspace('org')}
              className={`w-full px-4 py-4 rounded-2xl border text-left transition-colors ${
                workspace === 'org'
                  ? 'border-gray-900 bg-gray-900 text-white'
                  : 'border-gray-200 bg-white hover:bg-gray-50 text-gray-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-lg font-semibold" aria-hidden="true">▲</span>
                <div className="flex-1">
                  <div className="font-semibold">Nova Org</div>
                  <div className={`text-sm ${workspace === 'org' ? 'text-white/70' : 'text-gray-500'}`}>
                    Organisation ops: teachers, attendance, billing, analytics
                  </div>
                </div>
              </div>
            </button>
          </div>

          <div className="mt-6">
            <Button onClick={() => continueToWorkspace(workspace)} className="w-full bg-gray-900 hover:bg-black">
              Continue →
            </Button>
          </div>
        </Card>

        <div className="text-center text-xs text-gray-500">
          Mode labels inside the app are fixed per workspace.
        </div>
      </div>
    </div>
  );
}

