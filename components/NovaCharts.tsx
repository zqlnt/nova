'use client';

import { NOVA_PASTEL_PALETTE, PAID_COLOR, OWED_COLOR, ATTENDANCE_COLOR, getPastelColor } from '@/lib/chartColors';

// ============================================
// SOFT DONUT CHART
// ============================================

export interface DonutSlice {
  label: string;
  value: number;
  color?: string;
}

interface SoftDonutProps {
  data: DonutSlice[];
  size?: number;
  strokeWidth?: number;
  centerLabel?: string;
  centerValue?: string | number;
}

export function SoftDonut({ data, size = 140, strokeWidth = 14, centerLabel, centerValue }: SoftDonutProps) {
  const total = data.reduce((s, d) => s + d.value, 0);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let offset = 0;
  const segments = data
    .filter((d) => d.value > 0)
    .map((d, i) => {
      const pct = total > 0 ? d.value / total : 0;
      const dashLength = pct * circumference;
      const seg = { ...d, offset, dashLength, color: d.color || getPastelColor(i) };
      offset += dashLength;
      return seg;
    });

  return (
    <div className="relative inline-flex">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(148, 163, 184, 0.28)"
          strokeWidth={strokeWidth}
        />
        {segments.map((seg, i) => (
          <circle
            key={i}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={seg.color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={`${seg.dashLength} ${circumference}`}
            strokeDashoffset={-seg.offset}
            className="transition-all duration-700 ease-out"
          />
        ))}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {centerValue !== undefined && (
          <span className="text-lg font-semibold text-gray-800 tabular-nums">{centerValue}</span>
        )}
        {centerLabel && <span className="text-xs text-gray-500 mt-0.5">{centerLabel}</span>}
      </div>
    </div>
  );
}

// ============================================
// SOFT BAR CHART
// ============================================

interface SoftBarProps {
  data: { label: string; value: number; color?: string }[];
  maxValue?: number;
  height?: number;
  showValues?: boolean;
}

export function SoftBarChart({ data, maxValue, height = 180, showValues = true }: SoftBarProps) {
  const max = maxValue ?? Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="space-y-1" style={{ height }}>
      {data.map((item, i) => {
        const pct = max > 0 ? (item.value / max) * 100 : 0;
        return (
          <div key={i} className="flex items-center gap-3">
            <span className="text-sm text-gray-600 w-24 truncate">{item.label}</span>
            <div className="flex-1 h-7 rounded-xl overflow-hidden border border-white/50 bg-white/35 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.65)]">
              <div
                className="h-full rounded-lg transition-all duration-500 ease-out shadow-[0_1px_0_0_rgba(255,255,255,0.35)]"
                style={{
                  width: `${Math.max(pct, 2)}%`,
                  backgroundColor: item.color || getPastelColor(i),
                }}
              />
            </div>
            {showValues && (
              <span className="text-sm font-medium text-gray-700 tabular-nums w-12 text-right">
                {item.value}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ============================================
// PAID VS OWED CHART
// ============================================

interface PaidVsOwedProps {
  paid: number;
  owed: number;
  size?: number;
}

export function PaidVsOwedDonut({ paid, owed, size = 120 }: PaidVsOwedProps) {
  const total = paid + owed;
  const paidPct = total > 0 ? (paid / total) * 100 : 0;
  const owedPct = total > 0 ? (owed / total) * 100 : 0;
  const radius = (size - 12) / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="relative inline-flex">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(148, 163, 184, 0.28)" strokeWidth={12} />
        {paidPct > 0 && (
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={PAID_COLOR}
            strokeWidth={12}
            strokeLinecap="round"
            strokeDasharray={`${(paidPct / 100) * circumference} ${circumference}`}
            strokeDashoffset={0}
            className="transition-all duration-500"
          />
        )}
        {owedPct > 0 && (
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={OWED_COLOR}
            strokeWidth={12}
            strokeLinecap="round"
            strokeDasharray={`${(owedPct / 100) * circumference} ${circumference}`}
            strokeDashoffset={-(paidPct / 100) * circumference}
            className="transition-all duration-500"
          />
        )}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-sm font-semibold text-gray-800">{total > 0 ? Math.round(paidPct) : 0}%</span>
        <span className="text-[10px] text-gray-500">paid</span>
      </div>
    </div>
  );
}

// ============================================
// FUNDING DISTRIBUTION (Private vs UC)
// ============================================

interface FundingDonutProps {
  privateCount: number;
  universalCreditCount: number;
  size?: number;
}

export function FundingDonut({ privateCount, universalCreditCount, size = 100 }: FundingDonutProps) {
  const data: DonutSlice[] = [
    { label: 'Private', value: privateCount, color: NOVA_PASTEL_PALETTE[0] },
    { label: 'Universal Credit', value: universalCreditCount, color: NOVA_PASTEL_PALETTE[3] },
  ].filter((d) => d.value > 0);

  const total = privateCount + universalCreditCount;
  return (
    <SoftDonut
      data={data}
      size={size}
      strokeWidth={10}
      centerValue={total}
      centerLabel="students"
    />
  );
}

// ============================================
// ATTENDANCE TREND (soft area-style bars)
// ============================================

interface AttendanceTrendProps {
  data: { date: string; present: number; total: number }[];
  height?: number;
}

export function AttendanceTrendChart({ data, height = 120 }: AttendanceTrendProps) {
  const maxVal = Math.max(...data.map((d) => d.total), 1);

  return (
    <div className="flex items-end gap-2" style={{ height }}>
      {data.map((item, i) => {
        const presentPct = item.total > 0 ? (item.present / item.total) * 100 : 0;
        const totalPct = (item.total / maxVal) * 100;
        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <div className="w-full max-w-10 flex flex-col justify-end" style={{ height: height - 28 }}>
              <div
                className="w-full rounded-t-md border border-white/40 bg-white/30"
                style={{ height: `${Math.max(totalPct, 4)}%` }}
              >
                <div
                  className="w-full rounded-t-md transition-all duration-500"
                  style={{
                    height: `${presentPct}%`,
                    backgroundColor: PAID_COLOR,
                  }}
                />
              </div>
            </div>
            <span className="text-[10px] text-gray-500 truncate w-full text-center">{item.date}</span>
          </div>
        );
      })}
    </div>
  );
}

// ============================================
// INLINE SUMMARY CHART (small)
// ============================================

interface InlineSummaryProps {
  value: number;
  max: number;
  label?: string;
  color?: string;
  width?: number;
}

export function InlineSummaryChart({ value, max, label, color = NOVA_PASTEL_PALETTE[0], width = 60 }: InlineSummaryProps) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className="flex items-center gap-2">
      <div className="h-2 rounded-full border border-white/45 bg-white/35 overflow-hidden" style={{ width }}>
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${Math.min(pct, 100)}%`, backgroundColor: color }}
        />
      </div>
      {label && <span className="text-xs text-gray-500">{label}</span>}
    </div>
  );
}

// ============================================
// ORG DASHBOARD CHARTS (mockup-aligned)
// ============================================

/** 1. Attendance: one bar per student, X=names, Y=sessions. Blue. */
interface AttendanceByStudentProps {
  data: { name: string; sessions: number }[];
  maxBars?: number;
  height?: number;
}

export function AttendanceByStudentChart({ data, maxBars = 12, height = 220 }: AttendanceByStudentProps) {
  const slice = data.slice(0, maxBars);
  const max = Math.max(...slice.map((d) => d.sessions), 1);

  return (
    <div className="flex items-end gap-1" style={{ height }}>
      {slice.map((d, i) => {
        const pct = (d.sessions / max) * 100;
        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-1 min-w-0">
            <div className="w-full flex-1 flex flex-col justify-end min-h-[100px] rounded-t-lg bg-gradient-to-t from-white/25 to-transparent">
              <div
                className="w-full rounded-t-md transition-all duration-500 shadow-[0_-1px_8px_-2px_rgba(37,99,235,0.25)]"
                style={{
                  height: `${Math.max(pct, 4)}%`,
                  backgroundColor: ATTENDANCE_COLOR,
                  opacity: 0.92,
                }}
              />
            </div>
            <span className="text-[10px] text-gray-500 truncate w-full text-center" title={d.name}>
              {d.name.split(' ')[0]}
            </span>
          </div>
        );
      })}
    </div>
  );
}

/** 2. Payments grouped bar: Paid (green) + Owed (red) per student */
interface PaymentsGroupedBarProps {
  data: { name: string; paidPence: number; owedPence: number }[];
  maxBars?: number;
  height?: number;
}

export function PaymentsGroupedBarChart({ data, maxBars = 10, height = 220 }: PaymentsGroupedBarProps) {
  const slice = data.slice(0, maxBars);
  const maxVal = Math.max(...slice.flatMap((d) => [d.paidPence, d.owedPence]), 1);

  return (
    <div className="space-y-3" style={{ height }}>
      {slice.map((d, i) => {
        const paidPct = (d.paidPence / maxVal) * 100;
        const owedPct = (d.owedPence / maxVal) * 100;
        return (
          <div key={i} className="flex items-center gap-2">
            <span className="text-xs text-gray-600 w-20 truncate">{d.name.split(' ')[0]}</span>
            <div className="flex-1 flex min-w-0 gap-0.5 h-6 rounded-lg overflow-hidden border border-white/35 bg-white/30">
              {d.paidPence > 0 && (
                <div
                  className="rounded-md transition-all"
                  style={{
                    width: `${Math.max(paidPct, 2)}%`,
                    backgroundColor: PAID_COLOR,
                    minWidth: d.paidPence > 0 ? 4 : 0,
                    opacity: 0.92,
                  }}
                />
              )}
              {d.owedPence > 0 && (
                <div
                  className="rounded-md transition-all"
                  style={{
                    width: `${Math.max(owedPct, 2)}%`,
                    backgroundColor: OWED_COLOR,
                    minWidth: d.owedPence > 0 ? 4 : 0,
                    opacity: 0.92,
                  }}
                />
              )}
            </div>
            <span className="text-[10px] text-gray-500 w-16 text-right tabular-nums">
              £{(d.paidPence / 100).toFixed(0)}/{d.owedPence > 0 ? (d.owedPence / 100).toFixed(0) : '0'}
            </span>
          </div>
        );
      })}
    </div>
  );
}

/** 3. Income breakdown: Tuition, Late fees, Discounts. Donut with % */
interface IncomeBreakdownDonutProps {
  tuitionPence: number;
  lateFeesPence: number;
  discountsPence: number;
  size?: number;
}

export function IncomeBreakdownDonut({ tuitionPence, lateFeesPence, discountsPence, size = 120 }: IncomeBreakdownDonutProps) {
  const total = tuitionPence + lateFeesPence + discountsPence;
  const data: DonutSlice[] = [
    { label: 'Tuition', value: tuitionPence, color: PAID_COLOR },
    { label: 'Late fees', value: lateFeesPence, color: NOVA_PASTEL_PALETTE[4] },
    { label: 'Discounts', value: discountsPence, color: OWED_COLOR },
  ].filter((d) => d.value > 0);

  const tuitionPct = total > 0 ? Math.round((tuitionPence / total) * 100) : 0;

  return (
    <div className="flex flex-col items-center gap-2">
      <SoftDonut data={data} size={size} strokeWidth={12} centerValue={`${tuitionPct}%`} centerLabel="Tuition" />
      <div className="flex gap-3 text-[10px] text-gray-500">
        <span>Tuition</span>
        <span>Late</span>
        <span>Disc</span>
      </div>
    </div>
  );
}

/** 4. Class distribution: students per class. Donut. */
interface ClassDistributionDonutProps {
  data: { label: string; count: number }[];
  size?: number;
}

export function ClassDistributionDonut({ data, size = 120 }: ClassDistributionDonutProps) {
  const filtered = data.filter((d) => d.count > 0);
  const total = filtered.reduce((s, d) => s + d.count, 0);
  const maxSlice = filtered.length > 0 ? filtered.reduce((a, b) => (a.count > b.count ? a : b)) : { label: '-', count: 0 };
  const pct = total > 0 ? Math.round((maxSlice.count / total) * 100) : 0;

  const slices: DonutSlice[] = filtered.map((d, i) => ({
    label: d.label,
    value: d.count,
    color: [PAID_COLOR, NOVA_PASTEL_PALETTE[4], ATTENDANCE_COLOR][i % 3],
  }));

  return (
    <div className="flex flex-col items-center gap-2">
      <SoftDonut data={slices} size={size} strokeWidth={12} centerValue={`${pct}%`} centerLabel={maxSlice.label} />
    </div>
  );
}

/** 5. Student status: Paid, Partial, Overdue. Donut. */
interface StudentStatusDonutProps {
  paid: number;
  partial: number;
  overdue: number;
  size?: number;
}

export function StudentStatusDonut({ paid, partial, overdue, size = 100 }: StudentStatusDonutProps) {
  const data: DonutSlice[] = [
    { label: 'Paid', value: paid, color: PAID_COLOR },
    { label: 'Partial', value: partial, color: NOVA_PASTEL_PALETTE[4] },
    { label: 'Overdue', value: overdue, color: OWED_COLOR },
  ].filter((d) => d.value > 0);

  const total = paid + partial + overdue;

  return (
    <SoftDonut
      data={data}
      size={size}
      strokeWidth={10}
      centerValue={total}
      centerLabel="students"
    />
  );
}

/** 6. Revenue over time: line chart */
interface RevenueOverTimeProps {
  data: { label: string; valuePence: number }[];
  height?: number;
}

export function RevenueOverTimeChart({ data, height = 120 }: RevenueOverTimeProps) {
  const maxVal = Math.max(...data.map((d) => d.valuePence), 1);

  return (
    <div className="relative" style={{ height }}>
      <svg width="100%" height={height} viewBox={`0 0 200 ${height}`} preserveAspectRatio="none">
        <polyline
          fill="none"
          stroke={PAID_COLOR}
          strokeWidth="1.5"
          strokeOpacity={0.92}
          strokeLinecap="round"
          strokeLinejoin="round"
          points={data
            .map((d, i) => {
              const x = (i / Math.max(data.length - 1, 1)) * 200;
              const y = height - (d.valuePence / maxVal) * (height - 16);
              return `${x},${y}`;
            })
            .join(' ')}
        />
      </svg>
      <div className="flex justify-between text-[10px] text-gray-400 mt-1">
        {data.map((d, i) => (
          <span key={i}>{d.label}</span>
        ))}
      </div>
    </div>
  );
}

/** 7. Top owed students: horizontal bars, sorted highest to lowest */
interface TopOwedBarProps {
  data: { name: string; owedPence: number }[];
  maxItems?: number;
  height?: number;
}

export function TopOwedBarChart({ data, maxItems = 8, height = 180 }: TopOwedBarProps) {
  const sorted = [...data].sort((a, b) => b.owedPence - a.owedPence).filter((d) => d.owedPence > 0).slice(0, maxItems);
  const max = Math.max(...sorted.map((d) => d.owedPence), 1);

  return (
    <div className="space-y-2" style={{ height }}>
      {sorted.map((d, i) => {
        const pct = (d.owedPence / max) * 100;
        return (
          <div key={i} className="flex items-center gap-2">
            <span className="text-xs text-gray-600 w-24 truncate">{d.name}</span>
            <div className="flex-1 h-5 rounded-lg overflow-hidden border border-white/45 bg-white/35">
              <div
                className="h-full rounded transition-all"
                style={{ width: `${Math.max(pct, 4)}%`, backgroundColor: OWED_COLOR }}
              />
            </div>
            <span className="text-xs font-medium text-gray-700 w-12 text-right tabular-nums">
              £{(d.owedPence / 100).toFixed(0)}
            </span>
          </div>
        );
      })}
    </div>
  );
}

/** 8. Attendance trend: line chart, X=time, Y=attendance % */
interface AttendanceTrendLineProps {
  data: { label: string; ratePct: number }[];
  height?: number;
}

export function AttendanceTrendLineChart({ data, height = 100 }: AttendanceTrendLineProps) {
  const maxVal = Math.max(...data.map((d) => d.ratePct), 1);

  return (
    <div className="relative" style={{ height }}>
      <svg width="100%" height={height} viewBox={`0 0 200 ${height}`} preserveAspectRatio="none">
        <polyline
          fill="none"
          stroke={ATTENDANCE_COLOR}
          strokeWidth="1.5"
          strokeOpacity={0.92}
          strokeLinecap="round"
          strokeLinejoin="round"
          points={data
            .map((d, i) => {
              const x = (i / Math.max(data.length - 1, 1)) * 200;
              const y = height - (d.ratePct / maxVal) * (height - 16);
              return `${x},${y}`;
            })
            .join(' ')}
        />
      </svg>
      <div className="flex justify-between text-[10px] text-gray-400 mt-1">
        {data.map((d, i) => (
          <span key={i}>{d.label}</span>
        ))}
      </div>
    </div>
  );
}
