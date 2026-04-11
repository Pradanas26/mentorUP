<?php

// ============================================================
// SEEDER: AdminSeeder
// Crea el usuario administrador en la base de datos.
// El admin NO tiene fila en 'alumnos' ni en 'profesores',
// por eso getRol() devuelve 'admin'.
//
// Para ejecutarlo: php artisan db:seed --class=AdminSeeder
// ============================================================

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\Usuario;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        // Evitamos crear duplicados si ya existe
        $existe = Usuario::where('email', 'admin@mentorup.com')->exists();

        if (!$existe) {
            Usuario::create([
                'nombre'        => 'Super',
                'apellidos'     => 'Admin',
                'email'         => 'admin@mentorup.com',
                'password_hash' => Hash::make('Admin1234!'), // ← cámbialo en producción
                'activo'        => 1,
                'bloqueado'     => 0,
            ]);

            $this->command->info('✅ Admin creado: admin@mentorup.com / Admin1234!');
        } else {
            $this->command->warn('⚠️  El admin ya existe, no se ha creado de nuevo.');
        }
    }
}
