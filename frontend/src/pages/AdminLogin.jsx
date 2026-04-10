// ============================================================
// PÁGINA: AdminLogin
// Formulario de inicio de sesión exclusivo para administradores.
// Está en /admin/login, separado del login normal.
// Si el login es correcto y el usuario es admin, redirige
// al panel de administración.
// ============================================================

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, esAdmin } from '../services/api';
import './Auth.css';
import './AdminLogin.css';

function AdminLogin() {
  const navigate = useNavigate();

  const [form, setForm]         = useState({ email: '', password: '' });
  const [error, setError]       = useState('');
  const [cargando, setCargando] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setCargando(true);

    const resultado = await login(form.email, form.password);
    setCargando(false);

    if (!resultado.ok) {
      setError(resultado.data.mensaje || 'Credenciales incorrectas');
      return;
    }

    // Verificamos que el usuario logueado sea realmente admin
    if (!esAdmin()) {
      // Si no es admin, limpiamos la sesión y mostramos error
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      setError('Esta cuenta no tiene permisos de administrador.');
      return;
    }

    // Todo correcto: vamos al panel
    navigate('/admin/dashboard');
  }

  return (
    <div className="admin-login-page">

      <div className="admin-login-card">

        {/* Cabecera */}
        <div className="admin-login-header">
          <span className="admin-shield">🛡️</span>
          <h1>Panel de Administración</h1>
          <p>MentorUP · Acceso restringido</p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label>Correo electrónico</label>
            <input
              type="email"
              name="email"
              placeholder="admin@mentorup.com"
              value={form.email}
              onChange={handleChange}
              required
              autoComplete="username"
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
              autoComplete="current-password"
            />
          </div>

          {error && <p className="error-msg">{error}</p>}

          <button
            type="submit"
            className="btn-admin-login"
            disabled={cargando}
          >
            {cargando ? 'Verificando...' : 'Acceder al panel'}
          </button>

        </form>

        <p className="admin-login-back">
          <a href="/">← Volver a MentorUP</a>
        </p>

      </div>
    </div>
  );
}

export default AdminLogin;
