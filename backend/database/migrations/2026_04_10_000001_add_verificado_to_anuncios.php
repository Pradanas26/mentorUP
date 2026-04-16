<?php

// ============================================================
// MIGRACIÓN: Añadir campo 'verificado' a la tabla anuncios
// Los anuncios nuevos quedan en estado 'pendiente' hasta
// que el administrador los aprueba o rechaza.
// ============================================================

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('anuncios', function (Blueprint $table) {
            // Estado de verificación del anuncio:
            // 'pendiente' → recién creado, esperando revisión del admin
            // 'aprobado'  → el admin lo ha aprobado, visible para todos
            // 'rechazado' → el admin lo ha rechazado, no se muestra
            $table->enum('verificado', ['pendiente', 'aprobado', 'rechazado'])
                  ->default('pendiente')
                  ->after('activo');
        });
    }

    public function down(): void
    {
        Schema::table('anuncios', function (Blueprint $table) {
            $table->dropColumn('verificado');
        });
    }
};
