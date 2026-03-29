/**
 * Nova chart colour palette - pastel, premium, calm
 * Inspired by the welcome screen accents
 */

export const NOVA_CHART_COLORS = {
  pastelBlue: '#93C5FD',
  pastelGreen: '#86EFAC',
  pastelPurple: '#C4B5FD',
  pastelPink: '#F9A8D4',
  pastelAmber: '#FCD34D',
  pastelCyan: '#67E8F9',
  pastelRose: '#FDA4AF',
  pastelIndigo: '#A5B4FC',
  softGray: '#E5E7EB',
  softGrayLight: '#F3F4F6',
} as const;

export const NOVA_PASTEL_PALETTE = [
  NOVA_CHART_COLORS.pastelBlue,
  NOVA_CHART_COLORS.pastelGreen,
  NOVA_CHART_COLORS.pastelPurple,
  NOVA_CHART_COLORS.pastelPink,
  NOVA_CHART_COLORS.pastelAmber,
  NOVA_CHART_COLORS.pastelCyan,
  NOVA_CHART_COLORS.pastelRose,
  NOVA_CHART_COLORS.pastelIndigo,
];

/** For paid/success - soft green */
export const PAID_COLOR = '#86EFAC';
/** For owed/outstanding - soft rose, not harsh red */
export const OWED_COLOR = '#FDA4AF';
/** For neutral/background */
export const NEUTRAL_COLOR = '#E5E7EB';
/** For attendance - blue */
export const ATTENDANCE_COLOR = '#93C5FD';

export function getPastelColor(index: number): string {
  return NOVA_PASTEL_PALETTE[index % NOVA_PASTEL_PALETTE.length];
}
