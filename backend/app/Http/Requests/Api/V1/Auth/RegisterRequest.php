<?php

namespace App\Http\Requests\Api\V1\Auth;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class RegisterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $confirm = $this->input('password_confirmation', $this->input('confirmPassword'));

        $merges = [
            'password_confirmation' => is_string($confirm) ? $confirm : null,
            'accept_terms' => $this->has('accept_terms')
                ? $this->boolean('accept_terms')
                : $this->boolean('acceptTerms'),
        ];

        if (! $this->filled('role') && $this->filled('profile_role')) {
            $merges['role'] = $this->input('profile_role');
        }

        $this->merge($merges);
    }

    /**
     * @return array<string, array<int, mixed>>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'min:2', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'password' => [
                'required',
                'string',
                'min:8',
                'confirmed',
                'regex:/[A-Z]/',
                'regex:/[0-9]/',
            ],
            'role' => ['required', 'string', Rule::in(['Homeowner', 'Architect', 'Designer'])],
            'accept_terms' => ['required', 'accepted'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'accept_terms' => 'terms and privacy policy',
            'role' => 'profile role',
        ];
    }
}
