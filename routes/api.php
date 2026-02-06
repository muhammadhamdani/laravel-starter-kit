<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;

Route::prefix('auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/google', [AuthController::class, 'callbackGoogle']);
    Route::post('/refresh', [AuthController::class, 'refreshToken']);

    Route::middleware(['auth:sanctum'])->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me', [AuthController::class, 'me']);
        Route::post('/refresh', [AuthController::class, 'refresh']);
        Route::post('/verify', [AuthController::class, 'verify']);
        Route::post('/update-password', [AuthController::class, 'updatePassword']);
        Route::post('/update-profile', [AuthController::class, 'updateProfile']);
        Route::post('/update-avatar', [AuthController::class, 'updateAvatar']);
    });
});
