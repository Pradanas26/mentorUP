// ============================================================
// main.jsx — Punto de entrada de React
// Este es el primer archivo que se ejecuta.
// Monta el componente App dentro del div#root del index.html
// ============================================================

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// ReactDOM.createRoot: crea la raíz de la aplicación React
// document.getElementById('root'): busca el <div id="root"> en index.html
ReactDOM.createRoot(document.getElementById('root')).render(
  // StrictMode: activa advertencias extra durante el desarrollo
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
