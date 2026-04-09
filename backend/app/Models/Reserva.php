<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

// ── MODELO: Reserva ───────────────────────────────────────────
class Reserva extends Model {
    protected $table    = 'reservas';
    protected $fillable = [
        'anuncio_id', 'alumno_id', 'profesor_id',
        'fecha_clase', 'duracion_h', 'precio_total',
        'estado', 'notas_alumno',
    ];

    protected $casts = [
        'fecha_clase' => 'datetime',
    ];

    // Relaciones: cada reserva pertenece a un anuncio, alumno y profesor
    public function anuncio()  { return $this->belongsTo(Anuncio::class,  'anuncio_id'); }
    public function alumno()   { return $this->belongsTo(Alumno::class,   'alumno_id'); }
    public function profesor() { return $this->belongsTo(Profesor::class, 'profesor_id'); }

    // Una reserva puede tener una valoración (1 a 1)
    public function valoracion() { return $this->hasOne(Valoracion::class, 'reserva_id'); }
}
