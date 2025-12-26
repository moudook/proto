'use client';

import { useState, useRef, useEffect } from 'react';
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
  ArrowLeft,
  MoreHorizontal
} from 'lucide-react';
import Link from 'next/link';

// Mock conversation for demonstration
const initialMessages = [
  {
    id: 1,
    sender: 'ai',
    content: "Hey there! 👋 I'm ME, your study buddy. What can I help you with today? Whether it's planning your study schedule, understanding a tricky concept, or just figuring out what to tackle first - I'm here for you!",
    timestamp: new Date(Date.now() - 60000).toISOString(),
  },
];

const suggestedPrompts = [
  { icon: Calendar, text: "What's due this week?" },
  { icon: BookOpen, text: "Help me study" },
  { icon: TrendingUp, text: "How am I doing?" },
];

export default function ChatPage() {
  const [messages, setMessages] = useState(initialMessages);
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

    // Simulate AI response (will be replaced with actual API call in Phase 2)
    setTimeout(() => {
      const aiMessage = {
        id: messages.length + 2,
        sender: 'ai',
        content: generateMockResponse(inputValue),
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
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
    <div className="chat-page">
      {/* Chat Header - Clean and Simple */}
      <header className="chat-header">
        <Link href="/" className="back-btn">
          <ArrowLeft size={20} />
        </Link>

        <div className="chat-header-center">
          <div className="ai-avatar-small">
            <Sparkles size={16} />
          </div>
          <div className="ai-info">
            <span className="ai-name">ME</span>
            <span className="ai-status">
              <span className="status-dot" />
              Always here for you
            </span>
          </div>
        </div>

        <button className="menu-btn">
          <MoreHorizontal size={20} />
        </button>
      </header>

      {/* Messages Area */}
      <div className="messages-container">
        <div className="messages-wrapper">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}

          {isTyping && (
            <div className="message message-ai">
              <div className="message-avatar ai-avatar">
                <Sparkles size={16} />
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

      {/* Suggested Prompts - Only show when conversation is short */}
      {messages.length <= 2 && (
        <div className="suggested-prompts">
          <p className="prompts-label">Quick questions:</p>
          <div className="prompts-list">
            {suggestedPrompts.map((prompt, index) => {
              const Icon = prompt.icon;
              return (
                <button
                  key={index}
                  className="prompt-chip"
                  onClick={() => handlePromptClick(prompt.text)}
                >
                  <Icon size={14} />
                  {prompt.text}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Input Area - CENTRAL and prominent */}
      <div className="chat-input-container">
        <div className="chat-input-wrapper">
          <button className="input-action-btn" title="Attach file">
            <Paperclip size={18} />
          </button>

          <input
            ref={inputRef}
            type="text"
            className="chat-input"
            placeholder="Ask me anything..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
          />

          <button className="input-action-btn" title="Voice input">
            <Mic size={18} />
          </button>

          <button
            className={`send-btn ${inputValue.trim() ? 'active' : ''}`}
            onClick={handleSend}
            disabled={!inputValue.trim()}
          >
            <Send size={18} />
          </button>
        </div>
      </div>

      <style jsx>{`
        .chat-page {
          display: flex;
          flex-direction: column;
          height: 100vh;
          background: var(--bg-primary);
        }

        /* Header */
        .chat-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--space-4) var(--space-6);
          background: var(--bg-primary);
          border-bottom: 1px solid var(--border-light);
        }

        .back-btn, .menu-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: var(--radius-md);
          color: var(--text-secondary);
          transition: all 0.2s ease;
        }

        .back-btn:hover, .menu-btn:hover {
          background: var(--bg-hover);
          color: var(--text-primary);
        }

        .chat-header-center {
          display: flex;
          align-items: center;
          gap: var(--space-3);
        }

        .ai-avatar-small {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #6366F1, #8B5CF6);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .ai-info {
          display: flex;
          flex-direction: column;
        }

        .ai-name {
          font-size: 1rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .ai-status {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.75rem;
          color: var(--text-secondary);
        }

        .status-dot {
          width: 8px;
          height: 8px;
          background: #10B981;
          border-radius: 50%;
        }

        /* Messages */
        .messages-container {
          flex: 1;
          overflow-y: auto;
          padding: var(--space-6);
        }

        .messages-wrapper {
          max-width: 720px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
        }

        /* Suggested Prompts */
        .suggested-prompts {
          padding: var(--space-4) var(--space-6);
          background: var(--bg-secondary);
          border-top: 1px solid var(--border-light);
        }

        .prompts-label {
          font-size: 0.75rem;
          color: var(--text-tertiary);
          margin-bottom: var(--space-2);
          text-align: center;
        }

        .prompts-list {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: var(--space-2);
        }

        .prompt-chip {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          background: var(--bg-primary);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-full);
          font-size: 0.8125rem;
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .prompt-chip:hover {
          border-color: var(--accent-primary);
          color: var(--accent-primary);
          background: var(--accent-light);
        }

        /* Input */
        .chat-input-container {
          padding: var(--space-4) var(--space-6) var(--space-6);
          background: var(--bg-primary);
        }

        .chat-input-wrapper {
          max-width: 720px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          gap: var(--space-2);
          padding: var(--space-2) var(--space-3);
          background: var(--bg-secondary);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-xl);
          transition: all 0.2s ease;
        }

        .chat-input-wrapper:focus-within {
          border-color: var(--accent-primary);
          box-shadow: 0 0 0 3px var(--accent-light);
        }

        .chat-input {
          flex: 1;
          border: none;
          background: transparent;
          font-family: inherit;
          font-size: 0.9375rem;
          color: var(--text-primary);
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
          width: 36px;
          height: 36px;
          border-radius: var(--radius-md);
          color: var(--text-tertiary);
          transition: all 0.2s ease;
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
          transition: all 0.2s ease;
        }

        .send-btn.active {
          background: var(--accent-primary);
          color: white;
        }

        .send-btn.active:hover {
          background: #5558E8;
        }

        .typing-indicator {
          display: flex;
          gap: 4px;
          padding: var(--space-2);
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
      `}</style>
    </div>
  );
}

// Chat Message Component
function ChatMessage({ message }) {
  const isAI = message.sender === 'ai';

  return (
    <div className={`message ${isAI ? 'message-ai' : 'message-user'}`}>
      {isAI && (
        <div className="message-avatar ai-avatar">
          <Sparkles size={16} />
        </div>
      )}

      <div className="message-body">
        <div className="message-content">
          <p>{message.content}</p>
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

      {!isAI && (
        <div className="message-avatar user-avatar">
          <User size={16} />
        </div>
      )}

      <style jsx>{`
        .message {
          display: flex;
          gap: var(--space-3);
          max-width: 85%;
        }

        .message-user {
          margin-left: auto;
          flex-direction: row;
        }

        .message-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .message-avatar :global(svg) {
          width: 16px;
          height: 16px;
        }

        .ai-avatar {
          background: linear-gradient(135deg, #6366F1, #8B5CF6);
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
          padding: var(--space-3) var(--space-4);
          border-radius: var(--radius-lg);
          font-size: 0.9375rem;
          line-height: 1.6;
        }

        .message-ai .message-content {
          background: var(--bg-secondary);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-lg) var(--radius-lg) var(--radius-lg) 4px;
        }

        .message-user .message-content {
          background: var(--accent-primary);
          color: white;
          border-radius: var(--radius-lg) var(--radius-lg) 4px var(--radius-lg);
        }

        .message-actions {
          display: flex;
          gap: var(--space-1);
          opacity: 0;
          transition: opacity 0.2s ease;
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
          transition: all 0.2s ease;
        }

        .message-action-btn:hover {
          background: var(--bg-hover);
          color: var(--text-secondary);
        }
      `}</style>
    </div>
  );
}

// Mock response generator (will be replaced with actual AI in Phase 2)
function generateMockResponse(input) {
  const lowerInput = input.toLowerCase();

  if (lowerInput.includes('due') || lowerInput.includes('deadline')) {
    return "Let me check your schedule! 📋\n\nHere's what's coming up:\n\n1. CS301 Project Proposal - Due in 2 days (this one's important!)\n2. MATH202 Problem Set 5 - Due in 4 days\n3. ENG101 Essay Draft - Due in 1 week\n\nI'd suggest starting with the CS301 project - want me to help you break it down into smaller steps?";
  }

  if (lowerInput.includes('study') || lowerInput.includes('help')) {
    return "I'd love to help you study! 📚\n\nHere's how I can support you:\n\n• Create a focused study plan based on what's due\n• Generate practice questions to test your knowledge\n• Explain tricky concepts in a way that makes sense\n• Set up study sessions with break reminders\n\nWhat sounds helpful right now?";
  }

  if (lowerInput.includes('how') && (lowerInput.includes('doing') || lowerInput.includes('am i'))) {
    return "You're doing great! 🌟\n\nHere's a quick snapshot:\n\n📊 CS301: 68% complete - on track\n📊 MATH202: 45% complete - might need a little push\n📊 ENG101: 82% complete - almost there!\n\nYour GPA projection is looking solid at 3.4. I noticed MATH202 could use some attention - want to chat about a catch-up plan?";
  }

  return "That's a great question! 🤔\n\nI'm here to help with anything academic. I can:\n\n• Help you plan and prioritize your work\n• Break down assignments into manageable steps\n• Track your progress and celebrate wins\n• Be your study partner when you need focus\n\nWhat's on your mind?";
}
