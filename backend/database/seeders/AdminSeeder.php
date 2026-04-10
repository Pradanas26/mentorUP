<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\Usuario;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        $existe = Usuario::where('email', 'admin@mentorup.com')->exists();

        if (!$existe) {
            Usuario::create([
                'nombre'        => 'Super',
                'apellidos'     => 'Admin',
                'email'         => 'admin@mentorup.com',
                'password_hash' => Hash::make('Admin1234!'),
                'activo'        => 1,
                'bloqueado'     => 0,
            ]);

            $this->command->info('Admin creado: admin@mentorup.com / Admin1234!');
        }
    }
}