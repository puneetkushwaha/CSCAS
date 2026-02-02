import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { GraduationCap, Building2, Briefcase, Cpu, Percent, BookOpen, Ticket, Globe, Megaphone, Terminal, Scan, ArrowRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ngdPic from '../assets/images/ngd-pic.png';

const PartnersEcosystem = () => {
    const partnerTypes = [
        {
            title: "Authorized Training Partner",
            desc: "Deliver industry-leading CSCA certifications and training programs to your local market.",
            icon: <GraduationCap size={32} />,
            size: "col-span-1 md:col-span-2 row-span-1",
            color: "from-purple-500/10 to-transparent"
        },
        {
            title: "Academic Partner",
            desc: "Integrate CSCA curriculum into university programs to prepare the next generation of cyber talent.",
            icon: <BookOpen size={32} />,
            size: "col-span-1 row-span-1",
            color: "from-blue-500/10 to-transparent"
        },
        {
            title: "Corporate Partner",
            desc: "Upskill your internal security teams with customized training and certification pathways.",
            icon: <Building2 size={32} />,
            size: "col-span-1 row-span-2",
            color: "from-emerald-500/10 to-transparent"
        },
        {
            title: "Technology Partner",
            desc: "Collaborate on R&D and integrate advanced security tools into the CSCA training ecosystem.",
            icon: <Cpu size={32} />,
            size: "col-span-1 md:col-span-3 row-span-1",
            color: "from-cyan-500/10 to-transparent"
        }
    ];

    const benefits = [
        {
            title: "Revenue Sharing",
            desc: "Attractive commission models on training and exam sales.",
            icon: <Percent size={24} />,
            color: "bg-purple-500/20"
        },
        {
            title: "Trainer Materials",
            desc: "Full access to official CSCA instructional kits and labs.",
            icon: <Briefcase size={24} />,
            color: "bg-blue-500/20"
        },
        {
            title: "Exam Vouchers",
            desc: "Discounted vouchers for partner internal use and students.",
            icon: <Ticket size={24} />,
            color: "bg-emerald-500/20"
        },
        {
            title: "Global Directory",
            desc: "Get listed on our official partner locator for worldwide visibility.",
            icon: <Globe size={24} />,
            color: "bg-orange-500/20"
        },
        {
            title: "Marketing Collateral",
            desc: "Access to co-branded sales materials and digital assets.",
            icon: <Megaphone size={24} />,
            color: "bg-rose-500/20"
        }
    ];

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
                            <Terminal size={20} className="animate-pulse" />
                            <span className="uppercase tracking-[0.4em] text-[11px] font-black">Ecosystem v2.0</span>
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-7xl font-[1000] leading-[1] tracking-tighter uppercase max-w-4xl">
                            Partner With <br />
                            <span className="text-lh-purple italic">CSCA</span>
                        </h1>

                        <p className="text-gray-400 text-lg font-medium max-w-xl leading-relaxed">
                            Grow your cybersecurity training business with the CSCA partner ecosystem. Join an elite network of educators and industry leaders.
                        </p>

                        <div className="flex flex-wrap gap-4 pt-4">
                            <button className="px-12 py-5 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-[0.3em] hover:bg-lh-purple hover:text-white transition-all shadow-[0_0_50px_rgba(255,255,255,0.1)] flex items-center gap-4 group">
                                Apply to Partner <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </button>
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
                            alt="Partner Success"
                            className="relative z-10 w-full max-w-[420px] animate-float-glow drop-shadow-[0_0_50px_rgba(188,19,254,0.3)]"
                        />
                    </motion.div>
                </div>
            </section>

            {/* --- Section 2: Partner Types --- */}
            <section className="py-24 px-6 relative z-10">
                <div className="max-w-[1300px] mx-auto">
                    <div className="flex items-center gap-4 mb-20 text-center justify-center lg:justify-start">
                        <Scan className="text-lh-purple hidden lg:block" size={32} />
                        <h2 className="text-3xl md:text-5xl font-[1000] tracking-tighter uppercase">Partner <span className="text-white/20">Types</span></h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-[280px]">
                        {partnerTypes.map((type, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.05 }}
                                viewport={{ once: true }}
                                className={`${type.size}`}
                            >
                                {type.title === "Academic Partner" ? (
                                    <Link
                                        to="/academic"
                                        className={`group relative h-full w-full bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-[32px] overflow-hidden flex flex-col p-8 transition-all duration-500 hover:border-lh-purple/50 hover:bg-white/[0.05] hover:shadow-[0_20px_60px_rgba(188,19,254,0.1)] cursor-pointer`}
                                    >
                                        <div className={`absolute inset-0 bg-gradient-to-br ${type.color} opacity-0 group-hover:opacity-100 transition-opacity duration-700`}></div>

                                        <div className="relative z-10 flex flex-col h-full">
                                            <div className="flex justify-between items-start mb-6">
                                                <div className="p-4 bg-white/5 rounded-2xl text-white group-hover:text-lh-purple group-hover:bg-lh-purple/10 transition-all duration-500">
                                                    {type.icon}
                                                </div>
                                                <ArrowRight size={20} className="text-lh-purple opacity-0 group-hover:opacity-100 transition-all duration-500" />
                                            </div>

                                            <div className="space-y-3 flex-grow">
                                                <h3 className="text-xl font-black uppercase tracking-tight leading-tight group-hover:text-white transition-colors">
                                                    {type.title}
                                                </h3>
                                                <p className="text-gray-400 text-sm leading-relaxed font-medium line-clamp-3 md:line-clamp-none group-hover:text-gray-300 transition-colors">
                                                    {type.desc}
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-3 pt-6 border-t border-white/5 mt-auto">
                                                <span className="w-1.5 h-1.5 rounded-full bg-lh-purple animate-pulse"></span>
                                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Active Tier</span>
                                            </div>
                                        </div>
                                        <div className="absolute inset-0 opacity-0 group-hover:opacity-[0.03] pointer-events-none transition-opacity duration-700 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]"></div>
                                    </Link>
                                ) : (
                                    <div
                                        className={`group relative h-full w-full bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-[32px] overflow-hidden flex flex-col p-8 transition-all duration-500 hover:border-lh-purple/50 hover:bg-white/[0.05] hover:shadow-[0_20px_60px_rgba(188,19,254,0.1)] cursor-default`}
                                    >
                                        <div className={`absolute inset-0 bg-gradient-to-br ${type.color} opacity-0 group-hover:opacity-100 transition-opacity duration-700`}></div>

                                        <div className="relative z-10 flex flex-col h-full">
                                            <div className="flex justify-between items-start mb-6">
                                                <div className="p-4 bg-white/5 rounded-2xl text-white group-hover:text-lh-purple group-hover:bg-lh-purple/10 transition-all duration-500">
                                                    {type.icon}
                                                </div>
                                                <ArrowRight size={20} className="text-lh-purple opacity-0 group-hover:opacity-100 transition-all duration-500" />
                                            </div>

                                            <div className="space-y-3 flex-grow">
                                                <h3 className="text-xl font-black uppercase tracking-tight leading-tight group-hover:text-white transition-colors">
                                                    {type.title}
                                                </h3>
                                                <p className="text-gray-400 text-sm leading-relaxed font-medium line-clamp-3 md:line-clamp-none group-hover:text-gray-300 transition-colors">
                                                    {type.desc}
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-3 pt-6 border-t border-white/5 mt-auto">
                                                <span className="w-1.5 h-1.5 rounded-full bg-lh-purple animate-pulse"></span>
                                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Active Tier</span>
                                            </div>
                                        </div>
                                        <div className="absolute inset-0 opacity-0 group-hover:opacity-[0.03] pointer-events-none transition-opacity duration-700 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]"></div>
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- Section 3: Partner Benefits --- */}
            <section className="py-24 px-6 relative z-10 bg-white/[0.01] border-y border-white/5">
                <div className="max-w-[1300px] mx-auto">
                    <div className="text-center mb-20 space-y-4">
                        <span className="text-lh-purple text-xs font-black uppercase tracking-[0.6em] md:tracking-[1em]">Operational Perks</span>
                        <h2 className="text-3xl md:text-5xl font-[1000] tracking-tighter uppercase">Partner <span className="text-lh-purple">Benefits</span></h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                        {benefits.map((benefit, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                viewport={{ once: true }}
                                className="p-8 bg-white/[0.03] border border-white/10 rounded-[32px] hover:border-lh-purple/30 transition-all group"
                            >
                                <div className={`w-12 h-12 ${benefit.color} rounded-xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform`}>
                                    {benefit.icon}
                                </div>
                                <h3 className="text-lg font-black uppercase tracking-tight mb-3">{benefit.title}</h3>
                                <p className="text-gray-400 text-xs font-medium leading-relaxed uppercase tracking-wider">{benefit.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- Section 4: Final CTA --- */}
            <section className="py-32 md:py-48 px-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="max-w-[1300px] mx-auto rounded-[60px] p-20 bg-gradient-to-br from-lh-purple/20 via-transparent to-transparent border border-white/10 text-center space-y-10 relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-lh-purple/5 blur-[120px] scale-150 animate-pulse" />
                    <div className="relative z-10 space-y-4">
                        <h2 className="text-4xl md:text-7xl font-[1000] tracking-tighter uppercase">Forge an <br /> <span className="text-lh-purple italic">Alliance</span></h2>
                        <p className="text-gray-400 text-lg md:text-xl font-medium max-w-2xl mx-auto italic">
                            "The cybersecurity landscape changes every minute. We empower our partners to lead that change."
                        </p>
                    </div>
                    <div className="relative z-10 pt-8">
                        <button className="px-16 py-6 bg-white text-black rounded-[25px] font-black text-xs uppercase tracking-[0.4em] shadow-[0_0_60px_rgba(255,255,255,0.2)] hover:bg-lh-purple hover:text-white transition-all transform hover:scale-105 active:scale-95 duration-500">
                            Get Started Now
                        </button>
                    </div>
                </motion.div>
            </section>

            <Footer />
        </div>
    );
};

export default PartnersEcosystem;
