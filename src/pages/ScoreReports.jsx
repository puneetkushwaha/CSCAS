import React, { useState, useEffect } from 'react';
import { FileText, Download, TrendingUp, ArrowLeft, Award, Loader2 } from 'lucide-react';
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

const ScoreReports = () => {
    const navigate = useNavigate();
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [certData, setCertData] = useState(null);
    const [loadingCertId, setLoadingCertId] = useState(null);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await api.get('/results/my-history');
                setResults(response.data);
            } catch (error) {
                console.error("Failed to fetch history:", error);
                toast.error("Failed to load score reports.");
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);

    const totalAssessments = results.length;
    const averagePercentage = totalAssessments > 0
        ? (results.reduce((acc, curr) => acc + curr.percentage, 0) / totalAssessments).toFixed(1)
        : 0;

    // Calculate advancement rate: comparison between most recent and second most recent or average
    let advancementRate = "0%";
    if (totalAssessments > 1) {
        const latest = results[0].percentage;
        const previous = results[1].percentage;
        const diff = latest - previous;
        advancementRate = `${diff >= 0 ? '+' : ''}${diff.toFixed(1)}%`;
    }
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
    const stats = [
        { label: 'Total Assessments', value: totalAssessments.toString().padStart(2, '0'), icon: <FileText /> },
        { label: 'Average Score', value: `${averagePercentage}%`, icon: <Award /> },
        { label: 'Advancement Rate', value: advancementRate, icon: <TrendingUp /> }
    ];

    if (loading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
                <Loader2 className="animate-spin text-lh-purple" size={48} />
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em]">Synchronizing_Reports...</p>
            </div>
        );
    }

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
                    {stats.map((stat, i) => (
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

                    {results.length > 0 ? (
                        <div className="space-y-4">
                            {results.map((report) => (
                                <div key={report._id} className="flex flex-col md:flex-row items-center justify-between p-6 bg-white/[0.02] border border-white/5 rounded-3xl hover:border-lh-purple/20 transition-all group/r gap-6">
                                    <div>
                                        <h4 className="text-[13px] font-black text-white uppercase tracking-wider">{report.examTitle}</h4>
                                        <div className="flex items-center gap-4 mt-2">
                                            <p className="text-[9px] text-lh-purple font-mono uppercase tracking-widest">
                                                {new Date(report.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()}
                                            </p>
                                            <span className={`text-[9px] font-black px-2 py-0.5 rounded ${report.status === 'Pass' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'} uppercase tracking-widest`}>
                                                {report.status} ({Math.round(report.percentage)}%)
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {report.status === 'Pass' && (
                                            <button
                                                onClick={() => handleDownloadCert(report._id)}
                                                disabled={loadingCertId === report._id}
                                                className="px-6 py-3 bg-lh-purple/10 border border-lh-purple/20 text-lh-purple rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-lh-purple hover:text-white transition-all flex items-center gap-2 disabled:opacity-50"
                                            >
                                                {loadingCertId === report._id ? 'Loading...' : 'Certificate'} <Award size={14} />
                                            </button>
                                        )}
                                        <button
                                            className="p-4 bg-white/5 rounded-2xl text-lh-purple hover:bg-lh-purple hover:text-white transition-all shadow-lg group-hover/r:animate-bounce-y"
                                            title="Download Report"
                                        >
                                            <Download size={20} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-[2rem]">
                            <p className="text-[11px] font-black text-gray-600 uppercase tracking-[0.4em]">No_Assessments_Recorded</p>
                            <button
                                onClick={() => navigate('/dashboard/find-exam')}
                                className="mt-6 px-10 py-4 bg-lh-purple text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-lh-purple/20"
                            >
                                Schedule_First_Mission
                            </button>
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

export default ScoreReports;
