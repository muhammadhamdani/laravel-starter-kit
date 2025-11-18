<?php

namespace App\Http\Middleware;

use Inertia\Middleware;
use Illuminate\Http\Request;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Route;
use Diglactic\Breadcrumbs\Breadcrumbs;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        [$message, $author] = str(Inspiring::quotes()->random())->explode('-');

        $user = $request->user();
        $roles = $user?->roles->pluck('name')->toArray() ?? [];
        $rawPermissions = $user?->roles->flatMap->resolvedPermissions->pluck('name') ?? collect();
        $allPermissions = $user?->resolvedPermissions() ?? [];

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'quote' => ['message' => trim($message), 'author' => trim($author)],
            'auth' => [
                'user' => $request->user(),
                'roles' =>  $request->user()?->roles->pluck('name')->toArray() ?? [],
                'raw_permissions' => $request->user()?->roles->flatMap->resolvedPermissions->pluck('name'),
                'permissions' => $request->user()?->resolvedPermissions() ?? [],
            ],
            'flash' => [
                'success' => $request->session()->get('success'),
                'error'   => $request->session()->get('error'),
            ],
            'breadcrumbs' => $request->isMethod('get')
                ? Breadcrumbs::generate()
                : [],
            'wayfinder' => fn() => [
                'routes' => collect(Route::getRoutes())
                    ->map(function ($route) {
                        return [
                            'name'   => $route->getName(),
                            'uri'    => $route->uri(),
                            'method' => $route->methods()[0] ?? 'GET',
                            'action' => $route->getActionName(),
                            // Optional: guard untuk role-permission future
                            'middleware' => $route->gatherMiddleware(),
                        ];
                    })
                    ->filter(fn($route) => $route['name'])
                    ->values(),

                'location' => $request->url(),
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
        ];
    }
}
