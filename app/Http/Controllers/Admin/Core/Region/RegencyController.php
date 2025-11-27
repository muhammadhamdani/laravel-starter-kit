<?php

namespace App\Http\Controllers\Admin\Core\Region;

use Inertia\Inertia;
use App\Traits\LogActivity;
use App\Models\Core\Regency;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Requests\Core\StoreRegencyRequest;
use App\Http\Requests\Core\UpdateRegencyRequest;
use App\Models\Core\Province;

class RegencyController extends Controller
{
    use LogActivity;

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $this->authorize('viewAny', Regency::class);

        $data = [];

        return Inertia::render('admin/core/regions/regencies/list', $data);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $this->authorize('create', Regency::class);

        $data = [
            'provinces' => Province::query()->get()
        ];

        return Inertia::render('admin/core/regions/regencies/create', $data);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreRegencyRequest $request)
    {
        $this->authorize('create', Regency::class);

        $data = [
            'id' => Regency::where('province_id', $request->province_id)->max('id') + 1,
            'name' => $request->name,
            'province_id' => $request->province_id,
        ];

        $regency = Regency::create($data);

        if ($regency) {
            $this->logSuccess('create-regency', "Created Regency: {$regency->name}", [
                'regency_id' => $regency->id,
                'new_data' => $regency->toArray(),
            ]);
        } else {
            $this->logError('create-regency', "Failed To Create Regency: {$regency->name}", [
                'regency_id' => $regency->id,
                'new_data' => $regency->toArray(),
            ]);
        }

        return redirect()->route('admin.core.regions.regencies.index')->with('success', 'Regency Created Successfully');
    }

    /**
     * Display the specified resource.
     */
    public function show(Regency $regency)
    {
        $this->authorize('view', $regency);

        $findData = Regency::with(['province'])->find($regency->id);

        $data = [
            'regency' => $findData
        ];

        return Inertia::render('admin/core/regions/regencies/show', $data);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Regency $regency)
    {
        $this->authorize('update', $regency);

        $findData = Regency::with(['province'])->find($regency->id);

        $data = [
            'regency' => $findData,
            'provinces' => Province::query()->get()
        ];

        return Inertia::render('admin/core/regions/regencies/edit', $data);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateRegencyRequest $request, Regency $regency)
    {
        $this->authorize('update', $regency);

        $data = [
            'name' => $request->name,
            'province_id' => $request->province_id,
        ];

        $oldData = $regency->replicate();
        $regency->update($data);

        if ($regency) {
            $this->logSuccess('update-regency', "Update Regency: {$regency->name}", [
                'regency_id' => $regency->id,
                'old_data' => $oldData->toArray(),
                'new_data' => $regency->toArray(),
            ]);
        } else {
            $this->logError('update-regency', "Failed To Update Regency: {$regency->name}", [
                'regency_id' => $regency->id,
                'old_data' => $oldData->toArray(),
                'new_data' => $regency->toArray(),
            ]);
        }

        return redirect()->route('admin.core.regions.regencies.index')->with('success', 'Regency Updated Successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Regency $regency)
    {
        $this->authorize('delete', $regency);

        $regency->delete();

        if ($regency) {
            $this->logSuccess('delete-regency', "Delete Regency: {$regency->name}", ['regency_id' => $regency->id]);
        } else {
            $this->logError('delete-regency', "Failed To Delete Regency: {$regency->name}", ['regency_id' => $regency->id]);
        }

        return redirect()->route('admin.core.regions.regencies.index')->with('success', 'Regency Deleted Successfully');
    }

    public function getData(Request $request)
    {
        $this->authorize('data-region', new Regency());

        $perPage = $request->input('perPage', null);
        $page = $request->input('page', null);
        $globalSearch = $request->input('globalSearch', '');
        $orderDirection = $request->input('orderDirection', 'desc');
        $orderBy = $request->input('orderBy', 'id');

        $query = Regency::query()
            ->with(['province', 'districts'])
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
