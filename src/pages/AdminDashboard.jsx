import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users, BookOpen, Activity, Play, Plus, Trash2, Edit, Search,
    BarChart2, Save, X, Check, AlertCircle, LayoutDashboard, FileText
} from 'lucide-react';
import api from '../utils/api';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('overview'); // overview, exams, results
    const [stats, setStats] = useState({ totalExams: 0, totalResults: 0, distinctUsers: 0 });
    const [exams, setExams] = useState([]);
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);

    // Result Editing State
    const [editingResult, setEditingResult] = useState(null);
    const [isResultModalOpen, setIsResultModalOpen] = useState(false);
    const [selectedExamFilter, setSelectedExamFilter] = useState('All');

    // New Exam Form State
    const [currentQuestion, setCurrentQuestion] = useState({
        questionText: '',
        options: ['', '', '', ''],
        correctAnswer: '',
        marks: 1
    });
    const [editingIndex, setEditingIndex] = useState(null);

    const [newExam, setNewExam] = useState({
        title: '',
        description: '',
        duration: 60,
        totalQuestions: 10,
        category: 'Certification',
        price: 0,
        questions: []
    });
    const [editingExamId, setEditingExamId] = useState(null);
    const [isExamModalOpen, setIsExamModalOpen] = useState(false);

    // ... (rest of state)

    // ... (rest of functions)

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [examsRes, resultsRes] = await Promise.all([
                api.get('/exams'),
                api.get('/results/all')
            ]);

            setExams(examsRes.data);
            setResults(resultsRes.data);

            // Calculate Stats
            const distinctUsers = new Set(resultsRes.data.map(r => r.user?._id)).size;
            setStats({
                totalExams: examsRes.data.length,
                totalResults: resultsRes.data.length,
                distinctUsers
            });

        } catch (error) {
            console.error("Failed to fetch admin data", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteExam = async (id) => {
        if (window.confirm('Are you sure you want to delete this exam?')) {
            try {
                await api.delete(`/exams/${id}`);
                fetchData();
            } catch (error) {
                alert('Failed to delete exam');
            }
        }
    };

    const handleDeleteResult = async (id) => {
        if (window.confirm('Are you sure you want to delete this result? This cannot be undone.')) {
            try {
                await api.delete(`/results/${id}`);
                fetchData(); // Refresh list
                alert('Result deleted successfully');
            } catch (error) {
                console.error(error);
                alert('Failed to delete result');
            }
        }
    };

    const handleEditResultInit = (result) => {
        setEditingResult({ ...result });
        setIsResultModalOpen(true);
    };

    const handleUpdateResult = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/results/${editingResult._id}`, {
                score: editingResult.score,
                totalMarks: editingResult.totalMarks,
                status: editingResult.status
            });
            alert('Result updated successfully');
            setIsResultModalOpen(false);
            setEditingResult(null);
            fetchData();
        } catch (error) {
            console.error(error);
            alert('Failed to update result');
        }
    };

    const handleAddQuestion = () => {
        if (!currentQuestion.questionText || currentQuestion.options.some(opt => !opt) || !currentQuestion.correctAnswer) {
            alert('Please fill all question fields and select a correct answer.');
            return;
        }

        if (editingIndex !== null) {
            // Update existing question
            const updatedQuestions = [...newExam.questions];
            updatedQuestions[editingIndex] = currentQuestion;
            setNewExam({ ...newExam, questions: updatedQuestions });
            setEditingIndex(null);
        } else {
            // Add new question
            setNewExam({
                ...newExam,
                questions: [...newExam.questions, currentQuestion]
            });
        }

        setCurrentQuestion({ questionText: '', options: ['', '', '', ''], correctAnswer: '', marks: 1 });
    };

    // ... (rest of functions like handleEditQuestion same as before) 

    const handleEditQuestion = (index) => {
        setCurrentQuestion(newExam.questions[index]);
        setEditingIndex(index);
    };

    const handleDeleteQuestion = (index) => {
        if (window.confirm("Delete this question?")) {
            const updatedQuestions = newExam.questions.filter((_, i) => i !== index);
            setNewExam({ ...newExam, questions: updatedQuestions });
            if (editingIndex === index) {
                setEditingIndex(null);
                setCurrentQuestion({ questionText: '', options: ['', '', '', ''], correctAnswer: '', marks: 1 });
            }
        }
    };

    const handleEditExam = (exam) => {
        setNewExam({
            title: exam.title,
            description: exam.description,
            duration: exam.duration,
            totalQuestions: exam.totalQuestions,
            category: exam.category,
            price: exam.price,
            questions: exam.questions || []
        });
        setEditingExamId(exam._id);
        setIsExamModalOpen(true);
    };

    const handleCreateExam = async (e) => {
        e.preventDefault();
        try {
            const payload = { ...newExam, totalQuestions: newExam.questions.length || newExam.totalQuestions };

            if (payload.questions.length === 0) {
                if (!window.confirm("No questions added. Save exam anyway?")) return;
            }

            if (editingExamId) {
                await api.put(`/exams/${editingExamId}`, payload);
                alert('Exam Updated Successfully!');
            } else {
                await api.post('/exams', payload);
                alert('Exam Created Successfully!');
            }

            setIsExamModalOpen(false);
            setNewExam({ title: '', description: '', duration: 60, price: 0, category: 'Certification', questions: [] });
            setEditingExamId(null);
            fetchData();
        } catch (error) {
            console.error(error);
            if (error.response && error.response.status === 403) {
                alert('Permission Denied: You must be an Admin to manage exams.');
            } else {
                alert(`Failed to ${editingExamId ? 'update' : 'create'} exam: ` + (error.response?.data?.message || error.message));
            }
        }
    };

    const handleToggleStatus = async (exam) => {
        try {
            await api.patch(`/exams/${exam._id}/status`);
            fetchData();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="min-h-screen bg-lh-dark text-white font-sans flex">
            {/* Sidebar */}
            <aside className="w-64 bg-black/40 border-r border-white/5 p-6 flex flex-col gap-2">
                <h2 className="text-xl font-black text-lh-purple mb-8 uppercase tracking-wider flex items-center gap-2">
                    <LayoutDashboard size={24} /> Admin_Panel
                </h2>

                <nav className="space-y-1">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'overview' ? 'bg-lh-purple text-white' : 'text-gray-400 hover:bg-white/5'}`}
                    >
                        <Activity size={16} /> Overview
                    </button>
                    <button
                        onClick={() => setActiveTab('exams')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'exams' ? 'bg-lh-purple text-white' : 'text-gray-400 hover:bg-white/5'}`}
                    >
                        <BookOpen size={16} /> Exam_Manager
                    </button>
                    <button
                        onClick={() => setActiveTab('results')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'results' ? 'bg-lh-purple text-white' : 'text-gray-400 hover:bg-white/5'}`}
                    >
                        <Users size={16} /> Student_Results
                    </button>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto">

                {/* Overview Tab */}
                {activeTab === 'overview' && (
                    <div className="space-y-8 animate-fade-in-up">
                        <h3 className="text-2xl font-black uppercase tracking-tighter">System Overview</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500">
                                        <BookOpen size={20} />
                                    </div>
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Exams</span>
                                </div>
                                <p className="text-4xl font-black text-white">{stats.totalExams}</p>
                            </div>
                            <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
                                        <Activity size={20} />
                                    </div>
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Attempts</span>
                                </div>
                                <p className="text-4xl font-black text-white">{stats.totalResults}</p>
                            </div>
                            <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-500">
                                        <Users size={20} />
                                    </div>
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Active Students</span>
                                </div>
                                <p className="text-4xl font-black text-white">{stats.distinctUsers}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Exams Tab */}
                {activeTab === 'exams' && (
                    <div className="space-y-6 animate-fade-in-up">
                        <div className="flex items-center justify-between">
                            <h3 className="text-2xl font-black uppercase tracking-tighter">Exam Management</h3>
                            <button
                                onClick={() => setIsExamModalOpen(true)}
                                className="px-6 py-2 bg-lh-purple hover:bg-purple-600 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2"
                            >
                                <Plus size={16} /> Create New
                            </button>
                        </div>

                        <div className="bg-black/20 border border-white/5 rounded-2xl overflow-hidden">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-white/5 border-b border-white/5 text-xs text-gray-400 uppercase tracking-widest">
                                        <th className="p-4">Exam Title</th>
                                        <th className="p-4">Duration</th>
                                        <th className="p-4">Questions</th>
                                        <th className="p-4">Status</th>
                                        <th className="p-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {exams.map(exam => (
                                        <tr key={exam._id} className="hover:bg-white/[0.02]">
                                            <td className="p-4 font-bold text-sm">{exam.title}</td>
                                            <td className="p-4 text-sm text-gray-400">{exam.duration} mins</td>
                                            <td className="p-4">
                                                <span className="px-2 py-1 bg-lh-purple/10 text-lh-purple rounded-full text-xs font-bold">
                                                    {exam.questions?.length || 0} Q
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <button
                                                    onClick={() => handleToggleStatus(exam)}
                                                    className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wide border ${exam.isActive ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}
                                                >
                                                    {exam.isActive ? 'Active' : 'Inactive'}
                                                </button>
                                            </td>
                                            <td className="p-4 text-right space-x-2">
                                                <button
                                                    onClick={() => handleDeleteExam(exam._id)}
                                                    className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleEditExam(exam)}
                                                    className="p-2 text-gray-500 hover:text-blue-500 transition-colors"
                                                >
                                                    <Edit size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'results' && (
                    <div className="space-y-6 animate-fade-in-up">
                        <div className="flex items-center justify-between">
                            <h3 className="text-2xl font-black uppercase tracking-tighter">Student Results</h3>

                            {/* Exam Filter Dropdown */}
                            <div className="relative">
                                <select
                                    className="bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-widest text-white outline-none focus:border-lh-purple appearance-none pr-8 cursor-pointer hover:bg-white/5 transition-all"
                                    value={selectedExamFilter}
                                    onChange={(e) => setSelectedExamFilter(e.target.value)}
                                >
                                    <option value="All">All Exams</option>
                                    {[...new Set(exams.map(e => e.title))].map(title => (
                                        <option key={title} value={title}>{title}</option>
                                    ))}
                                </select>
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                                </div>
                            </div>
                        </div>

                        <div className="bg-black/20 border border-white/5 rounded-2xl overflow-hidden">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-white/5 border-b border-white/5 text-xs text-gray-400 uppercase tracking-widest">
                                        <th className="p-4">Student</th>
                                        <th className="p-4">Exam</th>
                                        <th className="p-4">Score</th>
                                        <th className="p-4">Status</th>
                                        <th className="p-4">Date</th>
                                        <th className="p-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {results
                                        .filter(result => selectedExamFilter === 'All' || (result.examTitle || result.exam?.title) === selectedExamFilter)
                                        .sort((a, b) => b.score - a.score)
                                        .map((result, idx) => (
                                            <tr key={idx} className="hover:bg-white/[0.02]">
                                                <td className="p-4">
                                                    <div className="font-bold text-sm text-white">
                                                        {result.user ? `${result.user.firstName || ''} ${result.user.lastName || ''}`.trim() || 'Unknown' : 'Unknown'}
                                                    </div>
                                                    <div className="text-xs text-gray-500">{result.user?.email}</div>
                                                </td>
                                                <td className="p-4 text-sm text-gray-400">{result.examTitle || result.exam?.title}</td>
                                                <td className="p-4 text-sm font-mono text-lh-purple">{result.score} / {result.totalMarks}</td>
                                                <td className="p-4">
                                                    <span className={`px-2 py-1 rounded text-[10px] font-black uppercase ${result.status === 'Pass' ? 'text-green-500' : 'text-red-500'}`}>
                                                        {result.status}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-xs text-gray-500">
                                                    {new Date(result.createdAt).toLocaleDateString()}
                                                </td>
                                                <td className="p-4 text-right space-x-2">
                                                    <button
                                                        onClick={() => handleDeleteResult(result._id)}
                                                        className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleEditResultInit(result)}
                                                        className="p-2 text-gray-500 hover:text-blue-500 transition-colors"
                                                    >
                                                        <Edit size={16} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Edit Result Modal */}
                {isResultModalOpen && editingResult && (
                    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center backdrop-blur-sm p-4">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-[#111] p-6 rounded-2xl border border-white/5 w-full max-w-md space-y-6"
                        >
                            <div className="flex justify-between items-center pb-4 border-b border-white/5">
                                <h3 className="text-lg font-black uppercase tracking-tight text-white">Edit Result</h3>
                                <button onClick={() => setIsResultModalOpen(false)} className="text-gray-500 hover:text-white"><X size={20} /></button>
                            </div>
                            <form onSubmit={handleUpdateResult} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Score Obtained</label>
                                    <input
                                        type="number"
                                        className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-white outline-none focus:border-lh-purple"
                                        value={editingResult.score}
                                        onChange={e => setEditingResult({ ...editingResult, score: parseInt(e.target.value) })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Total Marks</label>
                                    <input
                                        type="number"
                                        className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-white outline-none focus:border-lh-purple"
                                        value={editingResult.totalMarks}
                                        onChange={e => setEditingResult({ ...editingResult, totalMarks: parseInt(e.target.value) })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Status</label>
                                    <select
                                        className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-white outline-none focus:border-lh-purple"
                                        value={editingResult.status}
                                        onChange={e => setEditingResult({ ...editingResult, status: e.target.value })}
                                    >
                                        <option value="Pass">Pass</option>
                                        <option value="Fail">Fail</option>
                                    </select>
                                </div>
                                <button type="submit" className="w-full py-3 bg-lh-purple hover:bg-purple-600 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all">
                                    Update Result
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}

                {/* Create Exam Modal */}
                {isExamModalOpen && (
                    <div className="fixed inset-0 z-50 bg-[#0a0a0a] overflow-y-auto custom-scrollbar">
                        <div className="w-full min-h-screen p-8 max-w-5xl mx-auto space-y-6">
                            <div className="flex justify-between items-center sticky top-0 bg-[#0a0a0a] z-10 pb-4 border-b border-white/5 pt-4">
                                <h3 className="text-xl font-black uppercase tracking-tight">{editingExamId ? 'Edit Exam' : 'Create New Exam'}</h3>
                                <button onClick={() => { setIsExamModalOpen(false); setEditingExamId(null); setNewExam({ title: '', description: '', duration: 60, price: 0, category: 'Certification', questions: [] }); }} className="text-gray-500 hover:text-white"><X size={20} /></button>
                            </div>

                            <form onSubmit={handleCreateExam} className="h-full">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">

                                    {/* Left Column: Exam Details */}
                                    <div className="space-y-6">
                                        <div className="bg-[#1a1a1a] p-6 rounded-2xl border border-white/5 space-y-4">
                                            <h4 className="text-sm font-black uppercase tracking-widest text-gray-400 border-b border-white/5 pb-2 mb-4">Exam Details</h4>

                                            <div>
                                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Title</label>
                                                <input
                                                    type="text"
                                                    className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-sm text-white focus:border-lh-purple focus:ring-1 focus:ring-lh-purple outline-none transition-all placeholder:text-gray-700"
                                                    placeholder="e.g. Advanced React Certification"
                                                    value={newExam.title}
                                                    onChange={e => setNewExam({ ...newExam, title: e.target.value })}
                                                    required
                                                />
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Duration (min)</label>
                                                    <input
                                                        type="number"
                                                        className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-sm text-white focus:border-lh-purple focus:ring-1 focus:ring-lh-purple outline-none transition-all placeholder:text-gray-700"
                                                        value={newExam.duration}
                                                        onChange={e => setNewExam({ ...newExam, duration: parseInt(e.target.value) })}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Price ($)</label>
                                                    <input
                                                        type="number"
                                                        className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-sm text-white focus:border-lh-purple focus:ring-1 focus:ring-lh-purple outline-none transition-all placeholder:text-gray-700"
                                                        value={newExam.price}
                                                        onChange={e => setNewExam({ ...newExam, price: parseInt(e.target.value) })}
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Description</label>
                                                <textarea
                                                    className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-sm text-white focus:border-lh-purple focus:ring-1 focus:ring-lh-purple outline-none transition-all h-32 resize-none placeholder:text-gray-700"
                                                    placeholder="Describe the exam content and objectives..."
                                                    value={newExam.description}
                                                    onChange={e => setNewExam({ ...newExam, description: e.target.value })}
                                                />
                                            </div>
                                        </div>

                                        <button type="submit" className="w-full py-4 bg-lh-purple rounded-xl text-sm font-black uppercase tracking-widest hover:bg-purple-600 transition-all shadow-lg shadow-purple-900/20 active:scale-95">
                                            {editingExamId ? 'Save Changes' : 'Create Exam'}
                                        </button>
                                    </div>

                                    {/* Right Column: Question Manager */}
                                    <div className="space-y-6 h-full flex flex-col">
                                        <div className="bg-[#1a1a1a] p-6 rounded-2xl border border-white/5 flex-1 flex flex-col">
                                            <div className="flex justify-between items-center border-b border-white/5 pb-4 mb-4">
                                                <h4 className="text-sm font-black uppercase tracking-widest text-lh-purple">Question Manager</h4>
                                                <span className="px-3 py-1 bg-white/5 rounded-full text-xs font-bold text-gray-400">{newExam.questions.length} Questions</span>
                                            </div>

                                            <div className="space-y-4 mb-6">
                                                <textarea
                                                    placeholder="Type your question here..."
                                                    className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-sm text-white focus:border-lh-purple focus:ring-1 focus:ring-lh-purple outline-none transition-all h-24 resize-none placeholder:text-gray-700"
                                                    value={currentQuestion.questionText}
                                                    onChange={e => setCurrentQuestion({ ...currentQuestion, questionText: e.target.value })}
                                                />

                                                <div className="grid grid-cols-2 gap-3">
                                                    {currentQuestion.options.map((opt, idx) => (
                                                        <div key={idx} className="relative group">
                                                            <span className="absolute left-3 top-3 text-[10px] font-black text-gray-600 uppercase">Opt {idx + 1}</span>
                                                            <input
                                                                type="text"
                                                                className={`w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-xs text-white focus:border-lh-purple outline-none transition-all ${currentQuestion.correctAnswer === opt && opt !== '' ? 'border-green-500/50 bg-green-500/10' : ''}`}
                                                                value={opt}
                                                                onChange={e => {
                                                                    const newOptions = [...currentQuestion.options];
                                                                    newOptions[idx] = e.target.value;
                                                                    setCurrentQuestion({ ...currentQuestion, options: newOptions });
                                                                }}
                                                            />
                                                        </div>
                                                    ))}
                                                </div>

                                                <div className="flex gap-3">
                                                    <select
                                                        className="flex-1 bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-lh-purple outline-none appearance-none cursor-pointer min-w-0"
                                                        value={currentQuestion.correctAnswer}
                                                        onChange={e => setCurrentQuestion({ ...currentQuestion, correctAnswer: e.target.value })}
                                                    >
                                                        <option value="">Select Correct Answer</option>
                                                        {currentQuestion.options.map((opt, idx) => (
                                                            opt && <option key={idx} value={opt}>{opt}</option>
                                                        ))}
                                                    </select>
                                                    <button
                                                        type="button"
                                                        onClick={handleAddQuestion}
                                                        className={`px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg active:scale-95 shrink-0 ${editingIndex !== null ? 'bg-yellow-500 text-black hover:bg-yellow-400' : 'bg-white text-black hover:bg-gray-200'}`}
                                                    >
                                                        {editingIndex !== null ? 'Update' : 'Add'}
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Questions List */}
                                            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-2 min-h-[300px]">
                                                {newExam.questions.length === 0 ? (
                                                    <div className="flex flex-col items-center justify-center h-full text-gray-600 gap-2 opacity-50">
                                                        <FileText size={48} />
                                                        <span className="text-xs font-bold uppercase tracking-widest">No Questions Added</span>
                                                    </div>
                                                ) : (
                                                    newExam.questions.map((q, idx) => (
                                                        <div key={idx} className={`p-4 rounded-xl border transition-all group hover:bg-white/5 ${editingIndex === idx ? 'bg-yellow-500/5 border-yellow-500/30' : 'bg-black/20 border-white/5'}`}>
                                                            <div className="flex justify-between items-start gap-4">
                                                                <div>
                                                                    <div className="flex items-center gap-2 mb-1">
                                                                        <span className="px-2 py-0.5 bg-white/10 rounded text-[10px] font-black text-white/50">Q{idx + 1}</span>
                                                                        <span className="text-sm font-bold text-gray-300 line-clamp-2">{q.questionText}</span>
                                                                    </div>
                                                                    <div className="text-xs text-green-500/70 font-mono mt-2 pl-8 flex items-center gap-2">
                                                                        <Check size={12} /> {q.correctAnswer}
                                                                    </div>
                                                                </div>
                                                                <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handleEditQuestion(idx)}
                                                                        className="p-2 bg-yellow-500/10 text-yellow-500 rounded hover:bg-yellow-500/20 transition-all"
                                                                    >
                                                                        <Edit size={14} />
                                                                    </button>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handleDeleteQuestion(idx)}
                                                                        className="p-2 bg-red-500/10 text-red-500 rounded hover:bg-red-500/20 transition-all"
                                                                    >
                                                                        <Trash2 size={14} />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

            </main>
        </div>
    );
};

export default AdminDashboard;
