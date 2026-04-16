# 🎓 MentorUP — Proyecto Intermodular

Plataforma para conectar alumnos con profesores de clases particulares.

---

## 📁 Estructura del Proyecto

```
mentorup/
├── frontend/          ← React (lo que ve el usuario)
│   └── src/
│       ├── components/  ← Piezas reutilizables (navbar, cards...)
│       ├── pages/       ← Páginas completas (Home, Login, Registro...)
│       └── services/    ← Llamadas a la API de Laravel
├── backend/           ← Laravel (servidor y base de datos)
│   ├── app/
│   │   ├── Http/Controllers/  ← Lógica de cada sección
│   │   └── Models/            ← Representación de las tablas BD
│   ├── database/migrations/   ← Creación de las tablas
│   └── routes/api.php         ← Rutas de la API
└── docs/              ← Documentación y guías
```

---

## 🚀 Cómo ejecutar el proyecto

### Requisitos previos
- Node.js 18+
- PHP 8.2+
- Composer
- MySQL

### 1. Backend (Laravel)
```bash
cd backend
composer install
cp .env.example .env
# Edita .env con tus datos de MySQL
php artisan key:generate
php artisan migrate --seed
php artisan serve
# → Corre en http://localhost:8000
```

### 2. Frontend (React)
```bash
cd frontend
npm install
npm run dev
# → Corre en http://localhost:5173
```

---

## 🔗 Rutas principales de la API

| Método | Ruta                        | Descripción                    |
|--------|-----------------------------|--------------------------------|
| POST   | /api/register               | Registro de usuario            |
| POST   | /api/login                  | Inicio de sesión               |
| GET    | /api/anuncios                | Ver todos los anuncios         |
| GET    | /api/anuncios/{id}          | Ver un anuncio concreto        |
| POST   | /api/anuncios                | Crear anuncio (profesores)     |
| POST   | /api/reservas               | Hacer una reserva (alumnos)    |
| POST   | /api/valoraciones           | Dejar una valoración           |

---

## 🎨 Diseño
Colores principales:
- Verde azulado: `#4a9d8f`
- Fondo oscuro footer: `#2d2d2d`
- Texto principal: `#1a1a1a`
