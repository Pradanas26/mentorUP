// ============================================================
// PÁGINA: AdminDashboard
// Panel de control del administrador.
// Tiene 3 secciones (pestañas):
//   1. Anuncios pendientes de verificación
//   2. Gestión de alumnos
//   3. Gestión de profesores
// ============================================================

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  esAdmin,
  getAdminStats,
  getAdminAnuncios,
  verificarAnuncio,
  getAdminAlumnos,
  getAdminProfesores,
  bloquearUsuario,
  eliminarUsuario,
  logout,
} from '../services/api';
import './AdminDashboard.css';

function AdminDashboard() {
  const navigate  = useNavigate();
  const [tab, setTab] = useState('anuncios'); // pestaña activa

  // Datos
  const [stats,     setStats]     = useState(null);
  const [anuncios,  setAnuncios]  = useState([]);
  const [alumnos,   setAlumnos]   = useState([]);
  const [profesores,setProfesores]= useState([]);

  // UI
  const [filtroAnuncios, setFiltroAnuncios] = useState('pendiente');
  const [cargando, setCargando] = useState(false);
  const [mensaje,  setMensaje]  = useState('');

  // Protegemos la ruta: si no es admin, lo mandamos fuera
  useEffect(() => {
    if (!esAdmin()) navigate('/admin/login');
  }, [navigate]);

  // Cargamos las stats al montar
  useEffect(() => {
    cargarStats();
  }, []);

  // Cargamos datos cuando cambia la pestaña o el filtro
  useEffect(() => {
    if (tab === 'anuncios') cargarAnuncios();
    if (tab === 'alumnos')  cargarAlumnos();
    if (tab === 'profesores') cargarProfesores();
  }, [tab, filtroAnuncios]);

  async function cargarStats() {
    const r = await getAdminStats();
    if (r.ok) setStats(r.data.data);
  }

  async function cargarAnuncios() {
    setCargando(true);
    const r = await getAdminAnuncios(filtroAnuncios);
    if (r.ok) setAnuncios(r.data.data?.data || []);
    setCargando(false);
  }

  async function cargarAlumnos() {
    setCargando(true);
    const r = await getAdminAlumnos();
    if (r.ok) setAlumnos(r.data.data);
    setCargando(false);
  }

  async function cargarProfesores() {
    setCargando(true);
    const r = await getAdminProfesores();
    if (r.ok) setProfesores(r.data.data);
    setCargando(false);
  }

  // ── ACCIONES ──────────────────────────────────────────────

  async function handleVerificar(id, accion) {
    const r = await verificarAnuncio(id, accion);
    if (r.ok) {
      mostrarMensaje(r.data.mensaje);
      cargarAnuncios();
      cargarStats();
    }
  }

  async function handleBloquear(id, bloqueado) {
    const r = await bloquearUsuario(id, bloqueado);
    if (r.ok) {
      mostrarMensaje(r.data.mensaje);
      tab === 'alumnos' ? cargarAlumnos() : cargarProfesores();
    }
  }

  async function handleEliminar(id, nombre) {
    if (!confirm(`¿Seguro que quieres eliminar a "${nombre}"? Esta acción no se puede deshacer.`)) return;
    const r = await eliminarUsuario(id);
    if (r.ok) {
      mostrarMensaje(r.data.mensaje);
      tab === 'alumnos' ? cargarAlumnos() : cargarProfesores();
      cargarStats();
    }
  }

  async function handleLogout() {
    await logout();
    navigate('/');
  }

  function mostrarMensaje(texto) {
    setMensaje(texto);
    setTimeout(() => setMensaje(''), 3000);
  }

  // ── RENDER ────────────────────────────────────────────────

  return (
    <div className="admin-layout">

      {/* Barra lateral */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-logo">
          <span>🛡️</span>
          <span>Admin</span>
        </div>

        <nav className="admin-nav">
          <button
            className={tab === 'anuncios' ? 'active' : ''}
            onClick={() => setTab('anuncios')}
          >
            📋 Anuncios
            {stats?.anuncios_pendientes > 0 && (
              <span className="badge">{stats.anuncios_pendientes}</span>
            )}
          </button>
          <button
            className={tab === 'alumnos' ? 'active' : ''}
            onClick={() => setTab('alumnos')}
          >
            🎒 Alumnos
          </button>
          <button
            className={tab === 'profesores' ? 'active' : ''}
            onClick={() => setTab('profesores')}
          >
            👨‍🏫 Profesores
          </button>
        </nav>

        <button className="admin-logout-btn" onClick={handleLogout}>
          🚪 Cerrar sesión
        </button>
      </aside>

      {/* Contenido principal */}
      <main className="admin-main">

        {/* Cabecera */}
        <div className="admin-topbar">
          <h1>
            {tab === 'anuncios'   && 'Gestión de Anuncios'}
            {tab === 'alumnos'    && 'Gestión de Alumnos'}
            {tab === 'profesores' && 'Gestión de Profesores'}
          </h1>
          {mensaje && <div className="admin-toast">✅ {mensaje}</div>}
        </div>

        {/* Stats rápidas */}
        {stats && (
          <div className="admin-stats">
            <div className="stat-card pending">
              <span className="stat-num">{stats.anuncios_pendientes}</span>
              <span className="stat-label">Pendientes</span>
            </div>
            <div className="stat-card approved">
              <span className="stat-num">{stats.anuncios_aprobados}</span>
              <span className="stat-label">Aprobados</span>
            </div>
            <div className="stat-card students">
              <span className="stat-num">{stats.total_alumnos}</span>
              <span className="stat-label">Alumnos</span>
            </div>
            <div className="stat-card teachers">
              <span className="stat-num">{stats.total_profesores}</span>
              <span className="stat-label">Profesores</span>
            </div>
            <div className="stat-card blocked">
              <span className="stat-num">{stats.usuarios_bloqueados}</span>
              <span className="stat-label">Bloqueados</span>
            </div>
          </div>
        )}

        {/* ── PESTAÑA ANUNCIOS ── */}
        {tab === 'anuncios' && (
          <div>
            {/* Filtro por estado */}
            <div className="admin-filters">
              {['pendiente', 'aprobado', 'rechazado'].map(estado => (
                <button
                  key={estado}
                  className={filtroAnuncios === estado ? 'filter-active' : ''}
                  onClick={() => setFiltroAnuncios(estado)}
                >
                  {estado.charAt(0).toUpperCase() + estado.slice(1)}
                </button>
              ))}
            </div>

            {cargando ? (
              <p className="admin-loading">Cargando...</p>
            ) : anuncios.length === 0 ? (
              <p className="admin-empty">No hay anuncios con este estado.</p>
            ) : (
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Título</th>
                      <th>Profesor</th>
                      <th>Asignatura</th>
                      <th>Precio/h</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {anuncios.map(a => (
                      <tr key={a.id}>
                        <td>
                          <span className="anuncio-titulo">{a.titulo}</span>
                          <span className="anuncio-nivel">{a.nivel}</span>
                        </td>
                        <td>{a.profesor?.usuario?.nombre} {a.profesor?.usuario?.apellidos}</td>
                        <td>{a.asignatura}</td>
                        <td>{a.precio_hora}€</td>
                        <td>
                          <span className={`estado-badge estado-${a.verificado}`}>
                            {a.verificado}
                          </span>
                        </td>
                        <td className="acciones">
                          {a.verificado !== 'aprobado' && (
                            <button
                              className="btn-aprobar"
                              onClick={() => handleVerificar(a.id, 'aprobado')}
                            >
                              ✓ Aprobar
                            </button>
                          )}
                          {a.verificado !== 'rechazado' && (
                            <button
                              className="btn-rechazar"
                              onClick={() => handleVerificar(a.id, 'rechazado')}
                            >
                              ✗ Rechazar
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── PESTAÑA ALUMNOS ── */}
        {tab === 'alumnos' && (
          <UsuariosTabla
            usuarios={alumnos}
            cargando={cargando}
            onBloquear={handleBloquear}
            onEliminar={handleEliminar}
          />
        )}

        {/* ── PESTAÑA PROFESORES ── */}
        {tab === 'profesores' && (
          <UsuariosTabla
            usuarios={profesores}
            cargando={cargando}
            onBloquear={handleBloquear}
            onEliminar={handleEliminar}
            mostrarAnuncios
          />
        )}

      </main>
    </div>
  );
}

// ── Subcomponente: tabla de usuarios (alumnos y profesores) ───

function UsuariosTabla({ usuarios, cargando, onBloquear, onEliminar, mostrarAnuncios }) {
  if (cargando) return <p className="admin-loading">Cargando...</p>;
  if (usuarios.length === 0) return <p className="admin-empty">No hay usuarios registrados.</p>;

  return (
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Ciudad</th>
            {mostrarAnuncios && <th>Anuncios</th>}
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map(u => (
            <tr key={u.id} className={u.bloqueado ? 'row-blocked' : ''}>
              <td>{u.nombre} {u.apellidos}</td>
              <td>{u.email}</td>
              <td>{u.ciudad || '—'}</td>
              {mostrarAnuncios && <td>{u.total_anuncios}</td>}
              <td>
                <span className={`estado-badge ${u.bloqueado ? 'estado-rechazado' : 'estado-aprobado'}`}>
                  {u.bloqueado ? 'Bloqueado' : 'Activo'}
                </span>
              </td>
              <td className="acciones">
                <button
                  className={u.bloqueado ? 'btn-aprobar' : 'btn-rechazar'}
                  onClick={() => onBloquear(u.id, !u.bloqueado)}
                >
                  {u.bloqueado ? '🔓 Desbloquear' : '🔒 Bloquear'}
                </button>
                <button
                  className="btn-eliminar"
                  onClick={() => onEliminar(u.id, `${u.nombre} ${u.apellidos}`)}
                >
                  🗑 Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminDashboard;
