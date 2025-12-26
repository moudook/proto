'use client';

import { useState } from 'react';
import PageHeader from '@/components/PageHeader';
import {
  ArrowRight,
  Clock,
  TrendingUp,
  BookOpen,
  MessageSquare,
  Calendar,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Timer
} from 'lucide-react';
import Link from 'next/link';

// Mock data for demonstration
const upcomingDeadlines = [
  { id: 1, title: 'CS301 Project Proposal', course: 'Algorithms', due: '2 days', priority: 'high' },
  { id: 2, title: 'MATH202 Problem Set 5', course: 'Linear Algebra', due: '4 days', priority: 'medium' },
  { id: 3, title: 'ENG101 Essay Draft', course: 'Academic Writing', due: '1 week', priority: 'low' },
];

const courses = [
  { id: 'cs301', name: 'Algorithms', code: 'CS301', progress: 68, color: '#6366F1' },
  { id: 'math202', name: 'Linear Algebra', code: 'MATH202', progress: 45, color: '#8B5CF6' },
  { id: 'eng101', name: 'Academic Writing', code: 'ENG101', progress: 82, color: '#06B6D4' },
];

const quickActions = [
  { id: 'chat', label: 'Ask AI', icon: MessageSquare, href: '/chat', description: 'Get instant help' },
  { id: 'schedule', label: 'View Schedule', icon: Calendar, href: '/calendar', description: 'Today\'s events' },
  { id: 'courses', label: 'My Courses', icon: BookOpen, href: '/courses', description: 'Course materials' },
];

export default function Dashboard() {
  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? 'Good morning' : currentHour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <>
      <PageHeader
        title={`${greeting}, Alex`}
        subtitle="Here's what's happening with your academics today"
      />

      <div className="page-content">
        {/* Bento Grid Layout */}
        <div className="dashboard-grid">

          {/* AI Insight Card - Spans 2 columns */}
          <div className="card dashboard-insight-card">
            <div className="insight-icon">
              <Sparkles size={24} />
            </div>
            <div className="insight-content">
              <h3>AI Insight</h3>
              <p>You have 3 deadlines this week. I recommend starting the CS301 project today - it's worth 30% of your grade and typically takes 6+ hours.</p>
              <Link href="/chat" className="btn btn-primary" style={{ marginTop: '16px' }}>
                <MessageSquare size={16} />
                Let's Plan Together
              </Link>
            </div>
          </div>

          {/* Upcoming Deadlines */}
          <div className="card dashboard-deadlines-card">
            <div className="card-header">
              <h3 className="card-title">
                <Clock size={18} />
                Upcoming Deadlines
              </h3>
              <Link href="/calendar" className="btn btn-ghost btn-icon">
                <ArrowRight size={18} />
              </Link>
            </div>
            <ul className="deadline-list">
              {upcomingDeadlines.map((deadline) => (
                <li key={deadline.id} className="deadline-item">
                  <div className={`deadline-priority priority-${deadline.priority}`} />
                  <div className="deadline-info">
                    <span className="deadline-title">{deadline.title}</span>
                    <span className="deadline-course">{deadline.course}</span>
                  </div>
                  <span className="deadline-due">
                    <Timer size={14} />
                    {deadline.due}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Actions */}
          <div className="card dashboard-actions-card">
            <h3 className="card-title">Quick Actions</h3>
            <div className="quick-actions-grid">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Link key={action.id} href={action.href} className="quick-action-item">
                    <div className="quick-action-icon">
                      <Icon size={22} />
                    </div>
                    <div className="quick-action-text">
                      <span className="quick-action-label">{action.label}</span>
                      <span className="quick-action-description">{action.description}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Course Progress */}
          <div className="card dashboard-courses-card">
            <div className="card-header">
              <h3 className="card-title">
                <TrendingUp size={18} />
                Course Progress
              </h3>
              <Link href="/courses" className="btn btn-ghost btn-icon">
                <ArrowRight size={18} />
              </Link>
            </div>
            <div className="course-progress-list">
              {courses.map((course) => (
                <Link key={course.id} href={`/courses/${course.id}`} className="course-progress-item">
                  <div className="course-info">
                    <span className="course-code" style={{ color: course.color }}>{course.code}</span>
                    <span className="course-name">{course.name}</span>
                  </div>
                  <div className="progress-bar-container">
                    <div
                      className="progress-bar"
                      style={{ width: `${course.progress}%`, background: course.color }}
                    />
                  </div>
                  <span className="progress-value">{course.progress}%</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Wellness Check */}
          <div className="card dashboard-wellness-card">
            <div className="card-header">
              <h3 className="card-title">Wellness Check</h3>
            </div>
            <div className="wellness-meter">
              <div className="wellness-score">
                <span className="wellness-number">7.2</span>
                <span className="wellness-label">Balance Score</span>
              </div>
              <div className="wellness-indicators">
                <div className="wellness-indicator">
                  <CheckCircle2 size={16} className="indicator-good" />
                  <span>Sleep: Good</span>
                </div>
                <div className="wellness-indicator">
                  <AlertCircle size={16} className="indicator-warning" />
                  <span>Workload: High</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <style jsx>{`
        .dashboard-grid {
          display: grid;
          grid-template-columns: repeat(12, 1fr);
          gap: 24px;
        }

        .dashboard-insight-card {
          grid-column: span 8;
          display: flex;
          gap: 24px;
          background: linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%);
          border: 1px solid #C7D2FE;
        }

        .insight-icon {
          width: 56px;
          height: 56px;
          background: var(--accent-gradient);
          border-radius: var(--radius-lg);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          flex-shrink: 0;
        }

        .insight-content h3 {
          font-size: 1rem;
          font-weight: 600;
          color: var(--accent-primary);
          margin-bottom: 8px;
        }

        .insight-content p {
          color: var(--text-secondary);
          line-height: 1.6;
        }

        .dashboard-deadlines-card {
          grid-column: span 4;
        }

        .dashboard-actions-card {
          grid-column: span 4;
        }

        .dashboard-courses-card {
          grid-column: span 5;
        }

        .dashboard-wellness-card {
          grid-column: span 3;
        }

        .card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }

        .card-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.9375rem;
          font-weight: 600;
        }

        .deadline-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .deadline-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          background: var(--bg-secondary);
          border-radius: var(--radius-md);
        }

        .deadline-priority {
          width: 4px;
          height: 32px;
          border-radius: 2px;
        }

        .priority-high { background: var(--error); }
        .priority-medium { background: var(--warning); }
        .priority-low { background: var(--success); }

        .deadline-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .deadline-title {
          font-size: 0.875rem;
          font-weight: 500;
        }

        .deadline-course {
          font-size: 0.75rem;
          color: var(--text-secondary);
        }

        .deadline-due {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.75rem;
          color: var(--text-secondary);
          padding: 4px 8px;
          background: var(--bg-tertiary);
          border-radius: var(--radius-sm);
        }

        .quick-actions-grid {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-top: 16px;
        }

        .quick-action-item {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px;
          background: var(--bg-secondary);
          border-radius: var(--radius-md);
          transition: all var(--duration-fast) var(--ease-out);
        }

        .quick-action-item:hover {
          background: var(--bg-hover);
          transform: translateX(4px);
        }

        .quick-action-icon {
          width: 44px;
          height: 44px;
          background: var(--accent-light);
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--accent-primary);
        }

        .quick-action-text {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .quick-action-label {
          font-size: 0.9375rem;
          font-weight: 500;
        }

        .quick-action-description {
          font-size: 0.8125rem;
          color: var(--text-secondary);
        }

        .course-progress-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .course-progress-item {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 8px 0;
          transition: opacity var(--duration-fast) var(--ease-out);
        }

        .course-progress-item:hover {
          opacity: 0.8;
        }

        .course-info {
          width: 120px;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .course-code {
          font-size: 0.8125rem;
          font-weight: 600;
          font-family: var(--font-mono);
        }

        .course-name {
          font-size: 0.75rem;
          color: var(--text-secondary);
        }

        .progress-bar-container {
          flex: 1;
          height: 8px;
          background: var(--bg-tertiary);
          border-radius: 4px;
          overflow: hidden;
        }

        .progress-bar {
          height: 100%;
          border-radius: 4px;
          transition: width 0.5s var(--ease-out);
        }

        .progress-value {
          width: 40px;
          font-size: 0.8125rem;
          font-weight: 500;
          text-align: right;
          color: var(--text-secondary);
        }

        .wellness-meter {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .wellness-score {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 24px;
          background: linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 100%);
          border-radius: var(--radius-lg);
        }

        .wellness-number {
          font-size: 2.5rem;
          font-weight: 700;
          color: var(--success);
        }

        .wellness-label {
          font-size: 0.8125rem;
          color: var(--text-secondary);
        }

        .wellness-indicators {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .wellness-indicator {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.8125rem;
          color: var(--text-secondary);
        }

        .indicator-good {
          color: var(--success);
        }

        .indicator-warning {
          color: var(--warning);
        }

        @media (max-width: 1024px) {
          .dashboard-insight-card { grid-column: span 12; }
          .dashboard-deadlines-card { grid-column: span 6; }
          .dashboard-actions-card { grid-column: span 6; }
          .dashboard-courses-card { grid-column: span 8; }
          .dashboard-wellness-card { grid-column: span 4; }
        }

        @media (max-width: 768px) {
          .dashboard-insight-card,
          .dashboard-deadlines-card,
          .dashboard-actions-card,
          .dashboard-courses-card,
          .dashboard-wellness-card {
            grid-column: span 12;
          }
          
          .dashboard-insight-card {
            flex-direction: column;
          }
        }
      `}</style>
    </>
  );
}
