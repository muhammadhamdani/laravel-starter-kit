<?php

namespace App\Http\Controllers\Admin\Settings;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Settings\SiteSetting;
use App\Http\Controllers\Controller;
use App\Traits\LogActivity;
use App\Traits\UploadFiles;
use Illuminate\Support\Facades\Validator;

class SiteSettingsController extends Controller
{
    use LogActivity, UploadFiles;

    public function edit()
    {
        $data['settings'] = app(SiteSetting::class);

        return Inertia::render('admin/settings/site', $data);
    }

    public function update(Request $request, SiteSetting $settings)
    {
        $validated = Validator::make($request->all(), [
            'site_name' => ['required', 'string', 'max:255'],
            'site_description' => ['required', 'string', 'max:255'],
            'logo' => ['nullable', 'file', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
            'favicon' => ['nullable', 'file', 'mimes:jpg,jpeg,png,ico', 'max:1024'],
            'address' => ['nullable', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:255'],
            'email' => ['nullable', 'string', 'max:255'],
            'facebook' => ['nullable', 'string', 'max:255'],
            'instagram' => ['nullable', 'string', 'max:255'],
            'twitter' => ['nullable', 'string', 'max:255'],
            'youtube' => ['nullable', 'string', 'max:255'],
            'whatsapp' => ['nullable', 'string', 'max:255'],
            'tiktok' => ['nullable', 'string', 'max:255'],
        ])->validated();

        // Assign otomatis semua field
        foreach ($validated as $key => $value) {
            if (in_array($key, ['logo', 'favicon']) && $value instanceof \Illuminate\Http\UploadedFile) {

                // Upload file
                $path = $this->uploadFile($settings->$key, $value, "settings/$key");

                $settings->$key = $path;
            } else {
                // Field biasa
                $settings->$key = $value;
            }
        }

        // Simpan (wajib)
        $settings->save();

        // Log Activity
        if ($settings) {
            $this->logSuccess('update-site-settings', "Update Site Settings", [
                'name' => $validated['site_name'],
            ]);
        } else {
            $this->logError('update-site-settings', "Update Site Settings", [
                'name' => $validated['site_name'],
            ]);
        }

        return back()->with('success', 'Site Settings Update Successfully');
    }
}
