<?php

namespace App\Http\Controllers\API\V1;

use App\Http\Controllers\Controller;
use App\Services\UiDataService;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;

class UiController extends Controller
{
    public function shared(UiDataService $ui): JsonResponse
    {
        return ApiResponse::success(
            __('Shared UI data loaded.'),
            $ui->sharedChrome(),
        );
    }
}
