'use client';

import Link from 'next/link';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

interface MiniCalendarProps {
  events?: { startDate: string; title: string }[];
  href?: string;
  title?: string;
}

export default function MiniCalendar({ events = [], href = '/student/calendar', title = 'Calendar' }: MiniCalendarProps) {
  const today = new Date();
  const viewDate = new Date(today.getFullYear(), today.getMonth(), 1);
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startPad = (firstDay.getDay() + 6) % 7;
  const daysInMonth = lastDay.getDate();

  const grid: (number | null)[] = [];
  for (let i = 0; i < startPad; i++) grid.push(null);
  for (let d = 1; d <= daysInMonth; d++) grid.push(d);

  const todayStr = today.toISOString().split('T')[0];
  const upcomingEvents = events.filter((e) => e.startDate >= todayStr).slice(0, 3);

  return (
    <div className="nova-frost-panel rounded-3xl p-3.5 sm:p-5 w-full min-w-0">
      <div className="flex items-center justify-between mb-2 sm:mb-3 gap-2">
        <h3 className="text-xs sm:text-sm font-semibold text-gray-800 truncate">{title}</h3>
        <Link href={href} className="text-[10px] sm:text-xs text-indigo-600 hover:underline shrink-0">
          View
        </Link>
      </div>
      <div className="grid grid-cols-7 gap-px sm:gap-0.5 text-center text-[9px] sm:text-[10px] font-medium text-gray-500 mb-0.5 sm:mb-1">
        {DAYS.map((d, i) => (
          <div key={i} className="truncate px-px">
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-px sm:gap-0.5 w-full min-w-0">
        {grid.map((d, i) => {
          if (d === null) return <div key={i} />;
          const isToday = today.getDate() === d && today.getMonth() === month && today.getFullYear() === year;
          return (
            <div
              key={i}
              className={`aspect-square min-h-0 flex items-center justify-center rounded text-[10px] sm:text-xs font-medium tabular-nums ${
                isToday
                  ? 'bg-gradient-to-br from-indigo-500 to-blue-600 text-white shadow-[0_4px_14px_-4px_rgba(79,70,229,0.45)]'
                  : 'text-gray-700 hover:bg-white/50'
              }`}
            >
              {d}
            </div>
          );
        })}
      </div>
      {upcomingEvents.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200/40 space-y-2">
          {upcomingEvents.map((e) => (
            <div key={e.startDate + e.title} className="text-xs text-gray-600 truncate">
              <span className="text-gray-400">{e.startDate.slice(5)}</span> {e.title}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
