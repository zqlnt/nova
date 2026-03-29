import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  decorative?: boolean;
}

export default function Card({ children, className = '', hover = false, decorative = false }: CardProps) {
  return (
    <div 
      className={`
        bg-white rounded-2xl p-4 sm:p-6 relative overflow-hidden
        border border-gray-200/60
        shadow-[0_1px_3px_0_rgba(0,0,0,0.05),0_1px_2px_-1px_rgba(0,0,0,0.05)]
        ${hover ? 'hover:shadow-lg hover:shadow-gray-200/50 hover:border-gray-300/80 transition-all duration-300' : ''}
        ${className}
      `}
    >
      {decorative && (
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-violet-500/5 to-transparent rounded-full blur-2xl pointer-events-none"></div>
      )}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}

