<?php

namespace App\Http\Controllers\API\V1;

use App\Http\Controllers\Controller;
use App\Services\HomeContentService;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;

class HomeController extends Controller
{
    public function index(HomeContentService $home): JsonResponse
    {
        return ApiResponse::success(
            __('Home content loaded.'),
            $home->getPublicHome(),
        );
    }
}
