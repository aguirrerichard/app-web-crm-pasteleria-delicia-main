import { useCallback, useEffect, useState } from 'react';
import { listarPedidos } from '../api/gestion.api.js';
import { mensajeDeError } from '../api/client.js';

// Trae los pedidos y los refresca cada 5 s: lo que encarga un cliente aparece solo
export function usePedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(true);

  const recargar = useCallback(() =>
    listarPedidos()
      .then((d) => { setPedidos(d); setError(''); })
      .catch((e) => setError(mensajeDeError(e)))
      .finally(() => setCargando(false)), []);

  useEffect(() => {
    recargar();
    const id = setInterval(recargar, 5000);
    return () => clearInterval(id);
  }, [recargar]);

  return { pedidos, error, cargando, recargar };
}
