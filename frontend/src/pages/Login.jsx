// ============================================================
// PÁGINA: Login
// Formulario de inicio de sesión.
// Cuando el usuario envía el formulario, llamamos a la API
// y si todo va bien lo redirigimos a su perfil.
// ============================================================

import { useState } from 'react';        // Hook para manejar el estado del formulario
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../services/api';
import Navbar from '../components/Navbar';
import './Auth.css';

function Login() {
  // useNavigate: nos permite redirigir al usuario a otra página
  const navigate = useNavigate();

  // Estado del formulario: guardamos lo que escribe el usuario
  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  // Estado para mostrar errores o el indicador de carga
  const [error,   setError]   = useState('');
  const [cargando, setCargando] = useState(false);

  // Se llama cada vez que el usuario escribe en un campo
  function handleChange(e) {
    setForm({
      ...form,               // Mantenemos los valores anteriores
      [e.target.name]: e.target.value, // Actualizamos solo el campo que cambió
    });
  }

  // Se llama cuando el usuario hace clic en "Continuar"
  async function handleSubmit(e) {
    e.preventDefault(); // Evita que la página se recargue (comportamiento por defecto de los formularios)
    setError('');
    setCargando(true);

    // Llamamos a la API de login
    const resultado = await login(form.email, form.password);
    setCargando(false);

    if (resultado.ok) {
      // Login correcto: redirigimos al perfil
      navigate('/mi-perfil');
    } else {
      // Login fallido: mostramos el error
      setError(resultado.data.mensaje || 'Error al iniciar sesión');
    }
  }

  return (
    <div className="auth-page">
      <Navbar />

      <div className="auth-bg">
        <div className="auth-card">

          {/* Logo */}
          <div className="auth-logo">🎓</div>
          <h2 className="auth-title">Inicia sesión en MentorUP</h2>

          {/* Formulario */}
          <form onSubmit={handleSubmit}>

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
            </div>

            <div className="form-group">
              <label>Contraseña</label>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            {/* Mostramos el error si existe */}
            {error && <p className="error-msg">{error}</p>}

            <button
              type="submit"
              className="btn-primary auth-btn"
              disabled={cargando} // Desactivamos el botón mientras carga
            >
              {cargando ? 'Cargando...' : 'Continuar'}
            </button>

          </form>

          {/* Enlace para registrarse */}
          <p className="auth-switch">
            ¿No tienes cuenta?{' '}
            <Link to="/registro">Crea tu cuenta de MentorUP</Link>
          </p>

        </div>
      </div>
    </div>
  );
}

export default Login;
