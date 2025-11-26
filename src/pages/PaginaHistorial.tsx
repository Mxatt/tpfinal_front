import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { SettingsContext } from "../context/SettingsContext";

interface HistoryEntry {
  _id: string;
  nombreInversion: string;
  tipoEvento: "creacion" | "deposito" | "retiro" | "eliminacion";
  montoAfectado: number;
  fechaEvento: string;
  gananciaPorcentaje?: number;
}

const PaginaHistorial: React.FC = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const settingsContext = useContext(SettingsContext);

  if (!settingsContext) {
    return null;
  }

  const { settings } = settingsContext;

  const getCurrencySymbol = (currency: string) => {
    switch (currency) {
      case "USD":
        return "$";
      case "EUR":
        return "€";
      case "ARS":
        return "$";
      default:
        return "$";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (settings.timeFormat === "12h") {
      return date.toLocaleString("en-US", {
        dateStyle: "short",
        timeStyle: "short",
      });
    }
    return date.toLocaleString("en-GB", {
      dateStyle: "short",
      timeStyle: "short",
    });
  };

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const respuesta = await api.get("/investments/history");
        setHistory(respuesta.data);
      } catch (err) {
        setError("Fallo al cargar el historial.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const formatNumber = (num: number) => {
    return num.toFixed(0);
  };

  const getMontoColor = (monto: number, tipo: string) => {
    if (tipo === "retiro") {
      return monto >= 0 ? "text-green-400" : "text-red-400";
    }
    if (
      tipo === "creacion" ||
      tipo === "deposito" ||
      (tipo === "eliminacion" && monto > 0)
    ) {
      return "text-green-400";
    }
    return "text-red-400";
  };

  return (
    <div className="flex-1 flex flex-col items-center p-4">
      <div className="w-full max-w-4xl flex justify-between items-center mb-6">
        <h1
          className={`text-3xl font-bold ${
            settings.theme === "dark" ? "text-white" : "text-black"
          }`}
        >
          Historial de Transacciones
        </h1>
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded transition-colors"
        >
          Volver
        </button>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div
        className={`w-full max-w-4xl rounded-lg shadow-lg p-6 ${
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
          Actividad Reciente
        </h2>
        {loading ? (
          <p
            className={`${
              settings.theme === "dark" ? "text-white" : "text-black"
            }`}
          >
            Cargando historial...
          </p>
        ) : history.length === 0 ? (
          <p
            className={`${
              settings.theme === "dark" ? "text-white" : "text-black"
            }`}
          >
            No hay registros en el historial.
          </p>
        ) : (
          <div className="space-y-4">
            {history.map((entry) => (
              <div
                key={entry._id}
                className={`p-4 rounded-md flex flex-col md:flex-row justify-between items-start md:items-center ${
                  settings.theme === "dark" ? "bg-white/5" : "bg-gray-50"
                }`}
              >
                <div>
                  <p
                    className={`${
                      settings.theme === "dark"
                        ? "text-gray-300"
                        : "text-gray-600"
                    } text-sm`}
                  >
                    {formatDate(entry.fechaEvento)}
                  </p>
                  <h3
                    className={`text-lg font-bold ${
                      settings.theme === "dark" ? "text-white" : "text-black"
                    }`}
                  >
                    {entry.nombreInversion}
                  </h3>
                  <p
                    className={`${
                      settings.theme === "dark"
                        ? "text-gray-300"
                        : "text-gray-600"
                    }`}
                  >
                    Evento:{" "}
                    <span className="capitalize">{entry.tipoEvento}</span>
                  </p>
                </div>
                <div className="text-right mt-4 md:mt-0">
                  <p
                    className={`text-xl font-bold ${getMontoColor(
                      entry.montoAfectado,
                      entry.tipoEvento
                    )}`}
                  >
                    {entry.tipoEvento === "retiro" && entry.montoAfectado > 0
                      ? `+`
                      : ""}
                    {entry.tipoEvento === "retiro" && entry.montoAfectado < 0
                      ? `-`
                      : ""}
                    {entry.tipoEvento === "creacion" ? `+` : ""}
                    {entry.tipoEvento === "eliminacion" &&
                    entry.montoAfectado > 0
                      ? `+`
                      : ""}
                    {getCurrencySymbol(settings.currency)}
                    {formatNumber(Math.abs(entry.montoAfectado))}
                  </p>
                  {entry.gananciaPorcentaje !== undefined &&
                    entry.tipoEvento === "retiro" && (
                      <p
                        className={
                          entry.gananciaPorcentaje >= 0
                            ? "text-green-400"
                            : "text-red-400"
                        }
                      >
                        {entry.gananciaPorcentaje >= 0 ? "+" : ""}
                        {entry.gananciaPorcentaje.toFixed(2)}%
                      </p>
                    )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PaginaHistorial;
