import React from 'react';
import { Link } from "react-router-dom";
import { ChevronRight, Shield, Clock, Database } from "lucide-react";

const CertificateHero = ({ cert }) => {
    return (
        /* flex-col aur overflow-y-auto isse scrollable banayega */
        <div className="w-full h-full overflow-y-auto selection:bg-lh-purple selection:text-white bg-[#050505] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">

            {/* SECTION 1: FULL SCREEN HERO CARD */}
            <div className="relative min-h-screen w-full flex flex-col md:flex-row items-center justify-between overflow-hidden border-b border-white/5">

                {/* Background Branded Texture */}
                <div className="absolute inset-0 opacity-20 pointer-events-none">
                    <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] bg-lh-purple/20 blur-[120px] rounded-full"></div>
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
                </div>

                {/* LEFT CONTENT AREA */}
                <div className="relative z-10 w-full md:w-1/2 p-8 md:p-20 flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-6 opacity-70">
                        <span className="w-8 h-[2px] bg-lh-purple"></span>
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white">
                            CSCA / {cert.category}
                        </span>
                    </div>

                    <div className="mb-8">
                        <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter leading-none mb-4">
                            {cert.title.split(' – ')[0]}
                            <span className="block text-lh-purple text-2xl md:text-3xl mt-2 italic font-bold">
                                {cert.title.split(' – ')[1]}
                            </span>
                        </h1>

                        <div className="flex flex-wrap gap-4 mt-6">
                            <span className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-gray-300">
                                <Shield className="w-3 h-3 text-lh-purple" /> {cert.level}
                            </span>
                            <span className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-gray-300">
                                <Clock className="w-3 h-3 text-lh-purple" /> 250h Content
                            </span>
                        </div>
                    </div>

                    <div className="relative mb-10 group">
                        <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-lh-purple/30 group-hover:bg-lh-purple transition-colors duration-500"></div>
                        <p className="text-lg text-gray-400 leading-relaxed pl-8 max-w-xl font-medium italic">
                            "{cert.description}"
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-6 items-center">
                        <Link to={`/enroll/${cert.id}`}>
                            <button className="px-10 py-4 bg-lh-purple hover:bg-white hover:text-black text-white font-black uppercase tracking-widest text-xs rounded-full transition-all duration-300 transform hover:scale-105 shadow-[0_0_30px_rgba(188,19,254,0.3)] flex items-center gap-3">
                                Enroll Now
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </Link>
                        <div className="flex flex-col">
                            <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Starting at</span>
                            <span className="text-2xl font-black text-white">${cert.price}</span>
                        </div>
                    </div>
                </div>

                {/* RIGHT IMAGE AREA */}
                <div className="relative w-full md:w-1/2 h-[500px] md:h-full flex items-center justify-center bg-gradient-to-l from-lh-purple/10 to-transparent">

                    {/* Animated Radial Rings */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-[300px] h-[300px] border border-lh-purple/20 rounded-full animate-pulse"></div>
                        <div className="absolute w-[450px] h-[450px] border border-lh-purple/10 rounded-full scale-110"></div>
                    </div>

                    <div className="relative z-20 group">
                        <div className={`w-72 h-72 md:w-[400px] md:h-[400px] rounded-[40px] bg-gradient-to-br ${cert.color} p-[1px] shadow-[0_0_60px_rgba(188,19,254,0.1)] overflow-hidden transition-all duration-700`}>
                            <div className="w-full h-full bg-[#080808] rounded-[40px] overflow-hidden relative">

                                {/* DIRECT IMAGE USAGE FROM DATA */}
                                <img
                                    src={cert.image}
                                    alt={cert.title}
                                    className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000"
                                    onError={(e) => {
                                        e.target.src = "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800";
                                    }}
                                />

                                {/* Dark Overlay Vignette */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* SECTION 2: ADDITIONAL CONTENT (COMING SOON) */}
            <div className="max-w-7xl mx-auto px-6 py-24 relative">
                <div className="py-32 flex flex-col items-center justify-center text-center border border-dashed border-white/10 rounded-[4rem] bg-white/[0.02] backdrop-blur-3xl relative overflow-hidden group">

                    {/* Subtle Background Glow */}
                    <div className="absolute inset-0 bg-lh-purple/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                    <div className="w-24 h-24 rounded-3xl bg-white/5 flex items-center justify-center mb-8 border border-white/10 shadow-inner relative z-10">
                        <Database className="w-10 h-10 text-lh-purple" />
                    </div>

                    <div className="relative z-10">
                        <h3 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter mb-4">
                            Curriculum <span className="text-lh-purple opacity-40">Development</span>
                        </h3>
                        <p className="text-gray-400 max-w-lg mx-auto leading-relaxed text-lg font-medium">
                            We are currently optimizing the high-impact lab environments and technical modules for <span className="text-lh-purple font-bold italic">{cert.title.split(' – ')[0]}</span>.
                            Launch scheduled for <span className="text-white">June 2026</span>.
                        </p>
                    </div>

                    {/* Status Indicators */}
                    <div className="flex items-center gap-4 mt-10 relative z-10 px-6 py-2 bg-white/5 rounded-full border border-white/5">
                        <div className="flex gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-lh-purple animate-pulse"></div>
                            <div className="w-2 h-2 rounded-full bg-lh-purple/40"></div>
                            <div className="w-2 h-2 rounded-full bg-lh-purple/10"></div>
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
                            Lab Environment Syncing
                        </span>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default CertificateHero;
