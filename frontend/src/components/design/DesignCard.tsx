import React from 'react';
import { Link } from 'react-router-dom';
import { DesignResult } from '../../types/design';
import { DesignScoreBadge } from './DesignScoreBadge';
import { formatCost } from '../../lib/designUtils';
import { SafeImage } from '../ui/SafeImage';

interface DesignCardProps {
  design: DesignResult;
  isComparing: boolean;
  isSelectedForCompare: boolean;
  onCompareToggle: (id: string) => void;
  onSaveToggle: (id: string) => void;
  onEdit: (id: string) => void;
}

export const DesignCard: React.FC<DesignCardProps> = ({ 
  design, 
  isComparing, 
  isSelectedForCompare, 
  onCompareToggle, 
  onSaveToggle, 
  onEdit 
}) => {
  return (
    <div className={`flex flex-col bg-white border rounded-2xl overflow-hidden shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.1)] transition-all duration-300 ${isSelectedForCompare ? 'border-blue-500 ring-4 ring-blue-50' : 'border-gray-100 hover:border-gray-300'}`}>
      {/* Preview Image */}
      <div className="relative aspect-[4/3] bg-gray-100 border-b border-gray-100 overflow-hidden group">
        <SafeImage 
          src={design.previewImage} 
          alt={design.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-lg text-[11px] uppercase tracking-widest font-bold text-gray-800 shadow-sm border border-white/20">
          {design.style}
        </div>
        <button 
          onClick={() => onSaveToggle(design.id)}
          className={`absolute top-4 right-4 p-2.5 backdrop-blur-md rounded-xl shadow-sm hover:scale-105 transition-all duration-200 border ${design.isSaved ? 'bg-blue-600 border-blue-500' : 'bg-white/95 border-white/20 hover:bg-white'}`}
          title={design.isSaved ? "Unsave" : "Save design"}
        >
          {design.isSaved ? (
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-gray-600 hover:text-gray-900" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          )}
        </button>
      </div>

      <div className="p-6 flex-1 flex flex-col">
        {/* Title & Cost */}
        <div className="flex justify-between items-start mb-3 gap-2">
          <h3 className="text-xl font-extrabold text-gray-900 leading-tight tracking-tight">{design.title}</h3>
          <span className="text-sm font-bold text-gray-700 bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-lg shrink-0">
            {formatCost(design.estimatedCost)}
          </span>
        </div>
        
        {/* Explanation */}
        <p className="text-gray-500 text-sm mb-6 leading-relaxed line-clamp-3">
          {design.explanation}
        </p>

        {/* Scores */}
        <div className="grid grid-cols-4 gap-3 mb-6 mt-auto">
          <DesignScoreBadge label="Space" score={design.scores.space} />
          <DesignScoreBadge label="Light" score={design.scores.lighting} />
          <DesignScoreBadge label="Circ" score={design.scores.circulation} />
          <DesignScoreBadge label="Budget" score={design.scores.budget} />
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 pt-6 border-t border-gray-100">
          <Link 
            to={`/design/${design.id}`}
            className="flex-1 text-center bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold py-2.5 px-4 rounded-xl transition-colors shadow-sm"
          >
            View Details
          </Link>
          <button 
            onClick={() => onEdit(design.id)}
            className="flex-1 sm:flex-none px-5 py-2.5 bg-white border border-gray-200 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
          >
            Edit
          </button>
          
          <div className="w-full mt-1 sm:mt-0">
            <button
              onClick={() => onCompareToggle(design.id)}
              disabled={isComparing && !isSelectedForCompare}
              className={`w-full py-2.5 px-4 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 border ${
                isSelectedForCompare 
                  ? 'bg-blue-50/50 text-blue-700 border-blue-200 hover:bg-blue-50' 
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:text-gray-900 shadow-sm'
              } ${(isComparing && !isSelectedForCompare) ? 'opacity-40 cursor-not-allowed bg-gray-50 shadow-none hover:bg-gray-50' : ''}`}
            >
              {isSelectedForCompare ? (
                <>
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path></svg>
                  Selected to Compare
                </>
              ) : (
                'Select to Compare'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
