import React from 'react';
import { motion } from 'framer-motion';
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
    ArrowRight
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ngdPic from '../assets/images/ngd-pic.png';

const Resources = () => {
    const resourceItems = [
        {
            title: "Expert Blogs",
            desc: "Deep dives into the latest cyber threats, industry trends, and technical tutorials from CSCA experts.",
            icon: <Layout size={32} />,
            size: "col-span-1 md:col-span-2 row-span-1",
            color: "from-purple-500/10 to-transparent",
            tag: "Articles"
        },
        {
            title: "Whitepapers",
            desc: "Technical research papers on emerging security technologies and methodology frameworks.",
            icon: <FileText size={32} />,
            size: "col-span-1 row-span-1",
            color: "from-blue-500/10 to-transparent",
            tag: "Research"
        },
        {
            title: "Certification Handbook",
            desc: "Official guide to CSCA roadmap, candidate requirements, and certification lifecycle.",
            icon: <Book size={32} />,
            size: "col-span-1 row-span-2",
            color: "from-emerald-500/10 to-transparent",
            tag: "Official"
        },
        {
            title: "Exam Blueprints",
            desc: "Detailed domain weightage and competency requirements for all CSCA examinations.",
            icon: <Terminal size={32} />,
            size: "col-span-1 md:col-span-2 row-span-1",
            color: "from-red-500/10 to-transparent",
            tag: "Exams"
        },
        {
            title: "Download Syllabi",
            desc: "Get full curriculum details for our training programs in downloadable PDF format.",
            icon: <Download size={32} />,
            size: "col-span-1 row-span-1",
            color: "from-cyan-500/10 to-transparent",
            tag: "Downloads"
        },
        {
            title: "Case Studies",
            desc: "Real-world success stories of organizations leveraging CSCA certifications for workforce development.",
            icon: <Database size={32} />,
            size: "col-span-1 md:col-span-1 row-span-1",
            color: "from-orange-500/10 to-transparent",
            tag: "Enterprise"
        },
        {
            title: "Security Research",
            desc: "Insights from our global threat intelligence labs and vulnerability research teams.",
            icon: <Search size={32} />,
            size: "col-span-1 md:col-span-2 row-span-1",
            color: "from-indigo-500/10 to-transparent",
            tag: "Intelligence"
        },
        {
            title: "Cyber Glossary",
            desc: "Comprehensive database of cybersecurity terminology and industry standard definitions.",
            icon: <Glasses size={32} />,
            size: "col-span-1 row-span-1",
            color: "from-pink-500/10 to-transparent",
            tag: "Learning"
        },
        {
            title: "News & Updates",
            desc: "Stay informed about latest CSCA announcements, community events, and industry news.",
            icon: <Newspaper size={32} />,
            size: "col-span-1 md:col-span-4 row-span-1",
            color: "from-lh-purple/10 to-transparent",
            tag: "Announcements"
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
                            <span className="text-lh-purple italic">Resources</span>
                        </motion.h1>

                        <p className="text-gray-400 text-lg font-medium max-w-xl leading-relaxed">
                            Access our comprehensive library of technical documentation, handbooks, and industry research.
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
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-[280px]">
                        {resourceItems.map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.05 }}
                                viewport={{ once: true }}
                                className={`${item.size}`}
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
                                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Available For Download</span>
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

            <Footer />
        </div>
    );
};

export default Resources;
