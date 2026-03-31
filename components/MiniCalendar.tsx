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
    <div className="nova-frost-panel rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
        <Link href={href} className="text-xs text-indigo-600 hover:underline">View</Link>
      </div>
      <div className="grid grid-cols-7 gap-0.5 text-center text-[10px] font-medium text-gray-500 mb-1">
        {DAYS.map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-0.5">
        {grid.map((d, i) => {
          if (d === null) return <div key={i} />;
          const isToday = today.getDate() === d && today.getMonth() === month && today.getFullYear() === year;
          return (
            <div
              key={i}
              className={`aspect-square flex items-center justify-center rounded text-xs font-medium ${
                isToday ? 'bg-indigo-500 text-white' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {d}
            </div>
          );
        })}
      </div>
      {upcomingEvents.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-100 space-y-1">
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
