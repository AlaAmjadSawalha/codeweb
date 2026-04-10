<?php

namespace App\Http\Controllers\API\V1;

use App\DTOs\Auth\LoginUserData;
use App\DTOs\Auth\RegisterUserData;
use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Auth\ForgotPasswordRequest;
use App\Http\Requests\Api\V1\Auth\LoginRequest;
use App\Http\Requests\Api\V1\Auth\RegisterRequest;
use App\Http\Requests\Api\V1\Auth\ResetPasswordRequest;
use App\Http\Resources\UserResource;
use App\Services\AuthService;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function register(RegisterRequest $request, AuthService $auth): JsonResponse
    {
        $result = $auth->register(RegisterUserData::fromValidated($request->validated()));

        return ApiResponse::success(
            __('Registration successful.'),
            [
                'token' => $result->plainTextToken,
                'token_type' => 'Bearer',
                'user' => (new UserResource($result->user))->resolve(),
            ],
            201,
        );
    }

    public function login(LoginRequest $request, AuthService $auth): JsonResponse
    {
        $result = $auth->login(LoginUserData::fromValidated($request->validated()));

        return ApiResponse::success(
            __('Login successful.'),
            [
                'token' => $result->plainTextToken,
                'token_type' => 'Bearer',
                'user' => (new UserResource($result->user))->resolve(),
            ],
        );
    }

    public function logout(Request $request, AuthService $auth): JsonResponse
    {
        $auth->logout($request->user());

        return ApiResponse::success(__('Logged out successfully.'), []);
    }

    public function me(Request $request): JsonResponse
    {
        $user = $request->user();

        return ApiResponse::success(
            __('Profile loaded.'),
            (new UserResource($user))->resolve(),
        );
    }

    public function forgot(ForgotPasswordRequest $request, AuthService $auth): JsonResponse
    {
        $auth->sendPasswordResetLinkQuietly($request->validated('email'));

        return ApiResponse::success(
            __('If that email exists in our system, a reset link has been sent.'),
            [],
        );
    }

    public function reset(ResetPasswordRequest $request, AuthService $auth): JsonResponse
    {
        $auth->resetPassword($request->validated());

        return ApiResponse::success(__('Your password has been reset.'), []);
    }
}
