'use client';

import { useState } from 'react';
import Link from 'next/link';
import PageHeader from '@/components/PageHeader';
import {
  Plus,
  Filter,
  Grid,
  List,
  ArrowRight,
  Clock,
  Users,
  BookOpen,
  MoreVertical
} from 'lucide-react';

// Mock course data
const coursesData = [
  {
    id: 'cs301',
    code: 'CS301',
    name: 'Algorithms',
    professor: 'Dr. Smith',
    semester: 'Spring 2024',
    progress: 68,
    color: '#6366F1',
    nextDeadline: 'Project Proposal - 2 days',
    students: 45,
    status: 'active'
  },
  {
    id: 'math202',
    code: 'MATH202',
    name: 'Linear Algebra',
    professor: 'Dr. Johnson',
    semester: 'Spring 2024',
    progress: 45,
    color: '#8B5CF6',
    nextDeadline: 'Problem Set 5 - 4 days',
    students: 32,
    status: 'active'
  },
  {
    id: 'eng101',
    code: 'ENG101',
    name: 'Academic Writing',
    professor: 'Prof. Williams',
    semester: 'Spring 2024',
    progress: 82,
    color: '#06B6D4',
    nextDeadline: 'Essay Draft - 1 week',
    students: 28,
    status: 'active'
  },
  {
    id: 'phys101',
    code: 'PHYS101',
    name: 'Physics I',
    professor: 'Dr. Brown',
    semester: 'Fall 2023',
    progress: 100,
    color: '#10B981',
    nextDeadline: null,
    students: 50,
    status: 'completed'
  },
];

const filters = [
  { id: 'all', label: 'All Courses' },
  { id: 'active', label: 'Active' },
  { id: 'completed', label: 'Completed' },
];

export default function CoursesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch Courses
        const coursesRes = await fetch('/api/tools', {
          method: 'POST',
          body: JSON.stringify({ toolName: 'get_courses', parameters: { includeDetails: true } })
        });
        const coursesData = await coursesRes.json();

        // Fetch Assignments for deadlines
        const assignmentsRes = await fetch('/api/tools', {
          method: 'POST',
          body: JSON.stringify({ toolName: 'get_assignments', parameters: { status: 'upcoming' } })
        });
        const assignmentsData = await assignmentsRes.json();

        if (coursesData.success) {
          const assignments = assignmentsData.success ? assignmentsData.result.assignments : [];

          const enrichedCourses = coursesData.result.courses.map(course => {
            // Find next deadline for this course
            const courseAssignments = assignments.filter(a => a.courseId === course.id);
            const nextAssignment = courseAssignments.length > 0 ? courseAssignments[0] : null;

            let deadlineText = null;
            if (nextAssignment) {
              const days = Math.ceil((new Date(nextAssignment.dueDate) - new Date()) / (1000 * 60 * 60 * 24));
              deadlineText = `${nextAssignment.title} - ${days} days`;
            }

            return {
              id: course.id,
              code: course.code,
              name: course.name,
              professor: course.professor,
              semester: course.semester,
              progress: course.progress || 0,
              color: course.code.includes('CS') ? '#6366F1' : course.code.includes('MATH') ? '#8B5CF6' : '#06B6D4',
              nextDeadline: deadlineText,
              students: Math.floor(Math.random() * 30) + 20, // Mock student count as it's not in DB
              status: 'active' // Assumption
            };
          });
          setCourses(enrichedCourses);
        }
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter courses based on search and filter
  const filteredCourses = courses.filter(course => {
    const matchesSearch =
      course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.code.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      activeFilter === 'all' ||
      course.status === activeFilter;

    return matchesSearch && matchesFilter;
  });

  return (
    <>
      {/* CENTRALIZED HEADER with search, filters, and actions */}
      <PageHeader
        title="My Courses"
        subtitle={`${filteredCourses.length} courses this semester`}
        showSearch={true}
        searchPlaceholder="Search courses..."
        searchValue={searchQuery}
        onSearch={setSearchQuery}
        filters={filters}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        secondaryActions={[
          {
            icon: viewMode === 'grid' ? List : Grid,
            label: 'Toggle view',
            onClick: () => setViewMode(viewMode === 'grid' ? 'list' : 'grid')
          }
        ]}
        primaryAction={{
          icon: Plus,
          label: 'Add Course',
          onClick: () => console.log('Add course modal')
        }}
      />

      <div className="page-content">
        <div className={`courses-container ${viewMode}`}>
          {filteredCourses.map((course) => (
            <CourseCard key={course.id} course={course} viewMode={viewMode} />
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="empty-state">
            <BookOpen size={48} />
            <h3>No courses found</h3>
            <p>Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>

      <style jsx>{`
        .courses-container {
          display: grid;
          gap: var(--space-6);
        }

        .courses-container.grid {
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
        }

        .courses-container.list {
          grid-template-columns: 1fr;
        }

        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: var(--space-16);
          color: var(--text-tertiary);
          text-align: center;
        }

        .empty-state h3 {
          margin-top: var(--space-4);
          font-size: 1.125rem;
          color: var(--text-secondary);
        }

        .empty-state p {
          margin-top: var(--space-2);
          font-size: 0.875rem;
        }
      `}</style>
    </>
  );
}

// Course Card Component
function CourseCard({ course, viewMode }) {
  const isGrid = viewMode === 'grid';

  return (
    <Link href={`/courses/${course.id}`} className="course-card">
      {/* Color indicator bar */}
      <div
        className="course-color-bar"
        style={{ background: course.color }}
      />

      <div className="course-content">
        <div className="course-header">
          <div className="course-info">
            <span className="course-code" style={{ color: course.color }}>
              {course.code}
            </span>
            <h3 className="course-name">{course.name}</h3>
            <span className="course-professor">{course.professor}</span>
          </div>

          <button
            className="course-menu-btn"
            onClick={(e) => {
              e.preventDefault();
              console.log('Course menu');
            }}
          >
            <MoreVertical size={18} />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="course-progress">
          <div className="progress-header">
            <span>Progress</span>
            <span className="progress-value">{course.progress}%</span>
          </div>
          <div className="progress-bar-container">
            <div
              className="progress-bar"
              style={{
                width: `${course.progress}%`,
                background: course.color
              }}
            />
          </div>
        </div>

        {/* Meta Info */}
        <div className="course-meta">
          {course.nextDeadline && (
            <div className="meta-item">
              <Clock size={14} />
              <span>{course.nextDeadline}</span>
            </div>
          )}
          <div className="meta-item">
            <Users size={14} />
            <span>{course.students} students</span>
          </div>
        </div>

        {/* Quick Action */}
        <div className="course-action">
          <span>View Details</span>
          <ArrowRight size={16} />
        </div>
      </div>

      <style jsx>{`
        .course-card {
          display: flex;
          flex-direction: column;
          background: var(--bg-primary);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-lg);
          overflow: hidden;
          transition: all var(--duration-fast) var(--ease-out);
        }

        .course-card:hover {
          border-color: var(--border-medium);
          box-shadow: var(--shadow-md);
          transform: translateY(-2px);
        }

        .course-color-bar {
          height: 4px;
        }

        .course-content {
          padding: var(--space-5);
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
        }

        .course-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .course-info {
          display: flex;
          flex-direction: column;
          gap: var(--space-1);
        }

        .course-code {
          font-size: 0.75rem;
          font-weight: 600;
          font-family: var(--font-mono);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .course-name {
          font-size: 1.0625rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .course-professor {
          font-size: 0.8125rem;
          color: var(--text-secondary);
        }

        .course-menu-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: var(--radius-md);
          color: var(--text-tertiary);
          transition: all var(--duration-fast) var(--ease-out);
        }

        .course-menu-btn:hover {
          background: var(--bg-hover);
          color: var(--text-secondary);
        }

        .course-progress {
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
        }

        .progress-header {
          display: flex;
          justify-content: space-between;
          font-size: 0.75rem;
          color: var(--text-secondary);
        }

        .progress-value {
          font-weight: 600;
          color: var(--text-primary);
        }

        .progress-bar-container {
          height: 6px;
          background: var(--bg-tertiary);
          border-radius: 3px;
          overflow: hidden;
        }

        .progress-bar {
          height: 100%;
          border-radius: 3px;
          transition: width 0.5s var(--ease-out);
        }

        .course-meta {
          display: flex;
          gap: var(--space-4);
          flex-wrap: wrap;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: var(--space-1);
          font-size: 0.75rem;
          color: var(--text-secondary);
        }

        .course-action {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: var(--space-3);
          border-top: 1px solid var(--border-light);
          font-size: 0.8125rem;
          font-weight: 500;
          color: var(--accent-primary);
        }
      `}</style>
    </Link>
  );
}
