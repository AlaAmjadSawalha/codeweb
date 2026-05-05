import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { DesignResult } from '../types/design';
import { getDesignsByProject, saveDesign, editDesign } from '../services/designService';
import { DesignCard } from '../components/design/DesignCard';
import { DesignEditModal } from '../components/design/DesignEditModal';

export const DesignResultsPage = ({ setPage }: { setPage?: (page: string) => void }) => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  
  // State
  const [designs, setDesigns] = useState<DesignResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedForCompare, setSelectedForCompare] = useState<string[]>([]);
  const [editMessage, setEditMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchDesigns = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const fetchedDesigns = await getDesignsByProject(projectId || 'demo-project');
        setDesigns(fetchedDesigns || []);
      } catch (err) {
        setError('Failed to load designs.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchDesigns();
  }, [projectId]);

  // Handlers
  const handleSaveToggle = async (id: string) => {
    // Find the design
    const design = designs.find((d) => d.id === id);
    if (!design) return;

    // Optimistically toggle state
    setDesigns(prevDesigns => 
      prevDesigns.map(d => d.id === id ? { ...d, isSaved: !d.isSaved } : d)
    );

    // Persist via Service API
    const success = await saveDesign(id, design.isSaved);
    
    // If backend failed, revert state (safe fallback)
    if (!success) {
      setDesigns(prevDesigns => 
        prevDesigns.map(d => d.id === id ? { ...d, isSaved: design.isSaved } : d)
      );
    }
  };

  const handleCompareToggle = (id: string) => {
    setSelectedForCompare(prev => {
      if (prev.includes(id)) {
        return prev.filter(compareId => compareId !== id);
      }
      if (prev.length < 2) {
        return [...prev, id];
      }
      return prev;
    });
  };

  // Edit State
  const [editingDesignId, setEditingDesignId] = useState<string | null>(null);

  const handleEdit = (id: string) => setEditingDesignId(id);

  const submitEdit = async (id: string, payload: any) => {
    // Optimistic UI fallback update
    setDesigns(prevDesigns => prevDesigns.map(d => 
      d.id === id ? { ...d, style: payload.style, estimatedCost: d.estimatedCost + payload.budgetOffset } : d
    ));
    
    const success = await editDesign(id, payload);
    if (success) {
      setEditMessage(`Design parameters updated safely!`);
    } else {
      setEditMessage("Failed to connect to backend. Showing mock state update.");
    }
    setTimeout(() => setEditMessage(null), 3500);
  };

  const executeCompare = () => {
    if (selectedForCompare.length === 2) {
      navigate(`/compare?d1=${selectedForCompare[0]}&d2=${selectedForCompare[1]}`);
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 max-w-7xl mx-auto pb-24">
        <div className="mb-8">
          <div className="h-10 bg-gray-200 rounded w-1/4 mb-4 animate-pulse"></div>
          <div className="h-4 bg-gray-100 rounded w-1/3 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm h-[500px] animate-pulse">
              <div className="aspect-[4/3] bg-gray-200 w-full border-b border-gray-100"></div>
              <div className="p-5 flex-1 flex flex-col gap-4">
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-100 rounded w-full"></div>
                <div className="h-4 bg-gray-100 rounded w-2/3"></div>
                <div className="mt-auto grid grid-cols-4 gap-2">
                  <div className="h-12 bg-gray-50 rounded"></div>
                  <div className="h-12 bg-gray-50 rounded"></div>
                  <div className="h-12 bg-gray-50 rounded"></div>
                  <div className="h-12 bg-gray-50 rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (designs.length === 0) {
    return (
      <div className="p-8 max-w-7xl mx-auto text-center py-20">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">No Designs Found</h2>
        <p className="text-gray-600 mb-6">We couldn't find any generated designs for this project.</p>
        <Link to={`/projects/${projectId || 'demo'}/new`} className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition">
          Start New Generation
        </Link>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto pb-24">
      {editingDesignId && (
        <DesignEditModal 
          design={designs.find(d => d.id === editingDesignId)!}
          isOpen={!!editingDesignId}
          onClose={() => setEditingDesignId(null)}
          onSubmit={submitEdit}
        />
      )}

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Design Results</h1>
        <p className="text-gray-600">
          Showing AI-generated layouts for Project: <span className="font-semibold text-gray-900">{projectId || 'Demo Project'}</span>
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 rounded-r-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700 font-medium">Network Error: {error}</p>
              <p className="text-sm text-red-600 mt-1">Falling back to robust mock layout configurations to ensure demonstration fluidity.</p>
            </div>
          </div>
        </div>
      )}

      {/* Temporary Toast */}
      {editMessage && (
        <div className="fixed top-4 right-4 bg-gray-900 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-3 animate-fade-in-down">
          <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          {editMessage}
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {designs.map(design => (
          <DesignCard 
            key={design.id}
            design={design}
            isComparing={selectedForCompare.length >= 2}
            isSelectedForCompare={selectedForCompare.includes(design.id)}
            onSaveToggle={handleSaveToggle}
            onCompareToggle={handleCompareToggle}
            onEdit={handleEdit}
          />
        ))}
      </div>

      {/* Sticky Compare Action Bar */}
      {selectedForCompare.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] p-4 transform transition-transform z-40">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 text-blue-800 font-bold w-10 h-10 flex items-center justify-center rounded-full">
                {selectedForCompare.length}/2
              </div>
              <div>
                <p className="font-semibold text-gray-900">Designs selected for comparison</p>
                <p className="text-sm text-gray-500">
                  {selectedForCompare.length === 1 
                    ? 'Select one more design to compare.' 
                    : 'Ready to compare!'}
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => setSelectedForCompare([])}
                className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium transition"
              >
                Clear
              </button>
              <button 
                onClick={executeCompare}
                disabled={selectedForCompare.length !== 2}
                className={`px-6 py-2 rounded-lg font-medium shadow-sm transition ${
                  selectedForCompare.length === 2 
                    ? 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow' 
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                Compare Designs
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DesignResultsPage;
