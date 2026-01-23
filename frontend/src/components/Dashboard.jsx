import { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    // OJO: Esto fallará por CORS (seguridad del navegador), pero quiero que veas el error primero.
    axios.get('http://localhost:8080/api/dashboard/resumen-financiero?iglesiaId=1')
      .then(response => setDashboard(response.data))
      .catch(error => console.error("Error conectando:", error));
  }, []);

  if (!dashboard) return <h1>Cargando datos de la Iglesia...</h1>;

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>⛪ Dashboard Financiero</h1>
      <div style={{ display: 'flex', gap: '20px' }}>
        <Card title="Ingresos Totales" value={dashboard.totalIngresos} color="green" />
        <Card title="Gastos" value={dashboard.totalGastos} color="red" />
        <Card title="Saldo Disponible" value={dashboard.saldoDisponible} color="blue" />
      </div>
    </div>
  );
}

function Card({ title, value, color }) {
  return (
    <div style={{ border: `2px solid ${color}`, padding: '20px', borderRadius: '10px' }}>
      <h3>{title}</h3>
      <h2 style={{ color: color }}>${value}</h2>
    </div>
  );
}

export default App;