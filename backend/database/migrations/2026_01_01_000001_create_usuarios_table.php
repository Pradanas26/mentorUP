<?php

// ============================================================
// MIGRACIÓN: Tabla USUARIOS
// Las migraciones son como "instrucciones" para crear tablas
// en la base de datos. Laravel las ejecuta en orden.
// ============================================================

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Crea la tabla cuando ejecutas: php artisan migrate
     */
    public function up(): void
    {
        Schema::create('usuarios', function (Blueprint $table) {
            $table->id();                                    // ID único autoincremental
            $table->string('nombre', 80);                   // Nombre del usuario
            $table->string('apellidos', 120);               // Apellidos
            $table->string('email', 150)->unique();         // Email único (RN-1)
            $table->string('password_hash', 255);           // Contraseña cifrada (RN-3)
            $table->string('foto_perfil', 255)->nullable(); // Foto de perfil (opcional)
            $table->string('telefono', 20)->nullable();     // Teléfono de contacto
            $table->string('ciudad', 80)->nullable();       // Ciudad
            $table->tinyInteger('activo')->default(1);      // 1=activo, 0=inactivo (RN-29)
            $table->tinyInteger('bloqueado')->default(0);   // 1=bloqueado por admin (RN-4)
            $table->timestamps();                           // created_at y updated_at automáticos
        });
    }

    /**
     * Deshace la migración cuando ejecutas: php artisan migrate:rollback
     */
    public function down(): void
    {
        Schema::dropIfExists('usuarios');
    }
};
