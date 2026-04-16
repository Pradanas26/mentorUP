<?php

// ============================================================
// MODELO: Usuario
// Los modelos representan las tablas de la base de datos.
// Con Eloquent (el ORM de Laravel) podemos hacer consultas
// de forma sencilla sin escribir SQL directamente.
// ============================================================

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens; // Para autenticación con tokens

class Usuario extends Authenticatable
{
    use HasApiTokens, Notifiable;

    // Nombre de la tabla en la base de datos
    protected $table = 'usuarios';

    // Campos que SÍ se pueden rellenar masivamente (seguridad)
    protected $fillable = [
        'nombre',
        'apellidos',
        'email',
        'password_hash',
        'foto_perfil',
        'telefono',
        'ciudad',
        'activo',
        'bloqueado',
    ];

    // Campos que NUNCA se devuelven en JSON (seguridad RN-3)
    protected $hidden = [
        'password_hash',
    ];

    // ── RELACIONES ────────────────────────────────────────────

    /**
     * Un usuario puede ser alumno
     * Uso: $usuario->alumno
     */
    public function alumno()
    {
        return $this->hasOne(Alumno::class, 'usuario_id');
    }

    /**
     * Un usuario puede ser profesor
     * Uso: $usuario->profesor
     */
    public function profesor()
    {
        return $this->hasOne(Profesor::class, 'usuario_id');
    }

    // ── MÉTODOS ÚTILES ────────────────────────────────────────

    /**
     * Detecta qué rol tiene el usuario
     * Devuelve: 'alumno', 'profesor' o 'admin'
     */
    public function getRol(): string
    {
        if ($this->alumno) return 'alumno';
        if ($this->profesor) return 'profesor';
        return 'admin';
    }

    /**
     * Laravel necesita este método para la autenticación.
     * Le decimos que la contraseña está en 'password_hash'
     */
    public function getAuthPassword()
    {
        return $this->password_hash;
    }
}
