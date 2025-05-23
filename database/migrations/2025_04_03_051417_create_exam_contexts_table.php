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
        Schema::create('exam_contexts', function (Blueprint $table) {
            $table->id();
            $table->string('filename');
            $table->string('extension');
            $table->string('path');
            $table->longText('content');
            $table->longText('instruction');
            $table->foreignId('exam_file_id')->nullable()->constrained()->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('exam_contexts');
    }
};
