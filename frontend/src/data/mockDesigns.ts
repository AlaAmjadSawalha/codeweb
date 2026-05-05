import { DesignResult } from '../types/design';

export const MOCK_DESIGNS: DesignResult[] = [
  {
    id: 'design-101',
    projectId: 'demo-project',
    title: 'Open Concept Oasis',
    style: 'Modern Minimal',
    previewImage: '/api/placeholder/800/600', // Uses a generic placeholder for early UI tests
    explanation: 'A spacious, minimal layout that emphasizes natural lighting and open circulation. Walls have been minimized in the living areas to promote a free-flowing environment.',
    estimatedCost: 14500,
    scores: {
      space: 92,
      lighting: 95,
      circulation: 88,
      budget: 72,
      overall: 87
    },
    roomUsage: [
      { roomName: 'Living Room', squareFootage: 320, purpose: 'Entertainment & Relaxation' },
      { roomName: 'Kitchen', squareFootage: 210, purpose: 'Cooking & Dining' }
    ],
    colors: ['#F9FAFB', '#374151', '#D1D5DB'],
    furnitureSuggestions: [
      { id: 'f-1', name: 'Low-profile Sectional', category: 'Seating', estimatedCost: 1200 },
      { id: 'f-2', name: 'Glass Coffee Table', category: 'Table', estimatedCost: 350 }
    ],
    isSaved: true,
    createdAt: new Date().toISOString(),
    metadata: { layoutType: 'Open Plan' }
  },
  {
    id: 'design-102',
    projectId: 'demo-project',
    title: 'Cozy Nordic Retreat',
    style: 'Warm Scandinavian',
    previewImage: '/api/placeholder/800/600',
    explanation: 'Focuses on warmth and natural materials. Features dedicated cozy nooks while maintaining a highly functional kitchen and dining space perfect for families.',
    estimatedCost: 18200,
    scores: {
      space: 85,
      lighting: 90,
      circulation: 82,
      budget: 65,
      overall: 81
    },
    roomUsage: [
      { roomName: 'Living Area', squareFootage: 280, purpose: 'Family Gathering' },
      { roomName: 'Dining Nook', squareFootage: 120, purpose: 'Dining' }
    ],
    colors: ['#FFFFFF', '#D2B48C', '#8FBC8F'],
    furnitureSuggestions: [
      { id: 'f-3', name: 'Oak Dining Table', category: 'Table', estimatedCost: 850 },
      { id: 'f-4', name: 'Woven Lounge Chair', category: 'Seating', estimatedCost: 400 }
    ],
    isSaved: false,
    createdAt: new Date().toISOString(),
    metadata: { layoutType: 'Segmented' }
  },
  {
    id: 'design-103',
    projectId: 'demo-project',
    title: 'Efficient Urban Micro',
    style: 'Contemporary Compact',
    previewImage: '/api/placeholder/800/600',
    explanation: 'Optimized for smaller square footage. Utilizes multi-functional zones and vertical storage to maximize utility without feeling cramped. Highly budget-friendly.',
    estimatedCost: 8500,
    scores: {
      space: 95, // High score because it uses space efficiently
      lighting: 78,
      circulation: 75,
      budget: 98,
      overall: 86
    },
    roomUsage: [
      { roomName: 'Studio Room', squareFootage: 400, purpose: 'Multi-purpose Living/Sleeping' }
    ],
    colors: ['#F3F4F6', '#1F2937', '#FCD34D'],
    furnitureSuggestions: [
      { id: 'f-5', name: 'Sofa Bed', category: 'Multi-use Seating', estimatedCost: 950 },
      { id: 'f-6', name: 'Fold-down Desk', category: 'Workspace', estimatedCost: 200 }
    ],
    isSaved: false,
    createdAt: new Date().toISOString(),
    metadata: { layoutType: 'Studio' }
  },
  {
    id: 'design-104',
    projectId: 'demo-project',
    title: 'Executive Grandeur',
    style: 'Luxury Elegant',
    previewImage: '/api/placeholder/800/600',
    explanation: 'A high-end configuration that prioritizes aesthetics, large entertainment spaces, and premium material integrations. Features a massive kitchen island and a dramatic entryway.',
    estimatedCost: 45000,
    scores: {
      space: 88,
      lighting: 92,
      circulation: 95,
      budget: 45, // Low budget score means it's expensive
      overall: 80
    },
    roomUsage: [
      { roomName: 'Grand Hall', squareFootage: 450, purpose: 'Entrance & Reception' },
      { roomName: 'Chef Kitchen', squareFootage: 380, purpose: 'Cooking & Ambiance' }
    ],
    colors: ['#000000', '#F5F5DC', '#FFD700'],
    furnitureSuggestions: [
      { id: 'f-7', name: 'Marble Island Counter', category: 'Fixture', estimatedCost: 5500 },
      { id: 'f-8', name: 'Velvet Sofa', category: 'Seating', estimatedCost: 2800 }
    ],
    isSaved: true,
    createdAt: new Date().toISOString(),
    metadata: { layoutType: 'Expansive' }
  }
];
