import React, { useState, useEffect } from 'react';
import {
    DollarSign, TrendingUp, TrendingDown, Calendar,
    PlusCircle, CreditCard, User, FileText, ArrowUpRight, ArrowDownRight,
    PieChart, Heart
} from 'lucide-react';

export default function DashboardFinanzas({ iglesiaId = 1 }) {
    const [referencia, setReferencia] = useState(0); // Para forzar recarga
    const [loading, setLoading] = useState(true);
    const [miembros, setMiembros] = useState([]);

    // Data States
    const [transacciones, setTransacciones] = useState([]);
    const [resumen, setResumen] = useState({
        totalIngresos: 0,
        totalEgresos: 0,
        diezmos: 0,
        ofrendas: 0,
        gastos: 0
    });

    // Modal State
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('DIEZMO'); // DIEZMO, OFRENDA, GASTO

    // Form State
    const [formData, setFormData] = useState({
        monto: '',
        fecha: new Date().toISOString().split('T')[0],
        descripcion: '', // Para Gasto y Observacion Diezmo
        tipoOfrenda: 'General', // General, Misiones, Templo
        miembroId: ''
    });

    useEffect(() => {
        cargarDatos();
        cargarMiembros();
    }, [referencia, iglesiaId]);

    const cargarDatos = async () => {
        setLoading(true);
        try {
            const [diezmosRes, ofrendasRes, gastosRes] = await Promise.all([
                fetch(`/api/diezmos?iglesiaId=${iglesiaId}`),
                fetch(`/api/ofrendas?iglesiaId=${iglesiaId}`),
                fetch(`/api/gastos?iglesiaId=${iglesiaId}`)
            ]);

            const diezmos = await diezmosRes.json();
            const ofrendas = await ofrendasRes.json();
            const gastos = await gastosRes.json();

            // Normalizar datos para tabla unificada
            const diezmosNorm = diezmos.map(d => ({
                id: `d-${d.id}`,
                tipo: 'DIEZMO',
                fecha: d.fecha,
                monto: d.monto,
                detalle: `Diezmo - ${d.miembro?.nombre} ${d.miembro?.apellidos}`,
                esIngreso: true
            }));

            const ofrendasNorm = ofrendas.map(o => ({
                id: `o-${o.id}`,
                tipo: 'OFRENDA',
                fecha: o.fecha,
                monto: o.monto,
                detalle: `Ofrenda - ${o.tipo}`,
                esIngreso: true
            }));

            const gastosNorm = gastos.map(g => ({
                id: `g-${g.id}`,
                tipo: 'GASTO',
                fecha: g.fecha,
                monto: g.monto,
                detalle: g.descripcion,
                esIngreso: false
            }));

            const todas = [...diezmosNorm, ...ofrendasNorm, ...gastosNorm]
                .sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

            setTransacciones(todas);

            // Calcular totales
            const totalDiezmos = diezmos.reduce((acc, curr) => acc + curr.monto, 0);
            const totalOfrendas = ofrendas.reduce((acc, curr) => acc + curr.monto, 0);
            const totalGastos = gastos.reduce((acc, curr) => acc + curr.monto, 0);

            setResumen({
                diezmos: totalDiezmos,
                ofrendas: totalOfrendas,
                gastos: totalGastos,
                totalIngresos: totalDiezmos + totalOfrendas,
                totalEgresos: totalGastos
            });

        } catch (error) {
            console.error("Error cargando finanzas:", error);
        } finally {
            setLoading(false);
        }
    };

    const cargarMiembros = async () => {
        try {
            const res = await fetch(`/api/miembros?iglesiaId=${iglesiaId}`);
            if (res.ok) setMiembros(await res.json());
        } catch (e) { console.error(e); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        let endpoint = '';
        let body = {};

        if (modalType === 'DIEZMO') {
            endpoint = `/api/diezmos?iglesiaId=${iglesiaId}&miembroId=${formData.miembroId}`;
            body = { monto: formData.monto, fecha: formData.fecha, observacion: formData.descripcion };
        } else if (modalType === 'OFRENDA') {
            endpoint = `/api/ofrendas?iglesiaId=${iglesiaId}`;
            body = { monto: formData.monto, fecha: formData.fecha, tipo: formData.tipoOfrenda };
        } else {
            endpoint = `/api/gastos?iglesiaId=${iglesiaId}`;
            body = { monto: formData.monto, fecha: formData.fecha, descripcion: formData.descripcion };
        }

        try {
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            if (res.ok) {
                setShowModal(false);
                setFormData({ ...formData, monto: '', descripcion: '' }); // Reset parcial
                setReferencia(prev => prev + 1); // Recargar datos
            }
        } catch (error) {
            console.error("Error guardando:", error);
        }
    };

    const formatMoney = (amount) => {
        return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(amount);
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8">

            {/* KPI CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between">
                    <div className="flex items-center gap-3 text-gray-500 mb-2">
                        <div className="p-2 bg-green-50 rounded-lg text-green-600"><TrendingUp size={20} /></div>
                        <span className="text-sm font-medium uppercase">Ingresos Totales</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-800">{formatMoney(resumen.totalIngresos)}</p>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between">
                    <div className="flex items-center gap-3 text-gray-500 mb-2">
                        <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><CreditCard size={20} /></div>
                        <span className="text-sm font-medium uppercase">Diezmos</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-800">{formatMoney(resumen.diezmos)}</p>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between">
                    <div className="flex items-center gap-3 text-gray-500 mb-2">
                        <div className="p-2 bg-purple-50 rounded-lg text-purple-600"><PieChart size={20} /></div>
                        <span className="text-sm font-medium uppercase">Ofrendas</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-800">{formatMoney(resumen.ofrendas)}</p>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between">
                    <div className="flex items-center gap-3 text-gray-500 mb-2">
                        <div className="p-2 bg-red-50 rounded-lg text-red-600"><TrendingDown size={20} /></div>
                        <span className="text-sm font-medium uppercase">Gastos</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-800">{formatMoney(resumen.gastos)}</p>
                </div>
            </div>

            {/* ACTION BAR */}
            <div className="flex flex-wrap gap-4">
                <button
                    onClick={() => { setModalType('DIEZMO'); setShowModal(true); }}
                    className="flex items-center gap-2 px-4 py-2 bg-[#15344f] text-white rounded-lg hover:bg-[#112a40] transition-colors font-medium shadow-sm"
                >
                    <PlusCircle size={18} /> Registrar Diezmo
                </button>
                <button
                    onClick={() => { setModalType('OFRENDA'); setShowModal(true); }}
                    className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                    <PlusCircle size={18} /> Registrar Ofrenda
                </button>
                <button
                    onClick={() => { setModalType('GASTO'); setShowModal(true); }}
                    className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 border border-gray-200 rounded-lg hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-colors font-medium"
                >
                    <TrendingDown size={18} /> Registrar Gasto
                </button>
            </div>

            {/* RESUMEN VISUAL & TABLA */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Balance Chart Simple */}
                <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit">
                    <h3 className="font-bold text-gray-800 mb-6">Balance del Periodo</h3>

                    <div className="space-y-6">
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-gray-500">Neto Disponible</span>
                                <span className={`font-bold ${resumen.totalIngresos - resumen.totalEgresos >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {formatMoney(resumen.totalIngresos - resumen.totalEgresos)}
                                </span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                                <div
                                    className="bg-green-500 h-2 rounded-full"
                                    style={{ width: `${Math.min((resumen.totalIngresos / (resumen.totalIngresos + resumen.totalEgresos || 1)) * 100, 100)}%` }}
                                ></div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-50">
                            <div>
                                <span className="block text-xs text-gray-400 uppercase">Total Ingresos</span>
                                <span className="text-green-600 font-bold">{formatMoney(resumen.totalIngresos)}</span>
                            </div>
                            <div>
                                <span className="block text-xs text-gray-400 uppercase">Total Egresos</span>
                                <span className="text-red-600 font-bold">{formatMoney(resumen.totalEgresos)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Transaction Table */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-50">
                        <h3 className="font-bold text-gray-800">Últimos Movimientos</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-50/50 text-xs text-gray-500 uppercase font-semibold">
                                <tr>
                                    <th className="px-6 py-4">Fecha</th>
                                    <th className="px-6 py-4">Tipo</th>
                                    <th className="px-6 py-4">Detalle</th>
                                    <th className="px-6 py-4 text-right">Monto</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 text-sm opacity-100 trasition-opacity duration-300">
                                {loading && (<tr><td colSpan="4" className="text-center py-8 text-gray-400">Cargando...</td></tr>)}
                                {!loading && transacciones.length === 0 && (
                                    <tr><td colSpan="4" className="text-center py-8 text-gray-400">No hay movimientos registrados.</td></tr>
                                )}
                                {transacciones.map((t) => (
                                    <tr key={t.id} className="hover:bg-blue-50/30 transition-colors">
                                        <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                <Calendar size={14} className="text-gray-300" />
                                                {t.fecha}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold capitalize
                                                ${t.tipo === 'DIEZMO' ? 'bg-blue-50 text-blue-700' :
                                                    t.tipo === 'OFRENDA' ? 'bg-purple-50 text-purple-700' :
                                                        'bg-red-50 text-red-700'}`}>
                                                {t.tipo === 'DIEZMO' && <User size={12} />}
                                                {t.tipo === 'OFRENDA' && <Heart size={12} />} // Heart icon needed import? No, reusing PieChart logic visually or add Heart import
                                                {t.tipo === 'GASTO' && <TrendingDown size={12} />}
                                                {t.tipo.toLowerCase()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-700 font-medium">
                                            {t.detalle}
                                        </td>
                                        <td className={`px-6 py-4 text-right font-bold ${t.esIngreso ? 'text-green-600' : 'text-red-600'}`}>
                                            {t.esIngreso ? '+' : '-'}{formatMoney(t.monto)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* MODAL */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="bg-[#15344f] p-4 flex justify-between items-center text-white">
                            <h3 className="font-bold flex items-center gap-2">
                                <PlusCircle size={18} />
                                {modalType === 'DIEZMO' && 'Registrar Nuevo Diezmo'}
                                {modalType === 'OFRENDA' && 'Registrar Nueva Ofrenda'}
                                {modalType === 'GASTO' && 'Registrar Nuevo Gasto'}
                            </h3>
                            <button onClick={() => setShowModal(false)} className="hover:bg-white/10 p-1 rounded transition-colors">&times;</button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Monto</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-2.5 text-gray-400 font-bold">$</span>
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        className="w-full pl-8 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#15344f] outline-none"
                                        value={formData.monto}
                                        onChange={e => setFormData({ ...formData, monto: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Fecha</label>
                                <input
                                    type="date"
                                    required
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#15344f] outline-none"
                                    value={formData.fecha}
                                    onChange={e => setFormData({ ...formData, fecha: e.target.value })}
                                />
                            </div>

                            {/* CAMPOS ESPECÍFICOS */}
                            {modalType === 'DIEZMO' && (
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Miembro</label>
                                    <select
                                        required
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#15344f] outline-none"
                                        value={formData.miembroId}
                                        onChange={e => setFormData({ ...formData, miembroId: e.target.value })}
                                    >
                                        <option value="">Seleccione un miembro...</option>
                                        {miembros.map(m => (
                                            <option key={m.id} value={m.id}>{m.nombre} {m.apellidos}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {modalType === 'OFRENDA' && (
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Tipo de Ofrenda</label>
                                    <select
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#15344f] outline-none"
                                        value={formData.tipoOfrenda}
                                        onChange={e => setFormData({ ...formData, tipoOfrenda: e.target.value })}
                                    >
                                        <option value="General">Ofrenda General</option>
                                        <option value="Misiones">Misiones</option>
                                        <option value="Pro-Templo">Pro-Templo</option>
                                        <option value="Escuela Dominical">Escuela Dominical</option>
                                        <option value="Especial">Ofrenda Especial</option>
                                    </select>
                                </div>
                            )}

                            {(modalType === 'GASTO' || modalType === 'DIEZMO') && (
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                                        {modalType === 'DIEZMO' ? 'Observación (Opcional)' : 'Descripción del Gasto'}
                                    </label>
                                    <input
                                        type="text"
                                        required={modalType === 'GASTO'}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#15344f] outline-none"
                                        placeholder={modalType === 'DIEZMO' ? 'Ej: Transferencia' : 'Ej: Pago de Luz'}
                                        value={formData.descripcion}
                                        onChange={e => setFormData({ ...formData, descripcion: e.target.value })}
                                    />
                                </div>
                            )}

                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 py-2.5 bg-gray-100 text-gray-700 font-bold rounded-lg hover:bg-gray-200 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-2.5 bg-[#15344f] text-white font-bold rounded-lg hover:bg-[#112a40] transition-colors"
                                >
                                    Guardar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
