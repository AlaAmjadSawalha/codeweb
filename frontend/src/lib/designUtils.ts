import { DesignResult } from '../types/design';
import { MOCK_DESIGNS } from '../data/mockDesigns';

/**
 * Formats a given number into a localized currency string (USD).
 * Example: 15000 -> "$15,000"
 */
export const formatCost = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(amount);
};

/**
 * Retrieves a design by its specific ID from the mock data.
 * Useful for the Design Details page.
 */
export const getDesignById = (id: string): DesignResult | undefined => {
  return MOCK_DESIGNS.find((design) => design.id === id);
};

/**
 * Retrieves all designs belonging to a specific project.
 * Useful for the Design Results page.
 */
export const getDesignsByProject = (projectId: string): DesignResult[] => {
  return MOCK_DESIGNS.filter((design) => design.projectId === projectId);
};

/**
 * Helper to get a human-readable label based on an AI score (0-100).
 */
export const getScoreLabel = (score: number): string => {
  if (score >= 90) return 'Excellent';
  if (score >= 80) return 'Great';
  if (score >= 70) return 'Good';
  if (score >= 60) return 'Fair';
  return 'Needs Improvement';
};

/**
 * Helper to determine a tailwind color class based on the score.
 */
export const getScoreColorClass = (score: number): string => {
  if (score >= 90) return 'text-green-600 bg-green-50';
  if (score >= 80) return 'text-emerald-600 bg-emerald-50';
  if (score >= 70) return 'text-yellow-600 bg-yellow-50';
  if (score >= 60) return 'text-orange-600 bg-orange-50';
  return 'text-red-600 bg-red-50';
};
