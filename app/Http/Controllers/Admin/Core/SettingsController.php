<?php

namespace App\Http\Controllers\Admin\Core;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;

class SettingsController extends Controller
{
    public function uploadFile(Request $request)
    {
        $request->validate(['image' => ['required', 'image', 'mimes:jpeg,png,jpg,gif,svg', 'max:2048']]);

        $path = $request->file('image')->store('uploads', 'public');

        return response()->json(['url' => asset('storage/' . $path)]);
    }

    public function deleteFile(Request $request)
    {
        $url = $request->input('url');

        // Convert full URL to relative storage path
        $path = str_replace(asset('storage') . '/', '', $url);

        if (Storage::disk('public')->exists($path)) {
            Storage::disk('public')->delete($path);

            return response()->json(['success' => true]);
        }

        return response()->json(['success' => false, 'message' => 'File not found'], 404);
    }
}
