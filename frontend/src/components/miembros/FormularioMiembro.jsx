import React, { useState } from 'react';
import axios from 'axios';

export default function FormularioMiembro({ id }) {
    const [formData, setFormData] = useState({
        nombre: '',
        apellidos: '',
        email: '',
        telefono: '',
        fechaNacimiento: '',
        estados: ['NUEVO_EN_LA_IGLESIA'], // Array for multiple statuses
        notasSeguimiento: ''
    });
    const [mensaje, setMensaje] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Available statuses
    const availableStatuses = [
        { value: 'NUEVO_EN_LA_IGLESIA', label: 'Nuevo en la Iglesia' },
        { value: 'EN_CONSOLIDACION', label: 'Consolidación' },
        { value: 'EN_DISCIPULADO', label: 'En Discipulado' },
        { value: 'BAUTIZADO', label: 'Bautizado' },
        { value: 'MIEMBRO', label: 'Miembro' },
        { value: 'EN_MINISTERIO', label: 'En Ministerio' }
    ];

    // Fetch existing data if in Edit Mode
    React.useEffect(() => {
        if (id) {
            const fetchMiembro = async () => {
                try {
                    const response = await axios.get(`http://localhost:8080/api/miembros/${id}`);
                    // Ensure backend returns 'estados' as array
                    const data = response.data;
                    if (!data.estados) data.estados = [];
                    setFormData(data);
                } catch (error) {
                    console.error("Error fetching member:", error);
                    setMensaje({ type: 'error', text: 'No se pudo cargar la información del miembro.' });
                }
            };
            fetchMiembro();
        }
    }, [id]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleStatusChange = (statusValue) => {
        setFormData(prev => {
            const currentStatuses = prev.estados || [];
            if (currentStatuses.includes(statusValue)) {
                // Remove if already exists
                return { ...prev, estados: currentStatuses.filter(s => s !== statusValue) };
            } else {
                // Add if not exists
                return { ...prev, estados: [...currentStatuses, statusValue] };
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMensaje(null);

        try {
            const iglesiaId = 1;

            let response;
            if (id) {
                // UPDATE
                response = await axios.put(`http://localhost:8080/api/miembros/${id}`, formData);
            } else {
                // CREATE
                response = await axios.post(`http://localhost:8080/api/miembros?iglesiaId=${iglesiaId}`, formData);
            }

            if (response.status === 200 || response.status === 201) {
                setMensaje({
                    type: 'success',
                    text: id ? '¡Miembro actualizado exitosamente! Redirigiendo...' : '¡Miembro registrado exitosamente! Redirigiendo...'
                });

                // Redirect after 1.5 seconds
                setTimeout(() => {
                    window.location.href = '/miembros';
                }, 1500);

                if (!id) {
                    // Reset form only on Create
                    setFormData({
                        nombre: '',
                        apellidos: '',
                        email: '',
                        telefono: '',
                        fechaNacimiento: '',
                        estados: ['NUEVO_EN_LA_IGLESIA'],
                        notasSeguimiento: ''
                    });
                }
            }
        } catch (error) {
            console.error(error);
            setMensaje({ type: 'error', text: 'Error al guardar. Revisa la consola.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl mx-auto border border-gray-100">
            <h2 className="text-2xl font-bold text-[#15344f] mb-6 flex items-center gap-2">
                <span>{id ? '✏️' : '👤'}</span> {id ? 'Editar Miembro' : 'Nuevo Miembro'}
            </h2>

            {mensaje && (
                <div className={`p-4 mb-4 rounded-lg ${mensaje.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {mensaje.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                        <input
                            type="text" name="nombre" required
                            value={formData.nombre} onChange={handleChange}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#cea14d] focus:ring-[#cea14d] p-2 border"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Apellidos</label>
                        <input
                            type="text" name="apellidos" required
                            value={formData.apellidos} onChange={handleChange}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#cea14d] focus:ring-[#cea14d] p-2 border"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email" name="email"
                            value={formData.email} onChange={handleChange}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#cea14d] focus:ring-[#cea14d] p-2 border"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                        <input
                            type="tel" name="telefono"
                            value={formData.telefono} onChange={handleChange}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#cea14d] focus:ring-[#cea14d] p-2 border"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Nacimiento</label>
                    <input
                        type="date" name="fechaNacimiento"
                        value={formData.fechaNacimiento} onChange={handleChange}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#cea14d] focus:ring-[#cea14d] p-2 border"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Estados (Seleccione múltiples)</label>
                    <div className="grid grid-cols-2 gap-2 p-3 border rounded-md border-gray-200 bg-gray-50">
                        {availableStatuses.map((status) => (
                            <label key={status.value} className="flex items-center space-x-2 cursor-pointer hover:bg-white p-1 rounded transition-colors">
                                <input
                                    type="checkbox"
                                    checked={formData.estados?.includes(status.value)}
                                    onChange={() => handleStatusChange(status.value)}
                                    className="rounded border-gray-300 text-[#cea14d] focus:ring-[#cea14d]"
                                />
                                <span className="text-sm text-gray-700">{status.label}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Notas de Seguimiento</label>
                    <textarea
                        name="notasSeguimiento" rows="3"
                        value={formData.notasSeguimiento} onChange={handleChange}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#cea14d] focus:ring-[#cea14d] p-2 border"
                        placeholder="Ej: Interesado en grupo de jóvenes..."
                    ></textarea>
                </div>

                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-[#15344f] text-white px-6 py-2 rounded-md hover:bg-[#0f2538] transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                        {isSubmitting ? 'Guardando...' : (id ? '💾 Actualizar Miembro' : '💾 Guardar Miembro')}
                    </button>
                </div>
            </form>
        </div>
    );
}
