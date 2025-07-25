<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphOne;
use Illuminate\Support\Facades\Crypt;

class Prompt extends Model
{
    use HasFactory;

    // Tambahkan waktu_pengerjaan ke fillable
    protected $fillable = [
        'user_id',
        'jenjang_id',
        'tipe_soal_id',
        'jumlah_soal',
        'perintah',
        'result_json',
        'result_length',
        'cost_usd',
        'cost_idr',
        'model',
        'status',
        'error_message',
        'is_public',
        'view_count',
        'waktu_pengerjaan', // Tambahkan ini
    ];

    protected $casts = [
        'result_json' => 'array',
        'cost_usd' => 'decimal:6',
        'cost_idr' => 'decimal:2',
        'is_public' => 'boolean',
    ];

    protected $appends = ['hash_id'];

    /**
     * Increment view count for this prompt
     *
     * @return void
     */
    public function incrementViewCount(): void
    {
        $this->increment('view_count');
    }

    /**
     * Get the hashed ID for the prompt
     *
     * @return string
     */
    public function getHashIdAttribute(): string
    {
        return Crypt::encryptString($this->id);
    }

    /**
     * Find a prompt by its hashed ID
     *
     * @param string $hashId
     * @return Prompt|null
     */
    public static function findByHashId(string $hashId): ?Prompt
    {
        try {
            $id = Crypt::decryptString($hashId);
            return self::find($id);
        } catch (\Exception $e) {
            return null;
        }
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function jenjang(): BelongsTo
    {
        return $this->belongsTo(Jenjang::class);
    }

    public function tipeSoal(): BelongsTo
    {
        return $this->belongsTo(TipeSoal::class);
    }

    public function details(): HasMany
    {
        return $this->hasMany(PromptDetail::class);
    }

    /**
     * Get the shortlink for the prompt.
     */
    public function shortlink(): MorphOne
    {
        return $this->morphOne(Shortlink::class, 'linkable');
    }

    /**
     * Get or create shortlink for this prompt
     */
    public function getOrCreateShortlink(): Shortlink
    {
        if (!$this->shortlink) {
            return $this->shortlink()->create([
                'code' => Shortlink::generateUniqueCode(),
                'type' => 'prompt',
            ]);
        }
        
        return $this->shortlink;
    }
}