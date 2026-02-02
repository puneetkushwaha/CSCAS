import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Database, Eye, Shield, Target, Activity, Cloud, Cpu, ClipboardCheck, Wifi, Zap, Award, Globe } from 'lucide-react';
import { certifications as certificationsData } from '../data/certificationsData.jsx';
import CertificateSlider from '../components/CertificateSlider.jsx';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ngdPic from '../assets/images/ngd-pic.png';

const Certifications = () => {
    const [activeCategory, setActiveCategory] = useState('Overview');

    const filteredCertifications =
        activeCategory === 'Overview'
            ? []
            : certificationsData.filter(cert =>
                Array.isArray(cert.category)
                    ? cert.category.includes(activeCategory)
                    : cert.category === activeCategory
            );

    const categories = [
        { name: 'Red Team / Offensive Security', key: 'RED TEAM / OFFENSIVE SECURITY', emoji: '🛡️', icon: <Target className="text-white" />, color: 'from-red-600 to-red-800' },
        { name: 'Blue Team / Defensive Security', key: 'BLUE TEAM / DEFENSIVE SECURITY', emoji: '🔷', icon: <Shield className="text-white" />, color: 'from-blue-600 to-indigo-800' },
        { name: 'Cloud & DevSecOps', key: 'CLOUD & DEVSECOPS', emoji: '☁️', icon: <Cloud className="text-white" />, color: 'from-cyan-500 to-blue-700' },
        { name: 'AI & Emerging Tech', key: 'AI & EMERGING TECH', emoji: '🤖', icon: <Cpu className="text-white" />, color: 'from-purple-500 to-pink-700' },
        { name: 'Governance / ISO', key: 'GOVERNANCE / ISO', emoji: '📜', icon: <ClipboardCheck className="text-white" />, color: 'from-yellow-500 to-orange-600' },
        { name: 'Network Security', key: 'NETWORK SECURITY', emoji: '🛡️', icon: <Wifi className="text-white" />, color: 'from-green-600 to-emerald-700' },
        { name: 'Incident Response', key: 'INCIDENT RESPONSE', emoji: '⚡', icon: <Zap className="text-white" />, color: 'from-orange-500 to-red-700' },
        { name: 'Big Data Engineering', key: 'BIG DATA ENGINEERING', emoji: '🧮', icon: <Database className="text-white" />, color: 'from-pink-500 to-rose-700' },
    ];

    return (
        <div className="bg-[#050505] min-h-screen text-white font-plus-jakarta overflow-x-hidden selection:bg-lh-purple selection:text-white">
            <Navbar />

            {/* --- Section 1: Hero (CSCA Branded) --- */}
            <section className="relative pt-40 pb-20 px-6 overflow-hidden">
                {/* Background Glows */}
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-lh-purple/20 blur-[150px] rounded-full animate-pulse"></div>
                <div className="absolute bottom-[20%] left-[-5%] w-[300px] h-[300px] bg-blue-500/10 blur-[120px] rounded-full"></div>

                <div className="max-w-[1300px] mx-auto grid lg:grid-cols-2 gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="space-y-8 relative z-10"
                    >
                        <div className="flex items-center gap-3 text-lh-purple">
                            <Eye size={20} strokeWidth={2.5} className="animate-pulse" />
                            <span className="uppercase tracking-[0.4em] text-[11px] font-black">Global Standards v1.0</span>
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-7xl font-[900] leading-[1] tracking-tighter uppercase max-w-4xl">
                            Elite <br />
                            <span className="text-lh-purple italic">Certifications</span>
                        </h1>

                        <p className="text-gray-400 text-lg font-medium max-w-xl leading-relaxed">
                            Master the real-world cyber battlefield with industry-aligned certifications. From Red Team operations to AI Security, we define the global standard for elite technical training.
                        </p>

                        <div className="flex flex-wrap gap-4 pt-4">
                            <div className="flex items-center gap-6 px-8 py-4 bg-white/[0.03] border border-white/10 rounded-2xl backdrop-blur-xl">
                                <div className="text-lh-purple">
                                    <Award size={24} />
                                </div>
                                <p className="text-[11px] font-black uppercase tracking-widest text-white/60 leading-tight">
                                    Industry Validated <br />
                                    <span className="text-lh-purple">Global Credentials</span>
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* mascot on Right */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1 }}
                        className="relative flex justify-center items-center h-[500px] lg:h-[600px] order-first lg:order-last"
                    >
                        <div className="absolute inset-0 bg-lh-purple/10 blur-[100px] rounded-full scale-75 animate-pulse"></div>
                        <div className="absolute w-[85%] h-[75%] bg-white/[0.02] backdrop-blur-3xl border border-white/5 rounded-[60px] transform rotate-3"></div>
                        <img
                            src={ngdPic}
                            alt="Cyber Mascot"
                            className="relative z-10 w-full max-w-[420px] animate-float-glow drop-shadow-[0_0_50px_rgba(188,19,254,0.3)]"
                        />
                    </motion.div>
                </div>
            </section>

            <main className="pb-32 px-6 max-w-[1400px] mx-auto relative z-10">
                <AnimatePresence mode="wait">
                    {activeCategory === 'Overview' ? (
                        <motion.div
                            key="overview"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-24"
                        >
                            {/* CATEGORY GRID */}
                            <section>
                                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
                                    <div className="flex items-center gap-4">
                                        <div className="w-2 h-10 bg-lh-purple rounded-full"></div>
                                        <h2 className="text-3xl md:text-5xl font-[900] tracking-tighter uppercase">Select <span className="text-white/20">Domain</span></h2>
                                    </div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-lh-purple animate-pulse">Explore Excellence</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {categories.map((cat, i) => (
                                        <motion.button
                                            key={cat.key}
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                            viewport={{ once: true }}
                                            onClick={() => {
                                                setActiveCategory(cat.key);
                                                window.scrollTo({ top: 600, behavior: 'smooth' });
                                            }}
                                            className="group relative p-8 rounded-[40px] bg-white/[0.03] border border-white/10 hover:border-lh-purple/50 transition-all duration-500 text-left flex flex-col justify-between h-[280px] overflow-hidden"
                                        >
                                            <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-700`}></div>

                                            <div className="relative z-10">
                                                <div className="p-4 bg-white/5 w-fit rounded-2xl group-hover:bg-lh-purple/20 group-hover:text-lh-purple transition-all duration-500 mb-6 font-bold">
                                                    {React.cloneElement(cat.icon, { size: 24 })}
                                                </div>
                                                <h3 className="text-lg font-black text-white uppercase tracking-tight leading-tight group-hover:text-lh-purple transition-colors">{cat.name}</h3>
                                            </div>

                                            <div className="relative z-10 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/30 group-hover:text-white transition-all">
                                                Explore Modules <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                            </div>

                                            <div className="absolute top-[-20px] right-[-20px] text-8xl opacity-[0.02] group-hover:opacity-[0.05] transition-opacity rotate-12 pointer-events-none">
                                                {cat.emoji}
                                            </div>
                                        </motion.button>
                                    ))}
                                </div>
                            </section>

                            {/* BOTTOM CTA */}
                            <div className="p-1 rounded-[3rem] bg-gradient-to-r from-lh-purple/20 to-transparent">
                                <div className="p-12 md:p-16 rounded-[2.9rem] bg-[#0a0a0a] border border-white/5 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-lh-purple/10 blur-[100px] rounded-full group-hover:bg-lh-purple/20 transition-colors duration-700"></div>
                                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
                                        <div className="text-center md:text-left">
                                            <h3 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter mb-4">
                                                Training a Team?
                                            </h3>
                                            <p className="text-lg text-gray-400 max-w-lg leading-relaxed font-medium">
                                                Get enterprise-grade reporting, bulk discounts, and dedicated support for your SOC or IT team.
                                            </p>
                                        </div>
                                        <Link to="/enterprise">
                                            <button className="px-10 py-5 bg-lh-purple text-white font-black uppercase tracking-[0.2em] text-xs rounded-full hover:bg-white hover:text-black transition-all duration-300 shadow-[0_0_30px_rgba(188,19,254,0.3)] flex items-center gap-3">
                                                Enterprise Solutions <ChevronRight className="w-4 h-4" />
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="slider"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            {filteredCertifications.length > 0 ? (
                                <div className="space-y-10">
                                    <div className="flex items-center justify-between px-4">
                                        <button
                                            onClick={() => setActiveCategory('Overview')}
                                            className="flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.3em] text-white/40 hover:text-lh-purple transition-all"
                                        >
                                            <ChevronRight className="rotate-180" size={16} /> Back to Domains
                                        </button>
                                        <span className="text-[11px] font-black uppercase tracking-[0.3em] text-lh-purple">{activeCategory}</span>
                                    </div>
                                    <CertificateSlider data={filteredCertifications} onBack={() => setActiveCategory('Overview')} />
                                </div>
                            ) : (
                                <div className="py-32 flex flex-col items-center justify-center text-center border border-dashed border-white/10 rounded-[3rem] bg-white/[0.02]">
                                    <Database className="w-12 h-12 text-lh-purple mb-8 opacity-40 animate-pulse" />
                                    <h3 className="text-3xl font-black text-white uppercase tracking-tighter mb-4">Content Coming Soon</h3>
                                    <p className="text-gray-500 max-w-md text-lg font-medium">
                                        The laboratory environments and modules for <br />
                                        <span className="text-lh-purple">{activeCategory}</span> are being updated.
                                    </p>
                                    <button
                                        onClick={() => setActiveCategory('Overview')}
                                        className="mt-10 px-8 py-3 rounded-full border border-white/10 text-white font-black uppercase text-[10px] tracking-widest hover:border-lh-purple hover:bg-lh-purple/5 transition-all"
                                    >
                                        ← Back to Domains
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            <Footer />
        </div>
    );
};

export default Certifications;
