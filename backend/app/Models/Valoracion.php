<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

// ── MODELO: Valoracion ────────────────────────────────────────
class Valoracion extends Model {
    protected $table    = 'valoraciones';
    protected $fillable = [
        'reserva_id', 'alumno_id', 'profesor_id',
        'puntuacion', 'comentario',
    ];

    // Relaciones
    public function reserva()  { return $this->belongsTo(Reserva::class,  'reserva_id'); }
    public function alumno()   { return $this->belongsTo(Alumno::class,   'alumno_id'); }
    public function profesor() { return $this->belongsTo(Profesor::class, 'profesor_id'); }
}
