<?php

use App\Http\Controllers\CreditPackageController;
use App\Http\Controllers\CreditTransactionController;
use App\Http\Controllers\UsageController;
use App\Http\Controllers\DuitkuController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth')->group(function () {
    // User routes
    Route::get('/credits', [CreditPackageController::class, 'index'])->name('credits.index');
    Route::post('/credits/purchase/{package}', [CreditTransactionController::class, 'purchase'])->name('credits.purchase');
    Route::get('/credits/transactions', [CreditTransactionController::class, 'index'])->name('credits.transactions');
    
    // Usage page
    Route::get('/usage', [UsageController::class, 'index'])->name('usage.index');
    
    // Admin routes
    Route::middleware(['auth'])->prefix('admin')->name('admin.')->group(function () {
        Route::get('/credits', [CreditPackageController::class, 'adminIndex'])->name('credits.index');
        Route::get('/credits/create', [CreditPackageController::class, 'create'])->name('credits.create');
        Route::post('/credits', [CreditPackageController::class, 'store'])->name('credits.store');
        Route::get('/credits/{creditPackage}/edit', [CreditPackageController::class, 'edit'])->name('credits.edit');
        Route::put('/credits/{creditPackage}', [CreditPackageController::class, 'update'])->name('credits.update');
        Route::delete('/credits/{creditPackage}', [CreditPackageController::class, 'destroy'])->name('credits.destroy');
        
        Route::get('/credits/transactions', [CreditTransactionController::class, 'adminIndex'])->name('credits.transactions');
        Route::post('/credits/add', [CreditTransactionController::class, 'adminAddCredits'])->name('credits.add');
    });
    
    // Duitku routes
    Route::post('/credits/duitku/create/{package}', [DuitkuController::class, 'createTransaction'])->name('credits.duitku.create');
    Route::post('/duitku/callback', [DuitkuController::class, 'callback'])->name('duitku.callback');
    Route::get('/duitku/return', [DuitkuController::class, 'returnPage'])->name('duitku.return');
});