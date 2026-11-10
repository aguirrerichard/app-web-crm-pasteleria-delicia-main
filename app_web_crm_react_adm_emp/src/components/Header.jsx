import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Header() {
  const { usuario, salir } = useAuth();
  return (
    <header className="cabecera">
      <NavLink to="/" className="marca">
        <span className="marca-icono" aria-hidden="true">D</span>
        Delicia · Gestión
      </NavLink>
      {usuario && (
        <nav className="menu">
          <NavLink to="/" end>Tablero</NavLink>
          {usuario.rol === 'admin' && <NavLink to="/resumen">Resumen</NavLink>}
          <span className="usuario">{usuario.nombre} · {usuario.rol}</span>
          <button className="boton secundario" onClick={salir}>Salir</button>
        </nav>
      )}
    </header>
  );
}
