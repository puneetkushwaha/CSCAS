
import React, { useEffect, useRef } from 'react';
import { useCart } from '../context/CartContext';
import { X, Trash2, ShoppingBag, ArrowRight, Minus, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const CartDrawer = () => {
    const { isCartOpen, setIsCartOpen, cartItems, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
    const drawerRef = useRef(null);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (drawerRef.current && !drawerRef.current.contains(event.target) && isCartOpen) {
                setIsCartOpen(false);
            }
        };

        if (isCartOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = 'hidden'; // Prevent scroll when open
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = 'unset';
        };
    }, [isCartOpen, setIsCartOpen]);

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-[#0a0515]/60 backdrop-blur-sm z-50 transition-opacity duration-300 ${isCartOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
            />

            {/* Drawer */}
            <div
                ref={drawerRef}
                className={`fixed top-0 right-0 h-full w-full md:w-[450px] bg-[#0A0A0A] border-l border-white/10 z-50 transform transition-transform duration-500 cubic-bezier(0.16, 1, 0.3, 1) ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="p-6 border-b border-white/10 flex items-center justify-between bg-[#0a0515]/50 backdrop-blur-xl">
                        <div className="flex items-center gap-3">
                            <div className="bg-lh-purple/20 p-2 rounded-lg">
                                <ShoppingBag className="w-5 h-5 text-lh-purple" />
                            </div>
                            <h2 className="text-xl font-bold text-white tracking-tight">Your Cart</h2>
                            <span className="bg-white/10 text-xs font-bold px-2 py-0.5 rounded-full text-gray-400">
                                {cartItems.length}
                            </span>
                        </div>
                        <button
                            onClick={() => setIsCartOpen(false)}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors group"
                        >
                            <X className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors" />
                        </button>
                    </div>

                    {/* Cart Items */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                        {cartItems.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-50">
                                <ShoppingBag className="w-16 h-16 text-gray-600 mb-2" />
                                <h3 className="text-lg font-bold text-gray-300">Your cart is empty</h3>
                                <p className="text-sm text-gray-500 max-w-[200px]">
                                    Looks like you haven't added any certifications yet.
                                </p>
                                <button
                                    onClick={() => setIsCartOpen(false)}
                                    className="mt-4 px-6 py-2 bg-white/5 border border-white/10 rounded-full text-sm font-bold text-white hover:bg-white/10 transition-colors"
                                >
                                    Start Shopping
                                </button>
                            </div>
                        ) : (
                            cartItems.map((item) => (
                                <div key={item.id} className="bg-white/5 border border-white/5 rounded-2xl p-4 flex gap-4 group hover:border-white/10 transition-all">
                                    {/* Icon Box */}
                                    <div className={`w-20 h-20 rounded-xl bg-gradient-to-br ${item.color || 'from-gray-700 to-gray-900'} p-0.5 shrink-0`}>
                                        <div className="w-full h-full bg-[#0a0515] rounded-xl flex items-center justify-center">
                                            {/* Clone icon to enforce size if valid, else fallback */}
                                            {React.isValidElement(item.icon) ? (
                                                React.cloneElement(item.icon, { className: "w-8 h-8 text-white" })
                                            ) : (
                                                <ShoppingBag className="w-8 h-8 text-white" />
                                            )}
                                        </div>
                                    </div>

                                    {/* Details */}
                                    <div className="flex-1 flex flex-col justify-between">
                                        <div>
                                            <div className="flex justify-between items-start">
                                                <h3 className="font-bold text-white leading-tight">{item.title}</h3>
                                                <button
                                                    onClick={() => removeFromCart(item.id)}
                                                    className="text-gray-500 hover:text-lh-purple transition-colors p-1 -mr-2 -mt-2"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <p className="text-xs text-gray-400 mt-1">{item.code} • {Array.isArray(item.category) ? item.category[0] : item.category}</p>
                                        </div>

                                        <div className="flex items-center justify-between mt-3">
                                            <div className="flex items-center gap-3 bg-[#0a0515]/50 rounded-lg p-1 border border-white/5">
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    className="w-6 h-6 flex items-center justify-center hover:bg-white/10 rounded-md transition-colors text-gray-400 hover:text-white"
                                                >
                                                    <Minus className="w-3 h-3" />
                                                </button>
                                                <span className="text-xs font-bold text-white w-4 text-center">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="w-6 h-6 flex items-center justify-center hover:bg-white/10 rounded-md transition-colors text-gray-400 hover:text-white"
                                                >
                                                    <Plus className="w-3 h-3" />
                                                </button>
                                            </div>
                                            <span className="font-bold text-white">${(item.price * item.quantity).toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Footer */}
                    {cartItems.length > 0 && (
                        <div className="p-6 border-t border-white/10 bg-[#0a0515]/50 backdrop-blur-xl space-y-4">
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm text-gray-400">
                                    <span>Subtotal</span>
                                    <span>${cartTotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-400">
                                    <span>Taxes (Est.)</span>
                                    <span>Calculated at checkout</span>
                                </div>
                                <div className="flex justify-between text-lg font-black text-white pt-2 border-t border-white/10">
                                    <span>Total</span>
                                    <span>${cartTotal.toLocaleString()}</span>
                                </div>
                            </div>


                            <Link
                                to="/checkout"
                                onClick={() => setIsCartOpen(false)}
                                className="w-full py-4 bg-lh-purple hover:bg-white hover:text-black text-white font-black uppercase tracking-widest text-sm rounded-xl transition-all shadow-[0_0_20px_rgba(188,19,254,0.3)] flex items-center justify-center gap-2 group"
                            >
                                Checkout Now
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>

                            <button
                                onClick={clearCart}
                                className="w-full text-xs text-gray-500 hover:text-lh-purple transition-colors text-center"
                            >
                                Clear Cart
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default CartDrawer;
