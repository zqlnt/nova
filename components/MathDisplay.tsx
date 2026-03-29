'use client';

import { useEffect, useRef } from 'react';

interface MathDisplayProps {
  content: string;
  className?: string;
}

// Simple regex-based math formatting (no external dependencies)
function formatMathContent(text: string): string {
  let formatted = text;

  // Convert **bold** to <strong>
  formatted = formatted.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

  // Convert superscripts: x^2, x^3, x^n, etc.
  formatted = formatted.replace(/\^2/g, '²');
  formatted = formatted.replace(/\^3/g, '³');
  formatted = formatted.replace(/\^4/g, '⁴');
  formatted = formatted.replace(/\^5/g, '⁵');
  formatted = formatted.replace(/\^6/g, '⁶');
  formatted = formatted.replace(/\^7/g, '⁷');
  formatted = formatted.replace(/\^8/g, '⁸');
  formatted = formatted.replace(/\^9/g, '⁹');
  formatted = formatted.replace(/\^0/g, '⁰');
  formatted = formatted.replace(/\^n/g, 'ⁿ');
  formatted = formatted.replace(/\^{([^}]+)}/g, '<sup>$1</sup>');

  // Convert subscripts: x_1, x_n, etc.
  formatted = formatted.replace(/_1/g, '₁');
  formatted = formatted.replace(/_2/g, '₂');
  formatted = formatted.replace(/_3/g, '₃');
  formatted = formatted.replace(/_n/g, 'ₙ');
  formatted = formatted.replace(/_{([^}]+)}/g, '<sub>$1</sub>');

  // Square root symbol
  formatted = formatted.replace(/sqrt\(([^)]+)\)/g, '√($1)');
  formatted = formatted.replace(/\\sqrt{([^}]+)}/g, '√$1');
  
  // Pi symbol
  formatted = formatted.replace(/\\pi/g, 'π');
  formatted = formatted.replace(/\bpi\b/gi, 'π');

  // Plus/minus
  formatted = formatted.replace(/\+\/-/g, '±');
  formatted = formatted.replace(/\\pm/g, '±');

  // Multiplication and division
  formatted = formatted.replace(/\*/g, '×');
  formatted = formatted.replace(/\\times/g, '×');
  formatted = formatted.replace(/\\div/g, '÷');

  // Fractions: \frac{a}{b} or a/b
  formatted = formatted.replace(/\\frac{([^}]+)}{([^}]+)}/g, '<span class="fraction"><span class="frac-num">$1</span><span class="frac-den">$2</span></span>');
  
  // Simple fractions like 1/2, 3/4 (but not paths or dates)
  formatted = formatted.replace(/(\d+)\/(\d+)(?![\/\d])/g, '<span class="inline-frac">$1⁄$2</span>');

  // Inequalities
  formatted = formatted.replace(/\\leq/g, '≤');
  formatted = formatted.replace(/\\geq/g, '≥');
  formatted = formatted.replace(/\\neq/g, '≠');
  formatted = formatted.replace(/<=/g, '≤');
  formatted = formatted.replace(/>=/g, '≥');
  formatted = formatted.replace(/!=/g, '≠');

  // Greek letters
  formatted = formatted.replace(/\\alpha/g, 'α');
  formatted = formatted.replace(/\\beta/g, 'β');
  formatted = formatted.replace(/\\theta/g, 'θ');
  formatted = formatted.replace(/\\delta/g, 'δ');

  // Degrees
  formatted = formatted.replace(/(\d+)\s*degrees/gi, '$1°');
  formatted = formatted.replace(/\\degree/g, '°');

  // Newlines to <br>
  formatted = formatted.replace(/\n/g, '<br>');

  return formatted;
}

export default function MathDisplay({ content, className = '' }: MathDisplayProps) {
  const formattedContent = formatMathContent(content);

  return (
    <span 
      className={`math-content ${className}`}
      dangerouslySetInnerHTML={{ __html: formattedContent }}
    />
  );
}

// Styled container for longer math content
export function MathBlock({ content, className = '' }: MathDisplayProps) {
  const formattedContent = formatMathContent(content);

  return (
    <div 
      className={`math-block bg-gray-50 rounded-lg p-4 font-mono text-gray-800 ${className}`}
      dangerouslySetInnerHTML={{ __html: formattedContent }}
    />
  );
}



