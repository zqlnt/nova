/**
 * Validates `next` after login so we only redirect to same-origin paths (no open redirects).
 */

import { PRIMARY_OWNER_EMAIL } from '@/lib/userAccountSeed';

export const DEFAULT_AFTER_AUTH = '/student/dashboard';

/** Allowlisted path prefixes for post-login redirect (defense in depth). */
const ALLOW_PREFIXES = ['/student/', '/teacher/', '/org/', '/onboarding'];

export function safeNextPath(raw: string | null | undefined): string {
  if (raw == null || typeof raw !== 'string') return DEFAULT_AFTER_AUTH;

  let decoded = raw.trim();
  try {
    decoded = decodeURIComponent(decoded);
  } catch {
    return DEFAULT_AFTER_AUTH;
  }

  if (!decoded.startsWith('/') || decoded.startsWith('//')) return DEFAULT_AFTER_AUTH;
  if (decoded.includes('://') || decoded.includes('\\')) return DEFAULT_AFTER_AUTH;
  if (decoded.length > 512) return DEFAULT_AFTER_AUTH;

  // Only app routes (not static files)
  const lower = decoded.toLowerCase();
  if (lower.endsWith('.svg') || lower.endsWith('.png') || lower.endsWith('.ico')) {
    return DEFAULT_AFTER_AUTH;
  }

  if (lower.startsWith('/login') || lower.startsWith('/signup')) {
    return DEFAULT_AFTER_AUTH;
  }

  const isAllowed =
    ALLOW_PREFIXES.some((p) => decoded === p.slice(0, -1) || decoded.startsWith(p)) ||
    decoded === '/';

  if (!isAllowed) return DEFAULT_AFTER_AUTH;

  return decoded;
}

/**
 * After login: honor `next` when present; if the user is the primary org owner and there was
 * no explicit `next` query (OAuth often drops it), land on Nova Org so Firestore-backed data loads.
 */
export function resolvePostLoginPath(
  email: string | null | undefined,
  rawNext: string | null | undefined
): string {
  const path = safeNextPath(rawNext);
  const em = email?.toLowerCase().trim() ?? '';
  const owner = PRIMARY_OWNER_EMAIL.toLowerCase();
  const noExplicitNext = rawNext == null || String(rawNext).trim() === '';
  if (em === owner && noExplicitNext) {
    return '/org/dashboard';
  }
  return path;
}
