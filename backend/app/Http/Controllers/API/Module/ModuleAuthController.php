<?php

namespace App\Http\Controllers\API\Module;

use App\Http\Controllers\Controller;
use App\Models\PasswordResetToken;
use App\Models\User;
use App\Services\JwtService;
use App\Support\ModuleApiResponse;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class ModuleAuthController extends Controller
{
    public function __construct(
        private readonly JwtService $jwt,
    ) {}

    public function register(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8'],
        ]);

        if ($validator->fails()) {
            return ModuleApiResponse::error($validator->errors()->first(), 400, 400);
        }

        if (! $this->jwtSecretConfigured()) {
            return ModuleApiResponse::error('Server configuration error.', 500, 500);
        }

        $data = $validator->validated();
        $user = User::query()->create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => $data['password'],
            'role' => 'user',
            'plan' => 'free',
        ]);

        $token = $this->jwt->issue($user);

        return ModuleApiResponse::success('Registration successful.', [
            'token' => $token,
            'user' => $this->userPayload($user),
        ], 201);
    }

    public function login(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        if ($validator->fails()) {
            return ModuleApiResponse::error($validator->errors()->first(), 400, 400);
        }

        if (! $this->jwtSecretConfigured()) {
            return ModuleApiResponse::error('Server configuration error.', 500, 500);
        }

        $data = $validator->validated();
        $user = User::query()->where('email', $data['email'])->first();

        if ($user === null || ! Hash::check($data['password'], $user->password)) {
            return ModuleApiResponse::error('Invalid email or password.', 401, 401);
        }

        $token = $this->jwt->issue($user);

        return ModuleApiResponse::success('Login successful.', [
            'token' => $token,
            'user' => $this->userPayload($user),
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        return ModuleApiResponse::success('Logged out successfully.', []);
    }

    public function forgotPassword(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'email' => ['required', 'email'],
        ]);

        if ($validator->fails()) {
            return ModuleApiResponse::error($validator->errors()->first(), 400, 400);
        }

        $email = $validator->validated()['email'];
        $user = User::query()->where('email', $email)->first();

        if ($user !== null) {
            $token = Str::uuid()->toString();
            PasswordResetToken::query()->create([
                'user_id' => $user->id,
                'token' => $token,
                'expires_at' => Carbon::now()->addHour(),
                'used' => false,
            ]);
            Log::info(sprintf('Reset link: /reset-password?token=%s', $token));
        }

        return ModuleApiResponse::success('If this email exists, a reset link was sent.', []);
    }

    public function resetPassword(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'token' => ['required', 'string'],
            'new_password' => ['required', 'string', 'min:8'],
        ]);

        if ($validator->fails()) {
            return ModuleApiResponse::error($validator->errors()->first(), 400, 400);
        }

        $data = $validator->validated();
        $record = PasswordResetToken::query()
            ->where('token', $data['token'])
            ->where('used', false)
            ->where('expires_at', '>', Carbon::now())
            ->first();

        if ($record === null) {
            return ModuleApiResponse::error('Invalid or expired reset token.', 400, 400);
        }

        $user = User::query()->find($record->user_id);
        if ($user === null) {
            return ModuleApiResponse::error('Invalid or expired reset token.', 400, 400);
        }

        $user->forceFill(['password' => $data['new_password']])->save();

        $record->forceFill(['used' => true])->save();

        return ModuleApiResponse::success('Password has been reset successfully.', []);
    }

    public function me(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        return ModuleApiResponse::success('Profile loaded.', $this->userPayload($user));
    }

    /**
     * @return array<string, mixed>
     */
    private function userPayload(User $user): array
    {
        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role,
            'plan' => $user->plan,
        ];
    }

    private function jwtSecretConfigured(): bool
    {
        $secret = config('jwt.secret');

        return is_string($secret) && $secret !== '';
    }
}
