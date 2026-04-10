<?php

namespace App\Http\Controllers\API\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\PlanResource;
use App\Services\PricingService;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;

class PricingController extends Controller
{
    public function index(PricingService $pricing): JsonResponse
    {
        $plans = $pricing->listActivePlans();

        return ApiResponse::success(
            __('Pricing plans loaded.'),
            PlanResource::collection($plans)->resolve(),
        );
    }
}
