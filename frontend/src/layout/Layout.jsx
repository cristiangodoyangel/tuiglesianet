// src/layout/Layout.jsx
import { Outlet } from 'react-router-dom';
import logo from '../assets/logo.png';

const Layout = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1A4261] text-white p-4">
        <div className="flex justify-start mb-6">
          <img src={logo} alt="Logo TuIglesia.net" className="w-32" />
        </div>
        <ul>
          <li className="mb-2"><a href="/" className="hover:underline">Inicio</a></li>
          <li className="mb-2"><a href="/oracion" className="hover:underline">Oración</a></li>
          <li className="mb-2"><a href="#" className="hover:underline">Miembros</a></li>
        </ul>
      </aside>

      {/* Main */}
      <div className="flex flex-col flex-1">
        <header className="bg-white shadow p-4">
          <h1 className="text-xl font-semibold text-[#1A4261]">Panel de administración</h1>
        </header>
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
