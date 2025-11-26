import { useContext, ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

interface RutaPrivadaProps {
  children?: ReactNode;
}

const RutaPrivada = ({ children }: RutaPrivadaProps) => {
  const auth = useContext(AuthContext);

  if (!auth) {
    return <div>Cargando...</div>;
  }
  
  if (auth.cargando) {
    return <div>Cargando...</div>;
  }

  return auth.estaAutenticado ? <>{children}</> : <Navigate to="/login" />;
};

export default RutaPrivada;
