import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Play, ChevronRight, Search, Layers, Clock, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { toast } from 'react-toastify';

const MyCourses = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchMyCourses();
    }, []);

    const fetchMyCourses = async () => {
        try {
            const res = await api.get('/courses/my-courses');
            setCourses(res.data);
        } catch (error) {
            console.error("Failed to fetch my courses", error);
            toast.error("Failed to load your enrolled courses.");
        } finally {
            setLoading(false);
        }
    };

    const filteredCourses = courses.filter(course =>
        course && (
            course.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            course.description?.toLowerCase().includes(searchQuery.toLowerCase())
        )
    );

    const SX = {
        glass: "bg-white/[0.02] backdrop-blur-3xl border border-white/5",
        card: "bg-white/[0.03] border border-white/10 rounded-2xl p-6 hover:bg-white/[0.05] hover:border-lh-purple/30 transition-all duration-500 group",
        input: "w-full bg-white/5 border border-white/10 rounded-xl py-3 px-12 text-sm text-white focus:border-lh-purple focus:ring-1 focus:ring-lh-purple outline-none transition-all placeholder:text-gray-600",
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="w-12 h-12 border-4 border-lh-purple/20 border-t-lh-purple rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-10 pb-20">
            {/* Header section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-black uppercase tracking-tighter mb-2">My <span className="text-lh-purple">Academy</span></h1>
                    <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.3em]">Sector_02 / Enrolled_Modules</p>
                </div>

                <div className="relative w-full md:w-72">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={16} />
                    <input
                        type="text"
                        placeholder="Search mission protocols..."
                        className={SX.input}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {courses.length === 0 ? (
                <div className={`${SX.glass} rounded-[32px] p-20 flex flex-col items-center justify-center text-center space-y-6`}>
                    <div className="w-20 h-20 bg-lh-purple/10 rounded-full flex items-center justify-center text-lh-purple animate-pulse">
                        <BookOpen size={40} />
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-xl font-bold text-white uppercase tracking-tight">No Active Enrollments</h3>
                        <p className="text-gray-500 text-sm max-w-sm">You haven't initiated any specialized training protocols yet. Browse our directory to start your journey.</p>
                    </div>
                    <Link to="/courses">
                        <button className="px-8 py-3 bg-lh-purple text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-[0_0_30px_rgba(188,19,254,0.3)] hover:scale-105 transition-all active:scale-95">
                            Browse Training Modules
                        </button>
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCourses.map((course) => (
                        <motion.div
                            key={course._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={SX.card}
                        >
                            <div className="aspect-video rounded-xl overflow-hidden mb-6 relative border border-white/10">
                                <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                <div className="absolute top-3 left-3 px-3 py-1 bg-black/60 backdrop-blur-md rounded-lg text-[9px] font-black text-white uppercase tracking-widest border border-white/10">
                                    {course.level}
                                </div>
                                <div className="absolute inset-0 bg-lh-purple/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <Link to={`/courses/${course._id}/view`} className="w-12 h-12 bg-white text-lh-purple rounded-full flex items-center justify-center transition-transform group-hover:scale-110 active:scale-90">
                                        <Play size={24} fill="currentColor" />
                                    </Link>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-start gap-4">
                                    <h3 className="font-bold text-lg text-white leading-tight group-hover:text-lh-purple transition-colors">{course.title}</h3>
                                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-1 shrink-0">{course.category}</span>
                                </div>

                                <div className="grid grid-cols-2 gap-3 py-4 border-y border-white/5">
                                    <div className="flex items-center gap-2">
                                        <Layers size={14} className="text-lh-purple" />
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{course.chapters?.length || 0} Modules</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock size={14} className="text-lh-purple" />
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Self-Paced</span>
                                    </div>
                                </div>

                                <div className="pt-2 flex items-center justify-between">
                                    <div className="flex flex-col">
                                        <span className="text-[8px] font-black text-gray-600 uppercase tracking-widest mb-1">Status:</span>
                                        <div className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                                            <span className="text-[9px] font-black text-white uppercase tracking-[0.2em]">Active</span>
                                        </div>
                                    </div>
                                    <Link to={`/courses/${course._id}/view`}>
                                        <button className="flex items-center gap-2 text-[10px] font-black text-lh-purple hover:text-white transition-all uppercase tracking-widest group/btn">
                                            Resume Mission <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Catalog Shortcut */}
            {courses.length > 0 && (
                <div className={`${SX.glass} rounded-[2rem] p-8 flex flex-col md:flex-row items-center justify-between gap-6`}>
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-lh-purple">
                            <Layers size={28} />
                        </div>
                        <div>
                            <h4 className="text-xl font-bold text-white uppercase tracking-tight">Expand Your Knowledge</h4>
                            <p className="text-gray-500 text-xs">Unlock advanced cybersecurity protocols and industry-recognized certifications.</p>
                        </div>
                    </div>
                    <Link to="/courses">
                        <button className="px-8 py-3 bg-white/5 border border-white/10 text-white hover:bg-lh-purple hover:border-lh-purple rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                            View Course Catalog
                        </button>
                    </Link>
                </div>
            )}
        </div>
    );
};

export default MyCourses;
