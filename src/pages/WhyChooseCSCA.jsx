import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Award,
    Shield,
    Target,
    Cloud,
    Zap,
    CheckCircle2,
    TrendingUp,
    Users,
    BookOpen,
    Download,
    ChevronRight,
    Globe,
    Lock,
    Database,
    Activity,
    Flag,
    Briefcase,
    GraduationCap,
    Building2,
    Check,
    X
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import def2Pic from '../assets/images/def2.png';

const WhyChooseCSCA = () => {
    return (
        <div className="bg-[#050505] min-h-screen text-white font-plus-jakarta overflow-x-hidden selection:bg-lh-purple selection:text-white">
            <Navbar />

            {/* === SECTION 1: HERO === */}
            <section className="relative pt-40 pb-20 px-6 overflow-hidden">
                {/* Background Glows */}
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-lh-purple/20 blur-[150px] rounded-full animate-pulse"></div>
                <div className="absolute bottom-[20%] left-[-5%] w-[300px] h-[300px] bg-blue-500/10 blur-[120px] rounded-full"></div>

                <div className="max-w-[1300px] mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10">
                    {/* Left Column - Text Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="space-y-8"
                    >
                        {/* Heading */}
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-[900] leading-[1.1] tracking-tighter uppercase">
                            Why Choose <br />
                            <span className="text-lh-purple">CSCA Certifications</span>
                        </h1>

                        {/* Subheading */}
                        <p className="text-xl md:text-2xl font-bold text-gray-300">
                            Practical. Industry-Aligned. Career-Transforming Cybersecurity Certifications.
                        </p>

                        {/* Short Description */}
                        <p className="text-base md:text-lg text-gray-400 max-w-2xl leading-relaxed font-medium">
                            CSCA certifications are designed to bridge the gap between theory and real-world cybersecurity operations.
                            Built for SOC analysts, penetration testers, and security engineers, our programs ensure hands-on expertise
                            aligned with global standards.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-wrap gap-4 pt-6">
                            <Link to="/certifications">
                                <button className="px-8 py-4 bg-lh-purple text-white font-black uppercase tracking-[0.2em] text-xs rounded-full hover:bg-white hover:text-black transition-all duration-300 shadow-[0_0_30px_rgba(188,19,254,0.3)] flex items-center gap-2">
                                    View Certifications <ChevronRight size={16} />
                                </button>
                            </Link>
                            <button className="px-8 py-4 bg-white/[0.03] border border-white/10 text-white font-black uppercase tracking-[0.2em] text-xs rounded-full hover:border-lh-purple/50 hover:bg-lh-purple/10 transition-all duration-300 flex items-center gap-2">
                                Download Brochure <Download size={16} />
                            </button>
                        </div>
                    </motion.div>

                    {/* Right Column - Mascot Image */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1 }}
                        className="relative flex justify-center items-center h-[400px] lg:h-[550px] order-first lg:order-last"
                    >
                        <div className="absolute inset-0 bg-lh-purple/10 blur-[100px] rounded-full scale-75 animate-pulse"></div>
                        <div className="absolute w-[85%] h-[75%] bg-white/[0.02] backdrop-blur-3xl border border-white/5 rounded-[60px] transform rotate-3"></div>
                        <img
                            src={def2Pic}
                            alt="Cybersecurity Professional"
                            className="relative z-10 w-full max-w-[420px] rounded-3xl drop-shadow-[0_0_50px_rgba(188,19,254,0.3)]"
                        />
                    </motion.div>
                </div>
            </section>

            {/* === SECTION 2: GLOBALLY ALIGNED STANDARDS === */}
            <section className="py-20 px-6 relative">
                <div className="max-w-[1200px] mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl font-[900] tracking-tighter uppercase mb-6">
                            Mapped to <span className="text-lh-purple">Global Security Frameworks</span>
                        </h2>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                        {[
                            { icon: <Shield size={32} />, title: 'NIST Cybersecurity Framework', color: 'from-blue-600 to-blue-800' },
                            { icon: <Target size={32} />, title: 'MITRE ATT&CK', color: 'from-red-600 to-red-800' },
                            { icon: <Lock size={32} />, title: 'ISO 27001 & SOC 2', color: 'from-green-600 to-green-800' },
                            { icon: <Globe size={32} />, title: 'Zero Trust Principles', color: 'from-purple-600 to-purple-800' }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="group p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-lh-purple/30 transition-all duration-500"
                            >
                                <div className={`p-4 bg-gradient-to-br ${item.color} rounded-2xl w-fit mb-6 group-hover:scale-110 transition-transform duration-500`}>
                                    {item.icon}
                                </div>
                                <h3 className="text-lg font-black uppercase tracking-tight text-white group-hover:text-lh-purple transition-colors">
                                    {item.title}
                                </h3>
                            </motion.div>
                        ))}
                    </div>

                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-center text-gray-400 max-w-4xl mx-auto leading-relaxed text-base md:text-lg font-medium"
                    >
                        Our certifications are mapped to globally recognized frameworks including NIST CSF, MITRE ATT&CK, ISO 27001, and Zero Trust architecture.
                        This alignment ensures that your skills are immediately applicable in enterprise environments and increases your professional credibility
                        across industries worldwide.
                    </motion.p>
                </div>
            </section>

            {/* === SECTION 3: INDUSTRY-VALIDATED CREDENTIALS === */}
            <section className="py-20 px-6 relative">
                <div className="max-w-[1200px] mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl font-[900] tracking-tighter uppercase mb-6">
                            Recognized <span className="text-lh-purple">Across the Industry</span>
                        </h2>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                        {[
                            { icon: <Users size={32} />, title: 'Trusted by SOC Teams', desc: 'Real-world defense operations' },
                            { icon: <Building2 size={32} />, title: 'Recognized by Enterprises', desc: 'Fortune 500 validated' },
                            { icon: <GraduationCap size={32} />, title: 'Valued in Academia', desc: 'University partnerships' },
                            { icon: <Briefcase size={32} />, title: 'Employer-Focused', desc: 'Industry-driven curriculum' }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="group p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-lh-purple/30 transition-all duration-500 text-center"
                            >
                                <div className="p-4 bg-lh-purple/10 rounded-2xl w-fit mx-auto mb-4 group-hover:bg-lh-purple/20 transition-all duration-500">
                                    <div className="text-lh-purple">{item.icon}</div>
                                </div>
                                <h3 className="text-xl font-black uppercase tracking-tight text-white mb-2 group-hover:text-lh-purple transition-colors">
                                    {item.title}
                                </h3>
                                <p className="text-sm text-gray-500 font-medium">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>

                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-center text-gray-400 max-w-3xl mx-auto leading-relaxed text-base md:text-lg font-medium"
                    >
                        CSCA certifications significantly improve your hiring potential by validating practical skills that employers actively seek.
                        Our credentials are recognized by leading cybersecurity enterprises, trusted by SOC teams globally, and valued by academic institutions
                        for their industry relevance and hands-on approach.
                    </motion.p>
                </div>
            </section>

            {/* === SECTION 4: HANDS-ON PRACTICAL APPROACH === */}
            <section className="py-20 px-6 relative">
                <div className="max-w-[1200px] mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl font-[900] tracking-tighter uppercase mb-6">
                            Real-World <span className="text-lh-purple">Practical Training</span>
                        </h2>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                        {[
                            { icon: <Activity size={28} />, title: 'Live Attack Simulations', color: 'from-red-500 to-orange-600' },
                            { icon: <Shield size={28} />, title: 'Blue Team & Red Team Scenarios', color: 'from-blue-500 to-indigo-700' },
                            { icon: <Cloud size={28} />, title: 'Cloud Security Labs', color: 'from-cyan-500 to-blue-600' },
                            { icon: <Zap size={28} />, title: 'Incident Response Exercises', color: 'from-yellow-500 to-orange-600' },
                            { icon: <Flag size={28} />, title: 'Capture The Flag Challenges', color: 'from-green-500 to-emerald-700' },
                            { icon: <Database size={28} />, title: 'Real Enterprise Scenarios', color: 'from-purple-500 to-pink-700' }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.08 }}
                                className="group p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-lh-purple/30 transition-all duration-500 relative overflow-hidden"
                            >
                                <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-[0.05] transition-opacity duration-700`}></div>
                                <div className="relative z-10 flex items-center gap-4">
                                    <div className="p-3 bg-lh-purple/10 rounded-xl text-lh-purple group-hover:bg-lh-purple/20 transition-all">
                                        {item.icon}
                                    </div>
                                    <h3 className="text-base font-black uppercase tracking-tight text-white group-hover:text-lh-purple transition-colors">
                                        {item.title}
                                    </h3>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-center text-gray-400 max-w-4xl mx-auto leading-relaxed text-base md:text-lg font-medium"
                    >
                        Students don't just study cybersecurity — they <span className="text-lh-purple font-bold">defend</span>,
                        <span className="text-lh-purple font-bold"> attack</span>, and <span className="text-lh-purple font-bold">analyze</span> real-world scenarios.
                        Our hands-on approach includes live simulations, CTF challenges, and enterprise-grade labs that mirror actual SOC operations,
                        ensuring you're ready from day one.
                    </motion.p>
                </div>
            </section>

            {/* === SECTION 5: CAREER IMPACT === */}
            <section className="py-20 px-6 relative">
                <div className="max-w-[1200px] mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl font-[900] tracking-tighter uppercase mb-6">
                            Boost Your <span className="text-lh-purple">Cybersecurity Career</span>
                        </h2>
                    </motion.div>

                    {/* Table */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="overflow-x-auto mb-12"
                    >
                        <div className="min-w-[600px] rounded-3xl border border-white/10 overflow-hidden bg-white/[0.02] backdrop-blur-xl">
                            {/* Header */}
                            <div className="grid grid-cols-3 bg-lh-purple/10 border-b border-white/10">
                                <div className="p-6 font-black uppercase text-sm tracking-widest text-lh-purple">Role</div>
                                <div className="p-6 font-black uppercase text-sm tracking-widest text-lh-purple border-l border-white/10">Salary Impact</div>
                                <div className="p-6 font-black uppercase text-sm tracking-widest text-lh-purple border-l border-white/10">Skill Gain</div>
                            </div>

                            {/* Rows */}
                            {[
                                { role: 'SOC Analyst', salary: 'High Demand', skill: 'Threat Detection' },
                                { role: 'Pentester', salary: 'Offensive Skills', skill: 'Exploitation' },
                                { role: 'Security Engineer', salary: 'Architecture', skill: 'Defense Strategy' }
                            ].map((row, i) => (
                                <div key={i} className={`grid grid-cols-3 hover:bg-lh-purple/5 transition-all duration-300 ${i !== 2 ? 'border-b border-white/5' : ''}`}>
                                    <div className="p-6 font-bold text-white">{row.role}</div>
                                    <div className="p-6 font-medium text-gray-400 border-l border-white/5">{row.salary}</div>
                                    <div className="p-6 font-medium text-gray-400 border-l border-white/5">{row.skill}</div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-center text-gray-400 max-w-3xl mx-auto leading-relaxed text-base md:text-lg font-medium"
                    >
                        CSCA certifications accelerate your career progression by validating in-demand skills. Our alumni report faster job placements,
                        higher starting salaries, and greater confidence in technical interviews. Whether transitioning into cybersecurity or advancing
                        your current role, CSCA provides the competitive edge you need.
                    </motion.p>
                </div>
            </section>

            {/* === SECTION 6: EXPERT DESIGNED CURRICULUM === */}
            <section className="py-20 px-6 relative">
                <div className="max-w-[1200px] mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl font-[900] tracking-tighter uppercase mb-6">
                            <span className="text-lh-purple">Expert</span> Designed Curriculum
                        </h2>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { icon: <Award size={28} />, title: 'Industry Experts' },
                            { icon: <TrendingUp size={28} />, title: 'Latest Threats' },
                            { icon: <BookOpen size={28} />, title: 'Real Case Studies' },
                            { icon: <Zap size={28} />, title: 'Continuous Updates' }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="group p-8 rounded-3xl bg-gradient-to-br from-lh-purple/5 to-transparent border border-white/5 hover:border-lh-purple/30 transition-all duration-500 text-center"
                            >
                                <div className="p-4 bg-lh-purple/10 rounded-2xl w-fit mx-auto mb-4 group-hover:scale-110 transition-transform duration-500">
                                    <div className="text-lh-purple">{item.icon}</div>
                                </div>
                                <h3 className="text-lg font-black uppercase tracking-tight text-white group-hover:text-lh-purple transition-colors">
                                    {item.title}
                                </h3>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* === SECTION 7: COMPARISON SECTION === */}
            <section className="py-20 px-6 relative">
                <div className="max-w-[1200px] mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl font-[900] tracking-tighter uppercase mb-6">
                            Why CSCA vs <span className="text-lh-purple">Traditional Certifications</span>
                        </h2>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="overflow-x-auto"
                    >
                        <div className="min-w-[600px] rounded-3xl border border-white/10 overflow-hidden bg-white/[0.02] backdrop-blur-xl">
                            {/* Header */}
                            <div className="grid grid-cols-3 bg-lh-purple/10 border-b border-white/10">
                                <div className="p-6 font-black uppercase text-sm tracking-widest text-white">Feature</div>
                                <div className="p-6 font-black uppercase text-sm tracking-widest text-lh-purple border-l border-white/10 text-center">CSCA</div>
                                <div className="p-6 font-black uppercase text-sm tracking-widest text-gray-500 border-l border-white/10 text-center">Others</div>
                            </div>

                            {/* Rows */}
                            {[
                                { feature: 'Practical Labs', csca: true, others: 'Limited' },
                                { feature: 'MITRE Mapping', csca: true, others: 'Rare' },
                                { feature: 'Real SOC Scenarios', csca: true, others: 'Theory Heavy' },
                                { feature: 'Enterprise Focus', csca: true, others: 'Exam Focused' }
                            ].map((row, i) => (
                                <div key={i} className={`grid grid-cols-3 hover:bg-lh-purple/5 transition-all duration-300 ${i !== 3 ? 'border-b border-white/5' : ''}`}>
                                    <div className="p-6 font-bold text-white">{row.feature}</div>
                                    <div className="p-6 border-l border-white/5 text-center">
                                        {row.csca === true ? (
                                            <Check className="inline-block text-green-500" size={24} strokeWidth={3} />
                                        ) : (
                                            <span className="text-gray-400 font-medium">{row.csca}</span>
                                        )}
                                    </div>
                                    <div className="p-6 border-l border-white/5 text-center">
                                        {typeof row.others === 'string' ? (
                                            <span className="text-gray-500 font-medium">{row.others}</span>
                                        ) : (
                                            <X className="inline-block text-red-500" size={24} strokeWidth={3} />
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* === SECTION 8: TESTIMONIALS === */}
            <section className="py-20 px-6 relative">
                <div className="max-w-[1200px] mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl font-[900] tracking-tighter uppercase mb-6">
                            Success <span className="text-lh-purple">Stories</span>
                        </h2>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            {
                                quote: "CSCA helped me land a SOC Analyst role within 3 months. The hands-on labs were exactly what I needed.",
                                name: "Rahul Sharma",
                                role: "Security Analyst",
                                initial: "RS"
                            },
                            {
                                quote: "The MITRE ATT&CK mapping made all the difference in my interviews. Employers know CSCA means real skills.",
                                name: "Priya Mehta",
                                role: "Threat Hunter",
                                initial: "PM"
                            },
                            {
                                quote: "From zero cybersecurity experience to penetration tester in 6 months. CSCA's practical approach works.",
                                name: "Arjun Patel",
                                role: "Penetration Tester",
                                initial: "AP"
                            }
                        ].map((testimonial, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.15 }}
                                className="group p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-lh-purple/30 transition-all duration-500"
                            >
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 rounded-full bg-lh-purple/20 flex items-center justify-center font-black text-lh-purple border border-lh-purple/30">
                                        {testimonial.initial}
                                    </div>
                                    <div>
                                        <h4 className="font-black text-white text-sm">{testimonial.name}</h4>
                                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{testimonial.role}</p>
                                    </div>
                                </div>
                                <p className="text-gray-400 leading-relaxed font-medium italic">
                                    "{testimonial.quote}"
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* === SECTION 9: STRONG CTA === */}
            <section className="py-20 px-6 relative mb-20">
                <div className="max-w-[1200px] mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="p-1 rounded-[3rem] bg-gradient-to-r from-lh-purple/20 to-transparent"
                    >
                        <div className="p-12 md:p-16 rounded-[2.9rem] bg-[#0a0a0a] border border-white/5 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-lh-purple/10 blur-[100px] rounded-full group-hover:bg-lh-purple/20 transition-colors duration-700"></div>

                            <div className="relative z-10 text-center space-y-8">
                                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white uppercase tracking-tighter">
                                    Ready to Become <br />
                                    <span className="text-lh-purple">Enterprise-Ready?</span>
                                </h2>

                                <div className="flex flex-wrap justify-center gap-4 pt-6">
                                    <Link to="/certifications">
                                        <button className="px-10 py-5 bg-lh-purple text-white font-black uppercase tracking-[0.2em] text-xs rounded-full hover:bg-white hover:text-black transition-all duration-300 shadow-[0_0_30px_rgba(188,19,254,0.3)] flex items-center gap-3">
                                            Enroll Now <ChevronRight size={16} />
                                        </button>
                                    </Link>
                                    <button className="px-10 py-5 bg-white/[0.03] border border-white/10 text-white font-black uppercase tracking-[0.2em] text-xs rounded-full hover:border-lh-purple/50 hover:bg-lh-purple/10 transition-all duration-300 flex items-center gap-3">
                                        Talk to Advisor <Users size={16} />
                                    </button>
                                    <button className="px-10 py-5 bg-white/[0.03] border border-white/10 text-white font-black uppercase tracking-[0.2em] text-xs rounded-full hover:border-lh-purple/50 hover:bg-lh-purple/10 transition-all duration-300 flex items-center gap-3">
                                        Download Syllabus <Download size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default WhyChooseCSCA;
