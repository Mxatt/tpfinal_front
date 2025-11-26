import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { SettingsContext } from '../context/SettingsContext';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { DollarSign, Briefcase, TrendingUp, Calculator, History } from 'lucide-react';
import api from '../services/api';

const PaginaDashboard: React.FC = () => {
  const auth = useContext(AuthContext);
  const settingsContext = useContext(SettingsContext);
  const navigate = useNavigate();
  const [inversiones, setInversiones] = React.useState<any[]>([]);
  const [loadingInversiones, setLoadingInversiones] = React.useState(true);

  React.useEffect(() => {
    const fetchInversiones = async () => {
      try {
        const res = await api.get('/investments');
        setInversiones(res.data);
      } catch (error) {
        console.error("Error fetching investments", error);
      } finally {
        setLoadingInversiones(false);
      }
    };
    fetchInversiones();
  }, []);

  if (!auth || !settingsContext) {
    return null;
  }

  const { usuario, cargando } = auth;
  const { settings } = settingsContext;

  const getCurrencySymbol = (currency: string) => {
    switch (currency) {
      case 'USD': return '$';
      case 'EUR': return '€';
      case 'ARS': return '$';
      default: return '$';
    }
  };

  if (cargando || loadingInversiones) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className={`text-xl ${settings.theme === 'dark' ? 'text-white' : 'text-black'}`}>Cargando panel...</div>
      </div>
    );
  }


  const totalInvertido = usuario?.totalInvertido || 0;
  const cantidadInversionesActivas = inversiones.length;

  const retornoTotalEsperado = inversiones.reduce((acc, actual) => acc + (actual.montoRetornoEsperado || 0), 0);
  

  const datosPorTipo = inversiones.reduce((acc: any, actual: any) => {
    const tipo = actual.tipoInversion || 'Otros';
    if (!acc[tipo]) acc[tipo] = 0;
    acc[tipo] += actual.montoActual;
    return acc;
  }, {});

  const datosGrafico = Object.keys(datosPorTipo).map(clave => ({
    nombre: clave,
    valor: datosPorTipo[clave],
  }));

  const COLORES = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F'];

  return (
    <div className="flex-1 p-6 md:p-8 overflow-y-auto animate-fade-in">
      <div className="max-w-7xl mx-auto space-y-8">

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className={`text-3xl font-bold ${settings.theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Hola, {usuario?.nombreUsuario} 👋
            </h1>
            <p className={`${settings.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Aquí tienes un resumen de tu portafolio hoy.
            </p>
          </div>
          <button 
            onClick={() => navigate('/inversiones')}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2.5 rounded-lg font-medium transition-all shadow-lg shadow-purple-500/20 btn-animated flex items-center gap-2"
          >
            <span>+</span> Nueva Inversión
          </button>
        </div>


        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div className={`p-6 rounded-2xl shadow-lg border ${settings.theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-white border-gray-100'}`}>
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl ${settings.theme === 'dark' ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>
                <DollarSign size={24} />
              </div>
              <span className={`text-sm font-medium px-2 py-1 rounded-full ${settings.theme === 'dark' ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-600'}`}>
                +2.5%
              </span>
            </div>
            <h3 className={`text-sm font-medium mb-1 ${settings.theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Total Invertido</h3>
            <p className={`text-3xl font-bold ${settings.theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {getCurrencySymbol(settings.currency)}{totalInvertido.toLocaleString()}
            </p>
          </div>


          <div className={`p-6 rounded-2xl shadow-lg border ${settings.theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-white border-gray-100'}`}>
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl ${settings.theme === 'dark' ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-100 text-purple-600'}`}>
                <Briefcase size={24} />
              </div>
            </div>
            <h3 className={`text-sm font-medium mb-1 ${settings.theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Inversiones Activas</h3>
            <p className={`text-3xl font-bold ${settings.theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {cantidadInversionesActivas}
            </p>
          </div>


          <div className={`p-6 rounded-2xl shadow-lg border ${settings.theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-white border-gray-100'}`}>
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl ${settings.theme === 'dark' ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-600'}`}>
                <TrendingUp size={24} />
              </div>
            </div>
            <h3 className={`text-sm font-medium mb-1 ${settings.theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Retorno Esperado</h3>
            <p className={`text-3xl font-bold ${settings.theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {getCurrencySymbol(settings.currency)}{retornoTotalEsperado.toLocaleString()}
            </p>
          </div>
        </div>


        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          <div className={`p-6 rounded-2xl shadow-lg border ${settings.theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-white border-gray-100'}`}>
            <h3 className={`text-lg font-bold mb-6 ${settings.theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Distribución de Activos</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={datosGrafico}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="valor"
                    nameKey="nombre"
                  >
                    {datosGrafico.map((_, indice) => (
                      <Cell key={`celda-${indice}`} fill={COLORES[indice % COLORES.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number, name: string) => [`${getCurrencySymbol(settings.currency)}${value.toLocaleString()}`, name]}
                    contentStyle={{ 
                      backgroundColor: settings.theme === 'dark' ? '#1f2937' : '#fff',
                      borderColor: settings.theme === 'dark' ? '#374151' : '#e5e7eb',
                      color: settings.theme === 'dark' ? '#fff' : '#000'
                    }} 
                    itemStyle={{ color: settings.theme === 'dark' ? '#fff' : '#000' }}
                  />
                  <Legend 
                    layout="vertical" 
                    verticalAlign="middle" 
                    align="right"
                    wrapperStyle={{ paddingLeft: '20px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>


          <div className={`p-6 rounded-2xl shadow-lg border ${settings.theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-white border-gray-100'}`}>
            <h3 className={`text-lg font-bold mb-6 ${settings.theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Acciones Rápidas</h3>
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => navigate('/calculadora')}
                className={`p-4 rounded-xl text-left transition-colors ${settings.theme === 'dark' ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-50 hover:bg-gray-100'}`}
              >
                <div className="p-2 bg-orange-500/20 text-orange-500 rounded-lg w-fit mb-3">
                  <Calculator size={20} />
                </div>
                <span className={`font-medium ${settings.theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Calculadora</span>
              </button>
              <button 
                onClick={() => navigate('/historial')}
                className={`p-4 rounded-xl text-left transition-colors ${settings.theme === 'dark' ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-50 hover:bg-gray-100'}`}
              >
                <div className="p-2 bg-pink-500/20 text-pink-500 rounded-lg w-fit mb-3">
                  <History size={20} />
                </div>
                <span className={`font-medium ${settings.theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Historial</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaginaDashboard;
