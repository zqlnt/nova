'use client';

import { useEffect, useState } from 'react';

const PASTEL_COLORS = [
  'bg-red-400/25',
  'bg-amber-400/25',
  'bg-yellow-400/25',
  'bg-emerald-400/25',
  'bg-blue-400/25',
  'bg-violet-400/25',
  'bg-pink-400/25',
  'bg-indigo-400/25',
];

const MATH_SYMBOLS = ['+', '−', '×', '÷', '='];
const CHART_SYMBOLS = ['▁', '▂', '▃', '▄', '▅'];

type SymbolType = 'math' | 'chart' | 'shape';

interface AnimatedSquircleProps {
  top: string;
  left: string;
  size: number;
  colorIndex: number;
  delay: number;
  symbolType: SymbolType;
}

function AnimatedSquircle({ top, left, size, colorIndex, delay, symbolType }: AnimatedSquircleProps) {
  const [symbol, setSymbol] = useState('+');
  const [isShape, setIsShape] = useState(true);

  useEffect(() => {
    const cycle = () => {
      setIsShape((s) => !s);
      if (symbolType === 'math') {
        setSymbol(MATH_SYMBOLS[Math.floor(Math.random() * MATH_SYMBOLS.length)]);
      } else if (symbolType === 'chart') {
        setSymbol(CHART_SYMBOLS[Math.floor(Math.random() * CHART_SYMBOLS.length)]);
      }
    };
    const id = setInterval(cycle, 4000 + delay * 500);
    return () => clearInterval(id);
  }, [symbolType, delay]);

  const color = PASTEL_COLORS[colorIndex % PASTEL_COLORS.length];

  return (
    <div
      className={`absolute ${color} rounded-[28%] flex items-center justify-center text-gray-600/70 font-light transition-all duration-1000 ease-in-out animate-squircle-float`}
      style={{
        top,
        left,
        width: size,
        height: size,
        animationDelay: `${delay}s`,
      }}
    >
      {isShape ? (
        <div
          className="w-2/3 h-2/3 rounded-[24%] bg-white/30 animate-squircle-pulse"
          style={{ animationDelay: `${delay * 0.2}s` }}
        />
      ) : (
        <span className="text-[0.55em] font-medium tabular-nums">{symbol}</span>
      )}
    </div>
  );
}

export default function WelcomeAnimations() {
  const squircles = [
    { top: '12%', left: '15%', size: 40, colorIndex: 0, delay: 0, symbolType: 'math' as SymbolType },
    { top: '12%', left: '85%', size: 40, colorIndex: 1, delay: 0.5, symbolType: 'math' as SymbolType },
    { top: '50%', left: '8%', size: 24, colorIndex: 2, delay: 1, symbolType: 'chart' as SymbolType },
    { top: '50%', left: '92%', size: 24, colorIndex: 3, delay: 1.5, symbolType: 'chart' as SymbolType },
    { top: '75%', left: '15%', size: 20, colorIndex: 4, delay: 2, symbolType: 'math' as SymbolType },
    { top: '75%', left: '85%', size: 20, colorIndex: 5, delay: 2.5, symbolType: 'math' as SymbolType },
    { top: '33%', left: '50%', size: 12, colorIndex: 6, delay: 0.3, symbolType: 'shape' as SymbolType },
    { top: '66%', left: '25%', size: 16, colorIndex: 7, delay: 0.8, symbolType: 'chart' as SymbolType },
    { top: '25%', left: '25%', size: 12, colorIndex: 0, delay: 1.2, symbolType: 'shape' as SymbolType },
    { top: '60%', left: '30%', size: 8, colorIndex: 1, delay: 1.8, symbolType: 'shape' as SymbolType },
  ];

  return (
    <>
      {/* Glowing orbs - subtle drift animation */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-blue-400/20 blur-[100px] animate-orb-drift" style={{ animationDelay: '0s', animationDuration: '22s' }} />
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-pink-400/15 blur-[100px] animate-orb-drift" style={{ animationDelay: '2s', animationDuration: '24s' }} />
        <div className="absolute top-1/2 -left-48 w-80 h-80 rounded-full bg-blue-300/15 blur-[80px] animate-orb-drift" style={{ animationDelay: '1s', animationDuration: '20s' }} />
        <div className="absolute top-1/2 -right-48 w-80 h-80 rounded-full bg-pink-300/15 blur-[80px] animate-orb-drift" style={{ animationDelay: '3s', animationDuration: '26s' }} />
        <div className="absolute top-1/3 left-1/4 w-64 h-64 rounded-full bg-blue-400/12 blur-[60px] animate-orb-drift" style={{ animationDelay: '0.5s', animationDuration: '18s' }} />
        <div className="absolute top-2/3 right-1/4 w-64 h-64 rounded-full bg-pink-400/12 blur-[60px] animate-orb-drift" style={{ animationDelay: '2.5s', animationDuration: '22s' }} />
        <div className="absolute bottom-20 left-1/3 w-48 h-48 rounded-full bg-indigo-400/10 blur-[50px] animate-orb-drift" style={{ animationDelay: '1.5s', animationDuration: '20s' }} />
        <div className="absolute top-1/4 right-1/3 w-40 h-40 rounded-full bg-pink-300/15 blur-[40px] animate-orb-drift" style={{ animationDelay: '0.8s', animationDuration: '16s' }} />
      </div>
      {/* Animated squircles with math/chart symbols */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {squircles.map((s, i) => (
          <AnimatedSquircle
            key={i}
            top={s.top}
            left={s.left}
            size={s.size}
            colorIndex={s.colorIndex}
            delay={s.delay}
            symbolType={s.symbolType}
          />
        ))}
      </div>
    </>
  );
}
