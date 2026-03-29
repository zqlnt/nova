'use client';

import { useState } from 'react';
import Link from 'next/link';
import Layout from '@/components/Layout';
import Card from '@/components/Card';
import { orgService } from '@/lib/orgService';
import type { StaffTask, StaffTaskStatus } from '@/lib/orgTypes';

export default function OrgStaffTasksPage() {
  const org = orgService.getOrganisation();
  const students = orgService.listStudents();
  const families = orgService.listFamilies();
  const teachers = orgService.listTeachers();

  const [tasks, setTasks] = useState(() => orgService.listStaffTasks());
  const [editingId, setEditingId] = useState<string | null>(null);

  const refresh = () => setTasks([...orgService.listStaffTasks()]);

  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<StaffTaskStatus>('open');
  const [relatedStudentId, setRelatedStudentId] = useState('');
  const [relatedFamilyId, setRelatedFamilyId] = useState('');
  const [assigneeTeacherId, setAssigneeTeacherId] = useState('');

  const resetForm = () => {
    setTitle('');
    setDueDate('');
    setNotes('');
    setStatus('open');
    setRelatedStudentId('');
    setRelatedFamilyId('');
    setAssigneeTeacherId('');
    setEditingId(null);
  };

  const loadTask = (t: StaffTask) => {
    setEditingId(t.id);
    setTitle(t.title);
    setDueDate(t.dueDate ?? '');
    setNotes(t.notes ?? '');
    setStatus(t.status);
    setRelatedStudentId(t.relatedStudentId ?? '');
    setRelatedFamilyId(t.relatedFamilyId ?? '');
    setAssigneeTeacherId(t.assigneeTeacherId ?? '');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    const now = new Date().toISOString();
    const task: StaffTask = {
      id: editingId ?? `st_${Date.now()}`,
      orgId: org.id,
      title: title.trim(),
      dueDate: dueDate || undefined,
      status,
      notes: notes || undefined,
      relatedStudentId: relatedStudentId || undefined,
      relatedFamilyId: relatedFamilyId || undefined,
      assigneeTeacherId: assigneeTeacherId || undefined,
      createdAt: editingId ? tasks.find((x) => x.id === editingId)?.createdAt ?? now : now,
      updatedAt: now,
    };
    orgService.upsertStaffTask(task);
    refresh();
    resetForm();
  };

  const markDone = (id: string) => {
    const t = tasks.find((x) => x.id === id);
    if (!t) return;
    orgService.upsertStaffTask({
      ...t,
      status: 'done',
      updatedAt: new Date().toISOString(),
    });
    refresh();
  };

  const remove = (id: string) => {
    if (!confirm('Delete this task?')) return;
    orgService.deleteStaffTask(id);
    refresh();
    if (editingId === id) resetForm();
  };

  const orgTasks = tasks.filter((t) => t.orgId === org.id).sort((a, b) => (a.dueDate ?? '').localeCompare(b.dueDate ?? ''));

  return (
    <Layout role="org">
      <div className="space-y-6 max-w-5xl">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Staff tasks</h1>
          <p className="text-gray-600 mt-1">Operational reminders — persisted with your org data</p>
        </div>

        <Card className="p-5">
          <h2 className="text-lg font-bold text-gray-900 mb-4">{editingId ? 'Edit task' : 'New task'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
              <input value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full px-4 py-2 rounded-xl border border-gray-200" />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Due date</label>
                <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="w-full px-4 py-2 rounded-xl border border-gray-200" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select value={status} onChange={(e) => setStatus(e.target.value as StaffTaskStatus)} className="w-full px-4 py-2 rounded-xl border border-gray-200">
                  <option value="open">Open</option>
                  <option value="done">Done</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Related student</label>
                <select value={relatedStudentId} onChange={(e) => setRelatedStudentId(e.target.value)} className="w-full px-4 py-2 rounded-xl border border-gray-200">
                  <option value="">None</option>
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Related household</label>
                <select value={relatedFamilyId} onChange={(e) => setRelatedFamilyId(e.target.value)} className="w-full px-4 py-2 rounded-xl border border-gray-200">
                  <option value="">None</option>
                  {families.map((f) => (
                    <option key={f.id} value={f.id}>{f.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Assign to teacher</label>
              <select value={assigneeTeacherId} onChange={(e) => setAssigneeTeacherId(e.target.value)} className="w-full px-4 py-2 rounded-xl border border-gray-200">
                <option value="">Unassigned</option>
                {teachers.map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} className="w-full px-4 py-2 rounded-xl border border-gray-200" />
            </div>
            <div className="flex gap-3">
              <button type="submit" className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700">
                {editingId ? 'Update task' : 'Add task'}
              </button>
              {editingId && (
                <button type="button" onClick={resetForm} className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-medium">
                  Cancel edit
                </button>
              )}
            </div>
          </form>
        </Card>

        <Card className="p-5">
          <h2 className="text-lg font-bold text-gray-900 mb-4">All tasks</h2>
          <div className="space-y-2">
            {orgTasks.length === 0 ? (
              <p className="text-sm text-gray-500">No tasks yet.</p>
            ) : (
              orgTasks.map((t) => {
                const stu = t.relatedStudentId ? students.find((s) => s.id === t.relatedStudentId) : null;
                const fam = t.relatedFamilyId ? families.find((f) => f.id === t.relatedFamilyId) : null;
                return (
                  <div
                    key={t.id}
                    className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 rounded-xl border ${
                      t.status === 'done' ? 'bg-gray-50 border-gray-100 opacity-80' : 'bg-white border-gray-200'
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="font-medium text-gray-900">{t.title}</div>
                      <div className="text-xs text-gray-500 mt-1 flex flex-wrap gap-x-3 gap-y-1">
                        <span>Due: {t.dueDate ?? '—'}</span>
                        <span className="capitalize">Status: {t.status}</span>
                        {stu && <span>Student: {stu.name}</span>}
                        {fam && <span>Household: {fam.name}</span>}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 shrink-0">
                      {t.status === 'open' && (
                        <button type="button" onClick={() => markDone(t.id)} className="px-3 py-1.5 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">
                          Mark done
                        </button>
                      )}
                      <button type="button" onClick={() => loadTask(t)} className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">
                        Edit
                      </button>
                      <button type="button" onClick={() => remove(t.id)} className="px-3 py-1.5 text-sm text-rose-600 border border-rose-200 rounded-lg hover:bg-rose-50">
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </Card>

        <p className="text-sm text-gray-500">
          <Link href="/org/calendar" className="text-indigo-600 hover:underline">Calendar</Link>
          {' · '}
          <Link href="/org/dashboard" className="text-indigo-600 hover:underline">Dashboard</Link>
        </p>
      </div>
    </Layout>
  );
}
