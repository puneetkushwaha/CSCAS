import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit, X, Save, Globe } from 'lucide-react';
import api from '../../utils/api';
import { toast } from 'react-toastify';

const EMPTY_FORM = {
    id: '',
    title: '',
    tagline: '',
    desc: '',
    roles: '',
    risks: '',
    rec: '',
    icon: 'Globe',
    color: 'from-blue-600/10 to-transparent',
    isActive: true,
};

const SX = {
    input: 'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-lh-purple placeholder-gray-600 transition-all',
    label: 'block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2',
    glass: 'bg-white/[0.02] backdrop-blur-md border border-white/5',
};

const IndustrySectorsManager = () => {
    const [sectors, setSectors] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null); // the 'id' field
    const [form, setForm] = useState(EMPTY_FORM);
    const [saving, setSaving] = useState(false);

    const fetchSectors = async () => {
        try {
            const res = await api.get('/industries');
            setSectors(res.data);
        } catch (err) {
            toast.error('Failed to load industry sectors');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSectors();
    }, []);

    const handleOpenAdd = () => {
        setForm(EMPTY_FORM);
        setEditingId(null);
        setShowForm(true);
    };

    const handleOpenEdit = (sector) => {
        setForm({
            id: sector.id,
            title: sector.title,
            tagline: sector.tagline,
            desc: sector.desc,
            roles: sector.roles || '',
            risks: sector.risks || '',
            rec: sector.rec || '',
            icon: sector.icon,
            color: sector.color,
            isActive: sector.isActive !== false,
        });
        setEditingId(sector.id);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this sector?')) return;
        try {
            await api.delete(`/industries/${id}`);
            toast.success('Sector deleted');
            fetchSectors();
        } catch (err) {
            toast.error('Failed to delete sector');
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (editingId) {
                await api.put(`/industries/${editingId}`, form);
                toast.success('Sector updated!');
            } else {
                await api.post('/industries', form);
                toast.success('Sector created!');
            }
            setShowForm(false);
            setEditingId(null);
            fetchSectors();
        } catch (err) {
            toast.error(err?.response?.data?.message || 'Save failed');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white/[0.02] p-2 rounded-2xl border border-white/5">
                <span className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                    {sectors.length} Industry Sectors
                </span>
                <button
                    onClick={handleOpenAdd}
                    className="px-6 py-3 bg-white text-black hover:bg-lh-purple hover:text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.1)] active:scale-95"
                >
                    <Plus size={16} /> Add Sector
                </button>
            </div>

            {isLoading ? (
                <div className="text-center py-20 text-gray-500">Loading...</div>
            ) : sectors.length === 0 ? (
                <div className="text-center py-20 border border-dashed border-white/10 rounded-3xl text-gray-500">
                    <Globe size={40} className="mx-auto mb-4 opacity-20" />
                    <p className="text-xs font-bold uppercase tracking-widest">No industry sectors found</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {sectors.map((sector) => (
                        <div key={sector._id} className={`p-5 rounded-2xl ${SX.glass} group hover:border-lh-purple/20 transition-all`}>
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <h3 className="text-sm font-black text-white uppercase tracking-tight leading-tight">{sector.title}</h3>
                                    <p className="text-[10px] text-lh-purple uppercase tracking-widest">{sector.tagline}</p>
                                </div>
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => handleOpenEdit(sector)} className="p-2 bg-yellow-500/10 text-yellow-500 rounded-lg hover:bg-yellow-500/20 transition-all"><Edit size={14} /></button>
                                    <button onClick={() => handleDelete(sector.id)} className="p-2 bg-rose-500/10 text-rose-500 rounded-lg hover:bg-rose-500/20 transition-all"><Trash2 size={14} /></button>
                                </div>
                            </div>
                            <p className="text-xs text-gray-500 line-clamp-2 mb-3">{sector.desc}</p>
                            <div className="flex items-center justify-between pt-3 border-t border-white/5">
                                <span className={`text-[9px] font-black px-2 py-1 rounded-full uppercase ${sector.isActive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                                    {sector.isActive ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <AnimatePresence>
                {showForm && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
                        <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }} onClick={(e) => e.stopPropagation()} className="w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 max-h-[90vh] overflow-y-auto">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-black uppercase tracking-tighter">{editingId ? 'Edit Sector' : 'New Sector'}</h3>
                                <button onClick={() => setShowForm(false)} className="p-2 rounded-xl hover:bg-white/5 text-gray-500 hover:text-white transition-all"><X size={20} /></button>
                            </div>
                            <form onSubmit={handleSave} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className={SX.label}>ID / Slug *</label>
                                        <input required className={SX.input} value={form.id} onChange={e => setForm({ ...form, id: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className={SX.label}>Title *</label>
                                        <input required className={SX.input} value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
                                    </div>
                                </div>
                                <div>
                                    <label className={SX.label}>Tagline *</label>
                                    <input required className={SX.input} value={form.tagline} onChange={e => setForm({ ...form, tagline: e.target.value })} />
                                </div>
                                <div>
                                    <label className={SX.label}>Description *</label>
                                    <textarea required rows={3} className={`${SX.input} resize-none`} value={form.desc} onChange={e => setForm({ ...form, desc: e.target.value })} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className={SX.label}>Roles</label>
                                        <input className={SX.input} value={form.roles} onChange={e => setForm({ ...form, roles: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className={SX.label}>Risks</label>
                                        <input className={SX.input} value={form.risks} onChange={e => setForm({ ...form, risks: e.target.value })} />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className={SX.label}>Rec</label>
                                        <input className={SX.input} value={form.rec} onChange={e => setForm({ ...form, rec: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className={SX.label}>Icon (Lucide name) *</label>
                                        <input required className={SX.input} value={form.icon} onChange={e => setForm({ ...form, icon: e.target.value })} />
                                    </div>
                                </div>
                                <div>
                                    <label className={SX.label}>Color Gradient *</label>
                                    <input required className={SX.input} value={form.color} onChange={e => setForm({ ...form, color: e.target.value })} />
                                </div>
                                <div className="flex gap-6 pt-2">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" checked={form.isActive} onChange={e => setForm({ ...form, isActive: e.target.checked })} className="accent-lh-purple" />
                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Active / Visible</span>
                                    </label>
                                </div>
                                <button type="submit" disabled={saving} className="w-full py-4 bg-gradient-to-r from-lh-purple to-purple-800 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-2">
                                    {saving ? 'Saving...' : <><Save size={16} /> {editingId ? 'Update Sector' : 'Create Sector'}</>}
                                </button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default IndustrySectorsManager;
