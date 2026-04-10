<?php

namespace App\Services;

use App\DTOs\Auth\AuthTokenResult;
use App\DTOs\Auth\LoginUserData;
use App\DTOs\Auth\RegisterUserData;
use App\Models\User;
use App\Repositories\UserRepository;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class AuthService
{
    private const TOKEN_NAME = 'api';

    public function __construct(
        private readonly UserRepository $users,
    ) {}

    public function register(RegisterUserData $data): AuthTokenResult
    {
        $user = $this->users->create($data);
        $token = $user->createToken(self::TOKEN_NAME)->plainTextToken;

        return new AuthTokenResult($user, $token);
    }

    public function login(LoginUserData $data): AuthTokenResult
    {
        $user = $this->users->findByEmail($data->email);

        if ($user === null || ! Hash::check($data->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => [trans('auth.failed')],
            ]);
        }

        $token = $user->createToken(self::TOKEN_NAME)->plainTextToken;

        return new AuthTokenResult($user, $token);
    }

    public function logout(User $user): void
    {
        /** @var \Laravel\Sanctum\PersonalAccessToken|null $token */
        $token = $user->currentAccessToken();

        if ($token !== null) {
            $token->delete();
        }
    }

    /**
     * Sends a password reset link only if the user exists, avoiding email probing via HTTP status/body.
     */
    public function sendPasswordResetLinkQuietly(string $email): void
    {
        if ($this->users->findByEmail($email) === null) {
            return;
        }

        Password::sendResetLink(['email' => $email]);
    }

    /**
     * @param  array{email: string, password: string, password_confirmation: string, token: string}  $payload
     */
    public function resetPassword(array $payload): void
    {
        $status = Password::reset(
            $payload,
            function (User $user, string $password): void {
                $user->forceFill([
                    'password' => $password,
                    'remember_token' => Str::random(60),
                ])->save();

                event(new PasswordReset($user));
            }
        );

        if ($status !== Password::PASSWORD_RESET) {
            throw ValidationException::withMessages([
                'token' => [__($status)],
            ]);
        }
    }
}
