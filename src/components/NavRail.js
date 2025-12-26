'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Home,
    MessageSquare,
    BookOpen,
    Calendar,
    Settings,
    Sparkles
} from 'lucide-react';

const navItems = [
    { href: '/', icon: Home, label: 'Dashboard' },
    { href: '/chat', icon: MessageSquare, label: 'Chat with AI' },
    { href: '/courses', icon: BookOpen, label: 'Courses' },
    { href: '/calendar', icon: Calendar, label: 'Calendar' },
    { href: '/settings', icon: Settings, label: 'Settings' },
];

export default function NavRail() {
    const pathname = usePathname();

    return (
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
    );
}
