<?php

// ============================================================
// CONTROLADOR: AnuncioController
// Gestiona los anuncios de los profesores.
// CRUD = Create, Read, Update, Delete
// ============================================================

namespace App\Http\Controllers;

use App\Models\Anuncio;
use App\Models\Profesor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AnuncioController extends Controller
{
    /**
     * GET /api/anuncios
     * Devuelve todos los anuncios activos con datos del profesor
     */
    public function index(Request $request)
    {
        // Empezamos la consulta con los anuncios activos
        $query = Anuncio::activos()
            ->with('profesor.usuario'); // Traemos también los datos del profesor (JOIN)

        // ── FILTROS OPCIONALES ────────────────────────────────
        // Si el frontend envía ?asignatura=Matemáticas, filtramos
        if ($request->has('asignatura')) {
            $query->where('asignatura', 'like', '%' . $request->asignatura . '%');
        }

        // Filtrar por ciudad del profesor
        if ($request->has('ciudad')) {
            $query->whereHas('profesor.usuario', function ($q) use ($request) {
                $q->where('ciudad', 'like', '%' . $request->ciudad . '%');
            });
        }

        // Filtrar por precio máximo
        if ($request->has('precio_max')) {
            $query->where('precio_hora', '<=', $request->precio_max);
        }

        // Los destacados aparecen primero (RN-12)
        $anuncios = $query->orderByDesc('destacado')
                          ->orderByDesc('created_at')
                          ->paginate(12); // 12 por página

        return response()->json(['success' => true, 'data' => $anuncios]);
    }

    /**
     * GET /api/anuncios/{id}
     * Devuelve un anuncio concreto con valoraciones del profesor
     */
    public function show($id)
    {
        // findOrFail devuelve 404 automáticamente si no existe
        $anuncio = Anuncio::with([
            'profesor.usuario',           // Datos del profesor
            'profesor.valoraciones'       // Sus valoraciones
        ])->findOrFail($id);

        return response()->json(['success' => true, 'data' => $anuncio]);
    }

    /**
     * POST /api/anuncios
     * Crea un nuevo anuncio (solo profesores, RN-7)
     */
    public function store(Request $request)
    {
        // Verificamos que el usuario autenticado es profesor
        $profesor = Profesor::where('usuario_id', $request->user()->id)->first();
        if (!$profesor) {
            return response()->json(['success' => false, 'mensaje' => 'Solo los profesores pueden crear anuncios'], 403);
        }

        // Validamos los datos
        $validator = Validator::make($request->all(), [
            'titulo'        => 'required|string|max:160',
            'descripcion'   => 'required|string',
            'asignatura'    => 'required|string|max:100',
            'precio_hora'   => 'required|numeric|min:0.01', // Mínimo 1 céntimo (RN-10)
            'nivel'         => 'required|in:Primaria,ESO,Bachillerato,Universidad,Otro',
            'disponibilidad'=> 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        // Creamos el anuncio
        $anuncio = Anuncio::create([
            'profesor_id'   => $profesor->id,
            'titulo'        => $request->titulo,
            'descripcion'   => $request->descripcion,
            'asignatura'    => $request->asignatura,
            'precio_hora'   => $request->precio_hora,
            'nivel'         => $request->nivel,
            'disponibilidad'=> $request->disponibilidad,
            'verificado'    => 'pendiente',
        ]);

        return response()->json(['success' => true, 'data' => $anuncio], 201);
    }

    /**
     * PUT /api/anuncios/{id}
     * Edita un anuncio (solo el profesor propietario, RN-7)
     */
    public function update(Request $request, $id)
    {
        $anuncio = Anuncio::findOrFail($id);
        $profesor = Profesor::where('usuario_id', $request->user()->id)->first();

        // Verificamos que el anuncio pertenece al profesor que lo edita
        if (!$profesor || $anuncio->profesor_id !== $profesor->id) {
            return response()->json(['success' => false, 'mensaje' => 'No tienes permiso para editar este anuncio'], 403);
        }

        // Actualizamos solo los campos enviados
        $anuncio->update($request->only([
            'titulo', 'descripcion', 'asignatura',
            'precio_hora', 'nivel', 'disponibilidad'
        ]));

        return response()->json(['success' => true, 'data' => $anuncio]);
    }

    /**
     * DELETE /api/anuncios/{id}
     * Desactiva un anuncio (RN-29: no se borra, se marca inactivo)
     * No se puede si tiene reservas pendientes/confirmadas (RN-13)
     */
    public function destroy(Request $request, $id)
    {
        $anuncio = Anuncio::findOrFail($id);
        $profesor = Profesor::where('usuario_id', $request->user()->id)->first();

        if (!$profesor || $anuncio->profesor_id !== $profesor->id) {
            return response()->json(['success' => false, 'mensaje' => 'Sin permiso'], 403);
        }

        // Comprobamos reservas activas (RN-13)
        $reservasActivas = $anuncio->reservas()
            ->whereIn('estado', ['pendiente', 'confirmada'])
            ->count();

        if ($reservasActivas > 0) {
            return response()->json([
                'success' => false,
                'mensaje' => 'No puedes eliminar el anuncio: tiene ' . $reservasActivas . ' reservas activas. Cancélalas primero.'
            ], 409);
        }

        // Marcamos como inactivo en vez de borrar (RN-29)
        $anuncio->update(['activo' => 0]);

        return response()->json(['success' => true, 'mensaje' => 'Anuncio eliminado correctamente']);
    }
}
