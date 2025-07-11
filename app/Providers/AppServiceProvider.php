<?php

namespace App\Providers;

use App\Models\Core\Role;
use App\Models\Core\User;
use Illuminate\Support\Facades\Gate;
use App\Policies\Core\PermissionPolicy;
use App\Policies\Core\RolePolicy;
use App\Policies\Core\UserPolicy;
use Illuminate\Support\ServiceProvider;
use Spatie\Permission\Contracts\Permission;

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
        Gate::policy(Permission::class, PermissionPolicy::class);
        Gate::policy(Role::class, RolePolicy::class);
        Gate::policy(User::class, UserPolicy::class);
    }
}
