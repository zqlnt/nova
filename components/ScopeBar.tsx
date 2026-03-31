'use client';

import { useState } from 'react';
import { ChatScope, Subject, YearGroup, MathsTier } from '@/lib/types';

interface ScopeBarProps {
  scope: ChatScope;
  onScopeChange: (scope: Partial<ChatScope>) => void;
  compact?: boolean;
}

export default function ScopeBar({ scope, onScopeChange, compact = false }: ScopeBarProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const subjects: Subject[] = ['Mathematics', 'English'];
  const years: YearGroup[] = [7, 8, 9, 10, 11];
  const tiers: MathsTier[] = ['Foundation', 'Higher'];

  const subjectLabel = scope.subject === 'Mathematics' ? 'Maths' : 'English';
  const tierLabel = scope.tier || 'Any tier';

  return (
    <div className="nova-frost-panel rounded-xl overflow-hidden">
      {/* Compact Header - Always visible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between text-left"
      >
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-gray-500 uppercase tracking-wide font-medium">Scope:</span>
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="px-2 py-1 rounded-md bg-blue-50 text-blue-700 text-sm font-medium">
              {subjectLabel}
            </span>
            <span className="px-2 py-1 rounded-md bg-gray-100 text-gray-700 text-sm font-medium">
              Y{scope.yearGroup}
            </span>
            {scope.subject === 'Mathematics' && scope.tier && (
              <span className="px-2 py-1 rounded-md bg-purple-50 text-purple-700 text-sm font-medium">
                {scope.tier}
              </span>
            )}
            {scope.objectiveTitle && (
              <span className="px-2 py-1 rounded-md bg-emerald-50 text-emerald-700 text-sm font-medium truncate max-w-[150px] sm:max-w-[250px]">
                {scope.objectiveTitle}
              </span>
            )}
          </div>
        </div>
        <svg 
          className={`w-4 h-4 text-gray-400 transition-transform flex-shrink-0 ${isExpanded ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Expanded Dropdowns */}
      {isExpanded && (
        <div className="px-4 pb-4 pt-2 border-t border-gray-100 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Subject Dropdown */}
          <div>
            <label className="block text-xs text-gray-500 mb-1">Subject</label>
            <select
              value={scope.subject}
              onChange={(e) => onScopeChange({ 
                subject: e.target.value as Subject, 
                objectiveId: null, 
                objectiveTitle: null,
                tier: e.target.value === 'English' ? undefined : scope.tier
              })}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {subjects.map(subject => (
                <option key={subject} value={subject}>
                  {subject === 'Mathematics' ? 'Maths' : 'English'}
                </option>
              ))}
            </select>
          </div>

          {/* Year Dropdown */}
          <div>
            <label className="block text-xs text-gray-500 mb-1">Year</label>
            <select
              value={scope.yearGroup}
              onChange={(e) => onScopeChange({ yearGroup: parseInt(e.target.value) as YearGroup })}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {years.map(year => (
                <option key={year} value={year}>Year {year}</option>
              ))}
            </select>
          </div>

          {/* Tier Dropdown (Maths only) */}
          {scope.subject === 'Mathematics' && (
            <div>
              <label className="block text-xs text-gray-500 mb-1">Tier</label>
              <select
                value={scope.tier || ''}
                onChange={(e) => onScopeChange({ tier: e.target.value as MathsTier || undefined })}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Any</option>
                {tiers.map(tier => (
                  <option key={tier} value={tier}>{tier}</option>
                ))}
              </select>
            </div>
          )}

          {/* Clear Objective Button */}
          {scope.objectiveTitle && (
            <div className={scope.subject === 'Mathematics' ? '' : 'col-span-2'}>
              <label className="block text-xs text-gray-500 mb-1">Objective</label>
              <button
                onClick={() => onScopeChange({ objectiveId: null, objectiveTitle: null })}
                className="w-full px-3 py-2 rounded-lg text-sm text-left text-gray-600 nova-frost-field hover:bg-white/85 flex items-center justify-between"
              >
                <span className="truncate">{scope.objectiveTitle}</span>
                <svg className="w-4 h-4 flex-shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
