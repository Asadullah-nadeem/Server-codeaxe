import { useEffect, useRef, useState } from 'react';
import { Badge, Button, Container, Dropdown, Form, ListGroup, Spinner } from 'react-bootstrap';
import { Check, CheckCircle, Clock, Info, MessageCircle, MoreVertical, RotateCcw, Search, Send, Trash2, User } from 'react-feather';
import { fetchApi } from '../../utils/api';

const ActiveChats = () => {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [fetchingMessages, setFetchingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const scrollRef = useRef(null);

  const loadChats = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res = await fetchApi('/admin/chat/overview');
      if (res.success) {
        setChats(res.data);
        // Update selected chat status locally if it exists
        if (selectedChat) {
          const current = res.data.find(c => c.id === selectedChat.id);
          if (current) setSelectedChat(current);
        }
      }
    } catch (err) {
      console.error('Failed to load chats', err);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const loadMessages = async (requestId, silent = false) => {
    if (!silent) setFetchingMessages(true);
    try {
      const res = await fetchApi(`/admin/chat/messages/${requestId}`);
      if (res.success) {
        setMessages(res.data);
        setChats(prev => prev.map(c => c.id === requestId ? { ...c, unread_count: 0 } : c));
      }
    } catch (err) {
      console.error('Failed to load messages', err);
    } finally {
      if (!silent) setFetchingMessages(false);
    }
  };

  const handleUpdateStatus = async (status) => {
    if (!selectedChat) return;
    try {
      const res = await fetchApi(`/admin/chat/status/${selectedChat.id}`, {
        method: 'POST',
        body: JSON.stringify({ status })
      });
      if (res.success) {
        loadChats(true);
      }
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleClearChat = async () => {
    if (!selectedChat || !window.confirm('Are you sure you want to clear this entire chat history? This cannot be undone.')) return;
    try {
      const res = await fetchApi(`/admin/chat/clear/${selectedChat.id}`, { method: 'DELETE' });
      if (res.success) {
        setMessages([]);
        loadChats(true);
      }
    } catch (err) {
      alert('Failed to clear chat');
    }
  };

  useEffect(() => {
    loadChats();
    const chatInterval = setInterval(() => loadChats(true), 10000);
    return () => clearInterval(chatInterval);
  }, []);

  useEffect(() => {
    let msgInterval;
    if (selectedChat) {
      loadMessages(selectedChat.id);
      msgInterval = setInterval(() => loadMessages(selectedChat.id, true), 3000);
    }
    return () => clearInterval(msgInterval);
  }, [selectedChat?.id]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || sending || !selectedChat) return;

    setSending(true);
    try {
      const res = await fetchApi(`/admin/chat/send/${selectedChat.id}`, {
        method: 'POST',
        body: JSON.stringify({ message: newMessage })
      });
      if (res.success) {
        setMessages([...messages, res.data]);
        setNewMessage('');
      }
    } catch (err) {
      console.error('Send error', err);
    } finally {
      setSending(false);
    }
  };

  const filteredChats = chats.filter(c =>
    c.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.request_title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <Container fluid className="p-6 text-center mt-10">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3 text-muted">Loading Messaging Center...</p>
      </Container>
    );
  }

  return (
    <Container fluid className="p-0">
      <div className="d-flex" style={{ height: 'calc(100vh - 64px)', overflow: 'hidden' }}>
        {/* Sidebar: Chat List */}
        <div className="bg-white border-end d-flex flex-column" style={{ width: '350px', minWidth: '350px' }}>
          <div className="p-4 border-bottom bg-light bg-opacity-50">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="fw-bold mb-0">Inbox</h4>
              <Badge bg="primary" pill>{chats.filter(c => c.unread_count > 0).length} New</Badge>
            </div>
            <div className="input-group input-group-sm">
              <span className="input-group-text bg-white border-end-0">
                <Search size={14} className="text-muted" />
              </span>
              <Form.Control
                type="text"
                placeholder="Search conversations..."
                className="border-start-0 ps-0 shadow-none border"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="flex-grow-1 overflow-auto custom-scrollbar">
            <ListGroup variant="flush">
              {filteredChats.length > 0 ? filteredChats.map((chat) => (
                <ListGroup.Item
                  key={chat.id}
                  action
                  active={selectedChat?.id === chat.id}
                  onClick={() => setSelectedChat(chat)}
                  className={`p-3 border-bottom border-light d-flex align-items-start gap-3 ${selectedChat?.id === chat.id ? 'bg-light' : ''}`}
                >
                  <div className="position-relative">
                    <div className={`bg-light-${selectedChat?.id === chat.id ? 'primary' : (chat.unread_count > 0 ? 'danger' : 'secondary')} text-${selectedChat?.id === chat.id ? 'primary' : (chat.unread_count > 0 ? 'danger' : 'muted')} rounded-circle p-2`}>
                      <User size={20} />
                    </div>
                    {chat.unread_count > 0 && (
                      <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-white p-1" style={{ fontSize: '0.5rem' }}>
                        {chat.unread_count}
                      </span>
                    )}
                  </div>
                  <div className="flex-grow-1 min-width-0">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <h6 className={`mb-0 text-truncate fw-bold ${selectedChat?.id === chat.id ? 'text-primary' : 'text-dark'}`}>{chat.username}</h6>
                      <small className="text-muted opacity-75" style={{ fontSize: '10px' }}>
                        {chat.latest_message ? new Date(chat.latest_message.created_at).toLocaleDateString([], { month: 'short', day: 'numeric' }) : ''}
                      </small>
                    </div>
                    <p className="small text-muted mb-1 text-truncate fw-semibold">{chat.request_title}</p>
                    <p className="small text-muted mb-0 text-truncate" style={{ fontSize: '0.8rem opacity: 0.8' }}>
                      {chat.latest_message ? (chat.latest_message.sender_type === 'admin' ? 'You: ' : chat.username + ': ') : ''}
                      {chat.latest_message?.message || 'No messages'}
                    </p>
                  </div>
                </ListGroup.Item>
              )) : (
                <div className="p-5 text-center text-muted">
                  <p className="small mb-0">No conversations found</p>
                </div>
              )}
            </ListGroup>
          </div>
        </div>

        {/* Main Content: Chat View */}
        <div className="flex-grow-1 d-flex flex-column bg-light">
          {selectedChat ? (
            <>
              {/* Chat Header */}
              <div className="p-3 bg-white border-bottom d-flex justify-content-between align-items-center shadow-sm z-index-1">
                <div className="d-flex align-items-center gap-3">
                  <div className="bg-primary bg-opacity-10 text-primary rounded-circle p-2">
                    <User size={20} />
                  </div>
                  <div>
                    <div className="d-flex align-items-center gap-2">
                      <h5 className="mb-0 fw-bold">{selectedChat.username}</h5>
                      <Badge bg={selectedChat.status === 'resolved' ? 'success' : (selectedChat.status === 'pending' ? 'warning' : 'info')} className="text-uppercase x-small" style={{ fontSize: '8px' }}>
                        {selectedChat.status}
                      </Badge>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <span className="text-muted x-small text-uppercase">{selectedChat.request_title}</span>
                      <Badge bg="success" className="p-1 rounded-circle" style={{ width: '6px', height: '6px' }}> </Badge>
                      <span className="text-success x-small">Support Thread</span>
                    </div>
                  </div>
                </div>
                <div className="d-flex gap-2">
                  <Button variant="link" className="text-muted p-2" title="View Request Details" onClick={() => alert(`Project Details:\n\nTitle: ${selectedChat.request_title}\nClient: ${selectedChat.username}\nStatus: ${selectedChat.status}`)}>
                    <Clock size={18} />
                  </Button>

                  <Dropdown align="end">
                    <Dropdown.Toggle variant="link" className="text-muted p-2 shadow-none border-0 no-caret">
                      <MoreVertical size={18} />
                    </Dropdown.Toggle>
                    <Dropdown.Menu className="shadow-sm border-0">
                      <Dropdown.Header className="x-small text-uppercase">Project Status</Dropdown.Header>
                      <Dropdown.Item onClick={() => handleUpdateStatus('pending')} className="d-flex align-items-center gap-2 py-2">
                        <RotateCcw size={14} className="text-warning" /> Mark as Pending
                      </Dropdown.Item>
                      <Dropdown.Item onClick={() => handleUpdateStatus('resolved')} className="d-flex align-items-center gap-2 py-2">
                        <CheckCircle size={14} className="text-success" /> Mark as Resolved
                      </Dropdown.Item>
                      <Dropdown.Divider />
                      <Dropdown.Header className="x-small text-uppercase">Management</Dropdown.Header>
                      <Dropdown.Item onClick={handleClearChat} className="d-flex align-items-center gap-2 py-2 text-danger">
                        <Trash2 size={14} /> Clear Chat history
                      </Dropdown.Item>
                      <Dropdown.Item className="d-flex align-items-center gap-2 py-2">
                        <Info size={14} /> View User Profile
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              </div>

              {/* Messages List */}
              <div
                className="flex-grow-1 p-4 overflow-auto d-flex flex-column gap-3 custom-scrollbar"
                ref={scrollRef}
                style={{ backgroundImage: 'radial-gradient(#d1d5db 1px, transparent 1px)', backgroundSize: '20px 20px' }}
              >
                {messages.map((msg, idx) => (
                  <div key={msg.id || idx} className={`d-flex ${msg.sender_type === 'admin' ? 'justify-content-end' : 'justify-content-start'}`}>
                    <div className="d-flex flex-column" style={{ maxWidth: '70%' }}>
                      <div className={`p-3 rounded shadow-sm ${msg.sender_type === 'admin'
                        ? 'bg-primary text-white'
                        : 'bg-white text-dark border'
                        }`}>
                        {msg.message}
                      </div>
                      <div className={`mt-1 d-flex gap-2 align-items-center x-small text-muted ${msg.sender_type === 'admin' ? 'justify-content-end' : 'justify-content-start'}`}>
                        {msg.sender_type === 'admin' && <Check size={10} className="text-primary" />}
                        <span>{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <div className="p-4 bg-white border-top">
                <Form onSubmit={handleSendMessage} className="d-flex gap-2">
                  <Form.Control
                    type="text"
                    placeholder="Type your message here..."
                    className="py-3 px-4 bg-light border-0 shadow-none rounded-pill"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    disabled={sending}
                  />
                  <Button
                    type="submit"
                    variant="primary"
                    className="rounded-circle px-3 py-2 d-flex align-items-center justify-content-center shadow-sm"
                    disabled={!newMessage.trim() || sending}
                  >
                    {sending ? <Spinner animation="border" size="sm" /> : <Send size={20} />}
                  </Button>
                </Form>
              </div>
            </>
          ) : (
            <div className="flex-grow-1 d-flex flex-column align-items-center justify-content-center text-muted">
              <div className="bg-white rounded-circle p-5 mb-4 shadow-sm">
                <MessageCircle size={64} strokeWidth={1} className="text-primary opacity-50" />
              </div>
              <h4 className="fw-bold text-dark">Select a conversation</h4>
              <p className="small">Choose a client from the list on the left to start messaging.</p>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
                .x-small { font-size: 11px; }
                .no-caret::after { display: none !important; }
                .custom-scrollbar::-webkit-scrollbar { width: 5px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #9ca3af; }
                .min-width-0 { min-width: 0; }
            `}</style>
    </Container>
  );
};

export default ActiveChats;
