import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header.jsx';
import RutaProtegida from './components/RutaProtegida.jsx';
import LoginPage from './pages/LoginPage.jsx';
import TableroPage from './pages/TableroPage.jsx';
import ResumenPage from './pages/ResumenPage.jsx';

export default function App() {
  return (
    <>
      <Header />
      <main className="contenedor ancho-total">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<RutaProtegida><TableroPage /></RutaProtegida>} />
          <Route path="/resumen" element={<RutaProtegida rol="admin"><ResumenPage /></RutaProtegida>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </>
  );
}
