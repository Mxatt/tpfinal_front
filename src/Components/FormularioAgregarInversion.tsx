import React, { useState, useEffect, useContext } from "react";
import api from "../services/api";
import { SettingsContext } from "../context/SettingsContext";

interface PropsFormularioAgregarInversion {
  onInversionAgregada: () => void;
}

const FormularioAgregarInversion: React.FC<PropsFormularioAgregarInversion> = ({
  onInversionAgregada,
}) => {
  const [nombre, setNombre] = useState("");
  const [montoInicial, setMontoInicial] = useState("");
  const [porcentajeRetornoAnual, setPorcentajeRetornoAnual] = useState("");
  const [tiempoInversion, setTiempoInversion] = useState("");
  const [tipoInversion, setTipoInversion] = useState("");
  const [enlaceInversion, setEnlaceInversion] = useState("");
  const [montoRetornoEsperado, setMontoRetornoEsperado] = useState(0);
  const [error, setError] = useState("");
  const [exito, setExito] = useState("");
  const settingsContext = useContext(SettingsContext);

  if (!settingsContext) return null;
  const { settings } = settingsContext;

  useEffect(() => {
    const montoInicialNum = parseFloat(montoInicial);
    const porcentajeRetornoNum = parseFloat(porcentajeRetornoAnual);
    const tiempoNum = parseFloat(tiempoInversion);

    if (
      !isNaN(montoInicialNum) &&
      !isNaN(porcentajeRetornoNum) &&
      !isNaN(tiempoNum) &&
      montoInicialNum > 0 &&
      porcentajeRetornoNum > 0 &&
      tiempoNum > 0
    ) {
      const retornoCalculado =
        montoInicialNum * (1 + (porcentajeRetornoNum / 100 / 12) * tiempoNum);
      setMontoRetornoEsperado(parseFloat(retornoCalculado.toFixed(2)));
    } else {
      setMontoRetornoEsperado(0);
    }
  }, [montoInicial, porcentajeRetornoAnual, tiempoInversion]);

  const manejarEnvio = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setExito("");

    if (
      !nombre ||
      parseFloat(montoInicial) <= 0 ||
      parseFloat(porcentajeRetornoAnual) <= 0 ||
      parseFloat(tiempoInversion) <= 0 ||
      !tipoInversion
    ) {
      setError(
        "Por favor, completa todos los campos obligatorios con valores válidos."
      );
      return;
    }

    try {
      await api.post("/investments", {
        nombre,
        montoInicial: parseFloat(montoInicial),
        porcentajeRetornoAnual: parseFloat(porcentajeRetornoAnual),
        tiempoInversion: parseFloat(tiempoInversion),
        tipoInversion,
        enlaceInversion: enlaceInversion || undefined,
        montoRetornoEsperado,
      });
      setExito("¡Inversión agregada exitosamente!");
      setNombre("");
      setMontoInicial("");
      setPorcentajeRetornoAnual("");
      setTiempoInversion("");
      setTipoInversion("");
      setEnlaceInversion("");
      setMontoRetornoEsperado(0);
      onInversionAgregada();
      setTimeout(() => setExito(""), 3000);
    } catch (err: any) {
      setError(err.response?.data?.msg || "Fallo al agregar la inversión.");
      console.error(err);
    }
  };

  return (
    <div
      className={`w-full p-8 space-y-6 rounded-lg shadow-md ${
        settings.theme === "dark" ? "bg-black/20 backdrop-blur-lg" : "bg-white"
      }`}
    >
      <form onSubmit={manejarEnvio} className="space-y-4">
        {error && <p className="text-red-400 text-sm text-center">{error}</p>}
        {exito && <p className="text-green-400 text-sm text-center">{exito}</p>}

        <div>
          <label
            className={`block text-sm font-medium ${
              settings.theme === "dark" ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Nombre de la Inversión
          </label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className={`w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 ${
              settings.theme === "dark"
                ? "bg-white/10 text-white border-gray-600"
                : "bg-gray-50 text-black border-gray-300"
            }`}
            required
          />
        </div>
        <div>
          <label
            className={`block text-sm font-medium ${
              settings.theme === "dark" ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Monto Inicial
          </label>
          <input
            type="number"
            step="0.01"
            value={montoInicial}
            onChange={(e) => setMontoInicial(e.target.value)}
            className={`w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 ${
              settings.theme === "dark"
                ? "bg-white/10 text-white border-gray-600"
                : "bg-gray-50 text-black border-gray-300"
            }`}
            required
          />
        </div>
        <div>
          <label
            className={`block text-sm font-medium ${
              settings.theme === "dark" ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Porcentaje de Retorno Anual (%)
          </label>
          <input
            type="number"
            step="0.01"
            value={porcentajeRetornoAnual}
            onChange={(e) => setPorcentajeRetornoAnual(e.target.value)}
            className={`w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 ${
              settings.theme === "dark"
                ? "bg-white/10 text-white border-gray-600"
                : "bg-gray-50 text-black border-gray-300"
            }`}
            required
          />
        </div>
        <div>
          <label
            className={`block text-sm font-medium ${
              settings.theme === "dark" ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Tiempo de Inversión (en meses)
          </label>
          <input
            type="number"
            step="1"
            value={tiempoInversion}
            onChange={(e) => setTiempoInversion(e.target.value)}
            className={`w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 ${
              settings.theme === "dark"
                ? "bg-white/10 text-white border-gray-600"
                : "bg-gray-50 text-black border-gray-300"
            }`}
            required
          />
        </div>
        <div>
          <label
            className={`block text-sm font-medium ${
              settings.theme === "dark" ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Tipo de Inversión
          </label>
          <input
            type="text"
            value={tipoInversion}
            onChange={(e) => setTipoInversion(e.target.value)}
            placeholder="ej., Acciones, Cripto, Bonos"
            className={`w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 ${
              settings.theme === "dark"
                ? "bg-white/10 text-white border-gray-600"
                : "bg-gray-50 text-black border-gray-300"
            }`}
            required
          />
        </div>
        <div>
          <label
            className={`block text-sm font-medium ${
              settings.theme === "dark" ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Enlace de la Inversión (Opcional)
          </label>
          <input
            type="url"
            value={enlaceInversion}
            onChange={(e) => setEnlaceInversion(e.target.value)}
            className={`w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 ${
              settings.theme === "dark"
                ? "bg-white/10 text-white border-gray-600"
                : "bg-gray-50 text-black border-gray-300"
            }`}
          />
        </div>
        <div className="text-center">
          <p
            className={`text-sm font-medium ${
              settings.theme === "dark" ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Retorno Esperado:
          </p>
          <p
            className={`text-xl font-bold ${
              settings.theme === "dark" ? "text-white" : "text-black"
            }`}
          >
            ${montoRetornoEsperado.toFixed(2)}
          </p>
        </div>
        <button
          type="submit"
          className="w-full py-2 text-white bg-purple-600 hover:bg-purple-700 rounded-md transition-colors cursor-pointer btn-animated"
        >
          Agregar Inversión
        </button>
      </form>
    </div>
  );
};

export default FormularioAgregarInversion;
