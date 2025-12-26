/**
 * StudyPilot Chat API Route
 * 
 * POST /api/chat
 * 
 * Handles chat messages and returns AI agent responses.
 * Connects to real LLM (Gemini) when API key is available,
 * falls back to intelligent mock responses otherwise.
 */

import { NextResponse } from 'next/server';
import { generateAIResponse } from '@/lib/llm-provider';

export async function POST(request) {
    try {
        const body = await request.json();
        const { message, conversationHistory = [], userContext = null } = body;

        if (!message || typeof message !== 'string') {
            return NextResponse.json(
                { error: 'Message is required' },
                { status: 400 }
            );
        }

        // Generate response using LLM provider (Gemini or fallback)
        const result = await generateAIResponse(message, conversationHistory, userContext);

        return NextResponse.json({
            response: result.response,
            visualElements: result.visualElements || null,
            actions: result.actions || [],
            metadata: {
                intent: result.intent,
                model: result.model,
                toolsUsed: result.toolResults ? [result.toolResults] : [],
                timestamp: new Date().toISOString(),
                fallback: result.fallback || false
            }
        });

    } catch (error) {
        console.error('Chat API Error:', error);

        return NextResponse.json(
            {
                error: 'Failed to process message',
                response: "I'm having trouble processing your request right now. Please try again in a moment.",
                actions: [],
                metadata: {
                    error: error.message,
                    timestamp: new Date().toISOString()
                }
            },
            { status: 500 }
        );
    }
}

// Health check endpoint
export async function GET() {
    const hasGeminiKey = !!process.env.GEMINI_API_KEY;

    return NextResponse.json({
        status: 'healthy',
        agent: 'StudyPilot AI',
        version: '2.0.0',
        llm: {
            provider: hasGeminiKey ? 'gemini' : 'fallback',
            model: hasGeminiKey ? (process.env.NEXT_PUBLIC_AI_MODEL || 'gemini-1.5-flash') : 'mock',
            connected: hasGeminiKey
        },
        capabilities: [
            'course_management',
            'deadline_tracking',
            'study_planning',
            'grade_analysis',
            'wellness_monitoring',
            'natural_language_understanding'
        ]
    });
}
