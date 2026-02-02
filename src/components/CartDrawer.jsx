import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';

export default function CartDrawer({ isOpen, onClose }) {
    // Dummy data for now
    const cartItems = [
        { id: 1, name: 'Certified Security Compliance Specialist', price: 499, image: '🌐' },
        { id: 2, name: 'Ethical Hacking Essentials', price: 299, image: '🛡️' }
    ];

    const total = cartItems.reduce((acc, item) => acc + item.price, 0);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed right-0 top-0 h-full w-full max-w-[400px] bg-[#0A0A0A] border-l border-white/10 z-[101] shadow-2xl flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/[0.02]">
                            <div className="flex items-center gap-3">
                                <ShoppingBag className="text-lh-purple" size={20} />
                                <h2 className="text-white font-black uppercase tracking-widest text-sm">Your Payload</h2>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-white/5 rounded-full text-white/50 hover:text-white transition-all"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Items List */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                            {cartItems.length > 0 ? (
                                cartItems.map((item) => (
                                    <div key={item.id} className="group relative bg-white/[0.03] border border-white/5 rounded-2xl p-4 flex gap-4 hover:border-lh-purple/30 transition-all">
                                        <div className="w-16 h-16 bg-white/[0.05] rounded-xl flex items-center justify-center text-2xl">
                                            {item.image}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-white text-xs font-bold uppercase tracking-tight leading-relaxed mb-1 pr-6">
                                                {item.name}
                                            </h3>
                                            <p className="text-lh-purple font-black text-sm">${item.price}</p>
                                        </div>
                                        <button className="absolute top-4 right-4 text-white/20 hover:text-red-500 transition-colors">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-30">
                                    <ShoppingBag size={48} />
                                    <p className="text-white font-bold uppercase tracking-widest text-xs">Cart is Empty</p>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-8 border-t border-white/10 bg-white/[0.02] space-y-6">
                            <div className="flex justify-between items-center">
                                <span className="text-white/50 text-[10px] font-black uppercase tracking-widest">Subtotal</span>
                                <span className="text-white text-xl font-black">${total}</span>
                            </div>
                            <button className="w-full bg-lh-purple text-white py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 hover:shadow-[0_0_30px_rgba(188,19,254,0.4)] transition-all group active:scale-[0.98]">
                                Proceed to Checkout
                                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                            <button
                                onClick={onClose}
                                className="w-full text-white/30 hover:text-white text-[10px] font-black uppercase tracking-widest transition-colors"
                            >
                                Continue Shopping
                            </button>
                        </div>

                        {/* Matrix Background Effect */}
                        <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]"></div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
