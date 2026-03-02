import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit, X, Save, FileText, Layout, Book, Terminal, Database, Search } from 'lucide-react';
import api from '../../utils/api';
import { toast } from 'react-toastify';

const RESOURCE_TYPES = ['Blog', 'Whitepaper', 'Blueprint', 'Handbook', 'Case Study'];

const EMPTY_FORM = {
    title: '',
    description: '',
    type: 'Blog',
    tag: '',
    outcome: '',
    link: '',
    details: [{ label: '', value: '' }],
    isActive: true,
};

const SX = {
    input: 'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-lh-purple placeholder-gray-600 transition-all',
    label: 'block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2',
    glass: 'bg-white/[0.02] backdrop-blur-md border border-white/5',
};

const ResourceManager = () => {
    const [resources, setResources] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [saving, setSaving] = useState(false);

    const fetchResources = async () => {
        try {
            const res = await api.get('/resources/admin');
            setResources(res.data);
        } catch (err) {
            toast.error('Failed to load resources');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchResources();
    }, []);

    const handleOpenAdd = () => {
        setForm(EMPTY_FORM);
        setEditingId(null);
        setShowForm(true);
    };

    const handleOpenEdit = (resource) => {
        setForm({
            title: resource.title,
            description: resource.description,
            type: resource.type,
            tag: resource.tag || '',
            outcome: resource.outcome || '',
            link: resource.link || '',
            details: resource.details?.length > 0 ? resource.details : [{ label: '', value: '' }],
            isActive: resource.isActive !== false,
        });
        setEditingId(resource._id);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this resource?')) return;
        try {
            await api.delete(`/resources/${id}`);
            toast.success('Resource deleted');
            fetchResources();
        } catch (err) {
            toast.error('Failed to delete resource');
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const payload = {
                ...form,
                details: form.details.filter(d => d.label && d.value),
            };
            if (editingId) {
                await api.put(`/resources/${editingId}`, payload);
                toast.success('Resource updated!');
            } else {
                await api.post('/resources', payload);
                toast.success('Resource created!');
            }
            setShowForm(false);
            setEditingId(null);
            fetchResources();
        } catch (err) {
            toast.error(err?.response?.data?.message || 'Save failed');
        } finally {
            setSaving(false);
        }
    };

    const addDetail = () => {
        setForm({ ...form, details: [...form.details, { label: '', value: '' }] });
    };

    const removeDetail = (index) => {
        const newDetails = [...form.details];
        newDetails.splice(index, 1);
        setForm({ ...form, details: newDetails });
    };

    const updateDetail = (index, field, value) => {
        const newDetails = [...form.details];
        newDetails[index][field] = value;
        setForm({ ...form, details: newDetails });
    };

    const getIcon = (type) => {
        switch (type) {
            case 'Blog': return <Layout size={16} />;
            case 'Whitepaper': return <FileText size={16} />;
            case 'Blueprint': return <Terminal size={16} />;
            case 'Handbook': return <Book size={16} />;
            case 'Case Study': return <Database size={16} />;
            default: return <Search size={16} />;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white/[0.02] p-2 rounded-2xl border border-white/5">
                <span className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                    {resources.length} Knowledge Resources
                </span>
                <button
                    onClick={handleOpenAdd}
                    className="px-6 py-3 bg-white text-black hover:bg-lh-purple hover:text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.1)] active:scale-95"
                >
                    <Plus size={16} /> Add Resource
                </button>
            </div>

            {isLoading ? (
                <div className="text-center py-20 text-gray-500">Loading...</div>
            ) : resources.length === 0 ? (
                <div className="text-center py-20 border border-dashed border-white/10 rounded-3xl text-gray-500">
                    <FileText size={40} className="mx-auto mb-4 opacity-20" />
                    <p className="text-xs font-bold uppercase tracking-widest">No resources found</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {resources.map((res) => (
                        <div key={res._id} className={`p-5 rounded-2xl ${SX.glass} group hover:border-lh-purple/20 transition-all`}>
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-lh-purple/10 text-lh-purple rounded-lg">
                                        {getIcon(res.type)}
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-black text-white uppercase tracking-tight leading-tight">{res.title}</h3>
                                        <p className="text-[10px] text-lh-purple uppercase tracking-widest">{res.tag} • {res.type}</p>
                                    </div>
                                </div>
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => handleOpenEdit(res)} className="p-2 bg-yellow-500/10 text-yellow-500 rounded-lg hover:bg-yellow-500/20 transition-all"><Edit size={14} /></button>
                                    <button onClick={() => handleDelete(res._id)} className="p-2 bg-rose-500/10 text-rose-500 rounded-lg hover:bg-rose-500/20 transition-all"><Trash2 size={14} /></button>
                                </div>
                            </div>
                            <p className="text-xs text-gray-500 line-clamp-2 mb-3">{res.description}</p>
                            <div className="flex items-center justify-between pt-3 border-t border-white/5">
                                <span className={`text-[9px] font-black px-2 py-1 rounded-full uppercase ${res.isActive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                                    {res.isActive ? 'Active' : 'Inactive'}
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
                                <h3 className="text-xl font-black uppercase tracking-tighter">{editingId ? 'Edit Resource' : 'New Resource'}</h3>
                                <button onClick={() => setShowForm(false)} className="p-2 rounded-xl hover:bg-white/5 text-gray-500 hover:text-white transition-all"><X size={20} /></button>
                            </div>
                            <form onSubmit={handleSave} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className={SX.label}>Title *</label>
                                        <input required className={SX.input} value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className={SX.label}>Type *</label>
                                        <select required className={SX.input} value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                                            {RESOURCE_TYPES.map(t => <option key={t} value={t} className="bg-black">{t}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className={SX.label}>Description *</label>
                                    <textarea required rows={3} className={`${SX.input} resize-none`} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className={SX.label}>Tag (e.g. SECURITY)</label>
                                        <input className={SX.input} value={form.tag} onChange={e => setForm({ ...form, tag: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className={SX.label}>Outcome / Goal</label>
                                        <input className={SX.input} value={form.outcome} onChange={e => setForm({ ...form, outcome: e.target.value })} />
                                    </div>
                                </div>
                                <div>
                                    <label className={SX.label}>Resource Link (URL)</label>
                                    <input className={SX.input} value={form.link} onChange={e => setForm({ ...form, link: e.target.value })} />
                                </div>

                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <label className={SX.label}>Details (Key Info)</label>
                                        <button type="button" onClick={addDetail} className="text-[10px] font-black text-lh-purple uppercase hover:underline">Add Pair</button>
                                    </div>
                                    <div className="space-y-2">
                                        {form.details.map((detail, idx) => (
                                            <div key={idx} className="flex gap-2">
                                                <input placeholder="Label (e.g. READ_TIME)" className={SX.input} value={detail.label} onChange={e => updateDetail(idx, 'label', e.target.value)} />
                                                <input placeholder="Value (e.g. 12 MIN)" className={SX.input} value={detail.value} onChange={e => updateDetail(idx, 'value', e.target.value)} />
                                                {form.details.length > 1 && (
                                                    <button type="button" onClick={() => removeDetail(idx)} className="p-3 text-red-500 hover:bg-red-500/10 rounded-xl transition-all"><X size={16} /></button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex gap-6 pt-2">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" checked={form.isActive} onChange={e => setForm({ ...form, isActive: e.target.checked })} className="accent-lh-purple" />
                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Active / Visible</span>
                                    </label>
                                </div>
                                <button type="submit" disabled={saving} className="w-full py-4 bg-gradient-to-r from-lh-purple to-purple-800 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-2">
                                    {saving ? 'Saving...' : <><Save size={16} /> {editingId ? 'Update Resource' : 'Create Resource'}</>}
                                </button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ResourceManager;
