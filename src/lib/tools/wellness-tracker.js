/**
 * Wellness Tracker Tools
 * 
 * Monitors student wellness, tracks stress levels,
 * and provides healthy study habit recommendations.
 */

// Wellness Database
const wellnessDatabase = {
    // Daily wellness logs
    logs: [
        { id: 'wl_001', date: '2024-03-15', energy: 4, stress: 2, sleep: 7.5, mood: 'good', exercise: true },
        { id: 'wl_002', date: '2024-03-16', energy: 3, stress: 3, sleep: 6, mood: 'okay', exercise: false },
        { id: 'wl_003', date: '2024-03-17', energy: 4, stress: 4, sleep: 5.5, mood: 'stressed', exercise: false },
        { id: 'wl_004', date: '2024-03-18', energy: 3, stress: 3, sleep: 7, mood: 'okay', exercise: true },
    ],

    // Break reminders tracking
    breaks: {
        lastBreak: null,
        breaksTaken: 0,
        totalBreakMinutes: 0,
    },

    // Wellness goals
    goals: {
        dailySleepTarget: 7,
        dailyExerciseTarget: 30, // minutes
        maxDailyStudyHours: 6,
        breakFrequency: 50, // minutes between breaks
        targetStressLevel: 3, // max 5
    },

    // Wellness tips by category
    tips: {
        stress: [
            'Try the 4-7-8 breathing technique: inhale 4s, hold 7s, exhale 8s',
            'Take a 10-minute walk outside to clear your mind',
            'Write down 3 things you\'re grateful for today',
            'Practice progressive muscle relaxation',
            'Listen to calming music or nature sounds',
        ],
        energy: [
            'Stand up and stretch for 2 minutes',
            'Have a healthy snack with protein and complex carbs',
            'Get some natural light exposure',
            'Take a 20-minute power nap (not longer!)',
            'Do 10 jumping jacks to boost circulation',
        ],
        focus: [
            'Remove phone from your study area',
            'Use website blockers during study sessions',
            'Try the 2-minute rule: if distracted, refocus for just 2 minutes',
            'Set a specific, achievable goal for this study session',
            'Use background noise like white noise or lo-fi music',
        ],
        sleep: [
            'Avoid screens 1 hour before bed',
            'Keep your bedroom cool (65-68°F / 18-20°C)',
            'Maintain a consistent sleep schedule, even on weekends',
            'Avoid caffeine after 2 PM',
            'Create a relaxing bedtime routine',
        ],
    },
};

// Tool Implementations
export const wellnessTools = {
    // Log wellness check
    log_wellness: {
        name: 'log_wellness',
        description: 'Records a daily wellness check-in',
        category: 'wellness',
        parameters: {
            type: 'object',
            properties: {
                energy: {
                    type: 'number',
                    description: 'Energy level (1-5)',
                },
                stress: {
                    type: 'number',
                    description: 'Stress level (1-5)',
                },
                sleep: {
                    type: 'number',
                    description: 'Hours of sleep last night',
                },
                mood: {
                    type: 'string',
                    enum: ['great', 'good', 'okay', 'stressed', 'tired', 'anxious'],
                    description: 'Current mood',
                },
                exercise: {
                    type: 'boolean',
                    description: 'Did exercise today?',
                },
                notes: {
                    type: 'string',
                    description: 'Optional notes',
                },
            },
        },
        execute: async (params) => {
            const today = new Date().toISOString().split('T')[0];

            const log = {
                id: `wl_${Date.now()}`,
                date: today,
                energy: params.energy || 3,
                stress: params.stress || 3,
                sleep: params.sleep || 7,
                mood: params.mood || 'okay',
                exercise: params.exercise || false,
                notes: params.notes,
            };

            wellnessDatabase.logs.push(log);

            // Generate feedback
            const feedback = [];
            if (log.sleep < 6) feedback.push('😴 Low sleep detected - aim for 7+ hours tonight');
            if (log.stress >= 4) feedback.push('😰 High stress - consider taking a break');
            if (log.energy <= 2) feedback.push('⚡ Low energy - try a short walk or healthy snack');
            if (!log.exercise) feedback.push('🏃 No exercise today - even 10 minutes helps!');

            return {
                log,
                feedback,
                formatted: `✅ **Wellness Check-In Logged!**

📊 Today's Status:
⚡ Energy: ${'●'.repeat(log.energy)}${'○'.repeat(5 - log.energy)} (${log.energy}/5)
😰 Stress: ${'●'.repeat(log.stress)}${'○'.repeat(5 - log.stress)} (${log.stress}/5)
😴 Sleep: ${log.sleep} hours
😊 Mood: ${log.mood}
🏃 Exercise: ${log.exercise ? 'Yes ✓' : 'Not yet'}

${feedback.length > 0
                        ? '**Suggestions:**\n' + feedback.map(f => `• ${f}`).join('\n')
                        : '✨ You\'re doing great! Keep it up!'}`,
            };
        },
    },

    // Get wellness status
    get_wellness_status: {
        name: 'get_wellness_status',
        description: 'Retrieves current wellness status and trends',
        category: 'wellness',
        parameters: {
            type: 'object',
            properties: {
                includeRecommendations: {
                    type: 'boolean',
                    description: 'Include wellness recommendations',
                },
                period: {
                    type: 'string',
                    enum: ['today', 'this_week', 'this_month'],
                    description: 'Time period for trends',
                },
            },
        },
        execute: async (params) => {
            const logs = wellnessDatabase.logs;
            const recentLogs = logs.slice(-7); // Last 7 entries

            // Calculate averages
            const avgEnergy = recentLogs.reduce((sum, l) => sum + l.energy, 0) / recentLogs.length;
            const avgStress = recentLogs.reduce((sum, l) => sum + l.stress, 0) / recentLogs.length;
            const avgSleep = recentLogs.reduce((sum, l) => sum + l.sleep, 0) / recentLogs.length;
            const exerciseDays = recentLogs.filter(l => l.exercise).length;

            // Calculate overall wellness score
            const wellnessScore = (
                (avgEnergy / 5) * 25 +        // Energy contributes 25%
                ((5 - avgStress) / 5) * 25 +  // Lower stress is better
                (Math.min(avgSleep, 8) / 8) * 25 + // Sleep up to 8 hours
                (exerciseDays / 7) * 25       // Exercise frequency
            ) / 10; // Scale to 0-10

            // Determine status
            const status = wellnessScore >= 8 ? 'excellent' :
                wellnessScore >= 6 ? 'good' :
                    wellnessScore >= 4 ? 'fair' : 'needs attention';

            // Get recommendations if requested
            const recommendations = [];
            if (params.includeRecommendations) {
                if (avgStress >= 3.5) {
                    recommendations.push({
                        area: 'stress',
                        tip: wellnessDatabase.tips.stress[Math.floor(Math.random() * wellnessDatabase.tips.stress.length)],
                    });
                }
                if (avgEnergy <= 3) {
                    recommendations.push({
                        area: 'energy',
                        tip: wellnessDatabase.tips.energy[Math.floor(Math.random() * wellnessDatabase.tips.energy.length)],
                    });
                }
                if (avgSleep < 7) {
                    recommendations.push({
                        area: 'sleep',
                        tip: wellnessDatabase.tips.sleep[Math.floor(Math.random() * wellnessDatabase.tips.sleep.length)],
                    });
                }
            }

            return {
                score: wellnessScore.toFixed(1),
                status,
                averages: {
                    energy: avgEnergy.toFixed(1),
                    stress: avgStress.toFixed(1),
                    sleep: avgSleep.toFixed(1),
                    exerciseFrequency: `${exerciseDays}/7 days`,
                },
                recommendations,
                formatted: `🧘 **Wellness Status**

**Overall Score: ${wellnessScore.toFixed(1)}/10** (${status})

📊 Weekly Averages:
⚡ Energy: ${avgEnergy.toFixed(1)}/5
😰 Stress: ${avgStress.toFixed(1)}/5
😴 Sleep: ${avgSleep.toFixed(1)} hours
🏃 Exercise: ${exerciseDays}/7 days

${recommendations.length > 0
                        ? '💡 **Recommendations:**\n' +
                        recommendations.map(r => `• **${r.area}:** ${r.tip}`).join('\n')
                        : '✨ Great job maintaining your wellness!'}`,
            };
        },
    },

    // Take a break
    take_break: {
        name: 'take_break',
        description: 'Initiates a wellness break with guided activity',
        category: 'wellness',
        parameters: {
            type: 'object',
            properties: {
                duration: {
                    type: 'number',
                    description: 'Break duration in minutes',
                },
                type: {
                    type: 'string',
                    enum: ['stretch', 'breathe', 'walk', 'eyes', 'hydrate', 'quick'],
                    description: 'Type of break activity',
                },
            },
        },
        execute: async (params) => {
            const duration = params.duration || 5;
            const type = params.type || 'quick';

            const breakActivities = {
                stretch: {
                    name: 'Stretching Break',
                    steps: [
                        '🙆 Reach arms overhead and stretch tall (30s)',
                        '🔄 Roll shoulders forward and backward (30s)',
                        '↔️ Gentle neck rolls side to side (30s)',
                        '🙏 Clasp hands behind back and open chest (30s)',
                        '🦵 Stand and stretch legs (30s)',
                    ],
                },
                breathe: {
                    name: 'Breathing Exercise',
                    steps: [
                        '🌬️ Find a comfortable position',
                        '👃 Breathe in slowly through nose (4 counts)',
                        '⏸️ Hold your breath (7 counts)',
                        '😮 Exhale slowly through mouth (8 counts)',
                        '🔄 Repeat 4 times',
                    ],
                },
                walk: {
                    name: 'Walking Break',
                    steps: [
                        '🚶 Stand up and walk away from your desk',
                        '🌞 If possible, step outside for fresh air',
                        '👀 Look at distant objects to rest eyes',
                        '🧠 Let your mind wander freely',
                        '🔙 Return refreshed after 5-10 minutes',
                    ],
                },
                eyes: {
                    name: 'Eye Rest Break',
                    steps: [
                        '👀 Look away from screen',
                        '🌳 Focus on something 20+ feet away for 20 seconds',
                        '😌 Close eyes and rest for 20 seconds',
                        '🔄 Blink rapidly 10 times to refresh',
                        '↩️ Return to work with refreshed eyes',
                    ],
                },
                hydrate: {
                    name: 'Hydration Break',
                    steps: [
                        '🥤 Get up and fill a glass of water',
                        '💧 Drink slowly and mindfully',
                        '🚶 Take a quick walk while drinking',
                        '🍎 Consider a healthy snack too',
                        '↩️ Return feeling refreshed',
                    ],
                },
                quick: {
                    name: 'Quick Reset',
                    steps: [
                        '😤 Take 3 deep breaths',
                        '🙆 Quick stretch at your desk',
                        '💧 Sip some water',
                        '👀 Look at something far away',
                        '✅ Ready to refocus!',
                    ],
                },
            };

            const activity = breakActivities[type] || breakActivities.quick;

            // Update break tracking
            wellnessDatabase.breaks.lastBreak = new Date().toISOString();
            wellnessDatabase.breaks.breaksTaken += 1;
            wellnessDatabase.breaks.totalBreakMinutes += duration;

            return {
                activity,
                duration,
                breakNumber: wellnessDatabase.breaks.breaksTaken,
                formatted: `☕ **Time for a ${activity.name}!** (${duration} min)

${activity.steps.map((step, i) => `${i + 1}. ${step}`).join('\n')}

---
🎵 Put on some relaxing music if you'd like
⏰ I'll remind you when it's time to get back to work
📊 Breaks taken today: ${wellnessDatabase.breaks.breaksTaken}

Take care of yourself! You've got this! 💪`,
            };
        },
    },

    // Get wellness tips
    get_wellness_tips: {
        name: 'get_wellness_tips',
        description: 'Provides wellness tips for a specific area',
        category: 'wellness',
        parameters: {
            type: 'object',
            properties: {
                area: {
                    type: 'string',
                    enum: ['stress', 'energy', 'focus', 'sleep', 'general'],
                    description: 'Area to get tips for',
                },
                count: {
                    type: 'number',
                    description: 'Number of tips to return',
                },
            },
        },
        execute: async (params) => {
            const area = params.area || 'general';
            const count = params.count || 3;

            let tips = [];
            if (area === 'general') {
                // Get tips from all categories
                for (const category of Object.values(wellnessDatabase.tips)) {
                    tips.push(...category);
                }
            } else {
                tips = wellnessDatabase.tips[area] || [];
            }

            // Shuffle and select
            const shuffled = tips.sort(() => 0.5 - Math.random());
            const selected = shuffled.slice(0, count);

            return {
                area,
                tips: selected,
                formatted: `💡 **Wellness Tips${area !== 'general' ? ` for ${area.charAt(0).toUpperCase() + area.slice(1)}` : ''}**

${selected.map((tip, i) => `${i + 1}. ${tip}`).join('\n\n')}

---
Remember: Small consistent habits lead to big improvements! 🌟`,
            };
        },
    },
};
