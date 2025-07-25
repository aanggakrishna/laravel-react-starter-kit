<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('shortlinks', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->string('type');
            $table->unsignedBigInteger('linkable_id');
            $table->string('linkable_type');
            $table->integer('click_count')->default(0);
            $table->timestamps();
            
            $table->index(['linkable_id', 'linkable_type']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('shortlinks');
    }
};