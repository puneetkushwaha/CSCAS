import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import CertificateHero from "./CertificateHero.jsx";

const CertificateSlider = ({ data, onBack }) => {
    const [index, setIndex] = useState(0);

    const prev = () => { if (index > 0) setIndex(index - 1); };
    const next = () => { if (index < data.length - 1) setIndex(index + 1); };

    return (
        <div className="relative w-full bg-black rounded-[3rem] overflow-hidden flex flex-col border border-white/5 shadow-[0_40px_100px_rgba(0,0,0,0.8)]">

            {/* Back Button */}
            <div className="absolute top-8 left-10 z-[110]">
                <button
                    onClick={onBack}
                    className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-white/40 hover:text-white transition-all duration-300 bg-white/5 px-6 py-3 rounded-full border border-white/10 hover:border-lh-purple hover:bg-lh-purple/20"
                >
                    <span className="text-lh-purple group-hover:text-white transition-colors">←</span> Exit Category View
                </button>
            </div>

            {/* Navigation Arrows */}
            <div className="absolute inset-y-0 left-6 right-6 flex items-center justify-between pointer-events-none z-[110]">
                <button
                    onClick={prev}
                    disabled={index === 0}
                    className="p-5 rounded-3xl bg-black/60 backdrop-blur-xl border border-white/10 text-white hover:bg-lh-purple hover:border-lh-purple hover:scale-110 disabled:opacity-0 pointer-events-auto transition-all duration-500"
                >
                    <ChevronLeft className="w-8 h-8" />
                </button>
                <button
                    onClick={next}
                    disabled={index === data.length - 1}
                    className="p-5 rounded-3xl bg-black/60 backdrop-blur-xl border border-white/10 text-white hover:bg-lh-purple hover:border-lh-purple hover:scale-110 disabled:opacity-0 pointer-events-auto transition-all duration-500"
                >
                    <ChevronRight className="w-8 h-8" />
                </button>
            </div>

            {/* Slider Track */}
            <div
                className="flex transition-transform duration-1000 cubic-bezier(0.4, 0, 0.2, 1)"
                style={{ transform: `translateX(-${index * 100}%)` }}
            >
                {data.map((cert) => (
                    <div key={cert.id} className="min-w-full">
                        <CertificateHero cert={cert} />
                    </div>
                ))}
            </div>

            {/* Progress Bars */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-[110]">
                {data.map((_, i) => (
                    <div
                        key={i}
                        className={`h-1.5 transition-all duration-700 rounded-full ${i === index ? "w-12 bg-lh-purple shadow-[0_0_15px_rgba(188,19,254,0.6)]" : "w-3 bg-white/10"
                            }`}
                    />
                ))}
            </div>
        </div>
    );
};

export default CertificateSlider;
