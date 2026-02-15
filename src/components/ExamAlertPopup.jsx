import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Shield, Clock, ArrowRight, Activity, AlertCircle } from 'lucide-react';

const ExamAlertPopup = () => {
    const navigate = useNavigate();
    const [upcomingExam, setUpcomingExam] = useState(null);
    const [timeLeft, setTimeLeft] = useState(null);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const checkExams = () => {
            const exams = JSON.parse(localStorage.getItem('scheduledExams') || '[]');
            if (exams.length === 0) {
                setUpcomingExam(null);
                return;
            }

            const now = new Date().getTime();

            // Find the closest upcoming exam or one that just started
            const closest = exams
                .map(exam => ({
                    ...exam,
                    diff: exam.timestamp - now
                }))
                // Shown if it's within 10 minutes (600,000 ms) before start
                // or if it started within the last 30 minutes (late window)
                .filter(exam => exam.diff <= 600000 && exam.diff > -1800000)
                .sort((a, b) => a.diff - b.diff)[0];

            if (closest) {
                setUpcomingExam(closest);
                setIsReady(closest.diff <= 0);

                if (closest.diff > 0) {
                    const minutes = Math.floor(closest.diff / 60000);
                    const seconds = Math.floor((closest.diff % 60000) / 1000);
                    setTimeLeft(`${minutes}:${seconds.toString().padStart(2, '0')}`);
                } else {
                    setTimeLeft('0:00');
                }
            } else {
                setUpcomingExam(null);
            }
        };

        const interval = setInterval(checkExams, 1000);
        checkExams(); // Initial check

        return () => clearInterval(interval);
    }, []);

    if (!upcomingExam) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, x: 100, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 100, scale: 0.9 }}
                className="fixed bottom-8 right-8 z-[100] max-w-[320px] w-full"
            >
                <div className="relative bg-[#0a0a0a]/90 backdrop-blur-2xl border border-lh-purple/30 rounded-[2.5rem] p-6 shadow-[0_20px_60px_rgba(188,19,254,0.3)] overflow-hidden group">
                    {/* Background Glow */}
                    <div className="absolute inset-0 bg-lh-purple/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

                    {/* Status Light */}
                    <div className="absolute top-6 right-6 flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${isReady ? 'bg-green-500 animate-ping' : 'bg-lh-purple animate-pulse shadow-[0_0_10px_#bc13fe]'}`}></span>
                    </div>

                    <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-xl ${isReady ? 'bg-green-500/10' : 'bg-lh-purple/10'}`}>
                                    {isReady ? (
                                        <Activity size={18} className="text-green-500" />
                                    ) : (
                                        <Clock size={18} className="text-lh-purple" />
                                    )}
                                </div>
                                <span className={`text-[10px] font-black uppercase tracking-[0.3em] ${isReady ? 'text-green-500' : 'text-lh-purple'}`}>
                                    {isReady ? 'Mission_Live' : 'Pre-flight_check'}
                                </span>
                            </div>
                            {!isReady && (
                                <div className="text-2xl font-black text-white tracking-widest bg-lh-purple/20 px-4 py-1 rounded-xl border border-lh-purple/30">
                                    {timeLeft}
                                </div>
                            )}
                        </div>

                        <div>
                            <h4 className="text-[14px] font-black text-white uppercase tracking-widest leading-tight mb-2">
                                {upcomingExam.examName}
                            </h4>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-relaxed">
                                {isReady ? 'The examination environment is now secure.' : 'Synchronizing with global testing nodes...'}
                            </p>
                        </div>

                        <button
                            onClick={() => navigate('/dashboard/exam-player')}
                            className={`w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] transition-all flex items-center justify-center gap-3 active:scale-95 ${isReady
                                ? 'bg-green-500 text-white shadow-[0_10px_30px_rgba(34,197,94,0.3)] hover:scale-105'
                                : 'bg-lh-purple/10 border border-lh-purple/30 text-white hover:bg-lh-purple/20'
                                }`}
                        >
                            {isReady ? 'START MISSION' : 'PREPARE NODES'}
                            <ArrowRight size={14} className={isReady ? 'animate-bounce-x' : ''} />
                        </button>
                    </div>

                    {/* Security Watermark */}
                    <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-[7px] font-bold text-gray-600 uppercase tracking-[0.2em]">
                        <span>Secure_Channel_443</span>
                        <div className="flex items-center gap-1">
                            <Shield size={8} /> CSCA_AUTH_SUCCESS
                        </div>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default ExamAlertPopup;
