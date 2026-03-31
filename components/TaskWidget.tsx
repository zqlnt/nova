'use client';

import Link from 'next/link';

export interface TaskItem {
  id: string;
  title: string;
  due?: string;
  priority?: 'high' | 'medium' | 'low';
  done?: boolean;
  href?: string;
}

interface TaskWidgetProps {
  tasks: TaskItem[];
  title?: string;
  href?: string;
  emptyMessage?: string;
}

export default function TaskWidget({ tasks, title = 'Tasks', href, emptyMessage = 'No tasks' }: TaskWidgetProps) {
  const pending = tasks.filter((t) => !t.done).slice(0, 5);

  return (
    <div className="nova-frost-panel rounded-3xl p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
        {href && (
          <Link href={href} className="text-xs text-indigo-600 hover:underline">View all →</Link>
        )}
      </div>
      {pending.length === 0 ? (
        <p className="text-xs text-gray-500">{emptyMessage}</p>
      ) : (
        <ul className="space-y-2">
          {pending.map((t) => (
            <li key={t.id}>
              {t.href ? (
                <Link href={t.href} className="flex items-center gap-3 py-2 px-2 rounded-xl hover:bg-white/45 transition-colors group">
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0 bg-white/80 ring-1 ring-gray-300/80 group-hover:ring-indigo-400/70 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.9)]" />
                  <span className="text-sm text-gray-700 group-hover:text-gray-900 truncate flex-1">{t.title}</span>
                  {t.due && <span className="text-[10px] text-gray-400">{t.due}</span>}
                </Link>
              ) : (
                <div className="flex items-center gap-3 py-2 px-2 rounded-xl">
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0 bg-white/80 ring-1 ring-gray-300/80" />
                  <span className="text-sm text-gray-700 truncate flex-1">{t.title}</span>
                  {t.due && <span className="text-[10px] text-gray-400">{t.due}</span>}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
