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
    <div className="nova-frost-panel rounded-xl p-4">
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
                <Link href={t.href} className="flex items-center gap-2 py-1.5 px-2 rounded-lg hover:bg-gray-50 group">
                  <span className={`w-3 h-3 rounded-full flex-shrink-0 border border-gray-300 group-hover:border-indigo-400`} />
                  <span className="text-sm text-gray-700 group-hover:text-gray-900 truncate flex-1">{t.title}</span>
                  {t.due && <span className="text-[10px] text-gray-400">{t.due}</span>}
                </Link>
              ) : (
                <div className="flex items-center gap-2 py-1.5 px-2 rounded-lg">
                  <span className="w-3 h-3 rounded-full flex-shrink-0 border border-gray-300" />
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
