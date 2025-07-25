<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Kerja extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'prompt_id',
        'session_id',
        'waktu_mulai',
        'waktu_selesai',
        'nilai',
        'is_completed',
    ];

    protected $casts = [
        'waktu_mulai' => 'datetime',
        'waktu_selesai' => 'datetime',
        'is_completed' => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function prompt(): BelongsTo
    {
        return $this->belongsTo(Prompt::class);
    }

    public function details(): HasMany
    {
        return $this->hasMany(KerjaDetail::class);
    }
}
