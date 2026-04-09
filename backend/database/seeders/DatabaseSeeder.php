<?php

// ============================================================
// SEEDER: DatabaseSeeder
// Los seeders insertan datos de prueba en la base de datos.
// Ejecutar con: php artisan db:seed
// ============================================================

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\Usuario;
use App\Models\Alumno;
use App\Models\Profesor;
use App\Models\Anuncio;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // ── PROFESOR DE EJEMPLO ───────────────────────────────
        $usuarioProfesor = Usuario::create([
            'nombre'        => 'Carlos',
            'apellidos'     => 'Martínez García',
            'email'         => 'carlos@mentorup.com',
            'password_hash' => Hash::make('password123'),
            'ciudad'        => 'Barcelona',
            'telefono'      => '+34 612 345 678',
        ]);

        $profesor = Profesor::create([
            'usuario_id' => $usuarioProfesor->id,
            'bio'        => 'Licenciado en Matemáticas con 8 años de experiencia. Especialista en Bachillerato y Selectividad.',
        ]);

        // Anuncios del profesor
        Anuncio::create([
            'profesor_id'  => $profesor->id,
            'titulo'       => 'Clases de Matemáticas para Bachillerato y Selectividad',
            'descripcion'  => 'Ofrezco clases de Matemáticas para Bachillerato. Método práctico con ejercicios reales de selectividad. Más de 340 alumnos aprobados.',
            'asignatura'   => 'Matemáticas',
            'precio_hora'  => 25.00,
            'nivel'        => 'Bachillerato',
            'disponibilidad'=> 'Lunes, Martes, Jueves — Mañana y Tarde',
            'destacado'    => 1,
            'destacado_hasta' => now()->addDays(30),
        ]);

        Anuncio::create([
            'profesor_id'  => $profesor->id,
            'titulo'       => 'Preparación Selectividad — Física y Química',
            'descripcion'  => 'Preparación intensiva para la EBAU. Ejercicios de años anteriores y simulacros completos.',
            'asignatura'   => 'Física y Química',
            'precio_hora'  => 30.00,
            'nivel'        => 'Bachillerato',
            'disponibilidad'=> 'Martes, Jueves, Viernes',
        ]);

        // ── ALUMNA DE EJEMPLO ─────────────────────────────────
        $usuarioAlumna = Usuario::create([
            'nombre'        => 'María',
            'apellidos'     => 'Sánchez López',
            'email'         => 'maria@mentorup.com',
            'password_hash' => Hash::make('password123'),
            'ciudad'        => 'Barcelona',
        ]);

        Alumno::create(['usuario_id' => $usuarioAlumna->id]);

        // ── OTRO PROFESOR ─────────────────────────────────────
        $usuarioProf2 = Usuario::create([
            'nombre'        => 'Laura',
            'apellidos'     => 'García Pérez',
            'email'         => 'laura@mentorup.com',
            'password_hash' => Hash::make('password123'),
            'ciudad'        => 'Madrid',
            'telefono'      => '+34 698 765 432',
        ]);

        $profesor2 = Profesor::create([
            'usuario_id' => $usuarioProf2->id,
            'bio'        => 'Profesora de inglés nativa. Cambridge CELTA. Clases para todos los niveles.',
        ]);

        Anuncio::create([
            'profesor_id'  => $profesor2->id,
            'titulo'       => 'Inglés para todos los niveles — Conversación y gramática',
            'descripcion'  => 'Clases de inglés adaptadas a tu nivel. Preparación FCE, CAE, IELTS y conversación.',
            'asignatura'   => 'Inglés',
            'precio_hora'  => 20.00,
            'nivel'        => 'ESO',
            'disponibilidad'=> 'Todos los días — Mañana',
        ]);

        $this->command->info('✅ Datos de prueba creados correctamente.');
        $this->command->info('   Profesor: carlos@mentorup.com / password123');
        $this->command->info('   Alumna:   maria@mentorup.com  / password123');
    }
}
