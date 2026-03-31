'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import Layout from '@/components/Layout';
import Card from '@/components/Card';
import { orgService } from '@/lib/orgService';
import type { Family, NoteType, RiskLevel } from '@/lib/orgTypes';

export default function OrgFamilyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string | undefined;
  const org = orgService.getOrganisation();

  const familyRecord = id ? orgService.getFamily(id) : null;
  const [students, setStudents] = useState(() => orgService.listStudents());
  const [noteRev, setNoteRev] = useState(0);
  const linkedChildren = useMemo(
    () => (id ? students.filter((s) => s.familyId === id) : []),
    [students, id]
  );

  const familyNotes = useMemo(() => {
    if (!id) return [];
    return orgService.listNotes().filter((n) => n.familyId === id);
  }, [id, noteRev]);

  const [name, setName] = useState('');
  const [primaryContactName, setPrimaryContactName] = useState('');
  const [primaryContactPhone, setPrimaryContactPhone] = useState('');
  const [primaryContactEmail, setPrimaryContactEmail] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [postcode, setPostcode] = useState('');
  const [nextUcPaymentDate, setNextUcPaymentDate] = useState('');
  const [nextJournalCheckDate, setNextJournalCheckDate] = useState('');
  const [universalCreditActive, setUniversalCreditActive] = useState(false);
  const [ucNotes, setUcNotes] = useState('');

  useEffect(() => {
    const f = id ? orgService.getFamily(id) : null;
    if (!f) return;
    setName(f.name);
    setPrimaryContactName(f.primaryContactName ?? '');
    setPrimaryContactPhone(f.primaryContactPhone ?? '');
    setPrimaryContactEmail(f.primaryContactEmail ?? '');
    setAddressLine1(f.addressLine1 ?? '');
    setAddressLine2(f.addressLine2 ?? '');
    setPostcode(f.postcode ?? '');
    setNextUcPaymentDate(f.nextUcPaymentDate ?? '');
    setNextJournalCheckDate(f.nextJournalCheckDate ?? '');
    setUniversalCreditActive(!!f.universalCreditActive);
    setUcNotes(f.ucNotes ?? '');
  }, [id]);

  const [noteText, setNoteText] = useState('');
  const [noteType, setNoteType] = useState<NoteType>('follow_up');
  const [noteRisk, setNoteRisk] = useState<RiskLevel>('low');

  if (!id) {
    return (
      <Layout role="org">
        <p className="text-gray-500">Invalid family</p>
      </Layout>
    );
  }

  if (!familyRecord) {
    return (
      <Layout role="org">
        <div className="py-12 text-center">
          <p className="text-gray-500">Household not found</p>
          <Link href="/org/families" className="text-indigo-600 hover:underline mt-2 inline-block">
            Back to families
          </Link>
        </div>
      </Layout>
    );
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date().toISOString();
    const updated: Family = {
      ...familyRecord,
      name: name.trim(),
      primaryContactName: primaryContactName || undefined,
      primaryContactPhone: primaryContactPhone || undefined,
      primaryContactEmail: primaryContactEmail || undefined,
      addressLine1: addressLine1 || undefined,
      addressLine2: addressLine2 || undefined,
      postcode: postcode || undefined,
      nextUcPaymentDate: nextUcPaymentDate || undefined,
      nextJournalCheckDate: nextJournalCheckDate || undefined,
      universalCreditActive,
      ucNotes: ucNotes || undefined,
      updatedAt: now,
    };
    orgService.upsertFamily(updated);
  };

  const handleDelete = () => {
    if (!confirm('Delete this household? Children will be unlinked from it.')) return;
    const nextStudents = students.map((s) => (s.familyId === id ? { ...s, familyId: undefined } : s));
    orgService.saveStudents(nextStudents);
    setStudents(nextStudents);
    orgService.deleteFamily(id);
    router.push('/org/families');
  };

  const appendFamilyNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteText.trim()) return;
    orgService.appendNote({
      id: `note_${Date.now()}`,
      orgId: org.id,
      familyId: id,
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
      <div className="space-y-6 max-w-4xl">
        <div>
          <Link href="/org/families" className="text-sm text-indigo-600 hover:underline">
            ← Back to families
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mt-2">{familyRecord.name}</h1>
          <p className="text-gray-600 text-sm mt-1">Edit household, UC tracking, and follow-up notes</p>
        </div>

        <Card className="p-5">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Household details</h2>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Household name *</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-2 rounded-xl border border-white/45"
              />
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Primary contact name</label>
                <input value={primaryContactName} onChange={(e) => setPrimaryContactName(e.target.value)} className="w-full px-4 py-2 rounded-xl border border-white/45" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input value={primaryContactPhone} onChange={(e) => setPrimaryContactPhone(e.target.value)} className="w-full px-4 py-2 rounded-xl border border-white/45" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" value={primaryContactEmail} onChange={(e) => setPrimaryContactEmail(e.target.value)} className="w-full px-4 py-2 rounded-xl border border-white/45" />
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Address line 1</label>
                <input value={addressLine1} onChange={(e) => setAddressLine1(e.target.value)} className="w-full px-4 py-2 rounded-xl border border-white/45" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Postcode</label>
                <input value={postcode} onChange={(e) => setPostcode(e.target.value)} className="w-full px-4 py-2 rounded-xl border border-white/45" />
              </div>
              <div className="md:col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Address line 2</label>
                <input value={addressLine2} onChange={(e) => setAddressLine2(e.target.value)} className="w-full px-4 py-2 rounded-xl border border-white/45" />
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="text-sm font-semibold text-gray-800 mb-3">Universal Credit</h3>
              <label className="flex items-center gap-2 mb-3">
                <input type="checkbox" checked={universalCreditActive} onChange={(e) => setUniversalCreditActive(e.target.checked)} />
                <span className="text-sm text-gray-700">UC childcare / household payments active</span>
              </label>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Next UC payment date</label>
                  <input type="date" value={nextUcPaymentDate} onChange={(e) => setNextUcPaymentDate(e.target.value)} className="w-full px-4 py-2 rounded-xl border border-white/45" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Next journal check date</label>
                  <input type="date" value={nextJournalCheckDate} onChange={(e) => setNextJournalCheckDate(e.target.value)} className="w-full px-4 py-2 rounded-xl border border-white/45" />
                </div>
              </div>
              <div className="mt-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">UC notes</label>
                <textarea value={ucNotes} onChange={(e) => setUcNotes(e.target.value)} rows={2} className="w-full px-4 py-2 rounded-xl border border-white/45" />
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <button type="submit" className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700">
                Save changes
              </button>
              <button type="button" onClick={handleDelete} className="px-6 py-2.5 bg-rose-50 text-rose-700 border border-rose-200 rounded-xl font-medium hover:bg-rose-100">
                Delete household
              </button>
            </div>
          </form>
        </Card>

        <Card className="p-5">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Linked children</h2>
          {linkedChildren.length === 0 ? (
            <p className="text-sm text-gray-500">No students linked. Assign a household from the student record.</p>
          ) : (
            <ul className="space-y-2">
              {linkedChildren.map((s) => (
                <li key={s.id}>
                  <Link href={`/org/students/${s.id}`} className="text-indigo-600 font-medium hover:underline">
                    {s.name}
                  </Link>
                  <span className="text-gray-500 text-sm ml-2">Year {s.yearGroup}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card className="p-5">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Household follow-up notes</h2>
          <form onSubmit={appendFamilyNote} className="space-y-3 mb-6 pb-6 border-b border-gray-100">
            <div className="grid md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Type</label>
                <select value={noteType} onChange={(e) => setNoteType(e.target.value as NoteType)} className="w-full px-3 py-2 rounded-lg border border-white/45 text-sm">
                  <option value="note">Note</option>
                  <option value="parent_call">Parent call</option>
                  <option value="intervention">Intervention</option>
                  <option value="follow_up">Follow-up</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Risk</label>
                <select value={noteRisk} onChange={(e) => setNoteRisk(e.target.value as RiskLevel)} className="w-full px-3 py-2 rounded-lg border border-white/45 text-sm">
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Follow-up detail…"
              rows={3}
              className="w-full px-4 py-2 rounded-xl border border-white/45 text-sm"
            />
            <button type="submit" className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800">
              Add note
            </button>
          </form>
          {familyNotes.length === 0 ? (
            <p className="text-sm text-gray-500">No household-level notes yet.</p>
          ) : (
            <div className="space-y-3">
              {[...familyNotes].reverse().map((n) => (
                <div key={n.id} className="py-3 px-4 rounded-xl bg-gray-50 border border-gray-100">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-200 text-gray-700">
                      {n.type} • {n.risk ?? 'low'}
                    </span>
                    <span className="text-xs text-gray-400">{new Date(n.createdAt).toLocaleString()}</span>
                  </div>
                  <p className="text-sm text-gray-700">{n.text}</p>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </Layout>
  );
}
