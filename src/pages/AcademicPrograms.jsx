import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Globe, Lock, Cpu, Search, Terminal, ArrowLeft, BookOpen, Layers, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ngdPic from '../assets/images/ngd-pic.png';

const AcademicPrograms = () => {
    const courses = [
        {
            title: "Foundations of Cybersecurity",
            tagline: "Entry-level Security Principles",
            desc: "Master the core concepts of risk management, cryptography, and network security fundamentals.",
            icon: <Shield size={32} />,
            size: "col-span-1 row-span-1",
            color: "from-blue-500/10 to-transparent",
            tags: ["Beginner", "Core"]
        },
        {
            title: "Network Defense & Security",
            tagline: "Infrastructure Protection",
            desc: "Learn to secure complex network architectures, firewalls, and intrusion detection systems.",
            icon: <Globe size={32} />,
            size: "col-span-1 md:col-span-2 row-span-1",
            color: "from-cyan-500/10 to-transparent",
            tags: ["Intermediate", "Network"]
        },
        {
            title: "Ethical Hacking & Pentesting",
            tagline: "Offensive Security Mastery",
            desc: "Simulate advanced cyber attacks to identify vulnerabilities and strengthen organizational defense.",
            icon: <Zap size={32} />,
            size: "col-span-1 row-span-1",
            color: "from-red-500/10 to-transparent",
            tags: ["Advanced", "Offensive"]
        },
        {
            title: "Digital Forensics",
            tagline: "Incident Response & Analysis",
            desc: "Investigate digital crimes, recover deleted data, and build evidence-backed forensic reports.",
            icon: <Search size={32} />,
            size: "col-span-1 row-span-1",
            color: "from-purple-500/10 to-transparent",
            tags: ["Advanced", "Investigation"]
        },
        {
            title: "SOC Operations",
            tagline: "Defending the Enterprise",
            desc: "Train in real-world SOC environments to monitor, detect, and respond to live security threats.",
            icon: <Terminal size={32} />,
            size: "col-span-1 md:col-span-2 row-span-1",
            color: "from-emerald-500/10 to-transparent",
            tags: ["Intermediate", "Defense"]
        },
        {
            title: "Cloud Security Architecture",
            tagline: "Securing the Future",
            desc: "Expert-level training on securing AWS, Azure, and GCP environments against modern cloud threats.",
            icon: <Cpu size={32} />,
            size: "col-span-1 md:col-span-1 row-span-1",
            color: "from-blue-600/10 to-transparent",
            tags: ["Expert", "Cloud"]
        }
    ];

    return (
        <div className="bg-[#050505] min-h-screen text-white font-plus-jakarta overflow-x-hidden selection:bg-lh-purple selection:text-white">
            <Navbar />

            {/* --- Hero Section --- */}
            <section className="relative pt-40 pb-20 px-6 overflow-hidden">
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-lh-purple/20 blur-[150px] rounded-full animate-pulse"></div>
                <div className="absolute bottom-[20%] left-[-5%] w-[300px] h-[300px] bg-blue-500/10 blur-[120px] rounded-full"></div>

                <div className="max-w-[1300px] mx-auto grid lg:grid-cols-2 gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="space-y-8 relative z-10 text-left"
                    >
                        <Link to="/academic" className="inline-flex items-center gap-2 text-lh-purple hover:text-white transition-colors uppercase tracking-[0.4em] text-[10px] font-black group">
                            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Academic Overview
                        </Link>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-5xl md:text-8xl font-[1000] tracking-tighter uppercase leading-none"
                        >
                            Program <br />
                            <span className="text-lh-purple">Catalog</span>
                        </motion.h1>

                        <p className="text-gray-400 text-lg font-medium max-w-xl leading-relaxed">
                            Industry-validated curriculums designed for high-impact technical roles in global cybersecurity.
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

            {/* --- Catalog Grid --- */}
            <section className="py-24 px-6 relative z-10">
                <div className="max-w-[1300px] mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-[280px]">
                        {courses.map((course, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.05 }}
                                viewport={{ once: true }}
                                className={`${course.size}`}
                            >
                                <div
                                    className={`group relative h-full w-full bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-[32px] overflow-hidden flex flex-col p-8 transition-all duration-500 hover:border-lh-purple/50 hover:bg-white/[0.05] hover:shadow-[0_20px_60px_rgba(188,19,254,0.1)] cursor-default`}
                                >
                                    <div className={`absolute inset-0 bg-gradient-to-br ${course.color} opacity-0 group-hover:opacity-100 transition-opacity duration-700`}></div>

                                    <div className="relative z-10 flex flex-col h-full">
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="p-4 bg-white/5 rounded-2xl text-white group-hover:text-lh-purple group-hover:bg-lh-purple/10 transition-all duration-500">
                                                {course.icon}
                                            </div>
                                            <div className="flex flex-col items-end gap-2">
                                                {course.tags.map(tag => (
                                                    <span key={tag} className="text-[9px] font-black uppercase tracking-widest px-2 py-1 bg-white/5 rounded-md text-white/40 group-hover:text-lh-purple group-hover:bg-lh-purple/10 transition-all">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="space-y-3 flex-grow">
                                            <h3 className="text-xl font-black uppercase tracking-tight leading-tight group-hover:text-white transition-colors">
                                                {course.title}
                                            </h3>
                                            <p className="text-[12px] font-bold text-lh-purple uppercase tracking-widest opacity-80">
                                                {course.tagline}
                                            </p>
                                            <p className="text-gray-400 text-sm leading-relaxed font-medium line-clamp-3 md:line-clamp-none group-hover:text-gray-300 transition-colors">
                                                {course.desc}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-3 pt-6 border-t border-white/5 mt-auto">
                                            <div className="flex-grow flex items-center gap-2">
                                                <Layers size={14} className="text-lh-purple" />
                                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">12 Modules</span>
                                            </div>
                                            <BookOpen size={16} className="text-white/20 group-hover:text-lh-purple transition-colors" />
                                        </div>
                                    </div>
                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-[0.03] pointer-events-none transition-opacity duration-700 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]"></div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- CTA Section --- */}
            <section className="py-24 px-6 relative z-10 bg-white/[0.01] border-t border-white/5">
                <div className="max-w-[1300px] mx-auto text-center space-y-10">
                    <h2 className="text-3xl md:text-5xl font-[1000] tracking-tighter uppercase">Ready to <span className="text-lh-purple">Enroll?</span></h2>
                    <p className="text-gray-400 text-lg font-medium max-w-xl mx-auto uppercase tracking-widest">
                        "Your journey into the cyber battlefield starts here."
                    </p>
                    <button className="px-16 py-6 bg-lh-purple text-white rounded-full font-black text-xs uppercase tracking-[0.4em] shadow-[0_0_50px_rgba(188,19,254,0.3)] hover:bg-white hover:text-black transition-all transform hover:scale-105 duration-500">
                        Request Course Brochure
                    </button>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default AcademicPrograms;
