import React from 'react';
import { ArrowRight } from 'lucide-react';

const AnnouncementBar = () => {
    return (
        <div className="bg-[#0a0515] border-b border-white/10 relative z-[60]">
            <div className="max-w-[1440px] mx-auto px-4 md:px-8">
                <div className="flex h-10 items-center justify-center">
                    <a
                        href="/certifications/certified-junior-detection-engineer"
                        className="group flex items-center justify-center gap-3 text-xs md:text-sm font-medium text-gray-300 hover:text-white transition-colors w-full"
                    >
                        <span className="bg-primary-600 text-white px-1.5 py-0.5 rounded-[2px] font-bold tracking-wider text-[9px] group-hover:bg-white group-hover:text-primary-600 transition-colors">NEW</span>
                        <span className="truncate">
                            New certification alert! <span className="font-bold text-white ml-1">Certified Junior Detection Engineer</span> has arrived. Find out more.
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-primary-600" />
                    </a>
                </div>
            </div>
        </div>
    );
};

export default AnnouncementBar;
