<?php

namespace App\Http\Controllers;

use App\Models\CreditPackage;
use App\Models\CreditTransaction;
use AdityaDarma\LaravelDuitku\Facades\DuitkuPOP;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class DuitkuController extends Controller
{
    public function createTransaction(Request $request, CreditPackage $package)
    {
        
        // Validasi request
        $request->validate([
            'payment_method' => 'required|string',
        ]);

        $user = auth()->user();
        $merchantOrderId = 'TRANS-' . time();
        try {
        // Buat transaksi di database dengan status pending
        $transaction = $user->creditTransactions()->create([
            'credit_package_id' => $package->id,
            'transaction_type' => 'purchase',
            'amount' => $package->credits,
            'description' => "Pembelian paket {$package->name}",
            'payment_method' => $request->payment_method,
            'payment_status' => 'pending',
            'transaction_id' => $merchantOrderId,
        ]);
        
        
            // Buat transaksi di Duitku
            // Konversi price dari decimal ke integer (mengalikan dengan 100 untuk mengubah dari rupiah ke sen)
        // dd($user->name);
            $result = DuitkuPOP::createTransaction([
                'merchantOrderId'   => $merchantOrderId,
                'customerVaName'    => `$user->name`,
                'email'             => $user->email,
                'paymentAmount'     => $package->price,
                'productDetails'    => 'Pembelian paket '.$package->name,
                'expiryPeriod'      => 30, 
            ]);
            
            // Jika berhasil, kembalikan reference dan URL pembayaran
            if (isset($result->reference) && isset($result->paymentUrl)) {
                return response()->json([
                    'success' => true,
                    'reference' => $result->reference,
                    'paymentUrl' => $result->paymentUrl
                ]);
            }
            
            // Jika gagal, kembalikan error
            return response()->json([
                'success' => false,
                'message' => $result->message ?? 'Gagal membuat transaksi'
            ], 400);
        } catch (\Exception $e) {
            Log::error('Duitku Error: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan: ' . $e->getMessage()
            ], 500);
        }
    }
    
    public function callback(Request $request)
    {
        try {
            // Verifikasi callback dari Duitku
            $notification = DuitkuPOP::getNotificationTransaction();
            
            if ($notification) {
                // Log notifikasi untuk debugging
                Log::info('Duitku Callback', (array) $notification);
                
                // Cari transaksi berdasarkan merchantOrderId
                $transaction = CreditTransaction::where('transaction_id', $notification->merchantOrderId)->first();
                
                if ($transaction) {
                    // Update status transaksi
                    $transaction->payment_status = strtolower($notification->resultCode) == '00' ? 'completed' : 'failed';
                    $transaction->save();
                    
                    // Jika pembayaran berhasil, tambahkan kredit ke user
                    if ($transaction->payment_status == 'completed') {
                        $user = $transaction->user;
                        $package = $transaction->creditPackage;
                        
                        // Tambahkan kredit ke user
                        $user->credits += $package->credits;
                        
                        // Aktifkan premium jika paket menyediakan hari premium
                        if ($package->premium_days > 0) {
                            $user->activatePremium($package->premium_days);
                        } else {
                            $user->save();
                        }
                    }
                    
                    // Kembalikan response sesuai format yang diminta Duitku
                    return response()->json(['success' => true]);
                }
            }
            
            return response()->json(['success' => false], 400);
        } catch (\Exception $e) {
            Log::error('Duitku Callback Error: ' . $e->getMessage());
            return response()->json(['success' => false], 500);
        }
    }
    
    public function returnPage(Request $request)
    {
        // Ambil reference dari request atau localStorage
        $reference = $request->input('reference', null);
        $status = $request->input('status', 'pending');
        $message = $request->input('message', 'Pembayaran sedang diproses');
        
        // Redirect ke halaman usage dengan status transaksi
        return redirect()->route('usage.index')->with([
            'payment_status' => $status,
            'payment_message' => $message,
            'payment_reference' => $reference
        ]);
    }
}
