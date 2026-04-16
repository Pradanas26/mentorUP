// ============================================================
// PÁGINA: MiPerfil
// Muestra el perfil del usuario y su actividad reciente.
// Funciona tanto para alumnos (sus reservas) como para
// profesores (sus anuncios y solicitudes).
// ============================================================

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getUsuarioActual, estaLogueado, getMisReservas } from '../services/api';
import './MiPerfil.css';

function MiPerfil() {
  const navigate  = useNavigate();
  const usuario   = getUsuarioActual();

  const [reservas,  setReservas]  = useState([]);
  const [cargando,  setCargando]  = useState(true);

  // Si no está logueado, redirigimos a login
  useEffect(() => {
    if (!estaLogueado()) {
      navigate('/login');
      return;
    }
    cargarDatos();
  }, []);

  async function cargarDatos() {
    const resultado = await getMisReservas();
    setCargando(false);
    if (resultado.ok) {
      setReservas(resultado.data.data || []);
    }
  }

  // Colores por estado de la reserva
  const colorEstado = {
    pendiente:  'badge-pendiente',
    confirmada: 'badge-activo',
    completada: 'badge badge-activo',
    cancelada:  'badge-cancelada',
  };

  return (
    <div className="perfil-page">
      <Navbar />

      {/* ── CABECERA DEL PERFIL ─── */}
      <div className="perfil-header">
        <div className="container">
          <span className="perfil-rol-badge">
            {usuario?.rol === 'alumno' ? '🎓 ALUMNO' : '👨‍🏫 PROFESOR'}
          </span>
          <div className="perfil-info">
            <div className="perfil-avatar-grande">
              {usuario?.nombre?.[0]}{usuario?.apellidos?.[0]}
            </div>
            <div>
              <h1>{usuario?.nombre} {usuario?.apellidos}</h1>
              <p>{usuario?.email}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container perfil-body">

        {/* ── COLUMNA PRINCIPAL ─── */}
        <div className="perfil-main" style={{marginTop: "20px"}}>

          {/* Bienvenida */}
          <div className="bienvenida-card">
            <h2>¡Bienvenido/a, {usuario?.nombre}! 👋</h2>
            {usuario?.rol === 'alumno' && (
              <p>Aquí puedes ver tus clases reservadas y gestionar tu actividad.</p>
            )}
            {usuario?.rol === 'profesor' && (
              <p>Gestiona tus anuncios y revisa las solicitudes de los alumnos.</p>
            )}
          </div>

          {/* ── MIS RESERVAS (Alumnos) ─── */}
          {usuario?.rol === 'alumno' && (
            <div className="perfil-seccion">
              <h3>Mis clases reservadas</h3>

              {cargando && <p className="texto-gris">Cargando reservas...</p>}

              {!cargando && reservas.length === 0 && (
                <div className="vacio-msg">
                  <p>Aún no tienes clases reservadas.</p>
                  <a href="/anuncios" className="btn-primary">Buscar profesor</a>
                </div>
              )}

              {/* Lista de reservas */}
              {reservas.map((reserva) => (
                <div key={reserva.id} className="reserva-item">
                  <div className="reserva-item__info">
                    <h4>{reserva.anuncio?.titulo || 'Clase'}</h4>
                    <p className="texto-gris">
                      📅 {new Date(reserva.fecha_clase).toLocaleDateString('es-ES', {
                        weekday: 'long', day: 'numeric', month: 'long',
                        hour: '2-digit', minute: '2-digit'
                      })}
                    </p>
                    <p className="texto-gris">⏱️ {reserva.duracion_h}h · 💰 {reserva.precio_total}€</p>
                  </div>
                  <span className={`badge ${colorEstado[reserva.estado]}`}>
                    {reserva.estado}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* ── MIS ANUNCIOS (Profesores) ─── */}
          {usuario?.rol === 'profesor' && (
            <div className="perfil-seccion">
              <div className="seccion-header">
                <h3>Mis anuncios</h3>
                <a href="/anuncios/crear" className="btn-primary">+ Nuevo anuncio</a>
              </div>

              {cargando && <p className="texto-gris">Cargando...</p>}

              {!cargando && reservas.length === 0 && (
                <div className="vacio-msg">
                  <p>Aún no tienes anuncios publicados.</p>
                  <a href="/anuncios/crear" className="btn-primary">Publicar anuncio</a>
                </div>
              )}
            </div>
          )}

        </div>

        {/* ── COLUMNA LATERAL ─── */}
        <div className="perfil-lateral" style={{marginTop: "20px"}}>

          {/* Datos personales */}
          <div className="card">
            <h4>Datos personales</h4>
            <div className="datos-item">
              <span>✉️</span>
              <span>{usuario?.email}</span>
            </div>
          </div>

          {/* Acciones rápidas */}
          <div className="card">
            <h4>Acciones rápidas</h4>
            {usuario?.rol === 'alumno' && (
              <a href="/anuncios" className="accion-btn">
                🔍 Buscar profesor
              </a>
            )}
            {usuario?.rol === 'profesor' && (
              <a href="/anuncios/crear" className="accion-btn">
                📢 Publicar anuncio
              </a>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

export default MiPerfil;
