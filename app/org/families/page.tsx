'use client';

import { useState } from 'react';
import Link from 'next/link';
import Layout from '@/components/Layout';
import Card from '@/components/Card';
import { orgService } from '@/lib/orgService';
import type { Family } from '@/lib/orgTypes';

export default function OrgFamiliesPage() {
  const org = orgService.getOrganisation();
  const [families, setFamilies] = useState(() => orgService.listFamilies());
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState('');

  const refresh = () => setFamilies([...orgService.listFamilies()]);

  const childCount = (familyId: string) => orgService.listStudents().filter((s) => s.familyId === familyId).length;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    const now = new Date().toISOString();
    const f: Family = {
      id: `fam_${Date.now()}`,
      orgId: org.id,
      name: newName.trim(),
      createdAt: now,
      updatedAt: now,
    };
    orgService.upsertFamily(f);
    setNewName('');
    setShowAdd(false);
    refresh();
  };

  return (
    <Layout role="org">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Families</h1>
            <p className="text-gray-600 mt-1">Households, contacts, Universal Credit dates, linked children</p>
          </div>
          <button
            type="button"
            onClick={() => setShowAdd((v) => !v)}
            className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700"
          >
            {showAdd ? 'Cancel' : '+ Add household'}
          </button>
        </div>

        {showAdd && (
          <Card className="p-5">
            <h2 className="text-lg font-bold text-gray-900 mb-4">New household</h2>
            <form onSubmit={handleCreate} className="flex flex-col sm:flex-row gap-3 sm:items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Household name *</label>
                <input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Smith household"
                  required
                  className="w-full px-4 py-2 rounded-xl border border-gray-200"
                />
              </div>
              <button type="submit" className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700">
                Create
              </button>
            </form>
          </Card>
        )}

        <div className="grid gap-4">
          {families.length === 0 ? (
            <Card className="p-8 text-center text-gray-500">No households yet. Add one to link siblings and track UC.</Card>
          ) : (
            families.map((f) => (
              <Link key={f.id} href={`/org/families/${f.id}`}>
                <Card className="p-5 hover:border-indigo-200 hover:shadow-md transition-all cursor-pointer">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">{f.name}</h2>
                      <p className="text-sm text-gray-600 mt-1">
                        {f.primaryContactName || 'No primary contact'}
                        {f.primaryContactPhone ? ` · ${f.primaryContactPhone}` : ''}
                        {f.primaryContactEmail ? ` · ${f.primaryContactEmail}` : ''}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                          {childCount(f.id)} {childCount(f.id) === 1 ? 'child' : 'children'}
                        </span>
                        {f.universalCreditActive && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-violet-100 text-violet-800">UC active</span>
                        )}
                        {f.nextUcPaymentDate && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-100">
                            UC payment: {f.nextUcPaymentDate}
                          </span>
                        )}
                        {f.nextJournalCheckDate && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-orange-50 text-orange-800 border border-orange-100">
                            Journal check: {f.nextJournalCheckDate}
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="text-sm text-indigo-600 font-medium">Edit</span>
                  </div>
                </Card>
              </Link>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
}
