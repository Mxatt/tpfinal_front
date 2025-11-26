import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { SettingsContext } from "../context/SettingsContext";

interface Inversion {
  _id: string;
  nombre: string;
  montoInicial: number;
  montoActual: number;
  porcentajeRetornoAnual: number;
  tiempoInversion: number;
  tipoInversion: string;
  enlaceInversion?: string;
  montoRetornoEsperado: number;
  estado: "active" | "withdrawn" | "deleted";
  fechaCreacion: string;
}

interface PropsDialogoRetiro {
  estaAbierto: boolean;
  alCerrar: () => void;
  alConfirmar: (resultado: { cantidad: number }) => void;
  inversion: Inversion | null;
}

interface PropsDialogoConfirmacion {
  estaAbierto: boolean;
  alCerrar: () => void;
  alConfirmar: () => void;
  mensaje: string;
}

interface PropsDialogoEditar {
  estaAbierto: boolean;
  alCerrar: () => void;
  alConfirmar: (datos: Partial<Inversion>) => void;
  inversion: Inversion | null;
}

const DialogoRetiroInversion: React.FC<PropsDialogoRetiro> = ({
  estaAbierto,
  alCerrar,
  alConfirmar,
  inversion,
}) => {
  const [cantidad, setCantidad] = useState<string>("");
  const [errorLocal, setErrorLocal] = useState<string | null>(null);

  useEffect(() => {
    if (estaAbierto) {
      setCantidad("");
      setErrorLocal(null);
    }
  }, [estaAbierto]);

  const manejarConfirmacion = () => {
    const cantidadParseada = parseFloat(cantidad);
    if (isNaN(cantidadParseada) || cantidadParseada <= 0) {
      setErrorLocal("Por favor, introduce un monto válido y positivo.");
      return;
    }
    alConfirmar({ cantidad: cantidadParseada });
    alCerrar();
  };

  const formatearNumero = (num: number) => {
    return num.toFixed(0);
  };

  if (!estaAbierto) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4">
      <div className="bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-sm">
        <h3 className="text-xl font-bold text-white mb-4">
          Retirar Inversión: {inversion?.nombre}
        </h3>
        {errorLocal && (
          <p className="text-red-400 text-sm mb-4">{errorLocal}</p>
        )}

        <div className="mb-4">
          <p className="text-gray-300 mb-2">
            Monto inicial: ${formatearNumero(inversion?.montoInicial || 0)}
          </p>
        </div>

        <label className="block text-sm font-medium text-gray-300 mb-1">
          Monto de retiro:
        </label>
        <input
          type="number"
          step="0.01"
          value={cantidad}
          onChange={(e) => setCantidad(e.target.value)}
          className="w-full px-3 py-2 mt-1 text-white bg-white/10 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 mb-4"
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={alCerrar}
            className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded transition-colors btn-animated"
          >
            Cancelar
          </button>
          <button
            onClick={manejarConfirmacion}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors btn-animated"
          >
            Confirmar Retiro
          </button>
        </div>
      </div>
    </div>
  );
};

const DialogoConfirmacion: React.FC<PropsDialogoConfirmacion> = ({
  estaAbierto,
  alCerrar,
  alConfirmar,
  mensaje,
}) => {
  if (!estaAbierto) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4">
      <div className="bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-sm">
        <h3 className="text-xl font-bold text-white mb-4">Confirmar Acción</h3>
        <p className="text-gray-300 mb-4">{mensaje}</p>
        <div className="flex justify-end gap-2">
          <button
            onClick={alCerrar}
            className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded transition-colors btn-animated"
          >
            Cancelar
          </button>
          <button
            onClick={alConfirmar}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors btn-animated"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

const DialogoEditarInversion: React.FC<PropsDialogoEditar> = ({
  estaAbierto,
  alCerrar,
  alConfirmar,
  inversion,
}) => {
  const [nombre, setNombre] = useState("");
  const [montoInicial, setMontoInicial] = useState("");
  const [porcentajeRetornoAnual, setPorcentajeRetornoAnual] = useState("");
  const [tiempoInversion, setTiempoInversion] = useState("");
  const [tipoInversion, setTipoInversion] = useState("");
  const [enlaceInversion, setEnlaceInversion] = useState("");
  const [errorLocal, setErrorLocal] = useState<string | null>(null);

  useEffect(() => {
    if (estaAbierto && inversion) {
      setNombre(inversion.nombre);
      setMontoInicial(inversion.montoInicial.toString());
      setPorcentajeRetornoAnual(inversion.porcentajeRetornoAnual.toString());
      setTiempoInversion(inversion.tiempoInversion.toString());
      setTipoInversion(inversion.tipoInversion);
      setEnlaceInversion(inversion.enlaceInversion || "");
      setErrorLocal(null);
    }
  }, [estaAbierto, inversion]);

  const manejarConfirmacion = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !nombre ||
      parseFloat(montoInicial) <= 0 ||
      parseFloat(porcentajeRetornoAnual) <= 0 ||
      parseFloat(tiempoInversion) <= 0 ||
      !tipoInversion
    ) {
      setErrorLocal(
        "Por favor, completa todos los campos obligatorios con valores válidos."
      );
      return;
    }

    alConfirmar({
      nombre,
      montoInicial: parseFloat(montoInicial),
      porcentajeRetornoAnual: parseFloat(porcentajeRetornoAnual),
      tiempoInversion: parseFloat(tiempoInversion),
      tipoInversion,
      enlaceInversion: enlaceInversion || undefined,
    });
    alCerrar();
  };

  if (!estaAbierto) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4">
      <div className="bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-bold text-white mb-4">Editar Inversión</h3>
        {errorLocal && (
          <p className="text-red-400 text-sm mb-4">{errorLocal}</p>
        )}
        <form onSubmit={manejarConfirmacion} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Nombre
            </label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full px-3 py-2 mt-1 text-white bg-white/10 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Monto Inicial
            </label>
            <input
              type="number"
              step="0.01"
              value={montoInicial}
              onChange={(e) => setMontoInicial(e.target.value)}
              className="w-full px-3 py-2 mt-1 text-white bg-white/10 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Retorno Anual (%)
            </label>
            <input
              type="number"
              step="0.01"
              value={porcentajeRetornoAnual}
              onChange={(e) => setPorcentajeRetornoAnual(e.target.value)}
              className="w-full px-3 py-2 mt-1 text-white bg-white/10 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Tiempo (meses)
            </label>
            <input
              type="number"
              step="1"
              value={tiempoInversion}
              onChange={(e) => setTiempoInversion(e.target.value)}
              className="w-full px-3 py-2 mt-1 text-white bg-white/10 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Tipo
            </label>
            <input
              type="text"
              value={tipoInversion}
              onChange={(e) => setTipoInversion(e.target.value)}
              className="w-full px-3 py-2 mt-1 text-white bg-white/10 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Enlace (Opcional)
            </label>
            <input
              type="url"
              value={enlaceInversion}
              onChange={(e) => setEnlaceInversion(e.target.value)}
              className="w-full px-3 py-2 mt-1 text-white bg-white/10 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={alCerrar}
              className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded transition-colors btn-animated"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors btn-animated"
            >
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const PaginaInversionesActivas: React.FC = () => {
  const navegar = useNavigate();
  const [inversiones, setInversiones] = useState<Inversion[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const auth = useContext(AuthContext);
  const contextoConfiguracion = useContext(SettingsContext);

  const [dialogoRetiroAbierto, setDialogoRetiroAbierto] = useState(false);
  const [dialogoEdicionAbierto, setDialogoEdicionAbierto] = useState(false);
  const [inversionSeleccionada, setInversionSeleccionada] =
    useState<Inversion | null>(null);
  const [dialogoBorradoAbierto, setDialogoBorradoAbierto] = useState(false);
  const [idInversionABorrar, setIdInversionABorrar] = useState<string | null>(
    null
  );

  if (!contextoConfiguracion) {
    return null;
  }

  const { settings: configuracion } = contextoConfiguracion;

  const obtenerSimboloMoneda = (moneda: string) => {
    switch (moneda) {
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

  const formatearNumero = (num: number) => {
    return num.toFixed(0);
  };

  const iniciarRetiro = (inversion: Inversion) => {
    setInversionSeleccionada(inversion);
    setDialogoRetiroAbierto(true);
  };

  const iniciarEdicion = (inversion: Inversion) => {
    setInversionSeleccionada(inversion);
    setDialogoEdicionAbierto(true);
  };

  const confirmarEdicion = async (datosActualizados: Partial<Inversion>) => {
    if (!inversionSeleccionada) return;

    try {
      await api.put(
        `/investments/${inversionSeleccionada._id}`,
        datosActualizados
      );
      auth?.actualizarUsuario();
      const respuesta = await api.get("/investments");
      setInversiones(respuesta.data);
    } catch (err: any) {
      setError(err.response?.data?.msg || "Fallo al editar la inversión.");
      console.error(err);
    } finally {
      setDialogoEdicionAbierto(false);
      setInversionSeleccionada(null);
    }
  };

  const confirmarRetiro = async (resultado: { cantidad: number }) => {
    if (!inversionSeleccionada) return;

    try {
      await api.put(`/investments/${inversionSeleccionada._id}/withdraw`, {
        amount: resultado.cantidad,
      });
      auth?.actualizarUsuario();
      const respuesta = await api.get("/investments");
      setInversiones(respuesta.data);
    } catch (err: any) {
      if (
        err.response &&
        err.response.data &&
        err.response.data.errors &&
        err.response.data.errors.length > 0
      ) {
        setError(err.response.data.errors[0].msg);
      } else {
        setError(
          err.response?.data?.mensaje ||
            err.response?.data?.msg ||
            "Fallo al retirar la inversión."
        );
      }
      console.error(err);
    } finally {
      setDialogoRetiroAbierto(false);
      setInversionSeleccionada(null);
    }
  };

  const iniciarBorrado = (id: string) => {
    setIdInversionABorrar(id);
    setDialogoBorradoAbierto(true);
  };

  const confirmarBorradoInversion = async () => {
    if (!idInversionABorrar) return;
    try {
      await api.delete(`/investments/${idInversionABorrar}`);
      auth?.actualizarUsuario();
      const respuesta = await api.get("/investments");
      setInversiones(respuesta.data);
    } catch (err: any) {
      setError(err.response?.data?.msg || "Fallo al borrar la inversión.");
      console.error(err);
    } finally {
      setDialogoBorradoAbierto(false);
      setIdInversionABorrar(null);
    }
  };

  useEffect(() => {
    const obtenerInversiones = async () => {
      try {
        setCargando(true);
        const respuesta = await api.get("/investments");
        setInversiones(respuesta.data);
      } catch (err) {
        setError("Fallo al cargar las inversiones.");
        console.error(err);
      } finally {
        setCargando(false);
      }
    };

    obtenerInversiones();
  }, []);

  return (
    <div className="flex-1 flex flex-col items-center p-4">
      {dialogoRetiroAbierto && (
        <DialogoRetiroInversion
          estaAbierto={dialogoRetiroAbierto}
          alCerrar={() => setDialogoRetiroAbierto(false)}
          alConfirmar={confirmarRetiro}
          inversion={inversionSeleccionada}
        />
      )}
      {dialogoEdicionAbierto && (
        <DialogoEditarInversion
          estaAbierto={dialogoEdicionAbierto}
          alCerrar={() => setDialogoEdicionAbierto(false)}
          alConfirmar={confirmarEdicion}
          inversion={inversionSeleccionada}
        />
      )}
      {dialogoBorradoAbierto && (
        <DialogoConfirmacion
          estaAbierto={dialogoBorradoAbierto}
          alCerrar={() => setDialogoBorradoAbierto(false)}
          alConfirmar={confirmarBorradoInversion}
          mensaje="¿Estás seguro de que quieres borrar esta inversión? Esta acción no se puede deshacer."
        />
      )}
      <div className="w-full max-w-4xl flex justify-between items-center mb-6">
        <h1
          className={`text-3xl font-bold ${
            configuracion.theme === "dark" ? "text-white" : "text-black"
          }`}
        >
          Inversiones Activas
        </h1>
        <button
          onClick={() => navegar(-1)}
          className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded transition-colors btn-animated"
        >
          Volver
        </button>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div
        className={`w-full max-w-4xl rounded-lg shadow-lg p-6 ${
          configuracion.theme === "dark"
            ? "bg-black/20 backdrop-blur-lg"
            : "bg-white"
        }`}
      >
        <h2
          className={`text-xl font-semibold mb-4 ${
            configuracion.theme === "dark" ? "text-white" : "text-black"
          }`}
        >
          Inversiones Activas
        </h2>
        {cargando ? (
          <p
            className={`${
              configuracion.theme === "dark" ? "text-white" : "text-black"
            }`}
          >
            Cargando inversiones...
          </p>
        ) : inversiones.length === 0 ? (
          <p
            className={`${
              configuracion.theme === "dark" ? "text-white" : "text-black"
            }`}
          >
            No tienes inversiones activas.
          </p>
        ) : (
          <div className="space-y-4">
            {inversiones.map((inv) => (
              <div
                key={inv._id}
                className={`p-4 rounded-md flex flex-col md:flex-row justify-between items-start md:items-center ${
                  configuracion.theme === "dark" ? "bg-white/5" : "bg-gray-50"
                }`}
              >
                <div>
                  <h3
                    className={`text-lg font-bold ${
                      configuracion.theme === "dark"
                        ? "text-white"
                        : "text-black"
                    }`}
                  >
                    {inv.nombre}
                  </h3>
                  <p
                    className={`${
                      configuracion.theme === "dark"
                        ? "text-gray-300"
                        : "text-gray-600"
                    }`}
                  >
                    Monto Inicial:{" "}
                    {obtenerSimboloMoneda(configuracion.currency)}
                    {formatearNumero(inv.montoInicial)}
                  </p>
                  <p className="text-300 text-green-400">
                    Monto Actual: {obtenerSimboloMoneda(configuracion.currency)}
                    {formatearNumero(inv.montoActual)}
                  </p>
                  <p
                    className={`${
                      configuracion.theme === "dark"
                        ? "text-gray-300"
                        : "text-gray-600"
                    }`}
                  >
                    Retorno Anual: {inv.porcentajeRetornoAnual}%
                  </p>
                  <p
                    className={`${
                      configuracion.theme === "dark"
                        ? "text-gray-300"
                        : "text-gray-600"
                    }`}
                  >
                    Tiempo de Inversión: {inv.tiempoInversion} meses
                  </p>
                  <p
                    className={`${
                      configuracion.theme === "dark"
                        ? "text-gray-300"
                        : "text-gray-600"
                    }`}
                  >
                    Tipo: {inv.tipoInversion}
                  </p>
                  <p
                    className={`${
                      configuracion.theme === "dark"
                        ? "text-gray-300"
                        : "text-gray-600"
                    }`}
                  >
                    Retorno Esperado:{" "}
                    {obtenerSimboloMoneda(configuracion.currency)}
                    {formatearNumero(inv.montoRetornoEsperado)}
                  </p>
                  {inv.enlaceInversion && (
                    <p
                      className={`${
                        configuracion.theme === "dark"
                          ? "text-gray-300"
                          : "text-gray-600"
                      }`}
                    >
                      Enlace:{" "}
                      <a
                        href={inv.enlaceInversion}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-400 hover:underline"
                      >
                        Ver
                      </a>
                    </p>
                  )}
                </div>
                <div className="flex gap-2 mt-4 md:mt-0">
                  <button
                    onClick={() => iniciarEdicion(inv)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors btn-animated"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => iniciarRetiro(inv)}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors btn-animated"
                  >
                    Retirar
                  </button>
                  <button
                    onClick={() => iniciarBorrado(inv._id)}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors btn-animated"
                  >
                    Borrar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PaginaInversionesActivas;
