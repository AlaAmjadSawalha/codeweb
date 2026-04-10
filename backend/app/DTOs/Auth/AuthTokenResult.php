<?php

namespace App\DTOs\Auth;

use App\Models\User;

final readonly class AuthTokenResult
{
    public function __construct(
        public User $user,
        public string $plainTextToken,
    ) {}
}
