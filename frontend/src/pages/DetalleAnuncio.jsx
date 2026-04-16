// ============================================================
// PÁGINA: DetalleAnuncio
// Muestra la información completa de un anuncio y el
// formulario para solicitar una clase (hacer una reserva).
// useParams: lee el :id de la URL (ej: /anuncios/5 → id=5)
// ============================================================

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getAnuncio, crearReserva, estaLogueado, getUsuarioActual } from '../services/api';
import './DetalleAnuncio.css';

function DetalleAnuncio() {
  const { id } = useParams(); // Obtenemos el ID de la URL
  const navigate = useNavigate();

  const [anuncio, setAnuncio]   = useState(null);
  const [cargando, setCargando] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [exito,    setExito]    = useState(false);
  const [error,    setError]    = useState('');

  // Datos del formulario de reserva
  const [reserva, setReserva] = useState({
    fecha_clase:   '',
    duracion_h:    1,
    notas_alumno:  '',
  });

  // Cargamos el anuncio al montar el componente
  useEffect(() => {
    async function cargar() {
      const resultado = await getAnuncio(id);
      setCargando(false);
      if (resultado.ok) {
        setAnuncio(resultado.data.data);
      }
    }
    cargar();
  }, [id]);

  function handleChange(e) {
    setReserva({ ...reserva, [e.target.name]: e.target.value });
  }

  // Enviar la solicitud de clase
  async function handleSolicitar(e) {
    e.preventDefault();

    // Si no está logueado, lo mandamos a login
    if (!estaLogueado()) {
      navigate('/login');
      return;
    }

    const usuario = getUsuarioActual();
    // Solo los alumnos pueden reservar (RN-5)
    if (usuario.rol !== 'alumno') {
      setError('Solo los alumnos pueden solicitar clases.');
      return;
    }

    setEnviando(true);
    setError('');

    const resultado = await crearReserva({
      anuncio_id:   anuncio.id,
      fecha_clase:  reserva.fecha_clase,
      duracion_h:   reserva.duracion_h,
      notas_alumno: reserva.notas_alumno,
    });

    setEnviando(false);

    if (resultado.ok) {
      setExito(true); // Mostramos mensaje de éxito
    } else {
      setError(resultado.data.mensaje || 'Error al enviar la solicitud');
    }
  }

  // Calculamos el precio total en tiempo real
  const precioTotal = anuncio
    ? (anuncio.precio_hora * reserva.duracion_h).toFixed(2)
    : 0;

  if (cargando) return <div className="container" style={{padding:'80px 0', textAlign:'center'}}>Cargando...</div>;
  if (!anuncio) return <div className="container" style={{padding:'80px 0', textAlign:'center'}}>Anuncio no encontrado.</div>;

  const profesor = anuncio.profesor?.usuario;
  const iniciales = profesor ? `${profesor.nombre[0]}${profesor.apellidos[0]}` : '?';

  return (
    <div>
      <Navbar />

      {/* Cabecera */}
      <div className="detalle-header">
        <div className="container">
          <p className="detalle-breadcrumb">
            <a href="/anuncios">Mis anuncios</a> › Solicitar clase
          </p>
          <h1>Solicitar clase con {profesor?.nombre} {profesor?.apellidos}</h1>
        </div>
      </div>

      <div className="container detalle-body">

        {/* ── COLUMNA IZQUIERDA: Info del profesor ─── */}
        <div className="detalle-info">
          <div className="detalle-avatar">{iniciales}</div>
          <h2>{profesor?.nombre} {profesor?.apellidos}</h2>
          <p className="detalle-asignatura">{anuncio.asignatura} · {anuncio.nivel}</p>
          {profesor?.ciudad && <p className="detalle-ciudad">📍 {profesor.ciudad}</p>}

          <div className="detalle-precio">
            <strong>{anuncio.precio_hora}€</strong>
            <span> / hora</span>
          </div>

          <div className="detalle-descripcion">
            <h4>Descripción</h4>
            <p>{anuncio.descripcion}</p>
          </div>

          {/* Datos de contacto del profesor (RN-9) */}
          {profesor?.email && (
            <div className="detalle-contacto">
              <h4>Datos de contacto</h4>
              <p>✉️ {profesor.email}</p>
              {profesor.telefono && <p>📞 {profesor.telefono}</p>}
            </div>
          )}
        </div>

        {/* ── COLUMNA DERECHA: Formulario de reserva ─── */}
        <div className="detalle-form">

          {/* Si ya envió la solicitud */}
          {exito ? (
            <div className="exito-msg">
              <div className="exito-icon">✅</div>
              <h3>¡Solicitud enviada!</h3>
              <p>El profesor recibirá tu solicitud y te confirmará la clase.</p>
              <button onClick={() => navigate('/mi-perfil')} className="btn-primary">
                Ver mis reservas
              </button>
            </div>
          ) : (
            <>
              <h3>Detalles de tu solicitud</h3>
              <p className="detalle-anuncio-nombre">📋 {anuncio.titulo}</p>

              <form onSubmit={handleSolicitar}>

                <div className="form-group">
                  <label>Fecha preferida *</label>
                  <input
                    type="datetime-local"
                    name="fecha_clase"
                    value={reserva.fecha_clase}
                    onChange={handleChange}
                    min={new Date().toISOString().slice(0,16)} // Solo fechas futuras (RN-14)
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Duración (horas)</label>
                  <select name="duracion_h" value={reserva.duracion_h} onChange={handleChange}>
                    <option value={0.5}>30 minutos</option>
                    <option value={1}>60 minutos</option>
                    <option value={1.5}>90 minutos</option>
                    <option value={2}>2 horas</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Mensaje para el profesor</label>
                  <textarea
                    name="notas_alumno"
                    rows={4}
                    placeholder="Preséntate brevemente y explica lo que necesitas..."
                    value={reserva.notas_alumno}
                    onChange={handleChange}
                    maxLength={500}
                  />
                </div>

                {/* Resumen del precio */}
                <div className="reserva-resumen">
                  <span>1 clase · {reserva.duracion_h}h</span>
                  <strong>{precioTotal}€</strong>
                </div>

                {error && <p className="error-msg">{error}</p>}

                <button type="submit" className="btn-primary auth-btn" disabled={enviando}>
                  {enviando ? 'Enviando...' : 'Enviar solicitud de clase'}
                </button>

                <p className="reserva-nota">
                  Al enviar la solicitud, el profesor recibirá una notificación.
                  No se realizará ningún pago hasta que el profesor confirme la clase.
                </p>

              </form>
            </>
          )}
        </div>

      </div>
    </div>
  );
}

export default DetalleAnuncio;
