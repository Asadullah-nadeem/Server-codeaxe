import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button, Form, Spinner, Card, Badge } from 'react-bootstrap';
import { Send, User, Shield, X, Check } from 'react-feather';
import { fetchApi } from '../utils/api';

const AdminChatWindow = ({ requestId, title, onClose }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const scrollRef = useRef(null);

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

    return (
        <Card className="fixed-bottom mb-4 me-4 ms-auto shadow-lg border-0" style={{ width: '400px', height: '550px', zIndex: 1060, right: '20px', borderRadius: '12px', overflow: 'hidden' }}>
            <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center py-3 border-0">
                <div className="d-flex align-items-center gap-2">
                    <div className="bg-white bg-opacity-20 rounded-circle p-1">
                        <User size={18} />
                    </div>
                    <div>
                        <h6 className="mb-0 text-truncate fw-bold" style={{ maxWidth: '200px' }}>{title}</h6>
                        <small className="opacity-75 d-block" style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Support Channel</small>
                    </div>
                </div>
                <div className="d-flex align-items-center gap-1">
                    <Button variant="link" className="text-white p-1 opacity-75 hover-opacity-100" onClick={onClose}>
                        <X size={20} />
                    </Button>
                </div>
            </Card.Header>
            <Card.Body
                ref={scrollRef}
                className="overflow-auto p-3 bg-light custom-scrollbar"
                style={{ height: 'calc(100% - 130px)', backgroundImage: 'linear-gradient(rgba(255,255,255,0.8), rgba(255,255,255,0.8)), url("https://www.transparenttextures.com/patterns/cubes.png")' }}
            >
                {loading && messages.length === 0 ? (
                    <div className="h-100 d-flex align-items-center justify-content-center">
                        <Spinner animation="border" variant="primary" size="sm" />
                    </div>
                ) : messages.length === 0 ? (
                    <div className="h-100 d-flex flex-column align-items-center justify-content-center text-center px-4">
                        <Shield size={40} className="text-muted mb-3 opacity-25" />
                        <p className="small text-muted mb-0 fw-semibold">No history found</p>
                        <p className="x-small text-muted opacity-75">Send the first message to the client.</p>
                    </div>
                ) : (
                    messages.map((msg, index) => (
                        <div key={msg.id || index} className={`mb-3 d-flex ${msg.sender_type === 'admin' ? 'justify-content-end' : 'justify-content-start'}`}>
                            <div style={{ maxWidth: '85%' }}>
                                <div className={`p-3 rounded shadow-sm position-relative ${
                                    msg.sender_type === 'admin'
                                        ? 'bg-primary text-white'
                                        : 'bg-white border text-dark'
                                }`} style={{ fontSize: '0.85rem', borderRadius: msg.sender_type === 'admin' ? '15px 15px 2px 15px' : '15px 15px 15px 2px' }}>
                                    {msg.message}
                                </div>
                                <div className={`mt-1 d-flex gap-2 align-items-center x-small text-muted ${msg.sender_type === 'admin' ? 'justify-content-end' : 'justify-content-start'}`}>
                                    <span className="opacity-75 text-uppercase fw-bold" style={{fontSize: '9px'}}>{msg.sender_type}</span>
                                    <span>{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    {msg.sender_type === 'admin' && <Check size={10} className="text-primary" />}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </Card.Body>
            <Card.Footer className="bg-white border-top p-3">
                <Form onSubmit={handleSendMessage} className="d-flex gap-2 align-items-center bg-light p-1 rounded-pill px-2">
                    <Form.Control
                        type="text"
                        placeholder="Write a reply..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="bg-transparent border-0 shadow-none py-2"
                        style={{ fontSize: '0.85rem' }}
                        autoComplete="off"
                    />
                    <Button
                        type="submit"
                        variant="primary"
                        disabled={!newMessage.trim() || sending}
                        className="rounded-circle d-flex align-items-center justify-content-center p-2 shadow-sm border-0"
                        style={{width: '36px', height: '36px'}}
                    >
                        {sending ? <Spinner animation="border" size="sm" /> : <Send size={14} />}
                    </Button>
                </Form>
            </Card.Footer>

            <style jsx>{`
                .x-small { font-size: 10px; }
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 10px; }
                .hover-opacity-100:hover { opacity: 1 !important; }
            `}</style>
        </Card>
    );
};

export default AdminChatWindow;
