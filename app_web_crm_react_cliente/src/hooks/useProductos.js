import { useEffect, useState } from 'react';
import { obtenerProductos } from '../api/productos.api.js';
import { mensajeDeError } from '../api/client.js';

export function useProductos() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    obtenerProductos()
      .then(setProductos)
      .catch((err) => setError(mensajeDeError(err)))
      .finally(() => setCargando(false));
  }, []);

  return { productos, cargando, error };
}