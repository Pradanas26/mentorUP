// ============================================================
// PÁGINA: Home (Página Principal)
// Es la primera página que ve el usuario al entrar a MentorUP.
// Tiene: hero, cómo funciona, tipos de usuario y footer.
// ============================================================

import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './Home.css';

function Home() {
  return (
    <div className="home">
      <Navbar />

      {/* ── SECCIÓN HERO ─────────────────────────────────── */}
      <section className="hero">
        <div className="container hero-inner">

          {/* Texto izquierda */}
          <div className="hero-text">
            <h1 className="hero-title">
              Mejores <br />
              <span>profesores.</span>
            </h1>
            <p className="hero-subtitle">
              Conectamos a alumnos con docentes especializados para
              clases particulares personalizadas y de calidad.
            </p>
            <div className="hero-buttons">
              <Link to="/anuncios" className="btn-outline">Buscar profesor</Link>
              <Link to="/registro" className="btn-primary">Soy profesor</Link>
            </div>

            {/* Estadísticas */}
            <div className="hero-stats">
              <div className="stat">
                <strong>+500</strong>
                <span>Profesores</span>
              </div>
              <div className="stat">
                <strong>+2.000</strong>
                <span>Alumnos</span>
              </div>
              <div className="stat">
                <strong>98%</strong>
                <span>Satisfacción</span>
              </div>
            </div>
          </div>

          {/* Tarjeta decorativa derecha */}
          <div className="hero-card">
            <div className="hero-search">
              🔍 Buscar por materia o profesor...
            </div>
            <div className="hero-profiles">
              <div className="mini-profile">
                <div className="mini-avatar">CM</div>
                <div>
                  <p className="mini-name">Carlos M.</p>
                  <p className="mini-subject">Matemáticas</p>
                  <div className="stars">★★★★★</div>
                </div>
              </div>
              <div className="mini-profile">
                <div className="mini-avatar" style={{background:'#6366f1'}}>LG</div>
                <div>
                  <p className="mini-name">Laura G.</p>
                  <p className="mini-subject">Inglés</p>
                  <div className="stars">★★★★★</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── CÓMO FUNCIONA ────────────────────────────────── */}
      <section className="como-funciona" id="como-funciona">
        <div className="container">
          <h2 className="section-title">¿Cómo funciona?</h2>
          <p className="section-subtitle">Tres pasos sencillos para empezar</p>

          <div className="pasos">
            <div className="paso">
              <div className="paso-num">1</div>
              <h3>Crea tu cuenta</h3>
              <p>Regístrate como alumno o profesor en minutos.</p>
            </div>
            <div className="paso">
              <div className="paso-num">2</div>
              <h3>Explora el tablón</h3>
              <p>Busca profesores por materia, precio o valoración.</p>
            </div>
            <div className="paso">
              <div className="paso-num">3</div>
              <h3>Contacta y aprende</h3>
              <p>Solicita la clase y empieza tu aprendizaje hoy mismo.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── TIPOS DE USUARIO ─────────────────────────────── */}
      <section className="perfiles">
        <div className="container">
          <h2 className="section-title">Una plataforma para todos</h2>
          <p className="section-subtitle">Tres perfiles, un mismo objetivo: el aprendizaje</p>

          <div className="perfiles-grid">
            <div className="perfil-card">
              <div className="perfil-icon">🎓</div>
              <h3>Alumno</h3>
              <p>Regístrate y busca el profesor ideal para cada materia.
                 Filtra por precio, horario y valoraciones de otros alumnos.</p>
              <Link to="/registro" className="btn-outline">Alumno</Link>
            </div>
            <div className="perfil-card">
              <div className="perfil-icon">👨‍🏫</div>
              <h3>Profesor</h3>
              <p>Crea tu perfil profesional, adjunta tus titulaciones y
                 publica anuncios en el tablón. Llega a miles de alumnos.</p>
              <Link to="/registro" className="btn-outline">Profesor</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────── */}
      <footer className="footer">
        <div className="container footer-inner">
          <div className="footer-brand">
            <p className="footer-logo">Mentor 🎓 <strong>UP</strong></p>
            <p>Conectando talento con aprendizaje desde 2026.</p>
          </div>
          <div className="footer-links">
            <div>
              <h4>Plataforma</h4>
              <ul>
                <li><Link to="/#como-funciona">Cómo funciona</Link></li>
                <li><Link to="/anuncios">Tablón de anuncios</Link></li>
              </ul>
            </div>
            <div>
              <h4>Soporte</h4>
              <ul>
                <li><a href="#">Centro de ayuda</a></li>
                <li><a href="#">Contacto</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="footer-copy">
          <p>© 2026 MentorUP. Todos los derechos reservados.</p>
        </div>
      </footer>

    </div>
  );
}

export default Home;
