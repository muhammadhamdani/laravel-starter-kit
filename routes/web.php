<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use Opcodes\LogViewer\Facades\LogViewer;
use App\Http\Controllers\Admin\Core\RoleController;
use App\Http\Controllers\Admin\Core\UserController;
use App\Http\Controllers\Admin\Core\PermissionController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::prefix('core')->group(function () {
        Route::get('permissions/data', [PermissionController::class, 'getData'])->name('permissions.data');
        Route::resource('permissions', PermissionController::class);

        Route::get('roles/access', [RoleController::class, 'manageAccessRole'])->name('roles.access');
        Route::post('roles/access', [RoleController::class, 'assignAccessRole'])->name('roles.access.assign');
        Route::get('roles/data', [RoleController::class, 'getData'])->name('roles.data');
        Route::resource('roles', RoleController::class);

        Route::put('users/{user}/verify', [UserController::class, 'verify'])->name('users.verify');
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
require __DIR__ . '/auth.php';
