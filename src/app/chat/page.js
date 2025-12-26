'use client';

import { useState, useRef, useEffect } from 'react';
import PageHeader from '@/components/PageHeader';
import { useAuth } from '@/contexts/AuthContext';
import {
  Send,
  Paperclip,
  Mic,
  Sparkles,
  User,
  Copy,
  RefreshCw,
  ChevronRight,
  BookOpen,
  Calendar,
  TrendingUp,
  Loader2
} from 'lucide-react';

// Suggested prompts for the AI
const suggestedPrompts = [
  { icon: Calendar, text: "What's due this week?" },
  { icon: BookOpen, text: "Help me study for CS301" },
  { icon: TrendingUp, text: "Show my grade progress" },
];

export default function ChatPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      content: `Hello ${user?.name ? user.name.split(' ')[0] : 'there'}! I'm your StudyPilot AI assistant. I can help you with course scheduling, assignment tracking, research assistance, and more. What would you like to work on today?`,
      timestamp: new Date().toISOString(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Send message to AI Agent API
  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      sender: 'user',
      content: inputValue,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      // Prepare user context from auth data
      const userContext = user ? {
        name: user.name,
        semester: user.year ? `${user.year} Year` : 'Current Semester',
        courses: user.courses || [], // From onboarding
        upcomingDeadlines: [], // In real app, fetch from DB
      } : null;

      // Call the AI Agent API (Phase 2 integration)
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: inputValue,
          conversationHistory: messages,
          userContext: userContext,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();

      const aiMessage = {
        id: messages.length + 2,
        sender: 'ai',
        content: data.response,
        timestamp: new Date().toISOString(),
        visualElements: data.visualElements || null,
        actions: data.actions || null,
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      // Fallback to mock response if API fails
      const aiMessage = {
        id: messages.length + 2,
        sender: 'ai',
        content: "I'm having trouble connecting right now. Please try again in a moment.",
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, aiMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handlePromptClick = (prompt) => {
    setInputValue(prompt);
    inputRef.current?.focus();
  };

  return (
    <>
      <PageHeader
        title="Chat with AI"
        subtitle="Your intelligent academic companion"
      />

      <div className="chat-container">
        {/* Messages Area */}
        <div className="messages-container">
          <div className="messages-wrapper">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}

            {isTyping && (
              <div className="message message-ai">
                <div className="message-avatar ai-avatar">
                  <Sparkles size={18} />
                </div>
                <div className="message-content">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Suggested Prompts */}
        {messages.length <= 1 && (
          <div className="suggested-prompts">
            {suggestedPrompts.map((prompt, index) => {
              const Icon = prompt.icon;
              return (
                <button
                  key={index}
                  className="prompt-chip"
                  onClick={() => handlePromptClick(prompt.text)}
                >
                  <Icon size={16} />
                  {prompt.text}
                  <ChevronRight size={14} />
                </button>
              );
            })}
          </div>
        )}

        {/* Input Area - CENTRALIZED at bottom */}
        <div className="chat-input-container">
          <div className="chat-input-wrapper">
            <button className="input-action-btn" title="Attach file">
              <Paperclip size={20} />
            </button>

            <textarea
              ref={inputRef}
              className="chat-input"
              placeholder="Ask me anything about your academics..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              rows={1}
            />

            <button className="input-action-btn" title="Voice input">
              <Mic size={20} />
            </button>

            <button
              className={`send-btn ${inputValue.trim() ? 'active' : ''}`}
              onClick={handleSend}
              disabled={!inputValue.trim() || isTyping}
            >
              {isTyping ? <Loader2 size={20} className="spin" /> : <Send size={20} />}
            </button>
          </div>
          <p className="chat-disclaimer">
            StudyPilot can make mistakes. Consider checking important information.
          </p>
        </div>
      </div>

      <style jsx>{`
        .chat-container {
          display: flex;
          flex-direction: column;
          height: calc(100vh - var(--header-height) - 80px);
          max-width: 900px;
          margin: 0 auto;
          padding: 0 var(--space-6);
        }

        .messages-container {
          flex: 1;
          overflow-y: auto;
          padding: var(--space-6) 0;
        }

        .messages-wrapper {
          display: flex;
          flex-direction: column;
          gap: var(--space-6);
        }

        .suggested-prompts {
          display: flex;
          flex-wrap: wrap;
          gap: var(--space-3);
          justify-content: center;
          padding: var(--space-4) 0;
        }

        .prompt-chip {
          display: inline-flex;
          align-items: center;
          gap: var(--space-2);
          padding: var(--space-3) var(--space-4);
          background: var(--bg-primary);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-full);
          font-size: 0.875rem;
          color: var(--text-secondary);
          cursor: pointer;
          transition: all var(--duration-fast) var(--ease-out);
        }

        .prompt-chip:hover {
          border-color: var(--accent-primary);
          color: var(--accent-primary);
          background: var(--accent-light);
        }

        .chat-input-container {
          padding: var(--space-4) 0 var(--space-6);
        }

        .chat-input-wrapper {
          display: flex;
          align-items: flex-end;
          gap: var(--space-2);
          padding: var(--space-3);
          background: var(--bg-primary);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-xl);
          box-shadow: var(--shadow-md);
          transition: all var(--duration-fast) var(--ease-out);
        }

        .chat-input-wrapper:focus-within {
          border-color: var(--accent-primary);
          box-shadow: 0 0 0 3px var(--accent-light), var(--shadow-md);
        }

        .chat-input {
          flex: 1;
          border: none;
          background: transparent;
          font-family: inherit;
          font-size: 0.9375rem;
          color: var(--text-primary);
          resize: none;
          max-height: 120px;
          padding: var(--space-2);
        }

        .chat-input:focus {
          outline: none;
        }

        .chat-input::placeholder {
          color: var(--text-tertiary);
        }

        .input-action-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: var(--radius-md);
          color: var(--text-tertiary);
          transition: all var(--duration-fast) var(--ease-out);
        }

        .input-action-btn:hover {
          background: var(--bg-hover);
          color: var(--text-secondary);
        }

        .send-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: var(--radius-md);
          background: var(--bg-tertiary);
          color: var(--text-tertiary);
          transition: all var(--duration-fast) var(--ease-out);
        }

        .send-btn.active {
          background: var(--accent-primary);
          color: white;
        }

        .send-btn.active:hover {
          background: #5558E8;
        }

        .send-btn :global(.spin) {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .chat-disclaimer {
          text-align: center;
          font-size: 0.75rem;
          color: var(--text-tertiary);
          margin-top: var(--space-2);
        }

        .typing-indicator {
          display: flex;
          gap: 4px;
          padding: var(--space-3);
        }

        .typing-indicator span {
          width: 8px;
          height: 8px;
          background: var(--text-tertiary);
          border-radius: 50%;
          animation: typingBounce 1.4s infinite ease-in-out;
        }

        .typing-indicator span:nth-child(1) { animation-delay: 0s; }
        .typing-indicator span:nth-child(2) { animation-delay: 0.2s; }
        .typing-indicator span:nth-child(3) { animation-delay: 0.4s; }

        @keyframes typingBounce {
          0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
          40% { transform: scale(1); opacity: 1; }
        }

        @media (max-width: 768px) {
          .chat-container {
            padding: 0 var(--space-4);
          }
        }
      `}</style>
    </>
  );
}

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// Chat Message Component
function ChatMessage({ message }) {
  const isAI = message.sender === 'ai';

  return (
    <div className={`message ${isAI ? 'message-ai' : 'message-user'}`}>
      <div className={`message-avatar ${isAI ? 'ai-avatar' : 'user-avatar'}`}>
        {isAI ? <Sparkles size={18} /> : <User size={18} />}
      </div>

      <div className="message-body">
        <div className="message-content">
          {isAI ? (
            <div className="markdown-content">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {message.content}
              </ReactMarkdown>
            </div>
          ) : (
            <p>{message.content}</p>
          )}

          {/* Render visual elements if present */}
          {message.visualElements && (
            <div className="message-visual">
              {/* Will render tables, charts, etc. */}
            </div>
          )}

          {/* Render action buttons if present */}
          {message.actions && (
            <div className="message-actions-row">
              {message.actions.map((action, index) => (
                <button key={index} className="action-btn">
                  {action.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {isAI && (
          <div className="message-actions">
            <button className="message-action-btn" title="Copy">
              <Copy size={14} />
            </button>
            <button className="message-action-btn" title="Regenerate">
              <RefreshCw size={14} />
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        .message {
          display: flex;
          gap: var(--space-3);
          max-width: 85%;
        }

        .message-user {
          margin-left: auto;
          flex-direction: row-reverse;
        }

        .message-avatar {
          width: 36px;
          height: 36px;
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .ai-avatar {
          background: var(--accent-gradient);
          color: white;
        }

        .user-avatar {
          background: var(--bg-tertiary);
          color: var(--text-secondary);
        }

        .message-body {
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
        }

        .message-content {
          padding: var(--space-4);
          border-radius: var(--radius-lg);
          font-size: 0.9375rem;
          line-height: 1.6;
        }

        .message-ai .message-content {
          background: var(--bg-primary);
          border: 1px solid var(--border-light);
        }

        .message-user .message-content {
          background: var(--accent-primary);
          color: white;
        }
        
        /* Markdown Styles */
        .markdown-content :global(p) { margin-bottom: 0.5em; }
        .markdown-content :global(p:last-child) { margin-bottom: 0; }
        .markdown-content :global(strong) { font-weight: 600; color: var(--text-primary); }
        .markdown-content :global(ul), .markdown-content :global(ol) { padding-left: 1.5rem; margin-bottom: 0.5em; }
        .markdown-content :global(li) { margin-bottom: 0.25em; }
        .markdown-content :global(table) { 
            width: 100%; 
            border-collapse: collapse; 
            margin: 1em 0; 
            font-size: 0.875rem;
        }
        .markdown-content :global(th) { 
            text-align: left; 
            padding: 8px 12px; 
            border-bottom: 2px solid var(--border-medium); 
            font-weight: 600;
        }
        .markdown-content :global(td) { 
            padding: 8px 12px; 
            border-bottom: 1px solid var(--border-light); 
        }

        .message-visual {
          margin-top: var(--space-4);
        }

        .message-actions-row {
          display: flex;
          gap: var(--space-2);
          margin-top: var(--space-3);
        }

        .action-btn {
          padding: var(--space-2) var(--space-4);
          background: var(--accent-light);
          color: var(--accent-primary);
          border-radius: var(--radius-md);
          font-size: 0.8125rem;
          font-weight: 500;
          transition: all var(--duration-fast) var(--ease-out);
        }

        .action-btn:hover {
          background: var(--accent-primary);
          color: white;
        }

        .message-actions {
          display: flex;
          gap: var(--space-1);
          opacity: 0;
          transition: opacity var(--duration-fast) var(--ease-out);
        }

        .message:hover .message-actions {
          opacity: 1;
        }

        .message-action-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          border-radius: var(--radius-sm);
          color: var(--text-tertiary);
          transition: all var(--duration-fast) var(--ease-out);
        }

        .message-action-btn:hover {
          background: var(--bg-hover);
          color: var(--text-secondary);
        }
      `}</style>
    </div>
  );
}
