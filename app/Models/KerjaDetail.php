<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class KerjaDetail extends Model
{
    use HasFactory;

    protected $fillable = [
        'kerja_id',
        'prompt_detail_id',
        'jawaban_user',
        'is_correct',
    ];

    protected $casts = [
        'is_correct' => 'boolean',
    ];

    public function kerja(): BelongsTo
    {
        return $this->belongsTo(Kerja::class);
    }

    public function promptDetail(): BelongsTo
    {
        return $this->belongsTo(PromptDetail::class);
    }
}
