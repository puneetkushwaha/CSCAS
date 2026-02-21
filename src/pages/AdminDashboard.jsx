import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users, BookOpen, Activity, Play, Plus, Trash2, Edit, Search,
    BarChart2, Save, X, Check, AlertCircle, LayoutDashboard, FileText,
    TrendingUp, Shield, Zap, MoreVertical, LogOut, Home,
    AlertTriangle, Code, MessageSquare, Mic, MicOff, Phone,
    Monitor, ShieldAlert, Power, Camera, Clock, CheckCircle2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { io } from 'socket.io-client';
import ChatWidget from '../components/ChatWidget';
import { useAuth } from '../context/AuthContext';

const ProctorView = ({ examId }) => {
    const { user: currentUser } = useAuth();
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [socket, setSocket] = useState(null);
    const [noiseAlerts, setNoiseAlerts] = useState({}); // { userId: level }
    const [activeChat, setActiveChat] = useState(null); // { examId, userId, userName }

    // --- Voice & Video State ---
    const [activeVoice, setActiveVoice] = useState(null); // userId
    const [remoteStreams, setRemoteStreams] = useState({}); // { userId: MediaStream }
    const [remoteScreenStreams, setRemoteScreenStreams] = useState({}); // { userId: MediaStream }
    const pc = useRef({});
    const screenPc = useRef({}); // Store PeerConnections per user: { userId: pc }
    const localStream = useRef(null);
    const [proctorMicStream, setProctorMicStream] = useState(null);
    useEffect(() => {
        const newSocket = io(); // Use relative path for proxy support
        setSocket(newSocket);

        newSocket.on('noise_alert', ({ level, room }) => {
            const parts = room.split('_');
            const userId = parts[1];
            setNoiseAlerts(prev => ({ ...prev, [userId]: level }));
            // Clear alert after 5 seconds
            setTimeout(() => {
                setNoiseAlerts(prev => {
                    const next = { ...prev };
                    delete next[userId];
                    return next;
                });
            }, 5000);
        });

        newSocket.on('webrtc-signal', async ({ signal, type, userId: signalUserId, room }) => {
            if (!signalUserId) return;

            const setupPeer = async (id) => {
                const peer = new RTCPeerConnection({
                    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
                });
                pc.current[id] = peer;

                peer.onicecandidate = (event) => {
                    if (event.candidate) {
                        newSocket.emit('webrtc-signal', { room, userId: currentUser?.id || currentUser?._id, signal: event.candidate, type: 'candidate' });
                    }
                };

                peer.ontrack = (event) => {
                    setRemoteStreams(prev => ({
                        ...prev,
                        [id]: event.streams[0]
                    }));
                };
                return peer;
            };

            if (type === 'offer') {
                const peer = await setupPeer(signalUserId);
                await peer.setRemoteDescription(new RTCSessionDescription(signal));
                const answer = await peer.createAnswer();
                await peer.setLocalDescription(answer);
                newSocket.emit('webrtc-signal', {
                    room,
                    userId: currentUser?.id || currentUser?._id,
                    signal: answer,
                    type: 'answer'
                });
            } else if (pc.current[signalUserId]) {
                const peer = pc.current[signalUserId];
                if (type === 'answer') {
                    await peer.setRemoteDescription(new RTCSessionDescription(signal));
                } else if (type === 'candidate') {
                    await peer.addIceCandidate(new RTCIceCandidate(signal));
                }
            }
        });

        newSocket.on('webrtc-screen-signal', async ({ signal, type, userId: signalUserId, room }) => {
            if (!signalUserId) return;

            const setupScreenPeer = async (id) => {
                const peer = new RTCPeerConnection({
                    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
                });
                screenPc.current[id] = peer;

                peer.onicecandidate = (event) => {
                    if (event.candidate) {
                        newSocket.emit('webrtc-screen-signal', { room, userId: currentUser?.id || currentUser?._id, signal: event.candidate, type: 'candidate' });
                    }
                };

                peer.ontrack = (event) => {
                    setRemoteScreenStreams(prev => ({
                        ...prev,
                        [id]: event.streams[0]
                    }));
                };
                return peer;
            };

            if (type === 'offer') {
                const peer = await setupScreenPeer(signalUserId);
                await peer.setRemoteDescription(new RTCSessionDescription(signal));
                const answer = await peer.createAnswer();
                await peer.setLocalDescription(answer);
                newSocket.emit('webrtc-screen-signal', {
                    room,
                    userId: currentUser?.id || currentUser?._id,
                    signal: answer,
                    type: 'answer'
                });
            } else if (screenPc.current[signalUserId]) {
                const peer = screenPc.current[signalUserId];
                if (type === 'answer') {
                    await peer.setRemoteDescription(new RTCSessionDescription(signal));
                } else if (type === 'candidate') {
                    await peer.addIceCandidate(new RTCIceCandidate(signal));
                }
            }
        });

        return () => {
            newSocket.disconnect();
            Object.values(pc.current).forEach(p => p.close());
            Object.values(screenPc.current).forEach(p => p.close());
            localStream.current?.getTracks().forEach(track => track.stop());
        };
    }, [currentUser]);

    useEffect(() => {
        if (socket && sessions.length > 0) {
            sessions.forEach(session => {
                if (session.examId && session.userId?._id && session.attemptId) {
                    const room = `${session.examId}_${session.userId._id}_${session.attemptId}`;
                    socket.emit('join_session', {
                        examId: session.examId,
                        userId: session.userId._id,
                        attemptId: session.attemptId
                    });
                    // Automatically request live feed when joining
                    socket.emit('request_live_feed', { room });
                }
            });
        }
    }, [socket, sessions]);

    useEffect(() => {
        let interval;
        const fetchSessions = async () => {
            try {
                const res = await api.get(`/proctor/exam/${examId}`);
                setSessions(res.data);
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch proctor sessions", error);
            }
        };

        fetchSessions();
        interval = setInterval(fetchSessions, 5000); // Poll every 5 seconds

        return () => clearInterval(interval);
    }, [examId]);

    const handleVerifyID = async (sessionId, status) => {
        try {
            await api.patch('/proctor/verify-id', { sessionId, status });
            // Optionally update local state to show change immediately
            setSessions(prev => prev.map(s => s._id === sessionId ? { ...s, verificationStatus: status } : s));
            alert(`Student ID ${status} successfully.`);
        } catch (error) {
            console.error("Verification error:", error);
            alert("Failed to update verification status. Please try again.");
        }
    };

    const handleStartVoice = async (sessionId, userId, examId, attemptId) => {
        try {
            const room = `${examId}_${userId}_${attemptId}`;
            const peer = pc.current[userId];

            if (!peer) {
                alert("Please connect the video feed first.");
                return;
            }

            if (activeVoice === userId) {
                // Stop proctor voice (send nothing to student)
                const senders = peer.getSenders();
                const audioSender = senders.find(s => s.track?.kind === 'audio');
                if (audioSender) {
                    peer.removeTrack(audioSender);
                    // Re-negotiate
                    const offer = await peer.createOffer();
                    await peer.setLocalDescription(offer);
                    socket.emit('webrtc-signal', { room, signal: offer, type: 'offer', userId: currentUser?.id || currentUser?._id });
                }
                setActiveVoice(null);
                return;
            }

            // Start proctor voice (send mic to student)
            let micStream = proctorMicStream;
            if (!micStream) {
                micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
                setProctorMicStream(micStream);
            }

            // Remove any existing audio tracks first to avoid duplicates
            const existingSenders = peer.getSenders();
            const oldAudioSender = existingSenders.find(s => s.track?.kind === 'audio');
            if (oldAudioSender) peer.removeTrack(oldAudioSender);

            micStream.getAudioTracks().forEach(track => {
                peer.addTrack(track, micStream);
            });

            // Re-negotiate
            const offer = await peer.createOffer();
            await peer.setLocalDescription(offer);
            socket.emit('webrtc-signal', { room, signal: offer, type: 'offer', userId: currentUser?.id || currentUser?._id });

            setActiveVoice(userId);

        } catch (error) {
            console.error("Voice communication error", error);
            alert("Could not start voice communication. Please check microphone permissions.");
        }
    };

    const handleSendWarning = (userId, examId, attemptId) => {
        const message = prompt("Enter warning message:", "Please stay in front of the camera.");
        if (message) {
            const room = `${examId}_${userId}_${attemptId}`;
            console.log(`[Socket] Sending warning to room ${room}: ${message}`);
            socket.emit('send_warning', { room, message });
        }
    };

    const handleRequestVideo = (userId, examId, attemptId) => {
        const room = `${examId}_${userId}_${attemptId}`;
        console.log(`[Socket] Requesting live feed for room ${room}`);
        socket?.emit('request_live_feed', { room });
    };

    const handleDisqualify = (userId, examId, attemptId) => {
        if (window.confirm("Are you sure you want to DISQUALIFY this student? This will end their exam immediately.")) {
            const room = `${examId}_${userId}_${attemptId}`;
            console.log(`[Socket] Disqualifying student in room ${room}`);
            socket.emit('disqualify_student', { room, reason: "Manual disqualification by proctor" });
        }
    };

    if (loading) return <div className="text-white">Loading streams...</div>;

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {sessions.map(session => (
                    <div key={session._id} className="bg-black/40 border border-white/10 rounded-2xl overflow-hidden group hover:border-lh-purple/50 transition-all flex flex-col">
                        <div className="relative aspect-video bg-black">
                            {remoteStreams[session.userId?._id] ? (
                                <video
                                    autoPlay
                                    muted={activeVoice !== session.userId?._id}
                                    ref={el => {
                                        if (el && remoteStreams[session.userId?._id]) {
                                            el.srcObject = remoteStreams[session.userId?._id];
                                        }
                                    }}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <img
                                    src={session.lastSnapshot}
                                    alt="Student Feed"
                                    crossOrigin="anonymous"
                                    referrerPolicy="no-referrer"
                                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                                />
                            )}
                            <div className="absolute top-2 left-2 bg-lh-purple px-2 py-0.5 rounded text-[8px] font-black text-white uppercase tracking-widest">
                                Camera
                            </div>
                            {noiseAlerts[session.userId?._id] && (
                                <div className="absolute top-2 right-2 bg-amber-500 px-2 py-0.5 rounded text-[8px] font-black text-white uppercase tracking-widest animate-pulse flex items-center gap-1">
                                    <Mic size={10} /> NOISE: {noiseAlerts[session.userId?._id]}
                                </div>
                            )}
                        </div>

                        {/* Screen Feed Section */}
                        <div className="relative aspect-video bg-black border-t border-white/5">
                            {remoteScreenStreams[session.userId?._id] ? (
                                <video
                                    autoPlay
                                    playsInline
                                    ref={el => {
                                        if (el && remoteScreenStreams[session.userId?._id]) {
                                            el.srcObject = remoteScreenStreams[session.userId?._id];
                                        }
                                    }}
                                    className="w-full h-full object-contain"
                                />
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center text-gray-700 bg-white/[0.02]">
                                    <Monitor size={24} className="mb-2 opacity-10" />
                                    <span className="text-[8px] font-black uppercase tracking-widest opacity-20 text-center px-4">Waiting for screen...</span>
                                </div>
                            )}
                            <div className="absolute top-2 left-2 bg-blue-500 px-2 py-0.5 rounded text-[8px] font-black text-white uppercase tracking-widest">
                                Desktop
                            </div>
                        </div>

                        {/* ID Verification Section */}
                        {session.idSnapshot && (
                            <div className="p-2 bg-white/5 border-b border-white/5">
                                <div className="flex justify-between items-center mb-2 px-1">
                                    <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest">KYC Verification</span>
                                    <span className={`text-[8px] font-black uppercase tracking-widest ${session.verificationStatus === 'verified' ? 'text-emerald-500' :
                                        session.verificationStatus === 'rejected' ? 'text-rose-500' : 'text-amber-500 animate-pulse'
                                        }`}>
                                        {session.verificationStatus}
                                    </span>
                                </div>
                                {session.kycData && (
                                    <div className="mb-2 px-1 space-y-1">
                                        <p className="text-[10px] font-bold text-white">{session.kycData.fullName}</p>
                                        <div className="flex justify-between">
                                            <span className="text-[8px] font-bold text-lh-purple uppercase">{session.kycData.idType}</span>
                                            <span className="text-[8px] font-mono text-gray-400">{session.kycData.idNumber}</span>
                                        </div>
                                    </div>
                                )}
                                <div className="relative aspect-[4/3] rounded-lg overflow-hidden border border-white/10 mb-2">
                                    <img
                                        src={session.idSnapshot}
                                        crossOrigin="anonymous"
                                        referrerPolicy="no-referrer"
                                        className="w-full h-full object-cover"
                                        alt="ID Card"
                                    />
                                </div>
                                {session.verificationStatus === 'pending' && (
                                    <div className="grid grid-cols-2 gap-2">
                                        <button
                                            onClick={() => handleVerifyID(session._id, 'verified')}
                                            className="py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[8px] font-black uppercase tracking-widest hover:bg-emerald-500 transition-all hover:text-white rounded-md"
                                        >
                                            Verify
                                        </button>
                                        <button
                                            onClick={() => handleVerifyID(session._id, 'rejected')}
                                            className="py-1.5 bg-rose-500/10 border border-rose-500/20 text-rose-500 text-[8px] font-black uppercase tracking-widest hover:bg-rose-500 transition-all hover:text-white rounded-md"
                                        >
                                            Reject
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="p-4 flex-1">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-8 h-8 rounded-full bg-lh-purple flex items-center justify-center text-[10px] font-black text-white">
                                    {session.userId?.firstName?.[0] || 'U'}
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-white">{session.userId?.firstName} {session.userId?.lastName}</h4>
                                    <p className="text-[9px] text-gray-500 font-mono">{session.userId?.email}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2 mb-2">
                                <button
                                    onClick={() => {
                                        setActiveChat({
                                            examId: session.examId,
                                            userId: session.userId?._id,
                                            userName: session.userId?.firstName,
                                            attemptId: session.attemptId
                                        });
                                        socket?.emit('join_session', { examId: session.examId, userId: session.userId?._id, attemptId: session.attemptId });
                                    }}
                                    className="py-2 bg-white/5 border border-white/10 text-white rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-lh-purple hover:border-lh-purple transition-all flex items-center justify-center gap-2"
                                >
                                    <MessageSquare size={12} /> Chat
                                </button>
                                {!remoteStreams[session.userId?._id] ? (
                                    <button
                                        onClick={() => handleRequestVideo(session.userId?._id, session.examId, session.attemptId)}
                                        className="py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-emerald-500 transition-all hover:text-white flex items-center justify-center gap-2"
                                    >
                                        <Camera size={12} /> Connect Feed
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => handleStartVoice(session._id, session.userId?._id, session.examId, session.attemptId)}
                                        className={`py-2 border rounded-lg text-[9px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${activeVoice === session.userId?._id
                                            ? 'bg-rose-500/10 border-rose-500/50 text-rose-500 animate-pulse'
                                            : 'bg-white/5 border-white/10 text-white hover:bg-emerald-500 hover:border-emerald-500'
                                            }`}
                                    >
                                        {activeVoice === session.userId?._id ? <MicOff size={12} /> : <Mic size={12} />}
                                        {activeVoice === session.userId?._id ? 'Stop' : 'Voice'}
                                    </button>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    onClick={() => handleSendWarning(session.userId?._id, session.examId, session.attemptId)}
                                    className="py-2 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-amber-500/20 transition-all flex items-center justify-center gap-2"
                                >
                                    <ShieldAlert size={12} /> Warning
                                </button>
                                <button
                                    onClick={() => handleDisqualify(session.userId?._id, session.examId, session.attemptId)}
                                    className="py-2 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-red-500/20 transition-all flex items-center justify-center gap-2"
                                >
                                    <Power size={12} /> Block
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
                {sessions.length === 0 && (
                    <div className="col-span-full h-40 flex items-center justify-center text-gray-500 text-xs font-bold uppercase tracking-widest border border-dashed border-white/10 rounded-2xl">
                        No active candidates found
                    </div>
                )}
            </div>

            {activeChat && (
                <ChatWidget
                    socket={socket}
                    room={`${activeChat.examId}_${activeChat.userId}_${activeChat.attemptId}`}
                    currentUser={currentUser}
                    role="proctor"
                />
            )}
        </div>
    );
};

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview'); // overview, exams, results
    const [stats, setStats] = useState({ totalExams: 0, totalResults: 0, distinctUsers: 0 });
    const [exams, setExams] = useState([]);
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);

    // Search State
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // Result Editing State
    const [editingResult, setEditingResult] = useState(null);
    const [isResultModalOpen, setIsResultModalOpen] = useState(false);
    const [selectedResultExamFilter, setSelectedResultExamFilter] = useState('All');
    const [selectedProctorExamFilter, setSelectedProctorExamFilter] = useState('All');

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
        if (window.confirm('jb: Are you sure you want to delete this exam?')) {
            try {
                await api.delete(`/exams/${id}`);
                fetchData();
            } catch (error) {
                alert('Failed to delete exam');
            }
        }
    };

    const handleDeleteResult = async (id) => {
        if (window.confirm('jb: Are you sure you want to delete this result? This cannot be undone.')) {
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
            alert('jb: Please fill all question fields and select a correct answer.');
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
                if (!window.confirm("jb: No questions added. Save exam anyway?")) return;
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

    const SX = {
        glass: "bg-white/[0.02] backdrop-blur-xl border border-white/10",
        glassHover: "hover:bg-white/[0.05] hover:border-lh-purple/30 transition-all duration-300",
        input: "w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-lh-purple focus:ring-1 focus:ring-lh-purple outline-none transition-all placeholder:text-gray-600 hover:bg-white/10",
        label: "block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1"
    };

    const handleToggleStatus = async (exam) => {
        try {
            await api.patch(`/exams/${exam._id}/status`);
            fetchData();
        } catch (error) {
            console.error(error);
        }
    };

    // Filter Logic
    const filteredExams = exams.filter(exam =>
        exam.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exam.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredResults = results.filter(result =>
        (result.user?.firstName?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (result.user?.email?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (result.examTitle?.toLowerCase() || '').includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#050505] text-white font-plus-jakarta flex relative overflow-hidden">
            {/* Background Effects */}
            <div className="fixed top-0 left-0 w-[500px] h-[500px] bg-lh-purple/10 blur-[150px] rounded-full pointer-events-none"></div>
            <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-blue-500/10 blur-[150px] rounded-full pointer-events-none"></div>

            {/* Sidebar */}
            <aside className={`w-72 ${SX.glass} border-r border-white/5 p-6 flex flex-col gap-2 z-20 h-screen sticky top-0`}>
                <div
                    onClick={() => navigate('/')}
                    className="mb-10 px-2 flex items-center gap-3 text-lh-purple cursor-pointer group"
                >
                    <Shield size={28} className="group-hover:drop-shadow-[0_0_10px_rgba(188,19,254,0.8)] transition-all" />
                    <div className="group-hover:translate-x-1 transition-transform">
                        <h2 className="text-xl font-[1000] uppercase tracking-wider leading-none">Command</h2>
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em] group-hover:text-white transition-colors">Center</span>
                    </div>
                </div>

                <nav className="space-y-2 flex-1">
                    {[
                        { id: 'overview', icon: Activity, label: 'Overview' },
                        { id: 'exams', icon: BookOpen, label: 'Exam_Manager' },
                        { id: 'results', icon: Users, label: 'Student_Results' },
                        { id: 'proctoring', icon: Shield, label: 'Live_Proctor' }
                    ].map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center gap-3 px-4 py-4 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all group ${activeTab === item.id
                                ? 'bg-gradient-to-r from-lh-purple to-purple-900 text-white shadow-[0_0_20px_rgba(188,19,254,0.3)]'
                                : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                        >
                            <item.icon size={18} className={`transition-transform group-hover:scale-110 ${activeTab === item.id ? 'text-white' : 'text-gray-500 group-hover:text-lh-purple'}`} />
                            {item.label}
                            {activeTab === item.id && (
                                <motion.div layoutId="sidebar-active" className="ml-auto w-1.5 h-1.5 rounded-full bg-white" />
                            )}
                        </button>
                    ))}
                </nav>

                <div className="mt-auto px-4 py-4 rounded-2xl bg-white/5 border border-white/5">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-lh-purple to-blue-600 flex items-center justify-center font-bold text-xs">
                            AD
                        </div>
                        <div>
                            <div className="text-xs font-bold text-white">Administrator</div>
                            <div className="text-[10px] text-gray-500 uppercase tracking-wider">Super User</div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto z-10 custom-scrollbar h-screen">
                <header className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-3xl font-[1000] uppercase tracking-tighter mb-1">
                            {activeTab === 'overview' && 'System Overview'}
                            {activeTab === 'exams' && 'Exam Management'}
                            {activeTab === 'results' && 'Student Performance'}
                            {activeTab === 'proctoring' && 'Live Proctoring'}
                        </h1>
                        <p className="text-gray-500 text-sm font-medium">Welcome back to the command center.</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className={`flex items-center transition-all duration-300 ${isSearchOpen ? 'w-64' : 'w-10'}`}>
                            <AnimatePresence>
                                {isSearchOpen && (
                                    <motion.input
                                        initial={{ width: 0, opacity: 0 }}
                                        animate={{ width: "100%", opacity: 1 }}
                                        exit={{ width: 0, opacity: 0 }}
                                        type="text"
                                        placeholder="Search system..."
                                        className="w-full bg-white/5 border border-white/10 rounded-full py-2.5 px-4 pr-12 text-xs text-white outline-none focus:border-lh-purple"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        autoFocus
                                    />
                                )}
                            </AnimatePresence>
                            <button
                                onClick={() => setIsSearchOpen(!isSearchOpen)}
                                className={`p-3 rounded-full ${isSearchOpen ? 'absolute right-0' : ''} ${SX.glass} hover:bg-white/10 text-gray-400 hover:text-white transition-all z-10`}
                            >
                                {isSearchOpen ? <X size={20} /> : <Search size={20} />}
                            </button>
                        </div>

                    </div>
                </header>

                <AnimatePresence mode="wait">
                    {/* Overview Tab */}
                    {activeTab === 'overview' && (
                        <motion.div
                            key="overview"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-8"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {[
                                    { label: 'Total Exams', value: stats.totalExams, icon: BookOpen, color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
                                    { label: 'Total Attempts', value: stats.totalResults, icon: Activity, color: 'text-green-500', bg: 'bg-green-500/10', border: 'border-green-500/20' },
                                    { label: 'Active Students', value: stats.distinctUsers, icon: Users, color: 'text-purple-500', bg: 'bg-purple-500/10', border: 'border-purple-500/20' }
                                ].map((stat, idx) => (
                                    <div key={idx} className={`relative overflow-hidden p-6 rounded-[24px] bg-white/[0.02] backdrop-blur-md border ${stat.border} group hover:-translate-y-1 transition-all duration-300 shadow-lg`}>
                                        <div className={`absolute -right-6 -top-6 w-32 h-32 rounded-full ${stat.bg} blur-3xl opacity-20 group-hover:opacity-40 transition-opacity`}></div>
                                        <div className="flex justify-between items-start mb-4 relative z-10">
                                            <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
                                                <stat.icon size={24} />
                                            </div>
                                            <span className="flex items-center gap-1 text-[10px] font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded-full">
                                                <TrendingUp size={12} /> +12%
                                            </span>
                                        </div>
                                        <div className="relative z-10">
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
                                            <p className="text-4xl font-[1000] text-white tracking-tight">{stat.value}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Placeholder for Chart/Activity Stream */}
                            <div className={`p-8 rounded-[32px] ${SX.glass} min-h-[300px] flex items-center justify-center flex-col gap-4 text-gray-500`}>
                                <BarChart2 size={48} className="opacity-20" />
                                <span className="text-xs font-bold uppercase tracking-widest opacity-50">Analytics Module Loading...</span>
                            </div>
                        </motion.div>
                    )}

                    {/* Exams Tab */}
                    {activeTab === 'exams' && (
                        <motion.div
                            key="exams"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-6"
                        >
                            <div className="flex justify-between items-center bg-white/[0.02] p-2 rounded-2xl border border-white/5">
                                <span className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                                    {filteredExams.length} Examination Records
                                </span>
                                <button
                                    onClick={() => setIsExamModalOpen(true)}
                                    className="px-6 py-3 bg-white text-black hover:bg-lh-purple hover:text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.1)] active:scale-95"
                                >
                                    <Plus size={16} /> Create Exam
                                </button>
                            </div>

                            <div className={`rounded-[32px] overflow-hidden ${SX.glass}`}>
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-white/[0.02] border-b border-white/5 text-[10px] text-gray-400 uppercase tracking-[0.2em]">
                                            <th className="p-6 font-bold">Exam Title</th>
                                            <th className="p-6 font-bold">Duration</th>
                                            <th className="p-6 font-bold">Questions</th>
                                            <th className="p-6 font-bold">Status</th>
                                            <th className="p-6 font-bold text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {filteredExams.map(exam => (
                                            <tr key={exam._id} className="hover:bg-white/[0.02] transition-colors group">
                                                <td className="p-6 font-bold text-sm text-white group-hover:text-lh-purple transition-colors">{exam.title}</td>
                                                <td className="p-6 text-sm text-gray-400 font-medium">{exam.duration} mins</td>
                                                <td className="p-6">
                                                    <span className="px-3 py-1 bg-white/5 border border-white/10 text-gray-300 rounded-full text-xs font-bold">
                                                        {exam.questions?.length || 0} Q
                                                    </span>
                                                </td>
                                                <td className="p-6">
                                                    <button
                                                        onClick={() => handleToggleStatus(exam)}
                                                        className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wide border transition-all ${exam.isActive
                                                            ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/20'
                                                            : 'bg-rose-500/10 text-rose-500 border-rose-500/20 hover:bg-rose-500/20'}`}
                                                    >
                                                        {exam.isActive ? 'Active' : 'Offline'}
                                                    </button>
                                                </td>
                                                <td className="p-6 text-right space-x-2">
                                                    <button onClick={() => handleDeleteExam(exam._id)} className="p-2 text-gray-500 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all"><Trash2 size={16} /></button>
                                                    <button onClick={() => handleEditExam(exam)} className="p-2 text-gray-500 hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition-all"><Edit size={16} /></button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    {filteredExams.length === 0 && (
                                        <tfoot>
                                            <tr>
                                                <td colSpan="5" className="p-12 text-center text-gray-500 text-sm font-medium">No results found for "{searchQuery}"</td>
                                            </tr>
                                        </tfoot>
                                    )}
                                </table>
                            </div>
                        </motion.div>
                    )}

                    {/* Results Tab */}
                    {activeTab === 'results' && (
                        <motion.div
                            key="results"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-6"
                        >
                            <div className="flex justify-between items-center bg-white/[0.02] p-2 rounded-2xl border border-white/5">
                                <h3 className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Performance Log</h3>
                                <div className="relative">
                                    <select
                                        className="bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-white outline-none focus:border-lh-purple appearance-none pr-10 cursor-pointer hover:bg-purpul/5 transition-all min-w-[200px]"
                                        value={selectedResultExamFilter}
                                        onChange={(e) => setSelectedResultExamFilter(e.target.value)}
                                    >
                                        <option value="All">All Exams</option>
                                        {[...new Set(exams.map(e => e.title))].map(title => (
                                            <option key={title} value={title}>{title}</option>
                                        ))}
                                    </select>
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                                    </div>
                                </div>
                            </div>

                            <div className={`rounded-[32px] overflow-hidden ${SX.glass}`}>
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-white/[0.02] border-b border-white/5 text-[10px] text-gray-400 uppercase tracking-[0.2em]">
                                            <th className="p-6 font-bold">Candidate</th>
                                            <th className="p-6 font-bold">Exam Module</th>
                                            <th className="p-6 font-bold">Score</th>
                                            <th className="p-6 font-bold">Outcome</th>
                                            <th className="p-6 font-bold">Date Logged</th>
                                            <th className="p-6 font-bold text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {filteredResults
                                            .filter(result => selectedResultExamFilter === 'All' || (result.examTitle || result.exam?.title) === selectedResultExamFilter)
                                            .sort((a, b) => b.score - a.score)
                                            .map((result, idx) => (
                                                <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                                                    <td className="p-6">
                                                        <div className="font-bold text-sm text-white flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-[10px] font-black text-gray-400">
                                                                {result.user?.firstName?.[0] || 'U'}
                                                            </div>
                                                            <div>
                                                                {result.user ? `${result.user.firstName || ''} ${result.user.lastName || ''}`.trim() || 'Unknown' : 'Unknown'}
                                                                <div className="text-[10px] text-gray-500 font-normal lowercase">{result.user?.email}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="p-6 text-sm text-gray-400 font-medium">{result.examTitle || result.exam?.title}</td>
                                                    <td className="p-6">
                                                        <span className="font-mono text-lh-purple font-bold">{result.score}</span>
                                                        <span className="text-gray-600 text-xs"> / {result.totalMarks}</span>
                                                    </td>
                                                    <td className="p-6">
                                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wide border ${result.status === 'Pass' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border-rose-500/20'}`}>
                                                            {result.status}
                                                        </span>
                                                    </td>
                                                    <td className="p-6 text-xs text-gray-500 font-mono">
                                                        {new Date(result.createdAt).toLocaleDateString()}
                                                    </td>
                                                    <td className="p-6 text-right space-x-2">
                                                        <button onClick={() => handleDeleteResult(result._id)} className="p-2 text-gray-500 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all"><Trash2 size={16} /></button>
                                                        <button onClick={() => handleEditResultInit(result)} className="p-2 text-gray-500 hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition-all"><Edit size={16} /></button>
                                                    </td>
                                                </tr>
                                            ))}
                                    </tbody>
                                </table>
                            </div>
                        </motion.div>
                    )}

                    {/* Proctoring Tab */}
                    {activeTab === 'proctoring' && (
                        <motion.div
                            key="proctoring"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-6"
                        >
                            <div className="flex justify-between items-center bg-white/[0.02] p-2 rounded-2xl border border-white/5">
                                <h3 className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Live Monitoring</h3>
                                <div className="relative">
                                    <select
                                        className="bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-white outline-none focus:border-lh-purple appearance-none pr-10 cursor-pointer hover:bg-purpul/5 transition-all min-w-[200px]"
                                        value={selectedProctorExamFilter}
                                        onChange={(e) => setSelectedProctorExamFilter(e.target.value)}
                                    >
                                        <option value="All">Select Exam to Monitor</option>
                                        {exams.map(e => (
                                            <option key={e._id} value={e._id}>{e.title}</option>
                                        ))}
                                    </select>
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                                    </div>
                                </div>
                            </div>

                            {selectedProctorExamFilter !== 'All' ? (
                                <ProctorView examId={selectedProctorExamFilter} />
                            ) : (
                                <div className="flex flex-col items-center justify-center p-12 text-gray-500 gap-4 min-h-[400px]">
                                    <Shield size={48} className="opacity-20 animate-pulse" />
                                    <p className="text-xs font-bold uppercase tracking-widest">Select an exam to start monitoring</p>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Edit Result Modal */}
                <AnimatePresence>
                    {isResultModalOpen && editingResult && (
                        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center backdrop-blur-md p-4">
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                className={`bg-[#0a0a0a] p-8 rounded-[32px] border border-white/10 w-full max-w-md space-y-6 shadow-[0_0_50px_rgba(0,0,0,0.8)] relative overflow-hidden`}
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-lh-purple/10 blur-[50px] rounded-full pointer-events-none"></div>

                                <div className="flex justify-between items-center pb-6 border-b border-white/5">
                                    <h3 className="text-lg font-[1000] uppercase tracking-tight text-white flex items-center gap-2">
                                        <Edit size={18} className="text-lh-purple" /> Edit Result
                                    </h3>
                                    <button onClick={() => setIsResultModalOpen(false)} className="text-gray-500 hover:text-white transition-colors"><X size={20} /></button>
                                </div>

                                <form onSubmit={handleUpdateResult} className="space-y-4">
                                    {[
                                        { label: 'Score Obtained', key: 'score', type: 'number' },
                                        { label: 'Total Marks', key: 'totalMarks', type: 'number' }
                                    ].map(field => (
                                        <div key={field.key}>
                                            <label className={SX.label}>{field.label}</label>
                                            <input
                                                type={field.type}
                                                className={SX.input}
                                                value={editingResult[field.key]}
                                                onChange={e => setEditingResult({ ...editingResult, [field.key]: parseInt(e.target.value) })}
                                            />
                                        </div>
                                    ))}

                                    <div>
                                        <label className={SX.label}>Status</label>
                                        <select
                                            className={SX.input}
                                            value={editingResult.status}
                                            onChange={e => setEditingResult({ ...editingResult, status: e.target.value })}
                                        >
                                            <option value="Pass">Pass</option>
                                            <option value="Fail">Fail</option>
                                        </select>
                                    </div>
                                    <button type="submit" className="w-full py-4 mt-4 bg-lh-purple hover:bg-purple-600 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg active:scale-95">
                                        Update Record
                                    </button>
                                </form>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                {/* Create Exam Modal */}
                <AnimatePresence>
                    {isExamModalOpen && (
                        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md overflow-y-auto custom-scrollbar">
                            <motion.div
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 50 }}
                                className="w-full min-h-screen p-4 md:p-8 max-w-5xl mx-auto space-y-6"
                            >
                                <div className="flex justify-between items-center sticky top-0 bg-black/50 backdrop-blur-md z-20 pb-4 border-b border-white/5 pt-4 rounded-b-2xl px-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-lh-purple rounded-lg text-white"><BookOpen size={20} /></div>
                                        <h3 className="text-xl font-[1000] uppercase tracking-tight text-white">{editingExamId ? 'Modify Exam' : 'Initialize New Exam'}</h3>
                                    </div>
                                    <button onClick={() => { setIsExamModalOpen(false); setEditingExamId(null); setNewExam({ title: '', description: '', duration: 60, price: 0, category: 'Certification', questions: [] }); }} className="p-2 bg-white/5 rounded-full hover:bg-white/20 text-white transition-all"><X size={20} /></button>
                                </div>

                                <form onSubmit={handleCreateExam} className="h-full">
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">

                                        {/* Left Column: Exam Details */}
                                        <div className="space-y-6">
                                            <div className={`bg-[#0a0a0a] p-8 rounded-[32px] border border-white/10 space-y-6 shadow-2xl relative overflow-hidden`}>
                                                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-[50px] rounded-full pointer-events-none"></div>
                                                <h4 className="text-sm font-black uppercase tracking-widest text-lh-purple border-b border-white/5 pb-4">Exam Configuration</h4>

                                                <div>
                                                    <label className={SX.label}>Exam Title</label>
                                                    <input
                                                        type="text"
                                                        className={SX.input}
                                                        placeholder="e.g. Certified Ethical Hacker v12"
                                                        value={newExam.title}
                                                        onChange={e => setNewExam({ ...newExam, title: e.target.value })}
                                                        required
                                                    />
                                                </div>

                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label className={SX.label}>Duration (min)</label>
                                                        <div className="relative">
                                                            <input
                                                                type="number"
                                                                className={SX.input}
                                                                value={newExam.duration}
                                                                onChange={e => setNewExam({ ...newExam, duration: parseInt(e.target.value) })}
                                                            />
                                                            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs font-bold">MIN</div>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <label className={SX.label}>Pricing ($)</label>
                                                        <div className="relative">
                                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs font-bold">$</span>
                                                            <input
                                                                type="number"
                                                                className={`${SX.input} pl-6`}
                                                                value={newExam.price}
                                                                onChange={e => setNewExam({ ...newExam, price: parseInt(e.target.value) })}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className={SX.label}>Description</label>
                                                    <textarea
                                                        className={`${SX.input} h-32 resize-none`}
                                                        placeholder="Provide a comprehensive overview of the exam..."
                                                        value={newExam.description}
                                                        onChange={e => setNewExam({ ...newExam, description: e.target.value })}
                                                    />
                                                </div>
                                            </div>

                                            <button type="submit" className="w-full py-5 bg-gradient-to-r from-lh-purple to-purple-800 rounded-2xl text-sm font-black uppercase tracking-widest text-white hover:from-purple-600 hover:to-purple-800 transition-all shadow-[0_0_30px_rgba(188,19,254,0.3)] active:scale-95 group flex items-center justify-center gap-2">
                                                <Save size={18} className="group-hover:scale-110 transition-transform" />
                                                {editingExamId ? 'Save Changes' : 'Publish Exam'}
                                            </button>
                                        </div>

                                        {/*RrRight Column: Question Manager */}
                                        <div className="space-y-6 h-full flex flex-col">
                                            <div className="bg-[#0a0a0a] p-8 rounded-[32px] border border-white/10 flex-1 flex flex-col shadow-2xl relative overflow-hidden">
                                                <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-500/5 blur-[50px] rounded-full pointer-events-none"></div>
                                                <div className="flex justify-between items-center border-b border-white/5 pb-4 mb-6">
                                                    <h4 className="text-sm font-black uppercase tracking-widest text-lh-purple">Question Bank</h4>
                                                    <span className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-bold text-gray-400 border border-white/5">{newExam.questions.length} Items</span>
                                                </div>

                                                <div className="space-y-5 mb-8">
                                                    <div className="relative">
                                                        <div className="absolute top-3 left-3 text-gray-500"><Code size={16} /></div>
                                                        <div className="absolute top-3 right-3 text-[10px] font-mono text-gray-600">MARKDOWN SUPPORTED</div>
                                                        <textarea
                                                            placeholder="Enter question text here..."
                                                            className={`${SX.input} pl-10 pt-3 h-28 resize-none`}
                                                            value={currentQuestion.questionText}
                                                            onChange={e => setCurrentQuestion({ ...currentQuestion, questionText: e.target.value })}
                                                        />
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-4">
                                                        {currentQuestion.options.map((opt, idx) => (
                                                            <div key={idx} className="relative group">
                                                                <span className="absolute left-3 top-3 text-[10px] font-black text-gray-600 uppercase">Opt {idx + 1}</span>
                                                                <input
                                                                    type="text"
                                                                    className={`${SX.input} pl-12 pr-4 ${currentQuestion.correctAnswer === opt && opt !== '' ? 'border-green-500/50 bg-green-500/10' : ''}`}
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
                                                            className={`${SX.input} flex-1 appearance-none cursor-pointer`}
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
                                                            className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg active:scale-95 shrink-0 border border-dashed border-emerald-500/30 ${editingIndex !== null ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/50 hover:bg-yellow-500/20' : 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20'}`}
                                                        >
                                                            {editingIndex !== null ? 'Update Item' : 'Add Item'}
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Questions List */}
                                                <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-2 min-h-[300px] bg-black/20 rounded-2xl p-4 border border-white/5 inner-shadow">
                                                    {newExam.questions.length === 0 ? (
                                                        <div className="flex flex-col items-center justify-center h-full text-gray-600 gap-4 opacity-50">
                                                            <FileText size={48} className="animate-pulse" />
                                                            <span className="text-xs font-bold uppercase tracking-widest">Question Bank Empty</span>
                                                        </div>
                                                    ) : (
                                                        newExam.questions.map((q, idx) => (
                                                            <div key={idx} className={`p-4 rounded-xl border transition-all group hover:bg-white/5 ${editingIndex === idx ? 'bg-yellow-500/5 border-yellow-500/30' : 'bg-black/40 border-white/5'}`}>
                                                                <div className="flex justify-between items-start gap-4">
                                                                    <div className="flex-1">
                                                                        <div className="flex items-start gap-3 mb-2">
                                                                            <span className="px-2 py-1 bg-white/10 rounded-md text-[10px] font-black text-gray-400 mt-0.5">#{idx + 1}</span>
                                                                            <span className="text-sm font-bold text-gray-200 line-clamp-2">{q.questionText}</span>
                                                                        </div>
                                                                        <div className="text-xs text-emerald-500 font-mono pl-10 flex items-center gap-2">
                                                                            <Check size={12} /> {q.correctAnswer}
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                        <button type="button" onClick={() => handleEditQuestion(idx)} className="p-2 bg-yellow-500/10 text-yellow-500 rounded-lg hover:bg-yellow-500/20 transition-all"><Edit size={14} /></button>
                                                                        <button type="button" onClick={() => handleDeleteQuestion(idx)} className="p-2 bg-rose-500/10 text-rose-500 rounded-lg hover:bg-rose-500/20 transition-all"><Trash2 size={14} /></button>
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
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

            </main>
        </div >
    );
};

export default AdminDashboard;
