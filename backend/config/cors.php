<?php

// ============================================================
// CONFIGURACIÓN: CORS (Cross-Origin Resource Sharing)
// Permite que el frontend React (puerto 5173) pueda hacer
// peticiones al backend Laravel (puerto 8000).
// Sin esto, el navegador bloquearía las peticiones.
// ============================================================

return [
    // Rutas a las que se aplica la configuración CORS
    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    // Métodos HTTP permitidos
    'allowed_methods' => ['*'],

    // Orígenes permitidos (el frontend React)
    'allowed_origins' => ['http://localhost:5173'],

    'allowed_origins_patterns' => [],

    // Cabeceras permitidas
    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    // Importante para Sanctum: permite enviar cookies de sesión
    'supports_credentials' => true,
];
