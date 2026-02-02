import React, { useState } from 'react';
import axios from 'axios';

export default function FormularioMiembro() {
    const [formData, setFormData] = useState({
        nombre: '',
        apellidos: '',
        email: '',
        telefono: '',
        fechaNacimiento: '',
        estado: 'VISITA_PRIMERA_VEZ', // Default value from Enum
        notasSeguimiento: ''
    });
    const [mensaje, setMensaje] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMensaje(null);

        try {
            // HARDCODED Iglesia ID = 1 for now, as we verify manual entry.
            // In a real app, this would come from context/auth.
            const iglesiaId = 1; 

            const response = await axios.post(`http://localhost:8080/api/miembros?iglesiaId=${iglesiaId}`, formData);
            
            if (response.status === 200) {
                setMensaje({ type: 'success', text: '¡Miembro registrado exitosamente!' });
                setFormData({
                    nombre: '',
                    apellidos: '',
                    email: '',
                    telefono: '',
                    fechaNacimiento: '',
                    estado: 'VISITA_PRIMERA_VEZ',
                    notasSeguimiento: ''
                });
            }
        } catch (error) {
            console.error(error);
            setMensaje({ type: 'error', text: 'Error al registrar miembro. Revisa la consola.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl mx-auto border border-gray-100">
            <h2 className="text-2xl font-bold text-[#15344f] mb-6 flex items-center gap-2">
                <span>👤</span> Nuevo Miembro
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Nacimiento</label>
                        <input 
                            type="date" name="fechaNacimiento" 
                            value={formData.fechaNacimiento} onChange={handleChange}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#cea14d] focus:ring-[#cea14d] p-2 border"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                        <select 
                            name="estado" 
                            value={formData.estado} onChange={handleChange}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#cea14d] focus:ring-[#cea14d] p-2 border bg-white"
                        >
                            <option value="VISITA_PRIMERA_VEZ">Visita Primera Vez</option>
                            <option value="EN_CONSOLIDACION">En Consolidación</option>
                            <option value="MIEMBRO_ACTIVO">Miembro Activo</option>
                            <option value="BAUTIZADO">Bautizado</option>
                        </select>
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
                        {isSubmitting ? 'Guardando...' : '💾 Guardar Miembro'}
                    </button>
                </div>
            </form>
        </div>
    );
}
