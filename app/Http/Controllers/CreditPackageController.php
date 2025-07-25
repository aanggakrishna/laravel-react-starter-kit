<?php

namespace App\Http\Controllers;

use App\Models\CreditPackage;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CreditPackageController extends Controller
{
    public function index()
    {
        $packages = CreditPackage::where('is_active', true)->get();
        
        return Inertia::render('credits/index', [
            'packages' => $packages,
        ]);
    }

    public function adminIndex()
    {
        $packages = CreditPackage::orderBy('created_at', 'desc')->get();
        
        return Inertia::render('admin/credits/index', [
            'packages' => $packages,
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/credits/create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'credits' => 'required|integer|min:1',
            'price' => 'required|numeric|min:0',
            'premium_days' => 'required|integer|min:0',
            'is_active' => 'boolean',
        ]);

        CreditPackage::create($validated);

        return redirect()->route('admin.credits.index')
            ->with('success', 'Paket kredit berhasil dibuat.');
    }

    public function edit(CreditPackage $creditPackage)
    {
        return Inertia::render('admin/credits/edit', [
            'package' => $creditPackage,
        ]);
    }

    public function update(Request $request, CreditPackage $creditPackage)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'credits' => 'required|integer|min:1',
            'price' => 'required|numeric|min:0',
            'premium_days' => 'required|integer|min:0',
            'is_active' => 'boolean',
        ]);

        $creditPackage->update($validated);

        return redirect()->route('admin.credits.index')
            ->with('success', 'Paket kredit berhasil diperbarui.');
    }

    public function destroy(CreditPackage $creditPackage)
    {
        // Cek apakah paket sudah digunakan dalam transaksi
        if ($creditPackage->transactions()->exists()) {
            return redirect()->route('admin.credits.index')
                ->with('error', 'Paket kredit tidak dapat dihapus karena sudah digunakan dalam transaksi.');
        }

        $creditPackage->delete();

        return redirect()->route('admin.credits.index')
            ->with('success', 'Paket kredit berhasil dihapus.');
    }
}