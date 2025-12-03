import { ReactNode, ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export default function Button({ 
  children, 
  variant = 'primary', 
  size = 'md',
  className = '',
  ...props 
}: ButtonProps) {
  const baseStyles = 'rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-ios-blue text-white hover:bg-ios-blue-dark hover:shadow-lg hover:scale-105',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 border border-gray-300',
    ghost: 'text-gray-700 hover:bg-gray-100',
  };
  
  const sizes = {
    sm: 'px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm',
    md: 'px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base',
    lg: 'px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg',
  };
  
  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

