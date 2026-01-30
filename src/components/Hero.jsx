import { motion } from "framer-motion";
import shield from "../assets/images/shield.png";
import globe from "../assets/images/globe.png";

export default function Hero() {
  return (
    <section
      className="min-h-screen text-white text-center relative overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: "url('/stars-bg.jpg')" }}
    >

      {/* Lighter Overlay */}
      <div className="absolute inset-0 bg-black/10"></div>

      {/* Bottom Gradient Blend - Deeper Fade */}
      <div className="absolute inset-x-0 bottom-0 h-[450px] bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent z-10"></div>

      {/* Intense Cinematic Sweep Glow */}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-[-150px] w-[140%] max-w-[1500px] h-[500px] bg-[#bc13fe]/30 blur-[200px] rounded-full z-10 animate-pulse"></div>

      {/* Content Wrapper */}
      <div className="relative z-10 max-w-[1400px] mx-auto pt-24 px-6 md:px-12">

        {/* Top: Centered Heading */}
        <div className="text-center mb-10 md:mb-16">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[#bc13fe] mb-[10px] font-black uppercase tracking-[0.4em] text-[9px] md:text-[11px]"
          >
            🔐 Globally Recognized Standards
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-[32px] sm:text-[40px] md:text-[60px] lg:text-[75px] leading-[1.1] md:leading-[1] font-black uppercase tracking-tighter px-4"
          >
            CODEVIRUS SECURITY <br />
            <span className="text-lh-purple uppercase">CERTIFICATION AUTHORITY</span>
          </motion.h1>
        </div>

        {/* Middle Area: 3 Columns Wrapper */}
        <div className="grid lg:grid-cols-12 gap-10 items-center mt-6 md:mt-10">

          {/* Left Column: Button & Text */}
          <div className="lg:col-span-3 order-2 lg:order-1 text-center lg:text-left space-y-8 lg:-mt-40 z-20">
            <div className="space-y-6">
              <button className="bg-lh-purple text-white px-8 md:px-10 py-3.5 md:py-4 rounded-full text-[11px] md:text-[13px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all flex items-center gap-2 mx-auto lg:mx-0 shadow-lg">
                <div className="w-1.5 md:w-2 h-1.5 md:h-2 bg-current rounded-full"></div> MORE ABOUT US
              </button>
              <p className="text-gray-300 text-base md:text-lg leading-relaxed font-semibold max-w-sm mx-auto lg:mx-0">
                CSCA empowers professionals worldwide with globally recognized cybersecurity certifications aligned with real-world performance.
              </p>
            </div>
          </div>

          {/* Center Column: Shield on Plate */}
          <div className="lg:col-span-6 order-1 lg:order-2 relative flex flex-col items-center justify-center min-h-[350px] md:min-h-[550px]">
            {/* Main Shield */}
            <motion.img
              src={shield}
              alt="CSCA Shield"
              className="w-full max-w-[240px] md:max-w-[340px] relative z-20 mb-6"
              animate={{ rotateY: 360, y: [-20, 0, -20] }}
              transition={{
                rotateY: { repeat: Infinity, duration: 25, ease: "linear" },
                y: { repeat: Infinity, duration: 4, ease: "easeInOut" }
              }}
            />

            {/* Plate / Platform */}
            <div className="relative w-full flex justify-center">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] md:w-[60%] h-24 md:h-32 bg-lh-purple/40 blur-[50px] md:blur-[80px] rounded-full animate-pulse"></div>
              <motion.img
                src={globe}
                className="w-[180%] md:w-[140%] max-w-[900px] opacity-70 mix-blend-screen relative z-10"
                animate={{ scale: [1, 1.03, 1] }}
                transition={{ repeat: Infinity, duration: 6 }}
              />
            </div>
          </div>

          {/* Right Column: Stats */}
          <div className="lg:col-span-3 order-3 space-y-6 md:space-y-8 lg:-mt-20 z-20">
            <motion.div
              whileHover={{ scale: 1.05, borderColor: '#bc13fe' }}
              className="bg-[#1a0b1e]/60 backdrop-blur-xl border border-white/10 p-5 md:p-7 rounded-[35px] space-y-1 transition-all cursor-default shadow-2xl lg:translate-x-16"
            >
              <p className="text-white text-sm md:text-base font-bold tracking-tight">Client Satisfaction</p>
              <h2 className="text-4xl md:text-6xl font-black text-lh-purple">98%</h2>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05, borderColor: '#bc13fe' }}
              className="bg-[#1a0b1e]/60 backdrop-blur-xl border border-white/10 p-5 md:p-7 rounded-[35px] space-y-1 transition-all cursor-default shadow-2xl lg:-translate-x-8"
            >
              <p className="text-white text-sm md:text-base font-bold tracking-tight">Project Completed</p>
              <h2 className="text-4xl md:text-6xl font-black text-lh-purple">26%</h2>
            </motion.div>
          </div>

        </div>

      </div>
    </section>
  );
}
