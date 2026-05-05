<?php

namespace App\Http\Controllers\API\Module;

use App\Http\Controllers\Controller;
use App\Models\Design;
use App\Models\Project;
use App\Support\ModuleApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class ModuleDesignController extends Controller
{
    public function index(Request $request, int $projectId): JsonResponse
    {
        $project = $this->authorizedProject($request, $projectId);
        if ($project instanceof JsonResponse) return $project;

        $designs = Design::where('project_id', $projectId)
            ->orderByDesc('created_at')
            ->get();

        return ModuleApiResponse::success('Designs loaded.', $designs->toArray());
    }

    public function store(Request $request, int $projectId): JsonResponse
    {
        $project = $this->authorizedProject($request, $projectId);
        if ($project instanceof JsonResponse) return $project;

        $validator = Validator::make($request->all(), [
            'title'            => ['required', 'string', 'max:255'],
            'description'      => ['required', 'string'],
            'image_url'        => ['nullable', 'string'],
            'overall_score'    => ['nullable', 'integer', 'min:0', 'max:100'],
            'score_space'      => ['nullable', 'numeric'],
            'score_lighting'   => ['nullable', 'numeric'],
            'score_circulation'=> ['nullable', 'numeric'],
            'score_budget'     => ['nullable', 'numeric'],
            'score_functional' => ['nullable', 'numeric'],
            'cost_estimate'    => ['nullable', 'array'],
            'metadata'         => ['nullable', 'array'],
        ]);

        if ($validator->fails()) {
            return ModuleApiResponse::error($validator->errors()->first(), 400, 400);
        }

        $design = Design::create(array_merge(
            $validator->validated(),
            ['project_id' => $projectId]
        ));

        return ModuleApiResponse::success('Design saved.', $design->toArray(), 201);
    }

    public function show(Request $request, int $projectId, int $designId): JsonResponse
    {
        $project = $this->authorizedProject($request, $projectId);
        if ($project instanceof JsonResponse) return $project;

        $design = Design::where('project_id', $projectId)->find($designId);
        if (!$design) {
            return ModuleApiResponse::error('Design not found.', 404, 404);
        }

        return ModuleApiResponse::success('Design loaded.', $design->toArray());
    }

    public function select(Request $request, int $projectId, int $designId): JsonResponse
    {
        $project = $this->authorizedProject($request, $projectId);
        if ($project instanceof JsonResponse) return $project;

        $design = Design::where('project_id', $projectId)->find($designId);
        if (!$design) {
            return ModuleApiResponse::error('Design not found.', 404, 404);
        }

        DB::transaction(function () use ($projectId, $design) {
            Design::where('project_id', $projectId)->update(['is_selected' => false]);
            $design->update(['is_selected' => true]);
        });

        return ModuleApiResponse::success('Design selected.', $design->fresh()->toArray());
    }

    public function compare(Request $request, int $projectId): JsonResponse
    {
        $project = $this->authorizedProject($request, $projectId);
        if ($project instanceof JsonResponse) return $project;

        $validator = Validator::make($request->all(), [
            'design_a_id' => ['required', 'integer'],
            'design_b_id' => ['required', 'integer'],
        ]);

        if ($validator->fails()) {
            return ModuleApiResponse::error($validator->errors()->first(), 400, 400);
        }

        $designA = Design::where('project_id', $projectId)->find($request->design_a_id);
        $designB = Design::where('project_id', $projectId)->find($request->design_b_id);

        if (!$designA || !$designB) {
            return ModuleApiResponse::error('One or both designs not found.', 404, 404);
        }

        return ModuleApiResponse::success('Comparison loaded.', [
            'design_a' => $designA->toArray(),
            'design_b' => $designB->toArray(),
        ]);
    }

    public function destroy(Request $request, int $projectId, int $designId): JsonResponse
    {
        $project = $this->authorizedProject($request, $projectId);
        if ($project instanceof JsonResponse) return $project;

        $design = Design::where('project_id', $projectId)->find($designId);
        if (!$design) {
            return ModuleApiResponse::error('Design not found.', 404, 404);
        }

        $design->delete();

        return ModuleApiResponse::success('Design deleted.', []);
    }

    public function generate(Request $request, int $projectId): JsonResponse
    {
        $project = $this->authorizedProject($request, $projectId);
        if ($project instanceof JsonResponse) return $project;

        Design::where('project_id', $projectId)->delete();

        $demos = [
            [
                'title'             => 'Modern Minimalist',
                'description'       => 'Clean lines, neutral palette, and open-plan flow. Maximises natural light with floor-to-ceiling glazing and multi-functional furniture.',
                'overall_score'     => 91,
                'score_space'       => 92.5,
                'score_lighting'    => 94.0,
                'score_circulation' => 89.0,
                'score_budget'      => 87.5,
                'score_functional'  => 93.0,
                'cost_estimate'     => ['furniture' => 12000, 'demolition' => 1500, 'materials' => 8500, 'labor' => 6000, 'total' => 28000],
                'metadata'          => ['style' => 'minimalist', 'palette' => 'neutral', 'ai_version' => 'demo'],
            ],
            [
                'title'             => 'Industrial Loft',
                'description'       => 'Exposed brick, raw steel accents, and warm Edison lighting. Combines open storage with statement furniture pieces.',
                'overall_score'     => 84,
                'score_space'       => 80.0,
                'score_lighting'    => 85.5,
                'score_circulation' => 82.0,
                'score_budget'      => 91.0,
                'score_functional'  => 83.0,
                'cost_estimate'     => ['furniture' => 9500, 'demolition' => 3000, 'materials' => 7000, 'labor' => 5500, 'total' => 25000],
                'metadata'          => ['style' => 'industrial', 'palette' => 'warm-grey', 'ai_version' => 'demo'],
            ],
            [
                'title'             => 'Scandinavian Warmth',
                'description'       => 'Hygge-inspired with light woods, soft textiles, and indoor greenery. Emphasises comfort and biophilic connection.',
                'overall_score'     => 88,
                'score_space'       => 86.0,
                'score_lighting'    => 90.0,
                'score_circulation' => 88.5,
                'score_budget'      => 84.0,
                'score_functional'  => 90.5,
                'cost_estimate'     => ['furniture' => 10500, 'demolition' => 1000, 'materials' => 9000, 'labor' => 5800, 'total' => 26300],
                'metadata'          => ['style' => 'scandinavian', 'palette' => 'light-wood', 'ai_version' => 'demo'],
            ],
        ];

        $created = [];
        foreach ($demos as $data) {
            $created[] = Design::create(array_merge($data, ['project_id' => $projectId]))->toArray();
        }

        return ModuleApiResponse::success('Demo designs generated.', $created, 201);
    }

    private function authorizedProject(Request $request, int $projectId): Project|JsonResponse
    {
        $project = Project::find($projectId);
        if (!$project) {
            return ModuleApiResponse::error('Project not found.', 404, 404);
        }
        if ($project->user_id != $request->user()->id) {
            return ModuleApiResponse::error('You do not have access to this project.', 403, 403);
        }
        return $project;
    }
}
