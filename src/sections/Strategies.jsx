import { motion } from 'framer-motion';
import { Clock, ShieldCheck, Database, Eye } from 'lucide-react';

const Careers = () => {
  // Animated Arcs Data
  const arcs = [
    { d: "M 200 400 Q 350 150 500 400", duration: 3, delay: 0 },
    { d: "M 400 450 Q 550 200 700 450", duration: 4, delay: 1 },
    { d: "M 600 380 Q 750 100 900 380", duration: 3.5, delay: 0.5 },
    { d: "M 800 420 Q 950 250 1100 420", duration: 4.5, delay: 1.5 },
    { d: "M 300 350 Q 450 50 600 350", duration: 5, delay: 2 },
  ];

  const industries = [
    // ... existing industries data
    {
      name: "Finance & Banking",
      roles: "SOC Analyst, Detection Engineer, Fraud Investigator",
      risks: "Financial fraud, transactional abuse, APT threats",
      rec: "CJDE, CSA, CTI",
      id: "001"
    },
    {
      name: "Healthcare",
      roles: "IR Analyst, Forensics Analyst",
      risks: "Ransomware, PHI breaches, critical systems compromise",
      rec: "CIRA, CDFP",
      id: "002"
    },
    {
      name: "E-Commerce / Retail",
      roles: "Vulnerability Analyst",
      risks: "Payment fraud, API threats",
      rec: "CVA, CJDE",
      id: "003"
    }
  ];

  return (
    <section className="relative bg-[#050505] py-28 px-6 md:px-12 overflow-hidden border-t border-white/5">

      {/* Dynamic Globe with Connections */}
      <div className="absolute bottom-[-50%] left-1/2 -translate-x-1/2 w-full max-w-7xl opacity-50 pointer-events-none z-0 scale-110">

        {/* Layered Glows */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-lh-blue/20 to-transparent z-20"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.15)_0%,transparent_70%)] z-10"></div>

        {/* Rotating Globe Wrapper */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
          className="relative"
        >
          <img
            src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200"
            alt="Globe"
            className="w-full h-auto object-contain mask-gradient opacity-80"
          />
        </motion.div>

        {/* Animated Connection Arcs Layer */}
        <svg className="absolute inset-0 w-full h-full z-30 opacity-60" viewBox="0 0 1200 800" fill="none">
          {arcs.map((arc, i) => (
            <g key={i}>
              {/* The Static Path */}
              <path
                d={arc.d}
                stroke="url(#arcGradient)"
                strokeWidth="1.5"
                strokeLinecap="round"
                style={{ opacity: 0.2 }}
              />
              {/* The Animated Flowing Dot */}
              <motion.path
                d={arc.d}
                stroke="#bc13fe"
                strokeWidth="2"
                strokeLinecap="round"
                initial={{ pathLength: 0, pathOffset: 0 }}
                animate={{
                  pathLength: [0, 0.4, 0],
                  pathOffset: [0, 1]
                }}
                transition={{
                  duration: arc.duration,
                  repeat: Infinity,
                  delay: arc.delay,
                  ease: "linear"
                }}
              />
            </g>
          ))}
          <defs>
            <linearGradient id="arcGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#bc13fe" stopOpacity="0" />
              <stop offset="50%" stopColor="#bc13fe" stopOpacity="1" />
              <stop offset="100%" stopColor="#bc13fe" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="max-w-[1300px] mx-auto grid lg:grid-cols-12 gap-12 items-start relative z-10 text-center lg:text-left">

        {/* Left Column: Tight Typography */}
        <div className="lg:col-span-5 space-y-6 md:space-y-8">
          <div className="flex items-center justify-center lg:justify-start gap-3 text-lh-purple">
            <Eye size={20} strokeWidth={2.5} />
            <span className="uppercase tracking-[0.4em] text-[10px] md:text-[11px] font-black">Empower Your Future</span>
          </div>

          <h2 className="text-[42px] sm:text-5xl md:text-7xl font-[900] leading-[1.1] md:leading-[1] tracking-tighter uppercase text-white">
            EXPLORE <br />
            CAREER <br />
            <span className="outline-text">PATHS</span>
          </h2>

          <p className="text-gray-400 text-base md:text-lg leading-relaxed max-w-sm mx-auto lg:mx-0">
            Cybersecurity impacts every modern global industry. CSCA guides you through certified career paths tailored for real-world roles.
          </p>

          <button className="group flex items-center gap-4 bg-lh-purple text-white py-4 px-10 rounded-full font-black text-[11px] uppercase tracking-widest hover:bg-white hover:text-black transition-all mx-auto lg:mx-0">
            <div className="w-5 h-5 rounded-full border border-current flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-current rounded-full"></div>
            </div>
            EXPLORE INDUSTRIES
          </button>
        </div>

        {/* Right Column: Industry Cards */}
        <div className="lg:col-span-7 grid md:grid-cols-3 gap-6 items-start">
          {industries.map((ind, i) => (
            <div
              key={ind.id}
              className={`group backdrop-blur-sm border p-8 rounded-[35px] flex flex-col justify-between transition-all duration-300 min-h-[380px] ${i === 1
                ? "bg-lh-purple/30 border-lh-purple/50 md:mt-24"
                : "bg-white/5 border-white/10 hover:border-lh-purple/50"
                }`}
            >
              <div className="space-y-4">
                <span className={`text-4xl font-black ${i === 1 ? "text-white/20" : "text-white/10"}`}>{ind.id}/</span>
                <h3 className="text-2xl font-black text-white">{ind.name}</h3>
                <div className="space-y-4 pt-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-lh-purple font-black">Roles</p>
                    <p className="text-xs text-gray-300 font-medium">{ind.roles}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-lh-purple font-black">Recommended</p>
                    <p className="text-xs text-white font-bold">{ind.rec}</p>
                  </div>
                </div>
              </div>
              <div className="pt-6 border-t border-white/10">
                <p className="text-[9px] uppercase tracking-widest text-gray-400">Primary Risks</p>
                <p className="text-[11px] text-gray-300 italic">{ind.risks}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Careers;