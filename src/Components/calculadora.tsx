import React from "react";
import { useState, useMemo, type FC, useContext } from "react";
import { SettingsContext } from "../context/SettingsContext";
import GraficoReutilizable from "./GraficoReutilizable.tsx";

const formatearMoneda = (valor: number) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 2,
  }).format(valor);

const CONFIGS_LINEA_PLAZO_FIJO = [
  { dataKey: "Simple", name: "Interés Simple", color: "#3b82f6" },
  { dataKey: "Compuesto", name: "Interés Compuesto", color: "#10b981" },
];

function usarCalculadoraPlazoFijo() {
  const [monto, setMonto] = useState("100000");
  const [tasa, setTasa] = useState("110");
  const [plazo, setPlazo] = useState("30");
  const [conReinversion, setConReinversion] = useState(false);

  const { resultados, datosGrafico } = useMemo(() => {
    const montoAInvertir = parseFloat(monto) || 0;
    const tna = parseFloat(tasa) || 0;
    const duracionPlazo = parseInt(plazo, 10) || 30;

    const resultadoPorDefecto = {
      resultados: { interesGanadoUnPeriodo: 0, proyecciones: [] },
      datosGrafico: [],
    };

    if (montoAInvertir === 0 || tna === 0 || duracionPlazo === 0) {
      return resultadoPorDefecto;
    }

    const tasaDiaria = tna / 100 / 365;
    const tasaPorPeriodo = tasaDiaria * duracionPlazo;
    const interesGanadoUnPeriodo = montoAInvertir * tasaPorPeriodo;

    const periodosProyeccion = [
      { label: "En 1 mes", dias: 30 },
      { label: "En 3 meses", dias: 90 },
      { label: "En 6 meses", dias: 180 },
      { label: "En 1 año", dias: 365 },
    ];

    const proyecciones = periodosProyeccion.map((p) => {
      const numPeriodos = Math.floor(p.dias / duracionPlazo);
      if (numPeriodos === 0) {
        return { label: p.label, total: montoAInvertir, ganancia: 0 };
      }

      const totalCompuesto =
        montoAInvertir * Math.pow(1 + tasaPorPeriodo, numPeriodos);
      const gananciaCompuesta = totalCompuesto - montoAInvertir;

      const gananciaSimple = interesGanadoUnPeriodo * numPeriodos;
      const totalSimple = montoAInvertir + gananciaSimple;

      return conReinversion
        ? {
            label: p.label,
            total: totalCompuesto,
            ganancia: gananciaCompuesta,
          }
        : { label: p.label, total: totalSimple, ganancia: gananciaSimple };
    });

    const datosGrafico = Array.from({ length: 12 }, (_, i) => {
      const meses = i + 1;
      const dias = meses * 30;
      const numPeriodos = Math.floor(dias / duracionPlazo);

      const totalCompuesto =
        montoAInvertir * Math.pow(1 + tasaPorPeriodo, numPeriodos);
      const totalSimple = montoAInvertir + interesGanadoUnPeriodo * numPeriodos;

      return {
        name: `Mes ${meses}`,
        Simple: totalSimple,
        Compuesto: totalCompuesto,
      };
    });

    return {
      resultados: { interesGanadoUnPeriodo, proyecciones },
      datosGrafico,
    };
  }, [monto, tasa, plazo, conReinversion]);

  return {
    monto,
    setMonto,
    tasa,
    setTasa,
    plazo,
    setPlazo,
    conReinversion,
    setConReinversion,
    resultados,
    datosGrafico,
  };
}

interface PropsFormularioPlazoFijo {
  monto: string;
  setMonto: (value: string) => void;
  tasa: string;
  setTasa: (value: string) => void;
  plazo: string;
  setPlazo: (value: string) => void;
  conReinversion: boolean;
  setConReinversion: (value: boolean) => void;
}

const FormularioPlazoFijo: FC<PropsFormularioPlazoFijo> = ({
  monto,
  setMonto,
  tasa,
  setTasa,
  plazo,
  setPlazo,
  conReinversion,
  setConReinversion,
}) => {
  const settingsContext = useContext(SettingsContext);
  const settings = settingsContext?.settings || { theme: "dark" };

  return (
    <div className="w-full">
      <div className="mb-4">
        <label
          htmlFor="monto"
          className={`block mb-2 font-semibold ${
            settings.theme === "dark" ? "text-gray-200" : "text-gray-800"
          }`}
        >
          Monto a Invertir (ARS)
        </label>
        <input
          type="number"
          id="monto"
          className={`w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
            settings.theme === "dark"
              ? "bg-[#221d27] text-gray-200 border-gray-600"
              : "bg-white text-black border-gray-300"
          }`}
          value={monto}
          onChange={(e) => setMonto(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="tasa"
          className={`block mb-2 font-semibold ${
            settings.theme === "dark" ? "text-gray-200" : "text-gray-800"
          }`}
        >
          Tasa de Interés (TNA %)
        </label>
        <input
          type="number"
          id="tasa"
          className={`w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
            settings.theme === "dark"
              ? "bg-[#221d27] text-gray-200 border-gray-600"
              : "bg-white text-black border-gray-300"
          }`}
          value={tasa}
          onChange={(e) => setTasa(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="plazo"
          className={`block mb-2 font-semibold ${
            settings.theme === "dark" ? "text-gray-200" : "text-gray-800"
          }`}
        >
          Duración del Plazo Fijo (días)
        </label>
        <input
          type="number"
          id="plazo"
          className={`w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
            settings.theme === "dark"
              ? "bg-[#221d27] text-gray-200 border-gray-600"
              : "bg-white text-black border-gray-300"
          }`}
          value={plazo}
          onChange={(e) => setPlazo(e.target.value)}
        />
      </div>

      <div className="flex items-center mt-4 mb-6">
        <input
          type="checkbox"
          id="reinversion"
          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mr-2"
          checked={conReinversion}
          onChange={(e) => setConReinversion(e.target.checked)}
        />
        <label
          htmlFor="reinversion"
          className={`text-sm ${
            settings.theme === "dark" ? "text-gray-200" : "text-gray-800"
          }`}
        >
          Reinversión automática de ganancias (Interés Compuesto)
        </label>
      </div>
    </div>
  );
};

interface PropsResultadosPlazoFijo {
  resultados: {
    interesGanadoUnPeriodo: number;
    proyecciones: { label: string; total: number; ganancia: number }[];
  };
  plazo: string;
  conReinversion: boolean;
}

const ResultadosPlazoFijo: FC<PropsResultadosPlazoFijo> = ({
  resultados,
  plazo,
  conReinversion,
}) => {
  const settingsContext = useContext(SettingsContext);
  const settings = settingsContext?.settings || { theme: "dark" };

  return (
    <div className="w-full mt-6 lg:mt-0">
      <div
        className={`p-4 rounded-lg border shadow-sm ${
          settings.theme === "dark"
            ? "bg-white/5 border-gray-700"
            : "bg-gray-100 border-gray-200"
        }`}
      >
        <div className="text-3xl font-bold text-green-600 mb-1">
          {formatearMoneda(resultados.interesGanadoUnPeriodo)}
        </div>
        <div
          className={`text-sm mb-4 ${
            settings.theme === "dark" ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Interés ganado en 1 período de {plazo || 0} días
        </div>

        <div
          className={`mt-4 border-t pt-4 ${
            settings.theme === "dark" ? "border-gray-600" : "border-gray-300"
          }`}
        >
          <div
            className={`text-sm font-semibold mb-2 ${
              settings.theme === "dark" ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Proyección de tu inversión (con interés{" "}
            {conReinversion ? "compuesto" : "simple"})
          </div>
          <ul className="list-none p-0 m-0">
            {resultados.proyecciones.map((p) => (
              <li
                key={p.label}
                className={`flex flex-wrap justify-between text-sm py-2 border-b last:border-b-0 ${
                  settings.theme === "dark"
                    ? "text-gray-400 border-gray-700"
                    : "text-gray-600 border-gray-300"
                }`}
              >
                <span>
                  <span
                    className={`font-semibold ${
                      settings.theme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {p.label}:
                  </span>{" "}
                  Total {formatearMoneda(p.total)}
                </span>
                <span
                  className={`${
                    settings.theme === "dark"
                      ? "text-gray-500"
                      : "text-gray-500"
                  }`}
                >
                  (Ganancia: {formatearMoneda(p.ganancia)})
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

interface PropsGraficoPlazoFijo {
  datosGrafico: any[];
}

const GraficoPlazoFijo: FC<PropsGraficoPlazoFijo> = ({ datosGrafico }) => {
  const settingsContext = useContext(SettingsContext);
  const settings = settingsContext?.settings || { theme: "dark" };

  return (
    <div className="lg:w-1/2 mt-8 lg:mt-0 flex flex-col justify-center">
      <h3
        className={`text-xl font-bold mb-4 ${
          settings.theme === "dark" ? "text-gray-200" : "text-gray-800"
        }`}
      >
        Proyección Anual
      </h3>
      <div
        className={`p-4 rounded-lg shadow-md ${
          settings.theme === "dark" ? "bg-white/10" : "bg-white"
        }`}
      >
        <GraficoReutilizable
          data={datosGrafico}
          lines={CONFIGS_LINEA_PLAZO_FIJO}
          yAxisFormatter={formatearMoneda}
          tooltipFormatter={(value) => formatearMoneda(value as number)}
        />
      </div>
    </div>
  );
};

interface PropsCalculadoraInversion {
  headerFormulario: React.ReactNode;
}

function CalculadoraPlazoFijo({ headerFormulario }: PropsCalculadoraInversion) {
  const {
    monto,
    setMonto,
    tasa,
    setTasa,
    plazo,
    setPlazo,
    conReinversion,
    setConReinversion,
    resultados,
    datosGrafico,
  } = usarCalculadoraPlazoFijo();

  return (
    <section className="w-full">
      <div className="w-full flex flex-col lg:flex-row lg:gap-8">
        <div className="lg:w-1/2 flex flex-col gap-6">
          {headerFormulario}

          <FormularioPlazoFijo
            monto={monto}
            setMonto={setMonto}
            tasa={tasa}
            setTasa={setTasa}
            plazo={plazo}
            setPlazo={setPlazo}
            conReinversion={conReinversion}
            setConReinversion={setConReinversion}
          />
          <ResultadosPlazoFijo
            resultados={resultados}
            plazo={plazo}
            conReinversion={conReinversion}
          />
        </div>

        <GraficoPlazoFijo datosGrafico={datosGrafico} />
      </div>
    </section>
  );
}

const CalculadoraPlaceholder: FC<{
  nombre: string;
  headerFormulario: React.ReactNode;
}> = ({ nombre, headerFormulario }) => (
  <>
    {headerFormulario}
    <div className="text-center text-gray-500 p-4">
      Calculadora de {nombre} (Próximamente)
    </div>
  </>
);

function Calculadora() {
  const [tipoInversion, setTipoInversion] = useState("plazoFijo");
  const settingsContext = useContext(SettingsContext);
  const settings = settingsContext?.settings || { theme: "dark" };

  const headerFormulario = (
    <div>
      <label
        htmlFor="tipoInversion"
        className={`block mb-2 font-semibold ${
          settings.theme === "dark" ? "text-gray-200" : "text-gray-800"
        }`}
      >
        Tipo de Inversión
      </label>
      <select
        id="tipoInversion"
        className={`w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
          settings.theme === "dark"
            ? "bg-[#221d27] text-gray-200 border-gray-600"
            : "bg-white text-black border-gray-300"
        }`}
        value={tipoInversion}
        onChange={(e) => setTipoInversion(e.target.value)}
      >
        <option value="plazoFijo">Plazo Fijo</option>
        <option value="acciones">Acciones (Próximamente)</option>
        <option value="fondos">Fondos Comunes (Próximamente)</option>
      </select>
    </div>
  );

  const COMPONENTES_CALCULADORA: Record<string, React.ReactElement> = {
    plazoFijo: <CalculadoraPlazoFijo headerFormulario={headerFormulario} />,
    acciones: (
      <CalculadoraPlaceholder
        nombre="Acciones"
        headerFormulario={headerFormulario}
      />
    ),
    fondos: (
      <CalculadoraPlaceholder
        nombre="Fondos Comunes"
        headerFormulario={headerFormulario}
      />
    ),
  };

  const calculadoraSeleccionada = COMPONENTES_CALCULADORA[tipoInversion] || (
    <div className="text-center text-gray-500 p-4">
      Por favor, selecciona un tipo de inversión.
    </div>
  );

  return (
    <div
      className={`font-sans w-full p-6 rounded-lg shadow-md ${
        settings.theme === "dark" ? "bg-black/10" : "bg-white"
      }`}
    >
      <h1
        className={`text-2xl font-bold mb-6 ${
          settings.theme === "dark" ? "text-gray-200" : "text-gray-800"
        }`}
      >
        Calculadora de Inversiones
      </h1>
      {calculadoraSeleccionada}
    </div>
  );
}

export default Calculadora;
