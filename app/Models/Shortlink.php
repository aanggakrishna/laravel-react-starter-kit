<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Support\Str;

class Shortlink extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'type',
        'linkable_id',
        'linkable_type',
        'click_count',
    ];

    /**
     * Get the parent linkable model.
     */
    public function linkable(): MorphTo
    {
        return $this->morphTo();
    }

    /**
     * Increment click count
     */
    public function incrementClickCount(): void
    {
        $this->increment('click_count');
    }

    /**
     * Generate a unique shortlink code
     */
    public static function generateUniqueCode(): string
    {
        $code = Str::random(6);
        
        // Ensure code is unique
        while (self::where('code', $code)->exists()) {
            $code = Str::random(6);
        }
        
        return $code;
    }
}
