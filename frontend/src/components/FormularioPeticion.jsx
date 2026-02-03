import React, { useState } from 'react';
import { Send, User, Tag, Heart } from 'lucide-react';

export default function FormularioPeticion({ iglesiaId, onPeticionCreada }) {
    const [solicitante, setSolicitante] = useState('');
    const [oracionPor, setOracionPor] = useState('');
    const [tipo, setTipo] = useState('SALUD');
    const [descripcion, setDescripcion] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!descripcion.trim() || !solicitante.trim()) return;

        setLoading(true);
        try {
            const response = await fetch(`/api/peticiones?iglesiaId=${iglesiaId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    titulo: 'Petición de Oración',
                    descripcion,
                    solicitante,
                    oracionPor: oracionPor || solicitante, // Si no especifica, es por sí mismo
                    tipo,
                    iglesia: { id: iglesiaId }
                }),
            });

            if (response.ok) {
                setSolicitante('');
                setOracionPor('');
                setDescripcion('');
                setTipo('SALUD');
                if (onPeticionCreada) onPeticionCreada();
            }
        } catch (error) {
            console.error("Error envío:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 mb-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-[#15344f]"></div>
            <h3 className="text-lg font-bold text-[#15344f] mb-4 flex items-center gap-2">
                <Heart className="text-red-500 fill-current" size={20} />
                Comparte tu Carga
            </h3>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-4">
                {/* Fila 1: Datos Personales */}
                <div className="md:col-span-4">
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Solicitado Por</label>
                    <div className="relative">
                        <User className="absolute left-3 top-2.5 text-gray-400" size={16} />
                        <input
                            type="text"
                            value={solicitante}
                            onChange={(e) => setSolicitante(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="Tu nombre"
                            required
                        />
                    </div>
                </div>

                <div className="md:col-span-4">
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Oración Por (Beneficiario)</label>
                    <div className="relative">
                        <Heart className="absolute left-3 top-2.5 text-gray-400" size={16} />
                        <input
                            type="text"
                            value={oracionPor}
                            onChange={(e) => setOracionPor(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="¿Por quién oramos?"
                        />
                    </div>
                </div>

                <div className="md:col-span-4">
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Tipo de Petición</label>
                    <div className="relative">
                        <Tag className="absolute left-3 top-2.5 text-gray-400" size={16} />
                        <select
                            value={tipo}
                            onChange={(e) => setTipo(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none appearance-none"
                        >
                            <option value="SALUD">Salud</option>
                            <option value="TRABAJO">Trabajo / Finanzas</option>
                            <option value="FAMILIA">Familia</option>
                            <option value="CONOCER_A_JESUS">Conocer a Jesús</option>
                            <option value="OTRO">Otro</option>
                        </select>
                    </div>
                </div>

                {/* Fila 2: Descripción y Botón */}
                <div className="md:col-span-9">
                    <input
                        type="text"
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-700"
                        placeholder="Escribe brevemente el motivo de oración..."
                        required
                        autoComplete='off'
                    />
                </div>

                <div className="md:col-span-3">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full h-full bg-[#15344f] hover:bg-[#112a40] text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-transform active:scale-95 disabled:opacity-70 disabled:scale-100"
                    >
                        {loading ? 'Enviando...' : (
                            <>Enviar <Send size={16} /></>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
