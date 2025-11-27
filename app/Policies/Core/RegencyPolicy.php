<?php

namespace App\Policies\Core;

use App\Models\Core\Regency;
use App\Models\Core\User;
use Illuminate\Auth\Access\Response;

class RegencyPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('view-region');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Regency $regency): bool
    {
        return $user->hasPermissionTo('view-region');
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->hasPermissionTo('create-region');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Regency $regency): bool
    {
        return $user->hasPermissionTo('update-region');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Regency $regency): bool
    {
        return $user->hasPermissionTo('delete-region');
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Regency $regency): bool
    {
        return $user->hasPermissionTo('restore-region');
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Regency $regency): bool
    {
        return $user->hasPermissionTo('force-delete-region');
    }

    /**
     * Determine whether the user can permanently getData the model.
     */
    public function getData(User $user, Regency $regency): bool
    {
        return $user->hasPermissionTo('data-region');
    }
}
