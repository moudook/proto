'use client';

import { useState, useRef, useEffect } from 'react';
import PageHeader from '@/components/PageHeader';
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
    TrendingUp
} from 'lucide-react';

// Mock conversation for demonstration
const initialMessages = [
    {
        id: 1,
        sender: 'ai',
        content: "Hello! I'm your StudyPilot AI assistant. I can help you with course scheduling, assignment tracking, research assistance, and more. What would you like to work on today?",
        timestamp: new Date(Date.now() - 60000).toISOString(),
    },
];

const suggestedPrompts = [
    { icon: Calendar, text: "What's due this week?" },
    { icon: BookOpen, text: "Help me study for CS301" },
    { icon: TrendingUp, text: "Show my grade progress" },
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
                            disabled={!inputValue.trim()}
                        >
                            <Send size={20} />
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

// Mock response generator (will be replaced with actual AI in Phase 2)
function generateMockResponse(input) {
    const lowerInput = input.toLowerCase();

    if (lowerInput.includes('due') || lowerInput.includes('deadline')) {
        return "Based on your current courses, here are your upcoming deadlines:\n\n📌 CS301 Project Proposal - Due in 2 days (High Priority)\n📌 MATH202 Problem Set 5 - Due in 4 days\n📌 ENG101 Essay Draft - Due in 1 week\n\nWould you like me to help you create a study plan for any of these?";
    }

    if (lowerInput.includes('study') || lowerInput.includes('help')) {
        return "I'd be happy to help you study! Here are some ways I can assist:\n\n1. 📚 Create a personalized study plan based on your schedule\n2. 📝 Generate practice questions for your upcoming exams\n3. 🧠 Build a knowledge map connecting key concepts\n4. ⏰ Set up focused study sessions with break reminders\n\nWhich approach would work best for you?";
    }

    if (lowerInput.includes('grade') || lowerInput.includes('progress')) {
        return "Here's your current academic progress:\n\n📊 CS301 (Algorithms): 68% complete - Grade: B+\n📊 MATH202 (Linear Algebra): 45% complete - Grade: B\n📊 ENG101 (Academic Writing): 82% complete - Grade: A-\n\nOverall GPA projection: 3.4\n\nI notice MATH202 is slightly behind. Would you like me to suggest some strategies to catch up?";
    }

    return "I understand! Let me help you with that. Could you provide more details about what you're looking for? I can assist with:\n\n• Course scheduling and deadline management\n• Study planning and research assistance\n• Grade tracking and progress analysis\n• Wellness check-ins and work-life balance\n\nJust let me know what you need!";
}
