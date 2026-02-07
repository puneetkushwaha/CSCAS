import React from 'react';
import { motion } from 'framer-motion';
import { Send, Facebook, Instagram, Linkedin, Twitter, Mail, Phone, Shield, MapPin, Globe } from 'lucide-react';

const Footer = () => {
  const navData = [
    {
      title: "Company",
      links: ["About CSCA", "Leadership", "Mission & Vision", "Global Offices", "Contact"]
    },
    {
      title: "Certifications",
      links: ["Junior", "Intermediate", "Professional", "All Certifications"]
    },
    {
      title: "Resources",
      links: ["Blogs", "Whitepapers", "Download Syllabi", "Verify Certificate", "Policies & Handbook", "Support"]
    },
    {
      title: "Partner Programs",
      links: ["Become a Partner", "Partner Directory", "Academic Partner Program"]
    },
    {
      title: "Support",
      links: ["Help Center", "Ticket System", "Refund Policy", "Exam Terms", "Candidate Handbook"]
    },
    {
      title: "Legal",
      links: ["Privacy Policy", "Terms of Use", "Cookie Policy", "Data Protection Policy"]
    }
  ];

  const socialLinks = [
    { Icon: Globe, href: "https://codevirussec.in/", label: "Website" },
    { Icon: Twitter, href: "https://x.com/Codevirussec", label: "Twitter" },
    { Icon: Instagram, href: "https://www.instagram.com/codevirussecurity", label: "Instagram" },
    { Icon: Linkedin, href: "https://www.linkedin.com/company/codevirus-security/posts/?feedView=all", label: "LinkedIn" }
  ];

  return (
    <footer className="relative bg-[#020202] pt-24 pb-8 px-6 md:px-12 overflow-hidden text-white font-sans border-t border-white/5">

      {/* --- BACKGROUND SWIRL DESIGN --- */}
      <div className="absolute bottom-[-10%] left-[-15%] w-[800px] h-[800px] pointer-events-none select-none z-0">
        <div className="absolute inset-0 bg-gradient-to-tr from-lh-blue via-transparent to-transparent blur-[150px] opacity-20 rounded-full"></div>
        <svg viewBox="0 0 500 500" className="w-full h-full opacity-40">
          <defs>
            <linearGradient id="blueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M50,450 Q200,50 450,450"
            fill="none"
            stroke="url(#blueGrad)"
            strokeWidth="5"
            strokeLinecap="round"
            className="opacity-50"
          />
        </svg>
      </div>

      <div className="max-w-[1400px] mx-auto relative z-10">

        {/* --- TOP SECTION: BRAND & NEWSLETTER --- */}
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 mb-16">
          <div className="lg:col-span-4 space-y-8">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-lh-blue rounded-lg flex items-center justify-center">
                  <Shield size={20} className="text-white fill-current" />
                </div>
                <h3 className="text-2xl font-black tracking-tighter uppercase italic">
                  CS<span className="text-lh-blue">CA</span>
                </h3>
              </div>
              <p className="text-[9px] font-black tracking-[0.3em] text-white/40 mt-1 uppercase">Cyber Security Certification Authority</p>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
              The global benchmark in performance-based cybersecurity certifications, empowering the next generation of cyber defenders.
            </p>
          </div>

          <div className="lg:col-span-8">
            <div className="flex flex-col md:flex-row items-center gap-8 w-full">
              <div className="flex items-center gap-6 self-start md:self-center">
                <div className="w-14 h-14 rounded-2xl border border-lh-purple/30 bg-lh-purple/5 flex items-center justify-center text-lh-purple">
                  <Mail size={28} strokeWidth={1.5} />
                </div>
                <h2 className="text-xl md:text-2xl font-black text-white leading-tight max-w-[280px] uppercase tracking-tighter">
                  Take The First Step <br /> Towards Cyber Resilience
                </h2>
              </div>
              <div className="flex-1 w-full relative">
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full bg-transparent border border-lh-purple/50 p-4 rounded-lg text-xs font-bold tracking-widest outline-none focus:border-lh-purple transition-all pr-12 placeholder:text-gray-600"
                />
                <button className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-lh-purple transition-colors">
                  <Send size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="h-px bg-white/5 w-full mb-16"></div>

        {/* --- NAVIGATION GRID --- */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-10 mb-20">
          {navData.map((group, idx) => (
            <div key={idx} className="space-y-6">
              <h4 className="text-white font-black uppercase text-[10px] tracking-[0.2em] flex items-center gap-2">
                <div className="w-1 h-1 bg-lh-purple rounded-full"></div>
                {group.title}
              </h4>
              <ul className="space-y-3">
                {group.links.map((link, i) => (
                  <li key={i}>
                    <a href={link.href} className="text-gray-500 hover:text-white text-xs font-medium transition-colors tracking-wide">
                      {link.text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="h-px bg-white/5 w-full mb-12"></div>

        {/* --- BOTTOM SECTION: CONTACT & SOCIAL --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          <div className="lg:col-span-4 space-y-4">
            <h4 className="text-lh-purple text-xs font-black uppercase tracking-[0.2em]">Contact Us</h4>
            <div className="space-y-1">
              <a href="tel:+919026764985" className="text-2xl font-black text-white tracking-tight hover:text-lh-purple transition-colors block">
                +91 90267 64985
              </a>
              <p className="text-gray-400 text-xs font-bold italic">info@csca.edu.in</p>
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col items-start lg:items-end space-y-6 pr-0 lg:pr-4">
            <div className="flex items-center gap-3">
              <Shield size={16} className="text-lh-purple" />
              <h4 className="text-white font-black uppercase text-xs tracking-widest">Connect Worldwide</h4>
            </div>
            <div className="flex gap-4">
              {socialLinks.map(({ Icon, href, label }, i) => (
                <motion.a
                  key={i}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial="initial"
                  whileHover="hover"
                  className="relative flex items-center justify-center group"
                >
                  {/* Tooltip Label */}
                  <motion.span
                    variants={{
                      initial: { opacity: 0, y: 10, scale: 0.8 },
                      hover: { opacity: 1, y: -45, scale: 1 }
                    }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="absolute z-20 px-3 py-1 bg-lh-purple text-white text-[10px] font-black uppercase tracking-widest rounded-md whitespace-nowrap pointer-events-none shadow-lg shadow-lh-purple/20"
                  >
                    {label}
                    {/* Tiny Arrow */}
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-lh-purple rotate-45"></div>
                  </motion.span>

                  {/* Icon Circle */}
                  <div className="w-10 h-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white group-hover:bg-lh-purple group-hover:border-lh-purple transition-all transform group-hover:scale-110 active:scale-95 shadow-lg shadow-transparent group-hover:shadow-lh-purple/10">
                    <Icon size={18} />
                  </div>
                </motion.a>
              ))}
            </div>
          </div>

        </div>

        {/* --- COPYRIGHT BAR --- */}
        <div className="mt-20 pt-8 border-t border-white/5 text-center">
          <p className="text-[10px] md:text-xs font-medium text-gray-600 tracking-[0.2em] uppercase">
            © 2026 CYBER SECURITY CERTIFICATION AUTHORITY. All rights reserved. Registered in India.
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;