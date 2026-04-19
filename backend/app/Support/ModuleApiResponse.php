<?php

namespace App\Support;

use Illuminate\Http\JsonResponse;

/**
 * JSON envelope for Module API routes (/api/auth/*, /api/projects*, /api/dashboard/*).
 */
final class ModuleApiResponse
{
    public static function success(string $message, mixed $data = [], int $status = 200): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $data,
            'message' => $message,
        ], $status);
    }

    public static function error(string $error, int $code, int $httpStatus = 400): JsonResponse
    {
        return response()->json([
            'success' => false,
            'error' => $error,
            'code' => $code,
        ], $httpStatus);
    }
}
