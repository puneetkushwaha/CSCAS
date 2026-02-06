import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Cpu } from 'lucide-react';

const Loader = ({ text = "AUTHENTICATING..." }) => {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-xl">
            <div className="relative">
                {/* Outer Ring */}
                <motion.div
                    className="absolute inset-0 rounded-full border-2 border-transparent border-t-lh-purple border-r-lh-purple/50"
                    style={{ width: '200px', height: '200px', marginLeft: '-100px', marginTop: '-100px' }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />

                {/* Inner Ring */}
                <motion.div
                    className="absolute inset-0 rounded-full border-2 border-transparent border-b-white/50 border-l-white/20"
                    style={{ width: '160px', height: '160px', marginLeft: '-80px', marginTop: '-80px' }}
                    animate={{ rotate: -360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                />

                {/* Center Content */}
                <div className="relative z-10 flex flex-col items-center justify-center gap-4">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0.5 }}
                        animate={{ scale: [0.8, 1.1, 0.8], opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        className="relative"
                    >
                        <Shield className="text-lh-purple w-12 h-12" />
                        <motion.div
                            className="absolute inset-0 bg-lh-purple blur-xl opacity-50"
                            animate={{ opacity: [0.3, 0.6, 0.3] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="text-center space-y-2"
                    >
                        <h3 className="text-white font-black text-sm tracking-[0.3em] uppercase">{text}</h3>
                        <div className="flex justify-center gap-1">
                            {[0, 1, 2].map((i) => (
                                <motion.div
                                    key={i}
                                    className="w-1.5 h-1.5 bg-lh-purple rounded-full"
                                    animate={{
                                        y: [0, -5, 0],
                                        opacity: [0.5, 1, 0.5]
                                    }}
                                    transition={{
                                        duration: 0.6,
                                        repeat: Infinity,
                                        delay: i * 0.2,
                                        ease: "easeInOut"
                                    }}
                                />
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Decorative Particles */}
                <div className="absolute inset-0 z-0">
                    <motion.div
                        className="absolute top-1/2 left-1/2 w-1 h-1 bg-white rounded-full"
                        animate={{
                            x: [0, 100, 0],
                            y: [0, -50, 0],
                            opacity: [1, 0, 1]
                        }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    />
                    <motion.div
                        className="absolute top-1/2 left-1/2 w-1 h-1 bg-lh-purple rounded-full"
                        animate={{
                            x: [0, -80, 0],
                            y: [0, 60, 0],
                            opacity: [1, 0, 1]
                        }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear", delay: 1 }}
                    />
                </div>
            </div>
        </div>
    );
};

export default Loader;
