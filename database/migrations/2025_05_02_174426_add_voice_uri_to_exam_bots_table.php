<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('exam_bots', function (Blueprint $table) {
            // Add the voice_uri column with a string type
            $table->string('voice_uri')->nullable()->after('exam_file_id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('exam_bots', function (Blueprint $table) {
            // Drop the voice_uri column in case of rollback
            $table->dropColumn('voice_uri');
        });
    }
};
