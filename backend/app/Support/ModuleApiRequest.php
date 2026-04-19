<?php

namespace App\Support;

use Illuminate\Http\Request;

final class ModuleApiRequest
{
    public static function matches(Request $request): bool
    {
        $path = $request->path();

        return str_starts_with($path, 'api/auth/')
            || str_starts_with($path, 'api/projects')
            || str_starts_with($path, 'api/dashboard');
    }
}
