<?php

namespace App\Http\Controllers\API\Module;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\ProjectFile;
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
        $user = $request->user();

        $query = Project::query()
            ->where('user_id', $user->id)
            ->with('preferences')
            ->orderByDesc('created_at');

        if ($request->filled('search')) {
            $query->where('name', 'like', '%'.$request->search.'%');
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $projects = $query->get()->map(fn ($p) => $this->projectPayload($p));

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

        $user = $request->user();
        $data = $validator->validated();

        $project = Project::create([
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
        $project = Project::with('preferences')->find($id);

        if (!$project) {
            return ModuleApiResponse::error('Project not found.', 404, 404);
        }

        if ($project->user_id != $request->user()->id) {
            return ModuleApiResponse::error('You do not have access to this project.', 403, 403);
        }

        return ModuleApiResponse::success('Project loaded.', $this->projectPayload($project));
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $project = Project::find($id);

        if (!$project) {
            return ModuleApiResponse::error('Project not found.', 404, 404);
        }

        if ($project->user_id != $request->user()->id) {
            return ModuleApiResponse::error('You do not have access to this project.', 403, 403);
        }

        $data = $request->only(['name', 'mode', 'status']);

        $project->update(array_filter($data));
        $project->load('preferences');

        return ModuleApiResponse::success('Project updated.', $this->projectPayload($project));
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $project = Project::find($id);

        if (!$project) {
            return ModuleApiResponse::error('Project not found.', 404, 404);
        }

        if ($project->user_id != $request->user()->id) {
            return ModuleApiResponse::error('You do not have access to this project.', 403, 403);
        }

        $project->delete();

        return ModuleApiResponse::success('Project deleted successfully.', []);
    }

    public function duplicate(Request $request, int $id): JsonResponse
    {
        $project = Project::with('preferences')->find($id);

        if (!$project) {
            return ModuleApiResponse::error('Project not found.', 404, 404);
        }

        if ($project->user_id != $request->user()->id) {
            return ModuleApiResponse::error('You do not have access to this project.', 403, 403);
        }

        $copy = DB::transaction(function () use ($project, $request) {

            $new = $project->replicate();
            $new->user_id = $request->user()->id;
            $new->name = 'Copy of ' . $project->name;
            $new->save();

            if ($project->preferences) {
                $pref = $project->preferences->replicate();
                $pref->project_id = $new->id;
                $pref->save();
            }

            return $new->load('preferences');
        });

        return ModuleApiResponse::success('Project duplicated.', $this->projectPayload($copy), 201);
    }

    public function uploadFiles(Request $request, int $id): JsonResponse
    {
        $project = Project::find($id);

        if (!$project) {
            return ModuleApiResponse::error('Project not found', 404, 404);
        }

        if ($project->user_id != $request->user()->id) {
            return ModuleApiResponse::error('Unauthorized', 403, 403);
        }

        $request->validate([
            'blueprint' => ['required', 'file'],
            'rooms.*' => ['nullable', 'image'],
        ]);

        $blueprintPath = $request->file('blueprint')->store('uploads/blueprints', 'public');

        ProjectFile::create([
            'project_id' => $project->id,
            'type' => 'blueprint',
            'file_path' => $blueprintPath,
        ]);

        $roomsPaths = [];

        if ($request->hasFile('rooms')) {
            foreach ($request->file('rooms') as $file) {
                $path = $file->store('uploads/rooms', 'public');
                $roomsPaths[] = $path;

                ProjectFile::create([
                    'project_id' => $project->id,
                    'type' => 'room',
                    'file_path' => $path,
                ]);
            }
        }

        return ModuleApiResponse::success('Files uploaded.', [
            'blueprint' => $blueprintPath,
            'rooms' => $roomsPaths,
        ]);
    }

    public function getFiles(Request $request, int $id): JsonResponse
    {
        $project = Project::find($id);

        if (!$project) {
            return ModuleApiResponse::error('Project not found.', 404, 404);
        }

        if ($project->user_id != $request->user()->id) {
            return ModuleApiResponse::error('Unauthorized', 403, 403);
        }

        $files = ProjectFile::where('project_id', $id)->get();

        return ModuleApiResponse::success('Files fetched.', $files);
    }

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
            'preferences' => $project->preferences,
        ];
    }
}