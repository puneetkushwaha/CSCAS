import React from 'react';
import { Handshake, Target, Users, Zap } from 'lucide-react';

const PartnerSection = () => {
    const types = ["Authorized Training Partner", "Academic Partner", "Corporate Partner", "Technology Partner"];
    const benefits = ["Revenue sharing", "Trainer materials", "Exam vouchers", "Partner directory listing", "Marketing collateral"];

    return (
        <section className="bg-[#050505] py-32 px-6 md:px-12 border-b border-white/5">

            <div className="max-w-[1300px] mx-auto">
                <div className="grid lg:grid-cols-2 gap-16 md:gap-20 items-center">
                    <div className="text-center lg:text-left">
                        <h4 className="text-lh-purple text-[10px] md:text-xs font-black uppercase tracking-[0.4em] mb-4">Ecosystem</h4>
                        <h2 className="text-[40px] sm:text-5xl md:text-7xl font-[900] leading-[1.1] md:leading-tight text-white uppercase tracking-tighter mb-6 md:mb-8">
                            PARTNER WITH <br className="hidden sm:block" />
                            <span className="outline-text">CSCA</span>
                        </h2>
                        <p className="text-gray-400 text-base md:text-lg mb-10 md:mb-12 max-w-lg mx-auto lg:mx-0">
                            Grow your cybersecurity training business with the CSCA partner ecosystem. We provide the tools, materials, and credentials to empower your learners.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {types.map((type, idx) => (
                                <div key={idx} className="flex items-center gap-3 bg-white/5 p-4 rounded-2xl border border-white/10 hover:border-lh-purple transition-all group">
                                    <div className="w-2 h-2 bg-lh-purple rounded-full"></div>
                                    <span className="text-[10px] md:text-[11px] font-black text-white uppercase tracking-widest">{type}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-[#121212]/50 p-8 md:p-12 rounded-[40px] md:rounded-[60px] border border-white/5 relative overflow-hidden group shadow-2xl">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-lh-purple/10 blur-[100px] group-hover:bg-lh-purple/20 transition-all"></div>
                        <h3 className="text-2xl md:text-3xl font-black text-white uppercase mb-8 md:mb-10">Partner Benefits</h3>
                        <div className="space-y-4 md:space-y-6">
                            {benefits.map((benefit, i) => (
                                <div key={i} className="flex items-center gap-4 text-gray-300 font-bold text-sm tracking-wide text-left">
                                    <Zap size={20} className="text-lh-purple shrink-0" />
                                    {benefit}
                                </div>
                            ))}
                        </div>
                        <button className="mt-10 md:mt-12 w-full py-4 md:py-5 bg-white text-black rounded-full font-black text-[11px] md:text-[12px] uppercase tracking-widest hover:bg-lh-purple hover:text-white transition-all shadow-lg">
                            BECOME A PARTNER
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PartnerSection;
