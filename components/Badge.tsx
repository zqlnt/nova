import { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  className?: string;
}

export default function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  const variants = {
    default: 'bg-gray-200 text-gray-700',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-yellow-100 text-yellow-700',
    danger: 'bg-red-100 text-red-700',
    info: 'bg-blue-100 text-blue-700',
  };
  
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}

