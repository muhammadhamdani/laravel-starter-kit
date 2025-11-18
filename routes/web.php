<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\SocialiteController;
use App\Http\Controllers\Admin\Core\RoleController;
use App\Http\Controllers\Admin\Core\UserController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\Core\PermissionController;

Route::redirect('/', 'admin/dashboard')->name('home');

Route::prefix('auth')->middleware(['guest'])->group(function () {
    Route::get('{provider}/redirect', [SocialiteController::class, 'redirect'])->name('google.redirect');
    Route::get('{provider}/callback', [SocialiteController::class, 'callback'])->name('google.callback');
});

Route::middleware(['auth', 'verified'])->prefix('admin')->as('admin.')->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::prefix('core')->as('core.')->group(function () {
        Route::get('permissions/data', [PermissionController::class, 'getData'])->name('permissions.data');
        Route::resource('permissions', PermissionController::class);

        Route::get('roles/data', [RoleController::class, 'getData'])->name('roles.data');
        Route::resource('roles', RoleController::class);

        Route::get('users/bulk-action', [UserController::class, 'bulkAction'])->name('users.bulk-action');
        Route::post('users/verify', [UserController::class, 'verify'])->name('users.verify');
        Route::get('users/data', [UserController::class, 'getData'])->name('users.data');
        Route::resource('users', UserController::class);
    });
});

Route::middleware(['auth', 'role:Admin'])->group(function () {
    Route::view('/log-viewer/{any?}', 'log-viewer::index')
        ->where('any', '.*')
        ->name('log-viewer');
});

require __DIR__ . '/settings.php';
