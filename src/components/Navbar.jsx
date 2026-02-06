import { useState } from 'react';
import { Menu, X, ShoppingCart, Bell, UserCircle2, ChevronDown, ChevronRight, Target, Shield, Cloud, Cpu, ClipboardCheck, Wifi, Zap, Database, Monitor, Search, Activity, Lock, Laptop, Skull, ShieldCheck, ShieldAlert, Award, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import CountrySelector from './CountrySelector';
import CartDrawer from './CartDrawer';
import { certifications } from '../data/certificationsData';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { user, logout, isLoading } = useAuth();
  const { setIsCartOpen, cartCount } = useCart();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [showMegaMenu, setShowMegaMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const categories = [
    { name: 'Offensive Security', key: 'Red / Offensive', icon: <Target size={16} /> },
    { name: 'Defensive Security', key: 'Blue / Defensive', icon: <Shield size={16} /> },
    { name: 'Cloud & Infrastructure', key: 'Cloud & DevSecOps', icon: <Cloud size={16} /> },
    { name: 'Emerging Tech', key: 'AI & Emerging Tech', icon: <Cpu size={16} /> },
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
        <div className="max-w-[1240px] mx-auto bg-white/[0.03] backdrop-blur-3xl border border-white/5 rounded-2xl px-6 py-2 flex justify-between items-center relative lg:gap-8 gap-6 shadow-none">

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
              className="relative py-3 group cursor-pointer"
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
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 w-4 h-4 bg-lh-purple rounded-full text-[9px] flex items-center justify-center text-white font-black">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Notification Bell */}
            <div className="relative group/notif">
              <button className="text-white/70 hover:text-lh-purple transition-all relative p-2">
                <Bell size={18} />
                {(localStorage.getItem('activeExam') || localStorage.getItem('scheduledExams')) && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-lh-purple rounded-full animate-pulse shadow-[0_0_10px_#bc13fe]"></span>
                )}
              </button>

              {/* Notification Dropdown */}
              <div className="absolute top-full right-0 mt-2 w-72 bg-[#0a0a0a]/95 backdrop-blur-3xl border border-white/10 rounded-2xl p-4 shadow-2xl opacity-0 translate-y-2 pointer-events-none group-hover/notif:opacity-100 group-hover/notif:translate-y-0 group-hover/notif:pointer-events-auto transition-all z-[60]">
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/5">
                  <span className="text-[10px] font-black uppercase tracking-widest text-lh-purple">Mission_Briefings</span>
                  <div className="w-1.5 h-1.5 bg-lh-purple rounded-full animate-pulse"></div>
                </div>

                {(() => {
                  const exams = JSON.parse(localStorage.getItem('scheduledExams') || '[]');
                  if (exams.length > 0) {
                    return (
                      <div className="space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar pr-1">
                        {exams.map((exam, idx) => (
                          <div key={idx} className="p-3 bg-lh-purple/5 border border-lh-purple/10 rounded-xl hover:bg-lh-purple/10 transition-colors cursor-pointer group/item">
                            <div className="flex items-center gap-3 mb-2">
                              <Shield size={14} className="text-lh-purple" />
                              <span className="text-[10px] font-black text-white uppercase">{exam.examName}</span>
                            </div>
                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-relaxed">
                              Scheduled for {new Date(exam.date).toLocaleDateString()}.
                            </p>
                          </div>
                        ))}
                        <button
                          onClick={() => { navigate('/dashboard/pearson'); }}
                          className="w-full py-2 bg-lh-purple/20 border border-lh-purple/30 text-white rounded-lg text-[8px] font-black uppercase tracking-widest hover:bg-lh-purple transition-all mt-2"
                        >
                          VIEW_ALL_MISSIONS
                        </button>
                      </div>
                    );
                  }
                  return (
                    <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest text-center py-4">
                      No active mission objectives detected.
                    </p>
                  );
                })()}
              </div>
            </div>

            {!isLoading && user ? (
              <div className="hidden sm:block relative" onMouseEnter={() => setShowProfileMenu(true)} onMouseLeave={() => setShowProfileMenu(false)}>
                <button className="flex items-center gap-2 bg-white/[0.05] border border-white/10 sm:px-4 px-2 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-lh-purple/20 transition-all">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.displayName} className="w-5 h-5 rounded-full object-cover" />
                  ) : (
                    <UserCircle2 size={18} className="text-lh-purple" />
                  )}
                  <span className="hidden sm:inline-block max-w-[80px] truncate ml-1">{user.firstName || user.displayName || user.email.split('@')[0]}</span>
                  <ChevronDown size={12} className={`transition-transform duration-300 ${showProfileMenu ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {showProfileMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute top-full right-0 mt-2 w-48 bg-[#0a0a0a]/95 backdrop-blur-3xl border border-white/10 rounded-2xl p-2 shadow-2xl z-[60]"
                    >
                      <Link to="/profile" className="flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-white/70 hover:text-lh-purple hover:bg-white/[0.03] rounded-xl transition-all">
                        <UserCircle2 size={16} /> Profile
                      </Link>
                      <Link to="/dashboard" className="flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-white/70 hover:text-lh-purple hover:bg-white/[0.03] rounded-xl transition-all">
                        <Activity size={16} /> Dashboard
                      </Link>
                      <div className="h-[1px] bg-white/5 my-2 mx-2"></div>
                      <button
                        onClick={logout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-red-500/70 hover:text-red-500 hover:bg-white/[0.03] rounded-xl transition-all"
                      >
                        <ShieldAlert size={16} /> Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : !isLoading ? (
              <Link to="/login" className="hidden md:flex bg-lh-purple text-white px-7 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest items-center gap-2 hover:bg-white hover:text-black transition-all">
                LOGIN
              </Link>
            ) : null}

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
                className="absolute top-[calc(100%+15px)] left-0 w-full bg-[#050505]/95 backdrop-blur-[40px] border border-white/10 rounded-[2.5rem] p-8 lg:hidden flex flex-col gap-8 shadow-2xl z-[60] overflow-y-auto max-h-[80vh] custom-scrollbar"
              >
                <nav className="flex flex-col gap-6 text-[14px] font-bold uppercase tracking-widest pr-2">
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
                  {!isLoading && user ? (
                    <div className="flex flex-col gap-4 mt-4">
                      <Link to="/profile" className="bg-white/[0.05] border border-white/10 text-white px-6 py-4 rounded-full text-[12px] font-black uppercase tracking-widest flex items-center justify-center gap-2 w-full" onClick={() => setIsOpen(false)}>
                        <UserCircle2 size={16} /> PROFILE
                      </Link>
                      <Link to="/dashboard" className="bg-lh-purple text-white px-6 py-4 rounded-full text-[12px] font-black uppercase tracking-widest flex items-center justify-center gap-2 w-full" onClick={() => setIsOpen(false)}>
                        <Activity size={16} /> DASHBOARD
                      </Link>
                      <button
                        onClick={() => { logout(); setIsOpen(false); }}
                        className="bg-red-500/10 border border-red-500/20 text-red-500 px-6 py-4 rounded-full text-[12px] font-black uppercase tracking-widest flex items-center justify-center gap-2 w-full"
                      >
                        <ShieldAlert size={16} /> LOGOUT
                      </button>
                    </div>
                  ) : !isLoading ? (
                    <Link to="/login" className="bg-lh-purple text-white px-6 py-4 rounded-full text-[12px] font-black uppercase tracking-widest flex items-center justify-center gap-2 w-full mt-4" onClick={() => setIsOpen(false)}>
                      LOGIN
                    </Link>
                  ) : null}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

    </>
  );
}