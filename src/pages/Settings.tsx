import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { SettingsContext } from '../context/SettingsContext';

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const settingsContext = useContext(SettingsContext);

  if (!settingsContext) {
    return null;
  }

  const { settings, setSettings } = settingsContext;

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSettings({ ...settings, currency: e.target.value as any });
  };

  const handleThemeChange = () => {
    setSettings({ ...settings, theme: settings.theme === 'dark' ? 'light' : 'dark' });
  };

  const handleTimeFormatChange = () => {
    setSettings({ ...settings, timeFormat: settings.timeFormat === '24h' ? '12h' : '24h' });
  };

  return (
    <div className="flex-1 flex flex-col items-center p-4">
      <div className="w-full max-w-4xl flex justify-between items-center mb-6">
        <h1 className={`text-3xl font-bold ${settings.theme === 'dark' ? 'text-white' : 'text-black'}`}>Configuración</h1>
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded btn-animated"
        >
          Volver
        </button>
      </div>
      
      <div className={`w-full max-w-4xl rounded-lg shadow-lg p-6 ${settings.theme === 'dark' ? 'bg-black/20 backdrop-blur-lg' : 'bg-white'}`}>
        <h2 className={`text-xl font-semibold mb-4 ${settings.theme === 'dark' ? 'text-white' : 'text-black'}`}>Opciones</h2>
        
        <div className="space-y-4">
          <div>
            <label className={`block text-sm font-medium ${settings.theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Moneda</label>
            <select
              value={settings.currency}
              onChange={handleCurrencyChange}
              className={`w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 ${settings.theme === 'dark' ? 'bg-white/10 text-white border-gray-600' : 'bg-gray-50 text-black border-gray-300'}`}
            >
              <option value="EUR">EUR</option>
              <option value="ARS">ARS</option>
            </select>
          </div>

          <div>
            <label className={`block text-sm font-medium ${settings.theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Tema</label>
            <button
              onClick={handleThemeChange}
              className={`w-full py-2 mt-1 rounded-md transition-colors ${settings.theme === 'dark' ? 'bg-purple-600 hover:bg-purple-700 text-white' : 'bg-gray-200 hover:bg-gray-300 text-black'} btn-animated`}
            >
              Cambiar a modo {settings.theme === 'dark' ? 'claro' : 'oscuro'}
            </button>
          </div>

          <div>
            <label className={`block text-sm font-medium ${settings.theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Formato de hora</label>
            <button
              onClick={handleTimeFormatChange}
              className={`w-full py-2 mt-1 rounded-md transition-colors ${settings.theme === 'dark' ? 'bg-purple-600 hover:bg-purple-700 text-white' : 'bg-gray-200 hover:bg-gray-300 text-black'} btn-animated`}
            >
              Cambiar a formato {settings.timeFormat === '24h' ? '12h' : '24h'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;