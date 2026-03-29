'use client';

import { useState } from 'react';
import Layout from '@/components/Layout';
import Card from '@/components/Card';
import { orgService } from '@/lib/orgService';
import { formatPence } from '@/lib/orgOperations';
import type { Expense } from '@/lib/orgTypes';

const DEFAULT_CATEGORIES = ['Rent', 'Materials', 'Training', 'Utilities', 'Insurance', 'Staff', 'Other'];

export default function OrgExpensesPage() {
  const org = orgService.getOrganisation();
  const [expenses, setExpenses] = useState(orgService.listExpenses());

  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Rent');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [recipient, setRecipient] = useState('');
  const [notes, setNotes] = useState('');

  const totalExpenses = expenses.reduce((s, e) => s + e.amountPence, 0);
  const byCategory = expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] ?? 0) + e.amountPence;
    return acc;
  }, {} as Record<string, number>);
  const byMonth = expenses.reduce((acc, e) => {
    const m = e.date.slice(0, 7);
    acc[m] = (acc[m] ?? 0) + e.amountPence;
    return acc;
  }, {} as Record<string, number>);

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const amountPence = Math.round(parseFloat(amount || '0') * 100);
    if (!name.trim() || amountPence <= 0) return;
    const newExpense: Expense = {
      id: `exp_${Date.now()}`,
      orgId: org.id,
      name: name.trim(),
      category,
      amountPence,
      date,
      recipient: recipient.trim() || undefined,
      notes: notes.trim() || undefined,
      createdAt: new Date().toISOString(),
    };
    const newExpenses = [...expenses, newExpense];
    setExpenses(newExpenses);
    orgService.saveExpenses(newExpenses);
    setShowAddForm(false);
    setName('');
    setAmount('');
    setRecipient('');
    setNotes('');
  };

  const sortedExpenses = [...expenses].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <Layout role="org">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Expenses</h1>
            <p className="text-gray-600 mt-1">Track where money is going. Add, categorize, and view by date.</p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700"
          >
            + Add expense
          </button>
        </div>

        {showAddForm && (
          <Card className="p-5">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Add expense</h2>
            <form onSubmit={handleAddExpense} className="space-y-4 max-w-xl">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expense name *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="e.g. Rent - Muath Trust Centre"
                    className="w-full px-4 py-2 rounded-xl border border-gray-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200"
                  >
                    {DEFAULT_CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount (£) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    className="w-full px-4 py-2 rounded-xl border border-gray-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Where money went (recipient)</label>
                <input
                  type="text"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder="e.g. Muath Trust, School Supplies Ltd"
                  className="w-full px-4 py-2 rounded-xl border border-gray-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  placeholder="Optional notes"
                  className="w-full px-4 py-2 rounded-xl border border-gray-200"
                />
              </div>
              <div className="flex gap-3">
                <button type="submit" className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700">
                  Add
                </button>
                <button type="button" onClick={() => setShowAddForm(false)} className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200">
                  Cancel
                </button>
              </div>
            </form>
          </Card>
        )}

        {/* Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="text-sm text-gray-500">Total expenses</div>
            <div className="text-2xl font-bold text-gray-900">{formatPence(totalExpenses)}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-gray-500">Categories</div>
            <div className="text-2xl font-bold text-gray-900">{Object.keys(byCategory).length}</div>
          </Card>
        </div>

        {/* Expenses by category */}
        <Card className="p-5">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Where money is going (by category)</h2>
          <div className="space-y-2">
            {Object.entries(byCategory)
              .sort(([, a], [, b]) => b - a)
              .map(([cat, amt]) => (
                <div key={cat} className="flex justify-between py-2 px-3 rounded-lg bg-gray-50">
                  <span className="font-medium">{cat}</span>
                  <span className="text-rose-600 font-semibold">{formatPence(amt)}</span>
                </div>
              ))}
          </div>
        </Card>

        {/* Monthly totals */}
        <Card className="p-5">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Monthly expense totals</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left text-gray-500">
                  <th className="py-2 pr-4">Month</th>
                  <th className="py-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(byMonth)
                  .sort(([a], [b]) => b.localeCompare(a))
                  .map(([month, amt]) => (
                    <tr key={month} className="border-b border-gray-100">
                      <td className="py-2 pr-4 font-medium">{month}</td>
                      <td className="py-2 text-rose-600 font-semibold">{formatPence(amt)}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* All expenses list */}
        <Card className="p-5">
          <h2 className="text-lg font-bold text-gray-900 mb-4">All expenses</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left text-gray-500">
                  <th className="py-2 pr-4">Date</th>
                  <th className="py-2 pr-4">Name</th>
                  <th className="py-2 pr-4">Category</th>
                  <th className="py-2 pr-4">Recipient</th>
                  <th className="py-2">Amount</th>
                </tr>
              </thead>
              <tbody>
                {sortedExpenses.map((e) => (
                  <tr key={e.id} className="border-b border-gray-100">
                    <td className="py-2 pr-4 text-gray-600">{e.date}</td>
                    <td className="py-2 pr-4 font-medium">{e.name}</td>
                    <td className="py-2 pr-4">{e.category}</td>
                    <td className="py-2 pr-4 text-gray-600">{e.recipient ?? '—'}</td>
                    <td className="py-2 text-rose-600 font-medium">{formatPence(e.amountPence)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {expenses.length === 0 && (
            <p className="py-8 text-center text-gray-500">No expenses yet. Add one to get started.</p>
          )}
        </Card>
      </div>
    </Layout>
  );
}
