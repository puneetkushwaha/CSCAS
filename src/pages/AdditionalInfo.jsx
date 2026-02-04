import React from 'react';
import { Info, HelpCircle, FileText, ArrowLeft, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const PrecisionPanel = ({ children, className = "" }) => (
    <div className={`relative bg-[#0a0a0a]/70 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] shadow-[0_30px_100px_rgba(0,0,0,0.6)] overflow-hidden group transition-all duration-700 ${className}`}>
        <div className="absolute inset-0 bg-lh-purple/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-lh-purple/30 to-transparent"></div>
        <div className="relative z-10">{children}</div>
    </div>
);

const AdditionalInfo = () => {
    const navigate = useNavigate();

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
                        <span className="text-[10px] font-black text-lh-purple uppercase tracking-[0.5em] italic">Knowledge_Node</span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter uppercase italic leading-none">
                        ADDITIONAL <span className="text-transparent font-black" style={{ WebkitTextStroke: '1px #bc13fe' }}>INFORMATION</span>
                    </h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <PrecisionPanel className="p-10">
                        <h3 className="text-[12px] font-black text-white uppercase tracking-[0.3em] mb-8 italic flex items-center gap-3">
                            <FileText size={18} className="text-lh-purple" /> Policy_Documentation
                        </h3>
                        <div className="space-y-6">
                            {[
                                'Universal Testing Policies',
                                'Candidate Agreement Protocol',
                                'Security & Integrity Directives',
                                'Intellectual Property Rights'
                            ].map((policy, i) => (
                                <button key={i} className="w-full flex items-center justify-between p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-lh-purple/30 transition-all group/p">
                                    <span className="text-[11px] font-black text-gray-400 group-hover/p:text-white uppercase tracking-widest italic">{policy}</span>
                                    <ExternalLink size={14} className="text-lh-purple opacity-30 group-hover/p:opacity-100 transition-opacity" />
                                </button>
                            ))}
                        </div>
                    </PrecisionPanel>

                    <PrecisionPanel className="p-10">
                        <h3 className="text-[12px] font-black text-white uppercase tracking-[0.3em] mb-8 italic flex items-center gap-3">
                            <HelpCircle size={18} className="text-lh-purple" /> Support_Relay
                        </h3>
                        <p className="text-[11px] text-gray-500 font-bold uppercase tracking-widest leading-relaxed mb-8 italic italic">
                            Contact our specialized synchronization nodes for technical assistance regarding registry entry and certification deployment.
                        </p>
                        <div className="p-8 bg-lh-purple/5 border border-lh-purple/10 rounded-3xl">
                            <p className="text-[9px] font-black text-lh-purple uppercase tracking-[0.4em] mb-4">Priority_Nodes:</p>
                            <p className="text-lg font-black text-white tracking-tighter uppercase italic">CSCA_COMMAND_CENTER_V1</p>
                        </div>
                    </PrecisionPanel>
                </div>
            </div>
        </div>
    );
};

export default AdditionalInfo;
