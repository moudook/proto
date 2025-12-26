/**
 * Study Planner Tools
 * 
 * Creates personalized study plans, tracks study sessions,
 * and provides study recommendations.
 */

// Study Database
const studyDatabase = {
    sessions: [
        { id: 'ss_001', courseId: 'cs301', topic: 'Graph Algorithms', duration: 90, date: '2024-03-15', effectiveness: 4 },
        { id: 'ss_002', courseId: 'math202', topic: 'Eigenvalues', duration: 60, date: '2024-03-16', effectiveness: 3 },
        { id: 'ss_003', courseId: 'cs301', topic: 'Dynamic Programming', duration: 120, date: '2024-03-17', effectiveness: 5 },
    ],

    techniques: {
        pomodoro: {
            name: 'Pomodoro Technique',
            description: '25 min focus + 5 min break, repeat 4x, then 15-30 min break',
            bestFor: ['heavy reading', 'practice problems', 'essay writing'],
        },
        activeRecall: {
            name: 'Active Recall',
            description: 'Test yourself without looking at notes, then review gaps',
            bestFor: ['memorization', 'exam prep', 'concept learning'],
        },
        spacedRepetition: {
            name: 'Spaced Repetition',
            description: 'Review material at increasing intervals',
            bestFor: ['long-term retention', 'vocabulary', 'formulas'],
        },
        feynman: {
            name: 'Feynman Technique',
            description: 'Explain concepts in simple terms as if teaching someone',
            bestFor: ['complex topics', 'deep understanding', 'debugging knowledge gaps'],
        },
    },

    // Topics by course with difficulty and estimated time
    topics: {
        cs301: [
            { id: 't_001', name: 'Sorting Algorithms', difficulty: 'medium', estimatedHours: 3, completed: true },
            { id: 't_002', name: 'Searching Algorithms', difficulty: 'easy', estimatedHours: 2, completed: true },
            { id: 't_003', name: 'Graph Theory Basics', difficulty: 'medium', estimatedHours: 4, completed: true },
            { id: 't_004', name: 'Graph Algorithms (BFS/DFS)', difficulty: 'medium', estimatedHours: 5, completed: false },
            { id: 't_005', name: 'Dynamic Programming', difficulty: 'hard', estimatedHours: 8, completed: false },
            { id: 't_006', name: 'Greedy Algorithms', difficulty: 'medium', estimatedHours: 4, completed: false },
        ],
        math202: [
            { id: 't_007', name: 'Systems of Linear Equations', difficulty: 'easy', estimatedHours: 3, completed: true },
            { id: 't_008', name: 'Matrix Operations', difficulty: 'easy', estimatedHours: 2, completed: true },
            { id: 't_009', name: 'Determinants', difficulty: 'medium', estimatedHours: 3, completed: false },
            { id: 't_010', name: 'Vector Spaces', difficulty: 'hard', estimatedHours: 5, completed: false },
            { id: 't_011', name: 'Eigenvalues & Eigenvectors', difficulty: 'hard', estimatedHours: 6, completed: false },
        ],
        eng101: [
            { id: 't_012', name: 'Thesis Development', difficulty: 'medium', estimatedHours: 2, completed: true },
            { id: 't_013', name: 'Research Methods', difficulty: 'medium', estimatedHours: 3, completed: true },
            { id: 't_014', name: 'Citation Styles', difficulty: 'easy', estimatedHours: 1, completed: true },
            { id: 't_015', name: 'Argumentation', difficulty: 'medium', estimatedHours: 3, completed: false },
        ],
    },
};

// Tool Implementations
export const studyTools = {
    // Create a study plan
    create_study_plan: {
        name: 'create_study_plan',
        description: 'Creates a personalized study plan for an exam, assignment, or topic',
        category: 'study',
        parameters: {
            type: 'object',
            properties: {
                topic: {
                    type: 'string',
                    description: 'Topic or assignment to study for',
                },
                courseCode: {
                    type: 'string',
                    description: 'Related course code',
                },
                deadline: {
                    type: 'string',
                    description: 'When the exam/assignment is due',
                },
                availableHoursPerDay: {
                    type: 'number',
                    description: 'Hours available for studying per day',
                },
                preferredTechnique: {
                    type: 'string',
                    enum: ['pomodoro', 'activeRecall', 'spacedRepetition', 'feynman', 'auto'],
                    description: 'Preferred study technique',
                },
            },
            required: ['topic'],
        },
        execute: async (params) => {
            const courseId = params.courseCode?.toLowerCase();
            const deadline = params.deadline ? new Date(params.deadline) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
            const hoursPerDay = params.availableHoursPerDay || 2;
            const daysUntil = Math.max(1, Math.ceil((deadline - new Date()) / (1000 * 60 * 60 * 24)));

            // Get relevant topics
            let topics = courseId ? studyDatabase.topics[courseId]?.filter(t => !t.completed) || [] : [];

            // Select appropriate technique
            let technique = params.preferredTechnique || 'auto';
            if (technique === 'auto') {
                technique = daysUntil <= 2 ? 'activeRecall' : daysUntil <= 5 ? 'pomodoro' : 'spacedRepetition';
            }
            const techniqueInfo = studyDatabase.techniques[technique] || studyDatabase.techniques.pomodoro;

            // Calculate total study time needed
            const totalHours = topics.reduce((sum, t) => sum + t.estimatedHours, 0);
            const availableHours = daysUntil * hoursPerDay;

            // Create daily schedule
            const schedule = [];
            let remainingTopics = [...topics];

            for (let day = 1; day <= Math.min(daysUntil, 7); day++) {
                const dayPlan = {
                    day,
                    date: new Date(Date.now() + day * 24 * 60 * 60 * 1000).toLocaleDateString(),
                    sessions: [],
                    totalMinutes: 0,
                };

                let dayMinutes = hoursPerDay * 60;

                while (dayMinutes > 0 && remainingTopics.length > 0) {
                    const topic = remainingTopics[0];
                    const sessionMinutes = Math.min(dayMinutes, 60); // Max 60 min sessions

                    dayPlan.sessions.push({
                        topic: topic.name,
                        duration: sessionMinutes,
                        technique: techniqueInfo.name,
                    });

                    dayPlan.totalMinutes += sessionMinutes;
                    dayMinutes -= sessionMinutes + 10; // 10 min break between sessions

                    // Check if topic is complete
                    topic.estimatedHours -= sessionMinutes / 60;
                    if (topic.estimatedHours <= 0) {
                        remainingTopics.shift();
                    }
                }

                if (dayPlan.sessions.length > 0) {
                    schedule.push(dayPlan);
                }
            }

            return {
                topic: params.topic,
                courseCode: params.courseCode?.toUpperCase(),
                deadline: deadline.toLocaleDateString(),
                daysUntil,
                technique: techniqueInfo,
                schedule,
                summary: {
                    totalHoursNeeded: totalHours,
                    availableHours,
                    feasibility: availableHours >= totalHours ? 'achievable' : 'tight',
                },
                formatted: `📖 **Study Plan: ${params.topic}**

⏰ Deadline: ${deadline.toLocaleDateString()} (${daysUntil} days away)
📚 Course: ${params.courseCode?.toUpperCase() || 'General'}
🧠 Technique: ${techniqueInfo.name}

**Daily Schedule:**
${schedule.map(d => `
**Day ${d.day}** (${d.date}) - ${d.totalMinutes} min total
${d.sessions.map(s => `  • ${s.topic} (${s.duration} min)`).join('\n')}`
                ).join('\n')}

💡 **Tips:**
• ${techniqueInfo.description}
• Best for: ${techniqueInfo.bestFor.join(', ')}
• ${availableHours >= totalHours
                        ? '✅ You have enough time! Stay consistent.'
                        : '⚠️ Time is tight - prioritize high-impact topics.'}`,
            };
        },
    },

    // Log a study session
    log_study_session: {
        name: 'log_study_session',
        description: 'Records a completed study session',
        category: 'study',
        parameters: {
            type: 'object',
            properties: {
                courseCode: {
                    type: 'string',
                    description: 'Course studied',
                },
                topic: {
                    type: 'string',
                    description: 'Topic studied',
                },
                duration: {
                    type: 'number',
                    description: 'Duration in minutes',
                },
                effectiveness: {
                    type: 'number',
                    description: 'Self-rated effectiveness (1-5)',
                },
                notes: {
                    type: 'string',
                    description: 'Session notes',
                },
            },
            required: ['topic', 'duration'],
        },
        execute: async (params) => {
            const session = {
                id: `ss_${Date.now()}`,
                courseId: params.courseCode?.toLowerCase(),
                topic: params.topic,
                duration: params.duration,
                date: new Date().toISOString().split('T')[0],
                effectiveness: params.effectiveness || 3,
                notes: params.notes,
            };

            studyDatabase.sessions.push(session);

            // Calculate stats
            const todaySessions = studyDatabase.sessions.filter(
                s => s.date === session.date
            );
            const todayMinutes = todaySessions.reduce((sum, s) => sum + s.duration, 0);

            return {
                session,
                todayStats: {
                    sessions: todaySessions.length,
                    totalMinutes: todayMinutes,
                },
                formatted: `✅ **Study Session Logged!**

📚 Topic: ${params.topic}
⏱️ Duration: ${params.duration} minutes
⭐ Effectiveness: ${'★'.repeat(session.effectiveness)}${'☆'.repeat(5 - session.effectiveness)}

**Today's Progress:**
📊 Sessions: ${todaySessions.length}
⏰ Total: ${todayMinutes} minutes (${(todayMinutes / 60).toFixed(1)} hours)

Keep up the great work! 🎉`,
            };
        },
    },

    // Get study statistics
    get_study_stats: {
        name: 'get_study_stats',
        description: 'Retrieves study statistics and progress',
        category: 'study',
        parameters: {
            type: 'object',
            properties: {
                period: {
                    type: 'string',
                    enum: ['today', 'this_week', 'this_month', 'all_time'],
                    description: 'Time period for statistics',
                },
                courseCode: {
                    type: 'string',
                    description: 'Filter by course',
                },
            },
        },
        execute: async (params) => {
            let sessions = [...studyDatabase.sessions];
            const now = new Date();

            // Filter by period
            if (params.period === 'today') {
                const today = now.toISOString().split('T')[0];
                sessions = sessions.filter(s => s.date === today);
            } else if (params.period === 'this_week') {
                const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                sessions = sessions.filter(s => new Date(s.date) >= weekAgo);
            } else if (params.period === 'this_month') {
                const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                sessions = sessions.filter(s => new Date(s.date) >= monthAgo);
            }

            // Filter by course
            if (params.courseCode) {
                sessions = sessions.filter(s => s.courseId === params.courseCode.toLowerCase());
            }

            // Calculate stats
            const totalMinutes = sessions.reduce((sum, s) => sum + s.duration, 0);
            const avgEffectiveness = sessions.length > 0
                ? sessions.reduce((sum, s) => sum + s.effectiveness, 0) / sessions.length
                : 0;

            // Group by course
            const byCourse = {};
            for (const session of sessions) {
                const courseId = session.courseId || 'other';
                if (!byCourse[courseId]) byCourse[courseId] = { minutes: 0, sessions: 0 };
                byCourse[courseId].minutes += session.duration;
                byCourse[courseId].sessions += 1;
            }

            return {
                period: params.period || 'all_time',
                stats: {
                    totalSessions: sessions.length,
                    totalMinutes,
                    totalHours: (totalMinutes / 60).toFixed(1),
                    avgEffectiveness: avgEffectiveness.toFixed(1),
                    byCourse,
                },
                formatted: `📊 **Study Statistics** (${params.period || 'All Time'})

⏱️ Total Study Time: ${(totalMinutes / 60).toFixed(1)} hours
📚 Sessions: ${sessions.length}
⭐ Avg Effectiveness: ${avgEffectiveness.toFixed(1)}/5

**By Course:**
${Object.entries(byCourse).map(([course, data]) =>
                    `• ${course.toUpperCase()}: ${(data.minutes / 60).toFixed(1)}h (${data.sessions} sessions)`
                ).join('\n')}

${sessions.length >= 5
                        ? '🔥 Great consistency! Keep up the momentum!'
                        : '💪 Build your study streak - consistency is key!'}`,
            };
        },
    },

    // Get topic recommendations
    get_topic_recommendations: {
        name: 'get_topic_recommendations',
        description: 'Suggests which topics to focus on based on upcoming deadlines and progress',
        category: 'study',
        parameters: {
            type: 'object',
            properties: {
                courseCode: {
                    type: 'string',
                    description: 'Course to get recommendations for',
                },
                limit: {
                    type: 'number',
                    description: 'Number of recommendations',
                },
            },
        },
        execute: async (params) => {
            const limit = params.limit || 5;
            const recommendations = [];

            const coursesToCheck = params.courseCode
                ? [params.courseCode.toLowerCase()]
                : Object.keys(studyDatabase.topics);

            for (const courseId of coursesToCheck) {
                const topics = studyDatabase.topics[courseId] || [];

                for (const topic of topics.filter(t => !t.completed)) {
                    recommendations.push({
                        courseCode: courseId.toUpperCase(),
                        topic: topic.name,
                        difficulty: topic.difficulty,
                        estimatedHours: topic.estimatedHours,
                        priority: topic.difficulty === 'hard' ? 'high' : topic.difficulty === 'medium' ? 'medium' : 'low',
                    });
                }
            }

            // Sort by priority
            recommendations.sort((a, b) => {
                const priorityOrder = { high: 0, medium: 1, low: 2 };
                return priorityOrder[a.priority] - priorityOrder[b.priority];
            });

            return {
                recommendations: recommendations.slice(0, limit),
                formatted: `📋 **Topic Recommendations**\n\n` +
                    recommendations.slice(0, limit).map((r, i) => {
                        const priorityEmoji = r.priority === 'high' ? '🔴' : r.priority === 'medium' ? '🟡' : '🟢';
                        return `${i + 1}. ${priorityEmoji} **${r.topic}** (${r.courseCode})
   Difficulty: ${r.difficulty} | Est. Time: ${r.estimatedHours}h`;
                    }).join('\n\n'),
            };
        },
    },
};
