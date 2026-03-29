'use client';

import { useEffect, useState } from 'react';

const MATH_SYMBOLS = ['+', '−', '×', '÷', '='];
const PASTEL_COLORS = [
  'text-blue-400/60',
  'text-pink-400/60',
  'text-emerald-400/60',
  'text-amber-400/60',
  'text-violet-400/60',
];

interface MathSymbolAnimationProps {
  /** Size: 'xs' | 'sm' | 'md' | 'lg' */
  size?: 'xs' | 'sm' | 'md' | 'lg';
  /** Optional fixed symbol; if omitted, cycles through symbols */
  symbol?: string;
  /** Color index 0–4; if omitted, random */
  colorIndex?: number;
  /** Whether to animate (cycle symbols). Default true */
  animate?: boolean;
  /** Custom class for the container */
  className?: string;
}

const sizeClasses = {
  xs: 'text-xs',
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
};

export default function MathSymbolAnimation({
  size = 'sm',
  symbol: fixedSymbol,
  colorIndex,
  animate = true,
  className = '',
}: MathSymbolAnimationProps) {
  const [symbol, setSymbol] = useState(fixedSymbol ?? MATH_SYMBOLS[0]);
  const idx = colorIndex ?? Math.floor(Math.random() * PASTEL_COLORS.length);
  const color = PASTEL_COLORS[idx % PASTEL_COLORS.length];

  useEffect(() => {
    if (!animate || fixedSymbol) return;
    const id = setInterval(() => {
      setSymbol(MATH_SYMBOLS[Math.floor(Math.random() * MATH_SYMBOLS.length)]);
    }, 3500 + Math.random() * 1500);
    return () => clearInterval(id);
  }, [animate, fixedSymbol]);

  return (
    <span
      className={`inline-block tabular-nums font-light transition-opacity duration-500 ${sizeClasses[size]} ${color} ${className}`}
      aria-hidden
    >
      {symbol}
    </span>
  );
}
