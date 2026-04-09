<?php

// ============================================================
// CONTROLADOR: ReservaController
// Gestiona las reservas de clases entre alumnos y profesores
// ============================================================

namespace App\Http\Controllers;

use App\Models\Reserva;
use App\Models\Anuncio;
use App\Models\Alumno;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon; // Librería de Laravel para manejar fechas

class ReservaController extends Controller
{
    /**
     * GET /api/reservas
     * Lista las reservas del usuario autenticado
     */
    public function index(Request $request)
    {
        $usuario = $request->user();

        // Si es alumno, vemos sus reservas
        if ($alumno = $usuario->alumno) {
            $reservas = Reserva::where('alumno_id', $alumno->id)
                ->with(['anuncio', 'profesor.usuario'])
                ->orderByDesc('created_at')
                ->get();
        }
        // Si es profesor, vemos las reservas de sus clases
        elseif ($profesor = $usuario->profesor) {
            $reservas = Reserva::where('profesor_id', $profesor->id)
                ->with(['anuncio', 'alumno.usuario'])
                ->orderByDesc('created_at')
                ->get();
        } else {
            return response()->json(['success' => false, 'mensaje' => 'Sin permiso'], 403);
        }

        return response()->json(['success' => true, 'data' => $reservas]);
    }

    /**
     * POST /api/reservas
     * Crea una nueva reserva (solo alumnos, RN-5)
     */
    public function store(Request $request)
    {
        // Verificamos que es alumno (RN-5)
        $alumno = Alumno::where('usuario_id', $request->user()->id)->first();
        if (!$alumno) {
            return response()->json(['success' => false, 'mensaje' => 'Solo los alumnos pueden hacer reservas'], 403);
        }

        // Validamos los datos
        $validator = Validator::make($request->all(), [
            'anuncio_id'  => 'required|exists:anuncios,id',
            'fecha_clase' => 'required|date|after:now', // Fecha futura (RN-14)
            'duracion_h'  => 'required|numeric|min:0.5',
            'notas_alumno'=> 'nullable|string|max:500',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $anuncio = Anuncio::findOrFail($request->anuncio_id);

        // RN-6: El alumno no puede ser el mismo que el profesor
        if ($anuncio->profesor->usuario_id === $request->user()->id) {
            return response()->json([
                'success' => false,
                'mensaje' => 'No puedes reservar tus propias clases'
            ], 409);
        }

        // RN-15: Verificamos que no hay solapamiento de horario
        $fechaClase = Carbon::parse($request->fecha_clase);
        $solapamiento = Reserva::where('alumno_id', $alumno->id)
            ->where('profesor_id', $anuncio->profesor_id)
            ->where('fecha_clase', $fechaClase)
            ->whereIn('estado', ['pendiente', 'confirmada'])
            ->exists();

        if ($solapamiento) {
            return response()->json([
                'success' => false,
                'mensaje' => 'Ya tienes una reserva con este profesor a esa hora'
            ], 409);
        }

        // Calculamos el precio total (RN-17)
        $precioTotal = $anuncio->precio_hora * $request->duracion_h;

        // Creamos la reserva
        $reserva = Reserva::create([
            'anuncio_id'   => $anuncio->id,
            'alumno_id'    => $alumno->id,
            'profesor_id'  => $anuncio->profesor_id,
            'fecha_clase'  => $fechaClase,
            'duracion_h'   => $request->duracion_h,
            'precio_total' => $precioTotal,
            'estado'       => 'pendiente', // Siempre empieza en pendiente (RN-18)
            'notas_alumno' => $request->notas_alumno,
        ]);

        return response()->json(['success' => true, 'data' => $reserva], 201);
    }

    /**
     * POST /api/reservas/{id}/cancelar
     * Cancela una reserva (RN-16: gratis si faltan más de 24h)
     */
    public function cancelar(Request $request, $id)
    {
        $reserva = Reserva::findOrFail($id);

        // Solo el alumno o el profesor pueden cancelar
        $usuario = $request->user();
        $esAlumno   = $usuario->alumno && $reserva->alumno_id   === $usuario->alumno->id;
        $esProfesor = $usuario->profesor && $reserva->profesor_id === $usuario->profesor->id;

        if (!$esAlumno && !$esProfesor) {
            return response()->json(['success' => false, 'mensaje' => 'Sin permiso'], 403);
        }

        // No se puede cancelar si ya está cancelada o completada (RN-18)
        if (in_array($reserva->estado, ['cancelada', 'completada'])) {
            return response()->json([
                'success' => false,
                'mensaje' => 'Esta reserva no se puede cancelar (estado: ' . $reserva->estado . ')'
            ], 409);
        }

        // Comprobamos si hay coste de cancelación (RN-16)
        $horasRestantes = now()->diffInHours($reserva->fecha_clase, false);
        $conCoste = $horasRestantes < 24;

        $reserva->update(['estado' => 'cancelada']);

        return response()->json([
            'success'   => true,
            'mensaje'   => 'Reserva cancelada',
            'con_coste' => $conCoste,
        ]);
    }
}
