<?php

use App\Http\Controllers\API\V1\AuthController;
use App\Http\Controllers\API\V1\HomeController;
use App\Http\Controllers\API\V1\PricingController;
use App\Http\Controllers\API\V1\UiController;
use Illuminate\Support\Facades\Route;

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
