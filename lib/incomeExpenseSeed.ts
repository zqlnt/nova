/**
 * Seed data for Income (Dec–Mar) and Expenses.
 * Supports dashboards, reports, and payment pages.
 */

import type { IncomeRecord, Expense } from '@/lib/orgTypes';

const ORG_ID = 'org_ttutors';

// Income: December 2025 – March 2026
export const seedIncomeRecords: IncomeRecord[] = [
  { id: 'inc_dec_t1', orgId: ORG_ID, month: 'December', year: 2025, amountPence: 42000, source: 'tuition', receivedAt: '2025-12-15', createdAt: '2025-12-15T10:00:00Z' },
  { id: 'inc_dec_t2', orgId: ORG_ID, month: 'December', year: 2025, amountPence: 28000, source: 'tuition', receivedAt: '2025-12-22', createdAt: '2025-12-22T10:00:00Z' },
  { id: 'inc_jan_t1', orgId: ORG_ID, month: 'January', year: 2026, amountPence: 45500, source: 'tuition', receivedAt: '2026-01-10', createdAt: '2026-01-10T10:00:00Z' },
  { id: 'inc_jan_lf', orgId: ORG_ID, month: 'January', year: 2026, amountPence: 500, source: 'late_fees', receivedAt: '2026-01-12', createdAt: '2026-01-12T10:00:00Z' },
  { id: 'inc_feb_t1', orgId: ORG_ID, month: 'February', year: 2026, amountPence: 48200, source: 'tuition', receivedAt: '2026-02-08', createdAt: '2026-02-08T10:00:00Z' },
  { id: 'inc_feb_t2', orgId: ORG_ID, month: 'February', year: 2026, amountPence: 10500, source: 'tuition', receivedAt: '2026-02-20', createdAt: '2026-02-20T10:00:00Z' },
  { id: 'inc_mar_t1', orgId: ORG_ID, month: 'March', year: 2026, amountPence: 14000, source: 'tuition', receivedAt: '2026-03-05', createdAt: '2026-03-05T10:00:00Z' },
  { id: 'inc_mar_t2', orgId: ORG_ID, month: 'March', year: 2026, amountPence: 14000, source: 'tuition', receivedAt: '2026-03-12', createdAt: '2026-03-12T10:00:00Z' },
];

// Expenses: by category, where money went
export const seedExpenses: Expense[] = [
  { id: 'exp_1', orgId: ORG_ID, name: 'Rent - Muath Trust Centre', category: 'Rent', amountPence: 25000, date: '2025-12-01', recipient: 'Muath Trust', notes: 'Monthly rent', createdAt: '2025-12-01T10:00:00Z' },
  { id: 'exp_2', orgId: ORG_ID, name: 'Rent', category: 'Rent', amountPence: 25000, date: '2026-01-01', recipient: 'Muath Trust', createdAt: '2026-01-01T10:00:00Z' },
  { id: 'exp_3', orgId: ORG_ID, name: 'Rent', category: 'Rent', amountPence: 25000, date: '2026-02-01', recipient: 'Muath Trust', createdAt: '2026-02-01T10:00:00Z' },
  { id: 'exp_4', orgId: ORG_ID, name: 'Rent', category: 'Rent', amountPence: 25000, date: '2026-03-01', recipient: 'Muath Trust', createdAt: '2026-03-01T10:00:00Z' },
  { id: 'exp_5', orgId: ORG_ID, name: 'Teaching materials', category: 'Materials', amountPence: 4500, date: '2025-12-10', recipient: 'School Supplies Ltd', notes: 'Exercise books, pens', createdAt: '2025-12-10T10:00:00Z' },
  { id: 'exp_6', orgId: ORG_ID, name: 'Printing & photocopying', category: 'Materials', amountPence: 1200, date: '2026-01-15', recipient: 'Local print shop', createdAt: '2026-01-15T10:00:00Z' },
  { id: 'exp_7', orgId: ORG_ID, name: 'Staff training', category: 'Training', amountPence: 3500, date: '2026-02-28', recipient: 'Safeguarding course', notes: 'Mandatory update', createdAt: '2026-02-28T10:00:00Z' },
  { id: 'exp_8', orgId: ORG_ID, name: 'Utilities', category: 'Utilities', amountPence: 800, date: '2026-01-05', recipient: 'Electricity', createdAt: '2026-01-05T10:00:00Z' },
  { id: 'exp_9', orgId: ORG_ID, name: 'Insurance', category: 'Insurance', amountPence: 15000, date: '2026-01-01', recipient: 'Education Insurer', notes: 'Annual premium', createdAt: '2026-01-01T10:00:00Z' },
];
