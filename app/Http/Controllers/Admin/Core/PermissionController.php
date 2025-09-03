<?php

namespace App\Http\Controllers\Admin\Core;

use Inertia\Inertia;
use App\Models\Core\Role;
use Illuminate\Http\Request;
use App\Models\Core\Permission;
use App\Http\Controllers\Controller;
use App\Http\Requests\StorePermissionRequest;
use App\Http\Requests\UpdatePermissionRequest;
use App\Traits\LogActivity;

class PermissionController extends Controller
{
    use LogActivity;

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $this->authorize('viewAny', Permission::class);

        $data = [];

        return Inertia::render('admin/core/permissions/list', $data);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $this->authorize('create', Permission::class);

        $roles = Role::with('permissions')->get();

        $data = [
            'roles' => $roles
        ];

        return Inertia::render('admin/core/permissions/create', $data);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePermissionRequest $request)
    {
        $this->authorize('create', Permission::class);

        $permission = Permission::create([
            'name' => $request->name,
        ]);

        if ($permission) {
            $this->logSuccess('create-permission', "Created Permission: {$permission->name}", [
                'permission_id' => $permission->id,
                'new_data' => $permission->toArray(),
            ]);
        } else {
            $this->logError('create-permission', "Failed to create permission: {$permission->name}", [
                'permission_id' => $permission->id,
                'new_data' => $permission->toArray(),
            ]);
        }

        if ($request->saveBack) {
            return redirect()->route('permissions.index')->with('success', 'Permission created successfully');
        }

        return redirect()->back()->with('success', 'Permission created successfully');
    }

    /**
     * Display the specified resource.
     */
    public function show(Permission $permission)
    {
        $this->authorize('view', $permission);

        $findData = Permission::find($permission->id);

        $data = [
            'permission' => $findData,
        ];

        return Inertia::render('admin/core/permissions/show', $data);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Permission $permission)
    {
        $this->authorize('update', $permission);

        $findData = Permission::with(['roles'])->find($permission->id);

        $data = [
            'permission' => $findData,
        ];

        return Inertia::render('admin/core/permissions/edit', $data);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePermissionRequest $request, Permission $permission)
    {
        $this->authorize('update', $permission);

        $oldData = $permission->replicate();
        $permission->update([
            'name' => $request->name,
        ]);

        if ($permission) {
            $this->logSuccess('update-permission', "Update Permission: {$permission->name}", [
                'permission_id' => $permission->id,
                'old_data' => $oldData->toArray(),
                'new_data' => $permission->toArray(),
            ]);
        } else {
            $this->logError('update-permission', "Failed to update permission: {$permission->name}", [
                'permission_id' => $permission->id,
                'old_data' => $oldData->toArray(),
                'new_data' => $permission->toArray(),
            ]);
        }

        if ($request->saveBack) {
            return redirect()->route('permissions.index')->with('success', 'Permission updated successfully');
        }

        return redirect()->back()->with('success', 'Permission updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(permission $permission)
    {
        $this->authorize('delete', $permission);

        $permission->delete();

        return redirect()->route('permissions.index')->with('success', 'Permission deleted successfully');
    }

    public function getData(Request $request)
    {
        $this->authorize('data-permission', new Permission());

        $perPage = $request->input('perPage', null);
        $page = $request->input('page', null);
        $globalSearch = $request->input('globalSearch', '');
        $orderDirection = $request->input('orderDirection', 'desc');
        $orderBy = $request->input('orderBy', 'id');

        $query = Permission::query()
            ->with(['roles'])
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
