export interface DesignScores {
  space: number;
  lighting: number;
  circulation: number;
  budget: number;
  overall: number; // Derived or pre-calculated total score
}

export interface FurnitureSuggestion {
  id: string;
  name: string;
  category: string;
  estimatedCost: number;
  description?: string;
}

export interface RoomUsage {
  roomName: string;
  squareFootage: number;
  purpose: string;
}

export interface DesignResult {
  id: string;
  projectId: string;
  title: string;
  style: 'Modern Minimal' | 'Warm Scandinavian' | 'Contemporary Compact' | 'Budget Functional' | 'Luxury Elegant' | string;
  previewImage: string; // URL string for the preview canvas/image
  explanation: string;
  estimatedCost: number;
  scores: DesignScores;
  roomUsage: RoomUsage[];
  colors: string[]; // Hex codes or color names
  furnitureSuggestions: FurnitureSuggestion[];
  isSaved: boolean;
  createdAt: string;
  metadata?: {
    layoutType?: string;
    isRemodel?: boolean;
    aiVersion?: string;
  };
}

export interface DesignComparisonInput {
  designIds: string[]; // Array of IDs to be compared side-by-side
}
