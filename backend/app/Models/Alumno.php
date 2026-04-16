<?php
// ── MODELO: Alumno ────────────────────────────────────────────
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Alumno extends Model {
    protected $table    = 'alumnos';
    protected $fillable = ['usuario_id'];

    // El alumno pertenece a un usuario
    public function usuario()  { return $this->belongsTo(Usuario::class, 'usuario_id'); }
    // El alumno puede tener muchas reservas
    public function reservas() { return $this->hasMany(Reserva::class, 'alumno_id'); }
    // El alumno puede dejar muchas valoraciones
    public function valoraciones() { return $this->hasMany(Valoracion::class, 'alumno_id'); }
}
