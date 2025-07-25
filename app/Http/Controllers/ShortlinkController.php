<?php

namespace App\Http\Controllers;

use App\Models\Shortlink;
use Illuminate\Http\Request;

class ShortlinkController extends Controller
{
    /**
     * Redirect based on shortlink code
     */
    public function redirect(string $code)
    {
        $shortlink = Shortlink::where('code', $code)->firstOrFail();
        $shortlink->incrementClickCount();
        
        $linkable = $shortlink->linkable;
        
        if ($shortlink->type === 'prompt') {
            return redirect()->route('soal.public.show', $linkable->hash_id);
        }
        
        // Default fallback
        return redirect()->route('home');
    }
}
