<?php

namespace App\Providers;

use App\Models\HarmfulContent;
use App\Models\User;
use App\Policies\HarmfulContentPolicy;
use App\Policies\UserPolicy;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Gate::policy(HarmfulContent::class, HarmfulContentPolicy::class);
        Gate::policy(User::class, UserPolicy::class);
    }
}
