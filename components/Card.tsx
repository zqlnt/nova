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
      className={`bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 relative overflow-hidden ${hover ? 'hover:scale-[1.01] transition-all duration-300' : ''} ${className}`}
    >
      {decorative && (
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-ios-blue/5 to-transparent rounded-full blur-2xl pointer-events-none"></div>
      )}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}

