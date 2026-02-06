import React from 'react';
import { History, CheckCircle, Search, ArrowLeft, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const PrecisionPanel = ({ children, className = "" }) => (
    <div className={`relative bg-[#0a0a0a]/70 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] shadow-[0_30px_100px_rgba(0,0,0,0.6)] overflow-hidden group transition-all duration-700 ${className}`}>
        <div className="absolute inset-0 bg-lh-purple/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-lh-purple/30 to-transparent"></div>
        <div className="relative z-10">{children}</div>
    </div>
);

const ExamHistory = () => {
    const navigate = useNavigate();
    const [history, setHistory] = React.useState([]);

    React.useEffect(() => {
        const savedHistory = JSON.parse(localStorage.getItem('examHistory') || '[]');
        if (savedHistory.length > 0) {
            setHistory(savedHistory);
        } else {
            // Default static history for visual guidance
            setHistory([
                { exam: 'Cybersecurity Architect (CSCA+)', date: '2025_02_15', status: 'Completed', score: 'PASS' },
                { exam: 'Network Guardian Protocol', date: '2024_11_10', status: 'Completed', score: 'PASS' },
                { exam: 'Cloud Defense Systems', date: '2024_08_22', status: 'Archive_Verified', score: 'N/A' }
            ]);
        }
    }, []);

    return (
        <div className="space-y-12 pb-16 relative">
            <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-lh-purple/5 blur-[150px] rounded-full pointer-events-none"></div>

            <div className="max-w-[1400px] mx-auto w-full pt-4 relative z-10">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-3 text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] hover:text-lh-purple transition-colors mb-10 group"
                >
                    <ArrowLeft size={14} className="group-hover:-translate-x-2 transition-transform" />
                    Back_To_Dashboard
                </button>

                <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div>
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-1 bg-lh-purple rounded-full"></div>
                            <span className="text-[10px] font-black text-lh-purple uppercase tracking-[0.5em] italic">Registry_Archives</span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter uppercase italic leading-none">
                            EXAM MISSION <span className="text-transparent font-black" style={{ WebkitTextStroke: '1px #bc13fe' }}>HISTORY</span>
                        </h1>
                    </div>
                </div>

                <PrecisionPanel className="p-8">
                    <div className="space-y-2">
                        {history.map((item, i) => (
                            <div key={i} className="group/row flex flex-col md:flex-row md:items-center justify-between p-8 rounded-[2rem] hover:bg-white/[0.03] border border-transparent hover:border-white/5 transition-all">
                                <div className="flex items-center gap-8 mb-4 md:mb-0">
                                    <div className="w-14 h-14 rounded-2xl bg-lh-purple/10 flex items-center justify-center text-lh-purple group-hover/row:scale-110 transition-transform">
                                        <History size={24} />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-black text-white uppercase tracking-tighter italic">{item.exam}</h4>
                                        <p className="text-[10px] text-gray-500 font-mono uppercase tracking-widest mt-1 italic">{item.date}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-12">
                                    <div className="text-right">
                                        <p className="text-[9px] text-gray-600 font-black uppercase tracking-widest mb-1">Node_Status</p>
                                        <p className="text-[11px] text-white font-black uppercase tracking-widest italic">{item.status}</p>
                                    </div>
                                    <div className={`w-20 text-center p-3 rounded-xl border ${item.score === 'PASS' ? 'bg-green-500/10 border-green-500/30' : 'bg-lh-purple/20 border-lh-purple/30'}`}>
                                        <span className={`text-[12px] font-black italic ${item.score === 'PASS' ? 'text-green-500' : 'text-lh-purple'}`}>{item.score}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </PrecisionPanel>
            </div>
        </div>
    );
};

export default ExamHistory;
