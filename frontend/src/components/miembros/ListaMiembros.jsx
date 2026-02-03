import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function ListaMiembros() {
    const [miembros, setMiembros] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchMiembros = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/miembros?iglesiaId=1');
            setMiembros(response.data);
            setError(null);
        } catch (err) {
            console.error("Error fetching members:", err);
            setError('No se pudieron cargar los miembros. Asegúrate que el backend esté corriendo.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMiembros();
    }, []);

    const [showModal, setShowModal] = useState(false);
    const [memberToDelete, setMemberToDelete] = useState(null);

    const handleDeleteClick = (id) => {
        setMemberToDelete(id);
        setShowModal(true);
    };

    const confirmDelete = async () => {
        if (!memberToDelete) return;

        try {
            await axios.delete(`http://localhost:8080/api/miembros/${memberToDelete}`);
            setMiembros(miembros.filter(m => m.id !== memberToDelete));
            setShowModal(false);
            setMemberToDelete(null);
        } catch (err) {
            console.error("Error deleting member:", err);
            alert("Hubo un error al eliminar. Revisa que el backend esté corriendo.");
            setShowModal(false);
        }
    };

    const getEstadoBadge = (estado) => {
        const styles = {
            'NUEVO_EN_LA_IGLESIA': 'bg-blue-100 text-blue-800',
            'EN_CONSOLIDACION': 'bg-yellow-100 text-yellow-800',
            'EN_DISCIPULADO': 'bg-orange-100 text-orange-800',
            'BAUTIZADO': 'bg-purple-100 text-purple-800',
            'MIEMBRO': 'bg-green-100 text-green-800',
            'EN_MINISTERIO': 'bg-indigo-100 text-indigo-800 border border-indigo-200'
        };
        const labels = {
            'NUEVO_EN_LA_IGLESIA': 'Nuevo',
            'EN_CONSOLIDACION': 'Consolidación',
            'EN_DISCIPULADO': 'Discipulado',
            'BAUTIZADO': 'Bautizado',
            'MIEMBRO': 'Miembro',
            'EN_MINISTERIO': 'Ministerio'
        };
        return (
            <span key={estado} className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${styles[estado] || 'bg-gray-100 text-gray-800'} mr-1 mb-1 inline-block`}>
                {labels[estado] || estado}
            </span>
        );
    };

    if (loading) return <div className="text-center py-8 text-gray-500">Cargando miembros...</div>;
    if (error) return <div className="p-4 bg-red-50 text-red-700 rounded-lg">{error}</div>;

    return (
        <>
            {/* Modal de Confirmación Moderno - Outside overflow container */}
            {showModal && (
                <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
                    <div className="bg-[#15344f] rounded-2xl shadow-2xl w-full max-w-md p-8 transform transition-all scale-100 animate-slide-up border border-[#cea14d]/20 relative overflow-hidden">
                        {/* Elemento Decorativo */}
                        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-[#1e4b70] rounded-full blur-3xl opacity-50 pointer-events-none"></div>

                        <div className="relative z-10 flex flex-col items-center text-center">
                            <div className="bg-[#cea14d] p-4 rounded-full mb-6 shadow-xl shadow-black/20">
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#15344f" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M3 6h18"></path>
                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path>
                                    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                    <line x1="10" y1="11" x2="10" y2="17"></line>
                                    <line x1="14" y1="11" x2="14" y2="17"></line>
                                </svg>
                            </div>

                            <h3 className="text-2xl font-bold text-white mb-2">¿Eliminar Miembro?</h3>
                            <p className="text-blue-100/80 mb-8 text-sm leading-relaxed">
                                Esta acción eliminará permanentemente al miembro. <br />
                                <span className="text-[#cea14d] font-semibold">Sus diezmos asociados también serán borrados.</span>
                            </p>

                            <div className="flex w-full gap-3">
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 px-4 py-3 text-white/90 bg-white/5 hover:bg-white/10 rounded-xl font-medium transition-all duration-200 border border-white/10"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    className="flex-1 px-4 py-3 text-[#15344f] bg-[#cea14d] hover:bg-[#b88f3b] rounded-xl font-bold shadow-lg shadow-[#cea14d]/20 transition-all duration-200 transform hover:-translate-y-0.5"
                                >
                                    Sí, Eliminar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden relative">
                {miembros.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        <p>No hay miembros registrados aún.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-600">
                            <thead className="bg-gray-50 text-gray-900 font-semibold border-b border-gray-100">
                                <tr>
                                    <th className="p-4">Nombre Completo</th>
                                    <th className="p-4">Contacto</th>
                                    <th className="p-4">Estado(s)</th>
                                    <th className="p-4">Edad</th>
                                    <th className="p-4 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {miembros.map((miembro) => (
                                    <tr key={miembro.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4 font-medium text-gray-900">
                                            {miembro.nombre} {miembro.apellidos}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex flex-col">
                                                <span>{miembro.email}</span>
                                                <span className="text-xs text-gray-400">{miembro.telefono}</span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex flex-wrap max-w-[200px]">
                                                {miembro.estados && miembro.estados.length > 0 ? (
                                                    miembro.estados.map(estado => getEstadoBadge(estado))
                                                ) : (
                                                    <span className="text-gray-400 text-xs italic">Sin estado</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            {miembro.fechaNacimiento}
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <a
                                                    href={`/miembros/editar/${miembro.id}`}
                                                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                                                    title="Editar"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                                                    </svg>
                                                </a>
                                                <button
                                                    onClick={() => handleDeleteClick(miembro.id)}
                                                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                                    title="Borrar"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="M3 6h18"></path>
                                                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                                                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </>
    );
}
