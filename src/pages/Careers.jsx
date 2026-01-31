import React from 'react';
import { motion } from 'framer-motion';
import { Eye, Briefcase, Globe, Layers, ArrowRight, ShieldCheck, CheckCircle2, TrendingUp, Target } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ngdPic from '../assets/images/ngd-pic.png';

const Careers = () => {
    const careerSectors = [
        {
            title: "Explore Tech Careers",
            desc: "Red Team Operator | SOC Analyst | Cloud Security Engineer | Threat Intelligence Analyst | Cyber Law & Compliance Specialist | AI Security Engineer | Security Architect | CISO Track",
            icon: <Briefcase size={40} className="text-lh-purple" />,
            border: "border-lh-purple/20",
            stats: "Elite Roles"
        },
        {
            title: "Explore Industry Sectors",
            desc: "Comprehensive insights into critical industries driving global cybersecurity adoption.",
            icon: <Globe size={40} className="text-blue-500" />,
            border: "border-blue-500/20",
            stats: "Global Insights"
        },
        {
            title: "Explore Careers+",
            desc: "Dive deeper into your career possibilities with Careers+, a curated roadmap of in-demand cybersecurity jobs.",
            icon: <Layers size={40} className="text-orange-500" />,
            border: "border-orange-500/20",
            stats: "Curated Roadmaps"
        }
    ];

    return (
        <div className="bg-[#050505] min-h-screen text-white font-plus-jakarta overflow-x-hidden">
            <Navbar />

            {/* --- Section 1: Hero --- */}
            <section className="relative pt-40 pb-20 px-6 overflow-hidden">
                {/* Abstract Glows */}
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
                            <Eye size={20} strokeWidth={2.5} />
                            <span className="uppercase tracking-[0.4em] text-[11px] font-black">Elite Career Mapping</span>
                        </div>

                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-[900] leading-[1.2] tracking-tighter uppercase max-w-4xl">
                            Build a <span className="text-lh-purple italic">Cyber Career</span> <br />
                            <span className="text-white opacity-40 outline-text">That Actually Pays</span> — <br />
                            <span className="text-white/80">Not Just A Certificate</span>
                        </h1>

                        <p className="text-gray-400 text-base md:text-lg font-medium max-w-xl leading-relaxed">
                            CSCA maps real-world cybersecurity roles across Red Team, Blue Team, Cloud, GRC, AI Security, and Digital Forensics — aligned with real industry demand.
                        </p>

                        <div className="flex flex-wrap gap-4">
                            <button className="bg-lh-purple text-white py-4 px-10 rounded-full font-black text-xs uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all shadow-[0_0_30px_rgba(188,19,254,0.3)]">
                                Start Your Journey
                            </button>
                            <button className="border border-white/10 backdrop-blur-md py-4 px-10 rounded-full font-black text-xs uppercase tracking-[0.2em] hover:bg-white/10 transition-all">
                                Download Roadmap
                            </button>
                        </div>
                    </motion.div>

                    {/* Premium Image Container */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="relative flex justify-center items-center h-[500px] lg:h-[600px] order-first lg:order-last"
                    >
                        {/* Background Halo */}
                        <div className="absolute inset-0 bg-lh-purple/10 blur-[100px] rounded-full scale-75 animate-pulse"></div>

                        {/* Glass Card Backdrop */}
                        <div className="absolute w-[80%] h-[70%] bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[60px] transform -rotate-6"></div>

                        {/* The Main Character Image */}
                        <img
                            src={ngdPic}
                            alt="Cyber Professional"
                            className="relative z-10 w-full max-w-[450px] animate-float-glow"
                        />
                    </motion.div>
                </div>
            </section>

            {/* --- Section 2: Career Sectors Grid --- */}
            <section className="py-24 px-6 relative z-10">
                <div className="max-w-[1300px] mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16 px-4">
                        <div className="space-y-4">
                            <h2 className="text-2xl md:text-4xl font-[900] tracking-tighter uppercase leading-none">
                                Curated <span className="text-lh-purple">Paths</span> <br />
                                For Every Level
                            </h2>
                        </div>
                        <p className="text-gray-400 font-medium max-w-sm">
                            Our roadmap ensures you're ready for industry demand, not just an exam.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {careerSectors.map((sector, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                viewport={{ once: true }}
                                className={`group bg-white/[0.03] backdrop-blur-md border ${sector.border} p-10 rounded-[40px] flex flex-col justify-between min-h-[450px] transition-all duration-500 hover:bg-[#0a0a0a] hover:scale-[1.02] hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)]`}
                            >
                                <div className="space-y-8">
                                    <div className="flex justify-between items-start">
                                        <div className="p-4 bg-white/5 w-fit rounded-2xl group-hover:scale-110 group-hover:bg-lh-purple/20 transition-all duration-500">
                                            {sector.icon}
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-lh-purple py-1 px-3 bg-lh-purple/10 rounded-full border border-lh-purple/20">
                                            {sector.stats}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-[900] tracking-tight leading-tight uppercase">{sector.title}</h3>
                                    <p className="text-gray-400 text-sm leading-relaxed font-semibold">
                                        {sector.desc}
                                    </p>
                                </div>

                                <div className="flex justify-end pt-6">
                                    <button className="flex items-center gap-3 text-xs font-black uppercase tracking-widest text-white group-hover:text-lh-purple transition-all duration-500">
                                        Learn more <ArrowRight size={16} />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Careers;
