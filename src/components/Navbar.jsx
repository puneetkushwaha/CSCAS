import { useState } from 'react';
import { Menu, X, ShoppingCart, UserCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'Certifications', path: '/#certifications' },
    { name: 'Careers', path: '/careers' },
    { name: 'Partners', path: '/partners' },
    { name: 'Academic', path: '/#academic' },
    { name: 'Resources', path: '/#resources' }
  ];

  return (
    <header className="fixed top-4 left-0 w-full z-50 px-6">
      <div className="max-w-[1100px] mx-auto bg-white/[0.03] backdrop-blur-3xl border border-white/5 rounded-full px-6 py-3 flex justify-center items-center relative lg:gap-20 gap-10 shadow-none">
        <div className="flex items-center">
          <Link to="/" className="text-xl font-black tracking-tighter shrink-0 cursor-pointer text-white">
            CS<span className="text-lh-purple">CA</span>
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex gap-5 text-[11px] font-bold uppercase tracking-[0.2em] text-white">
          <Link to="/" className="list-none hover:text-lh-purple cursor-pointer transition">Home</Link>
          {navLinks.map(link => (
            <Link
              key={link.name}
              to={link.path}
              className="list-none hover:text-lh-purple cursor-pointer transition"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-6 shrink-0">
          <button className="text-white/70 hover:text-lh-purple transition-all relative">
            <ShoppingCart size={20} />
            <span className="absolute -top-2 -right-2 w-4 h-4 bg-lh-purple rounded-full text-[9px] flex items-center justify-center text-white font-black">0</span>
          </button>

          <Link to="/login" className="hidden sm:flex bg-lh-purple text-white px-8 py-2.5 rounded-full text-[11px] font-black uppercase tracking-widest items-center gap-2 hover:bg-white hover:text-black transition-all">
            <UserCircle2 size={16} /> LOGIN
          </Link>

          {/* Mobile Toggle Button */}
          <button
            className="lg:hidden text-white"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
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
              <nav className="flex flex-col gap-8 text-[14px] font-bold uppercase tracking-widest">
                <Link to="/" className="list-none text-lh-purple cursor-default border-b border-white/5 pb-4" onClick={() => setIsOpen(false)}>Home</Link>
                {navLinks.map(item => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className="list-none hover:text-lh-purple cursor-pointer transition border-b border-white/5 pb-4"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
              <div className="flex flex-col gap-4">
                <button className="bg-lh-purple text-white px-6 py-4 rounded-full text-[12px] font-black uppercase tracking-widest flex items-center justify-center gap-2 w-full">
                  <UserCircle2 size={18} /> LOGIN
                </button>
                <button className="flex items-center justify-center gap-3 text-white/70 py-4 font-bold">
                  <ShoppingCart size={20} /> VIEW CART (0)
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
