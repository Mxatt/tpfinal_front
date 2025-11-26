import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { SettingsContext } from "../context/SettingsContext";
import FormularioAgregarInversion from "../Components/FormularioAgregarInversion";

const PaginaInversiones: React.FC = () => {
  const navegar = useNavigate();
  const auth = useContext(AuthContext);
  const settingsContext = useContext(SettingsContext);

  if (!settingsContext) return null;
  const { settings } = settingsContext;

  const manejarInversionAgregada = () => {
    auth?.actualizarUsuario();
  };

  return (
    <div className="flex-1 flex flex-col items-center p-4">
      <div className="w-full max-w-4xl flex justify-between items-center mb-6">
        <h1
          className={`text-3xl font-bold ${
            settings.theme === "dark" ? "text-white" : "text-black"
          }`}
        >
          Crear Inversión
        </h1>
        <button
          onClick={() => navegar(-1)}
          className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded transition-colors btn-animated"
        >
          Volver
        </button>
      </div>

      <div
        className={`w-full max-w-4xl rounded-lg shadow-lg p-6 mb-6 ${
          settings.theme === "dark"
            ? "bg-black/20 backdrop-blur-lg"
            : "bg-white"
        }`}
      >
        <h2
          className={`text-xl font-semibold mb-4 ${
            settings.theme === "dark" ? "text-white" : "text-black"
          }`}
        >
          Agregar Nueva Inversión
        </h2>
        <FormularioAgregarInversion
          onInversionAgregada={manejarInversionAgregada}
        />
      </div>
    </div>
  );
};

export default PaginaInversiones;
