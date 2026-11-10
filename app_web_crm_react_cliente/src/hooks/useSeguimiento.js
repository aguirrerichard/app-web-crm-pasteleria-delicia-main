import { useEffect, useState } from 'react';
import { consultarPedido } from '../api/pedidos.api.js';
import { mensajeDeError } from '../api/client.js';

// Consulta el pedido y lo vuelve a consultar cada 5 segundos:
// así el cliente ve el cambio de estado que hace el empleado sin recargar.
export function useSeguimiento(busqueda) {
  const [pedido, setPedido] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!busqueda) return;
    let activo = true;

    const consultar = () =>
      consultarPedido(busqueda.codigo, busqueda.celular)
        .then((data) => { if (activo) { setPedido(data); setError(''); } })
        .catch((err) => { if (activo) { setPedido(null); setError(mensajeDeError(err)); } });

    consultar();
    const id = setInterval(consultar, 5000);
    return () => { activo = false; clearInterval(id); };
  }, [busqueda]);

  // "cargando" no necesita su propio estado: se deduce de los otros dos
  const cargando = Boolean(busqueda) && !pedido && !error;
  return { pedido, error, cargando };
}