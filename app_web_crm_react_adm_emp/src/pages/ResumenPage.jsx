import { useEffect, useState } from 'react';
import { obtenerResumen } from '../api/gestion.api.js';
import { mensajeDeError } from '../api/client.js';
import { soles } from '../utils/formato.js';
import { ESTADOS } from '../components/TarjetaPedido.jsx';

// Solo administrador: indicadores del día y del total
export default function ResumenPage() {
  const [datos, setDatos] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const cargar = () => obtenerResumen().then(setDatos).catch((e) => setError(mensajeDeError(e)));
    cargar();
    const id = setInterval(cargar, 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      <section className="portada"><h1>Resumen</h1><p>Indicadores de la pastelería.</p></section>
      {error && <p className="aviso error" role="alert">{error}</p>}
      {!datos && !error && <p className="aviso">Cargando…</p>}
      {datos && (
        <>
          <div className="indicadores">
            <div className="tarjeta indicador"><small>Pedidos de hoy</small><strong>{datos.hoy}</strong></div>
            <div className="tarjeta indicador"><small>Pedidos en total</small><strong>{datos.pedidos}</strong></div>
            <div className="tarjeta indicador"><small>Ventas acumuladas</small><strong>{soles(datos.ingresos)}</strong></div>
          </div>
          <div className="indicadores">
            {ESTADOS.map((e) => (
              <div key={e} className="tarjeta indicador"><small>{e}</small><strong>{datos.porEstado[e] ?? 0}</strong></div>
            ))}
          </div>
        </>
      )}
    </>
  );
}
