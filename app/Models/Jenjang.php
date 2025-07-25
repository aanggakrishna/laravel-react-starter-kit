<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Jenjang extends Model
{
    use HasFactory;

    protected $table = 'jenjangs';
    
    protected $fillable = ['nama', 'color'];
    
    /**
     * Get the badge color for this jenjang
     *
     * @return string
     */
    public function getBadgeColorAttribute(): string
    {
        $colors = [
            'SD' => 'green',
            'SMP' => 'blue',
            'SMA' => 'purple',
            'Perguruan Tinggi' => 'orange',
            'Umum' => 'slate'
        ];
        
        return $colors[$this->nama] ?? 'slate';
    }
}