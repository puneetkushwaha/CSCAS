import React from 'react';
import { motion } from 'framer-motion';
import { Play, Monitor, Shield, Globe, Database, Brain, Cloud, Users, ArrowRight, Eye, Terminal, Scan } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ngdPic from '../assets/images/ngd-pic.png';

const CareersPlus = () => {
    const careersPlusStories = [
        {
            title: "Tech Support",
            id: "tech-support-specialist",
            tagline: "Watch a support specialist in action.",
            desc: "See how an IT support specialist saves the day when a major tech problem arises.",
            icon: <Monitor size={32} />,
            size: "col-span-1 md:row-span-2",
            color: "from-purple-500/10 to-transparent"
        },
        {
            title: "Cyber Analyst",
            id: "cybersecurity-specialist",
            tagline: "React to a live ransomware attack.",
            desc: "In this dramatic scenario, see how a cybersecurity specialist reacts to counter an attack.",
            icon: <Shield size={32} />,
            size: "col-span-1 md:col-span-2 row-span-1",
            color: "from-red-500/10 to-transparent"
        },
        {
            title: "Systems Engineer",
            id: "systems-engineer",
            tagline: "Defend your global network.",
            desc: "Analyze and protect IT systems during a critical network crisis.",
            icon: <Globe size={32} />,
            size: "col-span-1 md:row-span-2",
            color: "from-blue-500/10 to-transparent"
        },
        {
            title: "Content Designer",
            id: "instructional-designer",
            tagline: "A human touch to AI content.",
            desc: "See how an instructional designer brings a human touch to powerful AI content production.",
            icon: <Users size={32} />,
            size: "col-span-1 md:col-span-2 row-span-1",
            color: "from-orange-500/10 to-transparent"
        },
        {
            title: "AI Ops Engine",
            id: "ai-engineer",
            tagline: "Aligning AI with business goals.",
            desc: "Watch as an AI engineer reckons with the concrete problems of aligning AI’s potential.",
            icon: <Brain size={32} />,
            size: "col-span-1 md:col-span-2 row-span-1",
            color: "from-lh-purple/10 to-transparent"
        },
        {
            title: "Cloud Architect",
            id: "cloud-architect",
            tagline: "Building the AI foundation.",
            desc: "Root his company’s AI future in flexible and supportive cloud infrastructure.",
            icon: <Cloud size={32} />,
            size: "col-span-1 row-span-1",
            color: "from-cyan-500/10 to-transparent"
        },
        {
            title: "Data Integrity",
            id: "data-analyst",
            tagline: "The data analyst challenge.",
            desc: "Maintain data integrity even when IT security systems are compromised.",
            icon: <Database size={32} />,
            size: "col-span-1 row-span-1",
            color: "from-emerald-500/10 to-transparent"
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
                            <span className="uppercase tracking-[0.4em] text-[11px] font-black">Mission Control v1.0</span>
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-7xl font-[900] leading-[1] tracking-tighter uppercase max-w-4xl">
                            Simulate Your <br />
                            <span className="text-lh-purple">Future Self</span>
                        </h1>

                        <p className="text-gray-400 text-lg font-medium max-w-xl leading-relaxed">
                            Step into the cockpit. These interactive role scenarios let you experience the day-to-day adrenaline of elite cybersecurity roles.
                        </p>

                        <div className="flex flex-wrap gap-4 pt-4">
                            <div className="flex items-center gap-6 px-8 py-4 bg-white/[0.03] border border-white/10 rounded-2xl backdrop-blur-xl">
                                <div className="flex -space-x-3">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className="w-8 h-8 rounded-full border-2 border-[#050505] bg-gray-800 flex items-center justify-center text-[10px] font-bold">
                                            {String.fromCharCode(64 + i)}
                                        </div>
                                    ))}
                                </div>
                                <p className="text-[11px] font-black uppercase tracking-widest text-white/60 leading-tight">
                                    12,000+ Pilots <br />
                                    <span className="text-lh-purple">Live In Simulation</span>
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

                        {/* Scanner Line Effect */}
                        <div className="absolute inset-y-0 w-1 bg-gradient-to-b from-transparent via-lh-purple to-transparent left-1/2 -translate-x-1/2 opacity-20 hidden lg:block"></div>
                    </motion.div>
                </div>
            </section>

            {/* --- Section 2: Bento Grid --- */}
            <section className="py-24 px-6 relative z-10">
                <div className="max-w-[1300px] mx-auto">
                    <div className="flex items-center gap-4 mb-20">
                        <Scan className="text-lh-purple" size={32} />
                        <h2 className="text-3xl md:text-5xl font-[900] tracking-tighter uppercase">Select Mission <span className="text-white/20">Objective</span></h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-[280px]">
                        {careersPlusStories.map((story, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.05 }}
                                viewport={{ once: true }}
                                className={`${story.size}`}
                            >
                                <Link
                                    to={`/explore-tech-careers/${story.id}`}
                                    className={`group relative h-full w-full bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-[32px] overflow-hidden flex flex-col p-8 transition-all duration-500 hover:border-lh-purple/50 hover:bg-white/[0.05] hover:shadow-[0_20px_60px_rgba(188,19,254,0.1)]`}
                                >
                                    {/* Accent Background */}
                                    <div className={`absolute inset-0 bg-gradient-to-br ${story.color} opacity-0 group-hover:opacity-100 transition-opacity duration-700`}></div>

                                    <div className="relative z-10 flex flex-col h-full">
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="p-4 bg-white/5 rounded-2xl text-white group-hover:text-lh-purple group-hover:bg-lh-purple/10 transition-all duration-500">
                                                {story.icon}
                                            </div>
                                            <div className="p-2 border border-white/10 rounded-full opacity-0 group-hover:opacity-100 rotate-45 group-hover:rotate-0 transition-all duration-500">
                                                <ArrowRight size={20} className="text-lh-purple" />
                                            </div>
                                        </div>

                                        <div className="space-y-3 flex-grow">
                                            <h3 className="text-xl font-black uppercase tracking-tight leading-tight group-hover:text-white transition-colors">
                                                {story.title}
                                            </h3>
                                            <p className="text-[12px] font-bold text-lh-purple uppercase tracking-widest opacity-80">
                                                {story.tagline}
                                            </p>
                                            <p className="text-gray-400 text-sm leading-relaxed font-medium line-clamp-3 md:line-clamp-none group-hover:text-gray-300 transition-colors">
                                                {story.desc}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-3 pt-6 border-t border-white/5 mt-auto">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Scenario Loaded</span>
                                        </div>
                                    </div>

                                    {/* Hover Grid Pattern */}
                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-[0.03] pointer-events-none transition-opacity duration-700 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]"></div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default CareersPlus;
