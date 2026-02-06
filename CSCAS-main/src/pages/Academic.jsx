import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, BookOpen, Laptop, Users, Shield, Award, Terminal, Scan, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ngdPic from '../assets/images/ngd-pic.png';

const Academic = () => {
    const academicPrograms = [
        {
            title: "Student Certification Bundles",
            desc: "Comprehensive certification packages designed specifically for university students to kickstart their cyber careers.",
            icon: <Award size={32} />,
            size: "col-span-1 md:col-span-2 row-span-1",
            color: "from-purple-500/10 to-transparent"
        },
        {
            title: "Faculty Training",
            desc: "Empower your educators with cutting-edge cybersecurity knowledge and CSCA certified instructor status.",
            icon: <Users size={32} />,
            size: "col-span-1 row-span-1",
            color: "from-blue-500/10 to-transparent"
        },
        {
            title: "Campus SOC Labs",
            desc: "Establish state-of-the-art Security Operations Center labs on campus for hands-on technical training.",
            icon: <Laptop size={32} />,
            size: "col-span-1 row-span-2",
            color: "from-emerald-500/10 to-transparent"
        },
        {
            title: "Internship-Ready Skills",
            desc: "Curriculums focused on high-demand technical skills to ensure students are ready for elite internships.",
            icon: <Shield size={32} />,
            size: "col-span-1 md:col-span-2 row-span-1",
            color: "from-cyan-500/10 to-transparent"
        },
        {
            title: "Academic Licensing",
            desc: "Flexible licensing models for universities to integrate CSCA materials into their official degree programs.",
            icon: <BookOpen size={24} />,
            size: "col-span-1 md:col-span-1 row-span-1",
            color: "from-orange-500/10 to-transparent"
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
                            <span className="uppercase tracking-[0.4em] text-[11px] font-black">Academic Excellence</span>
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-7xl font-[1000] leading-[1] tracking-tighter uppercase max-w-4xl">
                            Academic <br />
                            <span className="text-lh-purple italic">Programs</span>
                        </h1>

                        <p className="text-gray-400 text-lg font-medium max-w-xl leading-relaxed">
                            For Universities & Colleges. Empowering the next generation of cybersecurity leaders with world-class certifications integrated into your curriculum.
                        </p>

                        <div className="flex flex-wrap gap-4 pt-4">
                            <Link to="/academic-catalog">
                                <button className="px-12 py-5 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-[0.3em] hover:bg-lh-purple hover:text-white transition-all shadow-[0_0_50px_rgba(255,255,255,0.1)] flex items-center gap-4 group">
                                    Explore Programs <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            </Link>
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
                            alt="Academic Success"
                            className="relative z-10 w-full max-w-[420px] animate-float-glow drop-shadow-[0_0_50px_rgba(188,19,254,0.3)]"
                        />
                    </motion.div>
                </div>
            </section>

            {/* --- Section 2: Academic Programs Bento Grid --- */}
            <section className="py-24 px-6 relative z-10">
                <div className="max-w-[1300px] mx-auto">
                    <div className="flex items-center gap-4 mb-20 text-center justify-center lg:justify-start">
                        <Scan className="text-lh-purple hidden lg:block" size={32} />
                        <h2 className="text-3xl md:text-5xl font-[1000] tracking-tighter uppercase">Academic <span className="text-white/20">Programs</span></h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-[280px]">
                        {academicPrograms.map((program, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.05 }}
                                viewport={{ once: true }}
                                className={`${program.size}`}
                            >
                                <div
                                    className={`group relative h-full w-full bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-[32px] overflow-hidden flex flex-col p-8 transition-all duration-500 hover:border-lh-purple/50 hover:bg-white/[0.05] hover:shadow-[0_20px_60px_rgba(188,19,254,0.1)] cursor-default`}
                                >
                                    <div className={`absolute inset-0 bg-gradient-to-br ${program.color} opacity-0 group-hover:opacity-100 transition-opacity duration-700`}></div>

                                    <div className="relative z-10 flex flex-col h-full">
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="p-4 bg-white/5 rounded-2xl text-white group-hover:text-lh-purple group-hover:bg-lh-purple/10 transition-all duration-500">
                                                {program.icon}
                                            </div>
                                            <ArrowRight size={20} className="text-lh-purple opacity-0 group-hover:opacity-100 transition-all duration-500" />
                                        </div>

                                        <div className="space-y-3 flex-grow">
                                            <h3 className="text-xl font-black uppercase tracking-tight leading-tight group-hover:text-white transition-colors">
                                                {program.title}
                                            </h3>
                                            <p className="text-gray-400 text-sm leading-relaxed font-medium line-clamp-3 md:line-clamp-none group-hover:text-gray-300 transition-colors">
                                                {program.desc}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-3 pt-6 border-t border-white/5 mt-auto">
                                            <span className="w-1.5 h-1.5 rounded-full bg-lh-purple animate-pulse"></span>
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Program Module</span>
                                        </div>
                                    </div>
                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-[0.03] pointer-events-none transition-opacity duration-700 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]"></div>
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

export default Academic;
