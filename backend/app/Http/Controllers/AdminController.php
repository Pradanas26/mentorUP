<?php

// ============================================================
// CONTROLADOR: AdminController
// Gestiona todas las acciones del panel de administración:
//   - Ver y verificar anuncios pendientes
//   - Listar, bloquear y eliminar usuarios (alumnos y profesores)
// Todas las rutas de este controlador están protegidas por
// los middlewares 'auth:sanctum' + 'es_admin'
// ============================================================

namespace App\Http\Controllers;

use App\Models\Anuncio;
use App\Models\Usuario;
use App\Models\Alumno;
use App\Models\Profesor;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    // ── ANUNCIOS ──────────────────────────────────────────────

    /**
     * GET /api/admin/anuncios
     * Devuelve todos los anuncios (con filtro por estado opcional)
     * ?estado=pendiente | aprobado | rechazado
     */
    public function anuncios(Request $request)
    {
        $query = Anuncio::with('profesor.usuario')
                        ->orderByDesc('created_at');

        // Filtrar por estado si se pasa como parámetro
        if ($request->has('estado')) {
            $query->where('verificado', $request->estado);
        }

        $anuncios = $query->paginate(20);

        return response()->json(['success' => true, 'data' => $anuncios]);
    }

    /**
     * PUT /api/admin/anuncios/{id}/verificar
     * Aprueba o rechaza un anuncio.
     * Body: { "accion": "aprobado" } o { "accion": "rechazado" }
     */
    public function verificarAnuncio(Request $request, $id)
    {
        $anuncio = Anuncio::findOrFail($id);

        $request->validate([
            'accion' => 'required|in:aprobado,rechazado',
        ]);

        $anuncio->update(['verificado' => $request->accion]);

        $mensaje = $request->accion === 'aprobado'
            ? 'Anuncio aprobado y ya visible para los alumnos.'
            : 'Anuncio rechazado.';

        return response()->json([
            'success' => true,
            'mensaje' => $mensaje,
            'data'    => $anuncio,
        ]);
    }

    // ── USUARIOS ──────────────────────────────────────────────

    /**
     * GET /api/admin/alumnos
     * Devuelve todos los alumnos registrados
     */
    public function alumnos()
    {
        $alumnos = Alumno::with('usuario')
                         ->orderByDesc('created_at')
                         ->get()
                         ->map(fn($a) => [
                             'id'        => $a->usuario->id,
                             'alumno_id' => $a->id,
                             'nombre'    => $a->usuario->nombre,
                             'apellidos' => $a->usuario->apellidos,
                             'email'     => $a->usuario->email,
                             'ciudad'    => $a->usuario->ciudad,
                             'bloqueado' => $a->usuario->bloqueado,
                             'activo'    => $a->usuario->activo,
                             'creado_en' => $a->usuario->created_at,
                         ]);

        return response()->json(['success' => true, 'data' => $alumnos]);
    }

    /**
     * GET /api/admin/profesores
     * Devuelve todos los profesores registrados
     */
    public function profesores()
    {
        $profesores = Profesor::with(['usuario', 'anuncios'])
                              ->orderByDesc('created_at')
                              ->get()
                              ->map(fn($p) => [
                                  'id'              => $p->usuario->id,
                                  'profesor_id'     => $p->id,
                                  'nombre'          => $p->usuario->nombre,
                                  'apellidos'       => $p->usuario->apellidos,
                                  'email'           => $p->usuario->email,
                                  'ciudad'          => $p->usuario->ciudad,
                                  'bloqueado'       => $p->usuario->bloqueado,
                                  'activo'          => $p->usuario->activo,
                                  'total_anuncios'  => $p->anuncios->count(),
                                  'creado_en'       => $p->usuario->created_at,
                              ]);

        return response()->json(['success' => true, 'data' => $profesores]);
    }

    /**
     * DELETE /api/admin/usuarios/{id}
     * Elimina un usuario (alumno o profesor) y todos sus datos.
     * Se usa el id de la tabla 'usuarios'.
     */
    public function eliminarUsuario($id)
    {
        $usuario = Usuario::findOrFail($id);

        // No permitir que el admin se borre a sí mismo
        if ($usuario->getRol() === 'admin') {
            return response()->json([
                'success' => false,
                'mensaje' => 'No puedes eliminar una cuenta de administrador.'
            ], 403);
        }

        $nombre = $usuario->nombre . ' ' . $usuario->apellidos;
        // onDelete('cascade') en las migraciones borra automáticamente
        // las filas de alumnos/profesores y sus datos relacionados
        $usuario->delete();

        return response()->json([
            'success' => true,
            'mensaje' => "Usuario '{$nombre}' eliminado correctamente.",
        ]);
    }

    /**
     * PUT /api/admin/usuarios/{id}/bloquear
     * Bloquea o desbloquea un usuario.
     * Body: { "bloqueado": true } o { "bloqueado": false }
     */
    public function bloquearUsuario(Request $request, $id)
    {
        $usuario = Usuario::findOrFail($id);

        if ($usuario->getRol() === 'admin') {
            return response()->json([
                'success' => false,
                'mensaje' => 'No puedes bloquear una cuenta de administrador.'
            ], 403);
        }

        $request->validate(['bloqueado' => 'required|boolean']);

        $usuario->update(['bloqueado' => $request->bloqueado]);

        $accion = $request->bloqueado ? 'bloqueado' : 'desbloqueado';

        return response()->json([
            'success' => true,
            'mensaje' => "Usuario {$accion} correctamente.",
        ]);
    }

    /**
     * GET /api/admin/stats
     * Resumen rápido para el dashboard del admin
     */
    public function stats()
    {
        return response()->json([
            'success' => true,
            'data' => [
                'anuncios_pendientes' => Anuncio::where('verificado', 'pendiente')->count(),
                'anuncios_aprobados'  => Anuncio::where('verificado', 'aprobado')->count(),
                'anuncios_rechazados' => Anuncio::where('verificado', 'rechazado')->count(),
                'total_alumnos'       => Alumno::count(),
                'total_profesores'    => Profesor::count(),
                'usuarios_bloqueados' => Usuario::where('bloqueado', 1)->count(),
            ]
        ]);
    }
}
