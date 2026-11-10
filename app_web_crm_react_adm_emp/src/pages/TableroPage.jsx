import { useState } from 'react';
import { usePedidos } from '../hooks/usePedidos.js';
import { avanzarPedido } from '../api/gestion.api.js';
import { mensajeDeError } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';
import TarjetaPedido, { ESTADOS } from '../components/TarjetaPedido.jsx';
import HistorialModal from '../components/HistorialModal.jsx';

// Tablero por columnas: el empleado lleva cada pedido de un estado al siguiente
export default function TableroPage() {
  const { usuario } = useAuth();
  const { pedidos, error, cargando, recargar } = usePedidos();
  const [ocupado, setOcupado] = useState(null);
  const [aviso, setAviso] = useState('');
  const [verHistorial, setVerHistorial] = useState(null);

  async function avanzar(pedido, estado) {
    setOcupado(pedido.id);
    setAviso('');
    try {
      await avanzarPedido(pedido.id, estado);
      await recargar();
    } catch (err) {
      setAviso(mensajeDeError(err));
      recargar();
    } finally {
      setOcupado(null);
    }
  }

  return (
    <>
      <section className="portada">
        <h1>Tablero de pedidos</h1>
        <p>Se actualiza solo cada 5 segundos. Avanza cada pedido al siguiente estado.</p>
      </section>
      {cargando && <p className="aviso">Cargando pedidos…</p>}
      {(error || aviso) && <p className="aviso error" role="alert">{error || aviso}</p>}

      <div className="tablero">
        {ESTADOS.map((estado) => {
          const lista = pedidos.filter((p) => p.estado === estado);
          return (
            <section key={estado} className="columna">
              <h2>{estado} <span className="contador">{lista.length}</span></h2>
              {lista.length === 0 && <p className="nota">Sin pedidos</p>}
              {lista.map((p) => (
                <TarjetaPedido key={p.id} pedido={p} ocupado={ocupado === p.id} onAvanzar={avanzar}
                  onHistorial={usuario.rol === 'admin' ? setVerHistorial : null} />
              ))}
            </section>
          );
        })}
      </div>
      {verHistorial && <HistorialModal pedido={verHistorial} onCerrar={() => setVerHistorial(null)} />}
    </>
  );
}
