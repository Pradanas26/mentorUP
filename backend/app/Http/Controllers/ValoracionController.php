<?php

// ============================================================
// CONTROLADOR: ValoracionController
// Gestiona las valoraciones que dejan los alumnos
// tras completar una clase (RN-19 a RN-22)
// ============================================================

namespace App\Http\Controllers;

use App\Models\Valoracion;
use App\Models\Reserva;
use App\Models\Alumno;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ValoracionController extends Controller
{
    /**
     * POST /api/valoraciones
     * Crea una valoración para una clase completada
     */
    public function store(Request $request)
    {
        // Verificamos que es alumno (RN-22)
        $alumno = Alumno::where('usuario_id', $request->user()->id)->first();
        if (!$alumno) {
            return response()->json(['success' => false, 'mensaje' => 'Solo los alumnos pueden valorar'], 403);
        }

        // Validamos los datos
        $validator = Validator::make($request->all(), [
            'reserva_id' => 'required|exists:reservas,id',
            // Puntuación entre 1 y 5 (RN-21)
            'puntuacion' => 'required|integer|min:1|max:5',
            'comentario' => 'nullable|string|max:500',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $reserva = Reserva::findOrFail($request->reserva_id);

        // RN-19: Solo se puede valorar si la clase está completada
        if ($reserva->estado !== 'completada') {
            return response()->json([
                'success' => false,
                'mensaje' => 'Solo puedes valorar clases completadas (estado actual: ' . $reserva->estado . ')'
            ], 409);
        }

        // RN-22: Solo el alumno que asistió puede valorar
        if ($reserva->alumno_id !== $alumno->id) {
            return response()->json(['success' => false, 'mensaje' => 'Solo puedes valorar tus propias clases'], 403);
        }

        // RN-20: Cada clase solo puede tener una valoración (unique en la BD)
        $yaValorada = Valoracion::where('reserva_id', $reserva->id)->exists();
        if ($yaValorada) {
            return response()->json([
                'success' => false,
                'mensaje' => 'Esta clase ya ha sido valorada'
            ], 409);
        }

        // Creamos la valoración
        $valoracion = Valoracion::create([
            'reserva_id'  => $reserva->id,
            'alumno_id'   => $alumno->id,
            'profesor_id' => $reserva->profesor_id,
            'puntuacion'  => $request->puntuacion,
            'comentario'  => $request->comentario,
        ]);

        return response()->json(['success' => true, 'data' => $valoracion], 201);
    }
}
