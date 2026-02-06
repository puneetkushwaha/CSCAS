import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Shield, CheckCircle2, Calendar, Clock, ArrowRight, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

const PrecisionPanel = ({ children, className = "" }) => (
    <div className={`relative bg-[#0a0a0a]/60 backdrop-blur-3xl border border-white/5 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden group transition-all duration-700 ${className}`}>
        <div className="absolute inset-0 bg-lh-purple/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-lh-purple/30 to-transparent"></div>
        <div className="relative z-10">{children}</div>
    </div>
);

const PaymentSuccess = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { appointmentDate, appointmentTime, examName } = location.state || {
        examName: "CSCA Certification Exam",
        appointmentDate: "2026-02-24",
        appointmentTime: "10:00 AM"
    };

    // Store the "scheduled" exam in localStorage for the timer/notifications to pick up
    useEffect(() => {
        const scheduledExam = {
            id: Math.random().toString(36).substring(7).toUpperCase(),
            examName,
            date: appointmentDate,
            time: appointmentTime,
            timestamp: new Date(`${appointmentDate} ${appointmentTime}`).getTime()
        };

        const existingExams = JSON.parse(localStorage.getItem('scheduledExams') || '[]');
        // Add new exam if it doesn't already exist (simple check for demo)
        if (!existingExams.find(e => e.examName === examName && e.date === appointmentDate && e.time === appointmentTime)) {
            const updatedExams = [...existingExams, scheduledExam];
            localStorage.setItem('scheduledExams', JSON.stringify(updatedExams));
            // Keep activeExam for backward compatibility with existing components until they are updated
            localStorage.setItem('activeExam', JSON.stringify(scheduledExam));
        }
    }, [appointmentDate, appointmentTime, examName]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden bg-lh-dark">
            {/* Ambient Background */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-lh-purple/10 blur-[150px] rounded-full pointer-events-none"></div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-xl w-full"
            >
                <PrecisionPanel className="p-12 text-center border-lh-purple/20">
                    <div className="mb-8 relative flex justify-center">
                        <div className="absolute inset-0 bg-lh-purple/20 blur-2xl animate-pulse"></div>
                        <div className="w-20 h-20 bg-lh-purple rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(188,19,254,0.5)] relative">
                            <CheckCircle2 size={40} className="text-white" />
                        </div>
                    </div>

                    <h2 className="text-4xl font-black uppercase tracking-tighter mb-4">
                        Authorization <span className="text-lh-purple">Successful</span>
                    </h2>
                    <p className="text-[11px] font-bold text-gray-500 uppercase tracking-[0.3em] mb-10">
                        Protocol_Registration_Confirmed // Transaction_ID: {Math.random().toString(36).substring(7).toUpperCase()}
                    </p>

                    <div className="space-y-4 mb-10">
                        <div className="p-6 bg-white/[0.03] border border-white/5 rounded-2xl flex items-center justify-between">
                            <div className="flex items-center gap-4 text-left">
                                <div className="p-3 bg-lh-purple/10 rounded-xl">
                                    <Calendar size={20} className="text-lh-purple" />
                                </div>
                                <div>
                                    <p className="text-[8px] font-black text-lh-purple uppercase tracking-widest">Scheduled_Date</p>
                                    <h4 className="text-[13px] font-bold text-white uppercase">{new Date(appointmentDate).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</h4>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 text-right">
                                <div>
                                    <p className="text-[8px] font-black text-lh-purple uppercase tracking-widest">Operational_Window</p>
                                    <h4 className="text-[13px] font-bold text-white uppercase">{appointmentTime}</h4>
                                </div>
                                <div className="p-3 bg-lh-purple/10 rounded-xl">
                                    <Clock size={20} className="text-lh-purple" />
                                </div>
                            </div>
                        </div>

                        <div className="p-4 bg-lh-purple/5 border border-lh-purple/10 rounded-xl">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-relaxed">
                                Your mission parameters have been synchronized with the global certification node. Prepare for operational execution.
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={() => navigate('/dashboard/pearson')}
                        className="w-full py-5 bg-lh-purple text-white rounded-xl text-[11px] font-black uppercase tracking-[0.5em] shadow-2xl shadow-lh-purple/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-4"
                    >
                        RETURN_TO_DASHBOARD <ArrowRight size={16} className="animate-bounce-x" />
                    </button>

                    <div className="mt-8 flex items-center justify-center gap-2">
                        <Activity size={12} className="text-lh-purple animate-pulse" />
                        <span className="text-[9px] font-black text-gray-600 uppercase tracking-[0.2em]">System_Ready_For_Deployment</span>
                    </div>
                </PrecisionPanel>
            </motion.div>
        </div>
    );
};

export default PaymentSuccess;
