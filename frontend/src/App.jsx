// ============================================================
// App.jsx — Componente raíz de la aplicación React
// Aquí definimos las rutas (páginas) de la aplicación.
// React Router DOM se encarga de mostrar la página correcta
// según la URL del navegador.
// ============================================================

import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Importamos las páginas de la aplicación
import Home        from './pages/Home';
import Login       from './pages/Login';
import Registro    from './pages/Registro';
import Anuncios    from './pages/Anuncios';
import DetalleAnuncio from './pages/DetalleAnuncio';
import MiPerfil    from './pages/MiPerfil';
import Welcome     from './pages/Welcome';
import AdminLogin     from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';



// Importamos los estilos globales
import './index.css';

function App() {
  return (
    // BrowserRouter: habilita el sistema de rutas
    <BrowserRouter>
      <Routes>
        {/* Cada Route define qué componente mostrar según la URL */}
        <Route path="/"        element={<Welcome />} />
        <Route path="/home"    element={<Home />} />
        <Route path="/login"         element={<Login />} />
        <Route path="/registro"      element={<Registro />} />
        <Route path="/anuncios"      element={<Anuncios />} />
        <Route path="/anuncios/:id"  element={<DetalleAnuncio />} />
        <Route path="/mi-perfil"     element={<MiPerfil />} />

        {/* Rutas de administración */}
        <Route path="/admin/login"     element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
