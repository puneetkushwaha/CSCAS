import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Clock, AlertTriangle, ArrowRight, CheckCircle2, ShieldAlert, Activity, Lock, Laptop } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ExamPlayer = () => {
  const navigate = useNavigate();
  const [phase, setPhase] = useState('loading'); // loading, waiting, active, completed
  const [activeExam, setActiveExam] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [examTimer, setExamTimer] = useState(3600); // 1 hour in seconds
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});

  const questions = [
    {
      id: 1,
      question: "What is the primary function of a network firewall?",
      options: [
        "To speed up internet connectivity",
        "To monitor and control incoming/outgoing network traffic",
        "To physically block intruders from entering a server room",
        "To store backup copies of sensitive data"
      ],
      correct: 1
    },
    {
      id: 2,
      question: "Which term describes a fraudulent attempt to obtain sensitive information by disguising as a trustworthy entity in electronic communication?",
      options: [
        "Bluejacking",
        "Phishing",
        "Skimming",
        "Spamming"
      ],
      correct: 1
    },
    {
      id: 3,
      question: "What does SSL (Secure Sockets Layer) primarily provide?",
      options: [
        "Automatic virus removal",
        "High-speed data transfer",
        "Encrypted communication between a web server and a browser",
        "Physical security for network hardware"
      ],
      correct: 2
    },
    {
      id: 4,
      question: "In cybersecurity, what does the 'CIA Triad' stand for?",
      options: [
        "Centralized Intelligence Agency",
        "Confidentiality, Integrity, and Availability",
        "Code, Infrastructure, and Application",
        "Click, Install, and Activate"
      ],
      correct: 1
    },
    {
      id: 5,
      question: "An exploit that takes advantage of a software vulnerability that is unknown to the vendor is called a:",
      options: [
        "Brute force attack",
        "SQL injection",
        "Zero-day exploit",
        "Ransomware"
      ],
      correct: 2
    },
    {
      id: 6,
      question: "Which of these is the most secure method for Multi-Factor Authentication (MFA)?",
      options: [
        "SMS-based codes",
        "Security questions (e.g., 'Mother's maiden name')",
        "Hardware security keys (e.g., YubiKey)",
        "A shared password among team members"
      ],
      correct: 2
    },
    {
      id: 7,
      question: "What is the main goal of a 'Denial of Service' (DoS) attack?",
      options: [
        "To steal credit card information",
        "To make a machine or network resource unavailable to its intended users",
        "To decrypt highly sensitive passwords",
        "To install Bitcoin mining software on a server"
      ],
      correct: 1
    },
    {
      id: 8,
      question: "What is the purpose of 'Salting' in password hashing?",
      options: [
        "To make passwords easier to remember",
        "To increase the speed of the hashing algorithm",
        "To prevent 'Rainbow Table' attacks by adding unique data to each password",
        "To obscure the length of the original password"
      ],
      correct: 2
    },
    {
      id: 9,
      question: "Which protocol is considered the secure alternative to Telnet?",
      options: [
        "HTTP",
        "SSH (Secure Shell)",
        "FTP",
        "SMTP"
      ],
      correct: 1
    },
    {
      id: 10,
      question: "What is 'Social Engineering' in the context of security?",
      options: [
        "The process of building social media networks",
        "Manipulating people into divesting confidential information",
        "A method for optimizing server hardware",
        "Writing code for social interaction features"
      ],
      correct: 1
    }
  ];

  useEffect(() => {
    // 1. Fullscreen Enforcement
    const enterFullscreen = async () => {
      try {
        if (!document.fullscreenElement) {
          await document.documentElement.requestFullscreen();
        }
      } catch (err) {
        console.error("Fullscreen blocked:", err);
      }
    };

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && phase === 'active') {
        alert("WARNING: Fullscreen Mode is Required! The exam will be paused or terminated if you exit again.");
        enterFullscreen();
      }
    };

    // 2. Anti-Tab Switching / Visibility Change (STRICT)
    const handleVisibilityChange = () => {
      if (document.hidden && phase === 'active') {
        alert("WARNING: Tab Switching Detected! This is a severe violation.");
        // In a real high-security app, you might auto-submit here:
        // handleFinalSubmit(); 
      }
    };

    // 3. Prevent Refresh / Navigation
    const handleBeforeUnload = (e) => {
      if (phase === 'active') {
        e.preventDefault();
        e.returnValue = "Are you sure? Your exam progress will be lost.";
        return e.returnValue;
      }
    };

    // 4. Input Blocking (Copy/Paste/Context Menu/Keys)
    const handleContextMenu = (e) => e.preventDefault();
    const handleCopyPaste = (e) => {
      e.preventDefault();
      alert("Action Blocked: Copying and Pasting is not allowed.");
    };

    const handleKeyDown = (e) => {
      // Block F5, Ctrl+R (Refresh), F12, DevTools, Alt+Tab, Ctrl+C/V
      if (
        e.key === 'F5' ||
        (e.ctrlKey && e.key === 'r') ||
        (e.ctrlKey && e.key === 'R') ||
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && e.key === 'I') ||
        (e.ctrlKey && e.key === 'c') ||
        (e.ctrlKey && e.key === 'v') ||
        (e.altKey && e.key === 'Tab')
      ) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    };


    if (phase === 'active') {
      enterFullscreen();
      document.addEventListener('fullscreenchange', handleFullscreenChange);
      document.addEventListener('visibilitychange', handleVisibilityChange);
      document.addEventListener('contextmenu', handleContextMenu);
      document.addEventListener('copy', handleCopyPaste);
      document.addEventListener('cut', handleCopyPaste);
      document.addEventListener('paste', handleCopyPaste);
      document.addEventListener('keydown', handleKeyDown);
      window.addEventListener('beforeunload', handleBeforeUnload);
    }

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('copy', handleCopyPaste);
      document.removeEventListener('cut', handleCopyPaste);
      document.removeEventListener('paste', handleCopyPaste);
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [phase]);

  useEffect(() => {
    const syncExam = () => {
      const exams = JSON.parse(localStorage.getItem('scheduledExams') || '[]');
      const now = new Date().getTime();

      // Find an exam that is either starting soon or currently active
      const current = exams.find(e => {
        const diff = e.timestamp - now;
        return diff <= 600000 && diff > -3600000; // Within 10m before or 1h after start
      });

      if (!current) {
        setPhase('no-exam');
        return;
      }

      setActiveExam(current);
      const diff = current.timestamp - now;

      if (diff > 0) {
        setPhase('waiting');
        const minutes = Math.floor(diff / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        setTimeLeft(`${minutes}:${seconds.toString().padStart(2, '0')}`);
      } else {
        setPhase('active');
        // Calculate remaining exam time (1 hour from start)
        const elapsedSeconds = Math.floor(Math.abs(diff) / 1000);
        const remaining = 3600 - elapsedSeconds;
        if (remaining <= 0) {
          setPhase('completed');
        } else {
          setExamTimer(remaining);
        }
      }
    };

    const interval = setInterval(syncExam, 1000);
    syncExam();
    return () => clearInterval(interval);
  }, []);

  // Active exam countdown
  useEffect(() => {
    if (phase === 'active' && examTimer > 0) {
      const t = setInterval(() => setExamTimer(prev => prev - 1), 1000);
      return () => clearInterval(t);
    } else if (phase === 'active' && examTimer <= 0) {
      setPhase('completed');
    }
  }, [phase, examTimer]);

  const formatExamTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleAnswer = (index) => {
    setAnswers({
      ...answers,
      [currentQuestion]: index
    });
  };

  const handleFinalSubmit = () => {
    // Calculate Score
    let correctCount = 0;
    questions.forEach((q, idx) => {
      if (answers[idx] === q.correct) {
        correctCount++;
      }
    });

    const scorePercent = (correctCount / questions.length) * 100;
    const isPassed = scorePercent >= 70;

    // Create History Entry
    const historyItem = {
      exam: activeExam?.examName || 'CSCA Certification Exam',
      date: new Date().toISOString().split('T')[0].replace(/-/g, '_'),
      status: 'Completed',
      score: isPassed ? 'PASS' : 'FAIL',
      timestamp: new Date().getTime()
    };

    // Save to History
    const history = JSON.parse(localStorage.getItem('examHistory') || '[]');
    history.unshift(historyItem); // Add to beginning
    localStorage.setItem('examHistory', JSON.stringify(history));

    // Remove from scheduled exams
    const exams = JSON.parse(localStorage.getItem('scheduledExams') || '[]');
    const updatedExams = exams.filter(e => e.timestamp !== activeExam.timestamp);
    localStorage.setItem('scheduledExams', JSON.stringify(updatedExams));

    // Finalize phase
    setPhase('completed');
  };

  if (phase === 'loading') return null;

  if (phase === 'no-exam') {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6">
        <ShieldAlert size={48} className="text-lh-purple mb-6 opacity-20" />
        <h2 className="text-2xl font-black text-white uppercase tracking-widest mb-4">No Active Session</h2>
        <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em]">Please schedule an exam via the Pearson Dashboard first.</p>
        <button
          onClick={() => navigate('/dashboard/pearson')}
          className="mt-8 px-8 py-3 bg-lh-purple/10 border border-lh-purple/20 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-lh-purple transition-all"
        >
          RETURN_TO_DASHBOARD
        </button>
      </div>
    );
  }

  if (phase === 'waiting') {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(188,19,254,0.05)_0%,transparent_70%)] pointer-events-none"></div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl w-full bg-[#0a0a0a]/70 backdrop-blur-3xl border border-white/5 rounded-[3rem] p-12 text-center relative z-10"
        >
          <div className="flex justify-center mb-8">
            <div className="relative">
              <Clock size={64} className="text-lh-purple opacity-20" />
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <Activity size={24} className="text-lh-purple" />
              </motion.div>
            </div>
          </div>

          <h2 className="text-4xl font-black text-white uppercase tracking-tighter mb-4">Uplink Pending</h2>
          <p className="text-lh-purple text-[11px] font-black uppercase tracking-[0.4em] mb-12">Synchronizing with Certification Node</p>

          <div className="text-7xl font-black text-white tracking-widest bg-white/[0.03] p-12 rounded-[2rem] border border-white/5 shadow-inner mb-8">
            {timeLeft}
          </div>

          <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em] leading-relaxed max-w-sm mx-auto">
            The examination environment is strictly time-gated. Access will be granted automatically once the countdown reaches zero.
            Please ensure your hardware is ready.
          </p>
        </motion.div>
      </div>
    );
  }

  if (phase === 'completed') {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mb-8 border border-green-500/20">
          <CheckCircle2 size={40} className="text-green-500 animate-pulse" />
        </div>
        <h2 className="text-4xl font-black text-white uppercase tracking-tighter mb-4">Mission Finalized</h2>
        <p className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.3em] mb-12">Results have been transmitted to headquarters</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl w-full mb-12">
          <div className="p-8 bg-white/[0.02] border border-white/5 rounded-[2rem] text-left">
            <h4 className="text-[10px] font-black text-lh-purple uppercase tracking-[0.4em] mb-6 flex items-center gap-2">
              <Activity size={14} /> Final_Telemetry
            </h4>
            <div className="space-y-4">
              {[
                { label: 'Network_Stability', value: 'OPTIMAL' },
                { label: 'Verification', value: 'SUCCESSFUL' },
                { label: 'Biometric_HUD', value: 'AUTHORIZED' },
                { label: 'Integrity_Guard', value: 'UNBROKEN' }
              ].map((stat, i) => (
                <div key={i} className="flex justify-between text-[8px] font-black uppercase tracking-widest">
                  <span className="text-gray-500">{stat.label}</span>
                  <span className="text-lh-purple">{stat.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-8 bg-[#0a0a0a] border border-white/5 rounded-[2rem] text-left relative overflow-hidden">
            <div className="relative z-10">
              <h4 className="text-[10px] font-black text-white uppercase tracking-[0.4em] mb-4">Transmission_Log</h4>
              <p className="text-[11px] text-gray-500 font-bold uppercase tracking-widest leading-loose">
                Exam: {activeExam?.examName}<br />
                ID: {Math.random().toString(36).substring(2, 10).toUpperCase()}<br />
                Status: SECURE_SYNC
              </p>
            </div>
            <Shield size={64} className="absolute -bottom-4 -right-4 text-white/[0.02] rotate-12" />
          </div>
        </div>

        <button
          onClick={() => navigate('/dashboard/pearson')}
          className="px-10 py-4 bg-lh-purple text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-2xl hover:scale-105 active:scale-95 transition-all"
        >
          RETURN_TO_BASE
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="max-w-[1240px] mx-auto grid lg:grid-cols-12 gap-12">

        {/* Left: Exam Interface */}
        <div className="lg:col-span-8 space-y-8">
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-white/5">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Shield className="text-lh-purple" size={20} />
                <span className="text-[10px] font-black text-lh-purple uppercase tracking-[0.4em]">Active_Engagement</span>
              </div>
              <h1 className="text-4xl font-black text-white uppercase tracking-tighter">
                {activeExam?.examName}
              </h1>
            </div>
            <div className="flex items-center gap-6 px-8 py-4 bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-xl">
              <div className="text-right">
                <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Time Remaining</p>
                <p className={`text-3xl font-black tracking-widest ${examTimer < 300 ? 'text-red-500 animate-pulse' : 'text-white'}`}>
                  {formatExamTime(examTimer)}
                </p>
              </div>
              <Clock size={32} className={examTimer < 300 ? 'text-red-500' : 'text-lh-purple'} />
            </div>
          </header>

          <main className="space-y-12">
            <div className="relative p-10 bg-[#0a0a0a]/50 backdrop-blur-xl border border-white/5 rounded-[3rem] shadow-2xl overflow-hidden">
              <div className="absolute top-0 right-10 flex gap-1">
                {[...Array(questions.length)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-1 h-3 rounded-b-full transition-all duration-500 ${i === currentQuestion ? 'h-6 bg-lh-purple shadow-[0_0_10px_#bc13fe]' :
                      answers[i] !== undefined ? 'bg-lh-purple/40' : 'bg-white/5'
                      }`}
                  />
                ))}
              </div>

              <span className="text-[11px] font-black text-lh-purple uppercase tracking-[0.5em] mb-8 block">
                Objective_{currentQuestion + 1}_of_10
              </span>

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentQuestion}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-10"
                >
                  <h3 className="text-2xl font-bold text-white leading-relaxed">
                    {questions[currentQuestion].question}
                  </h3>

                  <div className="grid gap-4">
                    {questions[currentQuestion].options.map((option, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleAnswer(idx)}
                        className={`w-full p-6 text-left rounded-2xl border transition-all flex items-center justify-between group ${answers[currentQuestion] === idx
                          ? 'bg-lh-purple/20 border-lh-purple text-white'
                          : 'bg-white/[0.02] border-white/5 text-gray-400 hover:border-white/20 hover:bg-white/[0.04]'
                          }`}
                      >
                        <span className="text-[14px] font-bold">{option}</span>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${answers[currentQuestion] === idx ? 'border-lh-purple bg-lh-purple' : 'border-white/10 group-hover:border-white/30'
                          }`}>
                          {answers[currentQuestion] === idx && <CheckCircle2 size={12} className="text-white" />}
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="flex items-center justify-between pt-8">
              <button
                disabled={currentQuestion === 0}
                onClick={() => setCurrentQuestion(prev => prev - 1)}
                className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${currentQuestion === 0
                  ? 'opacity-20 cursor-not-allowed'
                  : 'hover:bg-white/5 text-gray-400'
                  }`}
              >
                PREVIOUS_NODE
              </button>

              {currentQuestion === questions.length - 1 ? (
                <button
                  onClick={handleFinalSubmit}
                  className="px-10 py-4 bg-green-500 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.4em] shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
                >
                  SUBMIT_PROTOCOL <Shield size={16} />
                </button>
              ) : (
                <button
                  disabled={answers[currentQuestion] === undefined}
                  onClick={() => setCurrentQuestion(prev => prev + 1)}
                  className={`px-10 py-4 bg-lh-purple text-white rounded-xl text-[10px] font-black uppercase tracking-[0.4em] shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3 ${answers[currentQuestion] === undefined ? 'opacity-20 cursor-not-allowed' : ''}`}
                >
                  NEXT_OBJECTIVE <ArrowRight size={16} />
                </button>
              )}
            </div>
          </main>
        </div>

        {/* Right: Security Details (Cleaned) */}
        <div className="lg:col-span-4 hidden lg:block">
          <div className="sticky top-24 space-y-6">
            <div className="p-8 bg-[#0a0a0a]/80 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] shadow-xl relative overflow-hidden text-center">
              <Shield size={48} className="mx-auto text-lh-purple mb-6 opacity-40" />
              <h4 className="text-[10px] font-black text-white uppercase tracking-[0.4em] mb-4">Encryption_Active</h4>
              <p className="text-[8px] text-gray-500 font-bold uppercase tracking-widest leading-relaxed">
                End-to-end encrypted session. Your answers are being synchronized with the secure certification node.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamPlayer;
