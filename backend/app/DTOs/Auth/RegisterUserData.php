<?php

namespace App\DTOs\Auth;

final readonly class RegisterUserData
{
    public function __construct(
        public string $name,
        public string $email,
        public string $password,
        public string $profileRole,
    ) {}

    /**
     * @param  array<string, mixed>  $validated
     */
    public static function fromValidated(array $validated): self
    {
        /** @var string $name */
        $name = $validated['name'];

        return new self(
            name: $name,
            email: $validated['email'],
            password: $validated['password'],
            profileRole: $validated['role'] ?? $validated['profile_role'] ?? 'Homeowner',
        );
    }
}
