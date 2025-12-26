'use client';

import { useState } from 'react';
import PageHeader from '@/components/PageHeader';
import {
  User,
  Bell,
  Palette,
  Link2,
  Shield,
  Sparkles,
  ChevronRight,
  Moon,
  Sun,
  Monitor,
  ExternalLink,
  Check
} from 'lucide-react';

const settingsSections = [
  { id: 'profile', icon: User, label: 'Profile' },
  { id: 'notifications', icon: Bell, label: 'Notifications' },
  { id: 'appearance', icon: Palette, label: 'Appearance' },
  { id: 'integrations', icon: Link2, label: 'Integrations' },
  { id: 'ai', icon: Sparkles, label: 'AI Preferences' },
  { id: 'privacy', icon: Shield, label: 'Privacy & Security' },
];

import { useAuth } from '@/contexts/AuthContext';

export default function SettingsPage() {
  const { user, updateProfile } = useAuth();
  const [activeSection, setActiveSection] = useState('profile');
  const [theme, setTheme] = useState('light');
  const [notifications, setNotifications] = useState({
    deadlines: true,
    aiInsights: true,
    wellness: false,
    email: true
  });

  // Local state for form inputs
  const [formData, setFormData] = useState({
    name: user?.name || '',
    university: user?.university || '',
    major: user?.major || ''
  });

  const handleSaveProfile = () => {
    updateProfile(formData);
    alert('Profile updated successfully!');
  };

  return (
    <>
      <PageHeader
        title="Settings"
        subtitle="Manage your preferences"
      />

      <div className="page-content">
        <div className="settings-layout">
          {/* Settings Navigation - CENTRALIZED in left sidebar */}
          <nav className="settings-nav">
            {settingsSections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  className={`settings-nav-item ${activeSection === section.id ? 'active' : ''}`}
                  onClick={() => setActiveSection(section.id)}
                >
                  <Icon size={18} />
                  <span>{section.label}</span>
                  <ChevronRight size={16} className="nav-arrow" />
                </button>
              );
            })}
          </nav>

          {/* Settings Content */}
          <div className="settings-content">
            {activeSection === 'profile' && (
              <SettingsSection title="Profile Settings">
                <div className="profile-header">
                  <div className="profile-avatar">
                    <span>{user?.name?.[0] || 'A'}</span>
                  </div>
                  <div className="profile-info">
                    <h3>{user?.name || 'Guest'}</h3>
                    <p>{user?.email || 'guest@example.com'}</p>
                  </div>
                  <button className="btn btn-secondary" onClick={handleSaveProfile}>Save Changes</button>
                </div>

                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    className="input"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Email</label>
                  <input type="email" className="input" value={user?.email || ''} disabled />
                </div>

                <div className="form-group">
                  <label>University</label>
                  <input
                    type="text"
                    className="input"
                    value={formData.university}
                    onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Major</label>
                  <input
                    type="text"
                    className="input"
                    value={formData.major}
                    onChange={(e) => setFormData({ ...formData, major: e.target.value })}
                  />
                </div>
              </SettingsSection>
            )}

            {activeSection === 'notifications' && (
              <SettingsSection title="Notification Preferences">
                <p className="section-description">
                  Choose what notifications you want to receive
                </p>

                <div className="toggle-list">
                  <ToggleItem
                    label="Deadline Reminders"
                    description="Get notified before assignments are due"
                    checked={notifications.deadlines}
                    onChange={() => setNotifications({ ...notifications, deadlines: !notifications.deadlines })}
                  />
                  <ToggleItem
                    label="AI Insights"
                    description="Receive personalized study recommendations"
                    checked={notifications.aiInsights}
                    onChange={() => setNotifications({ ...notifications, aiInsights: !notifications.aiInsights })}
                  />
                  <ToggleItem
                    label="Wellness Check-ins"
                    description="Periodic reminders to take breaks"
                    checked={notifications.wellness}
                    onChange={() => setNotifications({ ...notifications, wellness: !notifications.wellness })}
                  />
                  <ToggleItem
                    label="Email Notifications"
                    description="Receive important updates via email"
                    checked={notifications.email}
                    onChange={() => setNotifications({ ...notifications, email: !notifications.email })}
                  />
                </div>
              </SettingsSection>
            )}

            {activeSection === 'appearance' && (
              <SettingsSection title="Appearance">
                <p className="section-description">
                  Customize how StudyPilot looks
                </p>

                <div className="theme-selector">
                  <ThemeOption
                    icon={Sun}
                    label="Light"
                    active={theme === 'light'}
                    onClick={() => setTheme('light')}
                  />
                  <ThemeOption
                    icon={Moon}
                    label="Dark"
                    active={theme === 'dark'}
                    onClick={() => setTheme('dark')}
                  />
                  <ThemeOption
                    icon={Monitor}
                    label="System"
                    active={theme === 'system'}
                    onClick={() => setTheme('system')}
                  />
                </div>
              </SettingsSection>
            )}

            {activeSection === 'integrations' && (
              <SettingsSection title="Integrations">
                <p className="section-description">
                  Connect your accounts for a seamless experience
                </p>

                <div className="integrations-list">
                  <IntegrationItem
                    name="Google Calendar"
                    description="Sync your academic schedule"
                    connected={true}
                  />
                  <IntegrationItem
                    name="Canvas LMS"
                    description="Import courses and assignments"
                    connected={false}
                  />
                  <IntegrationItem
                    name="Notion"
                    description="Sync notes and study materials"
                    connected={false}
                  />
                </div>
              </SettingsSection>
            )}

            {activeSection === 'ai' && (
              <SettingsSection title="AI Preferences">
                <p className="section-description">
                  Customize how your AI assistant behaves
                </p>

                <div className="form-group">
                  <label>Response Style</label>
                  <select className="input">
                    <option>Concise</option>
                    <option>Detailed</option>
                    <option>Conversational</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Proactivity Level</label>
                  <select className="input">
                    <option>High - Suggest improvements frequently</option>
                    <option>Medium - Balanced suggestions</option>
                    <option>Low - Only when asked</option>
                  </select>
                </div>

                <div className="toggle-list">
                  <ToggleItem
                    label="Smart Scheduling"
                    description="Let AI optimize your study schedule"
                    checked={true}
                    onChange={() => { }}
                  />
                  <ToggleItem
                    label="Wellness Monitoring"
                    description="Allow AI to track stress patterns"
                    checked={true}
                    onChange={() => { }}
                  />
                </div>
              </SettingsSection>
            )}

            {activeSection === 'privacy' && (
              <SettingsSection title="Privacy & Security">
                <p className="section-description">
                  Control your data and privacy settings
                </p>

                <div className="toggle-list">
                  <ToggleItem
                    label="Usage Analytics"
                    description="Help improve StudyPilot with anonymous usage data"
                    checked={true}
                    onChange={() => { }}
                  />
                  <ToggleItem
                    label="Two-Factor Authentication"
                    description="Add an extra layer of security"
                    checked={false}
                    onChange={() => { }}
                  />
                </div>

                <div className="danger-zone">
                  <h4>Danger Zone</h4>
                  <button className="btn btn-danger">Delete Account</button>
                </div>
              </SettingsSection>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .settings-layout {
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: var(--space-8);
        }

        .settings-nav {
          display: flex;
          flex-direction: column;
          gap: var(--space-1);
          background: var(--bg-primary);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-lg);
          padding: var(--space-3);
          height: fit-content;
          position: sticky;
          top: calc(var(--header-height) + var(--space-8));
        }

        .settings-nav-item {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          padding: var(--space-3) var(--space-4);
          border-radius: var(--radius-md);
          font-size: 0.9375rem;
          color: var(--text-secondary);
          transition: all var(--duration-fast) var(--ease-out);
          text-align: left;
        }

        .settings-nav-item:hover {
          background: var(--bg-hover);
          color: var(--text-primary);
        }

        .settings-nav-item.active {
          background: var(--accent-light);
          color: var(--accent-primary);
        }

        .settings-nav-item span {
          flex: 1;
        }

        .nav-arrow {
          opacity: 0;
          transform: translateX(-4px);
          transition: all var(--duration-fast) var(--ease-out);
        }

        .settings-nav-item:hover .nav-arrow,
        .settings-nav-item.active .nav-arrow {
          opacity: 1;
          transform: translateX(0);
        }

        .settings-content {
          background: var(--bg-primary);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-lg);
          padding: var(--space-8);
        }

        .section-description {
          color: var(--text-secondary);
          margin-bottom: var(--space-6);
        }

        .profile-header {
          display: flex;
          align-items: center;
          gap: var(--space-4);
          padding-bottom: var(--space-6);
          border-bottom: 1px solid var(--border-light);
          margin-bottom: var(--space-6);
        }

        .profile-avatar {
          width: 72px;
          height: 72px;
          border-radius: var(--radius-full);
          background: var(--accent-gradient);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          font-weight: 600;
          color: white;
        }

        .profile-info {
          flex: 1;
        }

        .profile-info h3 {
          font-size: 1.125rem;
          font-weight: 600;
        }

        .profile-info p {
          font-size: 0.875rem;
          color: var(--text-secondary);
        }

        .form-group {
          margin-bottom: var(--space-5);
        }

        .form-group label {
          display: block;
          font-size: 0.875rem;
          font-weight: 500;
          margin-bottom: var(--space-2);
          color: var(--text-secondary);
        }

        .toggle-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
        }

        .theme-selector {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--space-4);
        }

        .integrations-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
        }

        .danger-zone {
          margin-top: var(--space-8);
          padding-top: var(--space-6);
          border-top: 1px solid var(--error-light);
        }

        .danger-zone h4 {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--error);
          margin-bottom: var(--space-4);
        }

        .btn-danger {
          padding: var(--space-3) var(--space-5);
          background: var(--error-light);
          color: var(--error);
          border: 1px solid var(--error);
          border-radius: var(--radius-md);
          font-size: 0.875rem;
          font-weight: 500;
        }

        .btn-danger:hover {
          background: var(--error);
          color: white;
        }

        @media (max-width: 1024px) {
          .settings-layout {
            grid-template-columns: 1fr;
          }

          .settings-nav {
            position: static;
            flex-direction: row;
            overflow-x: auto;
            padding: var(--space-2);
          }

          .settings-nav-item {
            white-space: nowrap;
          }

          .nav-arrow {
            display: none;
          }
        }
      `}</style>
    </>
  );
}

// Reusable Components
function SettingsSection({ title, children }) {
  return (
    <div className="settings-section">
      <h2>{title}</h2>
      {children}
      <style jsx>{`
        .settings-section h2 {
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: var(--space-4);
        }
      `}</style>
    </div>
  );
}

function ToggleItem({ label, description, checked, onChange }) {
  return (
    <div className="toggle-item">
      <div className="toggle-info">
        <span className="toggle-label">{label}</span>
        <span className="toggle-description">{description}</span>
      </div>
      <button
        className={`toggle-switch ${checked ? 'active' : ''}`}
        onClick={onChange}
      >
        <span className="toggle-thumb" />
      </button>
      <style jsx>{`
        .toggle-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--space-4);
          background: var(--bg-secondary);
          border-radius: var(--radius-md);
        }

        .toggle-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .toggle-label {
          font-size: 0.9375rem;
          font-weight: 500;
        }

        .toggle-description {
          font-size: 0.8125rem;
          color: var(--text-secondary);
        }

        .toggle-switch {
          width: 48px;
          height: 28px;
          border-radius: 14px;
          background: var(--bg-tertiary);
          border: 1px solid var(--border-light);
          position: relative;
          transition: all var(--duration-fast) var(--ease-out);
        }

        .toggle-switch.active {
          background: var(--accent-primary);
          border-color: var(--accent-primary);
        }

        .toggle-thumb {
          position: absolute;
          top: 2px;
          left: 2px;
          width: 22px;
          height: 22px;
          background: white;
          border-radius: 11px;
          box-shadow: var(--shadow-sm);
          transition: transform var(--duration-fast) var(--ease-out);
        }

        .toggle-switch.active .toggle-thumb {
          transform: translateX(20px);
        }
      `}</style>
    </div>
  );
}

function ThemeOption({ icon: Icon, label, active, onClick }) {
  return (
    <button
      className={`theme-option ${active ? 'active' : ''}`}
      onClick={onClick}
    >
      <Icon size={24} />
      <span>{label}</span>
      {active && <Check size={16} className="check-icon" />}
      <style jsx>{`
        .theme-option {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--space-2);
          padding: var(--space-6);
          background: var(--bg-secondary);
          border: 2px solid var(--border-light);
          border-radius: var(--radius-lg);
          color: var(--text-secondary);
          transition: all var(--duration-fast) var(--ease-out);
          position: relative;
        }

        .theme-option:hover {
          border-color: var(--border-medium);
        }

        .theme-option.active {
          border-color: var(--accent-primary);
          background: var(--accent-light);
          color: var(--accent-primary);
        }

        .theme-option span {
          font-size: 0.875rem;
          font-weight: 500;
        }

        .theme-option :global(.check-icon) {
          position: absolute;
          top: var(--space-2);
          right: var(--space-2);
          color: var(--accent-primary);
        }
      `}</style>
    </button>
  );
}

function IntegrationItem({ name, description, connected }) {
  return (
    <div className="integration-item">
      <div className="integration-info">
        <span className="integration-name">{name}</span>
        <span className="integration-description">{description}</span>
      </div>
      <button className={`btn ${connected ? 'btn-secondary' : 'btn-primary'}`}>
        {connected ? 'Disconnect' : 'Connect'}
        {!connected && <ExternalLink size={14} />}
      </button>
      <style jsx>{`
        .integration-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--space-4);
          background: var(--bg-secondary);
          border-radius: var(--radius-md);
        }

        .integration-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .integration-name {
          font-size: 0.9375rem;
          font-weight: 500;
        }

        .integration-description {
          font-size: 0.8125rem;
          color: var(--text-secondary);
        }
      `}</style>
    </div>
  );
}
