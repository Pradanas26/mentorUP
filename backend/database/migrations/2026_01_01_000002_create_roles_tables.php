<?php

// ============================================================
// MIGRACIÓN: Tablas ALUMNOS, PROFESORES y ADMINS
// Cada tipo de usuario tiene su propia tabla adicional
// que se conecta con la tabla 'usuarios' (RN-2)
// ============================================================

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Tabla alumnos: solo guarda la relación con usuarios
        Schema::create('alumnos', function (Blueprint $table) {
            $table->id();
            // Clave foránea: conecta con la tabla 'usuarios'
            $table->unsignedBigInteger('usuario_id');
            $table->foreign('usuario_id')->references('id')->on('usuarios')->onDelete('cascade');
            $table->timestamps();
        });

        // Tabla profesores: tiene campo bio para descripción
        Schema::create('profesores', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('usuario_id');
            $table->foreign('usuario_id')->references('id')->on('usuarios')->onDelete('cascade');
            $table->text('bio')->nullable(); // Descripción del profesor
            $table->timestamps();
        });

        // Tabla admins: gestiona la plataforma
        Schema::create('admins', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('usuario_id');
            $table->foreign('usuario_id')->references('id')->on('usuarios')->onDelete('cascade');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('admins');
        Schema::dropIfExists('profesores');
        Schema::dropIfExists('alumnos');
    }
};
