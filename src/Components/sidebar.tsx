import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { SettingsContext } from "../context/SettingsContext";
import {
  Menu,
  X,
  DollarSign,
  Calculator,
  History,
  Settings,
  LogOut,
  Briefcase,
  Home,
} from "lucide-react";

type ClaveItemNavegacion = "principal" | "crear-inversion" | "inversiones-activas" | "calculadora" | "historial" | "configuracion";

const itemsNavegacion: { clave: ClaveItemNavegacion; etiqueta: string; ruta: string }[] = [
  { clave: "principal", etiqueta: "Pantalla Principal", ruta: "/" },
  { clave: "crear-inversion", etiqueta: "Crear Inversión", ruta: "/inversiones" },
  { clave: "inversiones-activas", etiqueta: "Inversiones Activas", ruta: "/inversiones-activas" },
  { clave: "calculadora", etiqueta: "Calculadora", ruta: "/calculadora" },
  { clave: "historial", etiqueta: "Historial", ruta: "/historial" },
];

const MapaIconos: Record<ClaveItemNavegacion, React.ElementType> = {
  principal: Home,
  "crear-inversion": DollarSign,
  "inversiones-activas": Briefcase,
  calculadora: Calculator,
  historial: History,
  configuracion: Settings,
};

interface PropsBotonNav {
  etiqueta: string;
  icono: React.ElementType;
  estaAbierto: boolean;
  ruta?: string;
  alHacerClick?: () => void;
  tema: 'light' | 'dark';
}

const ContenidoBotonNav: React.FC<{
  etiqueta: string;
  icono: React.ElementType;
  estaAbierto: boolean;
}> = ({ etiqueta, icono: Icono, estaAbierto }) => (
  <>
    <Icono size={20} />
    <p
      className={`
        capitalize text-sm leading-none whitespace-nowrap
        transition-all duration-300
        ${
          estaAbierto
            ? "opacity-100"
            : "opacity-0 pointer-events-none absolute left-full ml-3"
        }
      `}
    >
      {etiqueta}
    </p>
  </>
);

const BotonNav: React.FC<PropsBotonNav> = ({ etiqueta, icono, estaAbierto, ruta, alHacerClick, tema }) => {
  const clase = `
    group relative flex items-center gap-3 h-11 px-3 rounded-lg ${tema === 'dark' ? 'text-neutral-100 hover:bg-white/10' : 'text-black hover:bg-black/5'}
    opacity-80 hover:opacity-100
    transition-all duration-300
    ${estaAbierto ? "w-full" : "w-11"}
    active:scale-95
  `;

  if (ruta) {
    return (
      <Link to={ruta} className={clase}>
        <ContenidoBotonNav etiqueta={etiqueta} icono={icono} estaAbierto={estaAbierto} />
      </Link>
    );
  }

  return (
    <button type="button" className={clase} onClick={alHacerClick}>
      <ContenidoBotonNav etiqueta={etiqueta} icono={icono} estaAbierto={estaAbierto} />
    </button>
  );
};

export default function Sidebar() {
  const [estaAbierto, setEstaAbierto] = useState<boolean>(false);
  const auth = useContext(AuthContext);
  const contextoConfiguracion = useContext(SettingsContext);

  if (!auth || !contextoConfiguracion) {
    return null;
  }
  
  const { settings: configuracion } = contextoConfiguracion;

  return (
    <aside
      className={`
        relative z-20 h-screen md:h-[calc(100vh-40px)] md:m-5 bg-black/10 backdrop-blur-lg md:rounded-2xl
        transition-[width] duration-450ms ease-in-out font-sans overflow-hidden
        ${estaAbierto ? "w-[190px]" : "w-14"}
        flex-shrink-0
      `}
    >
      <div className="absolute top-0 left-0 h-full w-[190px] flex flex-col">
        <header className="flex items-center h-16 px-1.5">
          <button
            type="button"
            className={`grid place-items-center w-11 h-11 ${configuracion.theme === 'dark' ? 'text-neutral-100' : 'text-black'} rounded-md hover:bg-white/10 transition-colors`}
            onClick={() => setEstaAbierto(!estaAbierto)}
          >
            {estaAbierto ? <X size={20} /> : <Menu size={20} />}
          </button>
        </header>

        <nav className="flex-1 flex flex-col px-1.5 gap-0.5">
          {itemsNavegacion.map((item) => (
            <BotonNav
              key={item.clave}
              etiqueta={item.etiqueta}
              icono={MapaIconos[item.clave]}
              estaAbierto={estaAbierto}
              ruta={item.ruta}
              tema={configuracion.theme}
            />
          ))}
          <div className="mt-auto mb-2 flex flex-col gap-0.5">
            <BotonNav
              etiqueta="Configuración"
              icono={Settings}
              estaAbierto={estaAbierto}
              ruta="/settings"
              tema={configuracion.theme}
            />
            <BotonNav
              etiqueta="Cerrar Sesión"
              icono={LogOut}
              estaAbierto={estaAbierto}
              alHacerClick={auth.cerrarSesion}
              tema={configuracion.theme}
            />
          </div>
        </nav>
      </div>
    </aside>
  );
}