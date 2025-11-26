import { Routes, Route, Navigate } from "react-router-dom";
import PantallaPrincipal from "./screens/pantallaprincipal";
import PantallaCalculadora from "./screens/pantallacalculadora";
import PaginaLogin from "./pages/PaginaLogin";
import PaginaRegistro from "./pages/PaginaRegistro";
import PaginaInversiones from "./pages/PaginaInversiones";
import PaginaHistorial from "./pages/PaginaHistorial";
import RutaPrivada from "./Components/RutaPrivada";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import PaginaDashboard from "./pages/PaginaDashboard";

import PaginaInversionesActivas from "./pages/PaginaInversionesActivas";

import Settings from "./pages/Settings";

function App() {
  const auth = useContext(AuthContext);

  if (auth?.cargando) {

    return (
      <div className="flex justify-center items-center h-screen">
        <div>Cargando...</div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={<PaginaLogin />} />
      <Route path="/register" element={<PaginaRegistro />} />
      <Route
        path="/"
        element={
          auth?.estaAutenticado ? (
            <RutaPrivada>
              <PantallaPrincipal />
            </RutaPrivada>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      >
        <Route index element={<PaginaDashboard />} />
        <Route path="inversiones" element={<PaginaInversiones />} />
        <Route path="inversiones-activas" element={<PaginaInversionesActivas />} />
        <Route path="calculadora" element={<PantallaCalculadora />} />
        <Route path="historial" element={<PaginaHistorial />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}

export default App;
