/**
 * StudyPilot AI Agent - Core Configuration
 * 
 * This module contains the AI agent configuration, system prompts,
 * and tool definitions for the academic companion.
 */

// System prompt for the AI agent
export const SYSTEM_PROMPT = `You are StudyPilot, an intelligent AI academic companion designed to help students succeed in their studies. You are friendly, supportive, and proactive in helping students manage their academic life.

## Your Capabilities:
1. **Course Management**: Help students track courses, assignments, and deadlines
2. **Study Planning**: Create personalized study schedules and plans
3. **Research Assistance**: Help find and summarize academic resources
4. **Wellness Support**: Monitor stress levels and suggest healthy study habits
5. **Progress Tracking**: Analyze grades and suggest improvement strategies

## Your Personality:
- Supportive and encouraging, like a helpful study buddy.
- Proactive - anticipate student needs before they ask.
- Clear and concise in explanations.
- Use emojis naturally to make responses friendly (📚, ✅, 💡, 📅, etc.), but don't overdo it.
- Always consider the student's wellbeing alongside academics.

## Formatting Guidelines (CRITICAL):
1. **Use Markdown**: Always use Markdown for formatting.
2. **Tables for Data**: When presenting schedules, grades, or list of assignments, ALLWAYS use Markdown tables for clarity.
   Example:
   | Course | Assignment | Due Date | Priority |
   |--------|------------|----------|----------|
   | CS101  | Lab 1      | Oct 20   | High     |
3. **Lists**: Use bullet points for steps or tips.
4. **Bold Key Info**: Bold dates, names, and important numbers.

## Response Guidelines:
1. Keep responses focused and actionable.
2. Always offer next steps or follow-up options.
3. If asked about deadlines, be specific about dates and priorities.
4. For complex tasks, break them down into manageable steps.

## Current Student Context:
- Name: Alex
- Semester: Spring 2024
- Goal: Maintain good grades while managing stress.

Remember: Your goal is to reduce academic stress while improving student outcomes. Always be helpful, never judgmental.`;

// Tool definitions for the AI agent
export const AGENT_TOOLS = [
    {
        name: "get_course_schedule",
        description: "Retrieves the student's course schedule for a specific date range",
        parameters: {
            type: "object",
            properties: {
                course_code: {
                    type: "string",
                    description: "Optional course code to filter (e.g., CS301)"
                },
                date_range: {
                    type: "string",
                    enum: ["today", "this_week", "next_week", "this_month"],
                    description: "Time period for the schedule"
                }
            },
            required: ["date_range"]
        }
    },
    {
        name: "get_upcoming_deadlines",
        description: "Retrieves upcoming assignment deadlines sorted by due date",
        parameters: {
            type: "object",
            properties: {
                limit: {
                    type: "number",
                    description: "Maximum number of deadlines to return"
                },
                course_code: {
                    type: "string",
                    description: "Optional course code to filter"
                }
            }
        }
    },
    {
        name: "get_grade_summary",
        description: "Retrieves the student's grade summary across courses",
        parameters: {
            type: "object",
            properties: {
                course_code: {
                    type: "string",
                    description: "Optional course code for specific course grades"
                },
                include_trends: {
                    type: "boolean",
                    description: "Whether to include grade trend analysis"
                }
            }
        }
    },
    {
        name: "create_study_plan",
        description: "Creates a personalized study plan for an upcoming exam or assignment",
        parameters: {
            type: "object",
            properties: {
                topic: {
                    type: "string",
                    description: "The topic or assignment to study for"
                },
                available_hours: {
                    type: "number",
                    description: "Total hours available for studying"
                },
                deadline: {
                    type: "string",
                    description: "When the exam or assignment is due"
                }
            },
            required: ["topic"]
        }
    },
    {
        name: "schedule_study_session",
        description: "Schedules a study session in the student's calendar",
        parameters: {
            type: "object",
            properties: {
                title: {
                    type: "string",
                    description: "Title of the study session"
                },
                date: {
                    type: "string",
                    description: "Date for the session (ISO format)"
                },
                duration_hours: {
                    type: "number",
                    description: "Duration in hours"
                },
                course_code: {
                    type: "string",
                    description: "Related course code"
                }
            },
            required: ["title", "date", "duration_hours"]
        }
    },
    {
        name: "get_wellness_status",
        description: "Retrieves the student's current wellness metrics",
        parameters: {
            type: "object",
            properties: {
                include_recommendations: {
                    type: "boolean",
                    description: "Whether to include wellness recommendations"
                }
            }
        }
    }
];

// Mock data for tools (will be replaced with real data in Phase 4)
export const MOCK_DATA = {
    courses: [
        {
            id: 'cs301',
            code: 'CS301',
            name: 'Algorithms',
            professor: 'Dr. Smith',
            progress: 68,
            grade: 'B+',
            nextClass: '2024-03-18T10:00:00'
        },
        {
            id: 'math202',
            code: 'MATH202',
            name: 'Linear Algebra',
            professor: 'Dr. Johnson',
            progress: 45,
            grade: 'B',
            nextClass: '2024-03-19T14:00:00'
        },
        {
            id: 'eng101',
            code: 'ENG101',
            name: 'Academic Writing',
            professor: 'Prof. Williams',
            progress: 82,
            grade: 'A-',
            nextClass: '2024-03-20T09:00:00'
        }
    ],
    deadlines: [
        {
            id: 1,
            title: 'CS301 Project Proposal',
            course: 'CS301',
            dueDate: '2024-03-20',
            priority: 'high',
            weight: '30%',
            status: 'in_progress'
        },
        {
            id: 2,
            title: 'MATH202 Problem Set 5',
            course: 'MATH202',
            dueDate: '2024-03-22',
            priority: 'medium',
            weight: '5%',
            status: 'not_started'
        },
        {
            id: 3,
            title: 'ENG101 Essay Draft',
            course: 'ENG101',
            dueDate: '2024-03-25',
            priority: 'low',
            weight: '15%',
            status: 'not_started'
        }
    ],
    wellness: {
        overallScore: 7.2,
        stress: 'moderate',
        sleep: 'good',
        workload: 'high',
        lastBreak: '2 hours ago',
        studyStreak: 5
    }
};

// Intent detection patterns
export const INTENT_PATTERNS = {
    deadlines: ['due', 'deadline', 'assignment', 'homework', 'submit', 'upcoming'],
    grades: ['grade', 'score', 'performance', 'gpa', 'marks', 'progress'],
    schedule: ['schedule', 'calendar', 'class', 'lecture', 'when', 'time'],
    study: ['study', 'learn', 'review', 'prepare', 'exam', 'test', 'quiz'],
    wellness: ['tired', 'stressed', 'break', 'rest', 'overwhelmed', 'help'],
    courses: ['course', 'class', 'subject', 'professor', 'syllabus']
};

// Detect user intent from message
export function detectIntent(message) {
    const lowerMessage = message.toLowerCase();

    for (const [intent, patterns] of Object.entries(INTENT_PATTERNS)) {
        if (patterns.some(pattern => lowerMessage.includes(pattern))) {
            return intent;
        }
    }

    return 'general';
}

// Format deadline for display
export function formatDeadlines(deadlines) {
    return deadlines.map(d => {
        const priorityEmoji = d.priority === 'high' ? '🔴' : d.priority === 'medium' ? '🟡' : '🟢';
        return `${priorityEmoji} **${d.title}** (${d.course}) - Due: ${d.dueDate} - Weight: ${d.weight}`;
    }).join('\n');
}

// Format course progress for display
export function formatCourseProgress(courses) {
    return courses.map(c => {
        return `📚 **${c.code}** (${c.name}): ${c.progress}% complete - Current Grade: ${c.grade}`;
    }).join('\n');
}
