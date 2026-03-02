import React from 'react';
import { Info, HelpCircle, FileText, ArrowLeft, ExternalLink, X, Shield, Lock, Gavel } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const PrecisionPanel = ({ children, className = "" }) => (
    <div className={`relative bg-[#0a0a0a]/70 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] shadow-[0_30px_100px_rgba(0,0,0,0.6)] overflow-hidden group transition-all duration-700 ${className}`}>
        <div className="absolute inset-0 bg-lh-purple/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-lh-purple/30 to-transparent"></div>
        <div className="relative z-10">{children}</div>
    </div>
);

const AdditionalInfo = () => {
    const navigate = useNavigate();
    const [activePolicy, setActivePolicy] = React.useState(null);

    const policies = {
        'Universal Testing Policies': {
            icon: <FileText className="text-lh-purple" />,
            content: [
                "Candidates must provide valid government-issued identification.",
                "Testing environments must be private, well-lit, and free of unauthorized materials.",
                "No third-party presence is permitted during the examination session.",
                "All sessions are subject to active monitoring and recording for integrity purposes."
            ]
        },
        'Candidate Agreement Protocol': {
            icon: <Shield className="text-lh-purple" />,
            content: [
                "Agreement to CSCA's data processing and privacy standards.",
                "Acknowledgment of the non-disclosure agreement (NDA) for all exam items.",
                "Consent to identity verification via biometric or visual telemetry.",
                "Acceptance of terms regarding certification validity and renewal."
            ]
        },
        'Security & Integrity Directives': {
            icon: <Lock className="text-lh-purple" />,
            content: [
                "Zero-tolerance policy for unauthorized hardware or software.",
                "Immediate termination for any attempt to copy or distribute exam content.",
                "Mandatory workspace scan prior to initiating the testing sequence.",
                "Continuous AI-assisted behavioral analysis during the examination."
            ]
        },
        'Intellectual Property Rights': {
            icon: <Gavel className="text-lh-purple" />,
            content: [
                "All assessment materials are the exclusive property of CSCA.",
                "Unauthorized use of CSCA branding or logos is strictly prohibited.",
                "Certification does not grant rights to redistribute CSCA training frameworks.",
                "Protective measures are enforced under global intellectual property laws."
            ]
        }
    };

    return (
        <div className="space-y-12 pb-16 relative">
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-lh-purple/5 blur-[150px] rounded-full pointer-events-none"></div>

            <div className="max-w-[1400px] mx-auto w-full pt-4 relative z-10">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-3 text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] hover:text-lh-purple transition-colors mb-10 group"
                >
                    <ArrowLeft size={14} className="group-hover:-translate-x-2 transition-transform" />
                    Back_To_Dashboard
                </button>

                <div className="mb-12">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-1 bg-lh-purple rounded-full"></div>
                        <span className="text-[10px] font-black text-lh-purple uppercase tracking-[0.5em]">Knowledge_Node</span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter uppercase leading-none">
                        ADDITIONAL <span className="text-transparent font-black" style={{ WebkitTextStroke: '1px #bc13fe' }}>INFORMATION</span>
                    </h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <PrecisionPanel className="p-10">
                        <h3 className="text-[12px] font-black text-white uppercase tracking-[0.3em] mb-8 flex items-center gap-3">
                            <FileText size={18} className="text-lh-purple" /> Policy_Documentation
                        </h3>
                        <div className="space-y-6">
                            {Object.keys(policies).map((policy, i) => (
                                <button
                                    key={i}
                                    onClick={() => setActivePolicy(policy)}
                                    className="w-full flex items-center justify-between p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-lh-purple/30 transition-all group/p"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="opacity-40 group-hover/p:opacity-100 transition-opacity">
                                            {policies[policy].icon}
                                        </div>
                                        <span className="text-[11px] font-black text-gray-400 group-hover/p:text-white uppercase tracking-widest text-left">{policy}</span>
                                    </div>
                                    <ExternalLink size={14} className="text-lh-purple opacity-30 group-hover/p:opacity-100 transition-opacity" />
                                </button>
                            ))}
                        </div>
                    </PrecisionPanel>

                    <PrecisionPanel className="p-10">
                        <h3 className="text-[12px] font-black text-white uppercase tracking-[0.3em] mb-8 flex items-center gap-3">
                            <HelpCircle size={18} className="text-lh-purple" /> Support_Relay
                        </h3>
                        <p className="text-[11px] text-gray-500 font-bold uppercase tracking-widest leading-relaxed mb-8">
                            Contact our specialized synchronization nodes for technical assistance regarding registry entry and certification deployment.
                        </p>
                        <div className="p-8 bg-lh-purple/5 border border-lh-purple/10 rounded-3xl">
                            <p className="text-[9px] font-black text-lh-purple uppercase tracking-[0.4em] mb-4">Priority_Nodes:</p>
                            <p className="text-lg font-black text-white tracking-tighter uppercase">CSCA_COMMAND_CENTER_V1</p>
                        </div>
                    </PrecisionPanel>
                </div>
            </div>

            {/* Policy Modal */}
            <AnimatePresence>
                {activePolicy && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setActivePolicy(null)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="relative w-full max-w-lg bg-[#0f0f0f] border border-white/10 rounded-[32px] p-8 md:p-10 shadow-2xl"
                        >
                            <button
                                onClick={() => setActivePolicy(null)}
                                className="absolute top-6 right-6 p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors"
                            >
                                <X size={18} />
                            </button>

                            <div className="flex items-center gap-4 mb-8">
                                <div className="p-3 bg-lh-purple/10 rounded-2xl">
                                    {policies[activePolicy].icon}
                                </div>
                                <div>
                                    <p className="text-[9px] font-black text-lh-purple uppercase tracking-[0.4em] mb-1">Protocol_Entry:</p>
                                    <h3 className="text-xl font-black text-white uppercase tracking-tight">{activePolicy}</h3>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {policies[activePolicy].content.map((point, i) => (
                                    <div key={i} className="flex gap-4 p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-lh-purple shadow-[0_0_10px_rgba(188,19,254,0.6)] shrink-0" />
                                        <p className="text-[11px] font-bold text-gray-400 leading-relaxed uppercase tracking-wide">{point}</p>
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={() => setActivePolicy(null)}
                                className="w-full mt-10 py-4 bg-lh-purple text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-xl hover:bg-white hover:text-black transition-all shadow-[0_10px_30px_rgba(188,19,254,0.2)]"
                            >
                                Acknowledge_Directive
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdditionalInfo;
