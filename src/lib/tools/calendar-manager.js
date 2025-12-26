/**
 * Calendar Manager Tools
 * 
 * Handles calendar events, study sessions, and scheduling.
 */

// Simulated Calendar Database
const calendarDatabase = {
    events: [
        {
            id: 'evt_001',
            title: 'CS301 Lecture',
            type: 'class',
            startTime: '2024-03-18T10:00:00',
            endTime: '2024-03-18T11:30:00',
            location: 'Science Building Room 205',
            recurring: true,
            recurrencePattern: 'weekly',
            recurrenceDays: ['monday', 'wednesday'],
            courseId: 'cs301',
            color: '#6366F1',
        },
        {
            id: 'evt_002',
            title: 'MATH202 Lecture',
            type: 'class',
            startTime: '2024-03-18T14:00:00',
            endTime: '2024-03-18T15:30:00',
            location: 'Math Building Room 101',
            recurring: true,
            recurrencePattern: 'weekly',
            recurrenceDays: ['tuesday', 'thursday'],
            courseId: 'math202',
            color: '#8B5CF6',
        },
        {
            id: 'evt_003',
            title: 'Study Session: Algorithms',
            type: 'study',
            startTime: '2024-03-19T16:00:00',
            endTime: '2024-03-19T18:00:00',
            location: 'Library Study Room 3',
            recurring: false,
            courseId: 'cs301',
            color: '#06B6D4',
            notes: 'Focus on graph algorithms',
        },
        {
            id: 'evt_004',
            title: 'Office Hours: Dr. Smith',
            type: 'office_hours',
            startTime: '2024-03-20T14:00:00',
            endTime: '2024-03-20T16:00:00',
            location: 'Science Building 401',
            recurring: true,
            recurrencePattern: 'weekly',
            recurrenceDays: ['monday', 'wednesday'],
            courseId: 'cs301',
            color: '#10B981',
        },
        {
            id: 'evt_005',
            title: 'Project Deadline: CS301 Proposal',
            type: 'deadline',
            startTime: '2024-03-20T23:59:00',
            endTime: '2024-03-20T23:59:00',
            allDay: false,
            courseId: 'cs301',
            color: '#EF4444',
        },
    ],

    // Available time slots for scheduling
    preferences: {
        preferredStudyTimes: ['morning', 'afternoon'],
        avoidTimes: ['22:00-06:00'],
        maxDailyStudyHours: 6,
        breakBetweenSessions: 15, // minutes
    },
};

// Tool Implementations
export const calendarTools = {
    // Get calendar events
    get_calendar_events: {
        name: 'get_calendar_events',
        description: 'Retrieves calendar events for a date range',
        category: 'calendar',
        parameters: {
            type: 'object',
            properties: {
                startDate: {
                    type: 'string',
                    description: 'Start date (ISO format or "today", "tomorrow", "this_week")',
                },
                endDate: {
                    type: 'string',
                    description: 'End date (ISO format)',
                },
                type: {
                    type: 'string',
                    enum: ['all', 'class', 'study', 'office_hours', 'deadline', 'personal'],
                    description: 'Filter by event type',
                },
                courseCode: {
                    type: 'string',
                    description: 'Filter by course code',
                },
            },
        },
        execute: async (params) => {
            let events = [...calendarDatabase.events];

            // Parse date range
            const now = new Date();
            let startDate = now;
            let endDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // Default: next 7 days

            if (params.startDate === 'today') {
                startDate = new Date(now.toDateString());
                endDate = new Date(startDate.getTime() + 24 * 60 * 60 * 1000);
            } else if (params.startDate === 'tomorrow') {
                startDate = new Date(now.getTime() + 24 * 60 * 60 * 1000);
                startDate = new Date(startDate.toDateString());
                endDate = new Date(startDate.getTime() + 24 * 60 * 60 * 1000);
            } else if (params.startDate === 'this_week') {
                const dayOfWeek = now.getDay();
                startDate = new Date(now.getTime() - dayOfWeek * 24 * 60 * 60 * 1000);
                endDate = new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000);
            } else if (params.startDate) {
                startDate = new Date(params.startDate);
            }

            if (params.endDate) {
                endDate = new Date(params.endDate);
            }

            // Filter by type
            if (params.type && params.type !== 'all') {
                events = events.filter(e => e.type === params.type);
            }

            // Filter by course
            if (params.courseCode) {
                const courseId = params.courseCode.toLowerCase();
                events = events.filter(e => e.courseId === courseId);
            }

            // Sort by start time
            events.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));

            return {
                count: events.length,
                dateRange: { start: startDate.toISOString(), end: endDate.toISOString() },
                events,
                formatted: events.map(e => {
                    const start = new Date(e.startTime);
                    const typeEmoji = {
                        class: '📚',
                        study: '📖',
                        office_hours: '👨‍🏫',
                        deadline: '⏰',
                        personal: '📌',
                    }[e.type] || '📅';

                    return `${typeEmoji} **${e.title}**
   ${start.toLocaleDateString()} ${start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
   📍 ${e.location || 'No location'}`;
                }).join('\n\n'),
            };
        },
    },

    // Create a new event
    create_event: {
        name: 'create_event',
        description: 'Creates a new calendar event or study session',
        category: 'calendar',
        parameters: {
            type: 'object',
            properties: {
                title: {
                    type: 'string',
                    description: 'Event title',
                },
                type: {
                    type: 'string',
                    enum: ['study', 'deadline', 'personal', 'meeting'],
                    description: 'Type of event',
                },
                startTime: {
                    type: 'string',
                    description: 'Start time (ISO format)',
                },
                duration: {
                    type: 'number',
                    description: 'Duration in minutes',
                },
                location: {
                    type: 'string',
                    description: 'Event location',
                },
                notes: {
                    type: 'string',
                    description: 'Additional notes',
                },
                courseCode: {
                    type: 'string',
                    description: 'Associated course code',
                },
            },
            required: ['title', 'type', 'startTime'],
        },
        execute: async (params) => {
            const startTime = new Date(params.startTime);
            const duration = params.duration || 60;
            const endTime = new Date(startTime.getTime() + duration * 60 * 1000);

            const newEvent = {
                id: `evt_${Date.now()}`,
                title: params.title,
                type: params.type,
                startTime: startTime.toISOString(),
                endTime: endTime.toISOString(),
                location: params.location || null,
                notes: params.notes || null,
                courseId: params.courseCode?.toLowerCase() || null,
                color: params.type === 'study' ? '#06B6D4' :
                    params.type === 'deadline' ? '#EF4444' : '#8B5CF6',
                createdAt: new Date().toISOString(),
            };

            // Add to database
            calendarDatabase.events.push(newEvent);

            return {
                success: true,
                event: newEvent,
                formatted: `✅ **Event Created!**

📅 **${params.title}**
⏰ ${startTime.toLocaleDateString()} at ${startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
⏱️ Duration: ${duration} minutes
📍 ${params.location || 'No location set'}
${params.notes ? `📝 Notes: ${params.notes}` : ''}`,
            };
        },
    },

    // Find free time slots
    find_free_slots: {
        name: 'find_free_slots',
        description: 'Finds available time slots for scheduling study sessions',
        category: 'calendar',
        parameters: {
            type: 'object',
            properties: {
                date: {
                    type: 'string',
                    description: 'Date to find slots for',
                },
                duration: {
                    type: 'number',
                    description: 'Required duration in minutes',
                },
                preferredTime: {
                    type: 'string',
                    enum: ['morning', 'afternoon', 'evening', 'any'],
                    description: 'Preferred time of day',
                },
            },
        },
        execute: async (params) => {
            const date = params.date ? new Date(params.date) : new Date();
            const duration = params.duration || 60;

            // Define available hours based on preference
            let startHour = 8;
            let endHour = 22;

            if (params.preferredTime === 'morning') {
                startHour = 8; endHour = 12;
            } else if (params.preferredTime === 'afternoon') {
                startHour = 12; endHour = 17;
            } else if (params.preferredTime === 'evening') {
                startHour = 17; endHour = 22;
            }

            // Get events for the day
            const dayStart = new Date(date.toDateString());
            const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);

            const dayEvents = calendarDatabase.events.filter(e => {
                const eventStart = new Date(e.startTime);
                return eventStart >= dayStart && eventStart < dayEnd;
            });

            // Find free slots
            const freeSlots = [];
            for (let hour = startHour; hour < endHour; hour++) {
                const slotStart = new Date(dayStart);
                slotStart.setHours(hour, 0, 0, 0);

                const slotEnd = new Date(slotStart.getTime() + duration * 60 * 1000);

                // Check if slot conflicts with any event
                const hasConflict = dayEvents.some(e => {
                    const eventStart = new Date(e.startTime);
                    const eventEnd = new Date(e.endTime);
                    return (slotStart < eventEnd && slotEnd > eventStart);
                });

                if (!hasConflict && slotEnd.getHours() <= endHour) {
                    freeSlots.push({
                        start: slotStart.toISOString(),
                        end: slotEnd.toISOString(),
                        displayTime: `${slotStart.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${slotEnd.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
                    });
                }
            }

            return {
                date: date.toDateString(),
                requestedDuration: duration,
                availableSlots: freeSlots,
                formatted: freeSlots.length > 0
                    ? `📅 **Available Slots for ${date.toLocaleDateString()}** (${duration} min each)\n\n` +
                    freeSlots.map((s, i) => `${i + 1}. ⏰ ${s.displayTime}`).join('\n')
                    : `❌ No available ${duration}-minute slots found for ${date.toLocaleDateString()}`,
            };
        },
    },

    // Smart schedule suggestion
    suggest_schedule: {
        name: 'suggest_schedule',
        description: 'Suggests optimal study schedule based on deadlines and preferences',
        category: 'calendar',
        parameters: {
            type: 'object',
            properties: {
                daysAhead: {
                    type: 'number',
                    description: 'Number of days to plan ahead',
                },
                focusCourse: {
                    type: 'string',
                    description: 'Course to prioritize',
                },
            },
        },
        execute: async (params) => {
            const daysAhead = params.daysAhead || 7;
            const suggestions = [];

            // Generate smart suggestions based on deadlines
            const upcomingDeadlines = calendarDatabase.events
                .filter(e => e.type === 'deadline')
                .sort((a, b) => new Date(a.startTime) - new Date(b.startTime));

            for (let i = 0; i < Math.min(3, upcomingDeadlines.length); i++) {
                const deadline = upcomingDeadlines[i];
                const dueDate = new Date(deadline.startTime);
                const daysUntil = Math.ceil((dueDate - new Date()) / (1000 * 60 * 60 * 24));

                suggestions.push({
                    type: 'study_session',
                    title: `Study for: ${deadline.title}`,
                    reason: `Due in ${daysUntil} days`,
                    suggestedDuration: daysUntil <= 2 ? 120 : 60,
                    priority: daysUntil <= 2 ? 'high' : 'medium',
                });
            }

            return {
                suggestions,
                formatted: `📋 **Smart Schedule Suggestions**\n\n` +
                    suggestions.map((s, i) =>
                        `${i + 1}. ${s.priority === 'high' ? '🔴' : '🟡'} **${s.title}**
   ⏱️ Suggested: ${s.suggestedDuration} minutes
   📝 Reason: ${s.reason}`
                    ).join('\n\n'),
            };
        },
    },
};
