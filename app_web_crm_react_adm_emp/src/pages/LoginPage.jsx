import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { mensajeDeError } from '../api/client.js';

export default function LoginPage() {
  const { usuario, entrar } = useAuth();
  const navegar = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  if (usuario) return <Navigate to="/" replace />;

  async function enviar(e) {
    e.preventDefault();
    setError('');
    setEnviando(true);
    try {
      await entrar(email, password);
      navegar('/', { replace: true });
    } catch (err) {
      setError(mensajeDeError(err));
    } finally {
      setEnviando(false);
    }
  }

  return (
    <section className="tarjeta formulario login">
      <p className="etiqueta">Personal de Delicia</p>
      <h1>Iniciar sesión</h1>
      <form onSubmit={enviar}>
        <label>Correo
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="username" placeholder="rosa@delicia.pe" />
        </label>
        <label>Contraseña
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" />
        </label>
        {error && <p className="aviso error" role="alert">{error}</p>}
        <button className="boton ancho" disabled={enviando}>{enviando ? 'Entrando…' : 'Entrar'}</button>
      </form>
    </section>
  );
}
