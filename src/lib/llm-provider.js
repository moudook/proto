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
function buildContextMessage() {
    const deadlines = MOCK_DATA.deadlines.slice(0, 3).map(d =>
        `- ${d.title} (${d.course}): Due ${d.dueDate}, Priority: ${d.priority}, Weight: ${d.weight}`
    ).join('\n');

    const courses = MOCK_DATA.courses.map(c =>
        `- ${c.code}: ${c.name}, Progress: ${c.progress}%, Grade: ${c.grade}`
    ).join('\n');

    const wellness = MOCK_DATA.wellness;

    return `
Current Student Context:
- Name: Alex
- Semester: Spring 2024

Enrolled Courses:
${courses}

Upcoming Deadlines:
${deadlines}

Wellness Status:
- Balance Score: ${wellness.overallScore}/10
- Stress Level: ${wellness.stress}
- Sleep Quality: ${wellness.sleep}
- Workload: ${wellness.workload}
- Study Streak: ${wellness.studyStreak} days

Today's Date: ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
`;
}

/**
 * Generate response using Gemini LLM
 */
export async function generateWithGemini(message, conversationHistory = []) {
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
        const contextMessage = buildContextMessage();

        // Start a chat session
        const chat = geminiModel.startChat({
            history: [
                {
                    role: 'user',
                    parts: [{ text: `Here is the current student context:\n${contextMessage}\n\nPlease acknowledge this context and be ready to help.` }]
                },
                {
                    role: 'model',
                    parts: [{ text: 'I have received the student context. I can see Alex is enrolled in CS301, MATH202, and ENG101 for Spring 2024. I notice there are some upcoming deadlines, with the CS301 Project Proposal being high priority. I\'m ready to help with any academic questions or planning needs!' }]
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
function generateFallbackResponse(message, errorMessage = null) {
    const intent = detectIntent(message);
    let response = '';

    // Check for greetings
    const greetings = ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening'];
    if (greetings.some(g => message.toLowerCase().includes(g))) {
        response = `Hey there! 👋 I'm StudyPilot, your AI academic companion. Here's a quick overview:\n\n📌 You have ${MOCK_DATA.deadlines.length} upcoming deadlines\n📚 ${MOCK_DATA.courses.length} active courses\n🔥 ${MOCK_DATA.wellness.studyStreak}-day study streak!\n\nWhat would you like to work on today?`;
    } else {
        switch (intent) {
            case 'deadlines':
                const deadlines = MOCK_DATA.deadlines.map(d =>
                    `${d.priority === 'high' ? '🔴' : d.priority === 'medium' ? '🟡' : '🟢'} **${d.title}** (${d.course}) - Due: ${d.dueDate} - Weight: ${d.weight}`
                ).join('\n');
                response = `📋 **Upcoming Deadlines**\n\n${deadlines}\n\n⚠️ **Priority Alert**: The CS301 Project Proposal is due soon and worth 30% of your grade. I recommend starting today!`;
                break;

            case 'grades':
                const grades = MOCK_DATA.courses.map(c =>
                    `📚 **${c.code}** (${c.name}): ${c.progress}% complete - Grade: ${c.grade}`
                ).join('\n');
                const avgProgress = Math.round(MOCK_DATA.courses.reduce((sum, c) => sum + c.progress, 0) / MOCK_DATA.courses.length);
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
export async function generateAIResponse(message, conversationHistory = []) {
    // Try Gemini first
    if (process.env.GEMINI_API_KEY) {
        return generateWithGemini(message, conversationHistory);
    }

    // Fallback to mock responses
    return generateFallbackResponse(message);
}
