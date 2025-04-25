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
        Schema::create('messages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('exam_file_id')->constrained()->onDelete('cascade');
            $table->boolean('is_gaia');
            $table->foreignId('sender_id')->nullable()->constrained('users')->onDelete('cascade');
            $table->boolean('responded')->nullable();
            $table->foreignId('reply_to')->nullable()->constrained('messages')->onDelete('cascade');
            $table->text('content');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('messages');
    }
};
