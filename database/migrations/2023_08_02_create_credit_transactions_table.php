<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('credit_transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('credit_package_id')->nullable()->constrained()->nullOnDelete();
            $table->string('transaction_type'); // 'purchase', 'usage', 'admin_adjustment'
            $table->integer('amount'); // Jumlah kredit (positif untuk pembelian, negatif untuk penggunaan)
            $table->text('description')->nullable();
            $table->string('payment_method')->nullable(); // Metode pembayaran jika pembelian
            $table->string('payment_status')->nullable(); // Status pembayaran jika pembelian
            $table->string('transaction_id')->nullable(); // ID transaksi dari payment gateway
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('credit_transactions');
    }
};