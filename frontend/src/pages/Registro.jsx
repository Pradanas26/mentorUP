// ============================================================
// PÁGINA: Registro
// Formulario para crear una nueva cuenta.
// El usuario elige si quiere ser Alumno o Profesor.
// ============================================================

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registrar } from '../services/api';
import Navbar from '../components/Navbar';
import './Auth.css';

function Registro() {
  const navigate = useNavigate();

  // Estado del formulario con todos los campos
  const [form, setForm] = useState({
    nombre:                '',
    apellidos:             '',
    email:                 '',
    password:              '',
    password_confirmation: '', 
    ciudad:                '',
    rol:                   'alumno', // Por defecto: alumno
  });

  const [errores,  setErrores]  = useState({});
  const [cargando, setCargando] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    // Limpiamos el error del campo al empezar a escribir
    if (errores[e.target.name]) {
      setErrores({ ...errores, [e.target.name]: '' });
    }
  }

  // Cambia el rol (Alumno / Profesor)
  function setRol(rol) {
    setForm({ ...form, rol });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErrores({});
    setCargando(true);

    const resultado = await registrar(form);
    setCargando(false);

    if (resultado.ok) {
      navigate('/mi-perfil'); // Redirigimos al perfil tras registro exitoso
    } else {
      // Mostramos los errores de validación de Laravel
      setErrores(resultado.data.errors || {});
    }
  }

  return (
    <div className="auth-page">
      <Navbar />

      <div className="auth-bg">
        <div className="auth-card">

          <div className="auth-logo">🎓</div>
          <h2 className="auth-title">Crea tu cuenta de MentorUP</h2>

          {/* Selector de rol: Alumno o Profesor */}
          <div className="rol-selector">
            <button
              type="button"
              className={`rol-btn ${form.rol === 'alumno' ? 'rol-btn--active' : ''}`}
              onClick={() => setRol('alumno')}
            >
              🎓 Alumno
            </button>
            <button
              type="button"
              className={`rol-btn ${form.rol === 'profesor' ? 'rol-btn--active' : ''}`}
              onClick={() => setRol('profesor')}
            >
              👨‍🏫 Profesor
            </button>
          </div>

          <form onSubmit={handleSubmit}>

            {/* Nombre y apellidos en la misma fila */}
            <div className="form-row">
              <div className="form-group">
                <label>Nombre</label>
                <input
                  type="text"
                  name="nombre"
                  placeholder="Alex"
                  value={form.nombre}
                  onChange={handleChange}
                  required
                />
                {errores.nombre && <p className="error-msg">{errores.nombre[0]}</p>}
              </div>

              <div className="form-group">
                <label>Apellidos</label>
                <input
                  type="text"
                  name="apellidos"
                  placeholder="García López"
                  value={form.apellidos}
                  onChange={handleChange}
                  required
                />
                {errores.apellidos && <p className="error-msg">{errores.apellidos[0]}</p>}
              </div>
            </div>

            <div className="form-group">
              <label>Correo electrónico</label>
              <input
                type="email"
                name="email"
                placeholder="tucorreo@ejemplo.com"
                value={form.email}
                onChange={handleChange}
                required
              />
              {errores.email && <p className="error-msg">{errores.email[0]}</p>}
            </div>

            {/* Contraseñas en la misma fila */}
            <div className="form-row">
              <div className="form-group">
                <label>Contraseña</label>
                <input
                  type="password"
                  name="password"
                  placeholder="Mínimo 8 caracteres"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
                {errores.password && <p className="error-msg">{errores.password[0]}</p>}
              </div>

              <div className="form-group">
                <label>Repetir contraseña</label>
                <input
                  type="password"
                  name="password_confirmation"
                  placeholder="••••••••"
                  value={form.password_confirmation}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Ciudad</label>
              <select name="ciudad" value={form.ciudad} onChange={handleChange}>
                <option value="">Selecciona tu ciudad...</option>
                <option value="Barcelona">Barcelona</option>
                <option value="Madrid">Madrid</option>
                <option value="Valencia">Valencia</option>
                <option value="Sevilla">Sevilla</option>
                <option value="Málaga">Málaga</option>
                <option value="Otra">Otra</option>
              </select>
            </div>

            <button
              type="submit"
              className="btn-primary auth-btn"
              disabled={cargando}
            >
              {cargando ? 'Creando cuenta...' : 'Crear cuenta gratis'}
            </button>

          </form>

          <p className="auth-switch">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login">Iniciar sesión</Link>
          </p>

        </div>
      </div>
    </div>
  );
}

export default Registro;
