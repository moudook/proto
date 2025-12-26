'use client';

import { AuthProvider } from '@/contexts/AuthContext';
import NavRail from '@/components/NavRail';
import { usePathname } from 'next/navigation';

// Routes that don't show the NavRail
const authRoutes = ['/auth', '/onboarding'];

export default function Providers({ children }) {
    const pathname = usePathname();
    const isAuthRoute = authRoutes.some(route => pathname?.startsWith(route));

    return (
        <AuthProvider>
            <div className="app-container">
                {!isAuthRoute && <NavRail />}
                <main className={`main-content ${isAuthRoute ? 'full-width' : ''}`}>
                    {children}
                </main>
            </div>
        </AuthProvider>
    );
}
