/**
 * StudyPilot AI Agent Service
 * 
 * This module provides the core AI agent functionality including:
 * - Message processing
 * - Tool execution
 * - Response generation
 * - Context management
 */

import {
    SYSTEM_PROMPT,
    AGENT_TOOLS,
    MOCK_DATA,
    detectIntent,
    formatDeadlines,
    formatCourseProgress
} from './agent-config';

/**
 * AI Agent Class
 * Handles all AI-related operations
 */
export class StudyPilotAgent {
    constructor(apiKey = null) {
        this.apiKey = apiKey;
        this.conversationHistory = [];
        this.studentContext = {
            id: 'stu_001',
            name: 'Alex',
            courses: MOCK_DATA.courses,
            deadlines: MOCK_DATA.deadlines,
            wellness: MOCK_DATA.wellness
        };
    }

    /**
     * Process a user message and generate a response
     */
    async processMessage(message, history = []) {
        // Detect intent
        const intent = detectIntent(message);

        // Execute relevant tools based on intent
        const toolResults = await this.executeToolsForIntent(intent, message);

        // Generate response
        const response = await this.generateResponse(message, intent, toolResults);

        return response;
    }

    /**
     * Execute tools based on detected intent
     */
    async executeToolsForIntent(intent, message) {
        const results = {};

        switch (intent) {
            case 'deadlines':
                results.deadlines = await this.executeTool('get_upcoming_deadlines', { limit: 5 });
                break;

            case 'grades':
                results.grades = await this.executeTool('get_grade_summary', { include_trends: true });
                break;

            case 'schedule':
                results.schedule = await this.executeTool('get_course_schedule', { date_range: 'this_week' });
                break;

            case 'study':
                results.deadlines = await this.executeTool('get_upcoming_deadlines', { limit: 3 });
                results.schedule = await this.executeTool('get_course_schedule', { date_range: 'this_week' });
                break;

            case 'wellness':
                results.wellness = await this.executeTool('get_wellness_status', { include_recommendations: true });
                break;

            case 'courses':
                results.courses = MOCK_DATA.courses;
                break;

            default:
                // For general queries, provide context about deadlines and courses
                results.deadlines = await this.executeTool('get_upcoming_deadlines', { limit: 3 });
                break;
        }

        return results;
    }

    /**
     * Execute a specific tool
     */
    async executeTool(toolName, parameters) {
        // Tool execution (using mock data for now - will be replaced in Phase 4)
        switch (toolName) {
            case 'get_upcoming_deadlines':
                const limit = parameters.limit || 5;
                const courseFilter = parameters.course_code;
                let deadlines = [...MOCK_DATA.deadlines];

                if (courseFilter) {
                    deadlines = deadlines.filter(d => d.course === courseFilter);
                }

                return deadlines.slice(0, limit);

            case 'get_grade_summary':
                return MOCK_DATA.courses.map(c => ({
                    code: c.code,
                    name: c.name,
                    grade: c.grade,
                    progress: c.progress
                }));

            case 'get_course_schedule':
                return MOCK_DATA.courses.map(c => ({
                    code: c.code,
                    name: c.name,
                    nextClass: c.nextClass,
                    professor: c.professor
                }));

            case 'get_wellness_status':
                return {
                    ...MOCK_DATA.wellness,
                    recommendations: parameters.include_recommendations ? [
                        'Consider taking a 15-minute break',
                        'Your study streak is impressive! Keep it up!',
                        'You have a high workload this week. Prioritize the CS301 project.'
                    ] : []
                };

            case 'create_study_plan':
                return {
                    topic: parameters.topic,
                    sessions: [
                        { day: 'Monday', duration: 2, focus: 'Review core concepts' },
                        { day: 'Tuesday', duration: 1.5, focus: 'Practice problems' },
                        { day: 'Wednesday', duration: 2, focus: 'Deep dive on weak areas' }
                    ]
                };

            case 'schedule_study_session':
                return {
                    success: true,
                    session: {
                        title: parameters.title,
                        date: parameters.date,
                        duration: parameters.duration_hours
                    }
                };

            default:
                return null;
        }
    }

    /**
     * Generate a response based on intent and tool results
     */
    async generateResponse(message, intent, toolResults) {
        let response = '';
        let visualElements = null;
        let actions = null;

        switch (intent) {
            case 'deadlines':
                response = this.generateDeadlinesResponse(toolResults.deadlines);
                actions = [
                    { label: 'Create Study Plan', action: 'create_study_plan' },
                    { label: 'View Calendar', action: 'view_calendar' }
                ];
                break;

            case 'grades':
                response = this.generateGradesResponse(toolResults.grades);
                actions = [
                    { label: 'See Improvement Tips', action: 'get_tips' },
                    { label: 'View Details', action: 'view_grades' }
                ];
                break;

            case 'schedule':
                response = this.generateScheduleResponse(toolResults.schedule);
                actions = [
                    { label: 'Add Study Session', action: 'add_session' }
                ];
                break;

            case 'study':
                response = this.generateStudyResponse(toolResults);
                actions = [
                    { label: 'Start Study Session', action: 'start_session' },
                    { label: 'Create Plan', action: 'create_plan' }
                ];
                break;

            case 'wellness':
                response = this.generateWellnessResponse(toolResults.wellness);
                actions = [
                    { label: 'Take a Break', action: 'take_break' }
                ];
                break;

            case 'courses':
                response = this.generateCoursesResponse(toolResults.courses);
                actions = [
                    { label: 'View Course Details', action: 'view_courses' }
                ];
                break;

            default:
                response = this.generateGeneralResponse(message, toolResults);
                actions = [
                    { label: 'Show Deadlines', action: 'show_deadlines' },
                    { label: 'View Schedule', action: 'view_schedule' }
                ];
                break;
        }

        return {
            response,
            visualElements,
            actions,
            intent,
            toolsUsed: Object.keys(toolResults)
        };
    }

    // Response generators for different intents
    generateDeadlinesResponse(deadlines) {
        if (!deadlines || deadlines.length === 0) {
            return "Great news! 🎉 You don't have any upcoming deadlines. Would you like to plan ahead for future assignments?";
        }

        const highPriority = deadlines.filter(d => d.priority === 'high');
        const response = `📋 **Upcoming Deadlines**\n\n${formatDeadlines(deadlines)}`;

        if (highPriority.length > 0) {
            return response + `\n\n⚠️ **Priority Alert**: You have ${highPriority.length} high-priority deadline(s). I recommend starting with the **${highPriority[0].title}** since it's due soon and worth ${highPriority[0].weight} of your grade.`;
        }

        return response + '\n\n💡 All deadlines are manageable! Would you like me to create a study plan?';
    }

    generateGradesResponse(grades) {
        if (!grades || grades.length === 0) {
            return "I couldn't find your grade information. Would you like to connect your LMS account?";
        }

        const progressList = formatCourseProgress(grades);
        const avgProgress = Math.round(grades.reduce((sum, g) => sum + g.progress, 0) / grades.length);

        return `📊 **Grade Summary**\n\n${progressList}\n\n📈 **Overall Progress**: ${avgProgress}% of the semester completed.\n\n💡 You're doing well! MATH202 could use some extra attention - would you like study tips for Linear Algebra?`;
    }

    generateScheduleResponse(schedule) {
        if (!schedule || schedule.length === 0) {
            return "Your schedule looks clear! Would you like to add some study sessions?";
        }

        const scheduleText = schedule.map(s =>
            `📚 **${s.code}** - ${s.name}\n   👨‍🏫 ${s.professor}`
        ).join('\n\n');

        return `📅 **This Week's Schedule**\n\n${scheduleText}\n\n💡 Would you like me to find the best times for study sessions around your classes?`;
    }

    generateStudyResponse(results) {
        const { deadlines, schedule } = results;

        let response = "📖 **Let's Plan Your Study Session!**\n\n";

        if (deadlines && deadlines.length > 0) {
            const nextDeadline = deadlines[0];
            response += `Based on your upcoming deadlines, I recommend focusing on **${nextDeadline.title}** (due ${nextDeadline.dueDate}).\n\n`;
        }

        response += `**Suggested Study Plan:**\n`;
        response += `1. 📝 Review core concepts (30 min)\n`;
        response += `2. 💻 Practice problems (45 min)\n`;
        response += `3. ☕ Short break (10 min)\n`;
        response += `4. 📚 Deep work on challenging topics (45 min)\n\n`;
        response += `Ready to start? I can schedule this session for you!`;

        return response;
    }

    generateWellnessResponse(wellness) {
        const { overallScore, stress, sleep, workload, studyStreak, recommendations } = wellness;

        let response = `🧘 **Wellness Check**\n\n`;
        response += `**Balance Score**: ${overallScore}/10\n`;
        response += `• 😴 Sleep: ${sleep}\n`;
        response += `• 😰 Stress: ${stress}\n`;
        response += `• 📚 Workload: ${workload}\n`;
        response += `• 🔥 Study Streak: ${studyStreak} days!\n\n`;

        if (recommendations && recommendations.length > 0) {
            response += `**💡 Recommendations:**\n`;
            recommendations.forEach((rec, i) => {
                response += `${i + 1}. ${rec}\n`;
            });
        }

        if (stress === 'high' || workload === 'high') {
            response += `\n⚠️ I notice your workload is high. Remember to take breaks and prioritize self-care!`;
        } else {
            response += `\n✨ You're maintaining a good balance! Keep up the great work!`;
        }

        return response;
    }

    generateCoursesResponse(courses) {
        const courseList = courses.map(c =>
            `📚 **${c.code}** - ${c.name}\n   👨‍🏫 ${c.professor} | Progress: ${c.progress}% | Grade: ${c.grade}`
        ).join('\n\n');

        return `📖 **Your Courses**\n\n${courseList}\n\n💡 Would you like to see details for a specific course or check your assignments?`;
    }

    generateGeneralResponse(message, results) {
        // Check for greetings
        const greetings = ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening'];
        if (greetings.some(g => message.toLowerCase().includes(g))) {
            return `Hey there! 👋 I'm here to help with your academics. Here's a quick overview:\n\n📌 You have ${results.deadlines?.length || 0} upcoming deadlines\n📚 ${MOCK_DATA.courses.length} active courses\n🔥 ${MOCK_DATA.wellness.studyStreak}-day study streak!\n\nWhat would you like to work on today?`;
        }

        // Default helpful response
        return `I'm here to help! 🎓 Here's what I can assist you with:\n\n• 📋 **Deadlines** - Track and manage assignments\n• 📊 **Grades** - View your academic progress\n• 📅 **Schedule** - Plan your study sessions\n• 📖 **Study Help** - Get personalized study plans\n• 🧘 **Wellness** - Check your work-life balance\n\nJust ask me anything about your academics!`;
    }
}

// Export singleton instance
export const agent = new StudyPilotAgent();
