<?php

use App\Http\Controllers\API\Module\ModuleAuthController;
use App\Http\Controllers\API\Module\ModuleDashboardController;
use App\Http\Controllers\API\Module\ModuleDesignController;
use App\Http\Controllers\API\Module\ModuleProjectController;
use App\Http\Controllers\API\V1\AuthController;
use App\Http\Controllers\API\V1\HomeController;
use App\Http\Controllers\API\V1\PricingController;
use App\Http\Controllers\API\V1\UiController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AIController;
use App\Events\AiStatusUpdated;

/*
| Module APIs (JWT): /api/auth/*, /api/projects*, /api/dashboard/* — v1 Sanctum routes unchanged below.
*/
Route::middleware(['throttle:module-api-auth'])->group(function (): void {
    Route::post('auth/register', [ModuleAuthController::class, 'register']);
    Route::post('auth/login', [ModuleAuthController::class, 'login']);
    Route::post('auth/forgot-password', [ModuleAuthController::class, 'forgotPassword']);
    Route::post('auth/reset-password', [ModuleAuthController::class, 'resetPassword']);

    Route::middleware(['jwt.auth'])->group(function (): void {
        Route::post('auth/logout', [ModuleAuthController::class, 'logout']);
        Route::get('auth/me', [ModuleAuthController::class, 'me']);
    });
});

Route::middleware(['jwt.auth'])->group(function (): void {
    Route::get('projects', [ModuleProjectController::class, 'index']);
    Route::post('projects', [ModuleProjectController::class, 'store']);
    Route::post('projects/{id}/upload', [ModuleProjectController::class, 'uploadFiles']);
    
    Route::get('projects/{id}/files', [ModuleProjectController::class, 'getFiles']);
    Route::get('projects/{id}', [ModuleProjectController::class, 'show'])->whereNumber('id');
    Route::put('projects/{id}', [ModuleProjectController::class, 'update'])->whereNumber('id');
    Route::delete('projects/{id}', [ModuleProjectController::class, 'destroy'])->whereNumber('id');
    Route::post('projects/{id}/duplicate', [ModuleProjectController::class, 'duplicate'])->whereNumber('id');
    Route::put('projects/{id}/preferences', [ModuleProjectController::class, 'updatePreferences'])->whereNumber('id');

    Route::get('dashboard/metrics', [ModuleDashboardController::class, 'metrics']);
    Route::post('projects/{id}/process', [AIController::class, 'start']);
 
    // Design routes (nested under projects — compare/generate before {design} wildcard)
    Route::prefix('projects/{projectId}')->whereNumber('projectId')->group(function (): void {
        Route::get('designs',                   [ModuleDesignController::class, 'index']);
        Route::post('designs',                  [ModuleDesignController::class, 'store']);
        Route::post('designs/generate',         [ModuleDesignController::class, 'generate']);
        Route::post('designs/compare',          [ModuleDesignController::class, 'compare']);
        Route::get('designs/{designId}',        [ModuleDesignController::class, 'show'])->whereNumber('designId');
        Route::put('designs/{designId}/select', [ModuleDesignController::class, 'select'])->whereNumber('designId');
        Route::delete('designs/{designId}',     [ModuleDesignController::class, 'destroy'])->whereNumber('designId');
    });
});

Route::prefix('v1')->group(function (): void {
    Route::middleware('throttle:auth')->group(function (): void {
        Route::post('auth/register', [AuthController::class, 'register']);
        Route::post('auth/login', [AuthController::class, 'login']);
    });

    Route::post('auth/forgot-password', [AuthController::class, 'forgot'])
        ->middleware('throttle:password-reset');
    Route::post('auth/reset-password', [AuthController::class, 'reset'])
        ->middleware('throttle:password-reset');

    Route::middleware('auth:sanctum')->group(function (): void {
        Route::post('auth/logout', [AuthController::class, 'logout']);
        Route::get('auth/me', [AuthController::class, 'me']);
    });

    Route::get('home', [HomeController::class, 'index']);
    Route::get('pricing', [PricingController::class, 'index']);
    Route::get('ui', [UiController::class, 'shared']);
});


Route::get('/test-event', function () {
    event(new AIStatusUpdated('processing', 1, 50));
    return response()->json([
        'success' => true,
        'message' => 'event sent'
    ]);
}); 
