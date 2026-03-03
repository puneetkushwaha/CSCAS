import React, { useState, useEffect, useRef } from 'react';
import { Send, User, Shield, Minimize2, Maximize2, MessageSquare } from 'lucide-react';

const ChatWidget = ({ socket, room, currentUser, role }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const scrollRef = useRef(null);

    useEffect(() => {
        if (!socket) return;

        socket.on('receive_message', (message) => {
            setMessages((prev) => [...prev, message]);
        });

        return () => socket.off('receive_message');
    }, [socket]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!input.trim() || !socket) return;

        const messageData = {
            text: input,
            sender: role,
            userName: currentUser?.firstName || role,
            timestamp: new Date().toISOString()
        };

        socket.emit('send_message', { ...messageData, room });
        // Removed setMessages optimistic update here because the server broadcasts to everyone in the room (including sender)
        setInput('');
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 w-14 h-14 bg-lh-purple text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all z-50"
            >
                <MessageSquare size={24} />
            </button>
        );
    }

    return (
        <div className="fixed bottom-6 right-6 w-80 h-96 bg-[#111] border border-white/10 rounded-2xl flex flex-col shadow-2xl z-50 overflow-hidden">
            {/* Header */}
            <div className="p-4 bg-[#1a1a1a] border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Shield size={16} className="text-lh-purple" />
                    <span className="text-[10px] font-black text-white uppercase tracking-widest">Live Proctor Chat</span>
                </div>
                <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-white">
                    <Minimize2 size={16} />
                </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex flex-col ${msg.sender === role ? 'items-end' : 'items-start'}`}>
                        <div className={`max-w-[80%] p-3 rounded-xl text-xs ${msg.sender === role
                            ? 'bg-lh-purple text-white rounded-tr-none'
                            : 'bg-white/5 text-gray-300 rounded-tl-none'
                            }`}>
                            {msg.text}
                        </div>
                        <span className="text-[8px] text-gray-600 mt-1 uppercase font-bold tracking-tighter">
                            {msg.sender === role ? 'You' : msg.userName} • {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </div>
                ))}
                <div ref={scrollRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSendMessage} className="p-4 bg-[#1a1a1a] border-t border-white/5 flex items-center gap-2">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-lh-purple"
                />
                <button type="submit" className="p-2 bg-lh-purple text-white rounded-lg hover:bg-purple-600 transition-colors">
                    <Send size={14} />
                </button>
            </form>
        </div>
    );
};

export default ChatWidget;
