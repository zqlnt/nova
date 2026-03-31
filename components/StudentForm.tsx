'use client';

import { useState } from 'react';
import type { Student, OrgStudentRecord, PaymentFundingType, PaymentStatusType, Family } from '@/lib/orgTypes';
import type { Enrollment } from '@/lib/orgTypes';
import Card from '@/components/Card';

const YEAR_GROUPS = [7, 8, 9, 10, 11] as const;
const PAYMENT_TYPES: { value: PaymentFundingType; label: string }[] = [
  { value: 'private', label: 'Private' },
  { value: 'universal_credit', label: 'Universal Credit' },
];
const PAYMENT_STATUSES: { value: PaymentStatusType; label: string }[] = [
  { value: 'paid', label: 'Paid' },
  { value: 'unpaid', label: 'Unpaid' },
  { value: 'partial', label: 'Partial' },
  { value: 'overdue', label: 'Overdue' },
];

function toPence(val: string): number {
  const n = parseFloat(val);
  return isNaN(n) ? 0 : Math.round(n * 100);
}

function fromPence(p: number): string {
  return (p / 100).toFixed(2);
}

interface StudentFormProps {
  orgId: string;
  student?: Student;
  record?: OrgStudentRecord;
  enrollments: Enrollment[];
  classes: { id: string; name: string }[];
  /** Households for linking (Nova Org). */
  families?: Family[];
  onSave: (student: Student, record: OrgStudentRecord, classIds: string[]) => void;
  onCancel: () => void;
}

export default function StudentForm({
  orgId,
  student,
  record,
  enrollments,
  classes,
  families = [],
  onSave,
  onCancel,
}: StudentFormProps) {
  const currentClassIds = enrollments.map((e) => e.classId);
  const [name, setName] = useState(student?.name ?? '');
  const [familyId, setFamilyId] = useState<string>(student?.familyId ?? '');
  const [age, setAge] = useState(student?.age != null ? String(student.age) : '');
  const [yearGroup, setYearGroup] = useState<number>(student?.yearGroup ?? 10);
  const [classIds, setClassIds] = useState<string[]>(currentClassIds.length ? currentClassIds : classes[0] ? [classes[0].id] : []);
  const [paymentType, setPaymentType] = useState<PaymentFundingType>(record?.paymentFundingType ?? 'private');
  const [expectedAmount, setExpectedAmount] = useState(record?.expectedPaymentAmountPence != null ? fromPence(record.expectedPaymentAmountPence) : '35.00');
  const [amountOwed, setAmountOwed] = useState(record?.amountOwedPence != null ? fromPence(record.amountOwedPence) : '0');
  const [paymentDueDate, setPaymentDueDate] = useState(record?.paymentDueDate ?? '');
  const [paymentPaidDate, setPaymentPaidDate] = useState(record?.paymentPaidDate ?? '');
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatusType>(record?.paymentStatus ?? 'unpaid');
  const [parentName, setParentName] = useState(record?.parentGuardianName ?? '');
  const [parentPhone, setParentPhone] = useState(record?.parentGuardianPhone ?? '');
  const [parentEmail, setParentEmail] = useState(record?.parentGuardianEmail ?? '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date().toISOString();
    const s: Student = {
      id: student?.id ?? `s_${Date.now()}`,
      orgId,
      familyId: familyId || undefined,
      name: name.trim(),
      age: age ? parseInt(String(age), 10) : undefined,
      yearGroup: yearGroup as 7 | 8 | 9 | 10 | 11,
      subjects: ['Mathematics', 'English', 'Science'],
      mathsTier: student?.mathsTier,
      examBoard: student?.examBoard,
      literatureTexts: student?.literatureTexts,
      createdAt: student?.createdAt ?? now,
      totalPoints: student?.totalPoints ?? 0,
      level: student?.level ?? 1,
    };
    const r: OrgStudentRecord = {
      id: record?.id ?? `osr_${s.id}`,
      orgId,
      studentId: s.id,
      expectedPaymentAmountPence: toPence(expectedAmount),
      amountOwedPence: toPence(amountOwed),
      paymentDueDate: paymentDueDate || undefined,
      paymentPaidDate: paymentPaidDate || undefined,
      paymentStatus,
      paymentFundingType: paymentType,
      parentGuardianName: parentName || undefined,
      parentGuardianPhone: parentPhone || undefined,
      parentGuardianEmail: parentEmail || undefined,
      createdAt: record?.createdAt ?? now,
      updatedAt: now,
    };
    onSave(s, r, classIds);
  };

  const toggleClass = (id: string) => {
    setClassIds((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]));
  };

  return (
    <Card className="p-5">
      <form onSubmit={handleSubmit} className="space-y-5">
        <h2 className="text-lg font-bold text-gray-900">{student ? 'Edit student' : 'Add student'}</h2>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-xl border border-white/45 focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
            <input
              type="number"
              min="5"
              max="20"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-white/45 focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Year group</label>
            <select
              value={yearGroup}
              onChange={(e) => setYearGroup(parseInt(e.target.value, 10))}
              className="w-full px-4 py-2 rounded-xl border border-white/45 focus:ring-2 focus:ring-indigo-500"
            >
              {YEAR_GROUPS.map((y) => (
                <option key={y} value={y}>Year {y}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Household (family)</label>
            <select
              value={familyId}
              onChange={(e) => setFamilyId(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-white/45 focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Not linked</option>
              {families.map((f) => (
                <option key={f.id} value={f.id}>{f.name}</option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">Link siblings to the same household.</p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Classes</label>
          <div className="flex flex-wrap gap-2">
            {classes.map((c) => (
              <label key={c.id} className="flex items-center gap-2 px-3 py-2 rounded-lg border border-white/45 cursor-pointer hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={classIds.includes(c.id)}
                  onChange={() => toggleClass(c.id)}
                />
                <span>{c.name}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="border-t pt-4">
          <h3 className="text-sm font-semibold text-gray-800 mb-3">Payment</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Payment type</label>
              <select
                value={paymentType}
                onChange={(e) => setPaymentType(e.target.value as PaymentFundingType)}
                className="w-full px-4 py-2 rounded-xl border border-white/45"
              >
                {PAYMENT_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount due (£)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={expectedAmount}
                onChange={(e) => setExpectedAmount(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-white/45"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount owed (£)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={amountOwed}
                onChange={(e) => setAmountOwed(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-white/45"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Payment status</label>
              <select
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value as PaymentStatusType)}
                className="w-full px-4 py-2 rounded-xl border border-white/45"
              >
                {PAYMENT_STATUSES.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Due date</label>
              <input
                type="date"
                value={paymentDueDate}
                onChange={(e) => setPaymentDueDate(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-white/45"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Paid date</label>
              <input
                type="date"
                value={paymentPaidDate}
                onChange={(e) => setPaymentPaidDate(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-white/45"
              />
            </div>
          </div>
        </div>

        <div className="border-t pt-4">
          <h3 className="text-sm font-semibold text-gray-800 mb-3">Parent / guardian</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                value={parentName}
                onChange={(e) => setParentName(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-white/45"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="tel"
                value={parentPhone}
                onChange={(e) => setParentPhone(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-white/45"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={parentEmail}
                onChange={(e) => setParentEmail(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-white/45"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <button type="submit" className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700">
            Save
          </button>
          <button type="button" onClick={onCancel} className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200">
            Cancel
          </button>
        </div>
      </form>
    </Card>
  );
}
