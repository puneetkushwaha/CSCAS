import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { GraduationCap, Building2, Briefcase, Cpu, Percent, BookOpen, Ticket, Globe, Megaphone, Terminal, Scan, ArrowRight, Server, Layers, Settings, Code, ArrowLeft } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ngdPic from '../assets/images/ngd-pic.png';

const PartnersEcosystem = () => {
    const partnerTypes = [
        {
            title: "Authorized Training Partner",
            desc: "Deliver official CSCA certifications and training programs to your local market.",
            icon: <GraduationCap size={32} />,
            size: "col-span-1 md:col-span-2 row-span-1",
            color: "from-purple-500/10 to-transparent",
            benefits: ["Instructor kits", "Discounted vouchers", "Regional leads", "Annual bootcamps"]
        },
        {
            title: "Academic Partner",
            desc: "Integrate CSCA curriculum into university programs to prepare the next generation of cyber talent.",
            icon: <BookOpen size={32} />,
            size: "col-span-1 row-span-1",
            color: "from-blue-500/10 to-transparent",
            benefits: ["Curriculum mapping", "Faculty training", "Student pathways", "Lab support"]
        },
        {
            title: "Corporate Partner",
            desc: "Upskill your internal security teams with customized training and certification pathways.",
            icon: <Building2 size={32} />,
            size: "col-span-1 row-span-2",
            color: "from-emerald-500/10 to-transparent",
            benefits: ["Private batches", "Skill assessments", "SOC/Red Team training"]
        },
        {
            title: "Technology Partner",
            desc: "Collaborate on R&D and integrate advanced security tools into the CSCA training ecosystem.",
            icon: <Cpu size={32} />,
            size: "col-span-1 md:col-span-3 row-span-1",
            color: "from-cyan-500/10 to-transparent",
            benefits: ["Tech showcase", "Joint research", "API integrations", "Event exposure"]
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

    const backendTech = [
        "Node.js / Golang", "PostgreSQL", "Redis", "Kafka / RabbitMQ",
        "Elasticsearch", "MinIO / S3", "Keycloak / Auth0", "Kubernetes"
    ];

    const microservices = [
        "Auth Service", "Partner Management", "Certification Engine", "Courseware Delivery",
        "Global Directory", "Payment Gateway", "Marketing & Notifications", "Audit & Security"
    ];

    const adminFeatures = [
        "Exam creation", "Partner approval", "Content management", "Instructor assignment",
        "Pricing updates", "Revenue dashboard", "User blocking", "Certificate revocation"
    ];

    const frontendTech = ["Next.js", "TailwindCSS", "ShadCN UI", "Framer Motion"];

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
                        <Link
                            to="/"
                            className="inline-flex items-center gap-2 text-lh-purple hover:text-white uppercase text-[10px] tracking-[0.4em] font-black group mb-4"
                        >
                            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                            Back to Home
                        </Link>

                        <div className="flex items-center gap-3 text-lh-purple">
                            <Terminal size={20} className="animate-pulse" />
                            <span className="uppercase tracking-[0.4em] text-[11px] font-black">Ecosystem v2.0</span>
                        </div>

                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-[1000] leading-[1] tracking-tighter uppercase max-w-4xl">
                            Partner With <br />
                            <span className="text-lh-purple">CSCA</span>
                        </h1>

                        <p className="text-gray-400 text-lg font-medium max-w-xl leading-relaxed">
                            Grow your cybersecurity training business inside the CSCA global partner ecosystem. Join an elite network of institutions, educators, and industry leaders.
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
                            alt="CSCA Partner Mascot"
                            className="relative z-10 w-full max-w-[450px] animate-float-glow drop-shadow-[0_0_50px_rgba(188,19,254,0.3)] object-contain"
                        />
                    </motion.div>
                </div>
            </section>

            {/* --- Section 2: Partner Types --- */}
            <section className="py-24 px-6 relative z-10">
                <div className="max-w-[1300px] mx-auto">
                    <div className="flex items-center gap-4 mb-16 justify-center lg:justify-start">
                        <Scan className="text-lh-purple hidden lg:block" size={32} />
                        <h2 className="text-3xl md:text-5xl font-[1000] tracking-tighter uppercase">Partner <span className="text-lh-purple">Types</span></h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {partnerTypes.map((type, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                viewport={{ once: true }}
                                className="group relative bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-[32px] overflow-hidden p-8 hover:border-lh-purple/50 hover:bg-white/[0.05] transition-all duration-500"
                            >
                                <div className={`absolute inset-0 bg-gradient-to-br ${type.color} opacity-0 group-hover:opacity-100 transition-opacity duration-700`}></div>

                                <div className="relative z-10">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="p-4 bg-white/5 rounded-2xl text-lh-purple group-hover:bg-lh-purple/20 transition-all">
                                            {type.icon}
                                        </div>
                                        <ArrowRight size={20} className="text-gray-600 group-hover:text-lh-purple transition-all transform group-hover:-rotate-45" />
                                    </div>

                                    <h3 className="text-2xl font-black uppercase tracking-tight mb-3">{type.title}</h3>
                                    <p className="text-gray-400 text-sm font-medium leading-relaxed mb-6">{type.desc}</p>

                                    <ul className="space-y-2">
                                        {type.benefits.map((benefit, i) => (
                                            <li key={i} className="flex items-center gap-2 text-xs text-gray-500 group-hover:text-gray-300 transition-colors">
                                                <div className="w-1.5 h-1.5 rounded-full bg-lh-purple"></div>
                                                {benefit}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- Section 3: Partner Benefits --- */}
            <section className="py-24 px-6 relative z-10 bg-white/[0.01] border-y border-white/5">
                <div className="max-w-[1300px] mx-auto text-center">
                    <span className="text-lh-purple text-xs font-black uppercase tracking-[0.6em] block mb-4">Operational Perks</span>
                    <h2 className="text-3xl md:text-5xl font-[1000] tracking-tighter uppercase mb-20">Why <span className="text-lh-purple">Partner?</span></h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                        {benefits.map((benefit, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.1 }}
                                viewport={{ once: true }}
                                className="p-8 bg-white/[0.03] border border-white/10 rounded-[32px] hover:border-lh-purple/30 hover:-translate-y-2 transition-all duration-300"
                            >
                                <div className={`w-12 h-12 ${benefit.color} rounded-xl flex items-center justify-center text-white mb-6 mx-auto`}>
                                    {benefit.icon}
                                </div>
                                <h3 className="text-lg font-black uppercase tracking-tight mb-3">{benefit.title}</h3>
                                <p className="text-gray-400 text-xs font-medium uppercase tracking-wider leading-relaxed">{benefit.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- Section 4: Architecture & Tech --- */}
            <section className="py-24 px-6 relative z-10">
                <div className="max-w-[1300px] mx-auto grid lg:grid-cols-2 gap-16">
                    {/* Backend */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="space-y-8"
                    >
                        <h3 className="text-3xl md:text-4xl font-[1000] uppercase tracking-tighter flex items-center gap-3">
                            <Server className="text-lh-purple" />
                            Backend <span className="text-gray-600">Architecture</span>
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            {backendTech.map((tech, i) => (
                                <div key={i} className="flex items-center gap-3 p-4 bg-white/[0.02] border border-white/5 rounded-xl hover:bg-white/[0.05] transition-colors">
                                    <div className="w-1.5 h-6 bg-lh-purple rounded-full"></div>
                                    <span className="text-sm font-bold text-gray-300">{tech}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Microservices */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="space-y-8"
                    >
                        <h3 className="text-3xl md:text-4xl font-[1000] uppercase tracking-tighter flex items-center gap-3">
                            <Layers className="text-lh-purple" />
                            Micro<span className="text-gray-600">services</span>
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            {microservices.map((service, i) => (
                                <div key={i} className="flex items-center gap-3 p-4 bg-white/[0.02] border border-white/5 rounded-xl hover:bg-white/[0.05] transition-colors">
                                    <div className="w-1.5 h-6 bg-blue-500 rounded-full"></div>
                                    <span className="text-sm font-bold text-gray-300">{service}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* --- Section 5: Admin & Frontend --- */}
            <section className="py-24 px-6 relative z-10 bg-white/[0.01]">
                <div className="max-w-[1300px] mx-auto grid lg:grid-cols-2 gap-16">
                    {/* Admin Features */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="space-y-8"
                    >
                        <h3 className="text-3xl md:text-4xl font-[1000] uppercase tracking-tighter flex items-center gap-3">
                            <Settings className="text-lh-purple" />
                            Admin <span className="text-gray-600">Panel Features</span>
                        </h3>
                        <ul className="grid grid-cols-2 gap-x-4 gap-y-2">
                            {adminFeatures.map((feature, i) => (
                                <li key={i} className="flex items-center gap-2 text-gray-400 font-medium text-sm">
                                    <ArrowRight size={14} className="text-lh-purple" />
                                    {feature}
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Frontend Tech */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="space-y-8"
                    >
                        <h3 className="text-3xl md:text-4xl font-[1000] uppercase tracking-tighter flex items-center gap-3">
                            <Code className="text-lh-purple" />
                            Frontend <span className="text-gray-600">Tech</span>
                        </h3>
                        <div className="flex flex-wrap gap-4">
                            {frontendTech.map((tech, i) => (
                                <span key={i} className="px-6 py-3 rounded-full bg-white/5 border border-white/10 text-white font-bold text-sm hover:bg-lh-purple/20 transition-all cursor-default">
                                    {tech}
                                </span>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* --- Section 6: Final CTA --- */}
            <section className="py-24 px-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="max-w-[1300px] mx-auto rounded-[60px] p-10 md:p-20 bg-gradient-to-br from-lh-purple/20 via-black to-black border border-white/10 relative overflow-hidden text-center"
                >
                    <div className="absolute inset-0 bg-lh-purple/5 blur-[100px] animate-pulse" />
                    <div className="relative z-10 space-y-8">
                        <h2 className="text-4xl md:text-6xl lg:text-8xl font-[1000] tracking-tighter uppercase leading-[0.9]">
                            Forge an <br /> <span className="text-lh-purple">Alliance</span>
                        </h2>
                        <p className="text-gray-400 text-lg md:text-xl font-medium max-w-2xl mx-auto italic">
                            "The cybersecurity landscape changes every minute. We empower our partners to lead that change."
                        </p>
                        <button className="px-16 py-6 bg-white text-black rounded-full font-black text-sm uppercase tracking-[0.3em] hover:bg-lh-purple hover:text-white transition-all transform hover:scale-105 duration-500 shadow-[0_0_60px_rgba(255,255,255,0.2)]">
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
