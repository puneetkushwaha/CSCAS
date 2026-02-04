import { motion } from "framer-motion";
import shield from "../assets/images/shield.png";
import globeImg from "../assets/images/globe.png";

export default function Hero() {
  // Animated Arcs Data
  const arcs = [
    { d: "M 200 400 Q 350 150 500 400", duration: 3, delay: 0 },
    { d: "M 400 450 Q 550 200 700 450", duration: 4, delay: 1 },
    { d: "M 600 380 Q 750 100 900 380", duration: 3.5, delay: 0.5 },
    { d: "M 800 420 Q 950 250 1100 420", duration: 4.5, delay: 1.5 },
    { d: "M 300 350 Q 450 50 600 350", duration: 5, delay: 2 },
  ];

  return (
    <section className="min-h-screen text-white text-center relative overflow-hidden bg-[#050505]">

      {/* Background Earth Element - Desktop Only */}
      <div className="hidden lg:block absolute inset-0 w-full h-full opacity-60 pointer-events-none z-0">
        {/* Layered Glows */}
        <div className="absolute inset-x-0 bottom-0 h-full bg-gradient-to-t from-[#050505] via-transparent to-transparent z-20"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(188,19,254,0.1)_0%,transparent_70%)] z-10"></div>

        {/* Global Earth Image Wrapper - Pulled up on Desktop */}
        <div className="absolute top-[45%] md:top-auto md:bottom-[-25%] lg:bottom-[-30%] left-1/2 -translate-x-1/2 -translate-y-1/2 md:translate-y-0 w-[140%] md:w-full max-w-7xl origin-center">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200"
              alt="Globe"
              className="w-full h-auto object-contain opacity-90 scale-125 md:scale-150 rotate-[15deg] md:rotate-0"
              style={{
                maskImage: 'radial-gradient(circle at 50% 50%, black 20%, transparent 75%)',
                WebkitMaskImage: 'radial-gradient(circle at 50% 50%, black 20%, transparent 75%)'
              }}
            />
            {/* Dedicated bottom overlap fade */}
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#050505] to-transparent z-10"></div>
          </div>

          {/* Animated Connection Arcs */}
          <svg className="absolute inset-0 w-full h-full z-30 opacity-40 scale-125 md:scale-150 translate-y-10 md:translate-y-20" viewBox="0 0 1200 800" fill="none">
            {arcs.map((arc, i) => (
              <g key={i}>
                <path
                  d={arc.d}
                  stroke="url(#arcGradientHeroFinalRefined)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  style={{ opacity: 0.2 }}
                />
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
              <linearGradient id="arcGradientHeroFinalRefined" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#bc13fe" stopOpacity="0" />
                <stop offset="50%" stopColor="#bc13fe" stopOpacity="1" />
                <stop offset="100%" stopColor="#bc13fe" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* Content Wrapper */}
      <div className="relative z-10 max-w-[1400px] mx-auto pt-24 px-6 md:px-12">

        {/* Top: Centered Heading */}
        <div className="text-center mb-10 md:mb-16 lg:mb-20">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[#bc13fe] mb-[10px] font-black uppercase tracking-[0.4em] text-[10px] md:text-[12px]"
          >
            🔐 Globally Recognized Standards
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-[32px] sm:text-[45px] md:text-[60px] lg:text-[75px] leading-[1.1] md:leading-[1] font-black uppercase tracking-tighter px-4"
          >
            CODEVIRUS SECURITY <br />
            <span className="text-lh-purple uppercase">CERTIFICATION AUTHORITY</span>
          </motion.h1>
        </div>

        {/* Middle Area: 3 Columns Wrapper */}
        <div className="grid lg:grid-cols-12 gap-10 items-center mt-6 md:mt-2 lg:mt-0">

          {/* Left Column: Button & Text */}
          <div className="lg:col-span-3 order-2 lg:order-1 text-center lg:text-left space-y-8 lg:-mt-40 z-20">
            <div className="space-y-6">
              <button className="bg-lh-purple text-white px-8 md:px-10 py-3.5 md:py-4 rounded-full text-[11px] md:text-[13px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all flex items-center gap-2 mx-auto lg:mx-0 shadow-lg">
                <div className="w-1.5 md:w-2 h-1.5 md:h-2 bg-current rounded-full"></div> MORE ABOUT US
              </button>
              <p className="text-gray-300 text-sm md:text-lg leading-relaxed font-semibold max-w-sm mx-auto lg:mx-0">
                CSCA empowers professionals worldwide with globally recognized cybersecurity certifications aligned with real-world performance.
              </p>
            </div>
          </div>

          {/* Center Column: Focal Point & Gap */}
          <div className="lg:col-span-6 order-1 lg:order-2 relative flex flex-col items-center justify-center min-h-[350px] md:min-h-[450px]">

            {/* Mobile Hero Centerpiece: User's Requested Shield & Plate Design */}
            <div className="lg:hidden relative flex flex-col items-center justify-center min-h-[350px] py-10">
              {/* Main Shield */}
              <motion.img
                src={shield}
                alt="CSCA Shield"
                className="w-full max-w-[240px] relative z-20 mb-6"
                animate={{ rotateY: 360, y: [-20, 0, -20] }}
                transition={{
                  rotateY: { repeat: Infinity, duration: 25, ease: "linear" },
                  y: { repeat: Infinity, duration: 4, ease: "easeInOut" }
                }}
              />

              {/* Plate / Platform */}
              <div className="relative w-full flex justify-center">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-24 bg-lh-purple/40 blur-[50px] rounded-full animate-pulse"></div>
                <motion.img
                  src={globeImg}
                  className="w-[180%] max-w-[600px] opacity-70 mix-blend-screen relative z-10"
                  animate={{ scale: [1, 1.03, 1] }}
                  transition={{ repeat: Infinity, duration: 6 }}
                />
              </div>
            </div>

            {/* Desktop: Gap where Background Earth shows through */}
            <div className="hidden lg:block w-full h-full"></div>

          </div>

          {/* Right Column: Stats */}
          <div className="lg:col-span-3 order-3 space-y-4 md:space-y-8 lg:-mt-20 z-20">
            <motion.div
              whileHover={{ scale: 1.05, borderColor: '#bc13fe' }}
              className="bg-[#1a0b1e]/60 backdrop-blur-xl border border-white/10 p-5 md:p-7 rounded-[30px] md:rounded-[35px] space-y-1 transition-all cursor-default shadow-2xl lg:translate-x-16"
            >
              <p className="text-white text-xs md:text-base font-bold tracking-tight">Client Satisfaction</p>
              <h2 className="text-4xl md:text-6xl font-black text-lh-purple">98%</h2>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05, borderColor: '#bc13fe' }}
              className="bg-[#1a0b1e]/60 backdrop-blur-xl border border-white/10 p-5 md:p-7 rounded-[30px] md:rounded-[35px] space-y-1 transition-all cursor-default shadow-2xl lg:-translate-x-8"
            >
              <p className="text-white text-xs md:text-base font-bold tracking-tight">Project Completed</p>
              <h2 className="text-4xl md:text-6xl font-black text-lh-purple">26%</h2>
            </motion.div>
          </div>

        </div>

      </div>
    </section>
  );
}
