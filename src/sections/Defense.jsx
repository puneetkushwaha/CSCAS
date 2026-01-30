import { ShieldCheck } from 'lucide-react';

export default function WhyChoose() {
  const points = [
    {
      title: "Globally Aligned Standards",
      desc: "Mapped with NIST, MITRE ATT&CK, ISO 27001, SOC2, and Zero Trust frameworks."
    },
    {
      title: "Hands-On, Role-Based Certifications",
      desc: "Every certification includes scenario-driven labs, simulations, and practical assessments."
    },
    {
      title: "Industry-Validated Credentials",
      desc: "Recognized across SOC teams, cybersecurity enterprises, and academic institutions."
    },
    {
      title: "Performance-Based Certification Exams",
      desc: "Exams are built on practical tasks, real logs, real incidents, and real investigations."
    }
  ];

  return (
    <section className="bg-defense py-20 md:py-32 px-6 md:px-8 relative z-20 -mt-20 mask-gradient-top">

      <div className="max-w-[1400px] mx-auto grid lg:grid-cols-2 gap-12 md:gap-16 items-center">

        {/* Left Column: Heading */}
        <div className="space-y-6 md:space-y-8 text-center lg:text-left">
          <h2 className="text-[40px] sm:text-[55px] md:text-[75px] font-[900] leading-[1] md:leading-[0.9] tracking-tighter uppercase text-white">
            WHY CHOOSE <br />
            <span className="outline-text block my-1 md:my-2">CSCA</span>
            CERTIFICATIONS
          </h2>
          <p className="text-gray-400 text-base md:text-lg leading-relaxed max-w-xl mx-auto lg:mx-0">
            CSCA sets the benchmark for practical cybersecurity excellence, ensuring that certified professionals are ready for the complex challenges of modern enterprise security.
          </p>
          <button className="bg-lh-purple p-4 md:p-5 px-10 md:px-12 rounded-full text-[10px] md:text-[11px] font-black tracking-widest flex items-center gap-3 hover:bg-white hover:text-black transition-all mx-auto lg:mx-0">
            <ShieldCheck size={18} /> WHY CHOOSE US
          </button>
        </div>

        {/* Right Column: Points Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
          {points.map((p, idx) => (
            <div key={idx} className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-[40px] hover:border-lh-purple transition-all group">
              <h3 className="text-xl font-black text-white mb-4 group-hover:text-lh-purple">{p.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed font-medium">{p.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
