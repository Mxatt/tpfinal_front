import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext.tsx';
import Sidebar from '../Components/sidebar.tsx';
import { SettingsContext } from '../context/SettingsContext.tsx';
import { Outlet } from 'react-router-dom';

function PantallaPrincipal() {
  const auth = useContext(AuthContext);
  const settingsContext = useContext(SettingsContext);

  if (!auth || !settingsContext) {
    return null;
  }

  const { cargando } = auth;
  const { settings } = settingsContext;

  if (cargando) {
    return <div className="text-white">Cargando datos del usuario...</div>;
  }

  return (
    <section className={`h-screen w-screen relative overflow-hidden font-sans ${settings.theme === 'dark' ? 'bg-[#17132a]' : 'bg-gray-100'}`}>
      <div className={`absolute inset-0 z-0 ${settings.theme === 'dark' ? 'bg-linear-to-t from-black/0 to-black/75' : ''}`} />

      <main className="relative z-10 flex flex-row h-screen">
        <Sidebar />
        <div className="flex-1 overflow-auto">
          <Outlet />
        </div>
      </main>
    </section>
  );
}

export default PantallaPrincipal;
