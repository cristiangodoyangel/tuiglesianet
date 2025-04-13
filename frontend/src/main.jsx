// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './layout/Layout.jsx';
import Oraciones from './components/Oraciones.jsx'; // futuro componente
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<h2>Bienvenido a TuIglesia.net</h2>} />
          <Route path="oracion" element={<Oraciones />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
