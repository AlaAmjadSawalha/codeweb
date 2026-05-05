import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { formatCost } from '../lib/designUtils';
import { DesignScoreBadge } from '../components/design/DesignScoreBadge';
import { getDesignById, saveDesign, editDesign, regenerateDesign } from '../services/designService';
import { DesignResult } from '../types/design';
import { DesignEditModal } from '../components/design/DesignEditModal';
import { SafeImage } from '../components/ui/SafeImage';

export const DesignDetailsPage = ({ setPage }: { setPage?: (page: string) => void }) => {
  const { designId } = useParams();
  const navigate = useNavigate();

  const [design, setDesign] = useState<DesignResult | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  
  // Local state for interactive actions
  const [isSaved, setIsSaved] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  // Edit logic
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    const fetchDesign = async () => {
      if (!designId) {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        const item = await getDesignById(designId);
        setDesign(item);
        if (item) setIsSaved(item.isSaved);
      } catch (err) {
        console.error("Failed to load design.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchDesign();
  }, [designId]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleToggleSave = async () => {
    if (!designId) return;
    setIsSaved(!isSaved); // Optimistic UI update
    const success = await saveDesign(designId, isSaved);
    if (!success) {
      setIsSaved(isSaved); // Revert on failure
      showToast("Could not save to backend. Please try again.");
    } else {
      showToast(!isSaved ? "Design Saved to your library." : "Design removed from library.");
    }
  };

  const handleRegenerate = async () => {
    if (!designId) return;
    showToast("Starting AI regenerate run... (Connecting)");
    const success = await regenerateDesign(designId);
    if (success) {
      showToast("Regeneration requested. This would poll a job ID in production.");
    } else {
      showToast("Failed to initiate regeneration trigger.");
    }
  };

  const submitEdit = async (id: string, payload: any) => {
    // We update local state to reflect style instantly for the "placeholder" effect
    setDesign(prev => prev ? { ...prev, style: payload.style, estimatedCost: prev.estimatedCost + payload.budgetOffset } : prev);
    const success = await editDesign(id, payload);
    if (success) showToast("Layout parameters pushed safely!");
  };

  if (isLoading) {
    return (
      <div className="p-8 max-w-5xl mx-auto pb-16 animate-pulse mt-8">
        <div className="h-4 bg-gray-200 rounded w-24 mb-6"></div>
        <div className="flex justify-between items-end mb-8 border-b border-gray-100 pb-6">
          <div className="w-1/2">
            <div className="h-10 bg-gray-200 rounded w-3/4 mb-3"></div>
            <div className="h-5 bg-gray-100 rounded w-1/2"></div>
          </div>
          <div className="flex gap-2">
            <div className="h-10 bg-gray-200 rounded w-24"></div>
            <div className="h-10 bg-gray-200 rounded w-24"></div>
            <div className="h-10 bg-gray-200 rounded w-32"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="aspect-[4/3] bg-gray-200 rounded-xl w-full"></div>
            <div className="h-32 bg-gray-100 rounded-xl w-full"></div>
            <div className="h-48 bg-gray-100 rounded-xl w-full"></div>
          </div>
          <div className="space-y-8">
            <div className="h-40 bg-gray-100 rounded-xl w-full"></div>
            <div className="h-24 bg-gray-100 rounded-xl w-full"></div>
            <div className="h-64 bg-gray-100 rounded-xl w-full"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!design) {
    return (
      <div className="p-8 max-w-7xl mx-auto text-center py-20">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Design Not Found</h2>
        <p className="text-gray-600 mb-6">The design you are looking for does not exist or has been removed.</p>
        <button 
          onClick={() => navigate(-1)}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition"
        >
          Return to Results
        </button>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl mx-auto pb-16 relative">
      <DesignEditModal 
        design={design} 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        onSubmit={submitEdit} 
      />

      {toastMessage && (
        <div className="fixed top-4 right-4 bg-gray-900 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in-down border border-gray-700 font-medium">
          {toastMessage}
        </div>
      )}

      {/* Breadcrumb Navigation */}
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-500 hover:text-gray-900 font-medium mb-6 transition"
      >
        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
        Back to Results
      </button>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6 border-b border-gray-100 pb-8 mt-4">
        <div>
          <div className="flex items-center gap-3 mb-2.5">
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">{design.title}</h1>
            {isSaved && (
              <span className="bg-blue-50 text-blue-700 text-[10px] uppercase font-extrabold px-2.5 py-1 rounded-lg border border-blue-100 mt-1 shadow-sm">Saved</span>
            )}
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-600 font-medium">
            <span className="bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm">{design.style}</span>
            <span className="bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">Est. Cost: <span className="font-bold text-gray-900">{formatCost(design.estimatedCost)}</span></span>
            <span className="text-gray-400">•</span>
            <span>Layout: {design.metadata?.layoutType || 'Standard'}</span>
          </div>
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={handleToggleSave}
            className={`px-5 py-2.5 border rounded-xl font-semibold transition-all flex items-center gap-2 shadow-sm ${
              isSaved ? 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
            }`}
          >
            {isSaved ? 'Unsave' : 'Save'}
          </button>
          <button 
            onClick={handleRegenerate}
            className="px-5 py-2.5 border border-blue-200 bg-blue-50 text-blue-700 font-semibold rounded-xl hover:bg-blue-100 transition-all shadow-sm"
          >
            Iterate
          </button>
          <button 
            onClick={() => setIsEditModalOpen(true)}
            className="px-6 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-gray-800 font-semibold transition-all shadow-sm"
          >
            Edit Layout
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-10">
          {/* Main Preview */}
          <div className="aspect-[4/3] bg-gray-100 rounded-2xl overflow-hidden border border-gray-100 shadow-[0_8px_30px_-4px_rgba(0,0,0,0.06)] relative group">
            <SafeImage src={design.previewImage} alt={design.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
            <div className="absolute inset-0 bg-gray-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
              <button 
                onClick={() => showToast("Fullscreen view triggered")} 
                className="px-8 py-3.5 bg-white text-gray-900 rounded-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.2)] font-bold hover:scale-105 transition-transform"
              >
                Expand Canvas
              </button>
            </div>
          </div>

          {/* AI Explanation */}
          <div>
            <h2 className="text-xl font-extrabold text-gray-900 mb-4 tracking-tight flex items-center gap-2">
              <span className="w-2 h-6 bg-blue-500 rounded-full inline-block"></span>
              Philosophy
            </h2>
            <p className="text-gray-600 leading-relaxed bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.04)] font-medium">
              {design.explanation}
            </p>
          </div>

          {/* Room Allocation */}
          <div>
            <h2 className="text-xl font-extrabold text-gray-900 mb-4 tracking-tight flex items-center gap-2">
              <span className="w-2 h-6 bg-purple-500 rounded-full inline-block"></span>
              Spatial Allocation
            </h2>
            <div className="bg-white border text-sm border-gray-100 rounded-2xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.04)] overflow-hidden">
              <div className="grid grid-cols-3 bg-gray-50/80 border-b border-gray-100 p-5 font-bold text-gray-500 uppercase tracking-wider text-[11px]">
                <div>Room Name</div>
                <div>Purpose</div>
                <div className="text-right">Square Footage</div>
              </div>
              {design.roomUsage.map((room, idx) => (
                <div key={idx} className="grid grid-cols-3 border-b border-gray-100 p-4 last:border-0 items-center">
                  <div className="font-semibold text-gray-900">{room.roomName}</div>
                  <div className="text-gray-600">{room.purpose}</div>
                  <div className="text-right text-gray-600 font-mono">{room.squareFootage} sq ft</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Column */}
        <div className="space-y-8 sticky top-8">
          
          {/* AI Scores */}
          <div className="bg-white p-7 border border-gray-100 rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]">
            <h2 className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-4">Performance Metrics</h2>
            
            <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-100">
              <span className="text-gray-800 font-extrabold text-xl tracking-tight">AI Confidence</span>
              <span className="text-4xl font-extrabold text-gray-900 tracking-tighter">{design.scores.overall}<span className="text-gray-300 text-2xl font-bold tracking-normal">/100</span></span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <DesignScoreBadge label="Space Use" score={design.scores.space} />
              <DesignScoreBadge label="Lighting" score={design.scores.lighting} />
              <DesignScoreBadge label="Circulation" score={design.scores.circulation} />
              <DesignScoreBadge label="Budget Fit" score={design.scores.budget} />
            </div>
          </div>

          {/* Color Palette */}
          <div className="bg-white p-7 border border-gray-100 rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]">
            <h2 className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-5">Color Theory</h2>
            <div className="flex gap-4">
              {design.colors.map((color, idx) => (
                <div key={idx} className="flex flex-col items-center gap-3 group">
                  <div className="w-14 h-14 rounded-full shadow-[inset_0_2px_4px_rgba(0,0,0,0.1),0_2px_8px_rgba(0,0,0,0.05)] group-hover:scale-110 transition-transform cursor-pointer" style={{ backgroundColor: color }}></div>
                  <span className="text-[10px] font-mono text-gray-500 uppercase font-bold tracking-wider">{color}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Furniture */}
          <div className="bg-white p-7 border border-gray-100 rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]">
            <h2 className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-5">Key Furnishings</h2>
            <div className="space-y-5">
              {design.furnitureSuggestions.map((item) => (
                <div key={item.id} className="flex justify-between items-start border-l-[3px] border-gray-200 pl-4 py-1 hover:border-gray-400 transition-colors">
                  <div>
                    <h4 className="font-extrabold text-gray-900 text-sm mb-1">{item.name}</h4>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{item.category}</span>
                  </div>
                  <span className="text-xs font-bold text-gray-700 bg-gray-50 px-2.5 py-1 rounded-md border border-gray-100 shadow-sm">{formatCost(item.estimatedCost)}</span>
                </div>
              ))}
            </div>
            <button 
              onClick={() => showToast('Inventory View Triggered')}
              className="mt-8 w-full text-center text-sm font-bold text-gray-700 hover:text-gray-900 bg-gray-50 border border-gray-200 hover:bg-gray-100 hover:border-gray-300 transition-all py-3 rounded-xl shadow-sm"
            >
              View Full Inventory →
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

export default DesignDetailsPage;
