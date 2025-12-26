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
  Timer,
  Heart
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

export default function Dashboard() {
  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? 'Good morning' : currentHour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <>
      <PageHeader
        title={`${greeting}, Alex! 👋`}
        subtitle="Let's make today productive"
      />

      <div className="page-content">
        {/* AI Companion Card - CENTRAL and prominent but clean white */}
        <div className="companion-section">
          <div className="companion-card">
            <div className="companion-left">
              <div className="companion-avatar">
                <Sparkles size={28} />
                <span className="avatar-status" />
              </div>
            </div>

            <div className="companion-center">
              <div className="companion-greeting">
                <span className="companion-name">ME</span>
                <span className="companion-badge">Your Study Buddy</span>
              </div>
              <p className="companion-message">
                Hey! I noticed you've got a project due soon. Want to tackle it together?
              </p>
            </div>

            <div className="companion-right">
              <Link href="/chat" className="talk-btn">
                <MessageSquare size={18} />
                Let's Talk
              </Link>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="dashboard-grid">

          {/* What's Next - Priority Tasks */}
          <div className="card whats-next-card">
            <div className="card-header">
              <h3 className="card-title">
                <Clock size={18} />
                What's Next
              </h3>
              <Link href="/calendar" className="view-all">
                View all <ArrowRight size={14} />
              </Link>
            </div>

            <ul className="task-list">
              {upcomingDeadlines.map((deadline, index) => (
                <li key={deadline.id} className="task-item">
                  <span className="task-number">{index + 1}</span>
                  <div className="task-content">
                    <span className="task-title">{deadline.title}</span>
                    <span className="task-course">{deadline.course}</span>
                  </div>
                  <span className={`task-due ${deadline.priority}`}>
                    {deadline.due}
                  </span>
                </li>
              ))}
            </ul>

            <Link href="/chat" className="ask-me-link">
              <Sparkles size={14} />
              Ask ME to help prioritize
            </Link>
          </div>

          {/* My Courses */}
          <div className="card courses-card">
            <div className="card-header">
              <h3 className="card-title">
                <BookOpen size={18} />
                My Courses
              </h3>
              <Link href="/courses" className="view-all">
                View all <ArrowRight size={14} />
              </Link>
            </div>

            <div className="courses-list">
              {courses.map((course) => (
                <Link
                  key={course.id}
                  href={`/courses/${course.id}`}
                  className="course-row"
                >
                  <div className="course-color" style={{ background: course.color }} />
                  <div className="course-info">
                    <span className="course-code">{course.code}</span>
                    <span className="course-name">{course.name}</span>
                  </div>
                  <div className="course-progress">
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{ width: `${course.progress}%`, background: course.color }}
                      />
                    </div>
                    <span className="progress-text">{course.progress}%</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Today's Schedule */}
          <div className="card schedule-card">
            <div className="card-header">
              <h3 className="card-title">
                <Calendar size={18} />
                Today
              </h3>
              <Link href="/calendar" className="view-all">
                Full schedule <ArrowRight size={14} />
              </Link>
            </div>

            <div className="schedule-list">
              <div className="schedule-item done">
                <span className="schedule-time">10:00</span>
                <div className="schedule-dot" />
                <div className="schedule-content">
                  <span className="schedule-title">CS301 Lecture</span>
                  <span className="schedule-location">Room 205</span>
                </div>
              </div>
              <div className="schedule-item current">
                <span className="schedule-time">14:00</span>
                <div className="schedule-dot" />
                <div className="schedule-content">
                  <span className="schedule-title">Study Session</span>
                  <span className="schedule-location">Library</span>
                </div>
                <span className="now-badge">Now</span>
              </div>
              <div className="schedule-item upcoming">
                <span className="schedule-time">16:00</span>
                <div className="schedule-dot" />
                <div className="schedule-content">
                  <span className="schedule-title">Project Work</span>
                  <span className="schedule-location">Home</span>
                </div>
              </div>
            </div>
          </div>

          {/* Wellness */}
          <div className="card wellness-card">
            <div className="card-header">
              <h3 className="card-title">
                <Heart size={18} />
                How You're Doing
              </h3>
            </div>

            <div className="wellness-score">
              <div className="score-circle">
                <span className="score-number">72</span>
              </div>
              <span className="score-label">Balance Score</span>
            </div>

            <div className="wellness-items">
              <div className="wellness-item good">
                <CheckCircle2 size={14} />
                <span>Sleep: On track</span>
              </div>
              <div className="wellness-item warning">
                <AlertCircle size={14} />
                <span>Workload: High</span>
              </div>
            </div>

            <Link href="/chat" className="ask-me-link">
              <Sparkles size={14} />
              Chat about balance
            </Link>
          </div>

        </div>
      </div>

      <style jsx>{`
        /* Companion Section - Clean White Design */
        .companion-section {
          margin-bottom: var(--space-6);
        }

        .companion-card {
          display: flex;
          align-items: center;
          gap: var(--space-6);
          padding: var(--space-6);
          background: var(--bg-primary);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-xl);
          box-shadow: var(--shadow-sm);
        }

        .companion-avatar {
          width: 64px;
          height: 64px;
          background: linear-gradient(135deg, #6366F1, #8B5CF6);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          position: relative;
        }

        .avatar-status {
          position: absolute;
          bottom: 2px;
          right: 2px;
          width: 14px;
          height: 14px;
          background: #10B981;
          border: 3px solid white;
          border-radius: 50%;
        }

        .companion-center {
          flex: 1;
        }

        .companion-greeting {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          margin-bottom: var(--space-2);
        }

        .companion-name {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--accent-primary);
        }

        .companion-badge {
          padding: 4px 10px;
          background: var(--bg-secondary);
          border-radius: var(--radius-full);
          font-size: 0.75rem;
          color: var(--text-secondary);
        }

        .companion-message {
          font-size: 1rem;
          color: var(--text-secondary);
          line-height: 1.5;
        }

        .talk-btn {
          display: inline-flex;
          align-items: center;
          gap: var(--space-2);
          padding: var(--space-3) var(--space-5);
          background: var(--accent-primary);
          color: white;
          border-radius: var(--radius-lg);
          font-size: 0.9375rem;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.2s ease;
          box-shadow: 0 2px 8px rgba(99, 102, 241, 0.25);
        }

        .talk-btn:hover {
          background: #5558E8;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.35);
        }

        /* Dashboard Grid */
        .dashboard-grid {
          display: grid;
          grid-template-columns: repeat(12, 1fr);
          gap: var(--space-5);
        }

        .whats-next-card {
          grid-column: span 5;
        }

        .courses-card {
          grid-column: span 7;
        }

        .schedule-card {
          grid-column: span 8;
        }

        .wellness-card {
          grid-column: span 4;
        }

        .card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: var(--space-4);
        }

        .card-title {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          font-size: 0.9375rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .view-all {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.8125rem;
          color: var(--accent-primary);
          text-decoration: none;
        }

        .view-all:hover {
          text-decoration: underline;
        }

        /* Task List */
        .task-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
          margin-bottom: var(--space-4);
        }

        .task-item {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          padding: var(--space-3);
          background: var(--bg-secondary);
          border-radius: var(--radius-md);
        }

        .task-number {
          width: 24px;
          height: 24px;
          background: var(--accent-light);
          color: var(--accent-primary);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .task-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .task-title {
          font-size: 0.875rem;
          font-weight: 500;
        }

        .task-course {
          font-size: 0.75rem;
          color: var(--text-secondary);
        }

        .task-due {
          padding: 4px 8px;
          border-radius: var(--radius-full);
          font-size: 0.6875rem;
          font-weight: 600;
        }

        .task-due.high {
          background: var(--error-light);
          color: var(--error);
        }

        .task-due.medium {
          background: var(--warning-light);
          color: #B45309;
        }

        .task-due.low {
          background: var(--success-light);
          color: var(--success);
        }

        .ask-me-link {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--space-2);
          padding: var(--space-3);
          background: var(--bg-secondary);
          border-radius: var(--radius-md);
          font-size: 0.8125rem;
          color: var(--accent-primary);
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .ask-me-link:hover {
          background: var(--accent-light);
        }

        /* Courses List */
        .courses-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
        }

        .course-row {
          display: flex;
          align-items: center;
          gap: var(--space-4);
          padding: var(--space-3);
          background: var(--bg-secondary);
          border-radius: var(--radius-md);
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .course-row:hover {
          background: var(--bg-hover);
        }

        .course-color {
          width: 4px;
          height: 36px;
          border-radius: 2px;
        }

        .course-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .course-code {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text-secondary);
          font-family: var(--font-mono);
        }

        .course-name {
          font-size: 0.9375rem;
          font-weight: 500;
          color: var(--text-primary);
        }

        .course-progress {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          width: 160px;
        }

        .progress-bar {
          flex: 1;
          height: 6px;
          background: var(--bg-tertiary);
          border-radius: 3px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          border-radius: 3px;
        }

        .progress-text {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text-secondary);
          width: 32px;
          text-align: right;
        }

        /* Schedule List */
        .schedule-list {
          display: flex;
          flex-direction: column;
        }

        .schedule-item {
          display: flex;
          align-items: flex-start;
          gap: var(--space-4);
          padding: var(--space-4) 0;
          position: relative;
        }

        .schedule-item:not(:last-child)::after {
          content: '';
          position: absolute;
          left: 60px;
          top: 28px;
          bottom: 0;
          width: 2px;
          background: var(--border-light);
        }

        .schedule-time {
          width: 44px;
          font-size: 0.8125rem;
          font-weight: 500;
          color: var(--text-secondary);
          font-family: var(--font-mono);
        }

        .schedule-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: var(--bg-tertiary);
          border: 2px solid var(--border-medium);
          margin-top: 4px;
          flex-shrink: 0;
        }

        .schedule-item.current .schedule-dot {
          background: var(--accent-primary);
          border-color: var(--accent-primary);
          box-shadow: 0 0 0 4px var(--accent-light);
        }

        .schedule-item.done {
          opacity: 0.5;
        }

        .schedule-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .schedule-title {
          font-size: 0.9375rem;
          font-weight: 500;
        }

        .schedule-location {
          font-size: 0.75rem;
          color: var(--text-secondary);
        }

        .now-badge {
          padding: 2px 8px;
          background: var(--accent-primary);
          color: white;
          font-size: 0.625rem;
          font-weight: 600;
          border-radius: var(--radius-full);
          text-transform: uppercase;
        }

        /* Wellness Card */
        .wellness-score {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--space-2);
          margin-bottom: var(--space-4);
        }

        .score-circle {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #D1FAE5, #A7F3D0);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .score-number {
          font-size: 1.75rem;
          font-weight: 700;
          color: var(--success);
        }

        .score-label {
          font-size: 0.75rem;
          color: var(--text-secondary);
        }

        .wellness-items {
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
          margin-bottom: var(--space-4);
        }

        .wellness-item {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          font-size: 0.8125rem;
        }

        .wellness-item.good {
          color: var(--success);
        }

        .wellness-item.warning {
          color: var(--warning);
        }

        @media (max-width: 1024px) {
          .companion-card {
            flex-direction: column;
            text-align: center;
          }

          .companion-right {
            width: 100%;
          }

          .talk-btn {
            width: 100%;
            justify-content: center;
          }

          .whats-next-card,
          .courses-card,
          .schedule-card,
          .wellness-card {
            grid-column: span 12;
          }
        }
      `}</style>
    </>
  );
}
