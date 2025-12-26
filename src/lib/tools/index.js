/**
 * StudyPilot Tool Registry
 * 
 * Central registry for all AI agent tools.
 * Handles tool registration, validation, and execution.
 */

import { lmsTools } from './lms-connector';
import { calendarTools } from './calendar-manager';
import { gradeTools } from './grade-analyzer';
import { studyTools } from './study-planner';
import { wellnessTools } from './wellness-tracker';

// Tool Registry - All available tools
export const toolRegistry = {
    // LMS Tools
    ...lmsTools,
    // Calendar Tools  
    ...calendarTools,
    // Grade Tools
    ...gradeTools,
    // Study Tools
    ...studyTools,
    // Wellness Tools
    ...wellnessTools,
};

/**
 * Get tool by name
 */
export function getTool(toolName) {
    return toolRegistry[toolName] || null;
}

/**
 * Execute a tool with parameters
 */
export async function executeTool(toolName, parameters, context = {}) {
    const tool = getTool(toolName);

    if (!tool) {
        return {
            success: false,
            error: `Tool not found: ${toolName}`,
            toolName,
        };
    }

    try {
        // Validate parameters
        const validationResult = validateParameters(tool, parameters);
        if (!validationResult.valid) {
            return {
                success: false,
                error: `Invalid parameters: ${validationResult.errors.join(', ')}`,
                toolName,
            };
        }

        // Execute the tool
        const result = await tool.execute(parameters, context);

        return {
            success: true,
            toolName,
            result,
            executedAt: new Date().toISOString(),
        };
    } catch (error) {
        console.error(`Tool execution error [${toolName}]:`, error);
        return {
            success: false,
            error: error.message,
            toolName,
        };
    }
}

/**
 * Validate tool parameters against schema
 */
function validateParameters(tool, parameters) {
    const errors = [];
    const schema = tool.parameters;

    if (!schema) {
        return { valid: true, errors: [] };
    }

    // Check required parameters
    if (schema.required) {
        for (const requiredParam of schema.required) {
            if (parameters[requiredParam] === undefined) {
                errors.push(`Missing required parameter: ${requiredParam}`);
            }
        }
    }

    // Check parameter types
    if (schema.properties) {
        for (const [paramName, paramSchema] of Object.entries(schema.properties)) {
            const value = parameters[paramName];

            if (value !== undefined) {
                // Type checking
                if (paramSchema.type === 'string' && typeof value !== 'string') {
                    errors.push(`Parameter ${paramName} must be a string`);
                }
                if (paramSchema.type === 'number' && typeof value !== 'number') {
                    errors.push(`Parameter ${paramName} must be a number`);
                }
                if (paramSchema.type === 'boolean' && typeof value !== 'boolean') {
                    errors.push(`Parameter ${paramName} must be a boolean`);
                }
                if (paramSchema.type === 'array' && !Array.isArray(value)) {
                    errors.push(`Parameter ${paramName} must be an array`);
                }

                // Enum validation
                if (paramSchema.enum && !paramSchema.enum.includes(value)) {
                    errors.push(`Parameter ${paramName} must be one of: ${paramSchema.enum.join(', ')}`);
                }
            }
        }
    }

    return {
        valid: errors.length === 0,
        errors,
    };
}

/**
 * Get all tool definitions for LLM function calling
 */
export function getToolDefinitions() {
    return Object.values(toolRegistry).map(tool => ({
        name: tool.name,
        description: tool.description,
        parameters: tool.parameters,
    }));
}

/**
 * Get tools by category
 */
export function getToolsByCategory(category) {
    return Object.values(toolRegistry).filter(tool => tool.category === category);
}

/**
 * List all available tools
 */
export function listTools() {
    return Object.keys(toolRegistry);
}
