<?php

namespace App\Http\Controllers\Admin\Core;

use Inertia\Inertia;
use App\Models\Core\Role;
use App\Traits\LogActivity;
use Illuminate\Http\Request;
use App\Models\Core\Permission;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreRoleRequest;
use App\Http\Requests\UpdateRoleRequest;

class RoleController extends Controller
{
    use LogActivity;

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $this->authorize('viewAny', Role::class);

        $data = [];

        return Inertia::render('admin/core/roles/list', $data);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $this->authorize('create', Role::class);

        $permissions = Permission::with(['roles'])->get();

        $data = [
            'permissions' => $permissions
        ];

        return Inertia::render('admin/core/roles/create', $data);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreRoleRequest $request)
    {
        $this->authorize('create', Role::class);

        $role = Role::create([
            'name' => $request->name,
        ]);

        $role->permissions()->sync($request->permissions);

        if ($role) {
            $this->logSuccess('create-role', "Created Role: {$role->name}", [
                'role_id' => $role->id,
                'new_data' => $role->toArray(),
            ]);
        } else {
            $this->logError('create-role', "Failed to create role: {$role->name}", [
                'role_id' => $role->id,
                'new_data' => $role->toArray(),
            ]);
        }

        if ($request->saveBack) {
            return redirect()->route('roles.index')->with('success', 'Role created successfully');
        }

        return redirect()->back()->with('success', 'Role created successfully');
    }

    /**
     * Display the specified resource.
     */
    public function show(Role $role)
    {
        $this->authorize('view', $role);

        $findData = Role::with(['permissions'])->find($role->id);

        $data = [
            'role' => $findData,
        ];

        return Inertia::render('admin/core/roles/show', $data);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Role $role)
    {
        $this->authorize('update', $role);

        $permissions = Permission::with(['roles'])->get();

        $findData = $role->load('permissions');

        $data = [
            'role' => $findData,
            'permissions' => $permissions
        ];

        return Inertia::render('admin/core/roles/edit', $data);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateRoleRequest $request, Role $role)
    {
        $this->authorize('update', $role);

        $oldData = $role->replicate();
        $role->update([
            'name' => $request->name,
        ]);

        $role->permissions()->sync($request->permissions);

        if ($role) {
            $this->logSuccess('update-role', "Update Role: {$role->name}", [
                'role_id' => $role->id,
                'old_data' => $oldData->toArray(),
                'new_data' => $role->toArray(),
            ]);
        } else {
            $this->logError('update-role', "Failed to update role: {$role->name}", [
                'role_id' => $role->id,
                'old_data' => $oldData->toArray(),
                'new_data' => $role->toArray(),
            ]);
        }

        if ($request->saveBack) {
            return redirect()->route('roles.index')->with('success', 'Role updated successfully');
        }

        return redirect()->back()->with('success', 'Role updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Role $role)
    {
        $this->authorize('delete', $role);

        $role->delete();

        if ($role) {
            $this->logSuccess('delete-role', "Delete Role: {$role->name}", ['role_id' => $role->id]);
        } else {
            $this->logError('delete-role', "Failed to delete role: {$role->name}", ['role_id' => $role->id]);
        }

        return redirect()->route('roles.index')->with('success', 'Role deleted successfully');
    }

    public function getData(Request $request)
    {
        $this->authorize('data-role', Role::class);

        $perPage = $request->input('perPage', null);
        $page = $request->input('page', null);
        $globalSearch = $request->input('globalSearch', '');
        $orderDirection = $request->input('orderDirection', 'desc');
        $orderBy = $request->input('orderBy', 'id');

        $query = Role::query()
            ->with(['permissions'])
            ->latest()
            ->when($globalSearch, function ($query, $search) {
                return $query->where('name', 'like', "%{$search}%");
            })
            ->orderBy('created_at', 'desc')
            ->orderBy($orderBy, $orderDirection);

        if ($perPage) {
            $data = $query->paginate($perPage, ['*'], 'page', $page);
        } else {
            $data = $query->get();
        }

        return response()->json($data);
    }
}
