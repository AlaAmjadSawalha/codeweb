<?php

namespace App\Http\Middleware;

use App\Models\User;
use App\Services\JwtService;
use App\Support\ModuleApiResponse;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Throwable;

class JwtAuthenticate
{
    public function __construct(
        private readonly JwtService $jwt,
    ) {}

    public function handle(Request $request, Closure $next): Response
    {
        $header = $request->bearerToken();
        if ($header === null || $header === '') {
            return ModuleApiResponse::error('Authentication required.', 401, 401);
        }

        try {
            $payload = $this->jwt->decode($header);
            $userId = (int) ($payload->sub ?? 0);
            if ($userId <= 0) {
                return ModuleApiResponse::error('Invalid token.', 401, 401);
            }

            $user = User::query()->find($userId);
            if ($user === null) {
                return ModuleApiResponse::error('User not found.', 401, 401);
            }

            $request->setUserResolver(static fn () => $user);
        } catch (Throwable) {
            return ModuleApiResponse::error('Invalid or expired token.', 401, 401);
        }

        return $next($request);
    }
}
