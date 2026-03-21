"use client";
import { useState, useEffect, useRef } from "react";
import { Send, User, Shield, Loader2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const API = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

export default function ChatWindow({ requestId, title, onClose }: { requestId: number, title: string, onClose: () => void }) {
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    const loadMessages = async (showLoading = false) => {
        if (showLoading) setLoading(true);
        const token = localStorage.getItem("api_token");
        try {
            const res = await fetch(`${API}/chat/messages/${requestId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                setMessages(data.data);
            }
        } catch (err) {
            console.error("Chat fetch error", err);
        } finally {
            if (showLoading) setLoading(false);
        }
    };

    // Initial load
    useEffect(() => {
        loadMessages(true);
        // Polling for "real-time" Feel
        const interval = setInterval(() => loadMessages(false), 3000);
        return () => clearInterval(interval);
    }, [requestId]);

    // Scroll to bottom on new messages
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || sending) return;

        setSending(true);
        const token = localStorage.getItem("api_token");
        try {
            const res = await fetch(`${API}/chat/send/${requestId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ message: newMessage })
            });
            const data = await res.json();
            if (data.success) {
                setMessages([...messages, data.data]);
                setNewMessage("");
            }
        } catch (err) {
            console.error("Send error", err);
        } finally {
            setSending(false);
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed bottom-6 right-6 w-full max-w-[400px] h-[600px] bg-background border border-border shadow-2xl z-[100] flex flex-col"
        >
            {/* Header */}
            <div className="p-4 border-b border-border bg-muted/30 flex items-center justify-between">
                <div>
                    <h3 className="text-sm font-display font-semibold truncate max-w-[200px]">{title}</h3>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-[10px] font-mono-label uppercase tracking-widest text-muted-foreground">Support Sync Active</span>
                    </div>
                </div>
                <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
                    <X size={18} />
                </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
                {loading && messages.length === 0 ? (
                    <div className="h-full flex items-center justify-center">
                        <Loader2 className="animate-spin text-accent" size={24} />
                    </div>
                ) : messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center px-6">
                        <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-4 text-accent">
                            <Shield size={24} />
                        </div>
                        <p className="text-sm font-medium mb-1">Secure Channel Established</p>
                        <p className="text-xs text-muted-foreground">Send a message to start conversing with our team.</p>
                    </div>
                ) : (
                    messages.map((msg, index) => (
                        <div key={msg.id || index} className={`flex ${msg.sender_type === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[85%] group`}>
                                <div className={`px-4 py-2.5 text-sm ${
                                    msg.sender_type === 'user' 
                                        ? 'bg-primary text-primary-foreground' 
                                        : 'bg-muted border border-border'
                                }`}>
                                    {msg.message}
                                </div>
                                <div className={`mt-1 flex items-center gap-1.5 text-[9px] font-mono-label uppercase tracking-tighter text-muted-foreground ${msg.sender_type === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    {msg.sender_type === 'admin' ? <Shield size={8} /> : <User size={8} />}
                                    <span>{msg.sender_type}</span>
                                    <span>•</span>
                                    <span>{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Input */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-border bg-muted/10">
                <div className="relative flex items-center">
                    <input 
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your reply..."
                        className="w-full bg-background border border-border px-4 py-3 pr-12 text-sm focus:outline-none focus:border-accent transition-colors"
                    />
                    <button 
                        type="submit"
                        disabled={!newMessage.trim() || sending}
                        className="absolute right-2 p-2 text-accent hover:text-primary transition-colors disabled:opacity-30"
                    >
                        {sending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} strokeWidth={1.5} />}
                    </button>
                </div>
            </form>
        </motion.div>
    );
}
