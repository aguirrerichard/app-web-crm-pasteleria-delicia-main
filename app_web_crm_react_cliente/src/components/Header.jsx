import { NavLink } from 'react-router-dom';

export default function Header() {
  return (
    <header className="cabecera">
      <NavLink to="/" className="marca">
        <span className="marca-icono" aria-hidden="true">D</span>
        Pastelería Delicia
      </NavLink>
      <nav className="menu">
        <NavLink to="/" end>Tortas</NavLink>
        <NavLink to="/seguimiento">Seguir mi pedido</NavLink>
      </nav>
    </header>
  );
}