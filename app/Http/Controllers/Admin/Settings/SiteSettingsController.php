<?php

namespace App\Http\Controllers\Admin\Settings;

use Inertia\Inertia;
use App\Traits\LogActivity;
use App\Traits\UploadFiles;
use Illuminate\Http\Request;
use App\Settings\SiteSetting;
use Illuminate\Http\UploadedFile;
use App\Http\Controllers\Controller;
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

        foreach ($validated as $key => $value) {

            // khusus file logo/fav
            if (in_array($key, ['logo', 'favicon'])) {

                // jika user upload file baru
                if ($value instanceof UploadedFile) {
                    $settings->$key = $this->uploadFile(
                        $settings->$key,
                        $value,
                        "settings/$key"
                    );
                }
                // jika null → skip, tidak hapus value lama
                continue;
            }

            // field biasa
            $settings->$key = $value;
        }

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
