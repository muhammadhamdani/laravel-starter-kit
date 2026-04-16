<?php

namespace App\Services;

use App\Models\Core\Permission;
use App\Models\Core\Role;
use App\Models\Core\User;

class DashboardService
{
    /**
     * Create a new class instance.
     */
    public function __construct()
    {
        //
    }

    public static function handle($user): array
    {
        $role = $user->getRoleNames()->first();

        return match ($role) {
            'Administrators' => self::admin(),
            default => self::user(),
        };
    }

    private static function admin()
    {
        $permissionsCount = Permission::count();
        $rolesCount = Role::count();
        $usersCount = User::count();

        return [
            'view' => 'admin/dashboard/admin',
            'data' => [
                'pageTitle' => 'Dashboard Admin',
                'summaries' => [
                    'total_permissions' => $permissionsCount,
                    'total_roles' => $rolesCount,
                    'total_users' => $usersCount,
                ]
            ]
        ];
    }

    private static function user()
    {
        return [
            'view' => 'admin/dashboard/user',
            'data' => [
                'pageTitle' => 'Dashboard User',
            ]
        ];
    }
}
