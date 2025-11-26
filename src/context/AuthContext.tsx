import { createContext, useState, useEffect, type ReactNode } from 'react';
import api from '../services/api';

interface Usuario {
  id: string;
  nombreUsuario: string;
  email: string;
  totalInvertido: number;
}

interface AuthContextType {
  estaAutenticado: boolean;
  usuario: Usuario | null;
  token: string | null;
  iniciarSesion: (token: string) => void;
  cerrarSesion: () => void;
  cargando: boolean;
  actualizarUsuario: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [cargando, setCargando] = useState(true);

  const cargarUsuario = async () => {
    if (token) {
      try {
        const respuesta = await api.get('/investments/userdata');
        setUsuario(respuesta.data);
      } catch (error) {
        console.error('Fallo al cargar el usuario', error);
        cerrarSesion();
      }
    }
    setCargando(false);
  };

  useEffect(() => {
    cargarUsuario();
  }, [token]);

  const iniciarSesion = (nuevoToken: string) => {
    localStorage.setItem('token', nuevoToken);
    setToken(nuevoToken);
  };

  const cerrarSesion = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUsuario(null);
  };

  const estaAutenticado = !!token;

  const actualizarUsuario = async () => {
    await cargarUsuario();
  };

  return (
    <AuthContext.Provider value={{ estaAutenticado, usuario, token, iniciarSesion, cerrarSesion, cargando, actualizarUsuario }}>
      {children}
    </AuthContext.Provider>
  );
};
