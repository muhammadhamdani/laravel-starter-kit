<?php

namespace App\Http\Controllers\Admin\Core\Region;

use Inertia\Inertia;
use App\Traits\LogActivity;
use App\Models\Core\Village;
use Illuminate\Http\Request;
use App\Models\Core\District;
use App\Http\Controllers\Controller;
use App\Http\Requests\Core\StoreVillageRequest;
use App\Http\Requests\Core\UpdateVillageRequest;

class VillageController extends Controller
{
    use LogActivity;

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $this->authorize('viewAny', Village::class);

        $data = [];

        return Inertia::render('admin/core/regions/villages/list', $data);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $this->authorize('create', Village::class);

        $data = [
            'districts' => District::query()->get()
        ];

        return Inertia::render('admin/core/regions/villages/create', $data);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreVillageRequest $request)
    {
        $this->authorize('create', Village::class);

        $data = [
            'id' => Village::where('district_id', $request->district_id)->max('id') + 1,
            'name' => $request->name,
            'district_id' => $request->district_id,
        ];

        $village = Village::create($data);

        if ($village) {
            $this->logSuccess('create-village', "Created Village: {$village->name}", [
                'village_id' => $village->id,
                'new_data' => $village->toArray(),
            ]);
        } else {
            $this->logError('create-village', "Failed To Create Village: {$village->name}", [
                'village_id' => $village->id,
                'new_data' => $village->toArray(),
            ]);
        }

        return redirect()->route('admin.core.regions.villages.index')->with('success', 'Village Created Successfully');
    }

    /**
     * Display the specified resource.
     */
    public function show(Village $village)
    {
        $this->authorize('view', $village);

        $findData = Village::with(['district'])->find($village->id);

        $data = [
            'village' => $findData
        ];

        return Inertia::render('admin/core/regions/villages/show', $data);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Village $village)
    {
        $this->authorize('update', $village);

        $findData = Village::with(['district'])->find($village->id);

        $data = [
            'village' => $findData,
            'districts' => District::query()->get()
        ];

        return Inertia::render('admin/core/regions/villages/edit', $data);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateVillageRequest $request, Village $village)
    {
        $this->authorize('update', $village);

        $data = [
            'name' => $request->name,
            'district_id' => $request->district_id,
        ];

        $oldData = $village->replicate();
        $village->update($data);

        if ($village) {
            $this->logSuccess('update-village', "Update Village: {$village->name}", [
                'village_id' => $village->id,
                'old_data' => $oldData->toArray(),
                'new_data' => $village->toArray(),
            ]);
        } else {
            $this->logError('update-village', "Failed To Update Village: {$village->name}", [
                'village_id' => $village->id,
                'old_data' => $oldData->toArray(),
                'new_data' => $village->toArray(),
            ]);
        }

        return redirect()->route('admin.core.regions.villages.index')->with('success', 'Village Updated Successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Village $village)
    {
        $this->authorize('delete', $village);

        $village->delete();

        if ($village) {
            $this->logSuccess('delete-village', "Delete Village: {$village->name}", ['village_id' => $village->id]);
        } else {
            $this->logError('delete-village', "Failed To Delete Village: {$village->name}", ['village_id' => $village->id]);
        }

        return redirect()->route('admin.core.regions.villages.index')->with('success', 'Village Deleted Successfully');
    }

    public function getData(Request $request)
    {
        $this->authorize('data-region', new Village());

        $perPage = $request->input('perPage', null);
        $page = $request->input('page', null);
        $globalSearch = $request->input('globalSearch', '');
        $orderDirection = $request->input('orderDirection', 'desc');
        $orderBy = $request->input('orderBy', 'id');

        $query = Village::query()
            ->with(['district.regency.province'])
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
