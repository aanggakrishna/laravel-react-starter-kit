<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('prompts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('jenjang_id')->constrained('jenjangs')->onDelete('cascade');
            $table->foreignId('tipe_soal_id')->constrained('tipe_soals')->onDelete('cascade');
            $table->integer('jumlah_soal');
            $table->text('perintah')->nullable();
            $table->longText('result_json')->nullable();
            $table->integer('result_length')->nullable();
            $table->decimal('cost_usd', 10, 6)->nullable();
            $table->decimal('cost_idr', 10, 2)->nullable();
            $table->string('model')->nullable();
            $table->string('status')->default('pending'); // pending, completed, failed
            $table->text('error_message')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('prompts');
    }
};