'use client';

import { createContext, useContext, useState, useEffect } from 'react';

// Auth Context
const AuthContext = createContext(null);

// Mock user for demonstration
const DEMO_USER = {
    id: 'usr_001',
    email: 'alex.johnson@university.edu',
    name: 'Alex Johnson',
    avatar: null,
    university: 'State University',
    major: 'Computer Science',
    year: 'Junior',
    createdAt: '2024-01-15',
    preferences: {
        theme: 'light',
        notifications: true,
        aiProactivity: 'medium',
        studyReminders: true,
    },
    onboardingComplete: true,
};

// Auth Provider Component
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Check for existing session on mount
    useEffect(() => {
        const checkAuth = async () => {
            try {
                // Check localStorage for session
                const savedSession = localStorage.getItem('studypilot_session');

                if (savedSession) {
                    const session = JSON.parse(savedSession);
                    setUser(session.user);
                    setIsAuthenticated(true);
                }
            } catch (error) {
                console.error('Auth check failed:', error);
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, []);

    // Login function
    const login = async (email, password) => {
        setIsLoading(true);

        try {
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Demo login - accept any email/password for demo
            if (email && password) {
                const userData = {
                    ...DEMO_USER,
                    email: email,
                    name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
                };

                // Save session
                const session = {
                    user: userData,
                    token: `demo_token_${Date.now()}`,
                    expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
                };

                localStorage.setItem('studypilot_session', JSON.stringify(session));

                setUser(userData);
                setIsAuthenticated(true);

                return { success: true, user: userData };
            }

            return { success: false, error: 'Invalid credentials' };
        } catch (error) {
            return { success: false, error: error.message };
        } finally {
            setIsLoading(false);
        }
    };

    // Signup function
    const signup = async (email, password, name) => {
        setIsLoading(true);

        try {
            await new Promise(resolve => setTimeout(resolve, 1000));

            const userData = {
                ...DEMO_USER,
                id: `usr_${Date.now()}`,
                email,
                name,
                createdAt: new Date().toISOString(),
                onboardingComplete: false,
            };

            const session = {
                user: userData,
                token: `demo_token_${Date.now()}`,
                expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
            };

            localStorage.setItem('studypilot_session', JSON.stringify(session));

            setUser(userData);
            setIsAuthenticated(true);

            return { success: true, user: userData, needsOnboarding: true };
        } catch (error) {
            return { success: false, error: error.message };
        } finally {
            setIsLoading(false);
        }
    };

    // Logout function
    const logout = () => {
        localStorage.removeItem('studypilot_session');
        setUser(null);
        setIsAuthenticated(false);
    };

    // Update user profile
    const updateProfile = async (updates) => {
        try {
            const updatedUser = { ...user, ...updates };
            setUser(updatedUser);

            // Update session in localStorage
            const savedSession = localStorage.getItem('studypilot_session');
            if (savedSession) {
                const session = JSON.parse(savedSession);
                session.user = updatedUser;
                localStorage.setItem('studypilot_session', JSON.stringify(session));
            }

            return { success: true, user: updatedUser };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    // Update preferences
    const updatePreferences = async (preferences) => {
        return updateProfile({
            preferences: { ...user?.preferences, ...preferences },
        });
    };

    // Complete onboarding
    const completeOnboarding = async (onboardingData) => {
        return updateProfile({
            ...onboardingData,
            onboardingComplete: true,
        });
    };

    const value = {
        user,
        isLoading,
        isAuthenticated,
        login,
        signup,
        logout,
        updateProfile,
        updatePreferences,
        completeOnboarding,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

// Custom hook to use auth context
export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return context;
}

// HOC for protected routes
export function withAuth(Component) {
    return function ProtectedRoute(props) {
        const { isAuthenticated, isLoading } = useAuth();

        if (isLoading) {
            return (
                <div className="auth-loading">
                    <div className="loading-spinner" />
                    <p>Loading...</p>
                </div>
            );
        }

        if (!isAuthenticated) {
            // Redirect to login
            if (typeof window !== 'undefined') {
                window.location.href = '/auth';
            }
            return null;
        }

        return <Component {...props} />;
    };
}
