import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronLeft, Play, FileText, CheckCircle2,
    Menu, X, ExternalLink, Download,
    Shield, Monitor, BookOpen, Layers, Lock
} from 'lucide-react';
import api from '../utils/api';
import { toast } from 'react-toastify';
import { io } from 'socket.io-client';

const CourseView = () => {
    const { id } = useParams();
    const [course, setCourse] = useState(null);
    const [activeChapter, setActiveChapter] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [progress, setProgress] = useState(0);
    const navigate = useNavigate();
    const videoRef = useRef(null);
    const [liveClass, setLiveClass] = useState(null);
    const [showLiveModal, setShowLiveModal] = useState(false);

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const res = await api.get(`/courses/${id}/content`);
                setCourse(res.data);
                if (res.data.chapters?.length > 0) {
                    setActiveChapter(res.data.chapters[0]);
                }
            } catch (error) {
                console.error("Access denied or course not found", error);
                toast.error("Access denied or course not found.");
                navigate('/courses');
            } finally {
                setLoading(false);
            }
        };
        fetchContent();
    }, [id, navigate]);

    // Fetch live class for this course and join socket room
    useEffect(() => {
        if (!id) return;
        const checkLiveClass = async () => {
            try {
                const res = await api.get(`/live-class/course/${id}`);
                setLiveClass(res.data);
            } catch {
                // Not enrolled or no class — ignore silently
            }
        };
        checkLiveClass();

        // Join course socket room for real-time live class updates
        const socket = io();
        socket.emit('join_course', { courseId: id });
        socket.on('live_class_update', (data) => {
            if (String(data.courseId) === String(id)) {
                if (data.status === 'live') {
                    setLiveClass(data);
                    toast.info('🔴 Live class has started! Join now.');
                } else if (data.status === 'ended') {
                    setLiveClass(null);
                    setShowLiveModal(false);
                    toast.info('Live class has ended.');
                }
            }
        });
        return () => { socket.disconnect(); };
    }, [id]);

    // Autoplay video whenever active chapter changes (user clicked a chapter)
    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.load();
            videoRef.current.play().catch(() => {
                // Autoplay blocked by browser — ignore silently
            });
        }
    }, [activeChapter]);

    if (loading) return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6">
            <div className="w-12 h-12 border-4 border-lh-purple border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-lh-purple font-black uppercase tracking-[0.4em] text-[10px] animate-pulse">Decrypting Course_Data...</p>
        </div>
    );

    if (!course) return null;

    return (
        <div className="bg-[#050505] h-screen flex flex-col overflow-hidden text-white font-plus-jakarta">
            {/* --- Top Navigation --- */}
            <header className="h-16 px-6 bg-black border-b border-white/10 flex items-center justify-between z-50">
                <div className="flex items-center gap-6">
                    <Link to={`/courses/${id}`} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                        <ChevronLeft size={20} />
                    </Link>
                    <div className="h-4 w-[1px] bg-white/10 hidden md:block"></div>
                    <div>
                        <h1 className="text-sm font-black uppercase tracking-tight truncate max-w-[200px] md:max-w-md">
                            {course.title}
                        </h1>
                        <p className="hidden md:block text-[9px] font-bold text-gray-500 uppercase tracking-widest">
                            Learning Session in Progress
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    {/* Live Class Banner */}
                    {liveClass && liveClass.status === 'live' && (
                        <button
                            onClick={() => setShowLiveModal(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-lh-purple text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-[0_0_20px_rgba(188,19,254,0.5)] animate-pulse hover:scale-105 transition-all"
                        >
                            <span className="w-2 h-2 rounded-full bg-white"></span>
                            LIVE NOW — {liveClass.title}
                        </button>
                    )}
                    <div className="hidden lg:flex flex-col items-end">
                        <span className="text-[8px] font-black text-lh-purple uppercase tracking-widest">Secure_Connection</span>
                        <span className="text-[10px] font-bold text-gray-500">Encrypted Content Delivery</span>
                    </div>
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-2.5 bg-lh-purple/10 text-lh-purple rounded-xl border border-lh-purple/20 hover:bg-lh-purple hover:text-white transition-all"
                    >
                        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </header>

            {/* Jitsi Live Class Modal */}
            {showLiveModal && liveClass && (
                <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col">
                    <div className="flex items-center justify-between px-6 py-4 bg-black border-b border-white/10">
                        <div className="flex items-center gap-3">
                            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
                            <span className="text-sm font-black uppercase tracking-widest text-white">{liveClass.title}</span>
                            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Live Session</span>
                        </div>
                        <button
                            onClick={() => setShowLiveModal(false)}
                            className="p-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/10 transition-all"
                        >
                            <X size={20} />
                        </button>
                    </div>
                    <iframe
                        src={`https://meet.jit.si/${liveClass.roomId}`}
                        className="flex-1 w-full border-0"
                        allow="camera; microphone; fullscreen; display-capture"
                        title="Live Class"
                    />
                </div>
            )}

            <div className="flex flex-1 overflow-hidden">
                {/* --- Content Area --- */}
                <main className="flex-1 overflow-y-auto bg-lh-dark relative custom-scrollbar">
                    {course.chapters?.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center p-8 text-center space-y-6">
                            <div className="p-8 bg-white/5 rounded-full border border-dashed border-white/10 animate-pulse">
                                <Layers size={48} className="text-lh-purple opacity-40" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-2xl font-black uppercase tracking-tighter">Architecture Pending</h3>
                                <p className="text-gray-500 max-w-sm text-sm font-medium uppercase tracking-widest leading-loose">
                                    The technical modules for this protocol are currently being synchronized. Please check back shortly for full access.
                                </p>
                            </div>
                            <Link to="/courses" className="px-8 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all">
                                Return to Command Center
                            </Link>
                        </div>
                    ) : activeChapter ? (
                        <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-8">
                            {/* Video Section */}
                            {activeChapter.videoUrl ? (
                                <div className="aspect-video bg-black rounded-[2rem] overflow-hidden border border-white/5 shadow-2xl relative group">
                                    {(() => {
                                        const url = activeChapter.videoUrl;
                                        if (url.includes('youtube.com') || url.includes('youtu.be')) {
                                            let videoId = '';
                                            if (url.includes('v=')) {
                                                videoId = url.split('v=')[1].split('&')[0];
                                            } else if (url.includes('youtu.be/')) {
                                                videoId = url.split('youtu.be/')[1].split('?')[0];
                                            } else if (url.includes('embed/')) {
                                                videoId = url.split('embed/')[1].split('?')[0];
                                            }

                                            const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0` : url;

                                            return (
                                                <iframe
                                                    key={embedUrl}
                                                    src={embedUrl}
                                                    className="w-full h-full border-0"
                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                    allowFullScreen
                                                    title="Course Video"
                                                ></iframe>
                                            );
                                        }

                                        return (
                                            <video
                                                key={url}
                                                ref={videoRef}
                                                src={url}
                                                className="w-full h-full"
                                                controls
                                                controlsList="nodownload"
                                                autoPlay
                                                playsInline
                                            >
                                                Your browser does not support the video tag.
                                            </video>
                                        );
                                    })()}
                                </div>
                            ) : (
                                <div className="aspect-video bg-white/[0.02] rounded-[2rem] border border-dashed border-white/10 flex flex-col items-center justify-center text-center p-12">
                                    <Monitor size={48} className="text-gray-700 mb-6 opacity-40" />
                                    <h3 className="text-2xl font-black uppercase tracking-tighter mb-4">No Video Content</h3>
                                    <p className="text-gray-500 max-w-sm text-sm font-medium">This module focuses on technical documentation and laboratory research.</p>
                                </div>
                            )}

                            {/* Info Section */}
                            <div className="space-y-6 bg-white/[0.02] p-10 rounded-[2.5rem] border border-white/5 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-lh-purple/5 blur-[80px] rounded-full"></div>
                                <div className="relative z-10">
                                    <div className="flex items-center gap-3 text-lh-purple mb-4">
                                        <Layers size={18} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Module Documentation</span>
                                    </div>
                                    <h2 className="text-3xl font-black uppercase tracking-tight mb-4">{activeChapter.title}</h2>
                                    <p className="text-gray-400 text-lg leading-relaxed font-medium">
                                        {activeChapter.description}
                                    </p>
                                </div>
                            </div>

                            {/* Resource Section */}
                            {activeChapter.pdfUrl && (
                                <div className="p-1 rounded-[2.5rem] bg-gradient-to-r from-lh-purple/20 to-transparent">
                                    <div className="bg-black p-8 rounded-[2.4rem] border border-white/5 flex flex-col md:flex-row items-center justify-between gap-8 group">
                                        <div className="flex items-center gap-6">
                                            <div className="p-5 bg-white/5 rounded-2xl text-lh-purple group-hover:scale-110 transition-transform">
                                                <FileText size={32} />
                                            </div>
                                            <div>
                                                <h4 className="text-xl font-black uppercase tracking-tight mb-1">Technical Manual</h4>
                                                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">PDF Attachment • High Precision</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-4 w-full md:w-auto">
                                            <a
                                                href={activeChapter.pdfUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex-1 md:flex-none px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-lh-purple transition-all flex items-center justify-center gap-3"
                                            >
                                                Preview <ExternalLink size={14} />
                                            </a>
                                            <a
                                                href={activeChapter.pdfUrl}
                                                download
                                                className="flex-1 md:flex-none px-8 py-4 bg-lh-purple text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-[0_0_20px_rgba(188,19,254,0.3)] hover:scale-105 transition-all flex items-center justify-center gap-3"
                                            >
                                                Download <Download size={14} />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="h-full flex items-center justify-center">
                            <Lock size={48} className="text-gray-800 animate-pulse" />
                        </div>
                    )}
                </main>

                {/* --- Sidebar (Chapter List) --- */}
                <AnimatePresence>
                    {isSidebarOpen && (
                        <motion.aside
                            initial={{ width: 0, opacity: 0 }}
                            animate={{ width: 400, opacity: 1 }}
                            exit={{ width: 0, opacity: 0 }}
                            className="bg-black border-l border-white/10 flex flex-col overflow-hidden z-20 shadow-[-20px_0_40px_rgba(0,0,0,0.5)]"
                        >
                            <div className="p-8 border-b border-white/5">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-lh-purple">Course_Intel</h3>
                                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Global v1.0</span>
                                </div>
                                <h2 className="text-xl font-[1000] uppercase tracking-tighter leading-tight">Curriculum Structure</h2>
                            </div>

                            <div className="flex-1 overflow-y-auto custom-scrollbar px-4 py-6 space-y-2">
                                {course.chapters?.map((chapter, idx) => (
                                    <button
                                        key={chapter._id}
                                        onClick={() => setActiveChapter(chapter)}
                                        className={`w-full text-left p-6 rounded-2xl transition-all duration-300 group flex items-start gap-4 ${activeChapter?._id === chapter._id
                                            ? 'bg-lh-purple text-white shadow-[0_0_30px_rgba(188,19,254,0.2)]'
                                            : 'text-gray-500 hover:bg-white/5 hover:text-white border border-transparent hover:border-white/5'
                                            }`}
                                    >
                                        <div className={`mt-1 p-1 rounded ${activeChapter?._id === chapter._id ? 'bg-white/20' : 'bg-lh-purple/10'}`}>
                                            {chapter.videoUrl ? <Play size={10} fill="currentColor" /> : <FileText size={10} />}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className={`text-[8px] font-black uppercase tracking-widest ${activeChapter?._id === chapter._id ? 'text-white/60' : 'text-lh-purple'}`}>
                                                    Module {(idx + 1).toString().padStart(2, '0')}
                                                </span>
                                                {activeChapter?._id === chapter._id && <CheckCircle2 size={12} />}
                                            </div>
                                            <h4 className={`text-[11px] font-[900] uppercase tracking-tight leading-none ${activeChapter?._id === chapter._id ? 'text-white' : ''}`}>
                                                {chapter.title}
                                            </h4>
                                        </div>
                                    </button>
                                ))}
                            </div>

                            <div className="p-6 bg-white/[0.02] border-t border-white/5">
                                <Link
                                    to="/dashboard/pearson"
                                    className="w-full py-4 border border-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-white hover:text-black transition-all"
                                >
                                    <Shield size={14} /> Verify Knowledge in Sandbox
                                </Link>
                            </div>
                        </motion.aside>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default CourseView;
