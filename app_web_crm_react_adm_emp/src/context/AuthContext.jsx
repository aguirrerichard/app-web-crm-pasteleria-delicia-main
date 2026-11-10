import { createContext, useContext, useState } from 'react';
import { iniciarSesion } from '../api/auth.api.js';
import { leerSesion, guardarSesion, borrarSesion } from '../api/client.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [sesion, setSesion] = useState(leerSesion);

  async function entrar(email, password) {
    const s = await iniciarSesion(email, password);
    guardarSesion(s);
    setSesion(s);
  }
  function salir() {
    borrarSesion();
    setSesion(null);
  }

  return <AuthContext.Provider value={{ usuario: sesion?.usuario ?? null, entrar, salir }}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
