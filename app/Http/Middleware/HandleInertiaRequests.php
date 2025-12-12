<?php

namespace App\Http\Middleware;

use Inertia\Middleware;
use Tighten\Ziggy\Ziggy;
use Illuminate\Http\Request;
use App\Settings\SiteSetting;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Auth;
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

        $settings = app(SiteSetting::class);

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
            'settings' => [
                'site_name' => $settings->site_name,
                'site_description' => $settings->site_description,
                'logo' => $settings->logo ? asset('storage/' . $settings->logo) : null,
                'favicon' => $settings->favicon ? asset('storage/' . $settings->favicon) : null,
                'email' => $settings->email,
                'phone' => $settings->phone,
                'address' => $settings->address,
                'social' => [
                    'facebook' => $settings->facebook,
                    'twitter' => $settings->twitter,
                    'instagram' => $settings->instagram,
                    'youtube' => $settings->youtube,
                    'tiktok' => $settings->tiktok,
                    'whatsapp' => $settings->whatsapp,
                ],
                'maintenance_mode' => $settings->maintenance_mode,
            ],
            'flash' => [
                'success' => $request->session()->get('success'),
                'error'   => $request->session()->get('error'),
            ],
            'ziggy' => fn(): array => [
                ...(new Ziggy)->toArray(),
                'location' => $request->url(),
            ],
            'breadcrumbs' => $request->isMethod('get')
                ? Breadcrumbs::generate()
                : [],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
        ];
    }
}
