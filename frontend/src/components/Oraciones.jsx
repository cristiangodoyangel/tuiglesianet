import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { Check } from 'lucide-react';

const Oraciones = () => {
  const [peticiones, setPeticiones] = useState([]);
  const [nueva, setNueva] = useState({
    solicitante: '',
    titulo: '',
    afectado: '',
    fecha: '',
    categoria: '',
    estado: 'Pendiente'
  });

  const obtenerPeticiones = () => {
    fetch('http://localhost:8080/api/oracion')
      .then(res => res.json())
      .then(data => setPeticiones(data))
      .catch(err => console.error('Error cargando peticiones:', err));
  };

  useEffect(() => {
    obtenerPeticiones();
  }, []);

  const manejarCambio = e => {
    const { name, value } = e.target;
    setNueva(prev => ({ ...prev, [name]: value }));
  };

  const manejarSubmit = e => {
    e.preventDefault();
    fetch('http://localhost:8080/api/oracion', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Basic ' + btoa('admin:admin')
      },
      body: JSON.stringify(nueva)
    }).then(res => {
      if (res.ok) {
        obtenerPeticiones();
        setNueva({
          solicitante: '',
          titulo: '',
          afectado: '',
          fecha: '',
          categoria: '',
          estado: 'Pendiente'
        });
      }
    });
  };

  const handleEditar = (peticion) => {
    alert("Editar función pendiente: " + peticion.id);
  };

  const handleEliminar = (id) => {
    alert("Eliminar función pendiente: ID " + id);
  };

  const handleRespondida = (id) => {
    alert("Marcar como respondida función pendiente: ID " + id);
  };

  const columnas = [
    { name: 'Título', selector: row => row.titulo, sortable: true, wrap: true },
    { name: 'Solicitante', selector: row => row.solicitante, wrap: true },
    { name: 'Afectado', selector: row => row.afectado, wrap: true },
    { name: 'Fecha', selector: row => row.fecha },
    { name: 'Categoría', selector: row => row.categoria },
    { name: 'Estado', selector: row => row.estado },
    {
      name: 'Acciones',
      cell: row => (
        <div className="flex flex-wrap gap-2 justify-center">
          <button
            onClick={() => handleEditar(row)}
            className="bg-yellow-500 hover:bg-yellow-600 text-white text-xs font-medium px-3 py-1 rounded"
          >
            Editar
          </button>
          <button
            onClick={() => handleEliminar(row.id)}
            className="bg-red-500 hover:bg-red-600 text-white text-xs font-medium px-3 py-1 rounded"
          >
            Eliminar
          </button>
          <button
            onClick={() => handleRespondida(row.id)}
            className="bg-green-600 hover:bg-green-700 text-white text-xs font-medium px-2 py-1 rounded flex items-center gap-1"
          >
            <Check size={14} /> Respondida
          </button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    }
  ];

  return (
    <div className="p-4 max-w-full">
      <h2 className="text-xl md:text-2xl font-bold text-[#1A4261] mb-4">📖 Peticiones de Oración</h2>

      <form onSubmit={manejarSubmit} className="mb-6 bg-white p-4 shadow rounded grid gap-4 grid-cols-1 sm:grid-cols-2">
        <input name="solicitante" value={nueva.solicitante} onChange={manejarCambio} className="p-2 border rounded" placeholder="Solicitante" required />
        <input name="titulo" value={nueva.titulo} onChange={manejarCambio} className="p-2 border rounded" placeholder="Título de la petición" required />
        <input name="afectado" value={nueva.afectado} onChange={manejarCambio} className="p-2 border rounded" placeholder="Persona afectada" />
        <input type="date" name="fecha" value={nueva.fecha} onChange={manejarCambio} className="p-2 border rounded" required />
        <input name="categoria" value={nueva.categoria} onChange={manejarCambio} className="p-2 border rounded" placeholder="Categoría" />
        <button type="submit" className="bg-[#1A4261] text-white py-2 px-4 rounded hover:bg-[#163552] sm:col-span-2">
          Agregar Petición
        </button>
      </form>

      <div className="overflow-x-auto rounded shadow">
        <DataTable
          columns={columnas}
          data={peticiones}
          pagination
          highlightOnHover
          responsive
          dense
        />
      </div>
    </div>
  );
};

export default Oraciones;
