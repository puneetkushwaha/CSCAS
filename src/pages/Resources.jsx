import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FileText,
    Book,
    Download,
    Search,
    Newspaper,
    Layout,
    Database,
    Shield,
    Glasses,
    ExternalLink,
    Terminal,
    ArrowRight,
    X,
    CheckCircle2,
    Lock,
    Cpu,
    Zap,
    Loader2
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ngdPic from '../assets/images/ngd-pic.png';
import api from '../utils/api';
import { toast } from 'react-toastify';

const getResourceIcon = (type) => {
    switch (type) {
        case 'Blog': return <Layout size={32} />;
        case 'Whitepaper': return <FileText size={32} />;
        case 'Blueprint': return <Terminal size={32} />;
        case 'Handbook': return <Book size={32} />;
        case 'Case Study': return <Database size={32} />;
        default: return <Search size={32} />;
    }
};

const getResourceColor = (type) => {
    switch (type) {
        case 'Blog': return "from-purple-500/10 to-transparent";
        case 'Whitepaper': return "from-blue-500/10 to-transparent";
        case 'Blueprint': return "from-red-500/10 to-transparent";
        case 'Handbook': return "from-emerald-500/10 to-transparent";
        case 'Case Study': return "from-orange-500/10 to-transparent";
        default: return "from-indigo-500/10 to-transparent";
    }
};

const ResourceModal = ({ isOpen, onClose, data }) => {
    if (!isOpen || !data) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-black/90 backdrop-blur-xl"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="w-full max-w-4xl max-h-[90vh] bg-[#0a0a0a] border border-lh-purple/30 rounded-[40px] overflow-hidden relative flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                {/* Header Section */}
                <div className="p-8 md:p-12 pb-6 border-b border-white/5 relative">
                    <button
                        onClick={onClose}
                        className="absolute top-8 right-8 p-3 bg-white/5 hover:bg-white/10 rounded-full transition-all text-gray-400 hover:text-white"
                    >
                        <X size={20} />
                    </button>

                    <div className="flex items-center gap-6 mb-6">
                        <div className="p-5 bg-lh-purple/10 rounded-3xl border border-lh-purple/20 text-lh-purple">
                            {getResourceIcon(data.type)}
                        </div>
                        <div>
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-lh-purple mb-2 block">{data.tag} Content</span>
                            <h2 className="text-3xl md:text-4xl font-[900] uppercase tracking-tighter text-white">{data.title}</h2>
                        </div>
                    </div>
                    <p className="text-gray-400 text-lg leading-relaxed max-w-2xl">{data.description}</p>
                </div>

                {/* Content Section */}
                <div className="flex-1 overflow-y-auto p-8 md:p-12 space-y-10 custom-scrollbar">
                    {data.details && data.details.length > 0 && (
                        <div className="grid md:grid-cols-2 gap-8">
                            {data.details.map((section, idx) => (
                                <div key={idx} className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-lh-purple/20 transition-all group">
                                    <h4 className="text-lh-purple font-black text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-lh-purple"></div>
                                        {section.label}
                                    </h4>
                                    <p className="text-sm text-gray-400 group-hover:text-gray-300">
                                        {section.value}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}

                    {data.outcome && (
                        <div className="p-8 rounded-[32px] bg-gradient-to-br from-lh-purple/10 to-transparent border border-lh-purple/20">
                            <h4 className="text-white font-black text-xs uppercase tracking-widest mb-3 flex items-center gap-2">
                                <Zap size={14} className="text-lh-purple" />
                                Expected Outcome
                            </h4>
                            <p className="text-gray-300 text-sm leading-relaxed italic">
                                "{data.outcome}"
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="p-8 md:p-10 border-t border-white/5 bg-white/[0.01] flex flex-wrap items-center justify-between gap-6">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500/80">Premium Resource Access Granted</span>
                    </div>
                    <button
                        onClick={() => data.link ? window.open(data.link, '_blank') : toast.info("Resource link pending implementation.")}
                        className="py-4 px-10 bg-lh-purple text-white rounded-full font-black text-xs uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all flex items-center gap-2 shadow-[0_10px_30px_rgba(188,19,254,0.2)]"
                    >
                        Access Now <ExternalLink size={14} />
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
};

const Resources = () => {
    const [selectedResource, setSelectedResource] = useState(null);
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResources = async () => {
            try {
                const response = await api.get('/resources');
                setResources(response.data);
            } catch (error) {
                console.error("Failed to fetch resources:", error);
                toast.error("Failed to load resources.");
            } finally {
                setLoading(false);
            }
        };
        fetchResources();
    }, []);

    return (
        <div className="bg-[#050505] min-h-screen text-white font-plus-jakarta overflow-x-hidden selection:bg-lh-purple selection:text-white">
            <Navbar />

            {/* --- Hero Section --- */}
            <section className="relative pt-40 pb-20 px-6 overflow-hidden">
                <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-lh-purple/10 blur-[180px] rounded-full"></div>
                <div className="absolute bottom-[20%] right-[-10%] w-[500px] h-[500px] bg-blue-500/5 blur-[150px] rounded-full"></div>

                <div className="max-w-[1300px] mx-auto grid lg:grid-cols-2 gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="space-y-8 relative z-10 text-left"
                    >
                        <div className="flex items-center gap-3 text-lh-purple">
                            <Shield size={20} className="animate-pulse" />
                            <span className="uppercase tracking-[0.4em] text-[11px] font-black">Knowledge Hub</span>
                        </div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-5xl md:text-8xl font-[1000] tracking-tighter uppercase leading-none"
                        >
                            CSCA <br />
                            <span className="text-lh-purple">Resources</span>
                        </motion.h1>

                        <p className="text-gray-400 text-lg font-medium max-w-xl leading-relaxed">
                            Access our complete library of technical documentation, handbooks, whitepapers, research, and industry-level cybersecurity content.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1 }}
                        className="relative flex justify-center items-center h-[400px] lg:h-[500px] order-first lg:order-last"
                    >
                        <div className="absolute inset-0 bg-lh-purple/10 blur-[100px] rounded-full scale-75 animate-pulse"></div>
                        <div className="absolute w-[85%] h-[75%] bg-white/[0.02] backdrop-blur-3xl border border-white/5 rounded-[60px] transform rotate-3"></div>
                        <img
                            src={ngdPic}
                            alt="Mascot"
                            className="relative z-10 w-full max-w-[320px] animate-float-glow drop-shadow-[0_0_50px_rgba(188,19,254,0.3)]"
                        />
                    </motion.div>
                </div>
            </section>

            {/* --- Resources Grid --- */}
            <section className="py-24 px-6 relative z-10">
                <div className="max-w-[1300px] mx-auto">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-32 space-y-6">
                            <Loader2 className="animate-spin text-lh-purple" size={64} />
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.6em]">Synchronizing_Intelligence...</p>
                        </div>
                    ) : resources.length > 0 ? (
                        <>
                            {/* Mobile: Simple single column layout */}
                            <div className="grid md:hidden grid-cols-1 gap-6">
                                {resources.map((item, idx) => (
                                    <motion.div
                                        key={item._id}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: idx * 0.05 }}
                                        viewport={{ once: true }}
                                        onClick={() => setSelectedResource(item)}
                                    >
                                        <div
                                            className="group relative w-full bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-[32px] overflow-hidden flex flex-col p-10 transition-all duration-500 hover:border-lh-purple/50 hover:bg-white/[0.05] hover:shadow-[0_20px_60px_rgba(188,19,254,0.1)] cursor-pointer"
                                        >
                                            <div className={`absolute inset-0 bg-gradient-to-br ${getResourceColor(item.type)} opacity-0 group-hover:opacity-100 transition-opacity duration-700`}></div>

                                            <div className="relative z-10 flex flex-col justify-between">
                                                <div className="flex justify-between items-start mb-6">
                                                    <div className="p-4 bg-white/5 rounded-2xl text-white group-hover:text-lh-purple group-hover:bg-lh-purple/10 transition-all duration-500">
                                                        {getResourceIcon(item.type)}
                                                    </div>
                                                    <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-white/5 rounded-full text-white/40 group-hover:text-lh-purple group-hover:bg-lh-purple/10 transition-all">
                                                        {item.tag}
                                                    </span>
                                                </div>

                                                <div className="space-y-4">
                                                    <h3 className="text-2xl font-black uppercase tracking-tight leading-tight text-white group-hover:text-lh-purple transition-colors">
                                                        {item.title}
                                                    </h3>
                                                    <p className="text-gray-400 text-base leading-relaxed font-medium group-hover:text-gray-300 transition-colors">
                                                        {item.description}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="absolute inset-0 opacity-0 group-hover:opacity-[0.03] pointer-events-none transition-opacity duration-700 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]"></div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Desktop: Bento grid layout */}
                            <div className="hidden md:grid grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-[280px]">
                                {resources.map((item, idx) => {
                                    // Map some logic for grid size variety
                                    const isWide = (idx % 5 === 0); // Every 5th item is wide
                                    const isTall = (idx % 7 === 2); // Every 7th item is tall
                                    const sizePrefix = isWide ? "md:col-span-2 " : "";
                                    const sizeSuffix = isTall ? "row-span-2 " : "row-span-1";

                                    return (
                                        <motion.div
                                            key={item._id}
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            whileInView={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: (idx % 8) * 0.05 }}
                                            viewport={{ once: true }}
                                            className={`${sizePrefix}${sizeSuffix}`}
                                            onClick={() => setSelectedResource(item)}
                                        >
                                            <div
                                                className="group relative h-full w-full bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-[32px] overflow-hidden flex flex-col p-8 transition-all duration-500 hover:border-lh-purple/50 hover:bg-white/[0.05] hover:shadow-[0_20px_60px_rgba(188,19,254,0.1)] cursor-pointer"
                                            >
                                                <div className={`absolute inset-0 bg-gradient-to-br ${getResourceColor(item.type)} opacity-0 group-hover:opacity-100 transition-opacity duration-700`}></div>

                                                <div className="relative z-10 flex flex-col h-full">
                                                    <div className="flex justify-between items-start mb-6">
                                                        <div className="p-4 bg-white/5 rounded-2xl text-white group-hover:text-lh-purple group-hover:bg-lh-purple/10 transition-all duration-500">
                                                            {getResourceIcon(item.type)}
                                                        </div>
                                                        <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-white/5 rounded-full text-white/40 group-hover:text-lh-purple group-hover:bg-lh-purple/10 transition-all">
                                                            {item.tag}
                                                        </span>
                                                    </div>

                                                    <div className="space-y-3 flex-grow">
                                                        <h3 className="text-xl font-black uppercase tracking-tight leading-tight group-hover:text-white transition-colors">
                                                            {item.title}
                                                        </h3>
                                                        <p className="text-gray-400 text-sm leading-relaxed font-medium line-clamp-3 group-hover:text-gray-300 transition-colors">
                                                            {item.description}
                                                        </p>
                                                    </div>

                                                    <div className="flex items-center justify-between pt-6 border-t border-white/5 mt-auto">
                                                        <div className="flex items-center gap-2">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-lh-purple animate-pulse"></span>
                                                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Technical Deep-Dive Available</span>
                                                        </div>
                                                        <ArrowRight size={18} className="text-lh-purple opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-500" />
                                                    </div>
                                                </div>
                                                <div className="absolute inset-0 opacity-0 group-hover:opacity-[0.03] pointer-events-none transition-opacity duration-700 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]"></div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </>
                    ) : (
                        <div className="py-24 text-center border-2 border-dashed border-white/10 rounded-[40px] bg-white/[0.01]">
                            <p className="text-[12px] font-black text-gray-600 uppercase tracking-[0.6em]">No resources digitized in this sector yet.</p>
                        </div>
                    )}
                </div>
            </section>

            <AnimatePresence>
                {selectedResource && (
                    <ResourceModal
                        isOpen={!!selectedResource}
                        onClose={() => setSelectedResource(null)}
                        data={selectedResource}
                    />
                )}
            </AnimatePresence>

            <Footer />
        </div>
    );
};

export default Resources;
