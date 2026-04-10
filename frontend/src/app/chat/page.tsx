"use client";
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

interface Message {
  role: 'user' | 'assistant';
  text: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', text: 'Hi there! I am your AI Health Assistant. Ask me anything about nutrition, recipes, or your fitness goals!' }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    const query = input.trim();
    if (!query || isLoading) return;

    const userMessage: Message = { role: 'user', text: query };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:8000/api/v1/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, history: [] }),
      });

      if (!res.ok) throw new Error("Backend error");
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', text: data.response }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        text: "Sorry, I couldn't reach the AI backend right now. Make sure the backend is running at http://localhost:8000."
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '800px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1>AI Health Assistant</h1>
          <p style={{ color: 'var(--text-muted)' }}>Ask me anything about nutrition, recipes, or your goals.</p>
        </div>
        <Link href="/" className="btn-secondary" style={{ padding: '0.5rem 1rem' }}>Back</Link>
      </div>
      
      <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '600px', padding: '0' }}>
        {/* Messages */}
        <div className="chat-messages-pane" style={{ 
          flex: 1, padding: '1.5rem', overflowY: 'auto', 
          display: 'flex', flexDirection: 'column', gap: '1rem', 
          background: '#f9fafb', 
          borderTopLeftRadius: 'var(--radius-lg)', 
          borderTopRightRadius: 'var(--radius-lg)' 
        }}>
          {messages.map((msg, i) => (
            <div key={i} className={msg.role === 'assistant' ? 'assistant-bubble' : ''} style={{ 
              alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
              background: msg.role === 'user' ? 'linear-gradient(135deg, #10b981, #0ea5e9)' : 'white',
              color: msg.role === 'user' ? 'white' : 'var(--foreground)',
              padding: '0.875rem 1.25rem',
              borderRadius: '1.25rem',
              borderBottomRightRadius: msg.role === 'user' ? '0.25rem' : '1.25rem',
              borderBottomLeftRadius: msg.role === 'assistant' ? '0.25rem' : '1.25rem',
              maxWidth: '80%',
              boxShadow: 'var(--shadow-sm)',
              border: msg.role === 'assistant' ? '1px solid var(--border)' : 'none',
              lineHeight: '1.6',
              animation: 'fadeInUp 0.3s ease-out'
            }}>
              {msg.text}
            </div>
          ))}

          {/* Typing indicator */}
          {isLoading && (
            <div style={{
              alignSelf: 'flex-start',
              background: 'white',
              border: '1px solid var(--border)',
              padding: '0.875rem 1.25rem',
              borderRadius: '1.25rem',
              borderBottomLeftRadius: '0.25rem',
              boxShadow: 'var(--shadow-sm)',
              color: 'var(--text-muted)',
              display: 'flex',
              gap: '0.4rem',
              alignItems: 'center'
            }}>
              <span style={{ animation: 'bounce 1s infinite 0s' }}>●</span>
              <span style={{ animation: 'bounce 1s infinite 0.2s' }}>●</span>
              <span style={{ animation: 'bounce 1s infinite 0.4s' }}>●</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input bar */}
        <div className="chat-input-bar" style={{ 
          padding: '1.25rem 1.5rem', 
          display: 'flex', gap: '1rem', 
          background: 'white', 
          borderTop: '1px solid var(--border)',
          borderBottomLeftRadius: 'var(--radius-lg)', 
          borderBottomRightRadius: 'var(--radius-lg)' 
        }}>
          <input 
            type="text" 
            className="input-field" 
            placeholder="Ask about nutrition, recipes, your goals..." 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            disabled={isLoading}
            style={{ flex: 1 }}
          />
          <button 
            className="btn-primary" 
            onClick={handleSend} 
            disabled={isLoading}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: isLoading ? 0.7 : 1 }}
          >
            Send
            <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
          </button>
        </div>
      </div>
    </div>
  );
}
