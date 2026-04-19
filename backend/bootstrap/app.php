<?php

use App\Http\Middleware\JwtAuthenticate;
use App\Support\ModuleApiRequest;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Database\QueryException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        // API-only app: never redirect unauthenticated users to a web "login" route.
        $middleware->redirectGuestsTo(fn () => null);

        $middleware->alias([
            'jwt.auth' => JwtAuthenticate::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->render(function (ValidationException $e, Request $request) {
            if (ModuleApiRequest::matches($request)) {
                return response()->json([
                    'success' => false,
                    'error' => collect($e->errors())->flatten()->first() ?? __('The given data was invalid.'),
                    'code' => 400,
                ], 400);
            }

            if ($request->is('api/*')) {
                return response()->json([
                    'success' => false,
                    'message' => __('The given data was invalid.'),
                    'data' => [
                        'errors' => $e->errors(),
                    ],
                ], $e->status);
            }
        });

        $exceptions->render(function (AuthenticationException $e, Request $request) {
            if (ModuleApiRequest::matches($request)) {
                return response()->json([
                    'success' => false,
                    'error' => __('Unauthenticated.'),
                    'code' => 401,
                ], 401);
            }

            if ($request->is('api/*')) {
                return response()->json([
                    'success' => false,
                    'message' => __('Unauthenticated.'),
                    'data' => null,
                ], 401);
            }
        });

        $exceptions->render(function (NotFoundHttpException $e, Request $request) {
            if (ModuleApiRequest::matches($request)) {
                return response()->json([
                    'success' => false,
                    'error' => __('Not found.'),
                    'code' => 404,
                ], 404);
            }

            if ($request->is('api/*')) {
                return response()->json([
                    'success' => false,
                    'message' => __('Not found.'),
                    'data' => null,
                ], 404);
            }
        });

        $exceptions->render(function (HttpExceptionInterface $e, Request $request) {
            if (! $request->is('api/*')) {
                return null;
            }

            if ($e instanceof NotFoundHttpException || $e instanceof ValidationException || $e instanceof AuthenticationException) {
                return null;
            }

            if ($e->getStatusCode() === 429 && ModuleApiRequest::matches($request)) {
                return response()->json([
                    'success' => false,
                    'error' => 'Too many requests, please try again later',
                    'code' => 429,
                ], 429);
            }

            if (ModuleApiRequest::matches($request)) {
                return response()->json([
                    'success' => false,
                    'error' => $e->getMessage() ?: __('Request could not be completed.'),
                    'code' => $e->getStatusCode(),
                ], $e->getStatusCode());
            }

            return response()->json([
                'success' => false,
                'message' => $e->getMessage() ?: __('Request could not be completed.'),
                'data' => null,
            ], $e->getStatusCode());
        });

        $exceptions->render(function (QueryException $e, Request $request) {
            if (! $request->is('api/*')) {
                return null;
            }

            report($e);

            if (ModuleApiRequest::matches($request)) {
                return response()->json([
                    'success' => false,
                    'error' => config('app.debug')
                        ? $e->getMessage()
                        : __('Database service unavailable. Please try again later.'),
                    'code' => 503,
                ], 503);
            }

            return response()->json([
                'success' => false,
                'message' => config('app.debug')
                    ? $e->getMessage()
                    : __('Database service unavailable. Please try again later.'),
                'data' => null,
            ], 503);
        });

        $exceptions->render(function (Throwable $e, Request $request) {
            if (! $request->is('api/*') || config('app.debug')) {
                return null;
            }

            if (ModuleApiRequest::matches($request)) {
                return response()->json([
                    'success' => false,
                    'error' => __('Server error.'),
                    'code' => 500,
                ], 500);
            }

            return response()->json([
                'success' => false,
                'message' => __('Server error.'),
                'data' => null,
            ], 500);
        });
    })->create();
