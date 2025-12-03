import { ReactNode, MouseEvent } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  className?: string;
  onClick?: (e: MouseEvent<HTMLElement>) => void;
}

export default function Badge({ children, variant = 'default', className = '', onClick }: BadgeProps) {
  const variants = {
    default: 'bg-gray-200 text-gray-700',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-yellow-100 text-yellow-700',
    danger: 'bg-red-100 text-red-700',
    info: 'bg-blue-100 text-blue-700',
  };
  
  const baseClasses = `inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${variants[variant]} ${className}`;
  
  if (onClick) {
    return (
      <button 
        type="button"
        onClick={onClick}
        className={baseClasses}
      >
        {children}
      </button>
    );
  }
  
  return (
    <span className={baseClasses}>
      {children}
    </span>
  );
}

