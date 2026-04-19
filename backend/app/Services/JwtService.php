<?php

namespace App\Services;

use App\Models\User;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use RuntimeException;

class JwtService
{
    public function issue(User $user): string
    {
        $secret = config('jwt.secret');
        if (! is_string($secret) || $secret === '') {
            throw new RuntimeException('JWT_SECRET is not configured.');
        }

        $now = time();
        $ttl = (int) config('jwt.ttl_seconds', 604800);
        $payload = [
            'iss' => (string) config('app.url'),
            'sub' => $user->id,
            'iat' => $now,
            'exp' => $now + $ttl,
        ];

        return JWT::encode($payload, $secret, (string) config('jwt.algo', 'HS256'));
    }

    /**
     * @return object{sub: int}
     */
    public function decode(string $token): object
    {
        $secret = config('jwt.secret');
        if (! is_string($secret) || $secret === '') {
            throw new RuntimeException('JWT_SECRET is not configured.');
        }

        return JWT::decode($token, new Key($secret, (string) config('jwt.algo', 'HS256')));
    }
}
