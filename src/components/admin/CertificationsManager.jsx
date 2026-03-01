import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit, X, Check, Save, Shield } from 'lucide-react';
import api from '../../utils/api';
import { toast } from 'react-toastify';

const EMPTY_FORM = {
    id: '',
    title: '',
    subtitle: '',
    code: '',
    level: 'Intermediate',
    description: '',
    category: '',
    price: '',
    image: '',
    color: 'from-purple-500 to-blue-500',
    popular: false,
    isActive: true,
};

const SX = {
    input: 'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-lh-purple placeholder-gray-600 transition-all',
    label: 'block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2',
    glass: 'bg-white/[0.02] backdrop-blur-md border border-white/5',
};

const CertificationsManager = () => {
    const [certifications, setCertifications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null); // mongo _id when editing
    const [form, setForm] = useState(EMPTY_FORM);
    const [saving, setSaving] = useState(false);

    const fetchCertifications = async () => {
        try {
            const res = await api.get('/certifications');
            setCertifications(res.data);
        } catch (err) {
            toast.error('Failed to load certifications');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCertifications();
    }, []);

    const handleOpenAdd = () => {
        setForm(EMPTY_FORM);
        setEditingId(null);
        setShowForm(true);
    };

    const handleOpenEdit = (cert) => {
        setForm({
            id: cert.id,
            title: cert.title,
            subtitle: cert.subtitle || '',
            code: cert.code,
            level: cert.level,
            description: cert.description,
            category: cert.category,
            price: cert.price,
            image: cert.image || '',
            color: cert.color || 'from-purple-500 to-blue-500',
            popular: cert.popular || false,
            isActive: cert.isActive !== false,
        });
        setEditingId(cert._id);
        setShowForm(true);
    };

    const handleDelete = async (certId) => {
        if (!window.confirm('Are you sure you want to delete this certification?')) return;
        try {
            await api.delete(`/certifications/${certId}`);
            toast.success('Certification deleted');
            fetchCertifications();
        } catch (err) {
            toast.error('Failed to delete certification');
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const payload = {
                ...form,
                price: Number(form.price),
            };
            if (editingId) {
                await api.put(`/certifications/${editingId}`, payload);
                toast.success('Certification updated!');
            } else {
                await api.post('/certifications', payload);
                toast.success('Certification created!');
            }
            setShowForm(false);
            setEditingId(null);
            fetchCertifications();
        } catch (err) {
            toast.error(err?.response?.data?.message || 'Save failed');
        } finally {
            setSaving(false);
        }
    };

    return (
        <motion.div
            key="certifications"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
        >
            {/* Header Bar */}
            <div className="flex justify-between items-center bg-white/[0.02] p-2 rounded-2xl border border-white/5">
                <span className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                    {certifications.length} Certification Programs
                </span>
                <button
                    onClick={handleOpenAdd}
                    className="px-6 py-3 bg-white text-black hover:bg-lh-purple hover:text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.1)] active:scale-95"
                >
                    <Plus size={16} /> Add Certification
                </button>
            </div>

            {/* Certifications List */}
            {isLoading ? (
                <div className="text-center py-20 text-gray-500">Loading...</div>
            ) : certifications.length === 0 ? (
                <div className="text-center py-20 border border-dashed border-white/10 rounded-3xl text-gray-500">
                    <Shield size={40} className="mx-auto mb-4 opacity-20" />
                    <p className="text-xs font-bold uppercase tracking-widest">No certification programs yet</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {certifications.map((cert) => (
                        <motion.div
                            key={cert._id}
                            layout
                            className={`p-5 rounded-2xl ${SX.glass} group hover:border-lh-purple/20 transition-all`}
                        >
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-lh-purple">{cert.code}</span>
                                    <h3 className="text-sm font-black text-white uppercase tracking-tight leading-tight mt-1">{cert.title.split(' – ')[0]}</h3>
                                    <p className="text-[10px] text-gray-500 uppercase tracking-widest">{cert.level}</p>
                                </div>
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => handleOpenEdit(cert)} className="p-2 bg-yellow-500/10 text-yellow-500 rounded-lg hover:bg-yellow-500/20 transition-all">
                                        <Edit size={14} />
                                    </button>
                                    <button onClick={() => handleDelete(cert._id)} className="p-2 bg-rose-500/10 text-rose-500 rounded-lg hover:bg-rose-500/20 transition-all">
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                            <p className="text-xs text-gray-500 line-clamp-2 mb-3">{cert.description}</p>
                            <div className="flex items-center justify-between pt-3 border-t border-white/5">
                                <span className="text-sm font-black text-white">₹{cert.price.toLocaleString()}</span>
                                <div className="flex gap-1.5">
                                    {cert.popular && <span className="text-[9px] font-black px-2 py-1 rounded-full bg-lh-purple/20 text-lh-purple uppercase">Popular</span>}
                                    <span className={`text-[9px] font-black px-2 py-1 rounded-full uppercase ${cert.isActive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                                        {cert.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Add / Edit Form Modal */}
            <AnimatePresence>
                {showForm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
                        onClick={() => setShowForm(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95 }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 overflow-y-auto max-h-[90vh]"
                        >
                            {/* Modal Header */}
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-black uppercase tracking-tighter">
                                    {editingId ? 'Edit Certification' : 'New Certification'}
                                </h3>
                                <button onClick={() => setShowForm(false)} className="p-2 rounded-xl hover:bg-white/5 text-gray-500 hover:text-white transition-all">
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleSave} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className={SX.label}>ID / Slug *</label>
                                        <input required className={SX.input} placeholder="e.g. cvs-apt" value={form.id} onChange={e => setForm({ ...form, id: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className={SX.label}>Code *</label>
                                        <input required className={SX.input} placeholder="e.g. CVS-APT" value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} />
                                    </div>
                                </div>

                                <div>
                                    <label className={SX.label}>Title *</label>
                                    <input required className={SX.input} placeholder="e.g. Advanced Penetration Testing – RedOps Specialist" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
                                </div>

                                <div>
                                    <label className={SX.label}>Subtitle</label>
                                    <input className={SX.input} placeholder="Short tagline" value={form.subtitle} onChange={e => setForm({ ...form, subtitle: e.target.value })} />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className={SX.label}>Level *</label>
                                        <select required className={`${SX.input} cursor-pointer`} value={form.level} onChange={e => setForm({ ...form, level: e.target.value })}>
                                            <option value="Beginner">Beginner</option>
                                            <option value="Intermediate">Intermediate</option>
                                            <option value="Advanced">Advanced</option>
                                            <option value="Expert">Expert</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className={SX.label}>Category *</label>
                                        <input required className={SX.input} placeholder="e.g. Red Team" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} />
                                    </div>
                                </div>

                                <div>
                                    <label className={SX.label}>Description *</label>
                                    <textarea required rows={3} className={`${SX.input} resize-none`} placeholder="Certification description..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className={SX.label}>Price (₹) *</label>
                                        <input required type="number" min="0" className={SX.input} placeholder="e.g. 4999" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className={SX.label}>Image URL</label>
                                        <input className={SX.input} placeholder="https://..." value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} />
                                    </div>
                                </div>

                                <div>
                                    <label className={SX.label}>Color Gradient</label>
                                    <input className={SX.input} placeholder="e.g. from-purple-500 to-blue-500" value={form.color} onChange={e => setForm({ ...form, color: e.target.value })} />
                                </div>

                                <div className="flex gap-6 pt-2">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" checked={form.popular} onChange={e => setForm({ ...form, popular: e.target.checked })} className="accent-lh-purple" />
                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Mark as Popular</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" checked={form.isActive} onChange={e => setForm({ ...form, isActive: e.target.checked })} className="accent-lh-purple" />
                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Active / Visible</span>
                                    </label>
                                </div>

                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="w-full py-4 bg-gradient-to-r from-lh-purple to-purple-800 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
                                >
                                    {saving ? 'Saving...' : (
                                        <><Save size={16} /> {editingId ? 'Update Certification' : 'Create Certification'}</>
                                    )}
                                </button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default CertificationsManager;
