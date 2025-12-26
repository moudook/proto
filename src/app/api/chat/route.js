/**
 * StudyPilot Chat API Route
 * 
 * POST /api/chat
 * 
 * Handles chat messages and returns AI agent responses.
 */

import { NextResponse } from 'next/server';
import { agent } from '@/lib/agent-service';

export async function POST(request) {
    try {
        const body = await request.json();
        const { message, conversationHistory = [] } = body;

        if (!message || typeof message !== 'string') {
            return NextResponse.json(
                { error: 'Message is required' },
                { status: 400 }
            );
        }

        // Process message through the AI agent
        const result = await agent.processMessage(message, conversationHistory);

        return NextResponse.json({
            response: result.response,
            visualElements: result.visualElements,
            actions: result.actions,
            metadata: {
                intent: result.intent,
                toolsUsed: result.toolsUsed,
                timestamp: new Date().toISOString()
            }
        });

    } catch (error) {
        console.error('Chat API Error:', error);

        return NextResponse.json(
            {
                error: 'Failed to process message',
                response: "I'm having trouble processing your request right now. Please try again.",
                actions: []
            },
            { status: 500 }
        );
    }
}

// Health check endpoint
export async function GET() {
    return NextResponse.json({
        status: 'healthy',
        agent: 'StudyPilot AI',
        version: '1.0.0',
        capabilities: [
            'course_management',
            'deadline_tracking',
            'study_planning',
            'grade_analysis',
            'wellness_monitoring'
        ]
    });
}
