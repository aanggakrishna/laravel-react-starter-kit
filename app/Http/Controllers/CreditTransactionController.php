<?php

namespace App\Http\Controllers;

use App\Models\CreditPackage;
use App\Models\CreditTransaction;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CreditTransactionController extends Controller
{
    public function index()
    {
        $transactions = auth()->user()->creditTransactions()
            ->with('creditPackage')
            ->orderBy('created_at', 'desc')
            ->paginate(10);
        
        return Inertia::render('credits/transactions', [
            'transactions' => $transactions,
        ]);
    }

    public function purchase(Request $request, CreditPackage $package)
    {
        // Validasi request
        $request->validate([
            'payment_method' => 'required|string',
        ]);

        // Di sini Anda akan mengintegrasikan dengan payment gateway
        // Untuk contoh sederhana, kita anggap pembayaran berhasil

        $user = auth()->user();
        
        // Buat transaksi
        $transaction = $user->creditTransactions()->create([
            'credit_package_id' => $package->id,
            'transaction_type' => 'purchase',
            'amount' => $package->credits,
            'description' => "Pembelian paket {$package->name}",
            'payment_method' => $request->payment_method,
            'payment_status' => 'completed',
            'transaction_id' => 'TRANS-' . time(), // Contoh ID transaksi
        ]);

        // Tambahkan kredit ke user
        $user->credits += $package->credits;
        
        // Aktifkan premium jika paket menyediakan hari premium
        if ($package->premium_days > 0) {
            $user->activatePremium($package->premium_days);
        }
        
        $user->save();

        return redirect()->route('credits.index')
            ->with('success', "Pembelian kredit berhasil. {$package->credits} kredit telah ditambahkan ke akun Anda.");
    }

    public function adminIndex()
    {
        $transactions = CreditTransaction::with(['user', 'creditPackage'])
            ->orderBy('created_at', 'desc')
            ->paginate(15);
        
        return Inertia::render('admin/credits/transactions', [
            'transactions' => $transactions,
        ]);
    }

    public function adminAddCredits(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'amount' => 'required|integer',
            'description' => 'nullable|string',
        ]);

        $user = User::findOrFail($validated['user_id']);
        $user->addCredits($validated['amount'], $validated['description'] ?? 'Penambahan kredit oleh admin');

        return redirect()->back()->with('success', 'Kredit berhasil ditambahkan.');
    }
}