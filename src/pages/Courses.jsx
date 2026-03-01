import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Shield, BookOpen, Layers, Zap, Search,
    ArrowRight, Star, Clock, Award, PlayCircle
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { toast } from 'react-toastify';

const Courses = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const res = await api.get('/courses');
                setCourses(res.data);
            } catch (error) {
                console.error("Error fetching courses:", error);
                toast.error("Failed to load courses. Please check your connection.");
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, []);

    const categories = ['All', ...new Set(courses.map(c => c.category))];
    const filteredCourses = courses.filter(course => {
        const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            course.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="bg-[#050505] min-h-screen text-white font-plus-jakarta overflow-x-hidden selection:bg-lh-purple selection:text-white">
            <Navbar />

            {/* --- Hero Section --- */}
            <section className="relative pt-40 pb-20 px-6 overflow-hidden">
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-lh-purple/20 blur-[150px] rounded-full animate-pulse"></div>
                <div className="absolute bottom-[20%] left-[-5%] w-[300px] h-[300px] bg-blue-500/10 blur-[120px] rounded-full"></div>

                <div className="max-w-[1300px] mx-auto text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-center gap-3 text-lh-purple mb-8"
                    >
                        <PlayCircle size={20} className="animate-pulse" />
                        <span className="uppercase tracking-[0.4em] text-[11px] font-black">Elite Learning Platform</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-8xl font-[1000] tracking-tighter uppercase leading-none mb-8"
                    >
                        Master the <br />
                        <span className="text-lh-purple">Cyber Battlefield</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-gray-400 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed"
                    >
                        Access industry-validated courses designed by global cybersecurity experts.
                        Level up your skills with hands-on labs and video training.
                    </motion.p>
                </div>
            </section>

            {/* --- Filters & Search --- */}
            <section className="px-6 pb-12">
                <div className="max-w-[1300px] mx-auto">
                    <div className="flex flex-col md:flex-row gap-6 items-center justify-between p-2 bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-[2.5rem]">
                        <div className="flex flex-wrap items-center gap-2 p-2">
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${selectedCategory === cat
                                        ? 'bg-lh-purple text-white shadow-[0_0_20px_rgba(188,19,254,0.3)]'
                                        : 'text-gray-500 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                        <div className="relative w-full md:w-80 group mr-4">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-lh-purple transition-colors" size={18} />
                            <input
                                type="text"
                                placeholder="Search courses..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-black/40 border border-white/5 rounded-full py-4 pl-14 pr-6 text-sm text-white focus:border-lh-purple outline-none transition-all placeholder:text-gray-600"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* --- Course Grid --- */}
            <section className="py-24 px-6 relative z-10">
                <div className="max-w-[1300px] mx-auto">
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="h-[400px] rounded-[3rem] bg-white/[0.02] border border-white/5 animate-pulse"></div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredCourses.map((course, idx) => (
                                <motion.div
                                    key={course._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    viewport={{ once: true }}
                                    className="group relative h-full bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-[3rem] overflow-hidden flex flex-col transition-all duration-500 hover:border-lh-purple/50 hover:shadow-[0_20px_60px_rgba(188,19,254,0.1)]"
                                >
                                    {/* Thumbnail */}
                                    <div className="relative aspect-video overflow-hidden">
                                        <img
                                            src={course.thumbnail || 'https://via.placeholder.com/800x450'}
                                            alt={course.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                                        <div className="absolute bottom-6 left-6 flex flex-wrap gap-2">
                                            <span className="px-3 py-1 bg-lh-purple text-white text-[9px] font-black uppercase tracking-widest rounded-md">
                                                {course.category}
                                            </span>
                                            <span className="px-3 py-1 bg-white/10 backdrop-blur-md text-white text-[9px] font-black uppercase tracking-widest rounded-md border border-white/10">
                                                {course.level}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-8 flex flex-col flex-grow">
                                        <h3 className="text-2xl font-black uppercase tracking-tight leading-tight mb-4 group-hover:text-lh-purple transition-colors">
                                            {course.title}
                                        </h3>
                                        <p className="text-gray-400 text-sm leading-relaxed mb-8 line-clamp-3">
                                            {course.description}
                                        </p>

                                        <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Tuition Fee</span>
                                                <span className="text-2xl font-black text-white">₹{course.price}</span>
                                            </div>
                                            <Link to={`/courses/${course._id}`}>
                                                <button className="p-4 bg-white/5 rounded-2xl text-lh-purple group-hover:bg-lh-purple group-hover:text-white transition-all duration-300">
                                                    <ArrowRight size={24} />
                                                </button>
                                            </Link>
                                        </div>
                                    </div>

                                    {/* Hover Effect Light */}
                                    <div className="absolute top-0 right-0 -mr-20 -mt-20 w-40 h-40 bg-lh-purple/10 blur-[60px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                                </motion.div>
                            ))}
                        </div>
                    )}

                    {!loading && filteredCourses.length === 0 && (
                        <div className="py-32 text-center border border-dashed border-white/10 rounded-[3rem] bg-white/[0.02]">
                            <BookOpen className="w-12 h-12 text-lh-purple mx-auto mb-6 opacity-20" />
                            <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">No Courses Found</h3>
                            <p className="text-gray-500 text-sm font-medium uppercase tracking-widest">Try adjusting your search or filters.</p>
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Courses;
