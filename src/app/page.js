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

export default function Dashboard() {
  const { user } = useAuth(); // If auth is available, use name
  const [deadlines, setDeadlines] = useState([]);
  const [courses, setCourses] = useState([]);
  const [wellness, setWellness] = useState({ score: 0, status: 'loading', averages: {} });
  const [loading, setLoading] = useState(true);

  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? 'Good morning' : currentHour < 17 ? 'Good afternoon' : 'Good evening';
  const userName = user?.name?.split(' ')[0] || 'Alex';

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Courses
        const coursesRes = await fetch('/api/tools', {
          method: 'POST',
          body: JSON.stringify({ toolName: 'get_courses', parameters: { includeDetails: true } })
        });
        const coursesData = await coursesRes.json();

        // Fetch Assignments/Deadlines
        const deadlinesRes = await fetch('/api/tools', {
          method: 'POST',
          body: JSON.stringify({ toolName: 'get_assignments', parameters: { status: 'upcoming', limit: 3 } })
        });
        const deadlinesData = await deadlinesRes.json();

        // Fetch Wellness
        const wellnessRes = await fetch('/api/tools', {
          method: 'POST',
          body: JSON.stringify({ toolName: 'get_wellness_status', parameters: { period: 'this_week' } })
        });
        const wellnessData = await wellnessRes.json();

        if (coursesData.success) {
          setCourses(coursesData.result.courses.map(c => ({
            id: c.id,
            name: c.name,
            code: c.code,
            progress: c.progress,
            color: c.code.includes('CS') ? '#6366F1' : c.code.includes('MATH') ? '#8B5CF6' : '#06B6D4'
          })));
        }

        if (deadlinesData.success) {
          setDeadlines(deadlinesData.result.assignments.map(a => {
            const days = Math.ceil((new Date(a.dueDate) - new Date()) / (1000 * 60 * 60 * 24));
            return {
              id: a.id,
              title: a.title,
              course: a.courseCode || 'General',
              due: isNaN(days) ? 'Soon' : days < 0 ? 'Overdue' : days === 0 ? 'Today' : `${days} days`,
              priority: days <= 2 ? 'high' : days <= 5 ? 'medium' : 'low'
            };
          }));
        }

        if (wellnessData.success) {
          setWellness(wellnessData.result);
        }

      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title={`${greeting}, ${userName}`}
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
              <p>
                {deadlines.length > 0
                  ? `You have ${deadlines.length} upcoming deadlines. Use the study planner to stay ahead!`
                  : "You're all caught up! Great time to review upcoming topics or take a wellness break."}
              </p>
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
            {deadlines.length > 0 ? (
              <ul className="deadline-list">
                {deadlines.map((deadline) => (
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
            ) : (
              <div className="text-center py-4 text-gray-500 text-sm">No upcoming deadlines</div>
            )}
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
                <span className="wellness-number">{wellness.score || '--'}</span>
                <span className="wellness-label">Balance Score</span>
              </div>
              <div className="wellness-indicators">
                <div className="wellness-indicator">
                  {wellness.averages?.sleep >= 7 ? (
                    <CheckCircle2 size={16} className="indicator-good" />
                  ) : (
                    <AlertCircle size={16} className="indicator-warning" />
                  )}
                  <span>Sleep: {wellness.averages?.sleep || '-'}h</span>
                </div>
                <div className="wellness-indicator">
                  {wellness.averages?.stress <= 3 ? (
                    <CheckCircle2 size={16} className="indicator-good" />
                  ) : (
                    <AlertCircle size={16} className="indicator-warning" />
                  )}
                  <span>Stress: {wellness.averages?.stress || '-'}</span>
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
