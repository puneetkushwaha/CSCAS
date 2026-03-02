import React, { useState } from 'react';
import {
    HelpCircle, Mail, Phone, MessageSquare, Shield,
    ArrowLeft, ChevronDown, ChevronUp, ExternalLink,
    LifeBuoy, Book, CreditCard, Monitor, History
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const PrecisionPanel = ({ children, className = "" }) => (
    <div className={`relative bg-[#0a0a0a]/70 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] shadow-[0_30px_100px_rgba(0,0,0,0.6)] overflow-hidden group transition-all duration-700 ${className}`}>
        <div className="absolute inset-0 bg-lh-purple/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-lh-purple/30 to-transparent"></div>
        <div className="relative z-10">{children}</div>
    </div>
);

const SupportHub = () => {
    const navigate = useNavigate();
    const [activeFaq, setActiveFaq] = useState(null);

    const supportCategories = [
        {
            title: "Technical Assistance",
            desc: "Platform access, exam player issues, and synchronization errors.",
            icon: <Monitor size={24} className="text-lh-purple" />,
            color: "purple"
        },
        {
            title: "Examination Support",
            desc: "Vouchers, rescheduling, and proctoring protocols.",
            icon: <Shield size={24} className="text-blue-500" />,
            color: "blue"
        },
        {
            title: "Billing & Registry",
            desc: "Payment inquiries, refunds, and certificate verification.",
            icon: <CreditCard size={24} className="text-emerald-500" />,
            color: "emerald"
        }
    ];

    const faqs = [
        {
            q: "How do I reschedule my exam?",
            a: "You can reschedule your exam up to 24 hours before the scheduled time via the Exam Central dashboard. If within 24 hours, contact priority support."
        },
        {
            q: "What are the system requirements for testing?",
            a: "A stable internet connection (min 5Mbps), a working webcam/microphone, and a private, well-lit environment are mandatory for all proctored sessions."
        },
        {
            q: "When will I receive my digital certificate?",
            a: "Upon successful completion and passing of the exam, your digital certificate is generated instantly and can be downloaded from the Score Reports section."
        },
        {
            q: "My payment was successful but my course is not visible.",
            a: "Registry synchronization can take up to 15 minutes. If your course is still not visible after this period, please initiate a manual registry sync or contact support."
        }
    ];

    return (
        <div className="space-y-12 pb-16 relative">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-lh-purple/5 blur-[180px] rounded-full pointer-events-none"></div>

            <div className="max-w-[1400px] mx-auto w-full pt-4 relative z-10">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-3 text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] hover:text-white transition-colors mb-10 group"
                >
                    <ArrowLeft size={14} className="group-hover:-translate-x-2 transition-transform" />
                    Back_To_Dashboard
                </button>

                <div className="mb-12">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-1 bg-lh-purple rounded-full"></div>
                        <span className="text-[10px] font-black text-lh-purple uppercase tracking-[0.5em]">Command_Support_Interface</span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter uppercase leading-none">
                        SUPPORT <span className="text-transparent font-black" style={{ WebkitTextStroke: '1px #bc13fe' }}>HUB</span>
                    </h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* Main Content */}
                    <div className="lg:col-span-8 space-y-10">
                        {/* Categories */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {supportCategories.map((cat, i) => (
                                <PrecisionPanel key={i} className="p-8 hover:scale-[1.02] transition-transform cursor-pointer">
                                    <div className="mb-6">{cat.icon}</div>
                                    <h4 className="text-[12px] font-black text-white uppercase tracking-widest mb-3">{cat.title}</h4>
                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-relaxed opacity-70">
                                        {cat.desc}
                                    </p>
                                </PrecisionPanel>
                            ))}
                        </div>

                        {/* FAQs */}
                        <PrecisionPanel className="p-10">
                            <h3 className="text-[14px] font-black text-white uppercase tracking-[0.3em] mb-10 flex items-center gap-4">
                                <Book size={20} className="text-lh-purple" /> Knowledge_Base_FAQ
                            </h3>
                            <div className="space-y-4">
                                {faqs.map((faq, i) => (
                                    <div
                                        key={i}
                                        className="border border-white/5 rounded-2xl overflow-hidden bg-white/[0.01]"
                                    >
                                        <button
                                            onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                                            className="w-full flex items-center justify-between p-6 text-left hover:bg-white/[0.02] transition-colors"
                                        >
                                            <span className="text-[11px] font-black text-gray-300 uppercase tracking-widest">{faq.q}</span>
                                            {activeFaq === i ? <ChevronUp size={16} className="text-lh-purple" /> : <ChevronDown size={16} className="text-gray-500" />}
                                        </button>
                                        <AnimatePresence>
                                            {activeFaq === i && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: "auto", opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    className="px-6 pb-6"
                                                >
                                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-relaxed pt-2 border-t border-white/5">
                                                        {faq.a}
                                                    </p>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                ))}
                            </div>
                        </PrecisionPanel>
                    </div>

                    {/* Sidebar Support Info */}
                    <div className="lg:col-span-4 space-y-8">
                        <PrecisionPanel className="p-10 bg-lh-purple/5 border-lh-purple/10">
                            <div className="flex items-center gap-4 mb-10">
                                <div className="w-12 h-12 rounded-2xl bg-lh-purple flex items-center justify-center shadow-lg">
                                    <LifeBuoy size={24} className="text-white" />
                                </div>
                                <div>
                                    <p className="text-[9px] font-black text-lh-purple uppercase tracking-widest mb-1">Status_Relay:</p>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.6)]" />
                                        <h4 className="text-[12px] font-black text-white uppercase tracking-widest">Support_Live</h4>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-8">
                                <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
                                    <p className="text-[8px] font-black text-gray-500 uppercase tracking-[0.3em] mb-4">Contact_Direct:</p>
                                    <div className="flex items-center gap-4 mb-4">
                                        <Phone size={16} className="text-lh-purple" />
                                        <span className="text-[13px] font-black text-white font-mono">+91 90267 64985</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <Mail size={16} className="text-lh-purple" />
                                        <span className="text-[13px] font-black text-white font-mono">info@csca.edu.in</span>
                                    </div>
                                </div>

                                <button className="w-full py-4 bg-lh-purple text-white text-[10px] font-black uppercase tracking-[0.4em] rounded-xl hover:bg-white hover:text-black transition-all shadow-2xl flex items-center justify-center gap-3">
                                    <MessageSquare size={16} />
                                    Launch_Mission_Chat
                                </button>

                                <p className="text-[9px] text-gray-600 font-bold uppercase tracking-widest leading-relaxed text-center opacity-60">
                                    Average response latency: <br /><span className="text-lh-purple">12_MIN_OPS</span>
                                </p>
                            </div>
                        </PrecisionPanel>

                        <PrecisionPanel className="p-10 border-white/5">
                            <h4 className="text-[10px] font-black text-white uppercase tracking-widest mb-6">Self_Service_Interface</h4>
                            <div className="space-y-4">
                                {[
                                    { label: 'Candidate Handbook', path: '/dashboard/additional-info' },
                                    { label: 'Refund Protocol', path: '/dashboard/additional-info' },
                                    { label: 'Mission History', path: '/dashboard/exam-history' }
                                ].map((link, i) => (
                                    <button
                                        key={i}
                                        onClick={() => navigate(link.path)}
                                        className="w-full flex items-center justify-between p-4 bg-white/[0.01] border border-white/5 rounded-xl hover:border-lh-purple/30 transition-all group"
                                    >
                                        <span className="text-[9px] font-black text-gray-500 group-hover:text-white uppercase tracking-widest">{link.label}</span>
                                        <ExternalLink size={12} className="text-lh-purple opacity-30 group-hover:opacity-100" />
                                    </button>
                                ))}
                            </div>
                        </PrecisionPanel>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SupportHub;
