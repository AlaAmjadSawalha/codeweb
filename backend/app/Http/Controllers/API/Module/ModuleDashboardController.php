<?php

namespace App\Http\Controllers\API\Module;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\User;
use App\Support\ModuleApiResponse;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ModuleDashboardController extends Controller
{
    public function metrics(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        $totalProjects = Project::query()->where('user_id', $user->id)->count();
        $activeProjects = Project::query()
            ->where('user_id', $user->id)
            ->where('status', 'active')
            ->count();

        $now = Carbon::now();
        $monthlyUsage = Project::query()
            ->where('user_id', $user->id)
            ->whereYear('created_at', $now->year)
            ->whereMonth('created_at', $now->month)
            ->count();

        $recent = Project::query()
            ->where('user_id', $user->id)
            ->orderByDesc('created_at')
            ->limit(5)
            ->get()
            ->map(static fn (Project $p) => [
                'id' => $p->id,
                'name' => $p->name,
                'mode' => $p->mode,
                'status' => $p->status,
                'created_at' => $p->created_at?->toIso8601String(),
            ])
            ->all();

        return ModuleApiResponse::success('Dashboard metrics loaded.', [
            'total_projects' => $totalProjects,
            'active_projects' => $activeProjects,
            'plan_status' => $user->plan,
            'recent_projects' => $recent,
            'monthly_usage' => $monthlyUsage,
        ]);
    }
}
