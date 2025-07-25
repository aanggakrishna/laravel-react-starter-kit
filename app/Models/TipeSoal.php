<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TipeSoal extends Model
{
    use HasFactory;

    protected $table = 'tipe_soals';
    
    protected $fillable = ['nama'];
}