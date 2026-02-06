<?php

namespace App\Http\Controllers\Api;

use App\Models\Core\User;
use App\Traits\LogActivity;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    use LogActivity;

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Invalid credentials'],
            ]); 
        }

        $user->tokens()->delete();

        $token = $user->createToken('auth')->plainTextToken;

        $this->logSuccess('login-user', "Logged User: {$user->name}", [
            'user_id' => $user->id,
        ]);

        return response()->json([
            'token' => $token,
            'user' => $user,
        ]);
    }

    public function logout(Request $request)
    {
        /** @var \Laravel\Sanctum\PersonalAccessToken|null $token */
        $token = $request->user()?->currentAccessToken();

        $token?->delete();

        $this->logSuccess('logout-user', "Logged out User: {$request->user()->name}", [
            'user_id' => $request->user()->id,
        ]);

        return response()->json(['message' => 'Logged out']);
    }

    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:100',
            'email' => 'required|email|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => bcrypt($request->password),
        ]);

        $this->logSuccess('register-user', "Registered User: {$user->name}", [
            'user_id' => $user->id,
            'new_data' => $user->toArray(),
        ]);

        return response()->json(['user' => $user, 'message' => 'Register success']);
    }

    public function me(Request $request)
    {
        return response()->json($request->user());
    }

    public function refreshToken(Request $request)
    {
        $user = $request->user();

        $user->tokens()->delete();
        $token = $user->createToken('auth')->plainTextToken;

        $this->logSuccess('refresh-user', "Refresh User: {$user->name}", [
            'user_id' => $user->id,
        ]);

        return response()->json([
            'token' => $token,
        ]);
    }

    public function verify(Request $request)
    {
        return response()->json(['message' => 'verify not implemented']);
    }

    public function forgotPassword(Request $request)
    {
        return response()->json(['message' => 'Forgot password not implemented']);
    }

    public function resetPassword(Request $request)
    {
        return response()->json(['message' => 'Reset password not implemented']);
    }

    public function updatePassword(Request $request)
    {
        $request->validate([
            'password' => 'required|string|min:8|confirmed',
        ]);

        $request->user()->update([
            'password' => bcrypt($request->password),
        ]);

        $this->logSuccess('update-password-user', "Update Password User: {$request->user()->name}", [
            'user_id' => $request->user()->id,
            'new_data' => $request->user()->toArray(),
        ]);

        return response()->json(['message' => 'Password updated successfully']);
    }

    public function updateProfile(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:100',
        ]);

        $request->user()->update([
            'name' => $request->name,
        ]);

        $this->logSuccess('update-profile-user', "Update Profile User: {$request->user()->name}", [
            'user_id' => $request->user()->id,
            'new_data' => $request->user()->toArray(),
        ]);

        return response()->json(['message' => 'Profile updated successfully']);
    }

    public function updateAvatar(Request $request)
    {
        return response()->json(['message' => 'Update avatar not implemented']);
    }

    public function callbackGoogle(Request $request)
    {
        /** @var Provider $provider */
        $provider = Socialite::driver('google');

        $googleUser = $provider->stateless()
            ->userFromToken($request->access_token);

        $user = User::updateOrCreate(
            ['email' => $googleUser->email],
            [
                'name' => $googleUser->name,
            ]
        );

        $user->tokens()->delete();

        $token = $user->createToken('auth')->plainTextToken;

        $this->logSuccess('login-user', "Logged User: {$user->name}", [
            'user_id' => $user->id,
        ]);

        return response()->json([
            'token' => $token,
            'user' => $user,
        ]);
    }

    public function verifyTokenGoogle(Request $request)
    {
        $request->validate([
            'id_token' => 'required|string',
        ]);

        // 🔐 Verify ke Google
        $response = Http::get(
            'https://oauth2.googleapis.com/tokeninfo',
            ['id_token' => $request->id_token]
        );

        if (!$response->ok()) {
            return response()->json(['message' => 'Invalid Google token'], 401);
        }

        $google = $response->json();

        // 🔒 VALIDASI WAJIB
        if (($google['aud'] ?? null) !== config('services.google.client_id')) {
            return response()->json(['message' => 'Invalid token audience'], 401);
        }

        if (!($google['email_verified'] ?? false)) {
            return response()->json(['message' => 'Email not verified'], 403);
        }

        // ✅ CREATE / UPDATE USER
        $user = User::updateOrCreate(
            ['email' => $google['email']],
            [
                'name' => $google['name'] ?? $google['email'],
                'google_id' => $google['sub'],
                'avatar' => $google['picture'] ?? null,
                'password' => bcrypt(Str::random(32)),
            ]
        );

        $user->tokens()->delete();

        $token = $user->createToken('google')->plainTextToken;

        $this->logSuccess('login-google-user', "Google Login User: {$user->name}", [
            'user_id' => $user->id,
            'new_data' => $user->toArray(),
        ]);

        return response()->json([
            'token' => $token,
            'user' => $user,
        ]);
    }
}
