import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header.jsx';
import CatalogoPage from './pages/CatalogoPage.jsx';
import PedidoPage from './pages/PedidoPage.jsx';
import SeguimientoPage from './pages/SeguimientoPage.jsx';

export default function App() {
  return (
    <>
      <Header />
      <main className="contenedor">
        <Routes>
          <Route path="/" element={<CatalogoPage />} />
          <Route path="/pedido/:productoId" element={<PedidoPage />} />
          <Route path="/seguimiento" element={<SeguimientoPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <footer className="pie">Pastelería Delicia · El Tambo, Huancayo · Datos de demostración</footer>
    </>
  );
}