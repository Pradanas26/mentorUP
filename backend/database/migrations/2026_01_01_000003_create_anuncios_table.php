<?php

// ============================================================
// MIGRACIÓN: Tabla ANUNCIOS
// Los profesores publican anuncios para ofrecer sus clases
// Solo profesores pueden crear anuncios (RN-7)
// ============================================================

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('anuncios', function (Blueprint $table) {
            $table->id();

            // ID del profesor que crea el anuncio
            $table->unsignedBigInteger('profesor_id');
            $table->foreign('profesor_id')->references('id')->on('profesores');

            $table->string('titulo', 160);          // Título del anuncio
            $table->text('descripcion');             // Descripción detallada
            $table->string('asignatura', 100);       // Materia que imparte

            // Precio mínimo 0.01€ (RN-10: no puede ser 0 ni negativo)
            $table->decimal('precio_hora', 6, 2);

            // Nivel educativo: 'ESO', 'Bachillerato', 'Universidad', etc.
            $table->enum('nivel', ['Primaria', 'ESO', 'Bachillerato', 'Universidad', 'Otro']);

            $table->text('disponibilidad')->nullable(); // Días/horas disponibles

            // Destacado: el profesor paga para aparecer primero (RN-12)
            $table->tinyInteger('destacado')->default(0);
            $table->dateTime('destacado_hasta')->nullable(); // Hasta cuándo está destacado

            // Activo: 1=visible, 0=oculto (RN-29: no se borra, se desactiva)
            $table->tinyInteger('activo')->default(1);

            $table->timestamps(); // created_at y updated_at
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('anuncios');
    }
};
