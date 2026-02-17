import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Eye, Briefcase, Globe, Layers, ArrowRight, ShieldCheck, CheckCircle2, TrendingUp, Target, Shield, Cloud, Brain, FileText, Download, ChevronRight, Zap, Lock, Users, Search, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toPng } from 'html-to-image';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ngdPic from '../assets/images/ngd-pic.png';

const Careers = () => {
    const roadmapRef = useRef(null);

    const careerSectors = [
        {
            title: "Explore Tech Careers",
            desc: "Red Team Operator | SOC Analyst | Cloud Security Engineer | Threat Intelligence Analyst | Cyber Law & Compliance Specialist | AI Security Engineer | Security Architect | CISO Track",
            icon: <Briefcase size={40} className="text-lh-purple" />,
            border: "border-lh-purple/20",
            stats: "Elite Roles",
            link: "/tech-careers"
        },
        {
            title: "Explore Industry Sectors",
            desc: "Comprehensive insights into critical industries driving global cybersecurity adoption and technical defense strategies.",
            icon: <Globe size={40} className="text-blue-500" />,
            border: "border-blue-500/20",
            stats: "Global Insights",
            link: "/industry-sectors"
        },
        {
            title: "Global Certifications",
            desc: "Industry-standard certifications from Red Team Ops to Blue Team, Cloud Security, AI, and GRC pathways.",
            icon: <ShieldCheck size={40} className="text-red-500" />,
            border: "border-red-500/20",
            stats: "Official Standard",
            link: "/certifications"
        },
        {
            title: "Explore Careers+",
            desc: "Dive deeper into your career possibilities with Careers+, a curated roadmap of in-demand cybersecurity jobs.",
            icon: <Layers size={40} className="text-orange-500" />,
            border: "border-orange-500/20",
            stats: "Curated Roadmaps",
            link: "/careers-plus"
        }
    ];

    const scrollToCareerPaths = () => {
        document.getElementById('career-paths')?.scrollIntoView({ behavior: 'smooth' });
    };

    const downloadRoadmap = async () => {
        if (roadmapRef.current) {
            try {
                const dataUrl = await toPng(roadmapRef.current, {
                    quality: 1.0,
                    pixelRatio: 2,
                    backgroundColor: '#050505'
                });
                const link = document.createElement('a');
                link.href = dataUrl;
                link.download = 'CSCA-Cybersecurity-Career-Roadmap.png';
                link.click();
            } catch (error) {
                console.error('Error generating roadmap:', error);
            }
        }
    };

    return (
        <div className="bg-[#050505] min-h-screen text-white font-plus-jakarta overflow-x-hidden selection:bg-lh-purple selection:text-white">
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
                            <Eye size={20} strokeWidth={2.5} className="animate-pulse" />
                            <span className="uppercase tracking-[0.4em] text-[11px] font-black">Elite Career Mapping</span>
                        </div>

                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-[900] leading-[1.2] tracking-tighter uppercase max-w-4xl">
                            Build a <span className="text-lh-purple">Cyber Career</span> <br />
                            <span className="text-white opacity-40 outline-text">That Actually Pays</span> — <br />
                            <span className="text-white/80">Not Just A Certificate</span>
                        </h1>

                        <p className="text-gray-400 text-base md:text-lg font-medium max-w-xl leading-relaxed">
                            CSCA maps real-world cybersecurity roles across Red Team, Blue Team, Cloud, GRC, AI Security, and Digital Forensics — aligned with real industry demand.
                        </p>

                        <div className="flex flex-wrap gap-4">
                            <button
                                onClick={scrollToCareerPaths}
                                className="bg-lh-purple text-white py-4 px-10 rounded-full font-black text-xs uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all shadow-[0_0_30px_rgba(188,19,254,0.3)]"
                            >
                                Start Your Journey
                            </button>
                            <button
                                onClick={downloadRoadmap}
                                className="border border-white/10 backdrop-blur-md py-4 px-10 rounded-full font-black text-xs uppercase tracking-[0.2em] hover:bg-white/10 transition-all flex items-center gap-2"
                            >
                                <Download size={16} /> Download Roadmap
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
                            className="relative z-10 w-full max-w-[450px] animate-float-glow drop-shadow-[0_0_50px_rgba(188,19,254,0.3)]"
                        />
                    </motion.div>
                </div>
            </section>

            {/* --- NEW: Explore Career Path Section --- */}
            <section id="career-paths" className="py-24 px-6 relative z-10 bg-gradient-to-b from-transparent to-[#0a0a0a]">
                <div className="max-w-[1400px] mx-auto">
                    {/* Intro */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-20"
                    >
                        <div className="flex items-center justify-center gap-3 mb-6">
                            <Target className="text-lh-purple" size={24} />
                            <span className="uppercase tracking-[0.4em] text-[11px] font-black text-lh-purple">EXPLORE Career Path</span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-[900] tracking-tighter uppercase mb-6">
                            Cybersecurity is <span className="text-lh-purple">not one role.</span>
                        </h2>
                        <p className="text-gray-400 text-lg max-w-3xl mx-auto leading-relaxed font-medium">
                            It's an ecosystem of attackers, defenders, cloud architects, AI specialists, and governance leaders.
                            <br /><span className="text-white font-bold">Choose your domain. Build your mastery.</span>
                        </p>
                    </motion.div>

                    {/* Career Tracks Grid */}
                    <div className="space-y-12">
                        {/* RED TEAM */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="group p-10 md:p-12 rounded-[40px] bg-white/[0.02] border border-red-500/20 hover:border-red-500/40 transition-all duration-500"
                        >
                            <div className="grid lg:grid-cols-3 gap-10">
                                <div className="lg:col-span-2 space-y-6">
                                    <div className="flex items-center gap-4">
                                        <div className="p-4 bg-red-500/10 rounded-2xl">
                                            <Target className="text-red-500" size={32} />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-[900] uppercase tracking-tight text-white">🛡️ RED TEAM / OFFENSIVE SECURITY</h3>
                                            <p className="text-red-500 font-bold text-sm mt-1">Break Systems. Expose Weaknesses. Strengthen Defense.</p>
                                        </div>
                                    </div>

                                    <p className="text-gray-400 leading-relaxed">
                                        Offensive security professionals simulate real-world attacks to uncover vulnerabilities before adversaries do.
                                    </p>

                                    <div>
                                        <h4 className="text-sm font-black uppercase tracking-widest text-white/60 mb-3">Ideal For:</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {['Ethical Hackers', 'Pentesters', 'Red Team Operators', 'Bug Bounty Hunters'].map((role, i) => (
                                                <span key={i} className="px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-full text-xs font-bold text-white">
                                                    {role}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-sm font-black uppercase tracking-widest text-white/60 mb-3">Core Skills Covered:</h4>
                                        <div className="grid grid-cols-2 gap-2">
                                            {['Exploitation frameworks', 'Privilege escalation', 'Post-exploitation', 'Web & API hacking', 'Active Directory attacks'].map((skill, i) => (
                                                <div key={i} className="flex items-center gap-2 text-sm text-gray-400">
                                                    <CheckCircle2 size={16} className="text-red-500" />
                                                    {skill}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <h4 className="text-sm font-black uppercase tracking-widest text-lh-purple mb-4">Certifications:</h4>
                                        <div className="space-y-3">
                                            {[
                                                { code: 'CVS-APT', name: 'Advanced Penetration Testing' },
                                                { code: 'CVS-WAPT', name: 'Web Application Penetration Testing' },
                                                { code: 'CVS-MAPT', name: 'Mobile Application Pentesting' },
                                                { code: 'CVS-RTO', name: 'Red Team Operations' }
                                            ].map((cert, i) => (
                                                <div key={i} className="p-3 bg-white/[0.02] border border-white/5 rounded-xl">
                                                    <div className="font-black text-white text-sm">{cert.code}</div>
                                                    <div className="text-xs text-gray-500 mt-1">{cert.name}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <button className="w-full py-3 px-6 bg-red-500/10 border border-red-500/30 rounded-full text-xs font-black uppercase tracking-widest text-red-500 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2">
                                        View Red Team Roadmap <ChevronRight size={14} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>

                        {/* BLUE TEAM */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="group p-10 md:p-12 rounded-[40px] bg-white/[0.02] border border-blue-500/20 hover:border-blue-500/40 transition-all duration-500"
                        >
                            <div className="grid lg:grid-cols-3 gap-10">
                                <div className="lg:col-span-2 space-y-6">
                                    <div className="flex items-center gap-4">
                                        <div className="p-4 bg-blue-500/10 rounded-2xl">
                                            <Shield className="text-blue-500" size={32} />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-[900] uppercase tracking-tight text-white">🔷 BLUE TEAM / DEFENSIVE SECURITY</h3>
                                            <p className="text-blue-500 font-bold text-sm mt-1">Detect. Respond. Contain.</p>
                                        </div>
                                    </div>

                                    <p className="text-gray-400 leading-relaxed">
                                        Defensive professionals monitor threats, investigate breaches, and defend enterprise environments in real time.
                                    </p>

                                    <div>
                                        <h4 className="text-sm font-black uppercase tracking-widest text-white/60 mb-3">Ideal For:</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {['SOC Analysts', 'Incident Responders', 'Threat Hunters', 'Malware Analysts'].map((role, i) => (
                                                <span key={i} className="px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-xs font-bold text-white">
                                                    {role}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-sm font-black uppercase tracking-widest text-white/60 mb-3">Core Skills Covered:</h4>
                                        <div className="grid grid-cols-2 gap-2">
                                            {['Threat detection', 'Log analysis', 'Incident response', 'Forensics investigation', 'Malware dissection'].map((skill, i) => (
                                                <div key={i} className="flex items-center gap-2 text-sm text-gray-400">
                                                    <CheckCircle2 size={16} className="text-blue-500" />
                                                    {skill}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <h4 className="text-sm font-black uppercase tracking-widest text-lh-purple mb-4">Certifications:</h4>
                                        <div className="space-y-3">
                                            {[
                                                { code: 'CVS-SOC', name: 'SOC Operations & SIEM Analysis' },
                                                { code: 'CVS-TMDR', name: 'Threat Monitoring & Detection' },
                                                { code: 'CVS-DFIR', name: 'Digital Forensics & Incident Response' },
                                                { code: 'CVS-MAP', name: 'Malware Analysis Professional' }
                                            ].map((cert, i) => (
                                                <div key={i} className="p-3 bg-white/[0.02] border border-white/5 rounded-xl">
                                                    <div className="font-black text-white text-sm">{cert.code}</div>
                                                    <div className="text-xs text-gray-500 mt-1">{cert.name}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <button className="w-full py-3 px-6 bg-blue-500/10 border border-blue-500/30 rounded-full text-xs font-black uppercase tracking-widest text-blue-500 hover:bg-blue-500 hover:text-white transition-all flex items-center justify-center gap-2">
                                        View Blue Team Roadmap <ChevronRight size={14} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>

                        {/* CLOUD & DEVSECOPS */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="group p-10 md:p-12 rounded-[40px] bg-white/[0.02] border border-cyan-500/20 hover:border-cyan-500/40 transition-all duration-500"
                        >
                            <div className="grid lg:grid-cols-3 gap-10">
                                <div className="lg:col-span-2 space-y-6">
                                    <div className="flex items-center gap-4">
                                        <div className="p-4 bg-cyan-500/10 rounded-2xl">
                                            <Cloud className="text-cyan-500" size={32} />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-[900] uppercase tracking-tight text-white">☁ CLOUD & DEVSECOPS</h3>
                                            <p className="text-cyan-500 font-bold text-sm mt-1">Secure the Infrastructure of the Future.</p>
                                        </div>
                                    </div>

                                    <p className="text-gray-400 leading-relaxed">
                                        Cloud-native systems demand proactive security embedded into development pipelines.
                                    </p>

                                    <div>
                                        <h4 className="text-sm font-black uppercase tracking-widest text-white/60 mb-3">Ideal For:</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {['Cloud Engineers', 'DevOps Professionals', 'Security Architects'].map((role, i) => (
                                                <span key={i} className="px-4 py-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-xs font-bold text-white">
                                                    {role}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-sm font-black uppercase tracking-widest text-white/60 mb-3">Core Skills Covered:</h4>
                                        <div className="grid grid-cols-2 gap-2">
                                            {['Cloud threat modeling', 'IAM security', 'CI/CD pipeline protection', 'Container security', 'Infrastructure as Code security'].map((skill, i) => (
                                                <div key={i} className="flex items-center gap-2 text-sm text-gray-400">
                                                    <CheckCircle2 size={16} className="text-cyan-500" />
                                                    {skill}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <h4 className="text-sm font-black uppercase tracking-widest text-lh-purple mb-4">Certifications:</h4>
                                        <div className="space-y-3">
                                            {[
                                                { code: 'CSCA-CPCS', name: 'Cloud Security Specialist', pending: true },
                                                { code: 'CSCA-CPDSO', name: 'DevSecOps Professional', pending: true }
                                            ].map((cert, i) => (
                                                <div key={i} className="p-3 bg-white/[0.02] border border-white/5 rounded-xl">
                                                    <div className="font-black text-white text-sm flex items-center gap-2">
                                                        {cert.code}
                                                        {cert.pending && <span className="text-[10px] px-2 py-1 bg-yellow-500/20 text-yellow-500 rounded-full">Pending</span>}
                                                    </div>
                                                    <div className="text-xs text-gray-500 mt-1">{cert.name}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <button className="w-full py-3 px-6 bg-cyan-500/10 border border-cyan-500/30 rounded-full text-xs font-black uppercase tracking-widest text-cyan-500 hover:bg-cyan-500 hover:text-white transition-all flex items-center justify-center gap-2">
                                        Explore Cloud Path <ChevronRight size={14} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>

                        {/* Grid: AI Security + Governance */}
                        <div className="grid lg:grid-cols-2 gap-8">
                            {/* AI SECURITY */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="p-8 rounded-[40px] bg-white/[0.02] border border-purple-500/20 hover:border-purple-500/40 transition-all duration-500"
                            >
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="p-4 bg-purple-500/10 rounded-2xl">
                                        <Brain className="text-purple-500" size={28} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-[900] uppercase tracking-tight text-white">🤖 AI & EMERGING TECH SECURITY</h3>
                                        <p className="text-purple-500 font-bold text-xs mt-1">Secure the Intelligence of Tomorrow.</p>
                                    </div>
                                </div>

                                <p className="text-gray-400 text-sm leading-relaxed mb-6">
                                    AI systems introduce new attack surfaces including model poisoning and prompt injection.
                                </p>

                                <div className="space-y-4">
                                    <div>
                                        <h4 className="text-xs font-black uppercase tracking-widest text-lh-purple mb-3">Certification:</h4>
                                        <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl">
                                            <div className="font-black text-white text-sm">CVS-AISEC</div>
                                            <div className="text-xs text-gray-500 mt-1">AI Security Professional</div>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-xs font-black uppercase tracking-widest text-white/60 mb-2">Skills Covered:</h4>
                                        <div className="space-y-1">
                                            {['AI threat modeling', 'ML model exploitation', 'LLM security risks', 'Data poisoning defense'].map((skill, i) => (
                                                <div key={i} className="flex items-center gap-2 text-xs text-gray-400">
                                                    <CheckCircle2 size={14} className="text-purple-500" />
                                                    {skill}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <button className="w-full py-3 px-6 bg-purple-500/10 border border-purple-500/30 rounded-full text-xs font-black uppercase tracking-widest text-purple-500 hover:bg-purple-500 hover:text-white transition-all flex items-center justify-center gap-2">
                                        Explore AI Security <ChevronRight size={14} />
                                    </button>
                                </div>
                            </motion.div>

                            {/* GOVERNANCE / ISO */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="p-8 rounded-[40px] bg-white/[0.02] border border-orange-500/20 hover:border-orange-500/40 transition-all duration-500"
                            >
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="p-4 bg-orange-500/10 rounded-2xl">
                                        <FileText className="text-orange-500" size={28} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-[900] uppercase tracking-tight text-white">📜 GOVERNANCE / ISO & COMPLIANCE</h3>
                                        <p className="text-orange-500 font-bold text-xs mt-1">Build Secure Frameworks. Lead Compliance.</p>
                                    </div>
                                </div>

                                <p className="text-gray-400 text-sm leading-relaxed mb-6">
                                    Security leadership requires governance expertise and global framework implementation.
                                </p>

                                <div>
                                    <h4 className="text-xs font-black uppercase tracking-widest text-white/60 mb-3">Ideal For:</h4>
                                    <div className="flex flex-wrap gap-2 mb-6">
                                        {['Compliance Officers', 'Security Managers', 'Risk Consultants'].map((role, i) => (
                                            <span key={i} className="px-3 py-1 bg-orange-500/10 border border-orange-500/20 rounded-full text-[10px] font-bold text-white">
                                                {role}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <h4 className="text-xs font-black uppercase tracking-widest text-lh-purple mb-3">Certifications:</h4>
                                            <div className="space-y-2">
                                                {[
                                                    { code: 'CSCA-CPISLI', name: 'ISO 27001 Lead Implementer' },
                                                    { code: 'CSCA-CPISLA', name: 'ISO 27001 Lead Auditor' }
                                                ].map((cert, i) => (
                                                    <div key={i} className="p-3 bg-white/[0.02] border border-white/5 rounded-xl">
                                                        <div className="font-black text-white text-xs">{cert.code}</div>
                                                        <div className="text-[10px] text-gray-500 mt-1">{cert.name}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <button className="w-full py-3 px-6 bg-orange-500/10 border border-orange-500/30 rounded-full text-xs font-black uppercase tracking-widest text-orange-500 hover:bg-orange-500 hover:text-white transition-all flex items-center justify-center gap-2">
                                            Explore Governance Track <ChevronRight size={14} />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    {/* Career Path Visual/Progression */}
                    <motion.div
                        ref={roadmapRef}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mt-20 p-12 rounded-[40px] bg-gradient-to-br from-lh-purple/5 to-blue-500/5 border border-white/10"
                    >
                        <div className="text-center mb-12">
                            <h3 className="text-3xl font-[900] uppercase tracking-tight mb-4">
                                <span className="text-lh-purple">Career Progression</span> Pathways
                            </h3>
                            <p className="text-gray-400">Entry Level → Mid-Level → Advanced → Leadership</p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {/* Blue Team Path */}
                            <div className="space-y-4">
                                <div className="text-center">
                                    <Shield className="inline-block text-blue-500 mb-2" size={32} />
                                    <h4 className="font-black text-white uppercase text-sm">Blue Team Path</h4>
                                </div>
                                <div className="space-y-3">
                                    {['CVS-SOC', 'CVS-TMDR', 'CVS-DFIR'].map((cert, i) => (
                                        <div key={i} className="relative">
                                            <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-2xl text-center">
                                                <div className="font-black text-white text-sm">{cert}</div>
                                                <div className="text-[10px] text-gray-500 mt-1">
                                                    {i === 0 && 'Entry Level'}
                                                    {i === 1 && 'Mid-Level'}
                                                    {i === 2 && 'Advanced'}
                                                </div>
                                            </div>
                                            {i < 2 && (
                                                <div className="absolute left-1/2 -translate-x-1/2 -bottom-3 text-blue-500">
                                                    <ChevronRight className="rotate-90" size={20} />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Red Team Path */}
                            <div className="space-y-4">
                                <div className="text-center">
                                    <Target className="inline-block text-red-500 mb-2" size={32} />
                                    <h4 className="font-black text-white uppercase text-sm">Red Team Path</h4>
                                </div>
                                <div className="space-y-3">
                                    {['CVS-WAPT', 'CVS-APT', 'CVS-RTO'].map((cert, i) => (
                                        <div key={i} className="relative">
                                            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-2xl text-center">
                                                <div className="font-black text-white text-sm">{cert}</div>
                                                <div className="text-[10px] text-gray-500 mt-1">
                                                    {i === 0 && 'Entry Level'}
                                                    {i === 1 && 'Mid-Level'}
                                                    {i === 2 && 'Advanced'}
                                                </div>
                                            </div>
                                            {i < 2 && (
                                                <div className="absolute left-1/2 -translate-x-1/2 -bottom-3 text-red-500">
                                                    <ChevronRight className="rotate-90" size={20} />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Cloud Path */}
                            <div className="space-y-4">
                                <div className="text-center">
                                    <Cloud className="inline-block text-cyan-500 mb-2" size={32} />
                                    <h4 className="font-black text-white uppercase text-sm">Cloud & Governance Path</h4>
                                </div>
                                <div className="space-y-3">
                                    {['CPCS', 'CPDSO', 'ISO Lead'].map((cert, i) => (
                                        <div key={i} className="relative">
                                            <div className="p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-2xl text-center">
                                                <div className="font-black text-white text-sm">{cert}</div>
                                                <div className="text-[10px] text-gray-500 mt-1">
                                                    {i === 0 && 'Entry Level'}
                                                    {i === 1 && 'Mid-Level'}
                                                    {i === 2 && 'Leadership'}
                                                </div>
                                            </div>
                                            {i < 2 && (
                                                <div className="absolute left-1/2 -translate-x-1/2 -bottom-3 text-cyan-500">
                                                    <ChevronRight className="rotate-90" size={20} />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="mt-12 text-center">
                            <button
                                onClick={downloadRoadmap}
                                className="px-8 py-4 bg-lh-purple text-white font-black uppercase tracking-[0.2em] text-xs rounded-full hover:bg-white hover:text-black transition-all shadow-[0_0_30px_rgba(188,19,254,0.3)] inline-flex items-center gap-3"
                            >
                                <Download size={16} /> Download Full Roadmap
                            </button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* --- Section 2: Career Sectors Grid --- */}
            <section className="py-24 px-6 relative z-10">
                <div className="max-w-[1400px] mx-auto">
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

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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
                                    <Link to={sector.link} className="flex items-center gap-3 text-xs font-black uppercase tracking-widest text-white group-hover:text-lh-purple transition-all duration-500">
                                        Learn more <ArrowRight size={16} />
                                    </Link>
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
