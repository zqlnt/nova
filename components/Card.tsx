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
        nova-frost-panel rounded-3xl p-6 sm:p-8 relative overflow-hidden
        ${hover ? 'nova-frost-panel--hover transition-all duration-300' : ''}
        ${className}
      `}
    >
      {decorative && (
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-violet-400/12 to-transparent rounded-full blur-2xl pointer-events-none"></div>
      )}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}

