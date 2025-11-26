import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { AxiosError } from 'axios';

const PaginaLogin = () => {
  const [email, setEmail] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const auth = useContext(AuthContext);
  const navegar = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.get('verificationSuccess') === 'true') {
      setSuccessMessage(searchParams.get('message') || 'Email verificado exitosamente.');
    }
  }, [searchParams]);

  const manejarSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    try {
      const respuesta = await api.post('/auth/login', { email, contrasena });
      auth?.iniciarSesion(respuesta.data.token);
      navegar('/');
    } catch (err) {
      const axiosError = err as AxiosError;
      console.log('Error caught:', err);
      console.log('Error name:', axiosError.name);
      console.log('Error message:', axiosError.message);
      console.log('Error response data:', axiosError.response?.data);

      if (axiosError.response && axiosError.response.data && (axiosError.response.data as any).msg) {
        setError((axiosError.response.data as any).msg);
      } else {
        setError('Debes verificarte para poder iniciar sesión.');
      }
      console.error(err);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-[#17132a] px-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-black/20 backdrop-blur-lg rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-white">Iniciar Sesión</h1>
        {successMessage && (
          <p className="text-green-400 text-sm text-center">{successMessage}</p>
        )}
        {error && <p className="text-red-400 text-sm text-center">{error}</p>}
        <form onSubmit={manejarSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 mt-1 text-white bg-white/10 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">Contraseña</label>
            <input
              type="password"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              className="w-full px-3 py-2 mt-1 text-white bg-white/10 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>
          <button type="submit" className="w-full py-2 text-white bg-purple-600 hover:bg-purple-700 rounded-md transition-colors cursor-pointer btn-animated">
            Iniciar Sesión
          </button>
        </form>
        <p className="text-sm text-center text-gray-400">
          ¿No tienes una cuenta?{' '}
          <Link to="/register" className="font-medium text-purple-400 hover:underline">
            Regístrate
          </Link>
        </p>      </div>
    </div>
  );
};

export default PaginaLogin;
