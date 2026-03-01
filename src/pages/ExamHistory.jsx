import React, { useState, useEffect } from 'react';
import { History, Search, ArrowLeft, Loader2, Info, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../utils/api';
import { toast } from 'react-toastify';
import CertificateTemplate from '../components/CertificateTemplate';

const PrecisionPanel = ({ children, className = "" }) => (
    <div className={`relative bg-[#0a0a0a]/70 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] shadow-[0_30px_100px_rgba(0,0,0,0.6)] overflow-hidden group transition-all duration-700 ${className}`}>
        <div className="absolute inset-0 bg-lh-purple/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-lh-purple/30 to-transparent"></div>
        <div className="relative z-10">{children}</div>
    </div>
);

const ExamHistory = () => {
    const navigate = useNavigate();
    const [history, setHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [certData, setCertData] = useState(null);
    const [loadingCertId, setLoadingCertId] = useState(null);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                setIsLoading(true);
                const response = await api.get('/results/my-history');
                setHistory(response.data);
            } catch (err) {
                console.error("Failed to fetch exam history:", err);
                const msg = "Failed to synchronize with registry. Please try again later.";
                setError(msg);
                toast.error(msg);
            } finally {
                setIsLoading(false);
            }
        };

        fetchHistory();
    }, []);

    const handleDownloadCert = async (resultId) => {
        setLoadingCertId(resultId);
        try {
            const res = await api.get(`/results/${resultId}/certificate`);
            setCertData(res.data);
        } catch (err) {
            toast.error(err?.response?.data?.message || 'Failed to load certificate');
        } finally {
            setLoadingCertId(null);
        }
    };

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
                            <span className="text-[10px] font-black text-lh-purple uppercase tracking-[0.5em]">Registry_Archives</span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter uppercase leading-none">
                            EXAM MISSION <span className="text-transparent font-black" style={{ WebkitTextStroke: '1px #bc13fe' }}>HISTORY</span>
                        </h1>
                    </div>
                </div>

                <PrecisionPanel className="p-8">
                    {isLoading ? (
                        <div className="py-32 flex flex-col items-center justify-center space-y-4">
                            <Loader2 className="w-12 h-12 text-lh-purple animate-spin" />
                            <p className="text-[10px] font-black text-white uppercase tracking-[0.5em] animate-pulse">Accessing Encrypted Archives...</p>
                        </div>
                    ) : error ? (
                        <div className="py-32 flex flex-col items-center justify-center space-y-4">
                            <Info className="w-12 h-12 text-red-500 opacity-50" />
                            <p className="text-[10px] font-black text-red-500 uppercase tracking-[0.3em]">{error}</p>
                        </div>
                    ) : history.length > 0 ? (
                        <div className="space-y-2">
                            {history.map((item, i) => {
                                const date = new Date(item.completedAt || item.createdAt);
                                const formattedDate = date.toLocaleDateString('en-GB').replace(/\//g, '_');
                                const isPassed = item.status === 'Pass';

                                return (
                                    <div key={item._id || i} className="group/row flex flex-col md:flex-row md:items-center justify-between p-8 rounded-[2rem] hover:bg-white/[0.03] border border-transparent hover:border-white/5 transition-all">
                                        <div className="flex items-center gap-8 mb-4 md:mb-0">
                                            <div className="w-14 h-14 rounded-2xl bg-lh-purple/10 flex items-center justify-center text-lh-purple group-hover/row:scale-110 transition-transform">
                                                <History size={24} />
                                            </div>
                                            <div>
                                                <h4 className="text-lg font-black text-white uppercase tracking-tighter">{item.examTitle || 'Unknown Exam'}</h4>
                                                <p className="text-[10px] text-gray-500 font-mono uppercase tracking-widest mt-1">
                                                    Attempt_Timestamp: {formattedDate}_{date.getHours().toString().padStart(2, '0')}{date.getMinutes().toString().padStart(2, '0')}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-6 flex-wrap">
                                            <div className="text-right">
                                                <p className="text-[9px] text-gray-600 font-black uppercase tracking-widest mb-1">Node_Status</p>
                                                <p className="text-[11px] text-white font-black uppercase tracking-widest">Operation_Completed</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[9px] text-gray-600 font-black uppercase tracking-widest mb-1">Final_Metric</p>
                                                <p className={`text-[11px] font-black uppercase tracking-widest ${isPassed ? 'text-green-500' : 'text-lh-purple'}`}>
                                                    {item.percentage ? `${item.percentage.toFixed(1)}%` : 'N/A'}
                                                </p>
                                            </div>
                                            <div className={`w-20 text-center p-3 rounded-xl border ${isPassed ? 'bg-green-500/10 border-green-500/30' : 'bg-lh-purple/20 border-lh-purple/30'}`}>
                                                <span className={`text-[12px] font-black ${isPassed ? 'text-green-500' : 'text-lh-purple'}`}>{item.status ? item.status.toUpperCase() : 'UNKNOWN'}</span>
                                            </div>
                                            {/* Download Certificate Button for passed exams */}
                                            {isPassed && (
                                                <button
                                                    onClick={() => handleDownloadCert(item._id)}
                                                    disabled={loadingCertId === item._id}
                                                    className="flex items-center gap-2 px-4 py-2.5 bg-lh-purple/10 border border-lh-purple/30 text-lh-purple rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-lh-purple hover:text-white hover:border-lh-purple transition-all disabled:opacity-40 whitespace-nowrap"
                                                >
                                                    <Award size={14} />
                                                    {loadingCertId === item._id ? 'Loading...' : 'Certificate'}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="py-32 text-center border-2 border-dashed border-white/5 rounded-[3rem] bg-black/40">
                            <History className="w-16 h-16 text-gray-800 mx-auto mb-6 opacity-30" />
                            <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.6em] opacity-60">No archived mission records found</p>
                        </div>
                    )}
                </PrecisionPanel>
            </div>

            {/* Certificate Modal */}
            <AnimatePresence>
                {certData && (
                    <CertificateTemplate data={certData} onClose={() => setCertData(null)} />
                )}
            </AnimatePresence>
        </div>
    );
};

export default ExamHistory;
