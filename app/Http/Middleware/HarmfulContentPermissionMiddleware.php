<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class HarmfulContentPermissionMiddleware
{
    public function handle(Request $request, Closure $next, string $permission = null): Response
    {
        if (!$request->user()) {
            abort(403, 'Unauthorized');
        }

        // Default permission to check if none specified
        $permissionToCheck = $permission ?? 'view harmful content';

        // Check if user has the specific permission
        if (!$request->user()->can($permissionToCheck)) {
            abort(403, 'Insufficient permissions for harmful content management');
        }

        return $next($request);
    }
}
