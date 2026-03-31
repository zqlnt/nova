'use client';

import { useState } from 'react';
import Link from 'next/link';
import Layout from '@/components/Layout';
import Card from '@/components/Card';
import { orgService } from '@/lib/orgService';
import { computeDashboardStats, formatPence } from '@/lib/orgOperations';

type StatusFilter = 'all' | 'paid' | 'partial' | 'overdue' | 'unpaid';
type FundingFilter = 'all' | 'private' | 'universal_credit';

export default function OrgPaymentsPage() {
  const [students, setStudents] = useState(orgService.listStudents());
  const [records, setRecords] = useState(orgService.listOrgStudentRecords());
  const [invoices, setInvoices] = useState(orgService.listInvoices());
  const [payments, setPayments] = useState(orgService.listPayments());
  const classes = orgService.listClasses();
  const attendance = orgService.listAttendance();
  const notes = orgService.listNotes();

  const stats = computeDashboardStats(students, records, classes, attendance, payments, invoices, notes);

  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [fundingFilter, setFundingFilter] = useState<FundingFilter>('all');
  const [showAddPayment, setShowAddPayment] = useState(false);
  const [showAddInvoice, setShowAddInvoice] = useState(false);
  const [addPaymentStudentId, setAddPaymentStudentId] = useState('');
  const [addAmount, setAddAmount] = useState('');
  const [addDate, setAddDate] = useState(new Date().toISOString().slice(0, 10));
  const [addType, setAddType] = useState<'private' | 'universal_credit'>('private');
  const [invStudentId, setInvStudentId] = useState('');
  const [invAmount, setInvAmount] = useState('');
  const [invDueDate, setInvDueDate] = useState('');

  const monthPrefix = (() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  })();
  const thisMonthPayments = payments.filter(
    (p) => p.paidAt && p.paidAt.startsWith(monthPrefix) && p.status === 'succeeded'
  );
  const overdueInvoices = invoices.filter((i) => i.status === 'overdue');
  const studentsWithBalance = records.filter((r) => (r.amountOwedPence ?? 0) > 0);

  const privateTotal = thisMonthPayments.filter((p) => p.paymentType === 'private').reduce((s, p) => s + p.amountPence, 0);
  const ucTotal = thisMonthPayments.filter((p) => p.paymentType === 'universal_credit').reduce((s, p) => s + p.amountPence, 0);

  const getStudentStatus = (studentId: string) => {
    const rec = records.find((r) => r.studentId === studentId);
    if (rec?.paymentStatus) return rec.paymentStatus;
    const inv = invoices.find((i) => i.studentId === studentId && i.status === 'overdue');
    if (inv) return 'overdue' as const;
    const paidInv = invoices.find((i) => i.studentId === studentId && i.status === 'paid');
    if (paidInv) return 'paid' as const;
    const partInv = invoices.find((i) => i.studentId === studentId && i.status === 'partial');
    if (partInv) return 'partial' as const;
    return 'unpaid' as const;
  };

  const studentPaymentsView = students.map((s) => {
    const rec = records.find((r) => r.studentId === s.id);
    const status = getStudentStatus(s.id);
    const studentPayments = payments.filter((p) => p.studentId === s.id);
    return { student: s, record: rec, status, payments: studentPayments };
  });

  const filteredPayments = studentPaymentsView.filter((pv) => {
    if (statusFilter !== 'all' && pv.status !== statusFilter) return false;
    if (fundingFilter !== 'all' && pv.record?.paymentFundingType !== fundingFilter) return false;
    return true;
  });

  const handleAddPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const amountPence = Math.round(parseFloat(addAmount || '0') * 100);
    if (!addPaymentStudentId || amountPence <= 0) return;
    const newPayment = {
      id: `pay_${Date.now()}`,
      orgId: orgService.getOrganisation().id,
      studentId: addPaymentStudentId,
      amountPence,
      status: 'succeeded' as const,
      paidAt: `${addDate}T12:00:00Z`,
      paymentDate: addDate,
      paymentType: addType,
    };
    const newPayments = [...payments, newPayment];
    setPayments(newPayments);
    orgService.savePayments(newPayments);
    const rec = records.find((r) => r.studentId === addPaymentStudentId);
    if (rec && (rec.amountOwedPence ?? 0) > 0) {
      const newOwed = Math.max(0, (rec.amountOwedPence ?? 0) - amountPence);
      const newRecords = records.map((r) =>
        r.studentId === addPaymentStudentId ? { ...r, amountOwedPence: newOwed, updatedAt: new Date().toISOString() } : r
      );
      setRecords(newRecords);
      orgService.saveOrgStudentRecords(newRecords);
    }
    setShowAddPayment(false);
    setAddPaymentStudentId('');
    setAddAmount('');
  };

  return (
    <Layout role="org">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
            <p className="text-gray-600 mt-1">Billing, funding type, and outstanding balances</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowAddPayment(true)}
              className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700"
            >
              + Record payment
            </button>
            <button
              onClick={() => setShowAddInvoice(true)}
              className="px-5 py-2.5 bg-gray-100 text-gray-800 rounded-xl font-medium hover:bg-gray-200"
            >
              + Add due date
            </button>
          </div>
        </div>

        {showAddInvoice && (
          <Card className="p-5">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Add payment due date</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              if (!invStudentId || !invAmount || !invDueDate) return;
              const amountPence = Math.round(parseFloat(invAmount) * 100);
              const today = new Date().toISOString().slice(0, 10);
              const newInvoice = {
                id: `inv_${Date.now()}`,
                orgId: orgService.getOrganisation().id,
                studentId: invStudentId,
                periodStart: invDueDate,
                periodEnd: invDueDate,
                amountPence,
                status: (invDueDate < today ? 'overdue' : 'sent') as 'overdue' | 'sent',
                dueDate: invDueDate,
              };
              const newInvoices = [...invoices, newInvoice];
              setInvoices(newInvoices);
              orgService.saveInvoices(newInvoices);
              const rec = records.find((r) => r.studentId === invStudentId);
              if (rec) {
                const newRecords = records.map((r) =>
                  r.studentId === invStudentId
                    ? { ...r, paymentDueDate: invDueDate, expectedPaymentAmountPence: amountPence, amountOwedPence: (r.amountOwedPence ?? 0) + amountPence, updatedAt: new Date().toISOString() }
                    : r
                );
                setRecords(newRecords);
                orgService.saveOrgStudentRecords(newRecords);
              } else {
                const newRec = {
                  id: `osr_${invStudentId}`,
                  orgId: orgService.getOrganisation().id,
                  studentId: invStudentId,
                  paymentDueDate: invDueDate,
                  expectedPaymentAmountPence: amountPence,
                  amountOwedPence: amountPence,
                  paymentStatus: 'unpaid' as const,
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                };
                const newRecords = [...records, newRec];
                setRecords(newRecords);
                orgService.saveOrgStudentRecords(newRecords);
              }
              setShowAddInvoice(false);
              setInvStudentId('');
              setInvAmount('');
              setInvDueDate('');
            }} className="space-y-4 max-w-md">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Student</label>
                <select value={invStudentId} onChange={(e) => setInvStudentId(e.target.value)} required className="w-full px-4 py-2 rounded-xl border border-white/45">
                  <option value="">Select student</option>
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount (£)</label>
                <input type="number" step="0.01" min="0" value={invAmount} onChange={(e) => setInvAmount(e.target.value)} required className="w-full px-4 py-2 rounded-xl border border-white/45" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Due date</label>
                <input type="date" value={invDueDate} onChange={(e) => setInvDueDate(e.target.value)} required className="w-full px-4 py-2 rounded-xl border border-white/45" />
              </div>
              <div className="flex gap-3">
                <button type="submit" className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700">Save</button>
                <button type="button" onClick={() => setShowAddInvoice(false)} className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200">Cancel</button>
              </div>
            </form>
          </Card>
        )}

        {showAddPayment && (
          <Card className="p-5">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Record payment received</h2>
            <form onSubmit={handleAddPayment} className="space-y-4 max-w-md">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Student</label>
                <select
                  value={addPaymentStudentId}
                  onChange={(e) => setAddPaymentStudentId(e.target.value)}
                  required
                  className="w-full px-4 py-2 rounded-xl border border-white/45"
                >
                  <option value="">Select student</option>
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount (£)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={addAmount}
                  onChange={(e) => setAddAmount(e.target.value)}
                  required
                  className="w-full px-4 py-2 rounded-xl border border-white/45"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date received</label>
                <input
                  type="date"
                  value={addDate}
                  onChange={(e) => setAddDate(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-white/45"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment type</label>
                <select
                  value={addType}
                  onChange={(e) => setAddType(e.target.value as 'private' | 'universal_credit')}
                  className="w-full px-4 py-2 rounded-xl border border-white/45"
                >
                  <option value="private">Private</option>
                  <option value="universal_credit">Universal Credit</option>
                </select>
              </div>
              <div className="flex gap-3">
                <button type="submit" className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700">
                  Save
                </button>
                <button type="button" onClick={() => setShowAddPayment(false)} className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200">
                  Cancel
                </button>
              </div>
            </form>
          </Card>
        )}

        {/* Filters */}
        <Card className="p-4">
          <div className="flex flex-wrap gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
              className="px-4 py-2 rounded-xl text-sm nova-frost-field border-white/50"
            >
              <option value="all">All status</option>
              <option value="paid">Paid</option>
              <option value="partial">Partial</option>
              <option value="overdue">Overdue</option>
              <option value="unpaid">Unpaid</option>
            </select>
            <select
              value={fundingFilter}
              onChange={(e) => setFundingFilter(e.target.value as FundingFilter)}
              className="px-4 py-2 rounded-xl text-sm nova-frost-field border-white/50"
            >
              <option value="all">All funding</option>
              <option value="private">Private</option>
              <option value="universal_credit">Universal Credit</option>
            </select>
          </div>
        </Card>

        {/* Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="text-sm text-gray-500">Received this month</div>
            <div className="text-2xl font-bold text-emerald-600">{formatPence(stats.amountReceivedThisMonth)}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-gray-500">Outstanding</div>
            <div className="text-2xl font-bold text-rose-600">{formatPence(stats.totalOutstandingPence)}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-gray-500">Overdue invoices</div>
            <div className="text-2xl font-bold text-amber-600">{overdueInvoices.length}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-gray-500">Private / UC</div>
            <div className="text-sm font-medium text-gray-900">{formatPence(privateTotal)} / {formatPence(ucTotal)}</div>
          </Card>
        </div>

        {/* Students and payment status */}
        <Card className="p-5">
          <h2 className="text-lg font-bold text-gray-900 mb-4">All students – payment status</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200/45 text-left text-gray-500">
                  <th className="py-2 pr-4">Student</th>
                  <th className="py-2 pr-4">Status</th>
                  <th className="py-2 pr-4">Funding</th>
                  <th className="py-2 pr-4">Owed</th>
                  <th className="py-2 pr-4">Expected</th>
                  <th className="py-2">Due date</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.map(({ student, record, status }) => (
                  <tr key={student.id} className="border-b border-gray-100">
                    <td className="py-2 pr-4">
                      <Link href={`/org/students/${student.id}`} className="font-medium text-gray-900 hover:text-indigo-600">
                        {student.name}
                      </Link>
                    </td>
                    <td className="py-2 pr-4">
                      <span className={`px-2 py-0.5 rounded text-xs ${
                        status === 'paid' ? 'bg-emerald-100 text-emerald-800' :
                        status === 'overdue' ? 'bg-rose-100 text-rose-800' :
                        status === 'partial' ? 'bg-amber-100 text-amber-800' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {status}
                      </span>
                    </td>
                    <td className="py-2 pr-4">{record?.paymentFundingType === 'universal_credit' ? 'UC' : record?.paymentFundingType ?? '—'}</td>
                    <td className="py-2 pr-4 text-rose-600 font-medium">{formatPence(record?.amountOwedPence ?? 0)}</td>
                    <td className="py-2 pr-4">{formatPence(record?.expectedPaymentAmountPence ?? 0)}</td>
                    <td className="py-2 text-gray-600">{record?.paymentDueDate ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Payment history */}
        <Card className="p-5">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Payment history</h2>
          {payments.filter((p) => p.status === 'succeeded').length === 0 ? (
            <p className="text-sm text-gray-500">No payments recorded</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200/45 text-left text-gray-500">
                    <th className="py-2 pr-4">Student</th>
                    <th className="py-2 pr-4">Date</th>
                    <th className="py-2 pr-4">Amount</th>
                    <th className="py-2">Type</th>
                  </tr>
                </thead>
                <tbody>
                  {[...payments].filter((p) => p.status === 'succeeded').reverse().map((p) => {
                    const student = students.find((s) => s.id === p.studentId);
                    return (
                      <tr key={p.id} className="border-b border-gray-100">
                        <td className="py-2 pr-4 font-medium">{student?.name}</td>
                        <td className="py-2 pr-4 text-gray-600">{p.paymentDate ?? p.paidAt?.slice(0, 10)}</td>
                        <td className="py-2 pr-4 text-emerald-600 font-medium">{formatPence(p.amountPence)}</td>
                        <td className="py-2">{p.paymentType === 'universal_credit' ? 'UC' : p.paymentType ?? '—'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* Overdue & outstanding */}
        <Card className="p-5">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Overdue invoices</h2>
          {overdueInvoices.length === 0 ? (
            <p className="text-sm text-gray-500">No overdue invoices</p>
          ) : (
            <div className="space-y-2">
              {overdueInvoices.map((inv) => {
                const student = students.find((s) => s.id === inv.studentId);
                return (
                  <div key={inv.id} className="flex items-center justify-between py-3 px-4 rounded-xl bg-rose-50 border border-rose-100">
                    <div>
                      <span className="font-medium text-gray-900">{student?.name}</span>
                      <span className="text-gray-500 text-sm ml-2">Due {inv.dueDate}</span>
                    </div>
                    <span className="font-semibold text-rose-600">{formatPence(inv.amountPence)}</span>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>
    </Layout>
  );
}
