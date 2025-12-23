<?php

namespace App\Providers;

use App\Models\Core\Role;
use App\Models\Core\User;
use App\Settings\SiteSetting;
use App\Policies\Core\RolePolicy;
use App\Policies\Core\UserPolicy;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\View;
use App\Policies\Core\PermissionPolicy;
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

        View::composer('*', function ($view) {
            $settings = app(SiteSetting::class);

            $view->with('settings', [
                'site_name' => $settings->site_name,
                'site_description' => $settings->site_description,
                'logo' => $settings->logo ? asset('storage/' . $settings->logo) : null,
                'favicon' => $settings->favicon ? asset('storage/' . $settings->favicon) : null,
            ]);
        });
    }
}
