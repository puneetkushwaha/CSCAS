import { useState } from 'react';
import { Menu, X, ShoppingCart, UserCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import CountrySelector from './CountrySelector';
import CartDrawer from './CartDrawer';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

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
          <nav className="hidden lg:flex items-center gap-6 text-[11px] font-bold uppercase tracking-[0.2em] text-white">
            <Link to="/" className="hover:text-lh-purple transition-all">Home</Link>
            {navLinks.map(link => (
              <Link
                key={link.name}
                to={link.path}
                className="hover:text-lh-purple transition-all"
              >
                {link.name}
              </Link>
            ))}
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

            <Link to="/login" className="hidden md:flex bg-lh-purple text-white px-7 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest items-center gap-2 hover:bg-white hover:text-black transition-all">
              LOGIN
            </Link>

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
                <nav className="flex flex-col gap-8 text-[14px] font-bold uppercase tracking-widest">
                  <Link to="/" className="text-lh-purple border-b border-white/5 pb-4" onClick={() => setIsOpen(false)}>Home</Link>
                  {navLinks.map(item => (
                    <Link
                      key={item.name}
                      to={item.path}
                      className="hover:text-lh-purple transition border-b border-white/5 pb-4"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </nav>
                <div className="flex flex-col gap-4">
                  <div className="pt-4 border-t border-white/5">
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-4 block text-center">Select Region</span>
                    <div className="flex justify-center">
                      <CountrySelector />
                    </div>
                  </div>
                  <Link to="/login" className="bg-lh-purple text-white px-6 py-4 rounded-full text-[12px] font-black uppercase tracking-widest flex items-center justify-center gap-2 w-full mt-4" onClick={() => setIsOpen(false)}>
                    LOGIN
                  </Link>
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
