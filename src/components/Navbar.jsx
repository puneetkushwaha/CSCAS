import { useState } from 'react';
import { Menu, X, ShoppingCart, UserCircle2, ChevronDown, ChevronRight, Target, Shield, Cloud, Cpu, ClipboardCheck, Wifi, Zap, Database, Monitor, Search, Activity, Lock, Laptop, Skull, ShieldCheck, ShieldAlert, Award, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import CountrySelector from './CountrySelector';
import CartDrawer from './CartDrawer';
import { certifications } from '../data/certificationsData';

export default function Navbar() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showMegaMenu, setShowMegaMenu] = useState(false);

  const categories = [
    { name: 'Offensive Security', key: 'RED TEAM / OFFENSIVE SECURITY', icon: <Target size={16} /> },
    { name: 'Defensive Security', key: 'BLUE TEAM / DEFENSIVE SECURITY', icon: <Shield size={16} /> },
    { name: 'Cloud & Infrastructure', key: 'CLOUD & DEVSECOPS', icon: <Cloud size={16} /> },
    { name: 'Emerging Tech', key: 'AI & EMERGING TECH', icon: <Cpu size={16} /> },
  ];

  const groupedCerts = categories.map(cat => ({
    ...cat,
    certs: certifications.filter(c =>
      Array.isArray(c.category) ? c.category.includes(cat.key) : c.category === cat.key
    )
  }));

  const navLinks = [
    { name: 'Certifications', path: '/certifications' },
    { name: 'Careers', path: '/careers' },
    { name: 'Partners', path: '/partners' },
    { name: 'Academic', path: '/academic' },
    { name: 'Resources', path: '/resources' }
  ];

  return (
    <>
      <header className="fixed top-4 left-0 w-full z-50 px-6 font-plus-jakarta">
        <div className="max-w-[1100px] mx-auto bg-white/[0.03] backdrop-blur-3xl border border-white/5 rounded-2xl px-6 py-3 flex justify-center items-center relative lg:gap-16 gap-6 shadow-none">

          <div className="flex items-center">
            <Link to="/" className="text-xl font-black tracking-tighter shrink-0 cursor-pointer text-white">
              CS<span className="text-lh-purple">CA</span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8 text-[11px] font-black uppercase tracking-[0.2em] text-white/70">
            <Link to="/" className="hover:text-lh-purple transition-all text-white">Home</Link>

            {/* Certifications with Mega Menu */}
            <div
              className="relative py-4 group cursor-pointer"
              onMouseEnter={() => setShowMegaMenu(true)}
              onMouseLeave={() => setShowMegaMenu(false)}
            >
              <div
                className={`flex items-center gap-2 transition-all ${showMegaMenu ? 'text-lh-purple' : 'hover:text-lh-purple'}`}
                onClick={() => navigate('/certifications')}
              >
                Certifications <ChevronDown size={14} className={`transition-transform duration-300 ${showMegaMenu ? 'rotate-180' : ''}`} />
              </div>

              <AnimatePresence>
                {showMegaMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 15, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="absolute top-full left-1/2 -translate-x-1/2 w-[900px] mt-2 bg-[#0a0a0a]/95 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-10 shadow-[0_40px_100px_rgba(0,0,0,0.8)] overflow-hidden"
                  >
                    {/* Background Glow */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-lh-purple/10 blur-[100px] rounded-full -mr-20 -mt-20"></div>

                    <div className="grid grid-cols-4 gap-10 relative z-10">
                      {groupedCerts.map((group) => (
                        <div key={group.key} className="space-y-6">
                          <div className="flex items-center gap-2 text-lh-purple border-b border-white/5 pb-4">
                            {group.icon}
                            <h4 className="text-[10px] font-black tracking-[0.2em] uppercase">{group.name}</h4>
                          </div>
                          <ul className="space-y-4">
                            {group.certs.map(cert => (
                              <li key={cert.id}>
                                <Link
                                  to="/certifications"
                                  state={{ certId: cert.id }}
                                  onClick={() => setShowMegaMenu(false)}
                                  className="group/item flex flex-col gap-1 hover:translate-x-1 transition-transform"
                                >
                                  <span className="text-[11px] font-black text-white group-hover/item:text-lh-purple transition-colors">
                                    {cert.code}
                                  </span>
                                  <span className="text-[9px] font-medium text-white/40 group-hover/item:text-white/70 transition-colors leading-tight">
                                    {cert.title.split(' – ')[1] || cert.title}
                                  </span>
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>

                    <div className="mt-12 pt-8 border-t border-white/5 flex items-center justify-between">
                      <p className="text-[9px] font-medium text-white/30 uppercase tracking-widest">
                        Master the Cyber Battlefield
                      </p>
                      <Link
                        to="/certifications"
                        onClick={() => setShowMegaMenu(false)}
                        className="flex items-center gap-2 text-[10px] font-black text-lh-purple hover:text-white transition-colors"
                      >
                        VIEW ALL COURSES <ChevronRight size={14} />
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link to="/careers" className="hover:text-lh-purple transition-all">Careers</Link>
            <Link to="/partners" className="hover:text-lh-purple transition-all">Partners</Link>
            <Link to="/academic" className="hover:text-lh-purple transition-all">Academic</Link>
            <Link to="/resources" className="hover:text-lh-purple transition-all">Resources</Link>
          </nav>

          <div className="flex items-center gap-4 shrink-0">
            <CountrySelector />

            <button
              onClick={() => setIsCartOpen(true)}
              className="text-white/70 hover:text-lh-purple transition-all relative"
            >
              <ShoppingCart size={18} />
              <span className="absolute -top-2 -right-2 w-4 h-4 bg-lh-purple rounded-full text-[9px] flex items-center justify-center text-white font-black">2</span>
            </button>

            {user ? (
              <Link to="/dashboard" className="hidden md:flex bg-lh-purple text-white px-7 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest items-center gap-2 hover:bg-white hover:text-black transition-all">
                DASHBOARD
              </Link>
            ) : (
              <Link to="/login" className="hidden md:flex bg-lh-purple text-white px-7 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest items-center gap-2 hover:bg-white hover:text-black transition-all">
                LOGIN
              </Link>
            )}

            {/* Mobile Toggle Button */}
            <button
              className="lg:hidden text-white"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          {/* Mobile Menu Drawer */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="absolute top-[calc(100%+15px)] left-0 w-full bg-[#050505]/95 backdrop-blur-[40px] border border-white/10 rounded-[2.5rem] p-10 lg:hidden flex flex-col gap-10 shadow-2xl z-[60]"
              >
                <nav className="flex flex-col gap-6 text-[14px] font-bold uppercase tracking-widest overflow-y-auto max-h-[60vh] pr-4 custom-scrollbar">
                  <Link to="/" className="text-lh-purple border-b border-white/5 pb-4" onClick={() => setIsOpen(false)}>Home</Link>

                  {/* Mobile Certifications Accordion */}
                  <div className="border-b border-white/5">
                    <button
                      onClick={() => setShowMegaMenu(!showMegaMenu)}
                      className="flex items-center justify-between w-full pb-4 hover:text-lh-purple transition-all"
                    >
                      Certifications <ChevronDown size={16} className={`transition-transform ${showMegaMenu ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                      {showMegaMenu && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden bg-white/[0.02] rounded-2xl mb-4 px-4"
                        >
                          {groupedCerts.map(group => (
                            <div key={group.key} className="py-4 border-b border-white/5 last:border-0">
                              <h5 className="text-[10px] font-black text-lh-purple flex items-center gap-2 mb-3">
                                {group.icon} {group.name}
                              </h5>
                              <ul className="flex flex-col gap-3">
                                {group.certs.map(cert => (
                                  <li key={cert.id}>
                                    <Link
                                      to="/certifications"
                                      state={{ certId: cert.id }}
                                      className="text-[12px] font-medium text-white/60 hover:text-white flex items-center justify-between"
                                      onClick={() => setIsOpen(false)}
                                    >
                                      {cert.code} <ChevronRight size={12} className="opacity-30" />
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <Link to="/careers" className="hover:text-lh-purple transition border-b border-white/5 pb-4" onClick={() => setIsOpen(false)}>Careers</Link>
                  <Link to="/partners" className="hover:text-lh-purple transition border-b border-white/5 pb-4" onClick={() => setIsOpen(false)}>Partners</Link>
                  <Link to="/academic" className="hover:text-lh-purple transition border-b border-white/5 pb-4" onClick={() => setIsOpen(false)}>Academic</Link>
                  <Link to="/resources" className="hover:text-lh-purple transition border-b border-white/5 pb-4" onClick={() => setIsOpen(false)}>Resources</Link>
                </nav>
                <div className="flex flex-col gap-4">
                  <div className="pt-4 border-t border-white/5">
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-4 block text-center">Select Region</span>
                    <div className="flex justify-center">
                      <CountrySelector />
                    </div>
                  </div>
                  {user ? (
                    <Link to="/dashboard" className="bg-lh-purple text-white px-6 py-4 rounded-full text-[12px] font-black uppercase tracking-widest flex items-center justify-center gap-2 w-full mt-4" onClick={() => setIsOpen(false)}>
                      DASHBOARD
                    </Link>
                  ) : (
                    <Link to="/login" className="bg-lh-purple text-white px-6 py-4 rounded-full text-[12px] font-black uppercase tracking-widest flex items-center justify-center gap-2 w-full mt-4" onClick={() => setIsOpen(false)}>
                      LOGIN
                    </Link>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
