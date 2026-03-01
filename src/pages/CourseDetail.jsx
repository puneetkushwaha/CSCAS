import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Shield, Clock, Award, Layers, CheckCircle2,
    Play, FileText, ChevronRight, ShoppingCart, ArrowLeft,
    Database, Zap, Lock, PlayCircle, X, Monitor
} from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../utils/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const CourseDetail = () => {
    const { id } = useParams();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [activeDemo, setActiveDemo] = useState(null);
    const { addToCart, cartItems } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const [courseRes, myCoursesRes] = await Promise.all([
                    api.get(`/courses/${id}`),
                    user ? api.get('/courses/my-courses') : Promise.resolve({ data: [] })
                ]);
                setCourse(courseRes.data);
                setIsEnrolled(myCoursesRes.data.some(c => c && c._id === id));
            } catch (error) {
                console.error("Error fetching course detail:", error);
                toast.error("Failed to load course details.");
            } finally {
                setLoading(false);
            }
        };
        fetchCourse();
    }, [id, user]);

    const isInCart = cartItems.some(item => item.id === id);

    const handleAction = async () => {
        if (!user) {
            toast.info("Please login to enroll in courses.");
            navigate('/login', { state: { from: `/courses/${id}` } });
            return;
        }

        if (isEnrolled) {
            navigate(`/courses/${id}/view`);
        } else if (course.price === 0) {
            try {
                // Free course - enroll instantly
                await api.post(`/courses/${id}/enroll-free`);
                setIsEnrolled(true);
                toast.success("Successfully enrolled for free!");
                navigate(`/courses/${id}/view`);
            } catch (error) {
                console.error("Free enrollment error:", error);
                toast.error(error.response?.data?.message || "Failed to enroll for free.");
            }
        } else if (isInCart) {
            // Toggle cart drawer or navigate to checkout
        } else {
            addToCart({
                id: course._id,
                title: course.title,
                price: course.price,
                thumbnail: course.thumbnail,
                category: course.category,
                type: 'course'
            });
            toast.success("Added to cart!");
        }
    };

    if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-lh-purple font-black uppercase tracking-widest animate-pulse">Initializing Data_Buffer...</div>;
    if (!course) return <div className="min-h-screen bg-black flex items-center justify-center text-white">Course Not Found</div>;

    return (
        <div className="bg-[#050505] min-h-screen text-white font-plus-jakarta overflow-x-hidden">
            <Navbar />

            {/* --- Hero Section --- */}
            <section className="relative pt-32 pb-20 px-6 overflow-hidden border-b border-white/5">
                <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[radial-gradient(#bc13fe_1px,transparent_1px)] [background-size:40px_40px]"></div>

                <div className="max-w-[1300px] mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-8"
                    >
                        <Link to="/courses" className="inline-flex items-center gap-2 text-lh-purple hover:text-white transition-colors uppercase tracking-[0.4em] text-[10px] font-black group">
                            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Catalog
                        </Link>

                        <div className="flex flex-wrap gap-3">
                            <span className="px-4 py-1.5 bg-lh-purple/20 text-lh-purple text-[10px] font-black uppercase tracking-widest rounded-full border border-lh-purple/30">
                                {course.category}
                            </span>
                            <span className="px-4 py-1.5 bg-white/5 text-gray-500 text-[10px] font-black uppercase tracking-widest rounded-full border border-white/10">
                                {course.level} Level
                            </span>
                        </div>

                        <h1 className="text-4xl md:text-7xl font-[1000] tracking-tighter uppercase leading-none">
                            {course.title}
                        </h1>

                        <p className="text-gray-400 text-lg font-medium leading-relaxed max-w-xl">
                            {course.description}
                        </p>

                        <div className="flex flex-wrap gap-8 pt-4">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-white/5 rounded-xl text-lh-purple">
                                    <Layers size={20} />
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Curriculum</p>
                                    <p className="text-sm font-black uppercase">{course.chapters?.length || 0} Modules</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-white/5 rounded-xl text-lh-purple">
                                    <Award size={20} />
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Certification</p>
                                    <p className="text-sm font-black uppercase">Official Verifiable</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative"
                    >
                        <div className="relative aspect-video rounded-[3rem] overflow-hidden border border-white/10 group">
                            <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all duration-700" />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                <button
                                    onClick={handleAction}
                                    className="w-20 h-20 bg-lh-purple rounded-full flex items-center justify-center text-white shadow-[0_0_50px_rgba(188,19,254,0.5)] hover:scale-110 transition-all group"
                                >
                                    <Play size={32} fill="currentColor" />
                                </button>
                            </div>
                        </div>

                        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-lh-purple/20 blur-[60px] rounded-full -z-10"></div>
                        <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-500/10 blur-[60px] rounded-full -z-10"></div>
                    </motion.div>
                </div>
            </section>

            {/* --- Sticky Enrollment Bar --- */}
            <div className="sticky top-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/5 py-4 px-6">
                <div className="max-w-[1300px] mx-auto flex items-center justify-between">
                    <div className="hidden md:block">
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em]">Currently Viewing</span>
                        <h4 className="text-sm font-black uppercase tracking-tight">{course.title}</h4>
                    </div>
                    <div className="flex items-center gap-8 w-full md:w-auto">
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Elite Registration</span>
                            <span className="text-3xl font-[1000] text-lh-purple leading-none">₹{course.price}</span>
                        </div>
                        <button
                            onClick={handleAction}
                            className={`flex-1 md:flex-none px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3 ${isEnrolled
                                ? 'bg-emerald-500 text-black hover:bg-emerald-400'
                                : isInCart
                                    ? 'bg-white text-black'
                                    : 'bg-lh-purple text-white shadow-[0_0_30px_rgba(188,19,254,0.3)] hover:scale-105'
                                }`}
                        >
                            {isEnrolled ? (
                                <>Access Content <PlayCircle size={18} /></>
                            ) : isInCart ? (
                                <>In Cart <ShoppingCart size={18} /></>
                            ) : course?.price === 0 ? (
                                <>Enroll For Free <Zap size={18} fill="currentColor" /></>
                            ) : (
                                <>Enroll Now <Zap size={18} fill="currentColor" /></>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* --- Curriculum Section --- */}
            <section className="py-24 px-6 relative z-10">
                <div className="max-w-[1300px] mx-auto">
                    <div className="flex items-center gap-4 mb-16">
                        <div className="w-2 h-10 bg-lh-purple rounded-full"></div>
                        <h2 className="text-3xl md:text-5xl font-[1000] tracking-tighter uppercase">Subject <span className="text-white/20">Modules</span></h2>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-12">
                        <div className="lg:col-span-2 space-y-4">
                            {course.chapters?.map((chapter, idx) => (
                                <div
                                    key={chapter._id}
                                    className="p-8 rounded-[2rem] bg-white/[0.03] border border-white/5 hover:border-lh-purple/30 transition-all group"
                                >
                                    <div className="flex items-start justify-between gap-6">
                                        <div className="flex items-start gap-6">
                                            <span className="text-3xl font-black text-white/10 group-hover:text-lh-purple/40 transition-colors">
                                                {(idx + 1).toString().padStart(2, '0')}
                                            </span>
                                            <div>
                                                <h4 className="text-xl font-black uppercase tracking-tight mb-2 group-hover:text-white transition-colors flex items-center gap-3">
                                                    {chapter.title}
                                                    {chapter.isPreview && (
                                                        <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-full text-[8px] tracking-widest uppercase">Free Preview</span>
                                                    )}
                                                </h4>
                                                <div className="flex items-center gap-4">
                                                    <p className="text-gray-500 text-sm font-medium line-clamp-1 max-w-[300px]">
                                                        {chapter.description}
                                                    </p>
                                                    <div className="flex items-center gap-2">
                                                        {(chapter.videoUrl || chapter.hasVideo) && (
                                                            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-lh-purple/10 text-lh-purple text-[8px] font-black uppercase rounded border border-lh-purple/20">
                                                                <Monitor size={10} /> Video
                                                            </div>
                                                        )}
                                                        {(chapter.pdfUrl || chapter.hasPdf) && (
                                                            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-blue-500/10 text-blue-500 text-[8px] font-black uppercase rounded border border-blue-500/20">
                                                                <FileText size={10} /> PDF
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-white/5 p-3 rounded-xl flex items-center justify-center group-hover:bg-white/10 transition-colors">
                                            {isEnrolled ? (
                                                <Play size={16} />
                                            ) : chapter.isPreview && chapter.videoUrl ? (
                                                <button
                                                    onClick={() => setActiveDemo(chapter.videoUrl)}
                                                    className="flex items-center gap-2 text-[10px] whitespace-nowrap font-black uppercase text-emerald-500 tracking-widest hover:scale-105 transition-transform"
                                                >
                                                    <PlayCircle size={16} /> Play Demo
                                                </button>
                                            ) : (
                                                <Lock size={16} className="text-gray-600" />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-6">
                            <div className="p-10 rounded-[3rem] bg-lh-purple/5 border border-lh-purple/20">
                                <h4 className="text-xl font-black uppercase tracking-tight mb-6 flex items-center gap-3">
                                    <CheckCircle2 className="text-lh-purple" /> Course Highlights
                                </h4>
                                <ul className="space-y-4">
                                    {[
                                        "Industry-Leading Instructors",
                                        "Hands-on Virtualized Labs",
                                        "Verifiable Digital Certificate",
                                        "Life-time Access to Content",
                                        "24/7 Technical Support",
                                        "Community Networking Group"
                                    ].map(item => (
                                        <li key={item} className="flex items-center gap-3 text-sm font-medium text-gray-400">
                                            <div className="w-1.5 h-1.5 rounded-full bg-lh-purple"></div>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="p-10 rounded-[3rem] bg-white/[0.02] border border-white/5 overflow-hidden relative group">
                                <Database className="absolute bottom-[-20%] right-[-10%] w-40 h-40 text-white/5 rotate-12" />
                                <h4 className="text-xl font-black uppercase tracking-tight mb-4 leading-none">Secure Future Platform</h4>
                                <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-6">Built for Cyber Defense</p>
                                <button className="w-full py-4 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all">
                                    Download Brochure
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- Demo Video Modal --- */}
            {activeDemo && (
                <div className="fixed inset-0 z-[999] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-4 sm:p-6 md:p-12">
                    <button
                        onClick={() => setActiveDemo(null)}
                        className="absolute top-6 right-6 p-4 bg-white/10 rounded-full hover:bg-white/20 hover:scale-105 transition-all text-white z-50 flex items-center gap-2"
                    >
                        <span className="text-xs font-black uppercase tracking-widest hidden md:block">Close Video</span>
                        <X size={20} />
                    </button>

                    <div className="w-full max-w-5xl aspect-video bg-black rounded-3xl overflow-hidden shadow-[0_0_80px_rgba(16,185,129,0.15)] ring-4 ring-emerald-500/20 relative group relative">
                        {(() => {
                            if (activeDemo.includes('youtube.com') || activeDemo.includes('youtu.be')) {
                                let embedUrl = activeDemo;
                                if (activeDemo.includes('watch?v=')) {
                                    embedUrl = activeDemo.replace('watch?v=', 'embed/');
                                    const ampersandPosition = embedUrl.indexOf('&');
                                    if (ampersandPosition !== -1) {
                                        embedUrl = embedUrl.substring(0, ampersandPosition);
                                    }
                                } else if (activeDemo.includes('youtu.be/')) {
                                    embedUrl = activeDemo.replace('youtu.be/', 'youtube.com/embed/');
                                }
                                return (
                                    <iframe key={embedUrl} src={`${embedUrl}?autoplay=1`} className="w-full h-full border-0 bg-black" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                                );
                            }
                            return (
                                <video src={activeDemo} autoPlay controls controlsList="nodownload" className="w-full h-full object-contain bg-black outline-none border-none">
                                    Your browser does not support the video tag.
                                </video>
                            );
                        })()}
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
};

export default CourseDetail;
