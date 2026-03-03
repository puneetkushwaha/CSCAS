import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users, BookOpen, Activity, Play, Plus, Trash2, Edit, Search, Layers,
    BarChart2, Save, X, Check, AlertCircle, LayoutDashboard, FileText,
    TrendingUp, Shield, Zap, MoreVertical, LogOut, Home,
    AlertTriangle, Code, MessageSquare, Mic, MicOff, Phone,
    Monitor, ShieldAlert, Power, Camera, Clock, CheckCircle2, Video, Radio, CalendarClock, Briefcase, Globe
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { createSocket } from '../utils/socketClient';
import ChatWidget from '../components/ChatWidget';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import CertificationsManager from '../components/admin/CertificationsManager';
import CareersManager from '../components/admin/CareersManager';
import IndustrySectorsManager from '../components/admin/IndustrySectorsManager';
import ResourceManager from '../components/admin/ResourceManager';


const ProctorView = ({ examId }) => {
    const { user: currentUser } = useAuth();
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [socket, setSocket] = useState(null);
    const [noiseAlerts, setNoiseAlerts] = useState({}); // { userId: level }
    const [tabSwitchAlerts, setTabSwitchAlerts] = useState({}); // { userId: boolean }
    const [activeChat, setActiveChat] = useState(null); // { examId, userId, userName }

    // --- Voice & Video State ---
    const [activeVoice, setActiveVoice] = useState(null); // userId
    const [remoteStreams, setRemoteStreams] = useState({}); // { userId: MediaStream }
    const [remoteScreenStreams, setRemoteScreenStreams] = useState({}); // { userId: MediaStream }
    const pc = useRef({});
    const screenPc = useRef({}); // Store PeerConnections per user: { userId: pc }
    const localStream = useRef(null);
    const proctorMicStream = useRef(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    // --- Signaling Buffers ---
    const pendingCandidates = useRef({}); // { userId: [candidates] }
    const pendingScreenCandidates = useRef({}); // { userId: [candidates] }
    const requestedRooms = useRef(new Set());

    useEffect(() => {
        const newSocket = createSocket();
        setSocket(newSocket);

        newSocket.on('connect', () => {
            console.log("[Socket] Proctor connected to real-time server:", newSocket.id);
        });

        newSocket.on('connect_error', (error) => {
            console.error("[Socket] Connection error:", error);
            toast.error("Real-time connection failed. Actions might be delayed.");
        });

        newSocket.on('new_id_verification', (data) => {
            console.log("[ProctorView] New ID verification request received:", data);
            toast.info(`New ID verification request from ${data.studentName || 'Student'}`, {
                position: "top-right",
                autoClose: 5000
            });
            // Force intermediate refresh of sessions
            setRefreshTrigger(prev => prev + 1);
        });

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

        newSocket.on('tab_switch_alert', ({ userId, room }) => {
            if (!userId) {
                const parts = room.split('_');
                userId = parts[1];
            }
            setTabSwitchAlerts(prev => ({ ...prev, [userId]: true }));
            // Clear alert after 5 seconds
            setTimeout(() => {
                setTabSwitchAlerts(prev => {
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

                // Drain pending candidates
                if (pendingCandidates.current[id]) {
                    console.log(`[ProctorView] Draining ${pendingCandidates.current[id].length} buffered ICE candidates for user ${id}`);
                    for (const cand of pendingCandidates.current[id]) {
                        await peer.addIceCandidate(new RTCIceCandidate(cand)).catch(e => console.error(e));
                    }
                    delete pendingCandidates.current[id];
                }

                return peer;
            };

            if (type === 'offer') {
                let peer = pc.current[signalUserId];
                if (!peer || peer.signalingState === 'closed') {
                    peer = await setupPeer(signalUserId);
                }
                await peer.setRemoteDescription(new RTCSessionDescription(signal));
                const answer = await peer.createAnswer();
                await peer.setLocalDescription(answer);
                newSocket.emit('webrtc-signal', {
                    room,
                    userId: currentUser?.id || currentUser?._id,
                    signal: answer,
                    type: 'answer'
                });
            } else if (type === 'answer' && pc.current[signalUserId]) {
                const peer = pc.current[signalUserId];
                if (peer.signalingState !== 'closed') {
                    await peer.setRemoteDescription(new RTCSessionDescription(signal));
                }
            } else if (type === 'candidate') {
                const peer = pc.current[signalUserId];
                if (peer && peer.remoteDescription && peer.signalingState !== 'closed') {
                    await peer.addIceCandidate(new RTCIceCandidate(signal)).catch(e => console.error(e));
                } else {
                    if (!pendingCandidates.current[signalUserId]) pendingCandidates.current[signalUserId] = [];
                    pendingCandidates.current[signalUserId].push(signal);
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
                        console.log(`[ProctorView] Sending screen ICE candidate for room ${room}, user ${id}`);
                        newSocket.emit('webrtc-screen-signal', { room, userId: currentUser?.id || currentUser?._id, signal: event.candidate, type: 'candidate' });
                    }
                };

                peer.ontrack = (event) => {
                    console.log(`[ProctorView] Received screen track for user ${id}, kind: ${event.track.kind}`);
                    setRemoteScreenStreams(prev => ({
                        ...prev,
                        [id]: event.streams[0]
                    }));
                };

                // Drain pending screen candidates
                if (pendingScreenCandidates.current[id]) {
                    console.log(`[ProctorView] Draining ${pendingScreenCandidates.current[id].length} buffered screen ICE candidates for user ${id}`);
                    for (const cand of pendingScreenCandidates.current[id]) {
                        await peer.addIceCandidate(new RTCIceCandidate(cand)).catch(e => console.error(e));
                    }
                    delete pendingScreenCandidates.current[id];
                }

                return peer;
            };

            if (type === 'offer') {
                console.log(`[ProctorView] Received screen offer from user ${signalUserId} in room ${room}.`);
                let peer = screenPc.current[signalUserId];
                if (!peer || peer.signalingState === 'closed') {
                    peer = await setupScreenPeer(signalUserId);
                }
                await peer.setRemoteDescription(new RTCSessionDescription(signal));
                const answer = await peer.createAnswer();
                await peer.setLocalDescription(answer);
                newSocket.emit('webrtc-screen-signal', {
                    room,
                    userId: currentUser?.id || currentUser?._id,
                    signal: answer,
                    type: 'answer'
                });
            } else if (type === 'answer' && screenPc.current[signalUserId]) {
                const peer = screenPc.current[signalUserId];
                if (peer.signalingState !== 'closed') {
                    await peer.setRemoteDescription(new RTCSessionDescription(signal));
                }
            } else if (type === 'candidate') {
                const peer = screenPc.current[signalUserId];
                if (peer && peer.remoteDescription && peer.signalingState !== 'closed') {
                    await peer.addIceCandidate(new RTCIceCandidate(signal)).catch(e => console.error(e));
                } else {
                    if (!pendingScreenCandidates.current[signalUserId]) pendingScreenCandidates.current[signalUserId] = [];
                    pendingScreenCandidates.current[signalUserId].push(signal);
                }
            }
        });

        return () => {
            newSocket.disconnect();
            Object.values(pc.current).forEach(p => p.close());
            Object.values(screenPc.current).forEach(p => p.close());
            localStream.current?.getTracks().forEach(track => track.stop());
            proctorMicStream.current?.getTracks().forEach(track => track.stop());
        };
    }, [currentUser]);

    useEffect(() => {
        if (socket && examId) {
            const room = `proctor_exam_${examId}`;
            console.log(`[ProctorView] Joining proctor room for exam: ${examId} (Room: ${room})`);
            socket.emit('join_proctor_exam', { examId });
        }
    }, [socket, examId]);

    useEffect(() => {
        if (socket && sessions.length > 0) {
            sessions.forEach(session => {
                if (session.examId && session.userId?._id && session.attemptId) {
                    const room = `${session.examId}_${session.userId?._id || session.userId}_${session.attemptId}`;

                    // Join session if not already joined (socket.io handles duplicate joins gracefully, 
                    // but we can be explicit if needed. For now, we always emit join_session to ensure 
                    // the proctor is in the current active room).
                    socket.emit('join_session', {
                        examId: session.examId,
                        userId: session.userId?._id || session.userId,
                        attemptId: session.attemptId
                    });

                    // Request feed only if we haven't requested it in this proctor instance session
                    if (!requestedRooms.current.has(room)) {
                        console.log("[ProctorView] Requesting initial live feed for room:", room);
                        requestedRooms.current.add(room); // Add to Set BEFORE emitting to prevent race conditions
                        socket.emit('request_live_feed', { room });
                    }
                }
            });
        }
    }, [socket, sessions.length]); // Dependency on length is safer than the whole array if sessions items change slightly

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
    }, [examId, refreshTrigger]);

    const handleVerifyID = async (sessionId, status) => {
        try {
            await api.patch('/proctor/verify-id', { sessionId, status });
            // Optionally update local state to show change immediately
            setSessions(prev => prev.map(s => s._id === sessionId ? { ...s, verificationStatus: status } : s));
            toast.success(`Student ID ${status} successfully.`);
        } catch (error) {
            console.error("Verification error:", error);
            toast.error("Failed to update verification status. Please try again.");
        }
    };

    const handleStartVoice = async (sessionId, userId, examId, attemptId) => {
        const room = `${examId}_${userId}_${attemptId}`;
        console.log(`[Proctor] Initiating voice for Room: ${room}, Session: ${sessionId}`);
        try {
            const peer = pc.current[userId];

            if (!peer || peer.signalingState === 'closed') {
                toast.warn("Video feed is not active or closed. Please connect the video feed first.");
                return;
            }

            if (activeVoice === userId) {
                // Stop proctor voice (send nothing to student)
                const senders = peer.getSenders();
                const audioSender = senders.find(s => s.track?.kind === 'audio');
                if (audioSender && peer.signalingState !== 'closed') {
                    peer.removeTrack(audioSender);
                    // Re-negotiate only if signaling is stable
                    if (peer.signalingState === 'stable') {
                        const offer = await peer.createOffer();
                        await peer.setLocalDescription(offer);
                        socket.emit('webrtc-signal', { room, signal: offer, type: 'offer', userId: currentUser?.id || currentUser?._id });
                    }
                }
                setActiveVoice(null);
                return;
            }

            // Start proctor voice (send mic to student)
            let micStream = proctorMicStream.current;
            if (!micStream) {
                micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
                proctorMicStream.current = micStream;
            }

            // Remove any existing audio tracks first to avoid duplicates
            if (peer.signalingState !== 'closed') {
                const existingSenders = peer.getSenders();
                const oldAudioSender = existingSenders.find(s => s.track?.kind === 'audio');
                if (oldAudioSender) {
                    try {
                        peer.removeTrack(oldAudioSender);
                    } catch (e) {
                        console.warn("[Proctor] Failed to remove old audio track:", e);
                    }
                }

                console.log(`[Proctor] Adding audio track to peer for user ${userId}`);
                micStream.getAudioTracks().forEach(track => {
                    peer.addTrack(track, micStream);
                });

                // Re-negotiate
                if (peer.signalingState === 'stable') {
                    console.log("[Proctor] Creating and sending offer for voice...");
                    const offer = await peer.createOffer();
                    await peer.setLocalDescription(offer);
                    socket.emit('webrtc-signal', { room, signal: offer, type: 'offer', userId: currentUser?.id || currentUser?._id });
                    setActiveVoice(userId);
                } else {
                    console.log("[Proctor] Signaling state not stable, waiting for automatic negotiation or connection recovery.");
                    setActiveVoice(userId);
                }
            }

        } catch (error) {
            console.error("Voice communication error", error);
            toast.error("Could not start voice communication. Please check microphone permissions.");
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
                            {tabSwitchAlerts[session.userId?._id] && (
                                <div className="absolute bottom-2 left-2 right-2 bg-red-500/90 text-white px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest text-center animate-pulse flex items-center justify-center gap-1 backdrop-blur-sm shadow-xl z-10 border border-red-400">
                                    <AlertTriangle size={14} /> WARNING: TAB SWITCH DETECTED
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
                                        className="w-full h-full object-contain"
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
                                <button
                                    onClick={() => handleRequestVideo(session.userId?._id, session.examId, session.attemptId)}
                                    className={`py-2 border rounded-lg text-[9px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${remoteStreams[session.userId?._id]
                                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                                        : 'bg-white/5 border-white/10 text-gray-400 hover:bg-emerald-500/10 hover:border-emerald-500/30 hover:text-emerald-400'}`}
                                >
                                    <Camera size={12} /> {remoteStreams[session.userId?._id] ? 'Feed Live' : 'Connect Feed'}
                                </button>
                            </div>

                            {/* Voice Call Button — always visible */}
                            <div className="mb-2">
                                <button
                                    onClick={() => handleStartVoice(session._id, session.userId?._id, session.examId, session.attemptId)}
                                    className={`w-full py-2 border rounded-lg text-[9px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${activeVoice === session.userId?._id
                                        ? 'bg-rose-500/10 border-rose-500/50 text-rose-400 animate-pulse'
                                        : 'bg-lh-purple/10 border-lh-purple/30 text-lh-purple hover:bg-lh-purple hover:text-white hover:border-lh-purple'
                                        }`}
                                >
                                    {activeVoice === session.userId?._id
                                        ? <><MicOff size={12} /> Stop Voice Call</>
                                        : <><Mic size={12} /> Start Voice Call</>
                                    }
                                </button>
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

    // --- Course Management State ---
    const [courses, setCourses] = useState([]);
    const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
    const [editingCourseId, setEditingCourseId] = useState(null);
    const [newCourse, setNewCourse] = useState({
        title: '',
        description: '',
        thumbnail: '',
        price: 0,
        category: 'Cybersecurity',
        level: 'Beginner',
        chapters: []
    });

    // --- Live Class State ---
    const [liveClasses, setLiveClasses] = useState([]);
    const [isLiveClassModalOpen, setIsLiveClassModalOpen] = useState(false);
    const [newLiveClass, setNewLiveClass] = useState({
        course: '',
        title: '',
        instructor: '',
        scheduledAt: ''
    });

    const [currentChapter, setCurrentChapter] = useState({
        title: '',
        description: '',
        videoUrl: '',
        pdfUrl: '',
        isPreview: false
    });
    const [editingChapterIndex, setEditingChapterIndex] = useState(null);
    const [chapterEditMode, setChapterEditMode] = useState('all'); // 'all', 'details', 'video', 'pdf'
    const [uploading, setUploading] = useState(null); // 'thumbnail', 'video', 'pdf' or null

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [examsRes, resultsRes, coursesRes, liveClassesRes] = await Promise.all([
                api.get('/exams'),
                api.get('/results/all'),
                api.get('/courses'),
                api.get('/live-class/all')
            ]);

            setExams(examsRes.data);
            setResults(resultsRes.data);
            setCourses(coursesRes.data);
            setLiveClasses(liveClassesRes.data);

            // Calculate Stats
            const distinctUsers = new Set(resultsRes.data.map(r => r.user?._id)).size;
            setStats({
                totalExams: examsRes.data.length,
                totalResults: resultsRes.data.length,
                totalCourses: coursesRes.data.length,
                distinctUsers
            });

        } catch (error) {
            console.error("Failed to fetch admin data", error);
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (e, type, target = 'chapter') => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(type);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await api.post('/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            const url = res.data.url;
            if (target === 'course') {
                setNewCourse(prev => ({ ...prev, thumbnail: url }));
            } else {
                setCurrentChapter(prev => ({ ...prev, [type === 'video' ? 'videoUrl' : 'pdfUrl']: url }));
                // Immediate sync if editing to prevent data loss on mode switching
                if (editingChapterIndex !== null) {
                    setNewCourse(prev => {
                        const updatedChapters = [...prev.chapters];
                        updatedChapters[editingChapterIndex] = {
                            ...updatedChapters[editingChapterIndex],
                            [type === 'video' ? 'videoUrl' : 'pdfUrl']: url
                        };
                        return { ...prev, chapters: updatedChapters };
                    });
                }
            }
            toast.success('File uploaded successfully!');
        } catch (error) {
            console.error("Upload error:", error);
            toast.error('Upload failed. Please try again.');
        } finally {
            setUploading(null);
            if (e.target) e.target.value = null; // Reset input so same file can be selected again
        }
    };

    const handleAddChapter = () => {
        if (!currentChapter.title) {
            toast.warn('Chapter title is required');
            return;
        }

        if (editingChapterIndex !== null) {
            const updatedChapters = [...newCourse.chapters];
            // Merge only the fields currently being edited, keep the rest intact from the original chapter state
            const originalChapter = updatedChapters[editingChapterIndex];

            let mergedChapter = { ...originalChapter };
            if (chapterEditMode === 'all' || chapterEditMode === 'details') {
                mergedChapter.title = currentChapter.title;
                mergedChapter.description = currentChapter.description;
                mergedChapter.isPreview = currentChapter.isPreview;
            }
            if (chapterEditMode === 'all' || chapterEditMode === 'video') mergedChapter.videoUrl = currentChapter.videoUrl;
            if (chapterEditMode === 'all' || chapterEditMode === 'pdf') mergedChapter.pdfUrl = currentChapter.pdfUrl;

            updatedChapters[editingChapterIndex] = mergedChapter;
            setNewCourse({ ...newCourse, chapters: updatedChapters });
            setEditingChapterIndex(null);
            setChapterEditMode('all');
        } else {
            setNewCourse({ ...newCourse, chapters: [...newCourse.chapters, currentChapter] });
        }
        setCurrentChapter({ title: '', description: '', videoUrl: '', pdfUrl: '', isPreview: false });
    };

    const handleEditChapterStart = (idx, mode) => {
        // If we are already editing this chapter, don't reset currentChapter state
        // to avoid losing unsaved changes (like a newly uploaded video/pdf)
        if (editingChapterIndex !== idx) {
            setCurrentChapter({ ...newCourse.chapters[idx] });
        }
        setEditingChapterIndex(idx);
        setChapterEditMode(mode);
    };

    const cancelChapterEdit = () => {
        setEditingChapterIndex(null);
        setChapterEditMode('all');
        setCurrentChapter({ title: '', description: '', videoUrl: '', pdfUrl: '', isPreview: false });
    };

    const handleCreateCourse = async (e) => {
        e.preventDefault();

        // Check for unsaved chapter in progress
        if (currentChapter.title && !window.confirm(`You have a chapter "${currentChapter.title}" that hasn't been added to the course list yet. Do you want to continue without adding it?`)) {
            return;
        }

        try {
            if (editingCourseId) {
                await api.put(`/courses/${editingCourseId}`, newCourse);
                toast.success('Course Updated Successfully!');
            } else {
                await api.post('/courses', newCourse);
                toast.success('Course Created Successfully!');
            }
            setIsCourseModalOpen(false);
            setNewCourse({ title: '', description: '', thumbnail: '', price: 0, category: 'Cybersecurity', level: 'Beginner', chapters: [] });
            setEditingCourseId(null);
            fetchData();
        } catch (error) {
            toast.error('Failed to save course: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleDeleteCourse = async (id) => {
        if (window.confirm('Are you sure you want to delete this course?')) {
            try {
                await api.delete(`/courses/${id}`);
                fetchData();
            } catch (error) {
                toast.error('Failed to delete course');
            }
        }
    };

    const handleEditCourse = async (course) => {
        // IMPORTANT: Load from the full content endpoint (which includes videoUrl/pdfUrl)
        // The public courses list strips these fields, so using it would wipe content on save.
        try {
            toast.info('Loading course content...');
            const res = await api.get(`/courses/${course._id}/content`);
            const fullCourse = res.data;
            setNewCourse({
                title: fullCourse.title,
                description: fullCourse.description,
                thumbnail: fullCourse.thumbnail,
                price: fullCourse.price,
                category: fullCourse.category,
                level: fullCourse.level,
                isActive: fullCourse.isActive,
                chapters: fullCourse.chapters || []
            });
        } catch (error) {
            // Fallback: use the stripped public data but warn
            console.error('Could not load full course content, using public data:', error);
            toast.warn('Loading limited course data. Chapter video/PDF URLs may not be visible.');
            setNewCourse({
                title: course.title,
                description: course.description,
                thumbnail: course.thumbnail,
                price: course.price,
                category: course.category,
                level: course.level,
                chapters: course.chapters || []
            });
        }
        setEditingCourseId(course._id);
        setIsCourseModalOpen(true);
    };

    const handleDeleteExam = async (id) => {
        if (window.confirm('jb: Are you sure you want to delete this exam?')) {
            try {
                await api.delete(`/exams/${id}`);
                fetchData();
            } catch (error) {
                toast.error('Failed to delete exam');
            }
        }
    };

    const handleDeleteResult = async (id) => {
        if (window.confirm('jb: Are you sure you want to delete this result? This cannot be undone.')) {
            try {
                await api.delete(`/results/${id}`);
                fetchData(); // Refresh list
                toast.success('Result deleted successfully');
            } catch (error) {
                console.error(error);
                toast.error('Failed to delete result');
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
            toast.success('Result updated successfully');
            setIsResultModalOpen(false);
            setEditingResult(null);
            fetchData();
        } catch (error) {
            console.error(error);
            toast.error('Failed to update result');
        }
    };

    const handleAddQuestion = () => {
        if (!currentQuestion.questionText || currentQuestion.options.some(opt => !opt) || !currentQuestion.correctAnswer) {
            toast.warn('Please fill all question fields and select a correct answer.');
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

    const handleDeleteChapter = (index) => {
        if (window.confirm("Delete this chapter?")) {
            const updatedChapters = newCourse.chapters.filter((_, i) => i !== index);
            setNewCourse({ ...newCourse, chapters: updatedChapters });
        }
    };

    const handleEditChapter = (index) => {
        setCurrentChapter(newCourse.chapters[index]);
        setEditingChapterIndex(index);
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
                toast.success('Exam Updated Successfully!');
            } else {
                await api.post('/exams', payload);
                toast.success('Exam Created Successfully!');
            }

            setIsExamModalOpen(false);
            setNewExam({ title: '', description: '', duration: 60, price: 0, category: 'Certification', questions: [] });
            setEditingExamId(null);
            fetchData();
        } catch (error) {
            console.error(error);
            if (error.response && error.response.status === 403) {
                toast.error('Permission Denied: You must be an Admin to manage exams.');
            } else {
                toast.error(`Failed to ${editingExamId ? 'update' : 'create'} exam: ` + (error.response?.data?.message || error.message));
            }
        }
    };

    const SX = {
        glass: "bg-white/[0.02] backdrop-blur-xl border border-white/10",
        glassHover: "hover:bg-white/[0.05] hover:border-lh-purple/30 transition-all duration-300",
        input: "w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-lh-purple focus:ring-1 focus:ring-lh-purple outline-none transition-all placeholder:text-gray-600 hover:bg-white/10",
        label: "block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1"
    };

    // --- Live Class Handlers ---
    const handleCreateLiveClass = async (e) => {
        e.preventDefault();
        try {
            await api.post('/live-class', newLiveClass);
            toast.success('Live class scheduled!');
            setIsLiveClassModalOpen(false);
            setNewLiveClass({ course: '', title: '', instructor: '', scheduledAt: '' });
            fetchData();
        } catch (error) {
            toast.error('Failed to schedule: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleLiveClassStatus = async (id, status) => {
        try {
            await api.patch(`/live-class/${id}/status`, { status });
            toast.success(`Class ${status === 'live' ? 'started' : 'ended'}!`);
            fetchData();
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const handleDeleteLiveClass = async (id) => {
        if (window.confirm('Delete this live class?')) {
            try {
                await api.delete(`/live-class/${id}`);
                toast.success('Live class deleted');
                fetchData();
            } catch (error) {
                toast.error('Failed to delete');
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

                <nav className="space-y-2 flex-1 overflow-y-auto custom-scrollbar pr-2 mb-4">
                    {[
                        { id: 'overview', icon: Activity, label: 'Overview' },
                        { id: 'exams', icon: BookOpen, label: 'Exam_Manager' },
                        { id: 'courses', icon: Layers, label: 'Course_Manager' },
                        { id: 'results', icon: Users, label: 'Student_Results' },
                        { id: 'certifications', icon: Shield, label: 'Certifications' },
                        { id: 'careers', icon: Briefcase, label: 'Careers' },
                        { id: 'industries', icon: Globe, label: 'Industry_Sectors' },
                        { id: 'proctoring', icon: ShieldAlert, label: 'Live_Proctor' },
                        { id: 'live-classes', icon: Video, label: 'Live_Classes' },
                        { id: 'resources', icon: FileText, label: 'Knowledge_Resources' }
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
                            {activeTab === 'courses' && 'Course Management'}
                            {activeTab === 'results' && 'Student Performance'}
                            {activeTab === 'certifications' && 'Certification Programs'}
                            {activeTab === 'careers' && 'Career Path Manager'}
                            {activeTab === 'industries' && 'Industry Market Segments'}
                            {activeTab === 'proctoring' && 'Live Proctoring'}
                            {activeTab === 'live-classes' && 'Live Classes'}
                            {activeTab === 'resources' && 'Resource Center'}
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
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {[
                                    { label: 'Total Exams', value: stats.totalExams, icon: BookOpen, color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
                                    { label: 'Active Courses', value: courses.length, icon: Layers, color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
                                    { label: 'Total Attempts', value: stats.totalResults, icon: Activity, color: 'text-yellow-500', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' },
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

                    {/* Certifications Tab */}
                    {activeTab === 'certifications' && (
                        <CertificationsManager />
                    )}

                    {/* Careers Tab */}
                    {activeTab === 'careers' && (
                        <CareersManager />
                    )}

                    {/* Industries Tab */}
                    {activeTab === 'industries' && (
                        <IndustrySectorsManager />
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

                    {/* Courses Tab */}
                    {activeTab === 'courses' && (
                        <motion.div
                            key="courses"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-6"
                        >
                            <div className="flex justify-between items-center bg-white/[0.02] p-2 rounded-2xl border border-white/5">
                                <span className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                                    {courses.length} Active Courses
                                </span>
                                <button
                                    onClick={() => {
                                        setEditingCourseId(null);
                                        setNewCourse({ title: '', description: '', thumbnail: '', price: 0, category: 'Cybersecurity', level: 'Beginner', chapters: [] });
                                        setIsCourseModalOpen(true);
                                    }}
                                    className="px-6 py-3 bg-white text-black hover:bg-lh-purple hover:text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.1)] active:scale-95"
                                >
                                    <Plus size={16} /> Create Course
                                </button>
                            </div>

                            <div className={`rounded-[32px] overflow-hidden ${SX.glass}`}>
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-white/[0.02] border-b border-white/5 text-[10px] text-gray-400 uppercase tracking-[0.2em]">
                                            <th className="p-6 font-bold">Protocol Info</th>
                                            <th className="p-6 font-bold">Difficulty</th>
                                            <th className="p-6 font-bold">Category</th>
                                            <th className="p-6 font-bold">Modules</th>
                                            <th className="p-6 font-bold">Fee</th>
                                            <th className="p-6 font-bold text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {courses.filter(c => c.title.toLowerCase().includes(searchQuery.toLowerCase())).map(course => (
                                            <tr key={course._id} className="hover:bg-white/[0.02] transition-colors group border-b border-white/[0.02]">
                                                <td className="p-6 flex items-center gap-4">
                                                    <div className="relative">
                                                        <img src={course.thumbnail} className="w-14 h-14 rounded-xl object-cover border border-white/10 group-hover:scale-105 transition-transform" alt="" />
                                                        <div className="absolute -bottom-1 -right-1 p-1 bg-lh-purple rounded-md text-[8px] text-white">
                                                            <Layers size={10} />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="font-[900] text-sm text-white group-hover:text-lh-purple transition-colors uppercase tracking-tight">{course.title || 'Untitled_Module'}</div>
                                                        <div className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">ID: {course._id.slice(-8)}</div>
                                                    </div>
                                                </td>
                                                <td className="p-6">
                                                    <span className={`px-3 py-1 text-[9px] font-black uppercase tracking-wider rounded-full border ${course.level === 'Beginner' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                                                        course.level === 'Intermediate' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                                                            'bg-rose-500/10 text-rose-500 border-rose-500/20'
                                                        }`}>
                                                        {course.level}
                                                    </span>
                                                </td>
                                                <td className="p-6">
                                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-white/5 px-3 py-1 rounded-lg border border-white/5">
                                                        {course.category}
                                                    </span>
                                                </td>
                                                <td className="p-6">
                                                    <div className="flex flex-col gap-2">
                                                        <div className="flex items-center gap-1.5">
                                                            <span className="text-sm font-black text-white">{course.chapters?.length || 0}</span>
                                                            <span className="text-[8px] text-gray-600 font-bold uppercase tracking-tighter mt-1">Units_Safe</span>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            {course.chapters?.some(ch => ch.videoUrl) && (
                                                                <span className="px-1.5 py-0.5 bg-lh-purple/10 text-lh-purple text-[7px] font-black uppercase rounded border border-lh-purple/20 flex items-center gap-1">
                                                                    <Monitor size={8} /> Video
                                                                </span>
                                                            )}
                                                            {course.chapters?.some(ch => ch.pdfUrl) && (
                                                                <span className="px-1.5 py-0.5 bg-blue-500/10 text-blue-500 text-[7px] font-black uppercase rounded border border-blue-500/20 flex items-center gap-1">
                                                                    <FileText size={8} /> PDF
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-6 font-black text-sm text-lh-purple">₹{course.price}</td>
                                                <td className="p-6 text-right space-x-1">
                                                    <button onClick={() => handleEditCourse(course)} className="p-2.5 text-gray-500 hover:text-white hover:bg-white/5 rounded-xl transition-all border border-transparent hover:border-white/10"><Edit size={16} /></button>
                                                    <button onClick={() => handleDeleteCourse(course._id)} className="p-2.5 text-gray-500 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all border border-transparent hover:border-rose-500/20"><Trash2 size={16} /></button>
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
                                        className="bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-white outline-none focus:border-lh-purple appearance-none pr-10 cursor-pointer hover:bg-white/5 transition-all min-w-[200px]"
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

                    {/* Live Classes Tab */}
                    {activeTab === 'live-classes' && (
                        <motion.div
                            key="live-classes"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-6"
                        >
                            <div className="flex justify-between items-center bg-white/[0.02] p-2 rounded-2xl border border-white/5">
                                <h3 className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                                    {liveClasses.filter(c => c.status === 'live').length} Live Now · {liveClasses.length} Total
                                </h3>
                                <button
                                    onClick={() => setIsLiveClassModalOpen(true)}
                                    className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-lh-purple to-purple-800 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:scale-105 transition-all"
                                >
                                    <Plus size={14} /> Schedule Class
                                </button>
                            </div>

                            <div className="space-y-4">
                                {liveClasses.length === 0 && (
                                    <div className="flex flex-col items-center justify-center p-16 text-gray-600 gap-4 border border-dashed border-white/10 rounded-3xl">
                                        <Video size={40} className="opacity-20" />
                                        <p className="text-xs font-bold uppercase tracking-widest">No live classes scheduled yet</p>
                                    </div>
                                )}
                                {liveClasses.map((cls) => (
                                    <div key={cls._id} className={`p-6 rounded-2xl border flex items-center justify-between gap-6 transition-all ${cls.status === 'live' ? 'bg-lh-purple/5 border-lh-purple/20' : cls.status === 'ended' ? 'border-white/5 opacity-60' : 'bg-white/[0.02] border-white/5'}`}>
                                        <div className="flex items-center gap-4">
                                            <div className={`p-3 rounded-xl ${cls.status === 'live' ? 'bg-lh-purple/20' : 'bg-white/5'}`}>
                                                {cls.status === 'live' ? <Radio size={20} className="text-lh-purple animate-pulse" /> : <CalendarClock size={20} className="text-gray-500" />}
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-black uppercase text-white">{cls.title}</h4>
                                                <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">
                                                    {cls.course?.title || 'Unknown Course'} · {new Date(cls.scheduledAt).toLocaleString()}
                                                </p>
                                                <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border ${cls.status === 'live' ? 'bg-lh-purple/20 text-lh-purple border-lh-purple/30' : cls.status === 'ended' ? 'bg-white/5 text-gray-500 border-white/10' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'}`}>
                                                    {cls.status}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 shrink-0">
                                            {cls.status === 'scheduled' && (
                                                <button onClick={() => handleLiveClassStatus(cls._id, 'live')} className="px-4 py-2 bg-lh-purple text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all flex items-center gap-2">
                                                    <Radio size={12} /> Start
                                                </button>
                                            )}
                                            {cls.status === 'live' && (
                                                <button onClick={() => handleLiveClassStatus(cls._id, 'ended')} className="px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500/20 transition-all flex items-center gap-2">
                                                    <X size={12} /> End
                                                </button>
                                            )}
                                            <button onClick={() => handleDeleteLiveClass(cls._id)} className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Resources Tab */}
                    {activeTab === 'resources' && (
                        <ResourceManager />
                    )}
                </AnimatePresence>

                {/* Edit Result Modal */}
                <AnimatePresence>
                    {isResultModalOpen && editingResult && (
                        <div className="fixed inset-0 z-[110] bg-black/80 flex items-center justify-center backdrop-blur-md p-4">
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
            </main>

            {/* --- Modals (Rendered outside main for correct z-index stacking) --- */}

            {/* Create Exam Modal */}
            <AnimatePresence>
                {isExamModalOpen && (
                    <div className="fixed inset-0 z-[999] bg-black/90 backdrop-blur-md overflow-y-auto custom-scrollbar">
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
                                                    <label className={SX.label}>Pricing (₹)</label>
                                                    <div className="relative">
                                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs font-bold">₹</span>
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

            {/* Course Management Modal */}
            <AnimatePresence>
                {isCourseModalOpen && (
                    <div className="fixed inset-0 z-[999] bg-black/95 backdrop-blur-md overflow-y-auto custom-scrollbar">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="w-full min-h-screen p-4 md:p-8 max-w-6xl mx-auto space-y-6"
                        >
                            <div className="flex justify-between items-center sticky top-0 bg-black/50 backdrop-blur-md z-20 pb-4 border-b border-white/5 pt-4 rounded-b-2xl px-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-lh-purple rounded-lg text-white"><Layers size={20} /></div>
                                    <h3 className="text-xl font-[1000] uppercase tracking-tight text-white">{editingCourseId ? 'Upgrade Course Architecture' : 'Initialize New Selection Way'}</h3>
                                </div>
                                <button onClick={() => setIsCourseModalOpen(false)} className="p-2 bg-white/5 rounded-full hover:bg-white/20 text-white transition-all"><X size={20} /></button>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-20">
                                {/* Left: Metadata */}
                                <div className="space-y-6">
                                    <div className={`${SX.glass} p-8 rounded-[32px] space-y-6`}>
                                        <h4 className="text-sm font-black uppercase tracking-widest text-lh-purple border-b border-white/5 pb-4">General Protocol</h4>

                                        <div className="space-y-4">
                                            <div>
                                                <label className={SX.label}>Course Title</label>
                                                <input type="text" className={SX.input} value={newCourse.title} onChange={e => setNewCourse({ ...newCourse, title: e.target.value })} placeholder="Mastering Web Security" />
                                            </div>
                                            <div>
                                                <label className={SX.label}>Thumbnail Asset</label>
                                                <div className="flex gap-4 items-center">
                                                    <div className="w-24 h-24 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden">
                                                        {newCourse.thumbnail ? <img src={newCourse.thumbnail} className="w-full h-full object-cover" /> : <Camera className="text-gray-700" size={24} />}
                                                    </div>
                                                    <label className="flex-1 cursor-pointer">
                                                        <div className="py-3 px-6 bg-white/5 border border-dashed border-white/20 text-xs font-bold uppercase tracking-widest text-center rounded-xl hover:bg-lh-purple/10 transition-all">
                                                            {uploading === 'thumbnail' ? 'Processing_Link...' : 'Upload Core Image'}
                                                        </div>
                                                        <input type="file" className="hidden" accept="image/*" onChange={e => handleFileUpload(e, 'thumbnail', 'course')} disabled={!!uploading} />
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className={SX.label}>Premium Fee (₹)</label>
                                                    <input type="number" className={SX.input} value={newCourse.price} onChange={e => setNewCourse({ ...newCourse, price: parseInt(e.target.value) })} />
                                                </div>
                                                <div>
                                                    <label className={SX.label}>Catalog Category</label>
                                                    <input type="text" className={SX.input} value={newCourse.category} onChange={e => setNewCourse({ ...newCourse, category: e.target.value })} />
                                                </div>
                                            </div>
                                            <div>
                                                <label className={SX.label}>Difficulty Vector</label>
                                                <select className={SX.input} value={newCourse.level} onChange={e => setNewCourse({ ...newCourse, level: e.target.value })}>
                                                    {['Beginner', 'Intermediate', 'Advanced', 'Expert'].map(l => <option key={l} value={l}>{l}</option>)}
                                                </select>
                                            </div>
                                            <div>
                                                <label className={SX.label}>Abstract</label>
                                                <textarea className={`${SX.input} h-32 resize-none`} value={newCourse.description} onChange={e => setNewCourse({ ...newCourse, description: e.target.value })} placeholder="Detailed course brief..." />
                                            </div>
                                        </div>
                                    </div>

                                    <button onClick={handleCreateCourse} className="w-full py-5 bg-lh-purple rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl active:scale-95 transition-all">
                                        {editingCourseId ? 'Commit Changes' : 'Publish to Catalog'}
                                    </button>
                                </div>

                                {/* Right: Chapter Manager */}
                                <div className="space-y-6">
                                    <h4 className="text-sm font-black uppercase tracking-widest text-lh-purple border-b border-white/5 pb-4 flex justify-between items-center">
                                        <span>Curriculum Structure</span>
                                        {editingChapterIndex !== null && (
                                            <span className="text-[10px] bg-lh-purple/20 text-lh-purple px-2 py-1 rounded-full border border-lh-purple/30">
                                                EDITING: {chapterEditMode.toUpperCase()}
                                            </span>
                                        )}
                                    </h4>

                                    <div className="space-y-4 bg-white/[0.03] p-6 rounded-2xl border border-white/5 relative">
                                        {(chapterEditMode === 'all' || chapterEditMode === 'details') && (
                                            <>
                                                <input type="text" className={SX.input} placeholder="Chapter Title" value={currentChapter.title} onChange={e => setCurrentChapter({ ...currentChapter, title: e.target.value })} />
                                                <textarea className={`${SX.input} h-20 text-xs`} placeholder="Chapter Summary" value={currentChapter.description} onChange={e => setCurrentChapter({ ...currentChapter, description: e.target.value })} />

                                                <div className="flex items-center gap-2 mt-2">
                                                    <input
                                                        type="checkbox"
                                                        id="isPreview"
                                                        checked={currentChapter.isPreview || false}
                                                        onChange={e => setCurrentChapter({ ...currentChapter, isPreview: e.target.checked })}
                                                        className="w-4 h-4 rounded bg-white/5 border-white/10 text-lh-purple focus:ring-lh-purple cursor-pointer"
                                                    />
                                                    <label htmlFor="isPreview" className="text-[10px] font-bold text-gray-400 uppercase tracking-widest cursor-pointer">
                                                        Mark as Free Demo/Preview Lecture
                                                    </label>
                                                </div>
                                            </>
                                        )}

                                        <div className="grid grid-cols-2 gap-4">
                                            {(chapterEditMode === 'all' || chapterEditMode === 'video') && (
                                                <div className="col-span-2 space-y-3">
                                                    {/* YouTube Link Input */}
                                                    <div>
                                                        <label className="block text-[9px] font-black text-red-400 uppercase tracking-widest mb-1.5 ml-1 flex items-center gap-1.5">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
                                                            YouTube Link Paste Karen
                                                        </label>
                                                        <input
                                                            type="url"
                                                            className={`${SX.input} text-xs`}
                                                            placeholder="https://www.youtube.com/watch?v=... ya https://youtu.be/..."
                                                            value={currentChapter.videoUrl && (currentChapter.videoUrl.includes('youtube.com') || currentChapter.videoUrl.includes('youtu.be')) ? currentChapter.videoUrl : ''}
                                                            onChange={e => setCurrentChapter({ ...currentChapter, videoUrl: e.target.value })}
                                                        />
                                                        {currentChapter.videoUrl && (currentChapter.videoUrl.includes('youtube.com') || currentChapter.videoUrl.includes('youtu.be')) && (
                                                            <p className="text-[9px] text-emerald-400 font-bold mt-1 ml-1">✓ YouTube Link detect hua — direct play hoga!</p>
                                                        )}
                                                    </div>

                                                    {/* OR divider */}
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex-1 h-px bg-white/10"></div>
                                                        <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest">Ya Video File Upload Karen</span>
                                                        <div className="flex-1 h-px bg-white/10"></div>
                                                    </div>

                                                    {/* File Upload Button */}
                                                    <label className="cursor-pointer block">
                                                        <div className={`p-4 rounded-xl border border-dashed flex flex-col items-center gap-2 transition-all ${currentChapter.videoUrl && !currentChapter.videoUrl.includes('youtube.com') && !currentChapter.videoUrl.includes('youtu.be') ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-500' : 'bg-white/5 border-white/10 text-gray-400'}`}>
                                                            <Monitor size={18} className={uploading === 'video' ? 'animate-bounce text-lh-purple' : ''} />
                                                            <span className="text-[9px] font-black uppercase text-center leading-none mt-1">
                                                                {uploading === 'video' ? 'Uploading...' : (currentChapter.videoUrl && !currentChapter.videoUrl.includes('youtube') && !currentChapter.videoUrl.includes('youtu.be')) ? 'Video File Uploaded ✓' : 'Video File Upload Karen'}
                                                            </span>
                                                        </div>
                                                        <input type="file" className="hidden" accept="video/*" onChange={e => handleFileUpload(e, 'video')} disabled={!!uploading} />
                                                    </label>
                                                </div>
                                            )}

                                            {(chapterEditMode === 'all' || chapterEditMode === 'pdf') && (
                                                <label className="cursor-pointer col-span-2 md:col-span-1">
                                                    <div className={`p-4 rounded-xl border border-dashed flex flex-col items-center gap-2 transition-all ${currentChapter.pdfUrl ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-500' : 'bg-white/5 border-white/10 text-gray-400'}`}>
                                                        <FileText size={18} className={uploading === 'pdf' ? 'animate-pulse text-blue-500' : ''} />
                                                        <span className="text-[9px] font-black uppercase text-center leading-none mt-1">
                                                            {uploading === 'pdf' ? 'Uploading...' : currentChapter.pdfUrl ? 'PDF Uploaded ✓' : 'Add Study Notes PDF'}
                                                        </span>
                                                    </div>
                                                    <input type="file" className="hidden" accept=".pdf" onChange={e => handleFileUpload(e, 'pdf')} disabled={!!uploading} />
                                                </label>
                                            )}
                                        </div>

                                        <div className="flex gap-2">
                                            {editingChapterIndex !== null && (
                                                <button onClick={cancelChapterEdit} className="w-1/3 py-3 bg-white/5 text-gray-400 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">
                                                    Cancel
                                                </button>
                                            )}
                                            <button onClick={handleAddChapter} className="flex-1 py-3 bg-white text-black rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-lh-purple hover:text-white transition-all">
                                                {editingChapterIndex !== null ? `Save ${chapterEditMode}` : 'Add Module'}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 min-h-[300px]">
                                        {newCourse.chapters.map((ch, idx) => (
                                            <div key={idx} className="p-4 bg-white/[0.03] border border-white/5 rounded-xl group hover:border-lh-purple/40 transition-all flex justify-between items-center">
                                                <div className="flex items-center gap-4">
                                                    <span className="text-xl font-black text-white/10 group-hover:text-lh-purple transition-colors">{(idx + 1).toString().padStart(2, '0')}</span>
                                                    <div>
                                                        <h5 className="text-[11px] font-black uppercase tracking-tight">
                                                            {ch.title}
                                                            {ch.isPreview && <span className="ml-2 px-1.5 py-0.5 bg-emerald-500/20 text-emerald-500 rounded text-[8px]">DEMO</span>}
                                                        </h5>
                                                        <div className="flex gap-3 mt-1.5">
                                                            {ch.videoUrl && (
                                                                <a href={ch.videoUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-[8px] font-black uppercase text-lh-purple hover:underline">
                                                                    <Zap size={10} /> Play_Stream
                                                                </a>
                                                            )}
                                                            {ch.pdfUrl && (
                                                                <a href={ch.pdfUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-[8px] font-black uppercase text-blue-500 hover:underline">
                                                                    <FileText size={10} /> View_Vault
                                                                </a>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col gap-1 items-end">
                                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300">
                                                        <button onClick={() => handleEditChapterStart(idx, 'details')} className="px-2 py-1 bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300 hover:text-white rounded text-[8px] font-bold uppercase tracking-widest whitespace-nowrap">Edit Details</button>
                                                        <button onClick={() => handleEditChapterStart(idx, 'video')} className="px-2 py-1 bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300 hover:text-emerald-400 rounded text-[8px] font-bold uppercase tracking-widest whitespace-nowrap">Upload Video</button>
                                                        <button onClick={() => handleEditChapterStart(idx, 'pdf')} className="px-2 py-1 bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300 hover:text-blue-400 rounded text-[8px] font-bold uppercase tracking-widest whitespace-nowrap">Upload PDF</button>
                                                    </div>
                                                    <button onClick={() => handleDeleteChapter(idx)} className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-rose-500/10 text-gray-500 hover:text-rose-500 rounded-lg transition-opacity"><Trash2 size={12} /></button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Schedule Live Class Modal */}
            <AnimatePresence>
                {isLiveClassModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
                        onClick={() => setIsLiveClassModalOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95 }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full max-w-lg bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 space-y-6"
                        >
                            <div className="flex justify-between items-center">
                                <h3 className="text-xl font-black uppercase tracking-tighter">Schedule Live Class</h3>
                                <button onClick={() => setIsLiveClassModalOpen(false)} className="p-2 rounded-xl hover:bg-white/5 text-gray-500 hover:text-white transition-all"><X size={20} /></button>
                            </div>
                            <form onSubmit={handleCreateLiveClass} className="space-y-4">
                                <div>
                                    <label className={SX.label}>Class Title</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. Chapter 1 Revision"
                                        className={SX.input}
                                        value={newLiveClass.title}
                                        onChange={(e) => setNewLiveClass({ ...newLiveClass, title: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className={SX.label}>Select Course</label>
                                    <select
                                        required
                                        className={SX.input}
                                        value={newLiveClass.course}
                                        onChange={(e) => setNewLiveClass({ ...newLiveClass, course: e.target.value })}
                                    >
                                        <option value="">-- Select Course --</option>
                                        {courses.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className={SX.label}>Instructor Name</label>
                                    <input
                                        type="text"
                                        placeholder="Instructor name"
                                        className={SX.input}
                                        value={newLiveClass.instructor}
                                        onChange={(e) => setNewLiveClass({ ...newLiveClass, instructor: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className={SX.label}>Scheduled Date & Time</label>
                                    <input
                                        type="datetime-local"
                                        required
                                        className={SX.input}
                                        value={newLiveClass.scheduledAt}
                                        onChange={(e) => setNewLiveClass({ ...newLiveClass, scheduledAt: e.target.value })}
                                    />
                                </div>
                                <button type="submit" className="w-full py-4 bg-gradient-to-r from-lh-purple to-purple-800 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-[1.01] active:scale-95 transition-all">
                                    Schedule Class
                                </button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminDashboard;
