import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Shield, Clock, AlertTriangle, ArrowRight, CheckCircle2,
  ShieldAlert, Activity, Lock, Laptop, Menu, X, ChevronRight,
  User, Bookmark, RotateCcw, Save, LayoutGrid, Camera
} from 'lucide-react';
import Webcam from 'react-webcam';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

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
        if (prev?.examId !== current.examId) return current;
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

  // --- Fetch Questions Component ---
  useEffect(() => {
    const fetchQuestions = async () => {
      if (!activeExam?.examId) return;

      // If we already have questions for this exam, don't refetch? 
      // Actually, to solve the "missing added question" bug, we SHOULD refetch on mount/ID change.
      setLoadingQuestions(true);
      try {
        const response = await api.get(`/exams/${activeExam.examId}`);

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

        }
      } catch (error) {
        console.error("Failed to fetch exam questions:", error);
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
  useEffect(() => {
    if (phase !== 'active') return;

    // 1. Prevent Page Reload/Refresh
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = 'Your exam is in progress. Leaving will forfeit your submission.';
      return e.returnValue;
    };

    // 2. Detect Tab Switching
    const handleVisibilityChange = () => {
      if (document.hidden) {
        alert('⚠️ WARNING: Tab switching detected! This may count as a violation.');
        // You could also auto-submit or log violations here
      }
    };

    // 3. Disable Right-Click Context Menu
    const handleContextMenu = (e) => {
      e.preventDefault();
      return false;
    };

    // 4. Disable Keyboard Shortcuts (F12, Ctrl+Shift+I, Ctrl+Shift+C, Ctrl+U)
    const handleKeyDown = (e) => {
      // F12 or Ctrl+Shift+I (Inspect) or Ctrl+Shift+C (Inspect Element) or Ctrl+U (View Source)
      if (
        e.keyCode === 123 || // F12
        (e.ctrlKey && e.shiftKey && e.keyCode === 73) || // Ctrl+Shift+I
        (e.ctrlKey && e.shiftKey && e.keyCode === 67) || // Ctrl+Shift+C
        (e.ctrlKey && e.shiftKey && e.keyCode === 74) || // Ctrl+Shift+J
        (e.ctrlKey && e.keyCode === 85) // Ctrl+U
      ) {
        e.preventDefault();
        return false;
      }
    };

    // 5. Disable Copy/Cut/Paste
    const handleCopy = (e) => {
      e.preventDefault();
      return false;
    };

    const handleCut = (e) => {
      e.preventDefault();
      return false;
    };

    const handlePaste = (e) => {
      e.preventDefault();
      return false;
    };

    // Attach all listeners
    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('copy', handleCopy);
    document.addEventListener('cut', handleCut);
    document.addEventListener('paste', handlePaste);

    // Cleanup
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('cut', handleCut);
      document.removeEventListener('paste', handlePaste);
    };
  }, [phase]);

  // --- Proctoring Logic ---
  const webcamRef = useRef(null);

  const captureAndUpload = useCallback(async () => {
    if (webcamRef.current && activeExam?.examId) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        try {
          await api.post('/proctor/upload-snapshot', {
            examId: activeExam.examId,
            snapshot: imageSrc
          });
        } catch (error) {
          console.error("Proctor upload failed", error);
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
      alert("Submission failed. Please try again.");
    }
  };

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

  // --- Main Exam Interface (NTA Style) ---
  return (
    <div className="flex flex-col h-screen bg-[#111] overflow-hidden">
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
    </div>
  );
};

export default ExamPlayer;
