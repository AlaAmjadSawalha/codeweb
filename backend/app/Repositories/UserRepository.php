<?php

namespace App\Repositories;

use App\DTOs\Auth\RegisterUserData;
use App\Models\User;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class UserRepository
{
    public function create(RegisterUserData $data): User
    {
        return User::query()->create([
            'name' => $data->name,
            'email' => $data->email,
            'password' => $data->password,
            'role' => 'user',
            'profile_role' => $data->profileRole,
        ]);
    }

    public function findByEmail(string $email): ?User
    {
        return User::query()->where('email', $email)->first();
    }

    public function findByEmailOrFail(string $email): User
    {
        $user = $this->findByEmail($email);

        if ($user === null) {
            throw (new ModelNotFoundException)->setModel(User::class, [$email]);
        }

        return $user;
    }
}
