import React, { useState, useEffect } from 'react';
import { MessageCircle, CheckCircle, Clock, Heart, Users, Briefcase, Activity, Share2, Smartphone } from 'lucide-react';
import FormularioPeticion from './FormularioPeticion';

const TIPO_CONFIG = {
    SALUD: { label: 'Salud', color: 'bg-red-100 text-red-700', icon: Activity },
    TRABAJO: { label: 'Trabajo', color: 'bg-green-100 text-green-700', icon: Briefcase },
    FAMILIA: { label: 'Familia', color: 'bg-purple-100 text-purple-700', icon: Users },
    CONOCER_A_JESUS: { label: 'Salvación', color: 'bg-yellow-100 text-yellow-800', icon: Heart },
    OTRO: { label: 'Petición', color: 'bg-gray-100 text-gray-700', icon: MessageCircle },
};

export default function MuroOracion({ iglesiaId = 1 }) {
    const [peticiones, setPeticiones] = useState([]);
    const [filtro, setFiltro] = useState('PENDIENTE');
    const [loading, setLoading] = useState(true);
    const [respondiendoId, setRespondiendoId] = useState(null);
    const [respuestaTexto, setRespuestaTexto] = useState('');

    const fetchPeticiones = async () => {
        setLoading(true);
        try {
            const dbEstado = filtro === 'TODOS' ? '' : `&estado=${filtro}`;
            const response = await fetch(`/api/peticiones?iglesiaId=${iglesiaId}${dbEstado}`);
            if (response.ok) {
                const data = await response.json();
                setPeticiones(data);
            }
        } catch (error) {
            console.error("Error cargando peticiones:", error);
            // Mock data si falla para demo visual
            setPeticiones([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPeticiones();
    }, [filtro, iglesiaId]);

    const handleResponder = async (id) => {
        if (!respuestaTexto.trim()) return;
        try {
            const response = await fetch(`/api/peticiones/${id}/responder`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ respuesta: respuestaTexto })
            });
            if (response.ok) {
                setRespondiendoId(null);
                setRespuestaTexto('');
                fetchPeticiones();
            }
        } catch (error) {
            console.error("Error al responder:", error);
        }
    };

    const compartirIndividual = (peticion) => {
        let texto = '';
        if (peticion.estado === 'RESPONDIDA') {
            texto = `🎉 *Testimonio de Respuesta*\n*Dios respondió a:* ${peticion.oracionPor || 'Alguien'}\n*Testimonio:* "${peticion.respuesta}"\n_Celebra con nosotros en TuIglesia.net_`;
        } else {
            texto = `🙏 *Petición de Oración*\n*Por:* ${peticion.oracionPor || 'Alguien'}\n*Motivo:* ${peticion.descripcion}\n_Únete a orar en TuIglesia.net_`;
        }
        window.open(`https://wa.me/?text=${encodeURIComponent(texto)}`, '_blank');
    };

    const compartirLista = () => {
        if (peticiones.length === 0) return;
        let texto = `📋 *Lista de Oración - TuIglesia.net*\n\n`;
        peticiones.slice(0, 10).forEach((p, i) => {
            texto += `${i + 1}. *${p.oracionPor || 'Anónimo'}*: ${p.descripcion.substring(0, 50)}${p.descripcion.length > 50 ? '...' : ''}\n`;
        });
        texto += `\n_Ver todas en la web_`;
        window.open(`https://wa.me/?text=${encodeURIComponent(texto)}`, '_blank');
    };

    return (
        <div className="max-w-5xl mx-auto p-4">

            {/* SECCIÓN SUPERIOR: FORMULARIO */}
            <FormularioPeticion iglesiaId={iglesiaId} onPeticionCreada={fetchPeticiones} />

            {/* SECCIÓN INFERIOR: MURO DE TARJETAS */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-8">

                {/* SIDEBAR: FILTROS Y ESTADÍSTICAS */}
                <div className="md:col-span-1 space-y-4">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                        <h4 className="font-bold text-gray-700 text-sm mb-3 uppercase tracking-wider">Filtros</h4>
                        <div className="flex flex-col gap-2">
                            <button
                                onClick={() => setFiltro('PENDIENTE')}
                                className={`text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filtro === 'PENDIENTE'
                                    ? 'bg-blue-50 text-blue-700 border border-blue-100'
                                    : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                ⏳ Por Orar
                            </button>
                            <button
                                onClick={() => setFiltro('RESPONDIDA')}
                                className={`text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filtro === 'RESPONDIDA'
                                    ? 'bg-amber-50 text-amber-700 border border-amber-100'
                                    : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                🎉 Testimonios
                            </button>
                            <button
                                onClick={() => setFiltro('TODOS')}
                                className={`text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filtro === 'TODOS'
                                    ? 'bg-gray-100 text-gray-800'
                                    : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                Ver Todas
                            </button>
                        </div>
                    </div>

                    <div className="bg-[#cea14d] text-white rounded-xl p-5 shadow-lg">
                        <h4 className="font-bold text-lg mb-2 flex items-center gap-2">
                            <Smartphone size={18} className="text-white" /> Cadena Virtual
                        </h4>
                        <p className="text-white/90 text-xs italic leading-relaxed mb-3">
                            Comparte la lista actual de motivos con tu grupo de oración o WhatsApp.
                        </p>
                        <button
                            onClick={compartirLista}
                            className="w-full bg-white/20 hover:bg-white/30 text-white text-xs font-bold py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
                        >
                            <Share2 size={14} /> Compartir Lista
                        </button>
                    </div>
                </div>

                {/* LISTA DE PETICIONES */}
                <div className="md:col-span-3">
                    {loading ? (
                        <div className="text-center py-12 text-gray-400 animate-pulse">Cargando peticiones...</div>
                    ) : peticiones.length === 0 ? (
                        <div className="text-center py-16 bg-gray-50 rounded-xl border-dashed border-2 border-gray-200">
                            <p className="text-gray-400 font-medium">No hay peticiones para mostrar.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4">
                            {peticiones.map((peticion) => {
                                const tipoInfo = TIPO_CONFIG[peticion.tipo] || TIPO_CONFIG['OTRO'];
                                const TipoIcon = tipoInfo.icon;

                                return (
                                    <div
                                        key={peticion.id}
                                        className={`bg-white rounded-xl p-5 border shadow-sm transition-all hover:shadow-md relative overflow-hidden ${peticion.estado === 'RESPONDIDA' ? 'border-l-4 border-l-amber-400' : 'border-l-4 border-l-blue-500'
                                            }`}
                                    >
                                        {/* HEADER DE LA TARJETA */}
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="flex items-start gap-3">
                                                <div className={`p-2 rounded-lg ${tipoInfo.color}`}>
                                                    <TipoIcon size={20} />
                                                </div>
                                                <div>
                                                    <h5 className="font-bold text-gray-800 text-sm">
                                                        {peticion.oracionPor || "Anónimo"}
                                                    </h5>
                                                    <p className="text-gray-400 text-xs flex items-center gap-1 mt-0.5">
                                                        Solicitado por: {peticion.solicitante} • <Clock size={10} /> {peticion.fecha}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => compartirIndividual(peticion)}
                                                    className="text-gray-400 hover:text-green-600 transition-colors p-1"
                                                    title="Compartir en WhatsApp"
                                                >
                                                    <Share2 size={16} />
                                                </button>
                                                {peticion.estado === 'RESPONDIDA' && (
                                                    <span className="bg-amber-100 text-amber-700 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide">
                                                        Respondida
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <p className="text-gray-700 text-sm leading-relaxed mb-4 pl-[52px]">
                                            {peticion.descripcion}
                                        </p>

                                        {peticion.estado === 'RESPONDIDA' && peticion.respuesta && (
                                            <div className="ml-[52px] bg-amber-50 rounded-lg p-3 mb-4 text-sm text-amber-900 border border-amber-100 relative">
                                                <div className="absolute -left-2 top-3 w-4 h-4 bg-amber-50 transform rotate-45 border-l border-b border-amber-100"></div>
                                                <strong>Testimonio:</strong> {peticion.respuesta}
                                            </div>
                                        )}

                                        <div className="flex items-center justify-end border-t border-gray-50 pt-3 mt-2">
                                            <button className="mr-auto text-gray-400 hover:text-red-500 text-xs font-medium flex items-center gap-1 transition-colors group">
                                                <Heart size={14} className="group-hover:fill-current" /> Estoy orando
                                            </button>

                                            {peticion.estado !== 'RESPONDIDA' && (
                                                <button
                                                    onClick={() => setRespondiendoId(respondiendoId === peticion.id ? null : peticion.id)}
                                                    className="text-blue-600 hover:text-blue-800 text-xs font-bold uppercase tracking-wide"
                                                >
                                                    {respondiendoId === peticion.id ? 'Cancelar' : 'Responder'}
                                                </button>
                                            )}
                                        </div>

                                        {/* FORMULARIO RESPUESTA */}
                                        {respondiendoId === peticion.id && (
                                            <div className="mt-4 bg-gray-50 p-4 rounded-lg animate-in fade-in slide-in-from-top-2 duration-200">
                                                <label className="block text-xs font-bold text-gray-600 mb-1">Escribe el testimonio:</label>
                                                <textarea
                                                    value={respuestaTexto}
                                                    onChange={(e) => setRespuestaTexto(e.target.value)}
                                                    className="w-full text-sm p-3 border border-gray-200 rounded-md mb-2 h-24 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 resize-none bg-white"
                                                    placeholder="Cuenta cómo Dios respondió a esta petición..."
                                                />
                                                <button
                                                    onClick={() => handleResponder(peticion.id)}
                                                    className="bg-green-600 text-white text-xs font-bold px-4 py-2 rounded-md hover:bg-green-700 transition-colors w-full shadow-sm"
                                                >
                                                    Publicar Testimonio
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
