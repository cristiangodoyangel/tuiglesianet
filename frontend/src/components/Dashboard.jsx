import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Users, TrendingUp, CircleDollarSign, Calendar } from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalMiembros: 0,
    miembrosNuevos: 0,
    ofrendasMes: 0,
    asistenciaPromedio: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch REAL members from backend
        const response = await axios.get('http://localhost:8080/api/miembros?iglesiaId=1');
        const miembros = response.data;

        // Calculate stats
        // Mocking "New Members" as those added in current month (Assuming creation date is available or just mocking for MVP)
        // Since we don't have createdAt field exposed in JSON yet, we'll use a placeholder logic or just count total.

        // For MVP: total members is real. Others are estimated/mocked until backend supports them.
        setStats({
          totalMiembros: miembros.length,
          miembrosNuevos: Math.floor(miembros.length * 0.2), // Mock: 20% are new
          ofrendasMes: 1543000, // Mock: $1.5M CLP
          asistenciaPromedio: 85 // Mock: 85%
        });
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const cards = [
    {
      title: 'Miembros Totales',
      value: stats.totalMiembros,
      icon: Users,
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
      bg: 'bg-blue-50'
    },
    {
      title: 'Nuevos este Mes',
      value: `+${stats.miembrosNuevos}`,
      icon: TrendingUp,
      color: 'bg-green-500',
      textColor: 'text-green-600',
      bg: 'bg-green-50'
    },
    {
      title: 'Ofrendas (CLP)',
      value: `$${stats.ofrendasMes.toLocaleString()}`,
      icon: CircleDollarSign,
      color: 'bg-yellow-500',
      textColor: 'text-yellow-600',
      bg: 'bg-yellow-50'
    },
    {
      title: 'Asistencia Promedio',
      value: `${stats.asistenciaPromedio}%`,
      icon: Calendar,
      color: 'bg-indigo-500',
      textColor: 'text-indigo-600',
      bg: 'bg-indigo-50'
    }
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-32 bg-gray-100 rounded-xl"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${card.bg}`}>
                <Icon className={`w-6 h-6 ${card.textColor}`} />
              </div>
              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${card.bg} ${card.textColor}`}>
                Actualizado
              </span>
            </div>
            <h3 className="text-gray-500 text-sm font-medium">{card.title}</h3>
            <p className="text-2xl font-bold text-gray-800 mt-1">{card.value}</p>
          </div>
        );
      })}
    </div>
  );
}