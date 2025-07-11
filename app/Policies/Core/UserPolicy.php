<?php

namespace App\Policies\Core;

use App\Models\Core\User;
use App\Models\Core\User as UserModel;
use Illuminate\Auth\Access\Response;

class UserPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(UserModel $user): bool
    {
        return $user->hasPermissionTo('view-user');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, UserModel $userModel): bool
    {
        return $user->hasPermissionTo('view-user');
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->hasPermissionTo('create-user');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, UserModel $userModel): bool
    {
        return $user->hasPermissionTo('update-user');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, UserModel $userModel): bool
    {
        return $user->hasPermissionTo('delete-user');
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, UserModel $userModel): bool
    {
        return $user->hasPermissionTo('restore-user');
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, UserModel $userModel): bool
    {
        return $user->hasPermissionTo('force-delete-user');
    }

    /**
     * Determine whether the user can permanently getData the model.
     */
    public function getData(User $user, UserModel $userModel): bool
    {
        return $user->hasPermissionTo('data-user');
    }
    
    public function verify(User $user, UserModel $userModel): bool
    {
        return $user->hasPermissionTo('verify-user');
    }
}
