<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class UsageController extends Controller
{
    public function index(Request $request)
    {
        $user = auth()->user();
        $transactions = $user->creditTransactions()
            ->with('creditPackage')
            ->orderBy('created_at', 'desc')
            ->paginate(10);
        
        // Ambil status pembayaran dari session jika ada
        $paymentStatus = session('payment_status');
        $paymentMessage = session('payment_message');
        $paymentReference = session('payment_reference');
        
        return Inertia::render('usage/index', [
            'user' => [
                'credits' => $user->credits,
                'is_premium' => $user->isPremium(),
                'premium_expires_at' => $user->premium_expires_at,
            ],
            'transactions' => $transactions,
            'payment' => [
                'status' => $paymentStatus,
                'message' => $paymentMessage,
                'reference' => $paymentReference,
            ],
        ]);
    }
}