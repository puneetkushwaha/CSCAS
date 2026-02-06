import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2, Edit, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const ExamControl = () => {
    const [exams, setExams] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { token } = useAuth(); // Assuming token is exposed in AuthContext, if not need to get from localStorage

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        duration: 60,
        totalQuestions: 0,
        category: '',
        price: 0,
        questions: []
    });

    useEffect(() => {
        fetchExams();
    }, []);

    const fetchExams = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/exams');
            setExams(res.data);
        } catch (err) {
            console.error("Error fetching exams", err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure?')) return;
        try {
            await axios.delete(`http://localhost:5000/api/exams/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchExams();
        } catch (err) {
            console.error("Error deleting exam", err);
            alert("Failed to delete exam");
        }
    };

    const handleToggleStatus = async (id) => {
        try {
            await axios.patch(`http://localhost:5000/api/exams/${id}/status`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchExams();
        } catch (err) {
            console.error("Error toggling status", err);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/exams', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setIsModalOpen(false);
            fetchExams();
            setFormData({
                title: '',
                description: '',
                duration: 60,
                totalQuestions: 0,
                category: '',
                price: 0,
                questions: []
            });
        } catch (err) {
            console.error("Error creating exam", err);
            alert("Failed to create exam");
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black uppercase tracking-tight text-white mb-2">Exam Control</h1>
                    <p className="text-gray-500 text-sm">Manage certifications and exams.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold text-xs uppercase tracking-wider transition-colors"
                >
                    <Plus size={16} /> Create New Exam
                </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {exams.map((exam) => (
                    <div key={exam._id} className="bg-[#0a0a0a]/60 border border-white/5 p-4 rounded-xl flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                        <div>
                            <div className="flex items-center gap-3">
                                <h3 className="text-white font-bold">{exam.title}</h3>
                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider ${exam.isActive ? 'bg-green-500/20 text-green-500' : 'bg-gray-500/20 text-gray-500'}`}>
                                    {exam.isActive ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                            <p className="text-gray-500 text-xs mt-1">{exam.description || 'No description'}</p>
                            <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                                <span>{exam.questions.length} Questions</span>
                                <span>{exam.duration} Mins</span>
                                <span>${exam.price}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => handleToggleStatus(exam._id)}
                                title={exam.isActive ? "Deactivate" : "Activate"}
                                className={`p-2 rounded-lg transition-colors ${exam.isActive ? 'text-green-500 hover:bg-green-500/10' : 'text-gray-500 hover:bg-gray-500/10'}`}
                            >
                                {exam.isActive ? <CheckCircle size={18} /> : <XCircle size={18} />}
                            </button>
                            {/* Edit implementation skipped for brevity */}
                            <button className="p-2 text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors">
                                <Edit size={18} />
                            </button>
                            <button
                                onClick={() => handleDelete(exam._id)}
                                className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Simple Modal for Creation */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="bg-[#0f0f0f] border border-white/10 p-6 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-bold text-white mb-4">Create New Exam</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Title</label>
                                <input
                                    type="text"
                                    className="w-full bg-black/50 border border-white/10 rounded-lg p-2 text-white focus:outline-none focus:border-red-500"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description</label>
                                <textarea
                                    className="w-full bg-black/50 border border-white/10 rounded-lg p-2 text-white focus:outline-none focus:border-red-500"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Duration (min)</label>
                                    <input
                                        type="number"
                                        className="w-full bg-black/50 border border-white/10 rounded-lg p-2 text-white focus:outline-none focus:border-red-500"
                                        value={formData.duration}
                                        onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Price ($)</label>
                                    <input
                                        type="number"
                                        className="w-full bg-black/50 border border-white/10 rounded-lg p-2 text-white focus:outline-none focus:border-red-500"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Category</label>
                                <input
                                    type="text"
                                    className="w-full bg-black/50 border border-white/10 rounded-lg p-2 text-white focus:outline-none focus:border-red-500"
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Total Questions (Placeholder)</label>
                                <input
                                    type="number"
                                    className="w-full bg-black/50 border border-white/10 rounded-lg p-2 text-white focus:outline-none focus:border-red-500"
                                    value={formData.totalQuestions}
                                    onChange={(e) => setFormData({ ...formData, totalQuestions: Number(e.target.value) })}
                                    required
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 py-2 rounded-lg border border-white/10 text-gray-400 hover:bg-white/5"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold"
                                >
                                    Create Exam
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExamControl;
