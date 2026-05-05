import { DesignResult } from '../types/design';
import { getDesignsByProject as mockGetDesigns, getDesignById as mockGetById } from '../lib/designUtils';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';

/**
 * Normalizes backend JSON response structure.
 * Validates 'data' wrapper if it exists (Laravel convention).
 */
const extractData = (responseJson: any) => {
  return responseJson.data !== undefined ? responseJson.data : responseJson;
};

/**
 * Fetch all designs sequentially, falling back to mock block if server is unreachable.
 */
export const getDesignsByProject = async (projectId: string): Promise<DesignResult[]> => {
  try {
    const res = await fetch(`${BASE_URL}/projects/${projectId}/designs`);
    if (!res.ok) throw new Error('API down');
    const json = await res.json();
    return extractData(json);
  } catch (err) {
    console.warn(`[getDesignsByProject] Backend unreachable. Using mock fallback for projectId: ${projectId}.`);
    return mockGetDesigns(projectId);
  }
};

/**
 * Fetch specific design result, falling back to mock block if server is unreachable.
 */
export const getDesignById = async (designId: string): Promise<DesignResult | undefined> => {
  try {
    const res = await fetch(`${BASE_URL}/designs/${designId}`);
    if (!res.ok) throw new Error('API down');
    const json = await res.json();
    return extractData(json);
  } catch (err) {
    console.warn(`[getDesignById] Backend unreachable. Using mock fallback for designId: ${designId}.`);
    return mockGetById(designId);
  }
};

/**
 * Compare two designs, returning standard array or object payload.
 */
export const compareDesigns = async (d1Id: string, d2Id: string): Promise<{design1?: DesignResult, design2?: DesignResult}> => {
  try {
    const res = await fetch(`${BASE_URL}/designs/compare`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ design1_id: d1Id, design2_id: d2Id })
    });
    if (!res.ok) throw new Error('API down');
    const json = await res.json();
    return extractData(json);
  } catch (err) {
    console.warn(`[compareDesigns] Backend unreachable. Constructing local mock comparison.`);
    return {
      design1: mockGetById(d1Id),
      design2: mockGetById(d2Id)
    };
  }
};

/**
 * Toggle the save status. Fallback safely returns the toggled boolean.
 */
export const saveDesign = async (designId: string, currentState: boolean): Promise<boolean> => {
  try {
    const res = await fetch(`${BASE_URL}/designs/${designId}/save`, { method: 'POST' });
    if (!res.ok) throw new Error('API down');
    return true; // Assume success saves it
  } catch (err) {
    console.warn(`[saveDesign] Backend unreachable. Toggling mock UI state locally.`);
    return !currentState;
  }
};

/**
 * Trigger an editing session placeholder.
 */
export const editDesign = async (designId: string, payload: any = {}): Promise<boolean> => {
  try {
    const res = await fetch(`${BASE_URL}/designs/${designId}/edit`, { 
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.ok;
  } catch (err) {
    console.warn(`[editDesign] Backend down. Proceeding locally.`);
    return true;
  }
};

/**
 * Trigger regenerative AI trigger placeholder.
 */
export const regenerateDesign = async (designId: string): Promise<boolean> => {
  try {
    const res = await fetch(`${BASE_URL}/designs/${designId}/regenerate`, { method: 'POST' });
    return res.ok || res.status === 202;
  } catch (err) {
    console.warn(`[regenerateDesign] Backend down. Proceeding locally.`);
    return true;
  }
};
