<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\SitemapController;
use App\Http\Controllers\ShortlinkController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

// Sitemap route
Route::get('/sitemap.xml', [SitemapController::class, 'index']);

// Shortlink route
Route::get('/s/{code}', [ShortlinkController::class, 'redirect'])->name('shortlink.redirect');

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
require __DIR__.'/dashboard.php';
require __DIR__.'/blog.php';
require __DIR__.'/soal.php';
require __DIR__.'/credits.php'; // Tambahkan ini
