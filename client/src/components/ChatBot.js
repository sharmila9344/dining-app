import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './ChatBot.css';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const QUICK_REPLIES = [
  "🍕 Best Italian restaurants?",
  "🍣 Recommend sushi spots",
  "🥗 Vegan options near me",
  "💰 Cheap eats under $15",
  "🥂 Fine dining tonight?",
  "🚗 Places with delivery?"
];

const ChatBot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hi! I'm DineBot 🍽️ Your personal dining guide. Ask me for restaurant recommendations, cuisine suggestions, or dining tips!" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [unread, setUnread] = useState(0);
  const endRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (open) { setUnread(0); setTimeout(() => inputRef.current?.focus(), 100); }
  }, [open]);

  const sendMessage = async (text) => {
    const msg = (text || input).trim();
    if (!msg || loading) return;
    setInput('');
    const newMessages = [...messages, { role: 'user', content: msg }];
    setMessages(newMessages);
    setLoading(true);
    try {
      const { data } = await axios.post(`${API}/chat`, {
        message: msg,
        history: newMessages.slice(-10)
      });
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
      if (!open) setUnread(n => n + 1);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I'm having trouble connecting. Please try again! 🙏" }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const clearChat = () => {
    setMessages([{ role: 'assistant', content: "Chat cleared! How can I help you find the perfect dining experience? 🍽️" }]);
  };

  return (
    <>
      <button className={`chat-fab ${open ? 'open' : ''}`} onClick={() => setOpen(!open)} aria-label="Open chat">
        {open ? <span>✕</span> : <><span className="chat-icon">💬</span>{unread > 0 && <span className="badge-dot">{unread}</span>}</>}
      </button>

      <div className={`chatbot-window ${open ? 'visible' : ''}`}>
        <div className="chat-header">
          <div className="chat-header-info">
            <div className="bot-avatar">🍽️</div>
            <div>
              <div className="bot-name">DineBot</div>
              <div className="bot-status"><span className="dot"></span>Online</div>
            </div>
          </div>
          <button className="clear-btn" onClick={clearChat} title="Clear chat">🗑️</button>
        </div>

        <div className="chat-messages">
          {messages.map((msg, i) => (
            <div key={i} className={`chat-bubble-wrapper ${msg.role}`}>
              {msg.role === 'assistant' && <div className="bot-mini-avatar">🍴</div>}
              <div className={`chat-bubble ${msg.role}`}>
                {msg.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="chat-bubble-wrapper assistant">
              <div className="bot-mini-avatar">🍴</div>
              <div className="chat-bubble assistant typing">
                <span></span><span></span><span></span>
              </div>
            </div>
          )}
          {messages.length === 1 && (
            <div className="quick-replies">
              <p>Try asking:</p>
              {QUICK_REPLIES.map((qr, i) => (
                <button key={i} className="quick-reply-btn" onClick={() => sendMessage(qr)}>{qr}</button>
              ))}
            </div>
          )}
          <div ref={endRef} />
        </div>

        <div className="chat-input-area">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Ask about restaurants, cuisine, tips..."
            rows={1}
            disabled={loading}
          />
          <button className="send-btn" onClick={() => sendMessage()} disabled={!input.trim() || loading}>
            {loading ? '⏳' : '➤'}
          </button>
        </div>
      </div>
    </>
  );
};

export default ChatBot;
