/**
 * Health Check API
 * 
 * GET /api/health
 * 
 * Returns the health status of the application and AI connectivity.
 */

import { NextResponse } from 'next/server';

export async function GET() {
    const hasGeminiKey = !!process.env.GEMINI_API_KEY;
    const hasOpenAIKey = !!process.env.OPENAI_API_KEY;
    const hasAnthropicKey = !!process.env.ANTHROPIC_API_KEY;

    const activeProvider = hasGeminiKey ? 'gemini' :
        hasOpenAIKey ? 'openai' :
            hasAnthropicKey ? 'anthropic' : 'fallback';

    return NextResponse.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: '2.0.0',
        environment: process.env.NODE_ENV,
        ai: {
            provider: activeProvider,
            connected: activeProvider !== 'fallback',
            model: activeProvider === 'gemini' ? 'gemini-1.5-flash' :
                activeProvider === 'openai' ? 'gpt-4' :
                    activeProvider === 'anthropic' ? 'claude-3-sonnet' : 'mock',
            capabilities: [
                'intent_detection',
                'tool_calling',
                'context_awareness',
                'multi_turn_conversation'
            ]
        },
        features: {
            courseManagement: true,
            deadlineTracking: true,
            studyPlanning: true,
            gradeAnalysis: true,
            wellnessMonitoring: true
        }
    });
}
