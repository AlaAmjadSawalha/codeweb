import React from 'react';
import { getScoreColorClass } from '../../lib/designUtils';

interface DesignScoreBadgeProps {
  label: string;
  score: number;
}

export const DesignScoreBadge: React.FC<DesignScoreBadgeProps> = ({ label, score }) => {
  const colorClass = getScoreColorClass(score);

  return (
    <div className="flex flex-col items-center p-3 rounded-xl bg-white border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_12px_-4px_rgba(0,0,0,0.08)] transition-shadow">
      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-2">{label}</span>
      <span className={`text-xl font-extrabold px-3 py-1 rounded-lg ${colorClass} shadow-inner`}>
        {score}
      </span>
    </div>
  );
};
