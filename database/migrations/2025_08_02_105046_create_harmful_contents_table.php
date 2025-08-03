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
        Schema::create('harmful_contents', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->longText('content_json'); // Store TipTap JSON content
            $table->text('content_html')->nullable(); // Optional HTML backup
            $table->string('slug')->unique();
            $table->boolean('is_active')->default(true);
            $table->integer('version')->default(1);
            $table->json('version_history')->nullable(); // Store version history
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('harmful_contents');
    }
};
