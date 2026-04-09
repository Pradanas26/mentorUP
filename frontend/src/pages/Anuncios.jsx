// ============================================================
// PÁGINA: Anuncios (Tablón de Profesores)
// Muestra el hero con buscador, anuncios destacados y
// el grid de todos los anuncios disponibles.
// ============================================================

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getAnuncios } from '../services/api';
import './Anuncios.css';

// ── Datos de destacados (hardcoded como demo visual) ──────────
// En producción estos vendrían de la API con el flag destacado=1
const DESTACADOS = [
  {
    id: 1,
    iniciales: 'CM',
    nombre: 'Carlos Martínez',
    asignaturas: 'Matemáticas · Física · Química',
    estrellas: 4.9,
    resenas: 119,
    chips: ['Online', 'Presencial', 'Bachillerato'],
    precio: 25,
    color: 'linear-gradient(145deg, #3d8c80, #4a9d8f)',
  },
  {
    id: 2,
    iniciales: 'LG',
    nombre: 'Laura García',
    asignaturas: 'Inglés · Francés · Alemán',
    estrellas: 4.8,
    resenas: 84,
    chips: ['Online', 'Todos los niveles', 'Cambridge'],
    precio: 20,
    color: 'linear-gradient(145deg, #4467c4, #5578d4)',
  },
  {
    id: 3,
    iniciales: 'JL',
    nombre: 'Javier López',
    asignaturas: 'Programación · IA · Data Science',
    estrellas: 5.0,
    resenas: 215,
    chips: ['Online', 'Python', 'IA/ML'],
    precio: 30,
    color: 'linear-gradient(145deg, #6b4fa0, #7d5fba)',
  },
];

// ── Datos de todos los anuncios (demo visual) ─────────────────
const ANUNCIOS_DEMO = [
  {
    id: 4,
    iniciales: 'AR',
    nombre: 'Ana Romero',
    asignatura: 'Biología · Zoología',
    estrellas: 4.7,
    resenas: 76,
    descripcion: 'Doctora en Bioquímica. Preparación de selectividad y primeros años de carrera universitaria.',
    chips: [{ texto: 'Selectividad', tipo: 'verde' }, { texto: 'Presencial', tipo: 'gris' }],
    precio: 22,
    disponibilidad: 'verde',
    disponibilidadTexto: 'Disponible esta semana',
    avatarColor: '#e76f51',
  },
  {
    id: 5,
    iniciales: 'MT',
    nombre: 'Miguel Torres',
    asignatura: 'Historia · Arte · Filosofía',
    estrellas: 4.5,
    resenas: 43,
    descripcion: 'Historiador y profesor universitario. Metodología visual y amena para hacer las humanidades apasionantes.',
    chips: [{ texto: 'ESO', tipo: 'verde' }, { texto: 'Bachillerato', tipo: 'oscuro' }, { texto: 'Presencial', tipo: 'gris' }],
    precio: 18,
    disponibilidad: 'verde',
    disponibilidadTexto: 'Disponible esta semana',
    avatarColor: '#6b4fa0',
  },
  {
    id: 6,
    iniciales: 'EV',
    nombre: 'Elena Vidal',
    asignatura: 'Piano · Teoría Musical',
    estrellas: 4.0,
    resenas: 42,
    descripcion: 'Pianista titulada por el Conservatorio Superior de Madrid. Clases para niños y adultos de todos los niveles.',
    chips: [{ texto: 'Música', tipo: 'verde' }, { texto: 'Presencial', tipo: 'gris' }],
    precio: 28,
    disponibilidad: 'amarillo',
    disponibilidadTexto: 'Disponible próxima semana',
    avatarColor: '#4467c4',
  },
  {
    id: 7,
    iniciales: 'PR',
    nombre: 'Pedro Ruiz',
    asignatura: 'Medicina · Anatomía · USMLE',
    estrellas: 4.9,
    resenas: 125,
    descripcion: 'Médico especialista. Preparación de exámenes MIR, USMLE y asignaturas de Medicina y Enfermería.',
    chips: [{ texto: 'MIR', tipo: 'verde' }, { texto: 'Universidad', tipo: 'oscuro' }, { texto: 'Presencial', tipo: 'gris' }],
    precio: 35,
    disponibilidad: 'verde',
    disponibilidadTexto: 'Disponible esta semana',
    avatarColor: '#3d8c80',
  },
];

// ── Componente para renderizar estrellas ───────────────────────
function Estrellas({ valor }) {
  return (
    <span className="estrellas">
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} style={{ color: i <= Math.round(valor) ? '#F59E0B' : '#ddd' }}>★</span>
      ))}
    </span>
  );
}

function Anuncios() {
  // Estado del buscador
  const [busqueda, setBusqueda] = useState('');
  const [ciudad,   setCiudad]   = useState('Barcelona, España');

  // Estado para los anuncios reales de la API
  const [anuncios,  setAnuncios]  = useState([]);
  const [cargando,  setCargando]  = useState(false);

  // Al montar, intentamos cargar anuncios reales de la API
  useEffect(() => {
    async function cargar() {
      setCargando(true);
      const resultado = await getAnuncios();
      setCargando(false);
      // Si hay datos de la API los usamos, si no mostramos los de demo
      if (resultado.ok && resultado.data.data?.length > 0) {
        setAnuncios(resultado.data.data);
      }
    }
    cargar();
  }, []);

  function handleBuscar(e) {
    e.preventDefault();
    // Aquí se podría llamar a la API con los filtros
  }

  // Usamos datos de la API si hay, si no los de demo
  const anunciosMostrar = anuncios.length > 0 ? anuncios : ANUNCIOS_DEMO;

  return (
    <div className="anuncios-page">
      <Navbar />

      {/* ── HERO con buscador ─────────────────────────────── */}
      <section className="an-hero">
        <h1>Encuentra al profesor perfecto</h1>
        <p>Conecta con docentes verificados para clases presenciales</p>

        <form className="an-buscador" onSubmit={handleBuscar}>
          {/* Icono lupa */}
          <svg className="an-lupa" width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="#aaa" strokeWidth="2">
            <circle cx="9" cy="9" r="6"/><path d="M15 15l3 3"/>
          </svg>

          <input
            type="text"
            placeholder="Buscar materia, profesor o tema..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />

          <div className="an-divider" />

          {/* Ciudad */}
          <div className="an-ciudad">
            <span className="an-ciudad-dot" />
            <span>{ciudad}</span>
          </div>

          <button type="submit">Buscar profesor</button>
        </form>
      </section>

      <div className="an-content">

        {/* ── DESTACADOS ──────────────────────────────────── */}
        <div className="an-section-header">
          <div>
            <h2>Anuncios destacados</h2>
            <p>Profesores con las mejores valoraciones esta semana</p>
          </div>
          <a className="an-ver-todos">Ver todos →</a>
        </div>

        <div className="an-destacados-grid">
          {DESTACADOS.map((d) => (
            <Link to={`/anuncios/${d.id}`} key={d.id} className="an-dest-card" style={{ background: d.color }}>
              {/* Círculo decorativo */}
              <div className="an-dest-deco" />

              <div className="an-dest-top">
                <div className="an-dest-avatar">{d.iniciales}</div>
                <div>
                  <p className="an-dest-nombre">{d.nombre}</p>
                  <p className="an-dest-asigs">{d.asignaturas}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                    <Estrellas valor={d.estrellas} />
                    <span className="an-dest-reviews">{d.estrellas} · {d.resenas} reseñas</span>
                  </div>
                </div>
              </div>

              <div className="an-dest-chips">
                {d.chips.map((c) => <span key={c} className="an-dest-chip">{c}</span>)}
              </div>

              <div className="an-dest-bottom">
                <div className="an-dest-precio">{d.precio}€ <span>/hora</span></div>
                <button className="an-dest-btn">Solicitar clase →</button>
              </div>
            </Link>
          ))}
        </div>

        {/* ── TODOS LOS ANUNCIOS ──────────────────────────── */}
        <div className="an-section-header" style={{ marginTop: 36 }}>
          <div>
            <h2>Todos los anuncios</h2>
            <p>Todos nuestros mejores profesores a tu disposición</p>
          </div>
          <a className="an-ver-todos">Ver todos →</a>
        </div>

        <div className="an-grid">
          {anunciosMostrar.map((a) => {
            // Soporte para datos de API y datos de demo
            const nombreProfesor = a.nombre || `${a.profesor?.usuario?.nombre} ${a.profesor?.usuario?.apellidos}`;
            const asignaturaProfesor = a.asignatura || a.asignatura;
            const precioProfesor = a.precio || a.precio_hora;
            const inicialesProfesor = a.iniciales || nombreProfesor?.split(' ').map(p => p[0]).join('').slice(0,2);

            return (
              <div key={a.id} className="an-card">
                <div className="an-card-top">
                  <div className="an-card-avatar" style={{ background: a.avatarColor || '#4a9d8f' }}>
                    {inicialesProfesor}
                  </div>
                  <div>
                    <p className="an-card-nombre">{nombreProfesor}</p>
                    <p className="an-card-asig">{asignaturaProfesor}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Estrellas valor={a.estrellas || 4.5} />
                      <span className="an-card-reviews">{a.estrellas || 4.5} ({a.resenas || 0})</span>
                    </div>
                  </div>
                </div>

                <p className="an-card-desc">{a.descripcion}</p>

                {/* Chips */}
                <div className="an-card-chips">
                  {(a.chips || [{ texto: a.nivel || 'General', tipo: 'verde' }]).map((c, i) => (
                    <span
                      key={i}
                      className={`an-card-chip an-card-chip--${c.tipo || 'verde'}`}
                    >
                      {c.texto}
                    </span>
                  ))}
                </div>

                <div className="an-card-bottom">
                  <div className="an-card-precio">{precioProfesor}€ <span>/hora</span></div>
                  <Link to={`/anuncios/${a.id}`} className="an-card-btn">Solicitar</Link>
                </div>

                {/* Disponibilidad */}
                <div className={`an-card-disp an-card-disp--${a.disponibilidad || 'verde'}`}>
                  <span className="an-card-disp-dot" />
                  {a.disponibilidadTexto || 'Disponible esta semana'}
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Footer */}
      <footer className="an-footer">
        <p>© 2026 MentorUP. Todos los derechos reservados.
          {['Cómo funciona','Privacidad','Términos','Contacto','Blog','Soporte'].map(l => (
            <a key={l} href="#">{l}</a>
          ))}
        </p>
      </footer>
    </div>
  );
}

export default Anuncios;
