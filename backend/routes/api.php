<?php

// ============================================================
// RUTAS DE LA API (routes/api.php)
// Aquí definimos todas las URLs que el frontend puede llamar.
// Las rutas protegidas requieren enviar el token de sesión.
// ============================================================

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AnuncioController;
use App\Http\Controllers\ReservaController;
use App\Http\Controllers\ValoracionController;
use App\Http\Controllers\AdminController;

// ── RUTAS PÚBLICAS (no necesitan estar autenticado) ───────────

// Autenticación
Route::post('/register', [AuthController::class, 'register']); // Crear cuenta
Route::post('/login',    [AuthController::class, 'login']);    // Iniciar sesión

// Ver anuncios (cualquiera puede verlos)
Route::get('/anuncios',      [AnuncioController::class, 'index']); // Lista de anuncios
Route::get('/anuncios/{id}', [AnuncioController::class, 'show']);  // Anuncio concreto


// ── RUTAS PROTEGIDAS (necesitan token de sesión) ──────────────
// El middleware 'auth:sanctum' verifica que el token es válido

Route::middleware('auth:sanctum')->group(function () {

    // Cerrar sesión
    Route::post('/logout', [AuthController::class, 'logout']);

    // ── Anuncios (solo profesores) ─────────────────────────
    Route::post('/anuncios',         [AnuncioController::class, 'store']);   // Crear
    Route::put('/anuncios/{id}',     [AnuncioController::class, 'update']);  // Editar
    Route::delete('/anuncios/{id}',  [AnuncioController::class, 'destroy']); // Desactivar

    // ── Reservas ───────────────────────────────────────────
    Route::get('/reservas',               [ReservaController::class, 'index']);    // Mis reservas
    Route::post('/reservas',              [ReservaController::class, 'store']);    // Crear reserva
    Route::post('/reservas/{id}/cancelar',[ReservaController::class, 'cancelar']); // Cancelar

    // ── Valoraciones ───────────────────────────────────────
    Route::post('/valoraciones', [ValoracionController::class, 'store']); // Dejar valoración

});

// ── RUTAS DE ADMINISTRACIÓN ───────────────────────────────────
// Requieren estar autenticado + ser admin

Route::middleware(['auth:sanctum', 'es_admin'])->prefix('admin')->group(function () {

    // Dashboard: estadísticas generales
    Route::get('/stats', [AdminController::class, 'stats']);

    // Anuncios: listar y verificar
    Route::get('/anuncios',                        [AdminController::class, 'anuncios']);
    Route::put('/anuncios/{id}/verificar',         [AdminController::class, 'verificarAnuncio']);

    // Usuarios: listar alumnos y profesores
    Route::get('/alumnos',                         [AdminController::class, 'alumnos']);
    Route::get('/profesores',                      [AdminController::class, 'profesores']);

    // Usuarios: bloquear o eliminar
    Route::put('/usuarios/{id}/bloquear',          [AdminController::class, 'bloquearUsuario']);
    Route::delete('/usuarios/{id}',                [AdminController::class, 'eliminarUsuario']);

});
