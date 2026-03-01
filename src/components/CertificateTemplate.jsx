import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { X, Download, Award, Shield, CheckCircle } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const CertificateTemplate = ({ data, onClose }) => {
    const certRef = useRef(null);

    const handleDownloadPDF = async () => {
        const element = certRef.current;
        if (!element) return;

        try {
            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
                backgroundColor: '#0a0a0a',
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({ orientation: 'landscape', unit: 'px', format: [canvas.width / 2, canvas.height / 2] });
            pdf.addImage(imgData, 'PNG', 0, 0, canvas.width / 2, canvas.height / 2);
            pdf.save(`CSCA_Certificate_${data.certificateId}.pdf`);
        } catch (err) {
            console.error('PDF generation failed', err);
        }
    };

    const formattedDate = new Date(data.completedAt).toLocaleDateString('en-US', {
        day: 'numeric', month: 'long', year: 'numeric'
    });

    const certIdShort = String(data.certificateId).slice(-10).toUpperCase();

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-xl z-50 flex flex-col items-center justify-center p-4 overflow-y-auto"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9 }}
                onClick={e => e.stopPropagation()}
                className="w-full max-w-4xl"
            >
                {/* Action Buttons */}
                <div className="flex justify-between items-center mb-4 px-2">
                    <h2 className="text-white font-black uppercase tracking-widest text-sm">Achievement Certificate</h2>
                    <div className="flex gap-3">
                        <button
                            onClick={handleDownloadPDF}
                            className="flex items-center gap-2 px-5 py-2.5 bg-lh-purple text-white rounded-full text-[11px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all"
                        >
                            <Download size={14} /> Download PDF
                        </button>
                        <button
                            onClick={onClose}
                            className="p-2.5 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                        >
                            <X size={16} />
                        </button>
                    </div>
                </div>

                {/* Certificate Card */}
                <div
                    ref={certRef}
                    className="relative w-full bg-[#0a0a0a] rounded-[2rem] overflow-hidden border border-white/10"
                    style={{ aspectRatio: '16/9' }}
                >
                    {/* Background Decorations */}
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-lh-purple/15 blur-[120px] rounded-full" />
                        <div className="absolute bottom-[-15%] right-[-5%] w-[400px] h-[400px] bg-blue-500/10 blur-[100px] rounded-full" />
                        {/* Grid Pattern */}
                        <div className="absolute inset-0 opacity-[0.03]"
                            style={{ backgroundImage: 'repeating-linear-gradient(0deg, white 0px, white 1px, transparent 1px, transparent 50px), repeating-linear-gradient(90deg, white 0px, white 1px, transparent 1px, transparent 50px)' }}
                        />
                        {/* Outer Border Glow */}
                        <div className="absolute inset-3 rounded-[1.5rem] border border-lh-purple/20" />
                        <div className="absolute inset-[14px] rounded-[1.4rem] border border-white/5" />
                    </div>

                    {/* Content */}
                    <div className="relative z-10 h-full flex flex-col justify-between p-10 md:p-14">

                        {/* Top Row */}
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                <Shield className="text-lh-purple" size={32} strokeWidth={1.5} />
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.5em] text-lh-purple">CSCA</p>
                                    <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-gray-500">Certified Excellence</p>
                                </div>
                            </div>

                            <div className="text-right">
                                <p className="text-[9px] font-black uppercase tracking-[0.4em] text-gray-600">Certificate ID</p>
                                <p className="text-[11px] font-mono text-white/40 mt-0.5">{certIdShort}</p>
                            </div>
                        </div>

                        {/* Center — Main Content */}
                        <div className="text-center space-y-4 flex-1 flex flex-col items-center justify-center">
                            <div className="flex items-center justify-center gap-3 mb-2">
                                <div className="h-[1px] w-16 bg-gradient-to-r from-transparent to-lh-purple/60" />
                                <p className="text-[10px] font-black uppercase tracking-[0.5em] text-lh-purple">Certificate of Achievement</p>
                                <div className="h-[1px] w-16 bg-gradient-to-l from-transparent to-lh-purple/60" />
                            </div>

                            <p className="text-sm font-medium text-gray-400 uppercase tracking-[0.3em]">This certifies that</p>

                            <h1 className="text-4xl md:text-5xl font-[900] text-white uppercase tracking-tighter leading-none">
                                {data.userName}
                            </h1>

                            <p className="text-sm text-gray-400 max-w-xl leading-relaxed">
                                has successfully completed and demonstrated proficiency in
                            </p>

                            <h2 className="text-xl md:text-2xl font-black text-lh-purple uppercase tracking-tight">
                                {data.examTitle}
                            </h2>

                            <div className="flex items-center gap-6 mt-2">
                                <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                                    <CheckCircle size={14} className="text-emerald-400" />
                                    <span className="text-[11px] font-black uppercase tracking-widest text-emerald-400">Passed</span>
                                </div>
                                <div className="text-center">
                                    <p className="text-[10px] text-gray-600 uppercase tracking-widest font-bold">Score</p>
                                    <p className="text-2xl font-black text-white">{data.percentage}<span className="text-sm text-gray-500">%</span></p>
                                </div>
                                <div className="text-center">
                                    <p className="text-[10px] text-gray-600 uppercase tracking-widest font-bold">Marks</p>
                                    <p className="text-2xl font-black text-white">{data.score}<span className="text-sm text-gray-500">/{data.totalMarks}</span></p>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex items-end justify-between">
                            <div>
                                <div className="h-[1px] w-24 bg-white/10 mb-2" />
                                <p className="text-[9px] font-black uppercase tracking-[0.4em] text-gray-600">Date of Completion</p>
                                <p className="text-[11px] font-bold text-white/50">{formattedDate}</p>
                            </div>

                            <div className="flex items-center gap-2 opacity-30">
                                <Award size={18} className="text-lh-purple" />
                                <span className="text-[9px] font-black uppercase tracking-[0.4em] text-gray-500">Codevirus Security</span>
                            </div>

                            <div className="text-right">
                                <div className="h-[1px] w-24 bg-white/10 mb-2 ml-auto" />
                                <p className="text-[9px] font-black uppercase tracking-[0.4em] text-gray-600">Authorized By</p>
                                <p className="text-[11px] font-bold text-white/50">CSCA Authority</p>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default CertificateTemplate;
