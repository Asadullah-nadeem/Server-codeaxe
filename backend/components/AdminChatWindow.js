import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button, Form, Spinner, Card, Badge } from 'react-bootstrap';
import { Send, User, Shield, X, Check, MessageSquare, Clock, Maximize2, Move } from 'react-feather';
import { fetchApi } from '../utils/api';
import router from 'next/router';

const AdminChatWindow = ({ requestId, title, onClose }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const scrollRef = useRef(null);
    
    // Drag State
    const [isDragging, setIsDragging] = useState(false);
    const [position, setPosition] = useState({ x: 24, y: 24 }); // Bottom-Right offsets
    const dragOffset = useRef({ x: 0, y: 0 });

    const loadMessages = useCallback(async (showLoading = false) => {
        if (showLoading) setLoading(true);
        try {
            const res = await fetchApi(`/admin/chat/messages/${requestId}`);
            if (res.success) {
                setMessages(res.data);
            }
        } catch (err) {
            console.error('Admin chat fetch error', err);
        } finally {
            if (showLoading) setLoading(false);
        }
    }, [requestId]);

    useEffect(() => {
        loadMessages(true);
        const interval = setInterval(() => loadMessages(false), 3000);
        return () => clearInterval(interval);
    }, [loadMessages]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || sending) return;

        setSending(true);
        try {
            const res = await fetchApi(`/admin/chat/send/${requestId}`, {
                method: 'POST',
                body: JSON.stringify({ message: newMessage })
            });
            if (res.success) {
                setMessages([...messages, res.data]);
                setNewMessage('');
            }
        } catch (err) {
            console.error('Admin send error', err);
        } finally {
            setSending(false);
        }
    };

    // DRAG LOGIC
    const handleMouseDown = (e) => {
        if (e.target.closest('button')) return; // Don't drag if clicking buttons
        setIsDragging(true);
        // Calculate offset from current BOTTOM-RIGHT position
        dragOffset.current = {
            x: e.clientX + position.x,
            y: e.clientY + position.y
        };
    };

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!isDragging) return;
            // Update BOTTOM-RIGHT offsets
            setPosition({
                x: dragOffset.current.x - e.clientX,
                y: dragOffset.current.y - e.clientY
            });
        };

        const handleMouseUp = () => {
            setIsDragging(false);
        };

        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging]);

    const handleOpenFullScreen = () => {
        router.push(`/admin/active-chats?requestId=${requestId}`);
    };

    return (
        <div 
            className={`admin-chat-popup-container shadow-2xl border-0 ${isDragging ? 'dragging-active' : 'animate-in fade-in zoom-in duration-300'}`}
            style={{ 
                bottom: `${position.y}px`, 
                right: `${position.x}px`,
                cursor: isDragging ? 'grabbing' : 'auto'
            }}
        >
            {/* Header: Draggable vibrant blue */}
            <div 
                className="admin-chat-header d-flex justify-content-between align-items-center px-4 py-3 bg-primary text-white cursor-grab"
                onMouseDown={handleMouseDown}
            >
                <div className="d-flex align-items-center gap-3 select-none">
                    <div className="bg-white bg-opacity-20 rounded-circle p-2 d-flex align-items-center justify-content-center shadow-sm" style={{ width: '38px', height: '38px' }}>
                        <Move size={18} className="opacity-50" />
                    </div>
                    <div>
                        <h6 className="mb-0 fw-bold text-truncate" style={{ maxWidth: '180px' }}>{title}</h6>
                        <div className="d-flex align-items-center gap-1 opacity-75">
                            <div className="status-dot-mini bg-success"></div>
                            <span className="x-small text-uppercase fw-bold ls-1">Support</span>
                        </div>
                    </div>
                </div>
                <div className="d-flex align-items-center gap-1">
                    <Button 
                        variant="link" 
                        className="text-white p-2 rounded-circle hover-bg-white-10 transition-all border-0 shadow-none d-flex align-items-center justify-content-center" 
                        title="Open in Full Messenger"
                        onClick={handleOpenFullScreen}
                    >
                        <Maximize2 size={16} />
                    </Button>
                    <Button 
                        variant="link" 
                        className="text-white p-2 rounded-circle hover-bg-white-10 transition-all border-0 shadow-none d-flex align-items-center justify-content-center" 
                        onClick={onClose}
                    >
                        <X size={20} />
                    </Button>
                </div>
            </div>

            {/* Chat Body */}
            <div
                ref={scrollRef}
                className="admin-chat-body px-4 py-4 custom-scrollbar overflow-auto bg-white"
            >
                {loading && messages.length === 0 ? (
                    <div className="h-100 d-flex flex-column align-items-center justify-content-center text-muted gap-3">
                        <Spinner animation="border" variant="primary" size="sm" />
                        <span className="x-small fw-bold text-uppercase">Authenticating thread...</span>
                    </div>
                ) : messages.length === 0 ? (
                    <div className="h-100 d-flex flex-column align-items-center justify-content-center text-center px-4 opacity-50">
                        <div className="bg-light p-4 rounded-circle mb-4 border shadow-xs">
                           <MessageSquare size={48} className="text-primary" strokeWidth={1} />
                        </div>
                        <p className="small mb-1 fw-bold text-dark">Messenger Initialized</p>
                    </div>
                ) : (
                    <div className="d-flex flex-column gap-4">
                        {messages.map((msg, index) => (
                            <div key={msg.id || index} className={`d-flex ${msg.sender_type === 'admin' ? 'justify-content-end' : 'justify-content-start'}`}>
                                <div className="message-envelope" style={{ maxWidth: '85%' }}>
                                    <div className={`message-bubble p-3 shadow-xs ${
                                        msg.sender_type === 'admin'
                                            ? 'admin-bubble text-white'
                                            : 'user-bubble border text-dark'
                                    }`}>
                                        {msg.message}
                                    </div>
                                    <div className={`mt-2 d-flex gap-2 align-items-center x-small text-muted ${msg.sender_type === 'admin' ? 'justify-content-end pr-1' : 'justify-content-start pl-1'}`}>
                                        {msg.sender_type === 'admin' ? (
                                            <>
                                                <span className="fw-bold text-primary font-monospace" style={{fontSize: '9px'}}>ADMN</span>
                                                <Check size={12} className="text-primary" strokeWidth={3} />
                                                <span className="opacity-75">{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                            </>
                                        ) : (
                                            <>
                                                <span className="fw-bold text-dark font-monospace" style={{fontSize: '9px'}}>USER</span>
                                                <span className="opacity-75">{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="admin-chat-footer px-4 py-3 bg-white border-top">
                <Form onSubmit={handleSendMessage} className="d-flex gap-3 align-items-center">
                    <div className="flex-grow-1 position-relative">
                        <Form.Control
                            type="text"
                            placeholder="Shift your thoughts here..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            className="admin-chat-input py-2 px-3 bg-light border-0 shadow-none"
                            autoComplete="off"
                            disabled={sending}
                        />
                    </div>
                    <Button
                        type="submit"
                        variant="primary"
                        disabled={!newMessage.trim() || sending}
                        className="chat-send-btn rounded-pill d-flex align-items-center justify-content-center border-0 shadow-sm transition-all"
                        style={{ width: '40px', height: '40px' }}
                    >
                        {sending ? <Spinner animation="border" size="sm" /> : <Send size={18} />}
                    </Button>
                </Form>
            </div>

            <style jsx global>{`
                .admin-chat-popup-container {
                    position: fixed;
                    width: 420px;
                    height: 600px;
                    z-index: 9999;
                    background: #ffffff;
                    border-radius: 20px;
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
                    transition: transform 0.2s ease, opacity 0.2s ease;
                }
                
                .dragging-active {
                    opacity: 0.8 !important;
                    transform: scale(1.02);
                    box-shadow: 0 35px 60px -15px rgba(0, 0, 0, 0.3);
                    pointer-events: none;
                }
                .dragging-active * { pointer-events: none; }

                .cursor-grab { cursor: grab; }
                .cursor-grab:active { cursor: grabbing; }

                .admin-chat-header {
                   flex-shrink: 0;
                   user-select: none;
                }

                .admin-chat-body {
                    flex-grow: 1;
                }

                .message-bubble {
                    border-radius: 18px;
                    font-size: 0.9rem;
                    line-height: 1.5;
                }

                .admin-bubble {
                    background: #0d6efd;
                    border-bottom-right-radius: 4px;
                }

                .user-bubble {
                    background: #f8f9fa;
                    border: 1px solid #e9ecef;
                    border-bottom-left-radius: 4px;
                }

                .admin-chat-input {
                    border-radius: 12px;
                }
                
                .ls-1 { letter-spacing: 1px; }
                .hover-bg-white-10:hover { background: rgba(255,255,255,0.1) !important; }
                
                .status-dot-mini {
                    width: 6px;
                    height: 6px;
                    border-radius: 50%;
                }
                .shadow-xs { box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); }
                .select-none { user-select: none; }
            `}</style>
        </div>
    );
};

export default AdminChatWindow;
