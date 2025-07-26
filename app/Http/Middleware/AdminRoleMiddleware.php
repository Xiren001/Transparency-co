<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminRoleMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        if (! $request->user()) {
            abort(403);
        }

        $allowedRoles = ['admin', 'moderator', 'content_manager'];
        $userHasAllowedRole = false;

        foreach ($allowedRoles as $role) {
            if ($request->user()->hasRole($role)) {
                $userHasAllowedRole = true;
                break;
            }
        }

        if (!$userHasAllowedRole) {
            abort(403);
        }

        return $next($request);
    }
}
