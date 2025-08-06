<?php

use App\Http\Controllers\PageController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\TagController;
use Illuminate\Support\Facades\Route;

// Public page routes

// Admin routes (protected)
Route::middleware(['auth'])->group(function () {
    Route::resource('pages', PageController::class);
    
    
});
Route::get('/page', [PageController::class, 'index'])->name('page.index');
Route::get('/page/{slug}', [PageController::class, 'show'])->name('page.show');
