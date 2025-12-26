'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import {
    Mail,
    Lock,
    User,
    Eye,
    EyeOff,
    Sparkles,
    ArrowRight,
    GraduationCap
} from 'lucide-react';

export default function AuthPage() {
    const router = useRouter();
    const { login, signup, isLoading } = useAuth();
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (isLogin) {
            const result = await login(formData.email, formData.password);
            if (result.success) {
                router.push('/');
            } else {
                setError(result.error);
            }
        } else {
            const result = await signup(formData.email, formData.password, formData.name);
            if (result.success) {
                if (result.needsOnboarding) {
                    router.push('/onboarding');
                } else {
                    router.push('/');
                }
            } else {
                setError(result.error);
            }
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="auth-page">
            {/* Left Panel - Branding */}
            <div className="auth-branding">
                <div className="branding-content">
                    <div className="brand-logo">
                        <Sparkles size={32} />
                        <span>StudyPilot</span>
                    </div>

                    <h1>Your AI-Powered Academic Companion</h1>
                    <p>Manage courses, track deadlines, and ace your academics with intelligent assistance.</p>

                    <div className="features-list">
                        <div className="feature-item">
                            <GraduationCap size={24} />
                            <div>
                                <h4>Smart Course Management</h4>
                                <p>Track all your courses in one place</p>
                            </div>
                        </div>
                        <div className="feature-item">
                            <Sparkles size={24} />
                            <div>
                                <h4>AI Study Assistant</h4>
                                <p>Get personalized study recommendations</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Panel - Auth Form */}
            <div className="auth-form-container">
                <div className="auth-form-wrapper">
                    <div className="form-header">
                        <h2>{isLogin ? 'Welcome back' : 'Create account'}</h2>
                        <p>{isLogin
                            ? 'Sign in to continue your academic journey'
                            : 'Start your journey to academic success'
                        }</p>
                    </div>

                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="auth-form">
                        {!isLogin && (
                            <div className="form-group">
                                <label htmlFor="name">Full Name</label>
                                <div className="input-wrapper">
                                    <User size={18} />
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        placeholder="Alex Johnson"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required={!isLogin}
                                    />
                                </div>
                            </div>
                        )}

                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <div className="input-wrapper">
                                <Mail size={18} />
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    placeholder="alex@university.edu"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <div className="input-wrapper">
                                <Lock size={18} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    name="password"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                                <button
                                    type="button"
                                    className="toggle-password"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {isLogin && (
                            <div className="form-options">
                                <label className="remember-me">
                                    <input type="checkbox" />
                                    <span>Remember me</span>
                                </label>
                                <a href="#" className="forgot-password">Forgot password?</a>
                            </div>
                        )}

                        <button type="submit" className="submit-btn" disabled={isLoading}>
                            {isLoading ? (
                                <span className="loading">Processing...</span>
                            ) : (
                                <>
                                    <span>{isLogin ? 'Sign in' : 'Create account'}</span>
                                    <ArrowRight size={18} />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="auth-divider">
                        <span>or continue with</span>
                    </div>

                    <div className="social-auth">
                        <button type="button" className="social-btn google">
                            <svg viewBox="0 0 24 24" width="20" height="20">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            <span>Google</span>
                        </button>
                        <button type="button" className="social-btn microsoft">
                            <svg viewBox="0 0 24 24" width="20" height="20">
                                <path fill="#F25022" d="M1 1h10v10H1z" />
                                <path fill="#00A4EF" d="M1 13h10v10H1z" />
                                <path fill="#7FBA00" d="M13 1h10v10H13z" />
                                <path fill="#FFB900" d="M13 13h10v10H13z" />
                            </svg>
                            <span>Microsoft</span>
                        </button>
                    </div>

                    <div className="auth-switch">
                        <span>{isLogin ? "Don't have an account?" : 'Already have an account?'}</span>
                        <button type="button" onClick={() => setIsLogin(!isLogin)}>
                            {isLogin ? 'Sign up' : 'Sign in'}
                        </button>
                    </div>
                </div>
            </div>

            <style jsx>{`
        .auth-page {
          display: flex;
          min-height: 100vh;
        }

        .auth-branding {
          flex: 1;
          background: var(--accent-gradient);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: var(--space-12);
          color: white;
        }

        .branding-content {
          max-width: 480px;
        }

        .brand-logo {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: var(--space-8);
        }

        .branding-content h1 {
          font-size: 2.5rem;
          font-weight: 700;
          line-height: 1.2;
          margin-bottom: var(--space-4);
        }

        .branding-content > p {
          font-size: 1.125rem;
          opacity: 0.9;
          margin-bottom: var(--space-10);
        }

        .features-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-6);
        }

        .feature-item {
          display: flex;
          align-items: flex-start;
          gap: var(--space-4);
          background: rgba(255, 255, 255, 0.1);
          padding: var(--space-4);
          border-radius: var(--radius-lg);
          backdrop-filter: blur(10px);
        }

        .feature-item h4 {
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: 4px;
        }

        .feature-item p {
          font-size: 0.875rem;
          opacity: 0.8;
        }

        .auth-form-container {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: var(--space-8);
          background: var(--bg-primary);
        }

        .auth-form-wrapper {
          width: 100%;
          max-width: 400px;
        }

        .form-header {
          margin-bottom: var(--space-8);
        }

        .form-header h2 {
          font-size: 1.75rem;
          font-weight: 700;
          margin-bottom: var(--space-2);
        }

        .form-header p {
          color: var(--text-secondary);
        }

        .error-message {
          padding: var(--space-3) var(--space-4);
          background: var(--error-light);
          color: var(--error);
          border-radius: var(--radius-md);
          margin-bottom: var(--space-4);
          font-size: 0.875rem;
        }

        .auth-form {
          display: flex;
          flex-direction: column;
          gap: var(--space-5);
        }

        .form-group label {
          display: block;
          font-size: 0.875rem;
          font-weight: 500;
          margin-bottom: var(--space-2);
        }

        .input-wrapper {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          padding: var(--space-3) var(--space-4);
          background: var(--bg-secondary);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-md);
          transition: all var(--duration-fast) var(--ease-out);
        }

        .input-wrapper:focus-within {
          border-color: var(--accent-primary);
          box-shadow: 0 0 0 3px var(--accent-light);
        }

        .input-wrapper input {
          flex: 1;
          border: none;
          background: transparent;
          font-size: 0.9375rem;
          color: var(--text-primary);
        }

        .input-wrapper input:focus {
          outline: none;
        }

        .input-wrapper input::placeholder {
          color: var(--text-tertiary);
        }

        .input-wrapper svg {
          color: var(--text-tertiary);
        }

        .toggle-password {
          padding: 0;
          color: var(--text-tertiary);
        }

        .toggle-password:hover {
          color: var(--text-secondary);
        }

        .form-options {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.875rem;
        }

        .remember-me {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          color: var(--text-secondary);
          cursor: pointer;
        }

        .forgot-password {
          color: var(--accent-primary);
          font-weight: 500;
        }

        .submit-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--space-2);
          padding: var(--space-4);
          background: var(--accent-primary);
          color: white;
          border-radius: var(--radius-md);
          font-size: 0.9375rem;
          font-weight: 600;
          transition: all var(--duration-fast) var(--ease-out);
        }

        .submit-btn:hover:not(:disabled) {
          background: #5558E8;
        }

        .submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .auth-divider {
          display: flex;
          align-items: center;
          gap: var(--space-4);
          margin: var(--space-6) 0;
        }

        .auth-divider::before,
        .auth-divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: var(--border-light);
        }

        .auth-divider span {
          font-size: 0.8125rem;
          color: var(--text-tertiary);
        }

        .social-auth {
          display: flex;
          gap: var(--space-3);
        }

        .social-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--space-2);
          padding: var(--space-3);
          background: var(--bg-secondary);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-md);
          font-size: 0.875rem;
          font-weight: 500;
          transition: all var(--duration-fast) var(--ease-out);
        }

        .social-btn:hover {
          background: var(--bg-hover);
          border-color: var(--border-medium);
        }

        .auth-switch {
          text-align: center;
          margin-top: var(--space-6);
          font-size: 0.875rem;
          color: var(--text-secondary);
        }

        .auth-switch button {
          color: var(--accent-primary);
          font-weight: 600;
          margin-left: var(--space-1);
        }

        @media (max-width: 1024px) {
          .auth-branding {
            display: none;
          }
        }

        @media (max-width: 480px) {
          .auth-form-container {
            padding: var(--space-4);
          }
        }
      `}</style>
        </div>
    );
}
