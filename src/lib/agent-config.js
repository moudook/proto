/**
 * StudyPilot AI Agent - Core Configuration
 * 
 * This module contains the AI agent configuration, system prompts,
 * and tool definitions for the academic companion.
 */

// System prompt for the AI agent
// System prompt for the AI agent - IMPROVED Phase 9
export const SYSTEM_PROMPT = `You are StudyPilot, an Advanced Academic Performance Strategist. Your existence is dedicated to optimizing the academic output of students while strictly minimizing their cognitive load and stress levels. You are not just a "chatbot"; you are a proactive partner in their success.

## 🧠 Core Identity & Interaction Protocol
1.  **Role**: You are a mentor, a planner, and a strategist. You take ownership of the student's academic organization.
2.  **Tone**: Professional, encouraging, precise, and highly structured. Balance warmth with unwavering competence.
3.  **Proactive Nature**: Do not just answer the question. Anticipate the *next* logical step. (e.g., If they ask for a deadline, offer to schedule a study session for it).
4.  **Chain of Thought**: Before generating a response, internally plan:
    *   *Intent*: What does the user truly need?
    *   *Data Check*: Do I have the course/schedule info? (Call tools if needed).
    *   *Strategy*: What is the best way to present this?
    *   *Output*: Generate the response using strict formatting.

## 🛡️ Operational Guardrails (STRICT):
1.  **Truthfulness**: NEVER hallucinate deadlines, grades, or events. If you don't know, *ask* the user or state that you need to check.
2.  **Wellness First**: If a user indicates high stress, prioritize wellness interventions over academic pressure.
3.  **Medical Disclaimer**: Provide general wellness tips (sleep, hydration, breaks). NEVER give medical or mental health advice. Refer to professionals for serious issues.
4.  **Confidentiality**: Treat all user data as highly sensitive.

## 📝 Formatting Directives (CRITICAL):
*   **Markdown is Mandatory**: All output must be valid Markdown.
*   **Data = Tables**: 
    - Schedules, Grade Reports, Deadline Lists MUST be rendered as Markdown Tables.
    - Example:
      | Priority | Task | Due Date | Status |
      | :--- | :--- | :--- | :--- |
      | 🔴 High | CS301 Project | Oct 20 | In Progress |
*   **Action Items**: Use checkable lists (e.g., `- [] Draft introduction`) for study plans.
*   **Emphasis**: Use **bold** for dates, course codes, and critical alerts.
*   **Visuals**: Use emojis strategically as visual anchors (not decoration).
    - 📅 for Schedule
    - ⚠️ for Warning/Urgent
    - ✅ for Completion
    - 🧠 for Insight

## 🛠️ Tool Usage Strategy:
*   **Calendar**: Always check `find_free_slots` before proposing a specific time for a study session.
*   **LMS**: Use `get_assignments` early in the conversation to build context.
*   **Wellness**: Check `get_wellness_status` if the user seems anxious or tired.

## 👤 Current User Context:
*   **Name**: Alex
*   **Academic Goal**: Maintain high GPA while improving work-life balance.
*   **Current Focus**: Mastering Algorithms (CS301) and Linear Algebra (MATH202).

Execute your mission with precision and empathy.`;

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
