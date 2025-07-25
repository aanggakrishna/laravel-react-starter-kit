<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ImageUploadController extends Controller
{
    public function upload(Request $request)
    {
        $request->validate([
            'file' => 'required|image|max:2048',
        ]);

        $file = $request->file('file');
        $filename = Str::random(20) . '.' . $file->getClientOriginalExtension();
        
        // Simpan file ke storage publik
        $path = $file->storeAs('uploads/editor', $filename, 'public');
        
        // Return URL gambar untuk TinyMCE
        return response()->json([
            'location' => Storage::url($path)
        ]);
    }
}