<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PromptDetail extends Model
{
    use HasFactory;

    protected $fillable = [
        'prompt_id',
        'soal',
        'pilihan',
        'jawaban',
        'jawaban_benar',
        'penjelasan',
        'keterangan_tambahan',
    ];

    protected $casts = [
        'pilihan' => 'array',
    ];

    public function prompt(): BelongsTo
    {
        return $this->belongsTo(Prompt::class);
    }
}