<?php

// ============================================================
// MIDDLEWARE: EsAdmin
// Protege las rutas del panel de administración.
// Si el usuario autenticado no es admin, devuelve 403.
//
// Para registrarlo, añade en app/Http/Kernel.php dentro de
// $routeMiddleware:
//   'es_admin' => \App\Http\Middleware\EsAdmin::class,
// ============================================================

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class EsAdmin
{
    public function handle(Request $request, Closure $next)
    {
        $usuario = $request->user();

        // Comprobamos que está autenticado y que su rol es 'admin'
        // (getRol() devuelve 'admin' si no tiene fila en alumnos ni profesores)
        if (!$usuario || $usuario->getRol() !== 'admin') {
            return response()->json([
                'success' => false,
                'mensaje' => 'Acceso denegado. Se requieren permisos de administrador.'
            ], 403);
        }

        return $next($request);
    }
}
