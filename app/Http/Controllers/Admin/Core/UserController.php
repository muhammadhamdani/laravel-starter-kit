<?php

namespace App\Http\Controllers\Admin\Core;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Models\Core\Role;
use App\Models\Core\User;
use App\Traits\LogActivity;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class UserController extends Controller
{
    use LogActivity;

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $this->authorize('viewAny', User::class);

        $data = [];

        return Inertia::render('admin/core/users/list', $data);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $this->authorize('create', User::class);

        $roles = Role::with(['permissions'])->get();

        $data = [
            'roles' => $roles
        ];

        return Inertia::render('admin/core/users/create', $data);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreUserRequest $request)
    {
        $this->authorize('create', User::class);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => bcrypt($request->password),
            'role' => ['required'],
        ])->assignRole($request->role);

        if ($user) {
            $this->logSuccess('create-user', "Created User: {$user->name}", [
                'user_id' => $user->id,
                'new_data' => $user->toArray(),
            ]);
        } else {
            $this->logError('create-user', "Failed to create user: {$user->name}", [
                'user_id' => $user->id,
                'new_data' => $user->toArray(),
            ]);
        }

        if ($request->saveBack) {
            return redirect()->route('users.index')->with('success', 'User created successfully');
        }

        return redirect()->back()->with('success', 'User created successfully');
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        $this->authorize('view', $user);

        $roles = Role::with(['permissions'])->get();

        $findData = User::with(['roles'])->find($user->id);

        $data = [
            'user' => $findData,
            'roles' => $roles
        ];

        return Inertia::render('admin/core/users/show', $data);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $user)
    {
        $this->authorize('update', $user);

        $roles = Role::with(['permissions'])->get();

        $findData = User::with(['roles'])->find($user->id);

        $data = [
            'user' => $findData,
            'roles' => $roles
        ];

        return Inertia::render('admin/core/users/edit', $data);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateUserRequest $request, User $user)
    {
        $this->authorize('update', $user);

        $oldData = $user->replicate();

        $user->update([
            'name' => $request->name,
            'email' => $request->email,
        ]);

        if ($request->password) {
            $user->update([
                'password' => bcrypt($request->password),
            ]);
        }

        $user->syncRoles($request->role);

        if ($user) {
            $this->logSuccess('update-user', "Update User: {$user->name}", [
                'user_id' => $user->id,
                'old_data' => $oldData->toArray(),
                'new_data' => $user->toArray(),
            ]);
        } else {
            $this->logError('update-user', "Failed to update user: {$user->name}", [
                'user_id' => $user->id,
                'old_data' => $oldData->toArray(),
                'new_data' => $user->toArray(),
            ]);
        }

        if ($request->saveBack) {
            return redirect()->route('users.index')->with('success', 'User updated successfully');
        }

        return redirect()->back()->with('success', 'User updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        $this->authorize('delete', $user);

        $user->delete();

        if ($user) {
            $this->logSuccess('delete-user', "Delete User: {$user->name}", ['user_id' => $user->id]);
        } else {
            $this->logError('delete-user', "Failed to delete user: {$user->name}", ['user_id' => $user->id]);
        }

        return redirect()->route('users.index')->with('success', 'User deleted successfully');
    }

    public function verify(Request $request)
    {
        $this->authorize('verify-user', User::class);

        $ids = $request->input('ids'); // bisa langsung array

        if (!is_array($ids)) {
            $ids = explode(',', $ids);
        }

        $ids = collect($ids)->flatten()->toArray();

        $query = User::query()
            ->whereIn('id', $ids)->update([
                'email_verified_at' => now()
            ]);

        if ($query) {
            $this->logSuccess('verify-user', "Verify User", []);
        } else {
            $this->logError('verify-user', "Failed to verify user", []);
        }

        return redirect()->back()->with('success', 'User verified successfully');
    }

    public function getData(Request $request)
    {
        $this->authorize('data-user', User::class);

        $perPage = $request->input('perPage', 10);
        $page = $request->input('page', 1);
        $globalSearch = $request->input('globalSearch', '');
        $orderDirection = $request->input('orderDirection', 'desc');
        $orderBy = $request->input('orderBy', 'id');

        $query = User::query()
            ->with(['roles'])
            ->latest()
            ->when($globalSearch, function ($query, $search) {
                return $query->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            })
            ->orderBy('created_at', 'desc')
            ->orderBy($orderBy, $orderDirection)
            ->paginate($perPage, ['*'], 'page', $page);

        return response()->json($query);
    }
}
