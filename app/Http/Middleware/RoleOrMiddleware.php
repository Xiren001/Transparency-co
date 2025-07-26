<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleOrMiddleware
{
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        if (! $request->user()) {
            abort(403);
        }

        $userHasRole = false;

        foreach ($roles as $role) {
            if ($request->user()->hasRole($role)) {
                $userHasRole = true;
                break;
            }
        }

        if (!$userHasRole) {
            abort(403);
        }

        return $next($request);
    }
} 