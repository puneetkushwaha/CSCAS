import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Shield, Clock, AlertTriangle, ArrowRight, CheckCircle2,
  ShieldAlert, Activity, Lock, Laptop, Menu, X, ChevronRight, Power,
  User, Bookmark, RotateCcw, Save, LayoutGrid, Camera, Maximize2, Mic
} from 'lucide-react';
import Webcam from 'react-webcam';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { createSocket } from '../utils/socketClient';
import ChatWidget from '../components/ChatWidget';
import { toast } from 'react-toastify';

const ExamPlayer = () => {
  const navigate = useNavigate();
  const { user } = useAuth(); // Get user from context
  const [phase, setPhase] = useState('loading'); // loading, waiting, active, completed
  const [activeExam, setActiveExam] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [examTimer, setExamTimer] = useState(3600);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);

  // NTA Style States
  const [questionStatus, setQuestionStatus] = useState({});
  const [answers, setAnswers] = useState({}); // Final saved answers
  const [selectedOption, setSelectedOption] = useState(null); // Currently selected but not saved
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile sidebar

  // Result State
  const [examResult, setExamResult] = useState(null);

  // --- Anti-Cheating State ---
  const [violationCount, setViolationCount] = useState(0);
  const [isLocked, setIsLocked] = useState(false); // True if tab switch detected
  const [lockReason, setLockReason] = useState(null);

  // --- Real-time State ---
  const [socket, setSocket] = useState(null);
  const [idPhoto, setIdPhoto] = useState(null);
  const [isIdVerified, setIsIdVerified] = useState(false);
  const [isWaitingApproval, setIsWaitingApproval] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verificationError, setVerificationError] = useState(null);
  const [proctorWarning, setProctorWarning] = useState(null);
  const [isProctorSpeaking, setIsProctorSpeaking] = useState(false);
  const [isDisqualified, setIsDisqualified] = useState(false);
  const [disqualificationReason, setDisqualificationReason] = useState(null);

  // --- KYC / Identity State ---
  const [kycData, setKycData] = useState({
    fullName: user?.firstName ? `${user.firstName} ${user.lastName || ''}` : '',
    idType: '',
    idNumber: ''
  });

  // --- Voice & Video State ---
  const pc = useRef(null);
  const screenPc = useRef(null);
  const localStream = useRef(null);
  const screenStream = useRef(null);
  const remoteStream = useRef(new MediaStream());
  const audioRef = useRef(null);

  // --- Signaling Buffers ---
  const pendingCandidates = useRef([]);
  const pendingScreenCandidates = useRef([]);

  // --- Initial Sync & Data Fetching ---
  useEffect(() => {
    const syncTimer = () => {
      const exams = JSON.parse(localStorage.getItem('scheduledExams') || '[]');
      const now = new Date().getTime();

      const current = exams.find(e => {
        const diff = e.timestamp - now;
        return diff <= 600000 && diff > -3600000;
      });

      if (!current) {
        setPhase('no-exam');
        return;
      }

      // Only update activeExam if it's different to avoid re-renders
      setActiveExam(prev => {
        // Ensure the current exam object has an ID (backward compatibility)
        if (!current.id) {
          current.id = current.timestamp?.toString() || 'LEGACY';
        }
        if (prev?.examId !== current.examId || prev?.id !== current.id) return current;
        return prev;
      });

      const diff = current.timestamp - now;

      if (diff > 0) {
        setPhase('waiting');
        const minutes = Math.floor(diff / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        setTimeLeft(`${minutes}:${seconds.toString().padStart(2, '0')}`);
      } else {
        setPhase('active');
      }
    };

    const interval = setInterval(syncTimer, 1000);
    syncTimer();
    return () => clearInterval(interval);
  }, []);

  // --- Socket Initialization ---
  useEffect(() => {
    if (user && activeExam?.examId) {
      const newSocket = createSocket();
      setSocket(newSocket);

      console.log(`[Socket] Joining session room: ${activeExam.examId}_${user._id || user.id}_${activeExam.id}`);
      newSocket.emit('join_session', {
        examId: activeExam.examId,
        userId: user._id || user.id,
        attemptId: activeExam.id
      });

      newSocket.on('verification_updated', ({ status }) => {
        console.log("[Socket] Verification status updated:", status);
        if (status === 'verified') {
          setIsIdVerified(true);
          setIsWaitingApproval(false);
          toast.success("Identity Verified! You may now begin.");
        } else if (status === 'rejected') {
          setIsWaitingApproval(false);
          setIsIdVerified(false);
          setIdPhoto(null);
          setVerificationError("Identity verification rejected. Please retake photo.");
          toast.error("Verification rejected. Please try again.");
        }
      });

      newSocket.on('proctor_warning', ({ message }) => {
        console.log("[Socket] Received warning:", message);
        setProctorWarning(message);
        toast.info(`Proctor Message: ${message}`, { autoClose: 10000 });
        // Clear warning after 10 seconds
        setTimeout(() => setProctorWarning(null), 10000);
      });

      newSocket.on('disqualify_student', ({ reason }) => {
        console.log("[Socket] Received disqualification:", reason);
        setIsDisqualified(true);
        setDisqualificationReason(reason);
      });

      return () => newSocket.disconnect();
    }
  }, [user, activeExam?.examId, activeExam?.id]);

  // --- Fetch Session Status (Initial & Critical Updates) ---
  const fetchStatus = useCallback(async () => {
    if (user && activeExam?.examId && activeExam?.id) {
      try {
        const res = await api.get(`/proctor/my-session/${activeExam.examId}/${activeExam.id}`);
        if (res.data) {
          if (res.data.verificationStatus === 'verified') {
            setIsIdVerified(true);
            setIsWaitingApproval(false);
          } else if (res.data.verificationStatus === 'pending') {
            setIsWaitingApproval(true);
            setIdPhoto(res.data.idSnapshot);
          } else if (res.data.verificationStatus === 'rejected') {
            setIsWaitingApproval(false);
            setIsIdVerified(false);
          }
        }
      } catch (error) {
        console.error("Failed to fetch session status", error);
      }
    }
  }, [user, activeExam?.examId, activeExam?.id]);

  useEffect(() => {
    fetchStatus();

    // Fallback polling only when waiting for approval
    let interval;
    if (isWaitingApproval && !isIdVerified) {
      interval = setInterval(fetchStatus, 10000); // Check every 10s as fallback
    }
    return () => clearInterval(interval);
  }, [fetchStatus, isWaitingApproval, isIdVerified]);

  // --- WebRTC Logic ---
  useEffect(() => {
    if (!socket || !activeExam?.examId || !user || phase !== 'active') return;

    const setupPeerConnection = async () => {
      pc.current = new RTCPeerConnection({
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' },
          { urls: 'stun:stun2.l.google.com:19302' },
        ]
      });

      try {
        if (!localStream.current) {
          localStream.current = await navigator.mediaDevices.getUserMedia({
            video: { width: 320, height: 240, frameRate: 10 },
            audio: true
          });
        }
        localStream.current.getTracks().forEach(track => {
          pc.current.addTrack(track, localStream.current);
        });
      } catch (err) {
        console.error("Failed to get local stream", err);
      }

      pc.current.ontrack = (event) => {
        const stream = event.streams[0] || new MediaStream([event.track]);
        console.log(`[ExamPlayer] Received track: ${event.track.kind} from proctor`);

        if (event.track.kind === 'audio') {
          console.log("[ExamPlayer] Proctor audio track detected. Playing...");
          setIsProctorSpeaking(true);
          event.track.onmute = () => {
            console.log("[ExamPlayer] Proctor audio muted");
            setIsProctorSpeaking(false);
          };
          event.track.onunmute = () => {
            console.log("[ExamPlayer] Proctor audio unmuted");
            setIsProctorSpeaking(true);
          };
          event.track.onended = () => {
            console.log("[ExamPlayer] Proctor audio track ended");
            setIsProctorSpeaking(false);
          };
        }

        if (audioRef.current) {
          console.log("[ExamPlayer] Binding proctor stream to audio element");
          audioRef.current.srcObject = stream;
        }
      };

      pc.current.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit('webrtc-signal', {
            room: `${activeExam.examId}_${user.id || user._id}_${activeExam.id}`,
            userId: user.id || user._id,
            signal: event.candidate,
            type: 'candidate'
          });
        }
      };

      // Drain pending candidates
      if (pendingCandidates.current.length > 0) {
        console.log(`[ExamPlayer] Draining ${pendingCandidates.current.length} buffered ICE candidates`);
        for (const cand of pendingCandidates.current) {
          await pc.current.addIceCandidate(new RTCIceCandidate(cand)).catch(e => console.error(e));
        }
        pendingCandidates.current = [];
      }
    };

    socket.on('webrtc-signal', async ({ signal, type, userId: signalUserId }) => {
      // If signalUserId is provided and doesn't match, it might be from the proctor
      // Since signaling is in a private room, we can relax this check
      if (signalUserId && signalUserId !== (user.id || user._id)) {
        // console.log("Received signal from proctor/other", signalUserId);
      }

      if (!pc.current) await setupPeerConnection();

      if (type === 'offer') {
        await pc.current.setRemoteDescription(new RTCSessionDescription(signal));
        const answer = await pc.current.createAnswer();
        await pc.current.setLocalDescription(answer);
        socket.emit('webrtc-signal', {
          room: `${activeExam.examId}_${user.id || user._id}_${activeExam.id}`,
          userId: user.id || user._id,
          signal: answer,
          type: 'answer'
        });
      } else if (type === 'answer' && pc.current) {
        await pc.current.setRemoteDescription(new RTCSessionDescription(signal));
      } else if (type === 'candidate') {
        if (pc.current && pc.current.remoteDescription) {
          await pc.current.addIceCandidate(new RTCIceCandidate(signal)).catch(e => console.error(e));
        } else {
          console.log("[ExamPlayer] Buffering ICE candidate (remoteDescription not yet set)");
          pendingCandidates.current.push(signal);
        }
      }
    });

    const initiateCall = async () => {
      if (!pc.current) await setupPeerConnection();
      const offer = await pc.current.createOffer();
      await pc.current.setLocalDescription(offer);
      socket.emit('webrtc-signal', {
        room: `${activeExam.examId}_${user.id || user._id}_${activeExam.id}`,
        userId: user.id || user._id,
        signal: offer,
        type: 'offer'
      });
    };

    socket.on('request_live_feed', async () => {
      console.log("[Socket] Proctor requested live feed. Re-initiating...");
      await initiateCall();
      // Also re-initiate screen share if needed
      if (screenStream.current) {
        const screenOffer = await screenPc.current.createOffer();
        await screenPc.current.setLocalDescription(screenOffer);
        socket.emit('webrtc-screen-signal', {
          room: `${activeExam.examId}_${user.id || user._id}_${activeExam.id}`,
          userId: user.id || user._id,
          signal: screenOffer,
          type: 'offer'
        });
      }
    });

    const timer = setTimeout(initiateCall, 2000);

    return () => {
      clearTimeout(timer);
      pc.current?.close();
      pc.current = null;
      localStream.current?.getTracks().forEach(t => t.stop());
      localStream.current = null;
    };
  }, [socket, activeExam?.examId, user, phase]);

  // --- Audio Level Monitoring ---
  useEffect(() => {
    if (!socket || !activeExam?.examId || !user || phase !== 'active') return;

    let audioContext;
    let analyser;
    let source;
    let animationId;

    const monitorAudio = async () => {
      try {
        if (!localStream.current) return;

        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        source = audioContext.createMediaStreamSource(localStream.current);
        source.connect(analyser);
        analyser.fftSize = 256;

        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        let highVolumeDuration = 0;
        const THRESHOLD = 50;

        const checkVolume = () => {
          analyser.getByteFrequencyData(dataArray);
          let sum = 0;
          for (let i = 0; i < bufferLength; i++) {
            sum += dataArray[i];
          }
          const average = sum / bufferLength;

          if (average > THRESHOLD) {
            highVolumeDuration++;
            if (highVolumeDuration > 100) {
              socket.emit('noise_alert', {
                room: `${activeExam.examId}_${user.id || user._id}_${activeExam.id}`,
                level: Math.round(average)
              });
              highVolumeDuration = 0;
            }
          } else {
            highVolumeDuration = Math.max(0, highVolumeDuration - 2);
          }
          animationId = requestAnimationFrame(checkVolume);
        };

        checkVolume();

      } catch (err) {
        console.error("Audio monitoring failed", err);
      }
    };

    const timer = setTimeout(monitorAudio, 5000);

    return () => {
      clearTimeout(timer);
      if (animationId) cancelAnimationFrame(animationId);
      if (source) source.disconnect();
      if (audioContext) audioContext.close();
    };
  }, [socket, activeExam?.examId, user, phase]);

  // --- Screen Share Monitoring ---
  useEffect(() => {
    if (!socket || !activeExam?.examId || !user || phase !== 'active') return;

    const setupScreenPc = async () => {
      screenPc.current = new RTCPeerConnection({
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' },
          { urls: 'stun:stun2.l.google.com:19302' },
        ]
      });

      try {
        screenStream.current = await navigator.mediaDevices.getDisplayMedia({
          video: {
            width: { ideal: 1280, max: 1280 },
            height: { ideal: 720, max: 720 },
            frameRate: { ideal: 5, max: 8 },
          },
          audio: false
        });

        screenStream.current.getTracks().forEach(track => {
          screenPc.current.addTrack(track, screenStream.current);
        });

        // Handle track ending (user stops sharing via browser bar)
        screenStream.current.getVideoTracks()[0].onended = () => {
          socket.emit('disqualify_student', {
            room: `${activeExam.examId}_${user.id || user._id}_${activeExam.id}`,
            reason: "Screen sharing was stopped."
          });
        };

      } catch (err) {
        console.error("Screen share failed", err);
        // Auto-disqualify if they refuse screen share
        setIsDisqualified(true);
        setDisqualificationReason("Screen sharing must be enabled to continue the exam.");
      }

      screenPc.current.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit('webrtc-screen-signal', {
            room: `${activeExam.examId}_${user.id || user._id}_${activeExam.id}`,
            userId: user.id || user._id,
            signal: event.candidate,
            type: 'candidate'
          });
        }
      };

      // Drain pending screen candidates
      if (pendingScreenCandidates.current.length > 0) {
        console.log(`[ExamPlayer] Draining ${pendingScreenCandidates.current.length} buffered screen ICE candidates`);
        for (const cand of pendingScreenCandidates.current) {
          await screenPc.current.addIceCandidate(new RTCIceCandidate(cand)).catch(e => console.error(e));
        }
        pendingScreenCandidates.current = [];
      }
    };

    socket.on('webrtc-screen-signal', async ({ signal, type, userId: signalUserId }) => {
      if (signalUserId && signalUserId !== (user.id || user._id)) {
        // console.log("Received screen signal from proctor/other", signalUserId);
      }
      if (!screenPc.current) await setupScreenPc();

      if (type === 'offer') {
        await screenPc.current.setRemoteDescription(new RTCSessionDescription(signal));
        const answer = await screenPc.current.createAnswer();
        await screenPc.current.setLocalDescription(answer);
        socket.emit('webrtc-screen-signal', {
          room: `${activeExam.examId}_${user.id || user._id}_${activeExam.id}`,
          userId: user.id || user._id,
          signal: answer,
          type: 'answer'
        });
      } else if (type === 'answer' && screenPc.current) {
        await screenPc.current.setRemoteDescription(new RTCSessionDescription(signal));
      } else if (type === 'candidate') {
        if (screenPc.current && screenPc.current.remoteDescription) {
          await screenPc.current.addIceCandidate(new RTCIceCandidate(signal)).catch(e => console.error(e));
        } else {
          console.log("[ExamPlayer] Buffering screen ICE candidate (remoteDescription not yet set)");
          pendingScreenCandidates.current.push(signal);
        }
      }
    });

    // Limit SDP bitrate to reduce network load on screen share
    const capBitrate = (sdp, kbps = 500) => {
      return sdp.replace(
        /a=mid:video\r\n/g,
        `a=mid:video\r\nb=AS:${kbps}\r\n`
      );
    };

    const initiateScreenCall = async () => {
      if (!screenPc.current) await setupScreenPc();
      const offer = await screenPc.current.createOffer();
      const cappedSdp = { ...offer, sdp: capBitrate(offer.sdp, 500) };
      await screenPc.current.setLocalDescription(cappedSdp);
      socket.emit('webrtc-screen-signal', {
        room: `${activeExam.examId}_${user.id || user._id}_${activeExam.id}`,
        userId: user.id || user._id,
        signal: cappedSdp,
        type: 'offer'
      });
    };

    const timer = setTimeout(initiateScreenCall, 3000);

    return () => {
      clearTimeout(timer);
      screenPc.current?.close();
      screenPc.current = null;
      screenStream.current?.getTracks().forEach(t => t.stop());
      screenStream.current = null;
    };
  }, [socket, activeExam?.examId, user, phase]);

  // --- Auto-Disqualification Logic ---
  useEffect(() => {
    if (violationCount >= 3) {
      setIsDisqualified(true);
      setDisqualificationReason("Multiple proctoring violations detected (3 warnings).");
    }
  }, [violationCount]);

  // --- Fetch Questions Component ---
  useEffect(() => {
    const fetchQuestions = async () => {
      if (!activeExam) return; // Silent return if still initializing

      const eId = activeExam.examId;
      if (!eId || eId === "undefined" || eId === "null") {
        console.warn("ExamPlayer: Missing examId in active exam record:", activeExam);
        return;
      }

      console.log(`ExamPlayer: Fetching questions for examId: ${eId}`);
      setLoadingQuestions(true);
      try {
        const response = await api.get(`/exams/${eId}`);
        console.log("ExamPlayer: Fetch Response:", response.data);

        if (response.data && response.data.questions) {
          const fetchedQuestions = response.data.questions;

          setQuestions(fetchedQuestions);
          if (response.data.duration) {
            setExamTimer(response.data.duration * 60);
          }

          // Initialize Status
          const initialStatus = {};
          fetchedQuestions.forEach((_, idx) => {
            initialStatus[idx] = 'not_visited';
          });
          initialStatus[0] = 'not_answered';
          setQuestionStatus(initialStatus);

        } else {
          console.error("ExamPlayer: No questions found in response for examId:", eId);
        }
      } catch (error) {
        console.error("Failed to fetch exam questions for examId:", eId, error);
        if (error.response?.status === 404) {
          console.error("404 Error: The exam ID might be invalid or the backend route is missing.");
        }
      } finally {
        setLoadingQuestions(false);
      }
    };

    fetchQuestions();
  }, [activeExam?.examId]);

  // --- Timer Logic ---
  useEffect(() => {
    if (phase === 'active' && examTimer > 0) {
      const t = setInterval(() => setExamTimer(prev => prev - 1), 1000);
      return () => clearInterval(t);
    } else if (phase === 'active' && examTimer <= 0) {
      handleFinalSubmit();
    }
  }, [phase, examTimer]);

  // --- Anti-Cheat Measures ---

  // Fullscreen Enforcer removed as requested.



  // Anti-cheat event listeners (tab switch, reload, inspect, etc.) have been removed as requested.


  // --- Proctoring Logic ---
  const webcamRef = useRef(null);

  const captureAndUpload = useCallback(async () => {
    if (webcamRef.current && activeExam?.examId) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        try {
          await api.post('/proctor/upload-snapshot', {
            examId: activeExam.examId,
            attemptId: activeExam.id,
            snapshot: imageSrc
          });
        } catch (error) {
          console.error("Proctor snapshot upload failed:", {
            error: error.message,
            response: error.response?.data
          });
        }
      }
    }
  }, [activeExam?.examId]);

  useEffect(() => {
    let interval;
    if (phase === 'active') {
      // Capture every 10 seconds
      interval = setInterval(captureAndUpload, 10000);
    }
    return () => clearInterval(interval);
  }, [phase, captureAndUpload]);

  // --- Helpers ---
  const formatExamTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'answered': return 'bg-green-500 text-white border-green-500';
      case 'not_answered': return 'bg-red-500 text-white border-red-500';
      case 'marked': return 'bg-purple-500 text-white border-purple-500';
      case 'marked_answered': return 'bg-purple-500 text-white border-purple-500 relative overflow-hidden after:content-[""] after:absolute after:bottom-1 after:right-1 after:w-2 after:h-2 after:bg-green-400 after:rounded-full';
      case 'not_visited': default: return 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10';
    }
  };

  // --- Actions ---
  const handleOptionSelect = (idx) => {
    setSelectedOption(idx);
  };

  const navigateToQuestion = (idx) => {
    setQuestionStatus(prev => {
      const newStatus = { ...prev };
      if (newStatus[currentQuestion] === 'not_visited') {
        newStatus[currentQuestion] = 'not_answered';
      }
      if (newStatus[idx] === 'not_visited') {
        newStatus[idx] = 'not_answered';
      }
      return newStatus;
    });

    setSelectedOption(answers[idx] !== undefined ? answers[idx] : null);
    setCurrentQuestion(idx);
    setIsSidebarOpen(false);
  };

  const handleSaveAndNext = () => {
    if (selectedOption !== null) {
      setAnswers(prev => ({ ...prev, [currentQuestion]: selectedOption }));
      setQuestionStatus(prev => ({ ...prev, [currentQuestion]: 'answered' }));
    } else {
      setQuestionStatus(prev => ({ ...prev, [currentQuestion]: 'not_answered' }));
    }

    if (currentQuestion < questions.length - 1) {
      navigateToQuestion(currentQuestion + 1);
    }
  };

  const handleMarkForReview = () => {
    if (selectedOption !== null) {
      setAnswers(prev => ({ ...prev, [currentQuestion]: selectedOption }));
      setQuestionStatus(prev => ({ ...prev, [currentQuestion]: 'marked_answered' }));
    } else {
      setQuestionStatus(prev => ({ ...prev, [currentQuestion]: 'marked' }));
    }

    if (currentQuestion < questions.length - 1) {
      navigateToQuestion(currentQuestion + 1);
    }
  };

  const handleClearResponse = () => {
    setSelectedOption(null);
    setAnswers(prev => {
      const newAnswers = { ...prev };
      delete newAnswers[currentQuestion];
      return newAnswers;
    });
    setQuestionStatus(prev => ({ ...prev, [currentQuestion]: 'not_answered' }));
  };

  const handleFinalSubmit = async () => {
    // Exit fullscreen on submit
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(err => console.log(err));
    }

    const timeTaken = 3600 - examTimer; // roughly calculated

    try {
      const payload = {
        examId: activeExam.examId,
        answers: answers,
        timeTaken
      };

      const response = await api.post('/results/submit', payload);

      setExamResult(response.data);

      // Success - remove from local schedule
      const currentExams = JSON.parse(localStorage.getItem('scheduledExams') || '[]');
      const updatedExams = currentExams.filter(e => e.timestamp !== activeExam.timestamp);
      localStorage.setItem('scheduledExams', JSON.stringify(updatedExams));

      setPhase('completed');

    } catch (error) {
      console.error("Submission Failed:", error);
      toast.error("Submission failed. Please try again.");
    }
  };


  // --- DISQUALIFICATION RENDER ---
  if (isDisqualified) {
    return (
      <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center text-center p-6">
        <Power size={80} className="text-red-500 mb-6" />
        <h1 className="text-4xl font-black text-white uppercase tracking-tighter mb-4">Exam Terminated</h1>
        <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-2xl max-w-lg mb-8">
          <h3 className="text-xl font-bold text-red-500 mb-2">You have been Disqualified</h3>
          <p className="text-gray-400 text-sm mb-4">
            Reason: {disqualificationReason || "Administrative decision or multiple violations."}
          </p>
          <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">
            This action is final. Please contact your administrator for further details.
          </p>
        </div>
        <button
          onClick={() => window.location.href = '/dashboard'}
          className="px-8 py-4 bg-white text-black rounded-xl text-sm font-black uppercase tracking-widest hover:bg-gray-200 transition-all"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  // --- LOCKDOWN OVERLAY RENDER ---
  if (phase === 'active' && isLocked) {
    return (
      <div className="fixed inset-0 z-50 bg-[#000] flex flex-col items-center justify-center text-center p-6">
        <ShieldAlert size={80} className="text-red-500 mb-6 animate-pulse" />
        <h1 className="text-4xl font-black text-white uppercase tracking-tighter mb-4">Exam Paused</h1>

        <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-2xl max-w-lg mb-8">
          <h3 className="text-xl font-bold text-red-500 mb-2">Security Violation Detected</h3>
          <p className="text-gray-400 text-sm mb-4">
            Security lock triggered. Please review the violation.
          </p>
        </div>

        <button
          onClick={() => setIsLocked(false)}
          className="px-8 py-4 bg-white text-black rounded-xl text-sm font-black uppercase tracking-widest hover:scale-105 transition-transform flex items-center gap-3"
        >
          Resume Exam
        </button>
      </div>
    )
  }

  // --- ID Verification Phase ---
  if ((phase === 'active' || phase === 'waiting') && !isIdVerified) {
    return (
      <div className="min-h-screen bg-lh-dark flex flex-col items-center py-12 px-6 overflow-y-auto">
        <Shield size={64} className="text-lh-purple mb-8 animate-pulse shrink-0" />
        <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-4">KYC Verification</h2>
        <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-8 max-w-sm">
          Please provide your identification details and capture a clear photo of your ID card.
        </p>

        <div className="w-full max-w-md bg-[#0a0a0a] border border-white/5 rounded-[2rem] p-8 space-y-6 relative overflow-visible mb-12">
          <div className="absolute top-0 right-0 w-32 h-32 bg-lh-purple/5 blur-[50px] rounded-full pointer-events-none"></div>

          {/* KYC Form Fields */}
          {!isWaitingApproval && !isIdVerified && (
            <div className="space-y-4 text-left">
              <div>
                <label className="block text-[8px] font-black text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Full Name</label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white focus:border-lh-purple outline-none transition-all"
                  value={kycData.fullName}
                  onChange={(e) => setKycData({ ...kycData, fullName: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[8px] font-black text-gray-500 uppercase tracking-widest mb-1.5 ml-1">ID Type</label>
                  <select
                    className="w-full bg-[#111] border border-white/10 rounded-xl p-3 text-xs text-white focus:border-lh-purple outline-none transition-all"
                    value={kycData.idType}
                    onChange={(e) => setKycData({ ...kycData, idType: e.target.value })}
                  >
                    <option value="">Select ID Type</option>
                    <option value="Aadhar Card">Aadhar Card</option>
                    <option value="PAN Card">PAN Card</option>
                    <option value="Driving License">Driving License</option>
                    <option value="Student ID">Student ID</option>
                    <option value="Passport">Passport</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[8px] font-black text-gray-500 uppercase tracking-widest mb-1.5 ml-1">ID Number</label>
                  <input
                    type="text"
                    placeholder="Enter ID number"
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white focus:border-lh-purple outline-none transition-all"
                    value={kycData.idNumber}
                    onChange={(e) => setKycData({ ...kycData, idNumber: e.target.value })}
                  />
                </div>
              </div>
            </div>
          )}

          <div className="relative aspect-video bg-black rounded-2xl overflow-hidden border-2 border-lh-purple/30 group">
            {idPhoto ? (
              <img
                src={idPhoto}
                crossOrigin="anonymous"
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain"
                alt="ID Preview"
              />
            ) : (
              <Webcam
                audio={false}
                ref={webcamRef}
                mirrored={true}
                screenshotFormat="image/jpeg"
                className="w-full h-full object-cover"
              />
            )}
            {!idPhoto && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-48 h-32 border-2 border-dashed border-white/20 rounded-lg flex flex-col items-center justify-center gap-2">
                  <div className="w-32 h-0.5 bg-lh-purple/20 animate-scan"></div>
                  <span className="text-[8px] font-bold text-white/20 uppercase tracking-[0.3em]">Align ID card here</span>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-4">
            {idPhoto ? (
              <button
                onClick={() => {
                  setIdPhoto(null);
                  setIsWaitingApproval(false);
                }}
                className="flex-1 py-4 bg-white/5 border border-white/10 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all"
              >
                Retake Photo
              </button>
            ) : (
              <button
                onClick={() => setIdPhoto(webcamRef.current.getScreenshot())}
                className="flex-1 py-4 bg-lh-purple text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3"
              >
                <Camera size={16} /> Capture ID
              </button>
            )}
          </div>

          {!isWaitingApproval && (
            <button
              disabled={!idPhoto || isSubmitting}
              onClick={async () => {
                try {
                  if (!kycData.fullName || !kycData.idType || !kycData.idNumber) {
                    setVerificationError("Please fill in all KYC details.");
                    return;
                  }
                  if (!idPhoto) {
                    setVerificationError("Please capture an ID photo first.");
                    return;
                  }

                  setIsSubmitting(true);
                  setVerificationError(null);

                  console.log("[ExamPlayer] Initiating ID upload...", {
                    examId: activeExam.examId,
                    userId: user._id || user.id,
                    attemptId: activeExam.id
                  });

                  await api.post('/proctor/upload-id', {
                    examId: activeExam.examId,
                    attemptId: activeExam.id,
                    idSnapshot: idPhoto,
                    kycData: kycData
                  });

                  console.log("[ExamPlayer] ID upload successful");
                  setIsWaitingApproval(true);
                  toast.success("Verification request sent successfully!");
                } catch (error) {
                  console.error("ID upload failed detailed error:", {
                    error: error.message,
                    response: error.response?.data
                  });
                  setVerificationError(`Failed to upload ID: ${error.response?.data?.message || error.message}`);
                } finally {
                  setIsSubmitting(false);
                }
              }}
              className={`w-full py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl transition-all ${idPhoto && !isSubmitting
                  ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-emerald-500/10 hover:scale-[1.02] active:scale-95"
                  : "bg-white/5 border border-white/5 text-gray-600 cursor-not-allowed"
                }`}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                  <span>Processing...</span>
                </div>
              ) : (
                idPhoto ? "Confirm and Request Approval" : "Capture ID to Continue"
              )}
            </button>
          )}

          {isWaitingApproval && (
            <div className="mt-8 space-y-4">
              <div className="p-6 bg-amber-500/10 border border-amber-500/20 rounded-2xl animate-pulse">
                <p className="text-amber-500 text-[10px] font-black uppercase tracking-widest mb-2">Awaiting Proctor Approval</p>
                <p className="text-gray-500 text-[8px] font-bold uppercase">Your identity is being verified by a live proctor. Please wait.</p>
              </div>
              <button
                onClick={fetchStatus}
                className="w-full py-3 bg-white/5 border border-white/5 text-[8px] font-black text-gray-500 hover:text-white uppercase tracking-widest rounded-xl transition-all"
              >
                Refresh Approval Status
              </button>
            </div>
          )}

          {verificationError && <p className="text-red-500 text-[10px] font-bold uppercase mt-4">{verificationError}</p>}
        </div>
      </div>
    );
  }

  // --- Completion & Error States ---
  if (phase === 'loading' || (phase === 'active' && questions.length === 0)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-lh-dark">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-t-2 border-r-2 border-lh-purple rounded-full animate-spin mx-auto"></div>
          <p className="text-white text-[10px] font-black uppercase tracking-widest">Loading Exam Module...</p>
        </div>
      </div>
    );
  }

  if (phase === 'no-exam') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-lh-dark p-6 text-center">
        <ShieldAlert size={48} className="text-lh-purple mb-6 opacity-20" />
        <h2 className="text-2xl font-black text-white uppercase tracking-widest mb-4">No Active Session</h2>
        <button onClick={() => navigate('/dashboard/pearson')} className="px-8 py-3 bg-lh-purple/10 border border-lh-purple/20 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-lh-purple transition-all">
          Access Dashboard
        </button>
      </div>
    );
  }

  if (phase === 'completed') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-lh-dark p-6 text-center">
        <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mb-8 border border-green-500/20">
          <CheckCircle2 size={40} className="text-green-500 animate-pulse" />
        </div>
        <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-4">Exam Submitted</h2>
        <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-8">
          Score: {examResult?.score} / {examResult?.totalMarks} ({examResult?.percentage?.toFixed(1)}%)
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl w-full mb-12">
          <div className="p-6 md:p-8 bg-white/[0.02] border border-white/5 rounded-[1.5rem] text-left">
            <h4 className="text-[10px] font-black text-lh-purple uppercase tracking-widest mb-6">Performance_Metric</h4>
            <div className="space-y-4">
              <div className="flex justify-between text-[11px] font-bold">
                <span className="text-gray-400">Status</span>
                <span className={examResult?.status === 'Pass' ? "text-green-500" : "text-red-500"}>{examResult?.status}</span>
              </div>
              <div className="flex justify-between text-[11px] font-bold">
                <span className="text-gray-400">Total Questions</span>
                <span className="text-white">{questions.length}</span>
              </div>
            </div>
          </div>
          <div className="p-6 md:p-8 bg-[#0a0a0a] border border-white/5 rounded-[1.5rem] text-left relative overflow-hidden">
            <div className="relative z-10">
              <h4 className="text-[10px] font-black text-white uppercase tracking-widest mb-4">Transmission_Log</h4>
              <p className="text-[11px] text-gray-500 font-bold uppercase tracking-widest leading-loose">
                ID: {examResult?._id?.substring(0, 8).toUpperCase()}<br />
                Sync: COMPLETED
              </p>
            </div>
          </div>
        </div>

        <button onClick={() => navigate('/dashboard/pearson')} className="px-10 py-4 bg-lh-purple text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-2xl hover:scale-105 active:scale-95 transition-all">
          Return to Home
        </button>
      </div>
    );
  }

  if (phase === 'waiting') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-lh-dark relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(188,19,254,0.05)_0%,transparent_70%)] pointer-events-none"></div>
        <div className="relative z-10 text-center space-y-8">
          <Clock size={48} className="text-lh-purple opacity-20 mx-auto animate-pulse" />
          <div>
            <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-2">Exam Locked</h2>
            <p className="text-lh-purple text-[10px] font-black uppercase tracking-[0.4em]">Starts in {timeLeft}</p>
          </div>
        </div>
      </div>
    );
  }

  // --- LOCKDOWN OVERLAY RENDER ---
  if (phase === 'active' && (!isFullscreen || isLocked)) {
    return (
      <div className="fixed inset-0 z-50 bg-[#000] flex flex-col items-center justify-center text-center p-6">
        <ShieldAlert size={80} className="text-red-500 mb-6 animate-pulse" />
        <h1 className="text-4xl font-black text-white uppercase tracking-tighter mb-4">Exam Paused</h1>

        {lockReason === 'tab_switch' ? (
          <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-2xl max-w-lg mb-8">
            <h3 className="text-xl font-bold text-red-500 mb-2">Security Violation Detected</h3>
            <p className="text-gray-400 text-sm mb-4">
              You attempted to switch tabs or minimize the browser. This action has been recorded.
              Repeated violations will result in automatic disqualification.
            </p>
            <div className="text-white font-mono text-2xl font-bold">
              Violation Count: <span className="text-red-500">{violationCount}</span>
            </div>
          </div>
        ) : (
          <p className="text-gray-400 max-w-md mb-8 text-lg">
            Full-screen mode is required to continue this assessment.
            Please do not exit full-screen or switch windows.
          </p>
        )}

        <button
          onClick={enterFullscreen}
          className="px-8 py-4 bg-white text-black rounded-xl text-sm font-black uppercase tracking-widest hover:scale-105 transition-transform flex items-center gap-3"
        >
          <Maximize2 size={20} /> Resume Exam
        </button>
      </div>
    )
  }
  return (
    <div className="flex flex-col h-screen bg-[#111] overflow-hidden">
      {/* Proctor Speaking Indicator */}
      {isProctorSpeaking && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-[60] animate-pulse">
          <div className="bg-lh-purple text-white px-6 py-2 rounded-full shadow-2xl flex items-center gap-3 border border-lh-purple/50">
            <Mic size={16} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Proctor is Speaking...</span>
            <div className="flex gap-1">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-1 h-3 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.1}s` }} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Proctor Warning Popup */}
      {proctorWarning && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-[60] animate-bounce">
          <div className="bg-amber-600 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-4 border-2 border-amber-400">
            <ShieldAlert size={24} />
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Proctor Message</p>
              <p className="text-sm font-bold">{proctorWarning}</p>
            </div>
          </div>
        </div>
      )}
      {/* Header */}
      <header className="h-16 bg-[#1a1a1a] border-b border-white/5 flex items-center justify-between px-6 shrink-0 z-20">
        <div className="flex items-center gap-4">
          <Shield size={24} className="text-lh-purple" />
          <div>
            <h1 className="text-sm font-black text-white uppercase tracking-wide">{activeExam?.examName}</h1>
            <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">CSCA Official Assessment</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 bg-black/40 px-4 py-2 rounded-lg border border-white/5">
            <Clock size={16} className={examTimer < 300 ? "text-red-500 animate-pulse" : "text-lh-purple"} />
            <span className={`text-xl font-mono font-bold ${examTimer < 300 ? "text-red-500" : "text-white"}`}>
              {formatExamTime(examTimer)}
            </span>
          </div>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="lg:hidden p-2 text-gray-400 hover:text-white">
            <Menu size={24} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden relative">

        {/* Left: Question Area */}
        <main className="flex-1 flex flex-col bg-[#0a0a0a] relative z-10 w-full lg:w-3/4">
          {/* Question Header */}
          <div className="h-12 border-b border-white/5 flex items-center justify-between px-6 bg-[#111]">
            <span className="text-[10px] font-black text-lh-purple uppercase tracking-[0.2em]">Question {currentQuestion + 1}</span>
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-bold text-gray-500 uppercase flex items-center gap-2">
                <Activity size={12} /> Single Choice
              </span>
              <span className="text-[10px] font-bold text-green-500 uppercase flex items-center gap-2">
                +4 Marks
              </span>
              <span className="text-[10px] font-bold text-red-500 uppercase flex items-center gap-2">
                -1 Negative
              </span>
            </div>
          </div>

          {/* Question Body */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar">
            <div className="max-w-4xl mx-auto space-y-6">
              <h3 className="text-base md:text-lg font-bold text-gray-200 leading-relaxed max-w-3xl">
                {questions[currentQuestion]?.questionText}
              </h3>

              <div className="space-y-4">
                {questions[currentQuestion]?.options.map((option, idx) => (
                  <label
                    key={idx}
                    className={`flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-all group ${selectedOption === idx
                      ? 'bg-lh-purple/10 border-lh-purple'
                      : 'bg-white/5 border-white/5 hover:border-white/20'
                      }`}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 mt-0.5 flex items-center justify-center shrink-0 transition-all ${selectedOption === idx ? 'border-lh-purple' : 'border-gray-600 group-hover:border-gray-400'
                      }`}>
                      {selectedOption === idx && <div className="w-2.5 h-2.5 bg-lh-purple rounded-full" />}
                    </div>
                    <input
                      type="radio"
                      name={`question-${currentQuestion}`}
                      className="hidden"
                      checked={selectedOption === idx}
                      onChange={() => handleOptionSelect(idx)}
                    />
                    <span className={`text-sm ${selectedOption === idx ? 'text-white font-medium' : 'text-gray-400'}`}>
                      {option}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Controls */}
          <div className="h-20 border-t border-white/5 bg-[#111] px-6 flex items-center justify-between shrink-0 gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={handleMarkForReview}
                className="px-4 py-2.5 rounded-lg border border-purple-500/30 text-purple-400 text-[10px] font-black uppercase tracking-widest hover:bg-purple-500/10 transition-all flex items-center gap-2"
              >
                <Bookmark size={14} /> Review
              </button>
              <button
                onClick={handleClearResponse}
                className="px-4 py-2.5 rounded-lg border border-white/10 text-gray-400 text-[10px] font-black uppercase tracking-widest hover:bg-white/5 transition-all flex items-center gap-2"
              >
                <RotateCcw size={14} /> Clear
              </button>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => navigateToQuestion(currentQuestion - 1)}
                disabled={currentQuestion === 0}
                className={`px-6 py-2.5 rounded-lg border border-white/10 text-gray-400 text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${currentQuestion === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/5'
                  }`}
              >
                <ArrowRight size={14} className="rotate-180" /> Previous
              </button>
              <button
                onClick={handleSaveAndNext}
                className="px-8 py-2.5 bg-lh-purple text-white rounded-lg text-[10px] font-black uppercase tracking-widest shadow-lg shadow-lh-purple/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
              >
                Save & Next <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </main>

        {/* Right: Palette (Sidebar) */}
        <aside className={`
            fixed inset-y-0 right-0 z-30 w-80 bg-[#151515] border-l border-white/5 transform transition-transform duration-300 lg:relative lg:translate-x-0
            ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}
        `}>
          <div className="flex flex-col h-full">
            {/* Webcam Feed */}
            <div className="p-4 bg-black border-b border-white/5 flex justify-center">
              <div className="relative w-48 h-36 bg-black rounded-lg overflow-hidden border-2 border-lh-purple shadow-lg shadow-lh-purple/20">
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  mirrored={true}
                  screenshotFormat="image/jpeg"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 flex items-center gap-1 bg-red-500/80 px-2 py-0.5 rounded text-[8px] font-black text-white uppercase tracking-widest animate-pulse">
                  <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping" /> REC
                </div>
              </div>
            </div>

            {/* User Profile Mock */}
            <div className="p-6 border-b border-white/5 flex items-center gap-4 bg-[#1a1a1a]">
              <div className="w-12 h-12 bg-lh-purple rounded-full flex items-center justify-center text-white font-black text-lg">
                <User size={24} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">{user?.firstName ? `${user.firstName} ${user.lastName || ''}` : user?.email || 'Candidate'}</h4>
                <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Enrollment: {new Date().getFullYear()}-CSCA</p>
              </div>
            </div>

            {/* Legend */}
            <div className="p-6 grid grid-cols-2 gap-3 border-b border-white/5 bg-[#111]">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded bg-green-500 text-[8px] flex items-center justify-center text-white font-bold">{Object.values(questionStatus).filter(s => s === 'answered').length}</span>
                <span className="text-[9px] font-bold text-gray-400 uppercase">Answered</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded bg-red-500 text-[8px] flex items-center justify-center text-white font-bold">{Object.values(questionStatus).filter(s => s === 'not_answered').length}</span>
                <span className="text-[9px] font-bold text-gray-400 uppercase">Not Answered</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded bg-white/5 border border-white/10 text-[8px] flex items-center justify-center text-white font-bold">{Object.values(questionStatus).filter(s => s === 'not_visited').length}</span>
                <span className="text-[9px] font-bold text-gray-400 uppercase">Not Visited</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded bg-purple-500 text-[8px] flex items-center justify-center text-white font-bold">{Object.values(questionStatus).filter(s => s.startsWith('marked')).length}</span>
                <span className="text-[9px] font-bold text-gray-400 uppercase">Review</span>
              </div>
            </div>

            {/* Question Grid */}
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
              <h4 className="text-[10px] font-black text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                <LayoutGrid size={12} className="text-lh-purple" /> Question Palette
              </h4>
              <div className="grid grid-cols-4 gap-3">
                {questions.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => navigateToQuestion(idx)}
                    className={`h-10 w-10 rounded-lg text-xs font-bold transition-all border ${getStatusColor(questionStatus[idx] || 'not_visited')
                      } ${currentQuestion === idx ? 'ring-2 ring-white ring-offset-2 ring-offset-black' : ''}`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="p-6 border-t border-white/5 bg-[#111]">
              <button
                onClick={handleFinalSubmit}
                className="w-full py-3 bg-white/5 border border-white/10 text-gray-300 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-green-600 hover:text-white hover:border-green-600 transition-all flex items-center justify-center gap-3"
              >
                Success_Submit <Save size={14} />
              </button>
            </div>
          </div>
        </aside>

        {/* Mobile Overlay */}
        {isSidebarOpen && (
          <div className="fixed inset-0 bg-black/80 z-20 lg:hidden backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)} />
        )}
      </div>
      <ChatWidget
        socket={socket}
        room={`${activeExam.examId}_${user._id || user.id}_${activeExam.id}`}
        currentUser={user}
        role="student"
      />
      <audio ref={audioRef} autoPlay />
    </div>
  );
};

export default ExamPlayer;
