import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Inversion = () => {
  const auth = useContext(AuthContext);

  if (!auth) {
    return null; 
  }

  const { usuario, cargando } = auth;

  if (cargando) {
    return <div className="text-white">Cargando datos del usuario...</div>;
  }

  const formatNumber = (num: number) => {
    return num.toFixed(0);
  };

  return (
    <section className="text-white w-full flex flex-col items-center justify-center">
      <h3 className="text-2xl font-bold opacity-80">Dinero en Cuenta</h3>
      <span className="text-5xl font-bold tracking-tight">
        ${formatNumber(usuario?.totalInvertido || 0)}
      </span>

      <div className="mt-4 text-center">
        <h4 className="text-lg font-semibold opacity-60">Total Invertido</h4>
        <span className="text-xl">
          ${formatNumber(usuario?.totalInvertido || 0)}
        </span>
      </div>
    </section>
  );
};

export default Inversion;