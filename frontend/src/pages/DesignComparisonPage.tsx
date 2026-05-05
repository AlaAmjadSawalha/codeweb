import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { formatCost, getScoreColorClass } from '../lib/designUtils';
import { compareDesigns } from '../services/designService';
import { SafeImage } from '../components/ui/SafeImage';

const ComparisonMetricRow = ({ 
  label, 
  val1, 
  val2, 
  isScore = false 
}: { 
  label: string, 
  val1: string | number, 
  val2: string | number,
  isScore?: boolean
}) => {
  // Simple heuristic to bold the better score
  const v1 = Number(val1);
  const v2 = Number(val2);
  const v1Better = isScore && v1 > v2;
  const v2Better = isScore && v2 > v1;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 py-4 md:py-5 border-b border-gray-100 last:border-0 hover:bg-gray-50/80 transition-colors items-center px-6">
      <div className="md:col-span-1 font-bold text-gray-700 text-sm tracking-wide mb-2 md:mb-0">
        {label}
      </div>
      <div className="md:col-span-1 mb-2 md:mb-0 transition-transform hover:scale-[1.02]">
        {isScore ? (
          <span className={`inline-flex items-center justify-center px-3 py-1.5 rounded-lg font-bold text-sm shadow-sm border border-white/40 ${v1Better ? 'ring-2 ring-offset-1 ring-blue-400 scale-105' : ''} ${getScoreColorClass(v1)}`}>
            {val1}/100
          </span>
        ) : (
          <span className="text-gray-600 font-medium">{val1}</span>
        )}
      </div>
      <div className="md:col-span-1 transition-transform hover:scale-[1.02]">
        {isScore ? (
          <span className={`inline-flex items-center justify-center px-3 py-1.5 rounded-lg font-bold text-sm shadow-sm border border-white/40 ${v2Better ? 'ring-2 ring-offset-1 ring-blue-400 scale-105' : ''} ${getScoreColorClass(v2)}`}>
            {val2}/100
          </span>
        ) : (
          <span className="text-gray-600 font-medium">{val2}</span>
        )}
      </div>
    </div>
  );
};

export const DesignComparisonPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const d1Id = searchParams.get('d1');
  const d2Id = searchParams.get('d2');

  const [design1, setDesign1] = useState<any>(undefined);
  const [design2, setDesign2] = useState<any>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchComparison = async () => {
      if (!d1Id || !d2Id) {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        const result = await compareDesigns(d1Id, d2Id);
        setDesign1(result.design1);
        setDesign2(result.design2);
      } catch (err) {
        console.error("Comparison fetch failed.", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchComparison();
  }, [d1Id, d2Id]);

  if (isLoading) {
    return (
      <div className="p-8 max-w-7xl mx-auto pb-16 animate-pulse mt-8">
        <div className="h-10 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="h-4 bg-gray-100 rounded w-1/3 mb-8"></div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden h-[600px] flex">
          <div className="w-1/3 bg-gray-50 border-r border-gray-100 p-6 flex flex-col gap-4">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-8"></div>
            {[1,2,3,4,5].map(i => <div key={i} className="h-10 bg-gray-200 rounded w-full"></div>)}
          </div>
          <div className="w-1/3 border-r border-gray-100 p-6 flex flex-col gap-4">
            <div className="aspect-[4/3] bg-gray-200 rounded-lg w-full mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-20 bg-gray-100 rounded w-full mb-4"></div>
          </div>
          <div className="w-1/3 p-6 flex flex-col gap-4">
            <div className="aspect-[4/3] bg-gray-200 rounded-lg w-full mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-20 bg-gray-100 rounded w-full mb-4"></div>
          </div>
        </div>
      </div>
    );
  }

  // Empty state if invalid configuration or designs not found
  if (!design1 || !design2) {
    return (
      <div className="p-8 max-w-7xl mx-auto text-center py-20">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Invalid Comparison</h2>
        <p className="text-gray-600 mb-6">Please select exactly two designs from the results page to compare them side by side.</p>
        <button 
          onClick={() => navigate(-1)}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">Compare Designs</h1>
          <p className="text-gray-500 font-medium">
            Side-by-side analysis of your selected layouts.
          </p>
        </div>
        <button 
          onClick={() => navigate(-1)}
          className="px-5 py-2.5 border border-gray-200 bg-white text-gray-700 font-semibold rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm self-start md:self-auto"
        >
          Back to Results
        </button>
      </div>

      <div className="flex flex-col gap-8">
        {/* Top Hero Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <div className="bg-white rounded-2xl shadow-[0_8px_30px_-4px_rgba(0,0,0,0.06)] border border-gray-100 p-8 flex flex-col relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-blue-500"></div>
            <div className="aspect-[4/3] bg-gray-100 rounded-xl mb-6 overflow-hidden shadow-inner hover:opacity-90 transition relative">
              <SafeImage src={design1.previewImage} alt={design1.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
              <div className="absolute absolute top-3 left-3 bg-blue-50 text-blue-700 border border-blue-100 text-[10px] uppercase font-extrabold px-3 py-1.5 rounded-lg shadow-sm tracking-wider">
                Option A
              </div>
            </div>
            
            <h2 className="text-2xl font-extrabold text-gray-900 leading-tight mb-3 tracking-tight">{design1.title}</h2>
            <p className="text-sm text-gray-500 mb-6 leading-relaxed line-clamp-3">{design1.explanation}</p>
            <Link to={`/design/${design1.id}`} className="mt-auto w-full py-3.5 bg-gray-900 text-white border border-transparent text-center rounded-xl hover:bg-gray-800 transition-all shadow-md hover:shadow-lg text-sm font-bold">
              View Specs
            </Link>
          </div>

          <div className="bg-white rounded-2xl shadow-[0_8px_30px_-4px_rgba(0,0,0,0.06)] border border-gray-100 p-8 flex flex-col relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-purple-500"></div>
            <div className="aspect-[4/3] bg-gray-100 rounded-xl mb-6 overflow-hidden shadow-inner hover:opacity-90 transition relative">
              <SafeImage src={design2.previewImage} alt={design2.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
              <div className="absolute absolute top-3 left-3 bg-purple-50 text-purple-700 border border-purple-100 text-[10px] uppercase font-extrabold px-3 py-1.5 rounded-lg shadow-sm tracking-wider">
                Option B
              </div>
            </div>
            
            <h2 className="text-2xl font-extrabold text-gray-900 leading-tight mb-3 tracking-tight">{design2.title}</h2>
            <p className="text-sm text-gray-500 mb-6 leading-relaxed line-clamp-3">{design2.explanation}</p>
            <Link to={`/design/${design2.id}`} className="mt-auto w-full py-3.5 bg-gray-900 text-white border border-transparent text-center rounded-xl hover:bg-gray-800 transition-all shadow-md hover:shadow-lg text-sm font-bold">
              View Specs
            </Link>
          </div>
        </div>

        {/* Data Sections */}
        <div className="bg-white rounded-2xl shadow-[0_8px_30px_-4px_rgba(0,0,0,0.06)] border border-gray-100 overflow-hidden">
          
          <div className="bg-gray-50/80 px-8 py-5 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-sm tracking-widest uppercase text-gray-800 font-extrabold">Fundamental Specs</h3>
          </div>
          <div className="flex flex-col p-2">
            <ComparisonMetricRow label="Design Style" val1={design1.style} val2={design2.style} />
            <ComparisonMetricRow label="Est. Cost" val1={formatCost(design1.estimatedCost)} val2={formatCost(design2.estimatedCost)} />
          </div>

          <div className="bg-gray-50/80 px-8 py-5 border-y border-gray-100 flex items-center gap-3">
            <span className="w-2.5 h-2.5 bg-blue-500 rounded-full inline-block shadow-sm"></span>
            <h3 className="text-sm tracking-widest uppercase text-gray-800 font-extrabold">AI Scoring Analysis</h3>
          </div>
          <div className="flex flex-col p-2">
            <ComparisonMetricRow label="Overall AI Score" val1={design1.scores.overall} val2={design2.scores.overall} isScore />
            <ComparisonMetricRow label="Space Utilization" val1={design1.scores.space} val2={design2.scores.space} isScore />
            <ComparisonMetricRow label="Natural Lighting" val1={design1.scores.lighting} val2={design2.scores.lighting} isScore />
            <ComparisonMetricRow label="Circulation Flow" val1={design1.scores.circulation} val2={design2.scores.circulation} isScore />
            <ComparisonMetricRow label="Budget Match" val1={design1.scores.budget} val2={design2.scores.budget} isScore />
          </div>

          <div className="bg-gray-50/80 px-8 py-5 border-y border-gray-100 flex items-center gap-3">
             <span className="w-2.5 h-2.5 bg-purple-500 rounded-full inline-block shadow-sm"></span>
             <h3 className="text-sm tracking-widest uppercase text-gray-800 font-extrabold">Layout Capacity</h3>
          </div>
          <div className="flex flex-col p-2">
            <ComparisonMetricRow label="Total Rooms" val1={design1.roomUsage.length.toString()} val2={design2.roomUsage.length.toString()} />
            <ComparisonMetricRow label="Notable Spaces" val1={design1.roomUsage.map((r: any) => r.roomName).join(', ')} val2={design2.roomUsage.map((r: any) => r.roomName).join(', ')} />
          </div>

          <div className="bg-gray-50/80 px-8 py-5 border-y border-gray-100 flex items-center gap-3">
            <span className="w-2.5 h-2.5 bg-gray-500 rounded-full inline-block shadow-sm"></span>
            <h3 className="text-sm tracking-widest uppercase text-gray-800 font-extrabold">Inventory Check</h3>
          </div>
          <div className="flex flex-col p-2 pb-6">
            <ComparisonMetricRow label="Key Items" val1={design1.furnitureSuggestions.map((f: any) => f.name).join(' • ')} val2={design2.furnitureSuggestions.map((f: any) => f.name).join(' • ')} />
          </div>

        </div>
      </div>
    </div>
  );
};

export default DesignComparisonPage;
