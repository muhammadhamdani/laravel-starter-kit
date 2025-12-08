<?php

namespace App\Traits;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

trait UploadFiles
{
    public function uploadFile(?string $oldPath, UploadedFile $file, string $folder): string
    {
        if ($oldPath && Storage::disk('public')->exists($oldPath)) {
            Storage::disk('public')->delete($oldPath);
        }

        return $file->store($folder, 'public');
    }

    public function uploadFileAs(?string $oldPath, UploadedFile $file, string $folder, string $fileName): string
    {
        if ($oldPath && Storage::disk('public')->exists($oldPath)) {
            Storage::disk('public')->delete($oldPath);
        }

        return $file->storeAs($folder, $fileName, 'public');
    }

    public function deleteFile(?string $path): void
    {
        if ($path && Storage::disk('public')->exists($path)) {
            Storage::disk('public')->delete($path);
        }
    }
}
