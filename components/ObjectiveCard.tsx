'use client';

import { Objective, MasteryStatus } from '@/lib/types';
import MasteryChip from './MasteryChip';
import Button from './Button';

interface ObjectiveCardProps {
  objective: Objective;
  masteryStatus: MasteryStatus;
  onClick?: () => void;
  onStartPractice?: () => void;
  showDescription?: boolean;
  isNext?: boolean;
}

export default function ObjectiveCard({ 
  objective, 
  masteryStatus, 
  onClick,
  onStartPractice,
  showDescription = true,
  isNext = false,
}: ObjectiveCardProps) {
  const difficultyStars = '★'.repeat(objective.difficulty) + '☆'.repeat(5 - objective.difficulty);

  return (
    <div 
      onClick={onClick}
      className={`bg-white border rounded-xl p-4 transition-all ${
        onClick ? 'cursor-pointer hover:border-blue-300 hover:shadow-md' : ''
      } ${isNext ? 'border-blue-300 ring-2 ring-blue-100' : 'border-gray-200'}`}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            {isNext && (
              <span className="px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-700">
                Up Next
              </span>
            )}
            <span className="text-xs text-gray-500">{objective.strand}</span>
          </div>
          <h3 className="font-semibold text-gray-900 truncate">{objective.title}</h3>
        </div>
        <MasteryChip status={masteryStatus} size="sm" />
      </div>

      {showDescription && (
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{objective.description}</p>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 text-xs text-gray-500">
          <span title="Difficulty">{difficultyStars}</span>
          <span>Y{objective.yearMin}–{objective.yearMax}</span>
          {objective.tier && (
            <span className="px-1.5 py-0.5 rounded bg-purple-50 text-purple-600 font-medium">
              {objective.tier}
            </span>
          )}
        </div>
        
        {onStartPractice && masteryStatus !== 'secure' && (
          <Button 
            size="sm" 
            onClick={(e) => {
              e.stopPropagation();
              onStartPractice();
            }}
          >
            Practice
          </Button>
        )}
      </div>
    </div>
  );
}



