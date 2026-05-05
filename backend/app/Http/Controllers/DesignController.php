<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class DesignController extends Controller
{
    /**
     * Helper to return dummy data matching the frontend's expected TypeScript format
     * Used as a temporary fallback while AI generation is integrated
     */
    private function getDummyDesign(string $id, string $projectId = 'demo-project'): array
    {
        return [
            'id' => $id,
            'project_id' => $projectId,
            'title' => 'Mock AI Design ' . strtoupper(substr($id, -3)),
            'style' => 'Modern Minimal',
            'preview_image' => '/api/placeholder/800/600',
            'explanation' => 'This is a sample layout explanation coming from the Laravel backend. AI functionality is pending.',
            'estimated_cost' => 12500,
            'scores' => [
                'space' => 90,
                'lighting' => 85,
                'circulation' => 88,
                'budget' => 75,
                'overall' => 85
            ],
            'room_usage' => [
                ['roomName' => 'Living Room', 'squareFootage' => 320, 'purpose' => 'Relaxation']
            ],
            'colors' => ['#F9FAFB', '#374151', '#D1D5DB'],
            'furniture_suggestions' => [
                ['id' => 'f-1', 'name' => 'Sofa', 'category' => 'Seating', 'estimatedCost' => 1200]
            ],
            'is_saved' => false,
            'created_at' => now()->toIso8601String(),
            'metadata' => ['layoutType' => 'Open Plan']
        ];
    }

    /**
     * GET /api/projects/{projectId}/designs
     * Return all design results for a specific project
     */
    public function index(string $projectId): JsonResponse
    {
        // In the future: return Design::where('project_id', $projectId)->get();
        return response()->json([
            'status' => 'success',
            'data' => [
                $this->getDummyDesign('design-101', $projectId),
                $this->getDummyDesign('design-102', $projectId),
                $this->getDummyDesign('design-103', $projectId)
            ]
        ]);
    }

    /**
     * GET /api/designs/{id}
     * Return a specific design result
     */
    public function show(string $id): JsonResponse
    {
        // In the future: return Design::findOrFail($id);
        return response()->json([
            'status' => 'success',
            'data' => $this->getDummyDesign($id)
        ]);
    }

    /**
     * POST /api/designs/{id}/save
     * Mark a design as saved or toggle its state
     */
    public function toggleSave(string $id): JsonResponse
    {
        // In the future: toggle the boolean is_saved flag and save()
        return response()->json([
            'status' => 'success',
            'message' => 'Design save state toggled successfully',
            'data' => ['id' => $id, 'is_saved' => true] // Returning mock truthy state
        ]);
    }

    /**
     * POST /api/designs/compare
     * Explicit comparison endpoint 
     */
    public function compare(Request $request): JsonResponse
    {
        $request->validate([
            'design1_id' => 'required|string',
            'design2_id' => 'required|string',
        ]);

        return response()->json([
            'status' => 'success',
            'data' => [
                'design1' => $this->getDummyDesign($request->input('design1_id')),
                'design2' => $this->getDummyDesign($request->input('design2_id')),
                'comparison_insights' => [
                    'price_diff' => 'Design 1 is an estimated $4,000 cheaper',
                    'space_winner' => 'Design 2 utilizes floor space 5% better'
                ]
            ]
        ]);
    }

    /**
     * PUT /api/designs/{id}/edit
     * Start an editing session on a design
     */
    public function edit(Request $request, string $id): JsonResponse
    {
        // Accept the modal payload
        $payload = $request->validate([
            'style' => 'nullable|string',
            'budgetOffset' => 'nullable|numeric'
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Design parameters updated. AI recalculating layout for ' . $id,
            'data' => [
                'id' => $id,
                'updated_parameters' => $payload
            ]
        ]);
    }

    /**
     * POST /api/designs/{id}/regenerate
     * Trigger the AI to iterate on a given design
     */
    public function regenerate(Request $request, string $id): JsonResponse
    {
        return response()->json([
            'status' => 'processing',
            'message' => 'AI generation started. This may take a moment.',
            'job_id' => 'job-' . uniqid()
        ], 202);
    }
}
