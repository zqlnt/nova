'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Layout from '@/components/Layout';
import Card from '@/components/Card';
import { orgService } from '@/lib/orgService';
import { formatPence, FLAG_LABELS } from '@/lib/orgOperations';
import type { NoteType, RiskLevel } from '@/lib/orgTypes';

export default function OrgStudentProfilePage() {
  const params = useParams();
  const id = params?.id as string | undefined;
  const org = orgService.getOrganisation();
  const [noteRev, setNoteRev] = useState(0);
  const [noteText, setNoteText] = useState('');
  const [noteType, setNoteType] = useState<NoteType>('follow_up');
  const [noteRisk, setNoteRisk] = useState<RiskLevel>('low');

  const student = useMemo(() => {
    if (!id) return null;
    return orgService.listStudents().find((s) => s.id === id) ?? null;
  }, [id, noteRev]);

  const notes = useMemo(() => {
    if (!id || !student) return [];
    return orgService.listNotes().filter(
      (n) =>
        n.studentId === id ||
        (Boolean(student.familyId) && n.familyId === student.familyId)
    );
  }, [id, student, noteRev]);

  const household = student?.familyId ? orgService.getFamily(student.familyId) : undefined;

  if (!id) {
    return (
      <Layout role="org">
        <div className="py-12 text-center">
          <p className="text-gray-500">Invalid student ID</p>
          <Link href="/org/students" className="text-indigo-600 hover:underline mt-2 inline-block">Back to Students</Link>
        </div>
      </Layout>
    );
  }

  if (!student) {
    return (
      <Layout role="org">
        <div className="py-12 text-center">
          <p className="text-gray-500">Student not found</p>
          <Link href="/org/students" className="text-indigo-600 hover:underline mt-2 inline-block">Back to Students</Link>
        </div>
      </Layout>
    );
  }

  const record = orgService.getOrgStudentRecord(id);
  const enrollments = orgService.listEnrollments().filter((e) => e.studentId === id);
  const classes = orgService.listClasses();
  const teachers = orgService.listTeachers();
  const attendance = orgService.listAttendance().filter((a) => a.studentId === id);
  const payments = orgService.listPayments().filter((p) => p.studentId === id);
  const invoices = orgService.listInvoices().filter((i) => i.studentId === id);

  const cls = enrollments[0] ? classes.find((c) => c.id === enrollments[0].classId) : undefined;
  const teacher = cls ? teachers.find((t) => t.id === cls!.teacherId) : undefined;
  const presentCount = attendance.filter((a) => a.status === 'present' || a.status === 'late').length;
  const totalSessions = attendance.length;
  const attendanceRate = totalSessions > 0 ? Math.round((presentCount / totalSessions) * 100) : undefined;

  const addNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteText.trim()) return;
    orgService.appendNote({
      id: `note_${Date.now()}`,
      orgId: org.id,
      studentId: id,
      authorOrgAdminId: 'admin_001',
      createdAt: new Date().toISOString(),
      type: noteType,
      risk: noteRisk,
      text: noteText.trim(),
    });
    setNoteText('');
    setNoteRev((r) => r + 1);
  };

  return (
    <Layout role="org">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Link href="/org/students" className="text-sm text-indigo-600 hover:underline">← Back to Students</Link>
              <Link href={`/org/students?edit=${student.id}`} className="text-sm text-indigo-600 hover:underline font-medium">
                Edit student
              </Link>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">{student.name}</h1>
            <p className="text-gray-600 mt-1">
              Year {student.yearGroup} • {cls?.name ?? 'No class'} • {teacher?.name ?? '—'}
            </p>
          </div>
          {record?.flaggedIssues && record.flaggedIssues.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {record.flaggedIssues.map((f) => (
                <span key={f} className="px-3 py-1 rounded-full text-sm bg-amber-100 text-amber-800 font-medium">
                  {FLAG_LABELS[f] ?? f}
                </span>
              ))}
            </div>
          )}
        </div>

        {household && (
          <Card className="p-4 bg-violet-50/80 border-violet-100">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <h2 className="text-sm font-semibold text-violet-900">Household</h2>
                <p className="text-violet-800 font-medium">{household.name}</p>
                {household.nextUcPaymentDate && (
                  <p className="text-xs text-violet-700 mt-1">UC payment: {household.nextUcPaymentDate}</p>
                )}
              </div>
              <Link
                href={`/org/families/${household.id}`}
                className="text-sm font-medium text-indigo-600 hover:underline shrink-0"
              >
                View household →
              </Link>
            </div>
          </Card>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="text-sm text-gray-500">Attendance</div>
            <div className="text-xl font-bold text-gray-900">{attendanceRate ?? '—'}%</div>
            <div className="text-xs text-gray-400">{presentCount}/{totalSessions} sessions</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-gray-500">Hours attended</div>
            <div className="text-xl font-bold text-gray-900">{record?.hoursCompleted ?? '—'}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-gray-500">Funding</div>
            <div className={`text-xl font-bold ${record?.paymentFundingType === 'private' ? 'text-violet-600' : 'text-indigo-600'}`}>
              {record?.paymentFundingType === 'universal_credit' ? 'Universal Credit' : record?.paymentFundingType ?? '—'}
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-gray-500">Amount owed</div>
            <div className={`text-xl font-bold ${(record?.amountOwedPence ?? 0) > 0 ? 'text-rose-600' : 'text-gray-900'}`}>
              {(record?.amountOwedPence ?? 0) > 0 ? formatPence(record!.amountOwedPence!) : '£0'}
            </div>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-5">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Attendance</h2>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Rate</span>
                <span className="font-semibold">{attendanceRate ?? '—'}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Sessions attended</span>
                <span className="font-semibold">{presentCount} / {totalSessions}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Hours completed</span>
                <span className="font-semibold">{record?.hoursCompleted ?? '—'}</span>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Payments & funding</h2>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Amount owed</span>
                <span className={`font-semibold ${(record?.amountOwedPence ?? 0) > 0 ? 'text-rose-600' : ''}`}>
                  {(record?.amountOwedPence ?? 0) > 0 ? formatPence(record!.amountOwedPence!) : '£0'}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Funding type</span>
                <span className="font-semibold">{record?.paymentFundingType ?? '—'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Payments received</span>
                <span className="font-semibold">{payments.filter((p) => p.status === 'succeeded').length}</span>
              </div>
            </div>
          </Card>
        </div>

        {record?.flaggedIssues && record.flaggedIssues.length > 0 && (
          <Card className="p-5">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Flags & concerns</h2>
            <div className="flex flex-wrap gap-2">
              {record.flaggedIssues.map((f) => (
                <span key={f} className="px-3 py-1.5 rounded-lg bg-amber-100 text-amber-800 font-medium">
                  {FLAG_LABELS[f] ?? f}
                </span>
              ))}
            </div>
          </Card>
        )}

        <Card className="p-5">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Parent / guardian contacts</h2>
          <div className="space-y-3">
            <div>
              <div className="text-sm text-gray-500">Name</div>
              <div className="font-medium text-gray-900">{record?.parentGuardianName ?? '—'}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Phone</div>
              <div className="font-medium text-gray-900">{record?.parentGuardianPhone ?? '—'}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Email</div>
              <div className="font-medium text-gray-900">{record?.parentGuardianEmail ?? '—'}</div>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Notes & follow-ups</h2>
          <p className="text-xs text-gray-500 mb-3">
            Includes notes for this child and household-level notes for their family.
          </p>
          <form onSubmit={addNote} className="space-y-3 mb-6 pb-6 border-b border-gray-100">
            <div className="grid md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Type</label>
                <select value={noteType} onChange={(e) => setNoteType(e.target.value as NoteType)} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm">
                  <option value="note">Note</option>
                  <option value="parent_call">Parent call</option>
                  <option value="intervention">Intervention</option>
                  <option value="follow_up">Follow-up</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Risk</label>
                <select value={noteRisk} onChange={(e) => setNoteRisk(e.target.value as RiskLevel)} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm">
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Add a follow-up note for this student…"
              rows={3}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 text-sm"
            />
            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">
              Save note
            </button>
          </form>
          {notes.length === 0 ? (
            <p className="text-sm text-gray-500">No notes yet.</p>
          ) : (
            <div className="space-y-3">
              {[...notes].reverse().map((n) => (
                <div key={n.id} className="py-3 px-4 rounded-xl bg-gray-50 border border-gray-100">
                  <div className="flex items-center justify-between mb-1 flex-wrap gap-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      n.risk === 'high' ? 'bg-rose-100 text-rose-800' :
                      n.risk === 'medium' ? 'bg-amber-100 text-amber-800' : 'bg-gray-200 text-gray-600'
                    }`}>
                      {n.type} • {n.risk ?? 'low'}
                    </span>
                    <span className="text-xs text-gray-400">{new Date(n.createdAt).toLocaleString()}</span>
                  </div>
                  {n.familyId && !n.studentId && (
                    <p className="text-[10px] text-violet-600 mb-1">Household note</p>
                  )}
                  <p className="text-sm text-gray-700">{n.text}</p>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card className="p-5">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Class & teacher</h2>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Class</span>
              <span className="font-medium">{cls?.name ?? '—'}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Teacher</span>
              <span className="font-medium">{teacher?.name ?? '—'}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subjects</span>
              <span className="font-medium">{cls?.subjects?.join(', ') ?? cls?.subject ?? '—'}</span>
            </div>
          </div>
        </Card>

        {record?.adminNotes && (
          <Card className="p-5">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Admin notes</h2>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{record.adminNotes}</p>
          </Card>
        )}

        <Card className="p-5 bg-gray-50/80">
          <h2 className="text-lg font-bold text-gray-900 mb-2">Academic summary</h2>
          <p className="text-sm text-gray-500 mb-2">For curriculum progress and mastery, see Nova Teacher.</p>
          <Link href={`/teacher/students/${student.id}`} className="text-sm text-indigo-600 hover:underline">
            View in Nova Teacher →
          </Link>
        </Card>
      </div>
    </Layout>
  );
}
