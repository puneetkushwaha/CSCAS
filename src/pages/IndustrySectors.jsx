import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Globe, Landmark, Activity, Rocket, ShoppingCart, Factory, Wifi, Globe2, ArrowRight, Eye, Scan, Zap, Database } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ngdPic from '../assets/images/ngd-pic.png';

const IndustrySectors = () => {
    const [currentPage, setCurrentPage] = useState(0);
    const ITEMS_PER_PAGE = 8;

    const sectorIndustries = [
        {
            id: "cyber-infra",
            title: "Critical Infrastructure",
            tagline: "Energy & Utilities",
            desc: "Securing smart grids, nuclear facilities, and water treatment plants from state-sponsored threats and ransomware.",
            icon: <Shield size={24} />,
            color: "from-red-600/10 to-transparent"
        },
        {
            id: "bfsi",
            title: "BFSI Sector",
            tagline: "Banking & Finance",
            desc: "Protecting global financial transactions, preventing fraud in digital banking, and ensuring compliance with PCI-DSS standards.",
            icon: <Landmark size={24} />,
            color: "from-blue-600/10 to-transparent"
        },
        {
            id: "healthcare",
            title: "Healthcare & Pharma",
            tagline: "Medical Security",
            desc: "Safeguarding sensitive patient data (HIPAA) and protecting connected medical devices from critical vulnerabilities.",
            icon: <Activity size={24} />,
            color: "from-emerald-600/10 to-transparent"
        },
        {
            id: "gov-defense",
            title: "Gov & Defense",
            tagline: "National Security",
            desc: "Building resilient systems for government agencies and military contractors to defend against cyber espionage.",
            icon: <Shield size={24} />,
            color: "from-purple-600/10 to-transparent"
        },
        {
            id: "ecommerce",
            title: "eCommerce & Retail",
            tagline: "Digital Commerce",
            desc: "Ensuring secure checkout experiences, protecting customer identities, and preventing large-scale data breaches.",
            icon: <ShoppingCart size={24} />,
            color: "from-amber-600/10 to-transparent"
        },
        {
            id: "manufacturing",
            title: "Manufacturing",
            tagline: "Industry 4.0",
            desc: "Securing Operational Technology (OT) and IoT devices on the factory floor to prevent production downtime.",
            icon: <Factory size={24} />,
            color: "from-cyan-600/10 to-transparent"
        },
        {
            id: "telecom-cloud",
            title: "Telecom & Cloud",
            tagline: "Connectivity",
            desc: "Protecting 5G networks and hyperscale cloud environments from infrastructure-level attacks.",
            icon: <Wifi size={24} />,
            color: "from-lh-purple/10 to-transparent"
        },
        {
            id: "ai-data",
            title: "AI & Data Strategy",
            tagline: "Intelligence",
            desc: "Securing the modern data pipeline and protecting machine learning models from adversarial attacks.",
            icon: <Database size={24} />,
            color: "from-pink-600/10 to-transparent"
        }
    ];

    const totalPages = Math.ceil(sectorIndustries.length / ITEMS_PER_PAGE);
    const currentSectors = sectorIndustries.slice(currentPage * ITEMS_PER_PAGE, (currentPage + 1) * ITEMS_PER_PAGE);

    const handleNext = () => {
        if (currentPage < totalPages - 1) {
            setCurrentPage(prev => prev + 1);
            window.scrollTo({ top: 800, behavior: 'smooth' });
        }
    };

    const handlePrev = () => {
        if (currentPage > 0) {
            setCurrentPage(prev => prev - 1);
            window.scrollTo({ top: 800, behavior: 'smooth' });
        }
    };

    return (
        <div className="bg-[#050505] min-h-screen text-white font-plus-jakarta overflow-x-hidden selection:bg-lh-purple selection:text-white">
            <Navbar />

            {/* --- Section 1: Hero --- */}
            <section className="relative pt-40 pb-20 px-6 overflow-hidden">
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
                            <span className="uppercase tracking-[0.4em] text-[11px] font-black">Market Intelligence v1.0</span>
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-7xl font-[900] leading-[1] tracking-tighter uppercase max-w-4xl">
                            Critical <br />
                            <span className="text-lh-purple">Industry Sectors</span>
                        </h1>

                        <p className="text-gray-400 text-lg font-medium max-w-xl leading-relaxed">
                            Cybersecurity is the backbone of the global economy. Explore how technical experts protect critical industries from the evolving threat landscape.
                        </p>

                        <div className="flex flex-wrap gap-4 pt-4">
                            <div className="flex items-center gap-6 px-8 py-4 bg-white/[0.03] border border-white/10 rounded-2xl backdrop-blur-xl">
                                <div className="text-lh-purple">
                                    <Globe2 size={24} />
                                </div>
                                <p className="text-[11px] font-black uppercase tracking-widest text-white/60 leading-tight">
                                    Global Market <br />
                                    <span className="text-lh-purple">Impact Analysis</span>
                                </p>
                            </div>
                        </div>
                    </motion.div>

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
                            alt="Cyber Professional"
                            className="relative z-10 w-full max-w-[420px] animate-float-glow drop-shadow-[0_0_50px_rgba(188,19,254,0.3)]"
                        />
                    </motion.div>
                </div>
            </section>

            {/* --- Section 2: Industry Grid --- */}
            <section className="py-24 px-6 relative z-10">
                <div className="max-w-[1300px] mx-auto">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-20">
                        <div className="flex items-center gap-4">
                            <Scan className="text-lh-purple" size={32} />
                            <h2 className="text-3xl md:text-5xl font-[900] tracking-tighter uppercase">Market <span className="text-white/20">Segments</span></h2>
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-lh-purple animate-pulse">Vertical Analysis v1.0</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-[320px]">
                        {currentSectors.map((sector, idx) => (
                            <motion.div
                                key={`${currentPage}-${idx}`}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="col-span-1"
                            >
                                <div
                                    className={`group relative h-full w-full bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-[40px] overflow-hidden flex flex-col p-8 transition-all duration-500 hover:border-lh-purple/50 hover:bg-white/[0.05] hover:shadow-[0_20px_60px_rgba(188,19,254,0.1)] cursor-pointer`}
                                >
                                    <div className={`absolute inset-0 bg-gradient-to-br ${sector.color} opacity-0 group-hover:opacity-100 transition-opacity duration-700`}></div>

                                    <div className="relative z-10 flex flex-col h-full">
                                        <div className="flex justify-between items-start mb-8">
                                            <div className="p-4 bg-white/5 rounded-2xl text-white group-hover:text-lh-purple group-hover:bg-lh-purple/10 transition-all duration-500">
                                                {sector.icon}
                                            </div>
                                            <ArrowRight size={20} className="text-lh-purple opacity-0 group-hover:opacity-100 transition-all duration-500" />
                                        </div>

                                        <div className="space-y-4 flex-grow">
                                            <h3 className="text-xl font-black uppercase tracking-tight leading-tight group-hover:text-white transition-colors">
                                                {sector.title}
                                            </h3>
                                            <p className="text-[10px] font-black text-lh-purple uppercase tracking-[0.2em] opacity-80">
                                                {sector.tagline}
                                            </p>
                                            <p className="text-gray-400 text-sm leading-relaxed font-medium line-clamp-3 group-hover:text-gray-300 transition-colors">
                                                {sector.desc}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-3 pt-6 border-t border-white/5 mt-auto">
                                            <span className="w-1.5 h-1.5 rounded-full bg-lh-purple animate-pulse"></span>
                                            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30">Vertical Analysis Ready</span>
                                        </div>
                                    </div>
                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-[0.03] pointer-events-none transition-opacity duration-700 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]"></div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Navigation at the bottom */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-10 mt-20">
                            <button
                                onClick={handlePrev}
                                disabled={currentPage === 0}
                                className={`group flex items-center gap-4 px-8 py-4 rounded-full border transition-all duration-500 ${currentPage === 0 ? 'border-white/5 text-white/10' : 'border-white/10 text-white hover:border-lh-purple hover:bg-lh-purple/10 hover:shadow-[0_0_30px_rgba(188,19,254,0.2)]'}`}
                            >
                                <ArrowRight size={20} className="rotate-180 transition-transform group-hover:-translate-x-1" />
                                <span className="text-[12px] font-black uppercase tracking-[0.3em]">Previous</span>
                            </button>

                            <div className="flex items-center gap-2">
                                {Array.from({ length: totalPages }).map((_, i) => (
                                    <div
                                        key={i}
                                        className={`h-1.5 transition-all duration-500 rounded-full ${currentPage === i ? 'w-8 bg-lh-purple' : 'w-2 bg-white/10'}`}
                                    />
                                ))}
                            </div>

                            <button
                                onClick={handleNext}
                                disabled={currentPage === totalPages - 1}
                                className={`group flex items-center gap-4 px-8 py-4 rounded-full border transition-all duration-500 ${currentPage === totalPages - 1 ? 'border-white/5 text-white/10' : 'border-white/10 text-white hover:border-lh-purple hover:bg-lh-purple/10 hover:shadow-[0_0_30px_rgba(188,19,254,0.2)]'}`}
                            >
                                <span className="text-[12px] font-black uppercase tracking-[0.3em]">Next Batch</span>
                                <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
                            </button>
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default IndustrySectors;
