<?php

namespace App\Http\Controllers\API\Module;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\ProjectPreference;
use App\Models\User;
use App\Support\ModuleApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class ModuleProjectController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        $query = Project::query()
            ->where('user_id', $user->id)
            ->with('preferences')
            ->orderByDesc('created_at');

        $search = $request->query('search');
        if (is_string($search) && $search !== '') {
            $query->where('name', 'like', '%'.$search.'%');
        }

        $status = $request->query('status');
        if (is_string($status) && $status !== '') {
            $query->where('status', $status);
        }

        $projects = $query->get()->map(fn (Project $p) => $this->projectPayload($p));

        return ModuleApiResponse::success('Projects loaded.', $projects->all());
    }

    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => ['required', 'string', 'max:255'],
            'mode' => ['required', 'in:residential,commercial,office,other'],
        ]);

        if ($validator->fails()) {
            return ModuleApiResponse::error($validator->errors()->first(), 400, 400);
        }

        /** @var User $user */
        $user = $request->user();
        $data = $validator->validated();

        $project = Project::query()->create([
            'user_id' => $user->id,
            'name' => $data['name'],
            'mode' => $data['mode'],
            'status' => 'active',
        ]);
        $project->load('preferences');

        return ModuleApiResponse::success('Project created.', $this->projectPayload($project), 201);
    }

    public function show(Request $request, int $id): JsonResponse
    {
        $project = Project::query()->with('preferences')->find($id);
        if ($project === null) {
            return ModuleApiResponse::error('Project not found.', 404, 404);
        }

        /** @var User $user */
        $user = $request->user();
        if ((int) $project->user_id !== (int) $user->id) {
            return ModuleApiResponse::error('You do not have access to this project.', 403, 403);
        }

        return ModuleApiResponse::success('Project loaded.', $this->projectPayload($project));
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => ['sometimes', 'string', 'max:255'],
            'mode' => ['sometimes', 'in:residential,commercial,office,other'],
            'status' => ['sometimes', 'string', 'max:255'],
        ]);

        if ($validator->fails()) {
            return ModuleApiResponse::error($validator->errors()->first(), 400, 400);
        }

        $project = Project::query()->find($id);
        if ($project === null) {
            return ModuleApiResponse::error('Project not found.', 404, 404);
        }

        /** @var User $user */
        $user = $request->user();
        if ((int) $project->user_id !== (int) $user->id) {
            return ModuleApiResponse::error('You do not have access to this project.', 403, 403);
        }

        $data = array_filter($validator->validated(), static fn ($v) => $v !== null);
        if ($data !== []) {
            $project->fill($data);
            $project->save();
        }

        $project->load('preferences');

        return ModuleApiResponse::success('Project updated.', $this->projectPayload($project));
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $project = Project::query()->find($id);
        if ($project === null) {
            return ModuleApiResponse::error('Project not found.', 404, 404);
        }

        /** @var User $user */
        $user = $request->user();
        if ((int) $project->user_id !== (int) $user->id) {
            return ModuleApiResponse::error('You do not have access to this project.', 403, 403);
        }

        $project->delete();

        return ModuleApiResponse::success('Project deleted successfully.', []);
    }

    public function duplicate(Request $request, int $id): JsonResponse
    {
        $project = Project::query()->with('preferences')->find($id);
        if ($project === null) {
            return ModuleApiResponse::error('Project not found.', 404, 404);
        }

        /** @var User $user */
        $user = $request->user();
        if ((int) $project->user_id !== (int) $user->id) {
            return ModuleApiResponse::error('You do not have access to this project.', 403, 403);
        }

        $copy = DB::transaction(function () use ($project, $user) {
            $new = $project->replicate();
            $new->user_id = $user->id;
            $new->name = 'Copy of '.$project->name;
            $new->save();

            if ($project->preferences !== null) {
                $pref = $project->preferences->replicate();
                $pref->project_id = $new->id;
                $pref->save();
            }

            return $new->load('preferences');
        });

        return ModuleApiResponse::success('Project duplicated.', $this->projectPayload($copy), 201);
    }

    public function updatePreferences(Request $request, int $id): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'budget' => ['sometimes', 'nullable', 'numeric'],
            'style' => ['sometimes', 'nullable', 'string', 'max:255'],
            'colors' => ['sometimes', 'nullable', 'array'],
            'usage' => ['sometimes', 'nullable', 'string', 'max:255'],
            'furniture' => ['sometimes', 'boolean'],
        ]);

        if ($validator->fails()) {
            return ModuleApiResponse::error($validator->errors()->first(), 400, 400);
        }

        $project = Project::query()->find($id);
        if ($project === null) {
            return ModuleApiResponse::error('Project not found.', 404, 404);
        }

        /** @var User $user */
        $user = $request->user();
        if ((int) $project->user_id !== (int) $user->id) {
            return ModuleApiResponse::error('You do not have access to this project.', 403, 403);
        }

        $data = $validator->validated();
        $pref = $project->preferences;

        if ($pref === null) {
            $pref = new ProjectPreference(['project_id' => $project->id]);
        }

        foreach (['budget', 'style', 'colors', 'usage', 'furniture'] as $key) {
            if (array_key_exists($key, $data)) {
                $pref->{$key} = $data[$key];
            }
        }

        $pref->project_id = $project->id;
        $pref->save();

        return ModuleApiResponse::success('Preferences saved.', $this->preferencesPayload($pref));
    }

    /**
     * @return array<string, mixed>
     */
    private function projectPayload(Project $project): array
    {
        return [
            'id' => $project->id,
            'user_id' => $project->user_id,
            'name' => $project->name,
            'mode' => $project->mode,
            'status' => $project->status,
            'created_at' => $project->created_at?->toIso8601String(),
            'updated_at' => $project->updated_at?->toIso8601String(),
            'preferences' => $project->preferences !== null
                ? $this->preferencesPayload($project->preferences)
                : null,
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function preferencesPayload(ProjectPreference $p): array
    {
        return [
            'id' => $p->id,
            'project_id' => $p->project_id,
            'budget' => $p->budget !== null ? (float) $p->budget : null,
            'style' => $p->style,
            'colors' => $p->colors,
            'usage' => $p->usage,
            'furniture' => (bool) $p->furniture,
            'created_at' => $p->created_at?->toIso8601String(),
            'updated_at' => $p->updated_at?->toIso8601String(),
        ];
    }
}
