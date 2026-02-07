import React from 'react';
import { FileText, Download, TrendingUp, ArrowLeft, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const PrecisionPanel = ({ children, className = "" }) => (
    <div className={`relative bg-[#0a0a0a]/70 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] shadow-[0_30px_100px_rgba(0,0,0,0.6)] overflow-hidden group transition-all duration-700 ${className}`}>
        <div className="absolute inset-0 bg-lh-purple/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-lh-purple/30 to-transparent"></div>
        <div className="relative z-10">{children}</div>
    </div>
);

const ScoreReports = () => {
    const navigate = useNavigate();

    return (
        <div className="space-y-12 pb-16 relative">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-lh-purple/5 blur-[150px] rounded-full pointer-events-none"></div>

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
                        <span className="text-[10px] font-black text-lh-purple uppercase tracking-[0.5em]">Analytical_Relay</span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter uppercase leading-none">
                        VIEW SCORE <span className="text-transparent font-black" style={{ WebkitTextStroke: '1px #bc13fe' }}>REPORTS</span>
                    </h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    {[
                        { label: 'Total Assessments', value: '08', icon: <FileText /> },
                        { label: 'Global Percentile', value: '94.2%', icon: <Award /> },
                        { label: 'Advancement Rate', value: '+12%', icon: <TrendingUp /> }
                    ].map((stat, i) => (
                        <PrecisionPanel key={i} className="p-8">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-3 bg-lh-purple/10 rounded-2xl text-lh-purple">
                                    {stat.icon}
                                </div>
                                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{stat.label}</span>
                            </div>
                            <p className="text-4xl font-black text-white tracking-tighter">{stat.value}</p>
                        </PrecisionPanel>
                    ))}
                </div>

                <PrecisionPanel className="p-10">
                    <h3 className="text-[12px] font-black text-white uppercase tracking-[0.3em] mb-10 flex items-center gap-3">
                        <Download size={18} className="text-lh-purple" /> Downloadable_Intelligence
                    </h3>

                    <div className="space-y-4">
                        {[
                            { title: 'Full Performance Analysis - CSCA+', date: 'FEB_2025' },
                            { title: 'Sector Knowledge Breakdown - NetGuardian', date: 'DEC_2024' },
                            { title: 'Diagnostic Feedback Relay - CloudDef', date: 'SEP_2024' }
                        ].map((report, i) => (
                            <div key={i} className="flex items-center justify-between p-6 bg-white/[0.02] border border-white/5 rounded-3xl hover:border-lh-purple/20 transition-all group/r">
                                <div>
                                    <h4 className="text-[13px] font-black text-white uppercase tracking-wider">{report.title}</h4>
                                    <p className="text-[9px] text-lh-purple font-mono uppercase tracking-widest mt-1">{report.date}</p>
                                </div>
                                <button className="p-4 bg-white/5 rounded-2xl text-lh-purple hover:bg-lh-purple hover:text-white transition-all shadow-lg animate-pulse hover:animate-none">
                                    <Download size={20} />
                                </button>
                            </div>
                        ))}
                    </div>
                </PrecisionPanel>
            </div>
        </div>
    );
};

export default ScoreReports;
