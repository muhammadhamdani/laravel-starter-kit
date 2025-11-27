<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HomeController;
use Opcodes\LogViewer\Facades\LogViewer;
use App\Http\Controllers\Admin\Core\RoleController;
use App\Http\Controllers\Admin\Core\UserController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\Core\PermissionController;
use App\Http\Controllers\Admin\Core\Region\RegionController;
use App\Http\Controllers\Admin\Core\Region\VillageController;
use App\Http\Controllers\Admin\Core\Region\DistrictController;
use App\Http\Controllers\Admin\Core\Region\ProvinceController;
use App\Http\Controllers\Admin\Core\Region\RegencyController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::redirect('/', 'admin/dashboard')->name('home');

Route::middleware(['auth', 'verified'])->prefix('admin')->as('admin.')->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::prefix('core')->as('core.')->group(function () {
        Route::get('permissions/data', [PermissionController::class, 'getData'])->name('permissions.data');
        Route::resource('permissions', PermissionController::class);

        Route::get('roles/access', [RoleController::class, 'manageAccessRole'])->name('roles.access');
        Route::post('roles/access', [RoleController::class, 'assignAccessRole'])->name('roles.access.assign');
        Route::get('roles/data', [RoleController::class, 'getData'])->name('roles.data');
        Route::resource('roles', RoleController::class);

        Route::post('users/bulk-action', [UserController::class, 'bulkAction'])->name('users.bulkaction');
        Route::post('users/verify', [UserController::class, 'verify'])->name('users.verify');
        Route::get('users/data', [UserController::class, 'getData'])->name('users.data');
        Route::resource('users', UserController::class);

        Route::prefix('regions')->as('regions.')->group(function () {
            Route::get('provinces/data', [ProvinceController::class, 'getData'])->name('provinces.data');
            Route::resource('provinces', ProvinceController::class);

            Route::get('regencies/data', [RegencyController::class, 'getData'])->name('regencies.data');
            Route::resource('regencies', RegencyController::class);

            Route::get('districts/data', [DistrictController::class, 'getData'])->name('districts.data');
            Route::resource('districts', DistrictController::class);

            Route::get('villages/data', [VillageController::class, 'getData'])->name('villages.data');
            Route::resource('villages', VillageController::class);
        });
    });
});

Route::middleware(['auth', 'role:Admin'])->group(function () {
    Route::view('/log-viewer/{any?}', 'log-viewer::index')
        ->where('any', '.*')
        ->name('log-viewer');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
