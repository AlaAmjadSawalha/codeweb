import React, { useState } from 'react';
import { DesignResult } from '../../types/design';

interface DesignEditModalProps {
  design: DesignResult;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (designId: string, payload: any) => Promise<void>;
}

export const DesignEditModal: React.FC<DesignEditModalProps> = ({ design, isOpen, onClose, onSubmit }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // State Initialization
  const [style, setStyle] = useState(design.style);
  const [budgetOffset, setBudgetOffset] = useState(0);
  const [roomPriority, setRoomPriority] = useState('Family Comfort');
  const [furniturePref, setFurniturePref] = useState('Balanced');
  const [lightingPref, setLightingPref] = useState('Natural Light');
  const [layoutPriority, setLayoutPriority] = useState('Circulation');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onSubmit(design.id, {
      style,
      budgetOffset,
      roomPriority,
      furniturePref,
      lightingPref,
      layoutPriority
    });
    setIsSubmitting(false);
    onClose();
  };

  const handleReset = () => {
    setStyle(design.style);
    setBudgetOffset(0);
    setRoomPriority('Family Comfort');
    setFurniturePref('Balanced');
    setLightingPref('Natural Light');
    setLayoutPriority('Circulation');
  };

  const SelectionChip = ({ label, current, setter }: { label: string, current: string, setter: (val: string) => void }) => {
    const isSelected = current === label;
    return (
      <button
        type="button"
        onClick={() => setter(label)}
        className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border shadow-sm ${
          isSelected 
            ? 'bg-blue-600 text-white border-blue-600 shadow-blue-500/30' 
            : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900'
        }`}
      >
        {label}
      </button>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-gray-900/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] w-full max-w-4xl overflow-hidden animate-slide-up my-auto border border-gray-100 flex flex-col max-h-full">
        
        {/* Header */}
        <div className="border-b border-gray-100 flex items-center justify-between p-6 bg-white sticky top-0 z-10">
          <div>
            <h3 className="font-extrabold text-gray-900 text-2xl tracking-tight leading-tight">Iterate Layout</h3>
            <p className="text-sm text-gray-500 font-medium mt-1">Adjust parameters for <span className="text-blue-600 font-bold">{design.title}</span></p>
          </div>
          <button onClick={onClose} className="p-2 bg-gray-50 rounded-full text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-y-auto">
          <div className="p-8 space-y-10">
            
            {/* Grid Layout for Forms */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              
              {/* Left Column */}
              <div className="space-y-10">
                
                {/* Style Select */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-extrabold text-gray-800 uppercase tracking-widest mb-3">
                    <span className="w-2 h-4 bg-blue-500 rounded-full"></span> Design Style
                  </label>
                  <select 
                    value={style}
                    onChange={(e) => setStyle(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm font-bold rounded-xl py-3.5 px-4 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all shadow-inner appearance-none cursor-pointer"
                  >
                    <option value="Modern Minimal">Modern Minimal</option>
                    <option value="Warm Scandinavian">Warm Scandinavian</option>
                    <option value="Contemporary Compact">Contemporary Compact</option>
                    <option value="Luxury Elegant">Luxury Elegant</option>
                    <option value="Budget Functional">Budget Functional</option>
                  </select>
                </div>

                {/* Lighting Priority */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-extrabold text-gray-800 uppercase tracking-widest mb-3">
                     <span className="w-2 h-4 bg-yellow-400 rounded-full"></span> Lighting Mood
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <SelectionChip label="Natural Light" current={lightingPref} setter={setLightingPref} />
                    <SelectionChip label="Warm Cozy" current={lightingPref} setter={setLightingPref} />
                    <SelectionChip label="Bright Functional" current={lightingPref} setter={setLightingPref} />
                  </div>
                </div>

                {/* Layout Priority */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-extrabold text-gray-800 uppercase tracking-widest mb-3">
                    <span className="w-2 h-4 bg-purple-500 rounded-full"></span> Spatial Priority
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <SelectionChip label="Maximize Space" current={layoutPriority} setter={setLayoutPriority} />
                    <SelectionChip label="Aesthetics" current={layoutPriority} setter={setLayoutPriority} />
                    <SelectionChip label="Circulation" current={layoutPriority} setter={setLayoutPriority} />
                    <SelectionChip label="Budget Efficiency" current={layoutPriority} setter={setLayoutPriority} />
                  </div>
                </div>

              </div>

              {/* Right Column */}
              <div className="space-y-10">
                
                {/* Budget Slider */}
                <div>
                  <label className="flex items-center justify-between text-sm font-extrabold text-gray-800 uppercase tracking-widest mb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-4 bg-green-500 rounded-full"></span> Budget Adjustment
                    </div>
                    <span className={`font-mono text-base px-3 py-1 rounded-lg ${budgetOffset > 0 ? 'bg-red-50 text-red-700' : budgetOffset < 0 ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                      {budgetOffset > 0 ? '+' : ''}${budgetOffset}
                    </span>
                  </label>
                  <div className="pt-2 pb-2">
                    <input 
                      type="range" 
                      min="-10000" 
                      max="10000" 
                      step="500"
                      value={budgetOffset}
                      onChange={(e) => setBudgetOffset(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                    <div className="flex justify-between mt-2 text-xs font-bold text-gray-400">
                      <span>Reduce Cost</span>
                      <span>Target Base</span>
                      <span>Increase Quality</span>
                    </div>
                  </div>
                </div>

                {/* Primary Room Usage */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-extrabold text-gray-800 uppercase tracking-widest mb-3">
                     <span className="w-2 h-4 bg-indigo-500 rounded-full"></span> Core Usage Function
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <SelectionChip label="Family Comfort" current={roomPriority} setter={setRoomPriority} />
                    <SelectionChip label="Guest Hosting" current={roomPriority} setter={setRoomPriority} />
                    <SelectionChip label="Workspace" current={roomPriority} setter={setRoomPriority} />
                    <SelectionChip label="Storage Optimization" current={roomPriority} setter={setRoomPriority} />
                  </div>
                </div>

                {/* Furniture Grade */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-extrabold text-gray-800 uppercase tracking-widest mb-3">
                    <span className="w-2 h-4 bg-orange-400 rounded-full"></span> Furnishing Tier
                  </label>
                  <div className="flex bg-gray-100 p-1 rounded-xl shadow-inner border border-gray-200">
                    {['Essential Only', 'Balanced', 'Premium'].map((tier) => (
                      <button
                        key={tier}
                        type="button"
                        onClick={() => setFurniturePref(tier)}
                        className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
                          furniturePref === tier
                            ? 'bg-white text-gray-900 shadow-sm border border-gray-200/50'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        {tier}
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex justify-between items-center p-6 border-t border-gray-100 bg-gray-50 mt-auto shrink-0 rounded-b-2xl">
            <button 
              type="button" 
              onClick={handleReset}
              className="px-5 py-2.5 font-bold text-gray-500 hover:text-gray-900 hover:bg-gray-200 rounded-xl transition-all text-sm uppercase tracking-wider"
            >
              Reset Defaults
            </button>
            <div className="flex gap-3">
              <button 
                type="button" 
                onClick={onClose}
                className="px-6 py-3 font-bold text-gray-700 bg-white border border-gray-200 shadow-sm hover:bg-gray-50 hover:border-gray-300 rounded-xl transition-all"
              >
                Cancel
              </button>
              <button 
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all shadow-[0_4px_14px_0_rgba(0,0,0,0.15)] flex items-center gap-2 overflow-hidden relative group"
              >
                {isSubmitting ? (
                  <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Recomputing...</>
                ) : (
                  <>
                    <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-black"></span>
                    <span className="relative">Apply Iteration</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
