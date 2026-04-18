const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const YR_RE = /^yr\s*(\d{1,2})$/i;

export function trimToNull(s: string | undefined): string | null {
  if (s == null) return null;
  const t = s.trim();
  return t === '' ? null : t;
}

export function parseYearGroupFromAcademicYear(raw: string | null | undefined): {
  year: 7 | 8 | 9 | 10 | 11 | null;
  issues: string[];
} {
  const issues: string[] = [];
  const t = trimToNull(raw ?? undefined);
  if (!t) {
    issues.push('academic_year_missing');
    return { year: null, issues };
  }
  const m = t.match(YR_RE);
  if (m) {
    const n = parseInt(m[1], 10);
    if (n >= 7 && n <= 11) return { year: n as 7 | 8 | 9 | 10 | 11, issues };
    issues.push(`academic_year_out_of_range:${t}`);
    return { year: null, issues };
  }
  issues.push(`academic_year_unparsed:${t}`);
  return { year: null, issues };
}

export function normalizeFundingType(raw: string | null): 'private' | 'universal_credit' | 'unknown' {
  const t = (raw ?? '').trim().toLowerCase().replace(/\s+/g, '_');
  if (t === 'private') return 'private';
  if (t === 'universal_credit' || t === 'uc') return 'universal_credit';
  if (t === '' || t === 'unknown') return 'unknown';
  return 'unknown';
}

/** Interpret plain number as whole GBP → pence. Supports optional decimals. */
export function parseGbpToPence(raw: string | null | undefined): { pence: number | null; issues: string[] } {
  const issues: string[] = [];
  const t = trimToNull(raw ?? undefined);
  if (!t) return { pence: null, issues };
  const cleaned = t.replace(/£/g, '').replace(/,/g, '').trim();
  if (cleaned === '') return { pence: null, issues };
  const n = Number(cleaned);
  if (!Number.isFinite(n)) {
    issues.push(`amount_unparsed:${raw}`);
    return { pence: null, issues };
  }
  if (cleaned.includes('.')) {
    return { pence: Math.round(n * 100), issues };
  }
  return { pence: Math.round(n * 100), issues };
}

export function parseIsoDate(raw: string | null | undefined): { iso: string | null; issues: string[] } {
  const issues: string[] = [];
  const t = trimToNull(raw ?? undefined);
  if (!t) return { iso: null, issues };
  if (!ISO_DATE.test(t)) {
    issues.push(`date_not_iso:${t}`);
    return { iso: null, issues };
  }
  return { iso: t, issues };
}

export function normalizeAttendanceStatus(raw: string | null): 'present' | 'absent' | 'late' | 'excused' | 'unknown' {
  const t = (raw ?? '').trim().toLowerCase();
  if (t === 'present' || t === 'p') return 'present';
  if (t === 'absent' || t === 'a') return 'absent';
  if (t === 'late' || t === 'l') return 'late';
  if (t === 'excused' || t === 'e') return 'excused';
  if (t === '') return 'unknown';
  return 'unknown';
}

export function inferDataCompleteness(
  notes: string | null,
  yearGroup: number | null,
  funding: string,
  monthlyFeePence: number | null
): 'complete' | 'provisional' | 'incomplete' {
  const n = (notes ?? '').toLowerCase();
  if (n.includes('provisional')) return 'provisional';
  if (!yearGroup || funding === 'unknown') return 'incomplete';
  if (funding === 'private' && monthlyFeePence == null) return 'incomplete';
  return 'complete';
}

export function parseFlaggedIssue(raw: string | null): boolean {
  const t = (raw ?? '').trim().toLowerCase();
  return t === 'yes' || t === 'y' || t === 'true' || t === '1';
}

export function headersMatch(row: string[], expected: readonly string[]): boolean {
  if (row.length < expected.length) return false;
  return expected.every((h, i) => row[i] === h);
}
