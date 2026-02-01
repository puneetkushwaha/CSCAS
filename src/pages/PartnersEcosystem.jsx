import React, { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useMotionValue, useSpring, AnimatePresence, animate } from "framer-motion";
import { Shield, Users, Globe, Award, CheckCircle2, ArrowRight, Zap, Target, BarChart3, Fingerprint, Cpu, Layers, Hexagon, Workflow, Code2 } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import mascot from "../assets/images/ngd-pic.png";

// --- ADVANCED HELPERS ---

const useMousePosition = () => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);
    return mousePosition;
};

const MaskedReveal = ({ children, delay = 0, isHero = false }) => {
    return (
        <div className="relative overflow-visible">
            <motion.div
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay }}
            >
                {children}
            </motion.div>
        </div>
    );
};

const CountUp = ({ value, duration = 2 }) => {
    const [displayValue, setDisplayValue] = useState("0");
    const count = useMotionValue(0);
    const rounded = useTransform(count, (latest) => Math.floor(latest));

    useEffect(() => {
        const numericValue = parseFloat(value.replace(/[^0-9.]/g, ''));
        const suffix = value.replace(/[0-9.]/g, '');

        const controls = animate(count, numericValue, {
            duration: duration,
            ease: "easeOut",
            onUpdate: (latest) => {
                // Handle decimal for 99.9%
                if (value.includes('.')) {
                    setDisplayValue(latest.toFixed(1) + suffix);
                } else {
                    setDisplayValue(Math.floor(latest) + suffix);
                }
            }
        });
        return controls.stop;
    }, [value]);

    return <span>{displayValue}</span>;
};

const TiltCard = ({ children, className }) => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
    const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const xPct = (mouseX / width - 0.5) * 15;
        const yPct = (mouseY / height - 0.5) * -15;
        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0); y.set(0);
    };

    return (
        <motion.div
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ rotateX: mouseYSpring, rotateY: mouseXSpring, transformStyle: "preserve-3d" }}
            className={`group perspective-1000 ${className}`}
        >
            {children}
        </motion.div>
    );
};

// --- MAIN COMPONENT ---

const PartnersEcosystem = () => {
    const mousePos = useMousePosition();
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll();

    // Parallax
    const yParallax = useTransform(scrollYProgress, [0, 1], [0, -400]);
    const beamOpacity = useTransform(scrollYProgress, [0, 0.2], [0.4, 0.1]);

    const stats = [
        { label: "Partner Nodes", value: "450+", icon: <Globe /> },
        { label: "Certified Nations", value: "32", icon: <Award /> },
        { label: "Active Experts", value: "12K", icon: <Users /> },
        { label: "Sync Rating", value: "99.9%", icon: <Shield /> },
    ];

    const benefits = [
        { title: "Recognition", desc: "Elite standing in the global ecosystem.", icon: <Globe /> },
        { title: "Intel Core", desc: "Proprietary CSCA intelligence access.", icon: <Fingerprint /> },
        { title: "Coalition", desc: "Direct industry-leading collaboration.", icon: <Users /> },
        { title: "Scalability", desc: "Plug-and-play defense infrastructure.", icon: <Cpu /> },
    ];

    return (
        <div className="bg-[#050505] text-white min-h-screen font-sans selection:bg-lh-purple selection:text-white overflow-x-hidden relative">
            <style dangerouslySetInnerHTML={{
                __html: `
                .grid-pattern {
                    background-image: linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px),
                                    linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px);
                    background-size: 50px 50px;
                }
                .text-glow { text-shadow: 0 0 80px rgba(188, 19, 254, 0.4); }
                .inner-glow { box-shadow: inset 0 0 50px rgba(188, 19, 254, 0.05); }
                @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
                .animate-marquee { animation: marquee 30s linear infinite; }
                
                .noise-overlay {
                    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                    background: url('https://grainy-gradients.vercel.app/noise.svg');
                    opacity: 0.15; z-index: 50; pointer-events: none; mix-blend-mode: overlay;
                }
                .light-beam {
                    position: absolute; top: -50%; width: 150px; height: 200%;
                    background: linear-gradient(to bottom, transparent, rgba(188, 19, 254, 0.15), transparent);
                    transform: rotate(25deg); filter: blur(60px); pointer-events: none;
                }
                @keyframes float { 0% { transform: translateY(0px); } 50% { transform: translateY(-20px); } 100% { transform: translateY(0px); } }
                .animate-float { animation: float 6s ease-in-out infinite; }
                .text-sharp { letter-spacing: -0.04em; }
            `}} />

            <div className="noise-overlay" />

            {/* --- ATMOSPHERIC BACKGROUND --- */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute inset-0 grid-pattern opacity-40" />
                <motion.div style={{ opacity: beamOpacity }} className="absolute inset-0">
                    <div className="light-beam left-[10%]" />
                    <div className="light-beam left-[40%] text-lh-purple/20" />
                    <div className="light-beam left-[80%]" />
                </motion.div>

                {/* Mouse Aura */}
                <div
                    className="absolute inset-0 transition-opacity duration-1000"
                    style={{
                        background: `radial-gradient(1000px circle at ${mousePos.x}px ${mousePos.y}px, rgba(188, 19, 254, 0.1), transparent 70%)`
                    }}
                />
            </div>

            <Navbar />

            {/* --- PHASE 1 HERO: PERFECTED --- */}
            <section className="relative pt-24 pb-12 md:pt-40 md:pb-24 px-8 md:px-16 lg:px-24 z-10">
                <div className="max-w-screen-xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    <div className="space-y-6 md:space-y-10 text-center lg:text-left">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-center lg:justify-start gap-4">
                            <div className="hidden md:block w-12 h-[1px] bg-lh-purple" />
                            <span className="text-lh-purple text-[10px] font-black uppercase tracking-[0.4em] md:tracking-[0.6em]">Nexus Protocol // Active</span>
                            <div className="md:hidden w-4 h-[1px] bg-lh-purple" />
                        </motion.div>

                        <div className="space-y-4">
                            <MaskedReveal isHero>
                                <h1 className="text-5xl md:text-8xl font-[950] tracking-tighter leading-[0.8] uppercase text-sharp text-white">
                                    Define the
                                </h1>
                            </MaskedReveal>
                            <MaskedReveal delay={0.1} isHero>
                                <h1 className="text-5xl md:text-8xl font-[950] tracking-tighter leading-[0.8] uppercase text-transparent bg-clip-text bg-gradient-to-r from-white via-lh-purple to-purple-500 text-glow">
                                    Core Nation
                                </h1>
                            </MaskedReveal>
                        </div>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="text-gray-400 text-xl font-medium max-w-xl leading-relaxed"
                        >
                            Join elite institutions architecting the new foundation of global digital security. Massive reach, unparalleled power.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="flex flex-wrap justify-center lg:justify-start gap-4 md:gap-8"
                        >
                            <button className="px-14 py-6 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-[0.4em] hover:bg-lh-purple hover:text-white transition-all shadow-[0_0_50px_rgba(255,255,255,0.15)] flex items-center gap-4">
                                ESTABLISH ALLIANCE <ArrowRight size={20} />
                            </button>
                            <button className="px-14 py-6 bg-white/5 border border-white/10 text-white rounded-2xl font-black text-xs uppercase tracking-[0.4em] hover:bg-white/10 transition-all backdrop-blur-3xl">
                                VIEW ANALYTICS
                            </button>
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="relative flex justify-center lg:justify-end"
                    >
                        {/* HUD PARALLAX RINGS */}
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                            className="absolute w-[100%] h-[100%] md:w-[120%] md:h-[120%] border border-white/5 rounded-full"
                        />
                        <motion.div
                            animate={{ rotate: -360 }}
                            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                            className="absolute w-[90%] h-[90%] md:w-[110%] md:h-[110%] border border-dashed border-lh-purple/20 rounded-full"
                        />

                        <img
                            src={mascot}
                            alt="Nexus"
                            className="relative z-10 w-full max-w-[280px] md:max-w-[450px] drop-shadow-[0_0_120px_rgba(188,19,254,0.4)] animate-float"
                        />
                    </motion.div>
                </div>
            </section>

            {/* --- STATS SECTION --- */}
            <section className="py-20 px-8 md:px-16 border-y border-white/5 bg-white/[0.01] relative z-10">
                <div className="max-w-screen-xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12">
                    {stats.map((s, i) => (
                        <div key={i} className="text-center space-y-4 group cursor-default">
                            <MaskedReveal delay={i * 0.1}>
                                <div className="text-lh-purple flex justify-center group-hover:scale-110 transition-transform mb-4">{React.cloneElement(s.icon, { size: 32 })}</div>
                                <h3 className="text-5xl md:text-6xl font-[950] tracking-tighter mb-2">
                                    <CountUp value={s.value} />
                                </h3>
                                <div className="overflow-visible">
                                    <p className="text-gray-500 font-black uppercase tracking-[0.4em] text-[10px] whitespace-nowrap">{s.label}</p>
                                </div>
                            </MaskedReveal>
                        </div>
                    ))}
                </div>
            </section>

            {/* --- BENTO GRID BENEFITS --- */}
            <section className="py-24 px-8 md:px-16 relative z-10">
                <div className="max-w-screen-xl mx-auto space-y-16">
                    <div className="text-center space-y-4">
                        <span className="text-lh-purple text-[10px] font-black uppercase tracking-[0.6em]">Operational Matrix</span>
                        <h2 className="text-4xl md:text-7xl font-[950] tracking-tighter uppercase leading-none">Elite <span className="text-lh-purple underline decoration-lh-purple/30">Arsenal</span></h2>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {benefits.map((b, i) => (
                            <TiltCard key={i} className="h-full">
                                <div className="h-full p-8 md:p-12 bg-white/[0.02] border border-white/5 rounded-[40px] md:rounded-[60px] hover:border-lh-purple/30 transition-all duration-500 inner-glow flex flex-col items-center text-center space-y-8 md:space-y-10 group overflow-hidden relative">
                                    <div className="absolute inset-0 bg-lh-purple/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="relative z-10 w-20 h-20 md:w-24 md:h-24 bg-lh-purple/10 rounded-[25px] md:rounded-[35px] flex items-center justify-center text-lh-purple group-hover:bg-lh-purple group-hover:text-white transition-all duration-500 shadow-2xl">
                                        {React.cloneElement(b.icon, { size: 36 })}
                                    </div>
                                    <h3 className="relative z-10 text-2xl md:text-3xl font-[950] uppercase tracking-tight">{b.title}</h3>
                                    <p className="relative z-10 text-gray-400 font-black uppercase tracking-[0.15em] text-[9px] md:text-[10px] leading-loose">{b.desc}</p>
                                </div>
                            </TiltCard>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- LOGO MARQUEE --- */}
            <section className="py-24 overflow-hidden bg-white/[0.01] border-y border-white/5 relative z-10">
                <div className="flex animate-marquee gap-32 items-center whitespace-nowrap">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="flex gap-32 items-center">
                            {["MICROSOFT", "GOOGLE", "CISCO", "AWS", "SAP", "META", "IBM"].map((logo) => (
                                <span key={logo} className="text-5xl font-black italic tracking-widest text-white/10 hover:text-lh-purple hover:scale-110 transition-all cursor-default">
                                    {logo}
                                </span>
                            ))}
                        </div>
                    ))}
                </div>
            </section>

            {/* --- FINAL CTA --- */}
            <section className="py-32 md:py-48 px-8 md:px-16 relative z-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="max-w-screen-xl mx-auto rounded-[50px] md:rounded-[80px] p-16 md:p-32 bg-gradient-to-br from-lh-purple/30 via-[#0a0a0a] to-black border border-white/5 text-center space-y-10 md:space-y-12 inner-glow relative group overflow-hidden"
                >
                    <div className="absolute inset-0 bg-lh-purple/10 blur-[150px] scale-150 animate-pulse" />
                    <div className="relative z-10 space-y-4 md:space-y-6">
                        <span className="text-lh-purple text-xs font-black uppercase tracking-[0.6em] md:tracking-[1em]">Final Convergence</span>
                        <h2 className="text-5xl md:text-8xl font-[1000] tracking-tighter uppercase leading-none">Assemble <br /> <span className="text-lh-purple text-glow">The Nexus</span></h2>
                    </div>
                    <p className="relative z-10 text-gray-400 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed italic">
                        "The future belongs to those who architect it. Join the elite alliance."
                    </p>
                    <div className="relative z-10 pt-6 md:pt-8">
                        <button className="px-12 py-5 md:px-16 md:py-6 bg-white text-black rounded-[25px] md:rounded-[30px] font-[950] text-sm md:text-base uppercase tracking-[0.3em] md:tracking-[0.4em] shadow-[0_0_60px_rgba(255,255,255,0.3)] hover:bg-lh-purple hover:text-white transition-all duration-500">
                            APPLY NOW
                        </button>
                    </div>
                </motion.div>
            </section>

            <Footer />
        </div>
    );
};

export default PartnersEcosystem;
