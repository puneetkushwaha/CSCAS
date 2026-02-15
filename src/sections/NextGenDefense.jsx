import React from 'react';
import { Eye, ShieldAlert, Fingerprint, CheckCircle2 } from 'lucide-react';
import ngdPic from '../assets/images/ngd-pic.png';

const Enterprise = () => {
  const leftSolutions = [
    {
      title: "Workforce Training",
      items: ["Bulk team training", "Instructor-led bundles", "Skill-based training design"],
      icon: <Eye size={32} />
    },
    {
      title: "Cyber Range Labs",
      items: ["Realistic SOC labs", "Attack simulation", "Hands-on investigation"],
      icon: <Fingerprint size={32} />
    }
  ];

  const rightSolutions = [
    {
      title: "Team Certification",
      items: ["Role-based programs", "Certification vouchers", "Team-level dashboards"],
      icon: <ShieldAlert size={32} />
    }
  ];

  return (
    <section className="bg-[#0a0a0a] py-32 px-6 md:px-12 border-b border-white/5 overflow-hidden">

      <div className="max-w-[1300px] mx-auto">

        {/* Top Header Row */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10 mb-16 md:mb-24 text-center md:text-left">
          <div className="space-y-4 w-full md:w-auto">
            <div className="flex items-center justify-center md:justify-start gap-2 text-lh-purple">
              <Eye size={18} strokeWidth={2.5} />
              <span className="uppercase tracking-[0.3em] text-[10px] md:text-[11px] font-black">Scalable Security</span>
            </div>
            <h2 className="text-[42px] sm:text-6xl md:text-8xl font-[900] leading-[1.1] md:leading-[1] tracking-tighter text-white uppercase">
              Enterprise <br /> Solutions
            </h2>
          </div>
          <button className="group flex items-center gap-4 bg-lh-purple text-white py-4 px-10 rounded-full font-black text-[11px] uppercase tracking-widest hover:bg-white hover:text-black transition-all mx-auto md:mx-0 shadow-lg">
            CONTACT FOR ENTERPRISE
          </button>
        </div>

        {/* --- Main Illusion Container --- */}
        <div className="relative mt-20 md:mt-32">

          {/* Top 'Cap' Div (Background Illusion for Image) - Hidden on small mobile to avoid clutter */}
          <div className="hidden sm:block absolute top-[-100px] left-1/2 -translate-x-1/2 w-1/3 h-25 bg-[#121212]/90 rounded-t-[40px] z-0"></div>

          {/* Large Card covering all text/image */}
          <div className="relative z-10 bg-[#121212]/90 rounded-[40px] md:rounded-[60px] px-6 md:px-10 py-12 md:py-20 border border-white/5 shadow-2xl">

            <div className="grid lg:grid-cols-3 gap-12 items-center">

              {/* --- 1st Column: Left Content --- */}
              <div className="flex flex-col space-y-12 md:space-y-16 order-2 lg:order-1">
                {leftSolutions.map((sol, idx) => (
                  <div key={idx} className="space-y-4 md:space-y-6 text-center lg:text-left">
                    <div className="text-lh-purple flex justify-center lg:justify-start">
                      {sol.icon}
                    </div>
                    <h3 className="text-xl md:text-2xl font-[900] uppercase tracking-tight text-white">{sol.title}</h3>
                    <div className="flex flex-col items-center lg:items-start space-y-3 md:space-y-4">
                      {sol.items.map((item, i) => (
                        <div key={i} className="flex items-center gap-3 text-gray-400 font-bold text-[10px] md:text-[11px] uppercase tracking-widest">
                          <CheckCircle2 size={16} className="text-lh-purple shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* --- 2nd Column: Image (Floating & Overflow) --- */}
              <div className="relative flex justify-center order-1 lg:order-2 mb-10 lg:mb-0 -mt-32 sm:-mt-40 lg:-mt-64">
                <div className="absolute inset-0 bg-lh-purple/20 blur-[80px] md:blur-[100px] rounded-full scale-75 animate-pulse"></div>
                <img
                  src={ngdPic}
                  alt="Cyber Character"
                  className="relative z-10 w-full max-w-[300px] md:max-w-[450px] h-auto animate-[floatGlow_3s_ease-in-out_infinite]"
                />
              </div>

              {/* --- 3rd Column: Right Content --- */}
              <div className="flex flex-col space-y-12 md:space-y-16 order-3">
                {rightSolutions.map((sol, idx) => (
                  <div key={idx} className="space-y-4 md:space-y-6 text-center lg:text-left">
                    <div className="text-lh-purple flex justify-center lg:justify-start">
                      {sol.icon}
                    </div>
                    <h3 className="text-xl md:text-2xl font-[900] uppercase tracking-tight text-white">{sol.title}</h3>
                    <div className="flex flex-col items-center lg:items-start space-y-3 md:space-y-4">
                      {sol.items.map((item, i) => (
                        <div key={i} className="flex items-center gap-3 text-gray-400 font-bold text-[10px] md:text-[11px] uppercase tracking-widest">
                          <CheckCircle2 size={16} className="text-lh-purple shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                {/* Extra box for balance since left has 2 items */}
                <div className="bg-lh-purple/10 p-6 md:p-8 rounded-[30px] md:rounded-[40px] border border-lh-purple/20 text-center lg:text-left">
                  <h4 className="text-white text-[11px] md:text-xs font-black uppercase tracking-widest mb-2">Enterprise Plus</h4>
                  <p className="text-gray-400 text-[9px] md:text-[10px] leading-relaxed">Customized cyber defense architecture for global organizations.</p>
                </div>
              </div>

            </div>
          </div>
        </div>



      </div>
    </section>
  );
};

export default Enterprise;