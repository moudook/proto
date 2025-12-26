/**
 * Tools API Route
 * 
 * POST /api/tools
 * GET /api/tools
 * 
 * Provides direct access to tool execution and listing.
 */

import { NextResponse } from 'next/server';
import { executeTool, listTools, getToolDefinitions } from '@/lib/tools';

// Execute a tool
export async function POST(request) {
    try {
        const body = await request.json();
        const { toolName, parameters = {} } = body;

        if (!toolName) {
            return NextResponse.json(
                { error: 'Tool name is required' },
                { status: 400 }
            );
        }

        const result = await executeTool(toolName, parameters);

        return NextResponse.json({
            ...result,
            timestamp: new Date().toISOString(),
        });

    } catch (error) {
        console.error('Tool API Error:', error);

        return NextResponse.json(
            {
                success: false,
                error: error.message,
                timestamp: new Date().toISOString(),
            },
            { status: 500 }
        );
    }
}

// List available tools
export async function GET() {
    const tools = listTools();
    const definitions = getToolDefinitions();

    return NextResponse.json({
        count: tools.length,
        tools: tools,
        definitions: definitions,
        categories: {
            lms: definitions.filter(t => t.name.includes('course') || t.name.includes('assignment') || t.name.includes('announcement') || t.name.includes('material')),
            calendar: definitions.filter(t => t.name.includes('calendar') || t.name.includes('event') || t.name.includes('schedule')),
            grades: definitions.filter(t => t.name.includes('grade') || t.name.includes('predict') || t.name.includes('improvement')),
            study: definitions.filter(t => t.name.includes('study') || t.name.includes('topic')),
            wellness: definitions.filter(t => t.name.includes('wellness') || t.name.includes('break')),
        },
        timestamp: new Date().toISOString(),
    });
}
