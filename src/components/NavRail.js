'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
    Home,
    BookOpen,
    Calendar,
    Settings,
    Sparkles,
    X
} from 'lucide-react';

const navItems = [
    { href: '/', icon: Home, label: 'Home' },
    { href: '/courses', icon: BookOpen, label: 'Courses' },
    { href: '/calendar', icon: Calendar, label: 'Calendar' },
    { href: '/settings', icon: Settings, label: 'Settings' },
];

export default function NavRail() {
    const pathname = usePathname();
    const [showAskMe, setShowAskMe] = useState(true);
    const isOnChatPage = pathname === '/chat';

    return (
        <>
            <nav className="nav-rail">
                {/* Logo */}
                <div className="nav-logo">
                    <div className="nav-logo-icon">
                        <Sparkles size={20} color="white" />
                    </div>
                </div>

                {/* Navigation Items */}
                <ul className="nav-items">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href ||
                            (item.href !== '/' && pathname.startsWith(item.href));
                        const Icon = item.icon;

                        return (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    className={`nav-item ${isActive ? 'active' : ''}`}
                                >
                                    <Icon size={22} />
                                    <span className="nav-tooltip">{item.label}</span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>

                <div className="nav-divider" />

                {/* User Avatar */}
                <div className="nav-user">
                    <div className="nav-avatar">
                        A
                    </div>
                </div>
            </nav>

            {/* Floating "Ask ME" Pill Button - The CENTRAL AI Access Point */}
            {!isOnChatPage && showAskMe && (
                <Link href="/chat" className="ask-me-pill">
                    <div className="ask-me-glow" />
                    <div className="ask-me-content">
                        <div className="ask-me-avatar">
                            <Sparkles size={18} />
                        </div>
                        <div className="ask-me-text">
                            <span className="ask-me-label">Ask ME</span>
                            <span className="ask-me-subtitle">Your study buddy</span>
                        </div>
                    </div>
                    <button
                        className="ask-me-close"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setShowAskMe(false);
                        }}
                    >
                        <X size={14} />
                    </button>
                </Link>
            )}

            {/* Minimized Ask ME button when closed */}
            {!isOnChatPage && !showAskMe && (
                <button
                    className="ask-me-mini"
                    onClick={() => setShowAskMe(true)}
                >
                    <Sparkles size={20} />
                </button>
            )}

            <style jsx>{`
        /* Floating Ask ME Pill - MOST PROMINENT UI ELEMENT */
        .ask-me-pill {
          position: fixed;
          bottom: 32px;
          right: 32px;
          z-index: 1000;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 20px 12px 14px;
          background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #A855F7 100%);
          border-radius: 100px;
          box-shadow: 
            0 8px 32px rgba(99, 102, 241, 0.4),
            0 4px 16px rgba(139, 92, 246, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          text-decoration: none;
          animation: askMeFloat 3s ease-in-out infinite;
        }

        .ask-me-pill:hover {
          transform: translateY(-4px) scale(1.02);
          box-shadow: 
            0 12px 40px rgba(99, 102, 241, 0.5),
            0 6px 20px rgba(139, 92, 246, 0.4),
            inset 0 1px 0 rgba(255, 255, 255, 0.3);
        }

        @keyframes askMeFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }

        .ask-me-pill:hover {
          animation: none;
        }

        .ask-me-glow {
          position: absolute;
          inset: -4px;
          background: linear-gradient(135deg, #6366F1, #8B5CF6, #A855F7);
          border-radius: 100px;
          opacity: 0.5;
          filter: blur(20px);
          z-index: -1;
          animation: glowPulse 2s ease-in-out infinite;
        }

        @keyframes glowPulse {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.1); }
        }

        .ask-me-content {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .ask-me-avatar {
          width: 40px;
          height: 40px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .ask-me-text {
          display: flex;
          flex-direction: column;
        }

        .ask-me-label {
          font-size: 1rem;
          font-weight: 700;
          color: white;
          letter-spacing: 0.5px;
        }

        .ask-me-subtitle {
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.8);
          font-weight: 400;
        }

        .ask-me-close {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          background: rgba(255, 255, 255, 0.15);
          border-radius: 50%;
          color: rgba(255, 255, 255, 0.7);
          transition: all 0.2s ease;
          margin-left: 4px;
        }

        .ask-me-close:hover {
          background: rgba(255, 255, 255, 0.25);
          color: white;
        }

        /* Minimized Ask ME button */
        .ask-me-mini {
          position: fixed;
          bottom: 32px;
          right: 32px;
          z-index: 1000;
          width: 56px;
          height: 56px;
          background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          box-shadow: 
            0 4px 20px rgba(99, 102, 241, 0.4),
            0 2px 8px rgba(139, 92, 246, 0.3);
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .ask-me-mini:hover {
          transform: scale(1.1);
          box-shadow: 
            0 6px 24px rgba(99, 102, 241, 0.5),
            0 4px 12px rgba(139, 92, 246, 0.4);
        }

        @media (max-width: 768px) {
          .ask-me-pill {
            bottom: 88px;
            right: 16px;
          }

          .ask-me-mini {
            bottom: 88px;
            right: 16px;
          }
        }
      `}</style>
        </>
    );
}
