import React from 'react';
import { GraduationCap, BookOpen, UserCheck, School } from 'lucide-react';

const AcademicSection = () => {
    const programs = [
        { title: "Student certification bundles", icon: <GraduationCap /> },
        { title: "Faculty training", icon: <UserCheck /> },
        { title: "Campus SOC labs", icon: <School /> },
        { title: "Internship-ready skills programs", icon: <BookOpen /> },
        { title: "Academic licensing", icon: <School /> }
    ];

    return (
        <section className="bg-[#0a0a0a] py-20 md:py-32 px-6 md:px-12">

            <div className="max-w-[1400px] mx-auto text-center mb-12 md:mb-20">
                <h4 className="text-lh-purple text-[10px] md:text-xs font-black uppercase tracking-[0.4em] mb-4">Higher Education</h4>
                <h2 className="text-[36px] sm:text-5xl md:text-8xl font-[900] leading-[1.1] md:leading-tight text-white uppercase tracking-tighter">
                    FOR UNIVERSITIES <br className="hidden sm:block" /> & COLLEGES
                </h2>
            </div>

            <div className="max-w-[1200px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                {programs.map((p, idx) => (
                    <div key={idx} className="bg-white/5 border border-white/10 p-6 md:p-8 rounded-[30px] md:rounded-[40px] flex flex-col items-center text-center gap-4 md:gap-6 hover:bg-lh-purple group transition-all duration-500 hover:scale-105 shadow-xl">
                        <div className="text-lh-purple group-hover:text-white transition-colors p-4 bg-white/5 rounded-3xl">
                            {React.cloneElement(p.icon, { size: 28, strokeWidth: 1.5 })}
                        </div>
                        <p className="text-[10px] md:text-[11px] font-black text-white uppercase tracking-widest leading-relaxed">{p.title}</p>
                    </div>
                ))}
            </div>


        </section>
    );
};

export default AcademicSection;
