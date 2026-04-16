<?php

// ============================================================
// CONTROLADOR: AuthController
// Gestiona el registro e inicio de sesión de usuarios.
// Los controladores reciben las peticiones HTTP y devuelven
// respuestas JSON que el frontend React consumirá.
// ============================================================

namespace App\Http\Controllers;

use App\Models\Usuario;
use App\Models\Alumno;
use App\Models\Profesor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    // ── REGISTRO ──────────────────────────────────────────────

    /**
     * POST /api/register
     * Crea una nueva cuenta de usuario (alumno o profesor)
     */
    public function register(Request $request)
    {
        // 1. Validamos los datos que llegan del formulario
        $validator = Validator::make($request->all(), [
            'nombre'    => 'required|string|max:80',
            'apellidos' => 'required|string|max:120',
            'email'     => 'required|email|unique:usuarios,email', // Email único (RN-1)
            'password'  => 'required|string|min:8|confirmed',      // Mínimo 8 caracteres
            'ciudad'    => 'nullable|string|max:80',
            'telefono'  => 'nullable|string|max:20',
            'rol'       => 'required|in:alumno,profesor',          // Solo estos dos roles
        ]);

        // Si la validación falla, devolvemos los errores
        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors'  => $validator->errors()
            ], 422);
        }

        // 2. Creamos el usuario en la tabla 'usuarios'
        $usuario = Usuario::create([
            'nombre'        => $request->nombre,
            'apellidos'     => $request->apellidos,
            'email'         => $request->email,
            'password_hash' => Hash::make($request->password), // Cifrado (RN-3)
            'ciudad'        => $request->ciudad,
            'telefono'      => $request->telefono,
        ]);

        // 3. Según el rol, creamos la entrada en alumnos o profesores (RN-2)
        if ($request->rol === 'alumno') {
            Alumno::create(['usuario_id' => $usuario->id]);
        } else {
            Profesor::create(['usuario_id' => $usuario->id]);
        }

        // 4. Creamos el token de autenticación (Sanctum)
        $token = $usuario->createToken('auth_token')->plainTextToken;

        // 5. Devolvemos respuesta al frontend
        return response()->json([
            'success' => true,
            'mensaje' => '¡Cuenta creada correctamente!',
            'token'   => $token,
            'usuario' => [
                'id'       => $usuario->id,
                'nombre'   => $usuario->nombre,
                'apellidos'=> $usuario->apellidos,
                'email'    => $usuario->email,
                'rol'      => $request->rol,
            ]
        ], 201); // 201 = "Creado"
    }

    // ── LOGIN ─────────────────────────────────────────────────

    /**
     * POST /api/login
     * Inicia sesión y devuelve un token
     */
    public function login(Request $request)
    {
        // 1. Validamos email y contraseña
        $validator = Validator::make($request->all(), [
            'email'    => 'required|email',
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        // 2. Buscamos el usuario por email
        $usuario = Usuario::where('email', $request->email)->first();

        // 3. Comprobamos que existe y la contraseña es correcta
        if (!$usuario || !Hash::check($request->password, $usuario->password_hash)) {
            return response()->json([
                'success' => false,
                'mensaje' => 'Email o contraseña incorrectos'
            ], 401); // 401 = "No autorizado"
        }

        // 4. Comprobamos que no está bloqueado (RN-4)
        if ($usuario->bloqueado) {
            return response()->json([
                'success' => false,
                'mensaje' => 'Tu cuenta ha sido bloqueada. Contacta con soporte.'
            ], 403); // 403 = "Prohibido"
        }

        // 5. Borramos tokens anteriores y creamos uno nuevo
        $usuario->tokens()->delete();
        $token = $usuario->createToken('auth_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'token'   => $token,
            'usuario' => [
                'id'       => $usuario->id,
                'nombre'   => $usuario->nombre,
                'apellidos'=> $usuario->apellidos,
                'email'    => $usuario->email,
                'rol'      => $usuario->getRol(),
            ]
        ]);
    }

    // ── LOGOUT ────────────────────────────────────────────────

    /**
     * POST /api/logout (requiere estar autenticado)
     * Cierra la sesión borrando el token
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['success' => true, 'mensaje' => 'Sesión cerrada']);
    }
}
