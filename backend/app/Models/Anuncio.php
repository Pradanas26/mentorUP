<?php

// ============================================================
// MODELO: Anuncio
// Representa un anuncio publicado por un profesor
// ============================================================

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Anuncio extends Model
{
    protected $table = 'anuncios';

    protected $fillable = [
        'profesor_id', 'titulo', 'descripcion', 'asignatura',
        'precio_hora', 'nivel', 'disponibilidad',
        'destacado', 'destacado_hasta', 'activo', 'verificado',
    ];

    // Convierte automáticamente estas fechas a objetos Carbon
    protected $casts = [
        'destacado_hasta' => 'datetime',
        'destacado' => 'boolean',
        'activo' => 'boolean',
    ];

    // ── RELACIONES ────────────────────────────────────────────

    /** El profesor que publicó el anuncio */
    public function profesor()
    {
        return $this->belongsTo(Profesor::class, 'profesor_id');
    }

    /** Las reservas de este anuncio */
    public function reservas()
    {
        return $this->hasMany(Reserva::class, 'anuncio_id');
    }

    // ── SCOPES (filtros reutilizables) ────────────────────────

    /**
     * Filtra solo anuncios activos Y aprobados por el admin
     * Uso: Anuncio::activos()->get()
     */
    public function scopeActivos($query)
    {
        return $query->where('activo', 1)->where('verificado', 'aprobado');
    }

    /**
     * Filtra anuncios pendientes de verificación
     * Uso: Anuncio::pendientes()->get()
     */
    public function scopePendientes($query)
    {
        return $query->where('verificado', 'pendiente');
    }

    /**
     * Filtra anuncios destacados vigentes (RN-12)
     * Uso: Anuncio::destacados()->get()
     */
    public function scopeDestacados($query)
    {
        return $query->where('destacado', 1)
                     ->where('destacado_hasta', '>', now());
    }
}
