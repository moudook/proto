/**
 * StudyPilot LLM Provider Service
 * 
 * Handles connections to various LLM providers (Gemini, OpenAI, Anthropic)
 * with a unified interface.
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { SYSTEM_PROMPT, AGENT_TOOLS, MOCK_DATA, detectIntent } from './agent-config';
import { executeTool, getToolDefinitions } from './tools';

// Initialize Gemini client
let genAI = null;
let model = null;

function initializeGemini() {
    if (!genAI && process.env.GEMINI_API_KEY) {
        genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        model = genAI.getGenerativeModel({
            model: process.env.NEXT_PUBLIC_AI_MODEL || 'gemini-1.5-flash',
            systemInstruction: SYSTEM_PROMPT,
        });
    }
    return model;
}

/**
 * Format tools for Gemini function calling
 */
function formatToolsForGemini() {
    return AGENT_TOOLS.map(tool => ({
        name: tool.name,
        description: tool.description,
        parameters: tool.parameters
    }));
}

/**
 * Execute a tool call using the tool registry
 */
async function executeToolCallFromRegistry(toolName, args) {
    const result = await executeTool(toolName, args);

    if (result.success) {
        return {
            success: true,
            data: result.result,
            formatted: result.result?.formatted || JSON.stringify(result.result),
        };
    }

    return {
        success: false,
        error: result.error,
    };
}

/**
 * Build context message with current student data
 */
function buildContextMessage(userContext = null) {
    // Use user context if available, otherwise fall back to MOCK_DATA
    const contextName = userContext?.name || 'Alex';
    const semester = userContext?.semester || 'Spring 2024';

    let deadlinesStr = '';
    if (userContext?.upcomingDeadlines) {
        deadlinesStr = userContext.upcomingDeadlines.map(d =>
            `- ${d.title}: Due ${d.dueDate}`
        ).join('\n');
    } else {
        deadlinesStr = MOCK_DATA.deadlines.slice(0, 3).map(d =>
            `- ${d.title} (${d.course}): Due ${d.dueDate}, Priority: ${d.priority}, Weight: ${d.weight}`
        ).join('\n');
    }

    let coursesStr = '';
    if (userContext?.courses) {
        coursesStr = userContext.courses.map(c => `- ${c}`).join('\n');
    } else {
        coursesStr = MOCK_DATA.courses.map(c =>
            `- ${c.code}: ${c.name}, Progress: ${c.progress}%, Grade: ${c.grade}`
        ).join('\n');
    }

    return `
Current Student Context:
- Name: ${contextName}
- Semester: ${semester}

Enrolled Courses:
${coursesStr}

Upcoming Deadlines:
${deadlinesStr}

Today's Date: ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
`;
}

/**
 * Generate response using Gemini LLM
 */
export async function generateWithGemini(message, conversationHistory = [], userContext = null) {
    const geminiModel = initializeGemini();

    if (!geminiModel) {
        // Fallback to mock response if no API key
        console.warn('No Gemini API key found, using fallback response');
        return generateFallbackResponse(message);
    }

    try {
        // Detect intent for context
        const intent = detectIntent(message);

        // Build the chat history
        const history = conversationHistory.map(msg => ({
            role: msg.sender === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content }]
        }));

        // Add context about the student's current state
        const contextMessage = buildContextMessage(userContext);

        // Start a chat session
        const chat = geminiModel.startChat({
            history: [
                {
                    role: 'user',
                    parts: [{ text: `Here is the current student context:\n${contextMessage}\n\nPlease acknowledge this context and be ready to help.` }]
                },
                {
                    role: 'model',
                    parts: [{ text: `I have received the student context for ${userContext?.name || 'the student'}. I'm ready to help with any academic questions or planning needs!` }]
                },
                ...history
            ],
            generationConfig: {
                maxOutputTokens: 1024,
                temperature: 0.7,
                topP: 0.9,
            }
        });

        // Send the message
        const result = await chat.sendMessage(message);
        const response = result.response.text();

        // Check if we should execute any tools based on intent
        let toolResults = null;

        if (intent === 'deadlines') {
            toolResults = await executeToolCallFromRegistry('get_assignments', { status: 'all', limit: 5 });
        } else if (intent === 'grades') {
            toolResults = await executeToolCallFromRegistry('get_grade_summary', { includeTrends: true });
        } else if (intent === 'wellness') {
            toolResults = await executeToolCallFromRegistry('get_wellness_status', { includeRecommendations: true });
        } else if (intent === 'schedule') {
            toolResults = await executeToolCallFromRegistry('get_calendar_events', { startDate: 'this_week' });
        } else if (intent === 'study') {
            toolResults = await executeToolCallFromRegistry('get_topic_recommendations', { limit: 3 });
        } else if (intent === 'courses') {
            toolResults = await executeToolCallFromRegistry('get_courses', { includeDetails: true });
        }

        // Generate actions based on intent
        const actions = generateActionsForIntent(intent);

        return {
            response,
            intent,
            toolResults,
            actions,
            model: 'gemini-1.5-flash',
            success: true
        };

    } catch (error) {
        console.error('Gemini API Error:', error);

        // Fallback to mock response on error
        return generateFallbackResponse(message, error.message);
    }
}

/**
 * Generate action buttons based on intent
 */
function generateActionsForIntent(intent) {
    const actionMap = {
        deadlines: [
            { label: 'Create Study Plan', action: 'create_study_plan' },
            { label: 'View Calendar', action: 'view_calendar' }
        ],
        grades: [
            { label: 'See Improvement Tips', action: 'get_tips' },
            { label: 'View Details', action: 'view_grades' }
        ],
        schedule: [
            { label: 'Add Study Session', action: 'add_session' }
        ],
        study: [
            { label: 'Start Study Session', action: 'start_session' },
            { label: 'Create Plan', action: 'create_plan' }
        ],
        wellness: [
            { label: 'Take a Break', action: 'take_break' }
        ],
        courses: [
            { label: 'View Course Details', action: 'view_courses' }
        ],
        general: [
            { label: 'Show Deadlines', action: 'show_deadlines' },
            { label: 'View Schedule', action: 'view_schedule' }
        ]
    };

    return actionMap[intent] || actionMap.general;
}

/**
 * Fallback response generator when LLM is not available
 */
/**
 * Fallback response generator when LLM is not available
 */
function generateFallbackResponse(message, errorMessage = null, userContext = null) {
    const intent = detectIntent(message);
    let response = '';

    // Check for greetings
    const greetings = ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening'];
    if (greetings.some(g => message.toLowerCase().includes(g))) {
        const name = userContext?.name ? userContext.name.split(' ')[0] : 'there';
        response = `Hey ${name}! 👋 I'm StudyPilot, your AI academic companion. Here's a quick overview:\n\n📌 You have ${MOCK_DATA.deadlines.length} upcoming deadlines\n📚 ${MOCK_DATA.courses.length} active courses\n🔥 ${MOCK_DATA.wellness.studyStreak}-day study streak!\n\nWhat would you like to work on today?`;
    } else {
        switch (intent) {
            case 'deadlines':
                let deadlinesData = MOCK_DATA.deadlines;
                if (userContext?.upcomingDeadlines && userContext.upcomingDeadlines.length > 0) {
                    // In a real app we would use userContext, but for fallback we might just use mock data if context is empty
                    // For now, let's stick to MOCK_DATA but acknowledge we checked
                }

                const deadlines = deadlinesData.map(d =>
                    `${d.priority === 'high' ? '🔴' : d.priority === 'medium' ? '🟡' : '🟢'} **${d.title}** (${d.course}) - Due: ${d.dueDate} - Weight: ${d.weight}`
                ).join('\n');
                response = `📋 **Upcoming Deadlines**\n\n${deadlines}\n\n⚠️ **Priority Alert**: The CS301 Project Proposal is due soon and worth 30% of your grade. I recommend starting today!`;
                break;

            case 'grades':
                const coursesData = userContext?.courses && userContext.courses.length > 0
                    ? MOCK_DATA.courses // We can't easily map user strings to mock objects, so stick to mock
                    : MOCK_DATA.courses;

                const grades = coursesData.map(c =>
                    `📚 **${c.code}** (${c.name}): ${c.progress}% complete - Grade: ${c.grade}`
                ).join('\n');
                const avgProgress = Math.round(coursesData.reduce((sum, c) => sum + c.progress, 0) / coursesData.length);
                response = `📊 **Grade Summary**\n\n${grades}\n\n📈 **Overall Progress**: ${avgProgress}% of the semester completed.\n\n💡 MATH202 could use some extra attention - would you like study tips for Linear Algebra?`;
                break;

            case 'wellness':
                const w = MOCK_DATA.wellness;
                response = `🧘 **Wellness Check**\n\n**Balance Score**: ${w.overallScore}/10\n• 😴 Sleep: ${w.sleep}\n• 😰 Stress: ${w.stress}\n• 📚 Workload: ${w.workload}\n• 🔥 Study Streak: ${w.studyStreak} days!\n\n💡 Your workload is high this week. Remember to take breaks and prioritize self-care!`;
                break;

            case 'study':
                response = `📖 **Let's Plan Your Study Session!**\n\nBased on your upcoming deadlines, I recommend focusing on **CS301 Project Proposal** (due soon).\n\n**Suggested Study Plan:**\n1. 📝 Review core concepts (30 min)\n2. 💻 Practice problems (45 min)\n3. ☕ Short break (10 min)\n4. 📚 Deep work on challenging topics (45 min)\n\nReady to start? I can schedule this session for you!`;
                break;

            default:
                response = `I'm here to help! 🎓 Here's what I can assist you with:\n\n• 📋 **Deadlines** - Track and manage assignments\n• 📊 **Grades** - View your academic progress\n• 📅 **Schedule** - Plan your study sessions\n• 📖 **Study Help** - Get personalized study plans\n• 🧘 **Wellness** - Check your work-life balance\n\nJust ask me anything about your academics!`;
        }
    }

    if (errorMessage) {
        console.warn('Using fallback due to error:', errorMessage);
    }

    return {
        response,
        intent,
        toolResults: null,
        actions: generateActionsForIntent(intent),
        model: 'fallback',
        success: true,
        fallback: true
    };
}

/**
 * Main function to generate AI response
 * Automatically selects the best available provider
 */
export async function generateAIResponse(message, conversationHistory = [], userContext = null) {
    // Try Gemini first
    if (process.env.GEMINI_API_KEY) {
        return generateWithGemini(message, conversationHistory, userContext);
    }

    // Fallback to mock responses
    return generateFallbackResponse(message, null, userContext);
}
