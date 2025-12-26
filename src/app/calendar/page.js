'use client';

import { useState } from 'react';
import PageHeader from '@/components/PageHeader';
import {
    ChevronLeft,
    ChevronRight,
    Plus,
    Clock,
    MapPin
} from 'lucide-react';

// Mock events data
const eventsData = [
    {
        id: 1,
        title: 'CS301 Lecture',
        type: 'lecture',
        time: '10:00 - 11:30',
        location: 'Room 205',
        color: '#6366F1',
        day: 1 // Monday
    },
    {
        id: 2,
        title: 'Study Session',
        type: 'study',
        time: '14:00 - 16:00',
        location: 'Library',
        color: '#8B5CF6',
        day: 2 // Tuesday
    },
    {
        id: 3,
        title: 'MATH202 Office Hours',
        type: 'office_hours',
        time: '13:00 - 14:00',
        location: 'Prof. Johnson Office',
        color: '#06B6D4',
        day: 4 // Thursday
    },
    {
        id: 4,
        title: 'Project Due',
        type: 'deadline',
        time: '23:59',
        location: null,
        color: '#EF4444',
        day: 5 // Friday
    },
];

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const timeSlots = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];

const viewFilters = [
    { id: 'week', label: 'Week' },
    { id: 'month', label: 'Month' },
];

export default function CalendarPage() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [activeView, setActiveView] = useState('week');

    // Get the week dates
    const getWeekDates = () => {
        const dates = [];
        const startOfWeek = new Date(currentDate);
        startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());

        for (let i = 0; i < 7; i++) {
            const date = new Date(startOfWeek);
            date.setDate(startOfWeek.getDate() + i);
            dates.push(date);
        }
        return dates;
    };

    const weekDates = getWeekDates();
    const today = new Date();

    const navigateWeek = (direction) => {
        const newDate = new Date(currentDate);
        newDate.setDate(currentDate.getDate() + (direction * 7));
        setCurrentDate(newDate);
    };

    const formatMonth = (date) => {
        return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    };

    return (
        <>
            {/* CENTRALIZED HEADER with view toggle and actions */}
            <PageHeader
                title="Calendar"
                subtitle={formatMonth(currentDate)}
                filters={viewFilters}
                activeFilter={activeView}
                onFilterChange={setActiveView}
                primaryAction={{
                    icon: Plus,
                    label: 'Add Event',
                    onClick: () => console.log('Add event modal')
                }}
            />

            <div className="page-content">
                <div className="calendar-container">
                    {/* Week Navigation */}
                    <div className="calendar-nav">
                        <button
                            className="nav-btn"
                            onClick={() => navigateWeek(-1)}
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <button
                            className="today-btn"
                            onClick={() => setCurrentDate(new Date())}
                        >
                            Today
                        </button>
                        <button
                            className="nav-btn"
                            onClick={() => navigateWeek(1)}
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>

                    {/* Week View */}
                    <div className="week-view">
                        {/* Time Column */}
                        <div className="time-column">
                            <div className="time-header"></div>
                            {timeSlots.map((time) => (
                                <div key={time} className="time-slot">
                                    {time}
                                </div>
                            ))}
                        </div>

                        {/* Day Columns */}
                        {weekDates.map((date, index) => {
                            const isToday =
                                date.getDate() === today.getDate() &&
                                date.getMonth() === today.getMonth() &&
                                date.getFullYear() === today.getFullYear();

                            const dayEvents = eventsData.filter(e => e.day === index);

                            return (
                                <div key={index} className="day-column">
                                    <div className={`day-header ${isToday ? 'today' : ''}`}>
                                        <span className="day-name">{daysOfWeek[index]}</span>
                                        <span className={`day-number ${isToday ? 'today-number' : ''}`}>
                                            {date.getDate()}
                                        </span>
                                    </div>

                                    <div className="day-events">
                                        {dayEvents.map((event) => (
                                            <div
                                                key={event.id}
                                                className="event-card"
                                                style={{
                                                    borderLeftColor: event.color,
                                                    background: `${event.color}10`
                                                }}
                                            >
                                                <span
                                                    className="event-title"
                                                    style={{ color: event.color }}
                                                >
                                                    {event.title}
                                                </span>
                                                <div className="event-meta">
                                                    <Clock size={12} />
                                                    <span>{event.time}</span>
                                                </div>
                                                {event.location && (
                                                    <div className="event-meta">
                                                        <MapPin size={12} />
                                                        <span>{event.location}</span>
                                                    </div>
                                                )}
                                            </div>
                                        ))}

                                        {/* Empty time slots */}
                                        {timeSlots.map((_, slotIndex) => (
                                            <div key={slotIndex} className="time-slot-bg" />
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Upcoming Events Summary */}
                    <div className="events-summary">
                        <h3>Today's Events</h3>
                        <div className="summary-list">
                            {eventsData.slice(0, 3).map((event) => (
                                <div key={event.id} className="summary-item">
                                    <div
                                        className="summary-indicator"
                                        style={{ background: event.color }}
                                    />
                                    <div className="summary-content">
                                        <span className="summary-title">{event.title}</span>
                                        <span className="summary-time">{event.time}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
        .calendar-container {
          display: flex;
          flex-direction: column;
          gap: var(--space-6);
        }

        .calendar-nav {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--space-4);
        }

        .nav-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: var(--radius-md);
          color: var(--text-secondary);
          transition: all var(--duration-fast) var(--ease-out);
        }

        .nav-btn:hover {
          background: var(--bg-hover);
          color: var(--text-primary);
        }

        .today-btn {
          padding: var(--space-2) var(--space-4);
          border-radius: var(--radius-md);
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--accent-primary);
          border: 1px solid var(--accent-primary);
          transition: all var(--duration-fast) var(--ease-out);
        }

        .today-btn:hover {
          background: var(--accent-light);
        }

        .week-view {
          display: grid;
          grid-template-columns: 60px repeat(7, 1fr);
          background: var(--bg-primary);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-lg);
          overflow: hidden;
        }

        .time-column {
          border-right: 1px solid var(--border-light);
        }

        .time-header {
          height: 56px;
          border-bottom: 1px solid var(--border-light);
        }

        .time-slot {
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          color: var(--text-tertiary);
          border-bottom: 1px solid var(--border-light);
        }

        .day-column {
          border-right: 1px solid var(--border-light);
        }

        .day-column:last-child {
          border-right: none;
        }

        .day-header {
          height: 56px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border-bottom: 1px solid var(--border-light);
          background: var(--bg-secondary);
        }

        .day-header.today {
          background: var(--accent-light);
        }

        .day-name {
          font-size: 0.75rem;
          font-weight: 500;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .day-number {
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .today-number {
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--accent-primary);
          color: white;
          border-radius: var(--radius-full);
        }

        .day-events {
          position: relative;
          min-height: calc(48px * 11);
          padding: var(--space-2);
        }

        .time-slot-bg {
          height: 48px;
          border-bottom: 1px solid var(--border-light);
          position: absolute;
          left: 0;
          right: 0;
        }

        .time-slot-bg:nth-child(1) { top: 0; }
        .time-slot-bg:nth-child(2) { top: 48px; }
        .time-slot-bg:nth-child(3) { top: 96px; }

        .event-card {
          position: relative;
          z-index: 10;
          padding: var(--space-2) var(--space-3);
          border-left: 3px solid;
          border-radius: var(--radius-sm);
          margin-bottom: var(--space-2);
        }

        .event-title {
          font-size: 0.8125rem;
          font-weight: 600;
          display: block;
          margin-bottom: var(--space-1);
        }

        .event-meta {
          display: flex;
          align-items: center;
          gap: var(--space-1);
          font-size: 0.6875rem;
          color: var(--text-secondary);
        }

        .events-summary {
          background: var(--bg-primary);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-lg);
          padding: var(--space-5);
        }

        .events-summary h3 {
          font-size: 0.9375rem;
          font-weight: 600;
          margin-bottom: var(--space-4);
        }

        .summary-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
        }

        .summary-item {
          display: flex;
          align-items: center;
          gap: var(--space-3);
        }

        .summary-indicator {
          width: 4px;
          height: 32px;
          border-radius: 2px;
        }

        .summary-content {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .summary-title {
          font-size: 0.875rem;
          font-weight: 500;
        }

        .summary-time {
          font-size: 0.75rem;
          color: var(--text-secondary);
        }

        @media (max-width: 1024px) {
          .week-view {
            overflow-x: auto;
          }
        }

        @media (max-width: 768px) {
          .time-column {
            display: none;
          }
          
          .week-view {
            grid-template-columns: repeat(7, minmax(80px, 1fr));
          }
        }
      `}</style>
        </>
    );
}
