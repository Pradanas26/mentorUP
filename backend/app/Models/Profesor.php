<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

// ── MODELO: Profesor ──────────────────────────────────────────
class Profesor extends Model {
    protected $table    = 'profesores';
    protected $fillable = ['usuario_id', 'bio'];

    // Relación con la tabla usuarios
    public function usuario()  { return $this->belongsTo(Usuario::class, 'usuario_id'); }
    // Un profesor tiene muchos anuncios (RN-8)
    public function anuncios() { return $this->hasMany(Anuncio::class, 'profesor_id'); }
    // Un profesor recibe muchas valoraciones
    public function valoraciones() { return $this->hasMany(Valoracion::class, 'profesor_id'); }

    /**
     * Calcula la puntuación media del profesor
     * Uso: $profesor->puntuacionMedia()
     */
    public function puntuacionMedia(): float {
        return $this->valoraciones()->avg('puntuacion') ?? 0;
    }
}
