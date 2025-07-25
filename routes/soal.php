<?php

use App\Http\Controllers\JenjangController;
use App\Http\Controllers\PromptController;
use App\Http\Controllers\KerjaController;
use App\Http\Controllers\TipeSoalController;
use Illuminate\Support\Facades\Route;



// Admin routes (protected)
Route::middleware(['auth'])->group(function () {
    // Jenjang
    Route::resource('jenjangs', JenjangController::class);
    
    // Tipe Soal
    Route::resource('tipe-soals', TipeSoalController::class);
    
    // Prompt (Soal AI)
    Route::resource('prompts', PromptController::class);
    Route::get('prompts/{prompt}/download-word', [PromptController::class, 'downloadWord'])->name('prompts.download-word');
    
    // Rute untuk pengerjaan soal
    Route::get('/soal/{hash_id}/kerjakan', [KerjaController::class, 'start'])->name('soal.kerjakan');
    Route::post('/soal/save-answer', [KerjaController::class, 'saveAnswer'])->name('soal.save-answer');
    Route::post('/soal/submit', [KerjaController::class, 'submit'])->name('soal.submit');
    Route::get('/soal/hasil/{kerja_id}', [KerjaController::class, 'hasil'])->name('soal.hasil');
    Route::get('/soal/hasil/{kerja_id}/download', [KerjaController::class, 'downloadWord'])->name('soal.download');
    
    // Rute untuk riwayat pengerjaan soal
    Route::get('/soal-jawaban/riwayat', [KerjaController::class, 'riwayat'])->name('soal.riwayat');
    Route::get('/soal-jawaban/riwayat/{kerja_id}', [KerjaController::class, 'hasil'])->name('soal.riwayat.detail');
});

// Public routes
Route::get('/soal', [PromptController::class, 'publicIndex'])->name('soal.public');
Route::get('/soal/{hashId}', [PromptController::class, 'publicShow'])->name('soal.public.show');