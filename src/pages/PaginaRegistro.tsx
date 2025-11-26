import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const PaginaRegistro = () => {
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [email, setEmail] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [confirmarContrasena, setConfirmarContrasena] = useState("");
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  const navegar = useNavigate();

  const manejarSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMensaje("");

    if (contrasena !== confirmarContrasena) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    const passwordRegex = /^(?=.*[A-Z]).{8,}$/;
    if (!passwordRegex.test(contrasena)) {
      setError(
        "La contraseña debe tener al menos 8 caracteres y una mayúscula."
      );
      return;
    }

    setCargando(true);
    try {
      await api.post("/auth/register", { nombreUsuario, email, contrasena });
      setMensaje(
        "¡Registro exitoso! Por favor, revisa tu correo electrónico para verificar tu cuenta."
      );
      setTimeout(() => navegar("/login"), 3000);
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.mensaje) {
        setError(err.response.data.mensaje);
      } else {
        setError("Error al registrarse. Inténtalo de nuevo más tarde.");
      }
      console.error(err);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-[#17132a] px-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-black/20 backdrop-blur-lg rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-white">
          Registrarse
        </h1>
        <form onSubmit={manejarSubmit} className="space-y-6">
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
          {mensaje && (
            <p className="text-green-400 text-sm text-center">{mensaje}</p>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Nombre de usuario
            </label>
            <input
              type="text"
              value={nombreUsuario}
              onChange={(e) => setNombreUsuario(e.target.value)}
              className="w-full px-3 py-2 mt-1 text-white bg-white/10 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
              disabled={cargando}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 mt-1 text-white bg-white/10 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
              disabled={cargando}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Contraseña
            </label>
            <input
              type="password"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              className="w-full px-3 py-2 mt-1 text-white bg-white/10 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
              disabled={cargando}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Confirmar Contraseña
            </label>
            <input
              type="password"
              value={confirmarContrasena}
              onChange={(e) => setConfirmarContrasena(e.target.value)}
              className="w-full px-3 py-2 mt-1 text-white bg-white/10 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
              disabled={cargando}
            />
          </div>
          <button
            type="submit"
            disabled={cargando}
            className={`w-full py-2 text-white rounded-md transition-colors btn-animated ${
              cargando
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-purple-600 hover:bg-purple-700"
            }`}
          >
            {cargando ? "Registrando..." : "Registrarse"}
          </button>
        </form>
        <p className="text-sm text-center text-gray-400">
          ¿Ya tienes una cuenta?{" "}
          <Link
            to="/login"
            className="font-medium text-purple-400 hover:underline"
          >
            Iniciar Sesión
          </Link>
        </p>
      </div>
    </div>
  );
};

export default PaginaRegistro;
