// src/pages/Registro.jsx
import { useState } from "react";
import logo from "../assets/logo.png";

export default function Registro() {
  const [step, setStep] = useState(1);
  const [usuario, setUsuario] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [iglesia, setIglesia] = useState({
    nombre: "",
    ciudad: "",
    logo: "",
  });

  const handleUsuarioSubmit = (e) => {
    e.preventDefault();
    if (usuario.password !== usuario.confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }
    setStep(2);
  };

  const handleIglesiaSubmit = (e) => {
    e.preventDefault();
    console.log("Datos completos:", { usuario, iglesia });
    // Aquí se haría el fetch al backend
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f9fafb] px-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-xl p-8 space-y-6">
        <div className="flex justify-center">
          <img src={logo} alt="TuIglesia.net" className="h-16" />
        </div>
        <h2 className="text-2xl font-bold text-center text-[#1e293b]">
          {step === 1 ? "Crear cuenta" : "Crear iglesia"}
        </h2>

        {step === 1 && (
          <form onSubmit={handleUsuarioSubmit} className="space-y-4">
            <input
              type="email"
              placeholder="Correo electrónico"
              className="w-full px-4 py-2 border rounded-lg"
              value={usuario.email}
              onChange={(e) =>
                setUsuario({ ...usuario, email: e.target.value })
              }
              required
            />
            <input
              type="password"
              placeholder="Contraseña"
              className="w-full px-4 py-2 border rounded-lg"
              value={usuario.password}
              onChange={(e) =>
                setUsuario({ ...usuario, password: e.target.value })
              }
              required
            />
            <input
              type="password"
              placeholder="Confirmar contraseña"
              className="w-full px-4 py-2 border rounded-lg"
              value={usuario.confirmPassword}
              onChange={(e) =>
                setUsuario({ ...usuario, confirmPassword: e.target.value })
              }
              required
            />
            <button
              type="submit"
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-[#1e293b] font-semibold py-2 rounded-lg"
            >
              Siguiente
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleIglesiaSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Nombre de la iglesia"
              className="w-full px-4 py-2 border rounded-lg"
              value={iglesia.nombre}
              onChange={(e) =>
                setIglesia({ ...iglesia, nombre: e.target.value })
              }
              required
            />
            <input
              type="text"
              placeholder="Ciudad"
              className="w-full px-4 py-2 border rounded-lg"
              value={iglesia.ciudad}
              onChange={(e) =>
                setIglesia({ ...iglesia, ciudad: e.target.value })
              }
              required
            />
            <input
              type="text"
              placeholder="URL del logo (opcional)"
              className="w-full px-4 py-2 border rounded-lg"
              value={iglesia.logo}
              onChange={(e) =>
                setIglesia({ ...iglesia, logo: e.target.value })
              }
            />
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg"
            >
              Crear cuenta
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
