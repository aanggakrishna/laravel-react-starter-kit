<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('prompt_details', function (Blueprint $table) {
            $table->id();
            $table->foreignId('prompt_id')->constrained()->onDelete('cascade');
            $table->text('soal');
            $table->json('pilihan')->nullable(); // Untuk soal pilihan ganda
            $table->text('jawaban');
            $table->text('jawaban_benar')->nullable(); // Untuk soal pilihan ganda
            $table->text('penjelasan')->nullable();
            $table->text('keterangan_tambahan')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('prompt_details');
    }
};