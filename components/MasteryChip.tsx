'use client';

import { MasteryStatus } from '@/lib/types';

interface MasteryChipProps {
  status: MasteryStatus;
  size?: 'sm' | 'md';
  showLabel?: boolean;
}

const statusConfig = {
  not_started: {
    label: 'Not Started',
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-600',
    dotColor: 'bg-gray-400',
  },
  developing: {
    label: 'Developing',
    bgColor: 'bg-amber-50',
    textColor: 'text-amber-700',
    dotColor: 'bg-amber-400',
  },
  secure: {
    label: 'Secure',
    bgColor: 'bg-emerald-50',
    textColor: 'text-emerald-700',
    dotColor: 'bg-emerald-500',
  },
};

export default function MasteryChip({ status, size = 'md', showLabel = true }: MasteryChipProps) {
  const config = statusConfig[status];
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm';
  const dotSize = size === 'sm' ? 'w-1.5 h-1.5' : 'w-2 h-2';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-medium ${config.bgColor} ${config.textColor} ${sizeClasses}`}>
      <span className={`${dotSize} rounded-full ${config.dotColor}`} />
      {showLabel && config.label}
    </span>
  );
}



