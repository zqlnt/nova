'use client';

import { SubjectMastery, StrandMastery } from '@/lib/types';
import { getPastelColor } from '@/lib/chartColors';

// ============================================
// RADIAL PROGRESS CHART
// ============================================

interface RadialProgressProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  bgColor?: string;
  label?: string;
  sublabel?: string;
}

export function RadialProgress({ 
  percentage, 
  size = 120, 
  strokeWidth = 10,
  color = '#6366f1',
  bgColor = '#e5e7eb',
  label,
  sublabel
}: RadialProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={bgColor}
          strokeWidth={strokeWidth}
          className="opacity-60"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-500 ease-out drop-shadow-sm"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-gray-900 tabular-nums">{Math.round(percentage)}%</span>
        {label && <span className="text-xs font-medium text-gray-600">{label}</span>}
        {sublabel && <span className="text-xs text-gray-400">{sublabel}</span>}
      </div>
    </div>
  );
}

// ============================================
// BAR CHART
// ============================================

interface BarChartProps {
  data: { label: string; value: number; max: number; color?: string }[];
  height?: number;
}

export function BarChart({ data, height = 200 }: BarChartProps) {
  const maxValue = Math.max(...data.map(d => d.max));

  return (
    <div className="flex items-end gap-2 justify-between" style={{ height }}>
      {data.map((item, index) => {
        const barHeight = (item.value / maxValue) * 100;
        const bgHeight = (item.max / maxValue) * 100;
        return (
          <div key={index} className="flex-1 flex flex-col items-center gap-2">
            <div className="relative w-full flex justify-center" style={{ height: height - 40 }}>
              <div 
                className="absolute bottom-0 w-6 sm:w-8 rounded-t-xl"
                style={{ height: `${bgHeight}%`, backgroundColor: '#F3F4F6' }}
              />
              <div 
                className="absolute bottom-0 w-6 sm:w-8 rounded-t-xl transition-all duration-500"
                style={{ 
                  height: `${barHeight}%`,
                  backgroundColor: item.color || getPastelColor(index)
                }}
              />
              <div 
                className="absolute text-xs font-semibold text-gray-800"
                style={{ bottom: `calc(${barHeight}% + 4px)` }}
              >
                {item.value}
              </div>
            </div>
            <span className="text-xs text-gray-500 text-center truncate w-full">{item.label}</span>
          </div>
        );
      })}
    </div>
  );
}

// ============================================
// STRAND PROGRESS BARS
// ============================================

interface StrandProgressBarsProps {
  strands: StrandMastery[];
}

export function StrandProgressBars({ strands }: StrandProgressBarsProps) {
  return (
    <div className="space-y-5">
      {strands.map((strand) => {
        const total = strand.secure + strand.developing + strand.notStarted;
        const securePercent = total > 0 ? (strand.secure / total) * 100 : 0;
        const developingPercent = total > 0 ? (strand.developing / total) * 100 : 0;
        const notStartedPercent = total > 0 ? (strand.notStarted / total) * 100 : 100;
        
        return (
          <div key={strand.strand} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-gray-800 truncate">{strand.strand}</span>
              <span className="text-gray-500 text-xs tabular-nums">
                {strand.secure}/{total} secure
              </span>
            </div>
            <div className="h-3 bg-gray-100/80 rounded-xl overflow-hidden flex">
              <div 
                className="h-full transition-all duration-500 rounded-l-xl"
                style={{ width: `${securePercent}%`, backgroundColor: '#86EFAC' }}
              />
              <div 
                className="h-full transition-all duration-500"
                style={{ width: `${developingPercent}%`, backgroundColor: '#FCD34D' }}
              />
              <div 
                className="h-full transition-all duration-500 rounded-r-xl"
                style={{ width: `${notStartedPercent}%`, backgroundColor: '#E5E7EB' }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ============================================
// LEVEL BADGE
// ============================================

interface LevelBadgeProps {
  level: number;
  points: number;
  pointsToNext: number;
  size?: 'sm' | 'md' | 'lg';
}

export function LevelBadge({ level, points, pointsToNext, size = 'md' }: LevelBadgeProps) {
  const progress = pointsToNext > 0 ? ((points % 500) / 500) * 100 : 100;
  
  const sizeClasses = {
    sm: 'w-12 h-12 text-lg',
    md: 'w-16 h-16 text-xl',
    lg: 'w-20 h-20 text-2xl',
  };

  const getLevelAccent = (lvl: number) => {
    if (lvl >= 20) return 'text-amber-500 border-amber-300/50'; // Gold
    if (lvl >= 15) return 'text-purple-500 border-purple-300/50'; // Purple
    if (lvl >= 10) return 'text-blue-500 border-blue-300/50'; // Blue
    if (lvl >= 5) return 'text-cyan-500 border-cyan-300/50'; // Cyan
    return 'text-gray-600 border-gray-300/50'; // Gray
  };

  const getLevelTitle = (lvl: number) => {
    if (lvl >= 20) return 'Master';
    if (lvl >= 15) return 'Expert';
    if (lvl >= 10) return 'Advanced';
    if (lvl >= 5) return 'Intermediate';
    return 'Beginner';
  };

  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        {/* Glass level circle */}
        <div className={`${sizeClasses[size]} rounded-full backdrop-blur-md bg-white/70 border-2 ${getLevelAccent(level).split(' ')[1]} flex items-center justify-center font-bold shadow-lg ${getLevelAccent(level).split(' ')[0]}`}
          style={{
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
          }}
        >
          {level}
        </div>
        {/* Progress ring */}
        <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="46"
            fill="none"
            stroke="rgba(0,0,0,0.08)"
            strokeWidth="4"
          />
          <circle
            cx="50"
            cy="50"
            r="46"
            fill="none"
            stroke={level >= 20 ? '#f59e0b' : level >= 15 ? '#a855f7' : level >= 10 ? '#3b82f6' : level >= 5 ? '#06b6d4' : '#6b7280'}
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={`${progress * 2.89} 289`}
            className="drop-shadow-sm"
          />
        </svg>
      </div>
      {size !== 'sm' && (
        <div>
          <div className={`font-semibold ${getLevelAccent(level).split(' ')[0]}`}>{getLevelTitle(level)}</div>
          <div className="text-xs text-gray-600">{points.toLocaleString()} XP</div>
          {pointsToNext > 0 && (
            <div className="text-xs text-gray-400">{pointsToNext} to next level</div>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================
// POINTS DISPLAY
// ============================================

interface PointsDisplayProps {
  points: number;
  change?: number;
  showAnimation?: boolean;
}

export function PointsDisplay({ points, change, showAnimation = false }: PointsDisplayProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1">
        <svg className="w-5 h-5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
        <span className="font-bold text-gray-900">{points.toLocaleString()}</span>
        <span className="text-sm text-gray-500">XP</span>
      </div>
      {change !== undefined && change > 0 && (
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
          showAnimation ? 'animate-pulse' : ''
        } bg-emerald-100 text-emerald-700`}>
          +{change}
        </span>
      )}
    </div>
  );
}

// ============================================
// WEEKLY ACTIVITY CHART
// ============================================

interface WeeklyActivityProps {
  data: { day: string; minutes: number }[];
  goal?: number;
}

export function WeeklyActivity({ data, goal = 60 }: WeeklyActivityProps) {
  const maxMinutes = Math.max(...data.map(d => d.minutes), goal);

  return (
    <div className="space-y-3">
      <div className="flex items-end gap-1.5 h-24">
        {data.map((day, index) => {
          const height = (day.minutes / maxMinutes) * 100;
          const metGoal = day.minutes >= goal;
          return (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div className="relative w-full h-20 flex items-end justify-center">
                <div 
                  className="w-full max-w-8 rounded-t-xl transition-all duration-300"
                  style={{
                    height: `${Math.max(height, 5)}%`,
                    backgroundColor: metGoal ? '#86EFAC' : '#93C5FD',
                  }}
                />
              </div>
              <span className="text-xs text-gray-500 mt-1 font-medium">{day.day}</span>
            </div>
          );
        })}
      </div>
      <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-lg bg-emerald-500 shadow-sm" />
          <span>Goal met</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-lg bg-indigo-500 shadow-sm" />
          <span>Active</span>
        </div>
      </div>
    </div>
  );
}

// ============================================
// MASTERY DONUT CHART
// ============================================

interface MasteryDonutProps {
  secure: number;
  developing: number;
  notStarted: number;
  size?: number;
}

export function MasteryDonut({ secure, developing, notStarted, size = 100 }: MasteryDonutProps) {
  const total = secure + developing + notStarted;
  const securePercent = (secure / total) * 100;
  const developingPercent = (developing / total) * 100;
  
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  
  const secureOffset = 0;
  const developingOffset = (securePercent / 100) * circumference;
  const notStartedOffset = ((securePercent + developingPercent) / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={radius} fill="none" stroke="#e5e7eb" strokeWidth="12" />
        {developingPercent > 0 && (
          <circle
            cx="50" cy="50" r={radius}
            fill="none"
            stroke="url(#mastery-amber)"
            strokeWidth="12"
            strokeDasharray={`${(developingPercent / 100) * circumference} ${circumference}`}
            strokeDashoffset={-developingOffset}
            className="transition-all duration-500"
            transform="rotate(-90 50 50)"
          />
        )}
        {securePercent > 0 && (
          <circle
            cx="50" cy="50" r={radius}
            fill="none"
            stroke="url(#mastery-emerald)"
            strokeWidth="12"
            strokeDasharray={`${(securePercent / 100) * circumference} ${circumference}`}
            strokeDashoffset={0}
            className="transition-all duration-500"
            transform="rotate(-90 50 50)"
          />
        )}
        <defs>
          <linearGradient id="mastery-emerald" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#86EFAC" />
            <stop offset="100%" stopColor="#4ADE80" />
          </linearGradient>
          <linearGradient id="mastery-amber" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FCD34D" />
            <stop offset="100%" stopColor="#FBBF24" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-lg font-bold text-gray-900">{total}</span>
        <span className="text-xs text-gray-500">total</span>
      </div>
    </div>
  );
}

