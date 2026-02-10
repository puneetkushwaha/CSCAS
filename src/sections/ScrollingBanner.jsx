import React from 'react';
import { Shield, Lock, Key } from 'lucide-react';
import { motion } from 'framer-motion';

const ScrollingBanner = () => {
  const items = [
    { label: "MITRE ATT&CK", icon: <Shield size={24} /> },
    { label: "NIST FRAMEWORK", icon: <Lock size={24} /> },
    { label: "ISO 27001", icon: <Key size={24} /> },
    { label: "SOC2 COMPLIANT", icon: <Shield size={24} /> },
    { label: "ZERO TRUST", icon: <Lock size={24} /> },
    { label: "CLOUD ALLIANCE", icon: <Key size={24} /> },
  ];

  const doubledItems = [...items, ...items];

  return (
    <div className="bg-lh-purple py-8 overflow-hidden border-y border-white/10 flex items-center">
      <motion.div
        className="flex whitespace-nowrap"
        animate={{ x: [0, -1920] }}
        transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
      >
        {doubledItems.map((item, index) => (
          <div key={index} className="flex items-center mx-16 gap-6">
            <span className="text-white opacity-50">
              {item.icon}
            </span>
            <h2 className="text-white text-3xl md:text-4xl font-[900] tracking-widest uppercase">
              {item.label}
            </h2>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default ScrollingBanner;