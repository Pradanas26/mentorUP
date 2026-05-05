// ============================================================
// COMPONENTE: Navbar
// Barra de navegación superior de MentorUP.
// Muestra el logo, los enlaces de menú y los botones de
// perfil / notificaciones si el usuario está logueado.
// ============================================================

import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getUsuarioActual, estaLogueado, esAdmin, logout } from '../services/api';
import './Navbar.css';
import logoMentorUP from "../assets/logoMentorUP.png";
//import logoMentorUP from '../assets/logoMentorUP.png';


function Navbar() {
  const navigate  = useNavigate();
  const location  = useLocation(); // Para saber qué ruta está activa
  const logueado  = estaLogueado();
  const usuario   = getUsuarioActual();

  // Obtiene las dos primeras iniciales del usuario para el avatar
  const iniciales = usuario
    ? `${usuario.nombre?.[0] || ''}${usuario.apellidos?.[0] || ''}`
    : '';

  async function handleLogout() {
    await logout();
    navigate('/welcome');
  }

  // Comprueba si el link está activo según la URL actual
  function esActivo(ruta) {
    return location.pathname === ruta;
  }

  return (
    <nav className="navbar">
      {/* Logo */}
      <Link to="/anuncios" className="navbar-logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
        Mentor <img src={logoMentorUP} alt="MentorUP logo" /> <span>UP</span>
      </Link>

      {/* Menú central */}
      <ul className="navbar-menu">
        <li>
          <Link to="/anuncios" className={esActivo('/anuncios') ? 'activo' : ''}>
            Inicio
          </Link>
        </li>

        <li>
          <Link to="/profesores" className={esActivo('/profesores') ? 'activo' : ''}>
            Profesores
          </Link>
        </li>

        <li>
          <Link to="/home#como-funciona">
            Cómo funciona
          </Link>
        </li>
      </ul>
      {/* Botones derecha */}
      <div className="navbar-right">
        {logueado ? (
          <>
            {/* Icono campana */}
            <button className="navbar-icon-btn" title="Notificaciones">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
            </button>

            {/* Si es admin, mostramos acceso directo al panel */}
            {esAdmin() && (
              <Link to="/admin/dashboard" className="navbar-btn-admin" title="Panel de administración">
                🛡️ Admin
              </Link>
            )}

            {/* Avatar con iniciales */}
            <Link to="/mi-perfil" className="navbar-avatar" title={`${usuario.nombre} ${usuario.apellidos}`}>
              {iniciales}
            </Link>

            <button className="navbar-btn-secondary" onClick={handleLogout}>
              Cerrar sesión
            </button>
          </>
        ) : (
          <>
            <Link to="/login"    className="navbar-btn-secondary">Iniciar sesión</Link>
            <Link to="/registro" className="navbar-btn-primary">Registrarse</Link>
            {/* Enlace discreto al panel de admin */}
            <Link to="/admin/login" className="navbar-btn-admin-subtle" title="Acceso administración">
              🛡️
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
