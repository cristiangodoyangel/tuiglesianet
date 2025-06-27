// src/pages/Login.jsx
import { useState } from "react";
import logo from "../assets/logo.png"; // Asegúrate de tenerlo en src/assets

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí irá el fetch al backend
    console.log("Login:", { email, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f9fafb] px-2 md:px-8">
      <div className="w-full max-w-4xl bg-white shadow-xl rounded-xl flex flex-col md:flex-row overflow-hidden">
        {/* Branding lateral solo visible en desktop */}
        <div className="hidden md:flex flex-col justify-center items-center bg-[#040142] text-white w-1/2 p-10">
          <img src={logo} alt="TuIglesia.net" className="h-20 mb-6 drop-shadow-lg" />
          <h2 className="text-3xl font-bold mb-2">TuIglesia.net</h2>
          <p className="text-lg opacity-90 text-center">Administra tu iglesia de manera sencilla, segura y profesional.</p>
        </div>
        {/* Formulario de login */}
        <div className="w-full md:w-1/2 flex flex-col justify-center p-8 md:p-12">
          <div className="flex justify-center md:hidden mb-6">
            <img src={logo} alt="TuIglesia.net" className="h-16" />
          </div>
          <h2 className="text-2xl font-bold text-center text-[#040142] mb-4">Iniciar sesión</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700">Correo electrónico</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="ej: pastor@tuiglesia.net"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Contraseña</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-[#1e293b] font-semibold py-2 rounded-lg transition"
            >
              Iniciar sesión
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
