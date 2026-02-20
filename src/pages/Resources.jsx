import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FileText,
    Book,
    Download,
    Search,
    Newspaper,
    Layout,
    Database,
    Shield,
    Glasses,
    ExternalLink,
    Terminal,
    ArrowRight,
    X,
    CheckCircle2,
    Lock,
    Cpu,
    Zap
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ngdPic from '../assets/images/ngd-pic.png';

const ResourceModal = ({ isOpen, onClose, data }) => {
    if (!isOpen || !data) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-black/90 backdrop-blur-xl"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="w-full max-w-4xl max-h-[90vh] bg-[#0a0a0a] border border-lh-purple/30 rounded-[40px] overflow-hidden relative flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                {/* Header Section */}
                <div className="p-8 md:p-12 pb-6 border-b border-white/5 relative">
                    <button
                        onClick={onClose}
                        className="absolute top-8 right-8 p-3 bg-white/5 hover:bg-white/10 rounded-full transition-all text-gray-400 hover:text-white"
                    >
                        <X size={20} />
                    </button>

                    <div className="flex items-center gap-6 mb-6">
                        <div className="p-5 bg-lh-purple/10 rounded-3xl border border-lh-purple/20 text-lh-purple">
                            {data.icon}
                        </div>
                        <div>
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-lh-purple mb-2 block">{data.tag} Content</span>
                            <h2 className="text-3xl md:text-4xl font-[900] uppercase tracking-tighter text-white">{data.title}</h2>
                        </div>
                    </div>
                    <p className="text-gray-400 text-lg leading-relaxed max-w-2xl">{data.desc}</p>
                </div>

                {/* Content Section */}
                <div className="flex-1 overflow-y-auto p-8 md:p-12 space-y-10 custom-scrollbar">
                    {data.details && (
                        <div className="grid md:grid-cols-2 gap-8">
                            {data.details.map((section, idx) => (
                                <div key={idx} className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-lh-purple/20 transition-all group">
                                    <h4 className="text-lh-purple font-black text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-lh-purple"></div>
                                        {section.title}
                                    </h4>
                                    <ul className="space-y-3">
                                        {section.items.map((item, i) => (
                                            <li key={i} className="flex items-start gap-3 text-sm text-gray-400 group-hover:text-gray-300">
                                                <CheckCircle2 size={14} className="mt-0.5 text-lh-purple/50" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    )}

                    {data.outcome && (
                        <div className="p-8 rounded-[32px] bg-gradient-to-br from-lh-purple/10 to-transparent border border-lh-purple/20">
                            <h4 className="text-white font-black text-xs uppercase tracking-widest mb-3 flex items-center gap-2">
                                <Zap size={14} className="text-lh-purple" />
                                Expected Outcome
                            </h4>
                            <p className="text-gray-300 text-sm leading-relaxed italic">
                                "{data.outcome}"
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="p-8 md:p-10 border-t border-white/5 bg-white/[0.01] flex flex-wrap items-center justify-between gap-6">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500/80">Premium Resource Access Granted</span>
                    </div>
                    <button
                        onClick={() => window.open('#', '_blank')}
                        className="py-4 px-10 bg-lh-purple text-white rounded-full font-black text-xs uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all flex items-center gap-2 shadow-[0_10px_30px_rgba(188,19,254,0.2)]"
                    >
                        Access Now <ExternalLink size={14} />
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
};

const Resources = () => {
    const [selectedResource, setSelectedResource] = useState(null);

    const resourceItems = [
        {
            title: "Expert Blogs",
            desc: "Advanced, research-backed cybersecurity insights written by industry practitioners including Red Teamers and AI Researchers.",
            icon: <Layout size={32} />,
            size: "col-span-1 md:col-span-2 row-span-1",
            color: "from-purple-500/10 to-transparent",
            tag: "Insight",
            outcome: "Readers gain elite-level knowledge on how modern cyber attacks work and how to prepare for upcoming threat patterns.",
            details: [
                {
                    title: "Core Topics",
                    items: [
                        "Zero-day exploit analysis & PoC walk-throughs",
                        "Advanced Red Team tactics & methodologies",
                        "OSINT strategies for target profiling",
                        "Deep web application exploitation case studies"
                    ]
                },
                {
                    title: "Defense & Ops",
                    items: [
                        "SOC operational improvement techniques",
                        "Threat intelligence investigation methods",
                        "AI-powered cyber attacks & threat vectors",
                        "Cloud security breaches & IAM exploitation"
                    ]
                }
            ]
        },
        {
            title: "Whitepapers",
            desc: "Technical documents covering enterprise-level cybersecurity architecture, red teaming, and detection engineering.",
            icon: <FileText size={32} />,
            size: "col-span-1 row-span-1",
            color: "from-blue-500/10 to-transparent",
            tag: "Research",
            outcome: "Readers understand cybersecurity from the perspective of global enterprise defense and advanced offensive teams.",
            details: [
                {
                    title: "AI & Zero Trust",
                    items: [
                        "LLM security challenges & data poisoning",
                        "AI-powered threat detection models",
                        "Identity-centric security & Zero Trust",
                        "Micro-segmentation & continuous auth"
                    ]
                },
                {
                    title: "Red Team & SOC",
                    items: [
                        "Adversary emulation (APT attack chains)",
                        "MITRE ATT&CK threat mapping",
                        "SIEM correlation & SOAR automation",
                        "Incident response & detection maturity"
                    ]
                }
            ]
        },
        {
            title: "Certification Handbook",
            desc: "The complete official guide to all CSCA certifications, job roles, skills, and the career progression path.",
            icon: <Book size={32} />,
            size: "col-span-1 row-span-2",
            color: "from-emerald-500/10 to-transparent",
            tag: "Official",
            outcome: "Navigate your career progression with clear domain targets, prerequisites, and learning objectives.",
            details: [
                {
                    title: "Official Overview",
                    items: [
                        "Certification objectives & target roles",
                        "Required skills & exam structure",
                        "Domains, sub-domains & difficulty",
                        "Career progression path mapping"
                    ]
                },
                {
                    title: "Red Team Handbook",
                    items: [
                        "Reconnaissance & OSINT",
                        "Web & Mobile exploitation",
                        "Active Directory attack chains",
                        "OPSEC, evasion & reporting"
                    ]
                }
            ]
        },
        {
            title: "Exam Blueprints",
            desc: "Detailed breakdowns of certification domains, weightages, tools expected, and scenario-based difficulty.",
            icon: <Terminal size={32} />,
            size: "col-span-1 md:col-span-2 row-span-1",
            color: "from-red-500/10 to-transparent",
            tag: "Exams",
            outcome: "Prepare effectively with precise weightage knowledge and practical task requirements for real-world scenarios.",
            details: [
                {
                    title: "CVS-APT Blueprint",
                    items: [
                        "Network & AD Exploitation (50%)",
                        "Web Exploitation (20%)",
                        "Reconnaissance (10%)",
                        "Post-Exploitation & Evasion (20%)"
                    ]
                },
                {
                    title: "Practical Requirements",
                    items: [
                        "20 real-world attack challenges",
                        "Multi-machine network pivoting",
                        "Privilege escalation tasks",
                        "Exploit execution validation"
                    ]
                }
            ]
        },
        {
            title: "Download Syllabi",
            desc: "Complete module-by-module curriculum breakdowns including lab exercises, tools, and real-world projects.",
            icon: <Download size={32} />,
            size: "col-span-1 row-span-1",
            color: "from-cyan-500/10 to-transparent",
            tag: "Curriculum",
            outcome: "Get full transparency on the tools, platforms, and case studies covered in every CSCA training program.",
            details: [
                {
                    title: "Syllabus Breakdown",
                    items: [
                        "Total modules & subtopics",
                        "Lab exercises & hands-on tasks",
                        "Tools, case studies & projects",
                        "Real-world simulation tasks"
                    ]
                },
                {
                    title: "CVS-WAPT Syllabus",
                    items: [
                        "API & GraphQL exploitation",
                        "OWASP Top 10 deep-dive",
                        "Server-side (SSRF, XXE, RCE)",
                        "Business Logic Bypass labs"
                    ]
                }
            ]
        },
        {
            title: "Case Studies",
            desc: "Real-world cyber attack investigations and successful enterprise security implementation reports.",
            icon: <Database size={32} />,
            size: "col-span-1 md:col-span-1 row-span-1",
            color: "from-orange-500/10 to-transparent",
            tag: "Success",
            outcome: "Learners understand how real attacks manifest and how leading enterprises respond to them.",
            details: [
                {
                    title: "Real-World Scenarios",
                    items: [
                        "E-commerce SQLi → Database exfiltration",
                        "Cloud misconfig → Privilege escalation",
                        "Active Directory breach → Persistence",
                        "Mobile token leakage → API exploit"
                    ]
                },
                {
                    title: "Security Response",
                    items: [
                        "Incident response workflows",
                        "Forensic reconstruction tasks",
                        "Enterprise remediation steps",
                        "Hardening after-action reports"
                    ]
                }
            ]
        },
        {
            title: "Security Research",
            desc: "Technically deep analysis of malware internals, exploit development, and niche cloud vulnerabilities.",
            icon: <Search size={32} />,
            size: "col-span-1 md:col-span-2 row-span-1",
            color: "from-indigo-500/10 to-transparent",
            tag: "Labs",
            outcome: "Gain research-level knowledge equivalent to senior analysts in malware, exploits, and kernel security.",
            details: [
                {
                    title: "Malware & Exploits",
                    items: [
                        "Ransomware internals & C2 behavior",
                        "Stealth persistence & loaders",
                        "Heap & format string attacks",
                        "Win/Linux kernel exploitation"
                    ]
                },
                {
                    title: "AI & Cloud Research",
                    items: [
                        "LLM prompt injection vectors",
                        "Model inversion & extraction",
                        "IAM privilege escalation chains",
                        "Metadata & bucket exploitation"
                    ]
                }
            ]
        },
        {
            title: "Cyber Glossary",
            desc: "A deep database of 500+ terms covering offensive, defensive, GRC, AI security, and MITRE tactics.",
            icon: <Glasses size={32} />,
            size: "col-span-1 row-span-1",
            color: "from-pink-500/10 to-transparent",
            tag: "Database",
            outcome: "Master the technical vocabulary of professional cybersecurity across all elite domains.",
            details: [
                {
                    title: "Domain Vocabulary",
                    items: [
                        "Offensive security terminology",
                        "SOC & DFIR operational language",
                        "Cloud & DevSecOps vocabulary",
                        "ISO Governance & Compliance"
                    ]
                },
                {
                    title: "Featured Terms",
                    items: [
                        "SSRF Chaining & Kerberoasting",
                        "Zero Trust Access Control",
                        "Pod Breakout (K8s) internals",
                        "SOC Escalation Matrices"
                    ]
                }
            ]
        },
        {
            title: "News & Updates",
            desc: "Stay informed about latest CSCA certifications, global breaches, APT activities, and community events.",
            icon: <Newspaper size={32} />,
            size: "col-span-1 md:col-span-4 row-span-1",
            color: "from-lh-purple/10 to-transparent",
            tag: "Network",
            outcome: "Learners stay synchronized with the rapidly evolving global cybersecurity landscape.",
            details: [
                {
                    title: "Global Intelligence",
                    items: [
                        "Major breach & APT disclosures",
                        "Zero-day & CVE monitoring",
                        "Ransomware campaign trends",
                        "Cloud incident case-files"
                    ]
                },
                {
                    title: "CSCA Community",
                    items: [
                        "New certification releases",
                        "Webinars & Masterclasses",
                        "Red Team / SOC competitions",
                        "Research paper announcements"
                    ]
                }
            ]
        }
    ];

    return (
        <div className="bg-[#050505] min-h-screen text-white font-plus-jakarta overflow-x-hidden selection:bg-lh-purple selection:text-white">
            <Navbar />

            {/* --- Hero Section --- */}
            <section className="relative pt-40 pb-20 px-6 overflow-hidden">
                <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-lh-purple/10 blur-[180px] rounded-full"></div>
                <div className="absolute bottom-[20%] right-[-10%] w-[500px] h-[500px] bg-blue-500/5 blur-[150px] rounded-full"></div>

                <div className="max-w-[1300px] mx-auto grid lg:grid-cols-2 gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="space-y-8 relative z-10 text-left"
                    >
                        <div className="flex items-center gap-3 text-lh-purple">
                            <Shield size={20} className="animate-pulse" />
                            <span className="uppercase tracking-[0.4em] text-[11px] font-black">Knowledge Hub</span>
                        </div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-5xl md:text-8xl font-[1000] tracking-tighter uppercase leading-none"
                        >
                            CSCA <br />
                            <span className="text-lh-purple">Resources</span>
                        </motion.h1>

                        <p className="text-gray-400 text-lg font-medium max-w-xl leading-relaxed">
                            Access our complete library of technical documentation, handbooks, whitepapers, research, and industry-level cybersecurity content.
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

            {/* --- Resources Grid --- */}
            <section className="py-24 px-6 relative z-10">
                <div className="max-w-[1300px] mx-auto">
                    {/* Mobile: Simple single column layout */}
                    <div className="grid md:hidden grid-cols-1 gap-6">
                        {resourceItems.map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.05 }}
                                viewport={{ once: true }}
                                onClick={() => setSelectedResource(item)}
                            >
                                <div
                                    className={`group relative w-full bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-[32px] overflow-hidden flex flex-col p-10 transition-all duration-500 hover:border-lh-purple/50 hover:bg-white/[0.05] hover:shadow-[0_20px_60px_rgba(188,19,254,0.1)] cursor-pointer`}
                                >
                                    <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-100 transition-opacity duration-700`}></div>

                                    <div className="relative z-10 flex flex-col justify-between">
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="p-4 bg-white/5 rounded-2xl text-white group-hover:text-lh-purple group-hover:bg-lh-purple/10 transition-all duration-500">
                                                {item.icon}
                                            </div>
                                            <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-white/5 rounded-full text-white/40 group-hover:text-lh-purple group-hover:bg-lh-purple/10 transition-all">
                                                {item.tag}
                                            </span>
                                        </div>

                                        <div className="space-y-4">
                                            <h3 className="text-2xl font-black uppercase tracking-tight leading-tight text-white group-hover:text-lh-purple transition-colors">
                                                {item.title}
                                            </h3>
                                            <p className="text-gray-400 text-base leading-relaxed font-medium group-hover:text-gray-300 transition-colors">
                                                {item.desc}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-[0.03] pointer-events-none transition-opacity duration-700 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]"></div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Desktop: Bento grid layout */}
                    <div className="hidden md:grid grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-[280px]">
                        {resourceItems.map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.05 }}
                                viewport={{ once: true }}
                                className={`${item.size}`}
                                onClick={() => setSelectedResource(item)}
                            >
                                <div
                                    className={`group relative h-full w-full bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-[32px] overflow-hidden flex flex-col p-8 transition-all duration-500 hover:border-lh-purple/50 hover:bg-white/[0.05] hover:shadow-[0_20px_60px_rgba(188,19,254,0.1)] cursor-pointer`}
                                >
                                    <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-100 transition-opacity duration-700`}></div>

                                    <div className="relative z-10 flex flex-col h-full">
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="p-4 bg-white/5 rounded-2xl text-white group-hover:text-lh-purple group-hover:bg-lh-purple/10 transition-all duration-500">
                                                {item.icon}
                                            </div>
                                            <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-white/5 rounded-full text-white/40 group-hover:text-lh-purple group-hover:bg-lh-purple/10 transition-all">
                                                {item.tag}
                                            </span>
                                        </div>

                                        <div className="space-y-3 flex-grow">
                                            <h3 className="text-xl font-black uppercase tracking-tight leading-tight group-hover:text-white transition-colors">
                                                {item.title}
                                            </h3>
                                            <p className="text-gray-400 text-sm leading-relaxed font-medium line-clamp-3 group-hover:text-gray-300 transition-colors">
                                                {item.desc}
                                            </p>
                                        </div>

                                        <div className="flex items-center justify-between pt-6 border-t border-white/5 mt-auto">
                                            <div className="flex items-center gap-2">
                                                <span className="w-1.5 h-1.5 rounded-full bg-lh-purple animate-pulse"></span>
                                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Technical Deep-Dive Available</span>
                                            </div>
                                            <ArrowRight size={18} className="text-lh-purple opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-500" />
                                        </div>
                                    </div>
                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-[0.03] pointer-events-none transition-opacity duration-700 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]"></div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <AnimatePresence>
                {selectedResource && (
                    <ResourceModal
                        isOpen={!!selectedResource}
                        onClose={() => setSelectedResource(null)}
                        data={selectedResource}
                    />
                )}
            </AnimatePresence>

            <Footer />
        </div>
    );
};

export default Resources;
