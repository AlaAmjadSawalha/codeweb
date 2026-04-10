<?php

namespace App\DTOs\Auth;

final readonly class LoginUserData
{
    public function __construct(
        public string $email,
        public string $password,
    ) {}

    /**
     * @param  array<string, mixed>  $validated
     */
    public static function fromValidated(array $validated): self
    {
        return new self(
            email: $validated['email'],
            password: $validated['password'],
        );
    }
}
