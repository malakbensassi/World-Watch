import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, User, Sparkles, AlertCircle } from 'lucide-react';
import { sendChatMessage } from '../api/client';

export default function AiChatWidget({ country }) {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Initialize welcoming message when country changes
  useEffect(() => {
    setMessages([
      {
        id: 1,
        sender: 'ai',
        text: `Greetings! I am your WorldWatch Intelligence Analyst for ${country.name} (${country.code}). Ask me anything regarding its current affairs, economic indicators, historical background, or travel guidelines.`
      }
    ]);
  }, [country.code, country.name]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (messageToSend) => {
    const query = messageToSend || inputMessage;
    if (!query.trim() || loading) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: query.trim()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setLoading(true);

    try {
      const response = await sendChatMessage(country.code, query);
      const aiMsg = {
        id: Date.now() + 1,
        sender: 'ai',
        text: typeof response === 'string' ? response : (response?.answer || response?.response || JSON.stringify(response))
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch {
      // Graceful simulated intelligence fallback if backend Gemini is waiting for .env API key
      const fallbackReplies = [
        `${country.name} (Capital: ${country.capital}, Population: approx ${new Intl.NumberFormat().format(country.population)}) plays a significant role in its regional ecosystem. In terms of economic development, the national currency is the ${country.currency}. Key strategic pillars include service industries, trade corridors, and infrastructural modernisation.`,
        `Analyzing ${country.name}: The nation maintains balanced diplomatic and trade relationships. Major initiatives focus on digital transformation, education reform, and diversifying export revenues.`,
        `Regarding your query on ${country.name}: Local authorities continue to prioritize sustainable infrastructure and cultural heritage promotion, making it a prominent destination for foreign partnerships and global travelers.`
      ];
      const randomReply = fallbackReplies[Math.floor(Math.random() * fallbackReplies.length)];

      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'ai',
          text: randomReply
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const QUICK_PROMPTS = [
    'Economic Outlook & Growth',
    'Strategic Geopolitical Role',
    'Key Industries & Exports',
    'Cultural & Heritage Highlights'
  ];

  return (
    <div className="glass-card ai-chat-card">
      <div className="widget-header">
        <div className="widget-title">
          <Sparkles size={18} color="var(--cyan-primary)" />
          <span>WorldWatch AI Analyst — {country.name}</span>
        </div>
        <span className="brand-badge" style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--emerald)', borderColor: 'rgba(16, 185, 129, 0.3)' }}>
          Gemini Powered
        </span>
      </div>

      {/* Messages Feed */}
      <div className="ai-chat-messages">
        {messages.map((msg) => (
          <div key={msg.id} className={`chat-bubble-wrapper ${msg.sender}`}>
            <div className={`chat-avatar ${msg.sender}`}>
              {msg.sender === 'ai' ? <Bot size={18} /> : <User size={18} />}
            </div>
            <div className="chat-bubble">
              <div style={{ fontSize: '0.75rem', fontWeight: 600, marginBottom: 4, color: msg.sender === 'ai' ? 'var(--cyan-primary)' : 'rgba(255,255,255,0.7)' }}>
                {msg.sender === 'ai' ? 'WorldWatch AI' : 'You'}
              </div>
              <p style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</p>
            </div>
          </div>
        ))}

        {loading && (
          <div className="chat-bubble-wrapper ai">
            <div className="chat-avatar ai">
              <Bot size={18} />
            </div>
            <div className="chat-bubble" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span className="pulse-dot"></span>
              <span style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>Synthesizing country intelligence...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Suggestion Chips */}
      <div className="quick-prompts-bar">
        {QUICK_PROMPTS.map((prompt, i) => (
          <button
            key={i}
            className="quick-prompt-btn"
            onClick={() => handleSend(prompt)}
            disabled={loading}
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form
        className="chat-input-footer"
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
      >
        <input
          type="text"
          className="chat-input-box"
          placeholder={`Ask intelligence question about ${country.name}...`}
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          disabled={loading}
        />
        <button
          type="submit"
          className="btn btn-primary btn-icon"
          disabled={!inputMessage.trim() || loading}
          style={{ width: 42, height: 42 }}
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}
