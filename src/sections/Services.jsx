import React from 'react';

const Certifications = () => {
  const certifications = [
    {
      id: "CJDE",
      name: "Certified Junior Detection Engineer",
      desc: "Build foundational skills in detection engineering, alert creation, event analysis, and malicious pattern identification.",
      pic: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: "CSA",
      name: "Certified SOC Analyst",
      desc: "Learn SOC operations, SIEM analysis, IR workflows, and threat investigation techniques.",
      pic: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: "CTH",
      name: "Certified Threat Hunter",
      desc: "Master hypothesis-based hunting, ATT&CK mapping, log correlation, and adversarial behavior analysis.",
      pic: "https://images.unsplash.com/photo-1558494949-ef010cbdcc51?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: "CCSP",
      name: "Certified Cloud Security Professional",
      desc: "Advanced cloud architecture security, identity governance, and cloud threat detection.",
      pic: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800"
    }
  ];

  return (
    <section className="relative bg-[#050505] py-32 px-6 md:px-12 border-t border-white/5">

      <div className="max-w-[1400px] mx-auto">

        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-20 gap-8 text-center md:text-left">
          <div className="space-y-4 w-full md:w-auto">
            <h4 className="text-lh-purple text-[10px] md:text-xs font-black uppercase tracking-[0.4em]">Professional Growth</h4>
            <h2 className="text-[36px] sm:text-[50px] md:text-[65px] font-[900] leading-[1.1] md:leading-[1] tracking-tighter uppercase text-white">
              POPULAR <br className="hidden sm:block" />
              <span className="outline-text">CERTIFICATIONS</span>
            </h2>
          </div>
          <button className="bg-lh-purple text-white py-4 px-10 rounded-full font-black text-[11px] uppercase tracking-widest hover:bg-white hover:text-black transition-all mx-auto md:mx-0">
            VIEW ALL CERTIFICATIONS
          </button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {certifications.map((cert) => (
            <div key={cert.id} className="group bg-[#0a0a0a] border border-white/5 rounded-[40px] overflow-hidden hover:border-lh-purple/50 transition-all">
              <div className="h-64 relative overflow-hidden">
                <img
                  src={cert.pic}
                  alt={cert.name}
                  className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                />
                <div className="absolute top-6 left-6 bg-lh-purple text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                  {cert.id}
                </div>
              </div>
              <div className="p-8 space-y-4">
                <h3 className="text-xl font-black text-white leading-tight group-hover:text-lh-purple transition-colors">
                  {cert.name}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {cert.desc}
                </p>
                <div className="pt-4 flex items-center gap-2 text-lh-purple text-[10px] font-black uppercase tracking-widest cursor-pointer group-hover:gap-4 transition-all">
                  LEARN MORE <span>→</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Certifications;
