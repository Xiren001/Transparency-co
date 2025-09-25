<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class HandleCookies
{
    /**
     * Handle an incoming request and manage cookies.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        // Example: Set first visit cookie if not present
        if (!$request->hasCookie('hasVisitedBefore')) {
            $response->cookie('firstTimeVisitor', 'true', 0); // Session cookie
        }

        // Example: Update last visit timestamp
        $response->cookie('lastVisit', now()->timestamp, 60 * 24 * 30); // 30 days

        // Example: Set user preferences based on request
        if ($request->has('theme')) {
            $theme = $request->input('theme');
            if (in_array($theme, ['light', 'dark', 'system'])) {
                $response->cookie('theme', $theme, 60 * 24 * 365); // 1 year
            }
        }

        return $response;
    }

    /**
     * Get user preferences from cookies
     */
    public static function getUserPreferences(Request $request): array
    {
        return [
            'theme' => $request->cookie('theme', 'system'),
            'language' => $request->cookie('language', 'en'),
            'hasVisited' => $request->cookie('hasVisitedBefore', false),
            'isFirstTime' => !$request->hasCookie('hasVisitedBefore'),
        ];
    }

    /**
     * Set secure cookie with proper options
     */
    public static function setSecureCookie(Response $response, string $name, string $value, int $minutes = 525600): Response
    {
        return $response->cookie(
            $name,
            $value,
            $minutes, // 1 year default
            '/', // path
            null, // domain
            request()->secure(), // secure (HTTPS only)
            true, // httpOnly
            false, // raw
            'lax' // sameSite
        );
    }
}