<?php

namespace App\Http\Controllers\Admin\Core\Region;

use Inertia\Inertia;
use App\Traits\LogActivity;
use Illuminate\Http\Request;
use App\Models\Core\District;
use App\Http\Controllers\Controller;
use App\Http\Requests\Core\StoreDistrictRequest;
use App\Http\Requests\Core\UpdateDistrictRequest;
use App\Models\Core\Regency;

class DistrictController extends Controller
{
    use LogActivity;

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $this->authorize('viewAny', District::class);

        $data = [];

        return Inertia::render('admin/core/regions/districts/list', $data);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $this->authorize('create', District::class);

        $data = [
            'regencies' => Regency::query()->get()
        ];

        return Inertia::render('admin/core/regions/districts/create', $data);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreDistrictRequest $request)
    {
        $this->authorize('create', District::class);

        $data = [
            'id' => District::where('regency_id', $request->regency_id)->max('id') + 1,
            'name' => $request->name,
            'regency_id' => $request->regency_id,
        ];

        $district = District::create($data);

        if ($district) {
            $this->logSuccess('create-district', "Created District: {$district->name}", [
                'district_id' => $district->id,
                'new_data' => $district->toArray(),
            ]);
        } else {
            $this->logError('create-district', "Failed To Create District: {$district->name}", [
                'district_id' => $district->id,
                'new_data' => $district->toArray(),
            ]);
        }

        return redirect()->route('admin.core.regions.districts.index')->with('success', 'District Created Successfully');
    }

    /**
     * Display the specified resource.
     */
    public function show(District $district)
    {
        $this->authorize('view', $district);

        $findData = District::with(['regency'])->find($district->id);

        $data = [
            'district' => $findData,
        ];

        return Inertia::render('admin/core/regions/districts/show', $data);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(District $district)
    {
        $this->authorize('update', $district);

        $findData = District::with(['regency'])->find($district->id);

        $data = [
            'district' => $findData,
            'regencies' => Regency::query()->get()
        ];

        return Inertia::render('admin/core/regions/districts/edit', $data);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateDistrictRequest $request, District $district)
    {
        $this->authorize('update', $district);

        $data = [
            'name' => $request->name,
            'regency_id' => $request->regency_id,
        ];

        $oldData = $district->replicate();
        $district->update($data);

        if ($district) {
            $this->logSuccess('update-district', "Update District: {$district->name}", [
                'district_id' => $district->id,
                'old_data' => $oldData->toArray(),
                'new_data' => $district->toArray(),
            ]);
        } else {
            $this->logError('update-district', "Failed To Update District: {$district->name}", [
                'district_id' => $district->id,
                'old_data' => $oldData->toArray(),
                'new_data' => $district->toArray(),
            ]);
        }

        return redirect()->route('admin.core.regions.districts.index')->with('success', 'District Updated Successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(District $district)
    {
        $this->authorize('delete', $district);

        $district->delete();

        if ($district) {
            $this->logSuccess('delete-district', "Delete District: {$district->name}", ['district_id' => $district->id]);
        } else {
            $this->logError('delete-district', "Failed To Delete District: {$district->name}", ['district_id' => $district->id]);
        }

        return redirect()->route('admin.core.regions.districts.index')->with('success', 'District Deleted Successfully');
    }

    public function getData(Request $request)
    {
        $this->authorize('data-region', new District());

        $perPage = $request->input('perPage', null);
        $page = $request->input('page', null);
        $globalSearch = $request->input('globalSearch', '');
        $orderDirection = $request->input('orderDirection', 'desc');
        $orderBy = $request->input('orderBy', 'id');

        $query = District::query()
            ->with(['regency', 'villages'])
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
