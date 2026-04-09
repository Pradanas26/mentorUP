<?php

// ============================================================
// MIGRACIÓN: Tablas RESERVAS y VALORACIONES
// Reservas: cuando un alumno solicita clase con un profesor
// Valoraciones: la nota que deja el alumno tras la clase
// ============================================================

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // ── RESERVAS ──────────────────────────────────────────
        Schema::create('reservas', function (Blueprint $table) {
            $table->id();

            // El anuncio al que pertenece la reserva
            $table->unsignedBigInteger('anuncio_id');
            $table->foreign('anuncio_id')->references('id')->on('anuncios');

            // El alumno que reserva (RN-5: solo alumnos reservan)
            $table->unsignedBigInteger('alumno_id');
            $table->foreign('alumno_id')->references('id')->on('alumnos');

            // El profesor con quien se reserva
            $table->unsignedBigInteger('profesor_id');
            $table->foreign('profesor_id')->references('id')->on('profesores');

            $table->dateTime('fecha_clase');        // Cuándo es la clase (RN-14: debe ser futura)
            $table->decimal('duracion_h', 3, 1);    // Duración en horas (ej: 1.5 = 1h30min)

            // Precio total = precio_hora × duracion_h (RN-17)
            $table->decimal('precio_total', 7, 2);

            // Estado: sigue el flujo pendiente→confirmada→completada (RN-18)
            $table->enum('estado', ['pendiente', 'confirmada', 'completada', 'cancelada'])
                  ->default('pendiente');

            $table->text('notas_alumno')->nullable(); // Mensaje del alumno al profesor
            $table->timestamps();
        });

        // ── VALORACIONES ──────────────────────────────────────
        Schema::create('valoraciones', function (Blueprint $table) {
            $table->id();

            // Solo se puede valorar reservas completadas (RN-19)
            $table->unsignedBigInteger('reserva_id')->unique(); // unique: 1 valoración por clase (RN-20)
            $table->foreign('reserva_id')->references('id')->on('reservas');

            // El alumno que valora (RN-22: solo el alumno que asistió)
            $table->unsignedBigInteger('alumno_id');
            $table->foreign('alumno_id')->references('id')->on('alumnos');

            // El profesor valorado
            $table->unsignedBigInteger('profesor_id');
            $table->foreign('profesor_id')->references('id')->on('profesores');

            // Puntuación del 1 al 5 (RN-21)
            $table->tinyInteger('puntuacion'); // CHECK en BD: entre 1 y 5

            $table->text('comentario')->nullable(); // Comentario opcional
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('valoraciones');
        Schema::dropIfExists('reservas');
    }
};
