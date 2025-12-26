/**
 * Grade Analyzer Tools
 * 
 * Analyzes grades, calculates GPA, predicts final grades,
 * and provides improvement recommendations.
 */

// Grade Database
const gradeDatabase = {
    // Graded items by course
    grades: {
        cs301: [
            { id: 'g_001', title: 'Homework 1', type: 'homework', score: 45, maxScore: 50, weight: 0.05, date: '2024-02-01' },
            { id: 'g_002', title: 'Homework 2', type: 'homework', score: 48, maxScore: 50, weight: 0.05, date: '2024-02-15' },
            { id: 'g_003', title: 'Homework 3', type: 'homework', score: 42, maxScore: 50, weight: 0.05, date: '2024-03-01' },
            { id: 'g_004', title: 'Quiz 1', type: 'quiz', score: 18, maxScore: 20, weight: 0.05, date: '2024-02-10' },
            { id: 'g_005', title: 'Quiz 2', type: 'quiz', score: 16, maxScore: 20, weight: 0.05, date: '2024-02-24' },
            { id: 'g_006', title: 'Lab 1', type: 'lab', score: 95, maxScore: 100, weight: 0.10, date: '2024-02-20' },
        ],
        math202: [
            { id: 'g_007', title: 'Problem Set 1', type: 'homework', score: 45, maxScore: 50, weight: 0.05, date: '2024-02-05' },
            { id: 'g_008', title: 'Problem Set 2', type: 'homework', score: 40, maxScore: 50, weight: 0.05, date: '2024-02-19' },
            { id: 'g_009', title: 'Problem Set 3', type: 'homework', score: 38, maxScore: 50, weight: 0.05, date: '2024-03-04' },
            { id: 'g_010', title: 'Problem Set 4', type: 'homework', score: 42, maxScore: 50, weight: 0.05, date: '2024-03-11' },
            { id: 'g_011', title: 'Quiz 1', type: 'quiz', score: 14, maxScore: 20, weight: 0.05, date: '2024-02-12' },
        ],
        eng101: [
            { id: 'g_012', title: 'Essay 1', type: 'essay', score: 88, maxScore: 100, weight: 0.15, date: '2024-02-08' },
            { id: 'g_013', title: 'Essay 2', type: 'essay', score: 92, maxScore: 100, weight: 0.15, date: '2024-02-28' },
            { id: 'g_014', title: 'Discussion Posts', type: 'participation', score: 48, maxScore: 50, weight: 0.10, date: '2024-03-10' },
        ],
    },

    // Course grade weights
    courseWeights: {
        cs301: {
            homework: 0.20,
            quiz: 0.10,
            lab: 0.20,
            midterm: 0.20,
            project: 0.30,
        },
        math202: {
            homework: 0.30,
            quiz: 0.15,
            midterm: 0.25,
            final: 0.30,
        },
        eng101: {
            essay: 0.60,
            participation: 0.20,
            final_project: 0.20,
        },
    },

    // Grade scale
    gradeScale: {
        'A+': { min: 97, gpa: 4.0 },
        'A': { min: 93, gpa: 4.0 },
        'A-': { min: 90, gpa: 3.7 },
        'B+': { min: 87, gpa: 3.3 },
        'B': { min: 83, gpa: 3.0 },
        'B-': { min: 80, gpa: 2.7 },
        'C+': { min: 77, gpa: 2.3 },
        'C': { min: 73, gpa: 2.0 },
        'C-': { min: 70, gpa: 1.7 },
        'D+': { min: 67, gpa: 1.3 },
        'D': { min: 63, gpa: 1.0 },
        'D-': { min: 60, gpa: 0.7 },
        'F': { min: 0, gpa: 0.0 },
    },
};

// Helper functions
function percentageToLetter(percentage) {
    for (const [letter, data] of Object.entries(gradeDatabase.gradeScale)) {
        if (percentage >= data.min) {
            return { letter, gpa: data.gpa };
        }
    }
    return { letter: 'F', gpa: 0.0 };
}

function calculateWeightedAverage(grades) {
    if (!grades || grades.length === 0) return 0;

    let totalWeight = 0;
    let weightedSum = 0;

    for (const grade of grades) {
        const percentage = (grade.score / grade.maxScore) * 100;
        weightedSum += percentage * grade.weight;
        totalWeight += grade.weight;
    }

    return totalWeight > 0 ? weightedSum / totalWeight : 0;
}

// Tool Implementations
export const gradeTools = {
    // Get grade summary
    get_grade_summary: {
        name: 'get_grade_summary',
        description: 'Retrieves overall grade summary for all courses or a specific course',
        category: 'grades',
        parameters: {
            type: 'object',
            properties: {
                courseCode: {
                    type: 'string',
                    description: 'Filter by course code',
                },
                includeTrends: {
                    type: 'boolean',
                    description: 'Include grade trend analysis',
                },
            },
        },
        execute: async (params) => {
            const summaries = [];

            const coursesToAnalyze = params.courseCode
                ? [params.courseCode.toLowerCase()]
                : Object.keys(gradeDatabase.grades);

            for (const courseId of coursesToAnalyze) {
                const grades = gradeDatabase.grades[courseId];
                if (!grades) continue;

                const average = calculateWeightedAverage(grades);
                const letterGrade = percentageToLetter(average);

                // Calculate trend
                let trend = 'stable';
                if (grades.length >= 3) {
                    const recent = grades.slice(-3);
                    const older = grades.slice(0, -3);

                    if (older.length > 0) {
                        const recentAvg = recent.reduce((sum, g) => sum + (g.score / g.maxScore), 0) / recent.length;
                        const olderAvg = older.reduce((sum, g) => sum + (g.score / g.maxScore), 0) / older.length;

                        if (recentAvg > olderAvg + 0.05) trend = 'improving';
                        else if (recentAvg < olderAvg - 0.05) trend = 'declining';
                    }
                }

                summaries.push({
                    courseId,
                    courseCode: courseId.toUpperCase(),
                    gradeCount: grades.length,
                    currentAverage: average.toFixed(1),
                    letterGrade: letterGrade.letter,
                    gpa: letterGrade.gpa,
                    trend,
                    completedWeight: grades.reduce((sum, g) => sum + g.weight, 0),
                });
            }

            // Calculate overall GPA
            const overallGPA = summaries.length > 0
                ? (summaries.reduce((sum, s) => sum + s.gpa, 0) / summaries.length).toFixed(2)
                : 0;

            return {
                courses: summaries,
                overallGPA,
                formatted: `📊 **Grade Summary**\n\n` +
                    summaries.map(s => {
                        const trendEmoji = s.trend === 'improving' ? '📈' : s.trend === 'declining' ? '📉' : '➡️';
                        return `**${s.courseCode}**
   Current: ${s.currentAverage}% (${s.letterGrade})
   GPA: ${s.gpa} | Trend: ${trendEmoji} ${s.trend}
   Progress: ${(s.completedWeight * 100).toFixed(0)}% of grade earned`;
                    }).join('\n\n') +
                    `\n\n📚 **Overall GPA: ${overallGPA}**`,
            };
        },
    },

    // Get detailed grades for a course
    get_course_grades: {
        name: 'get_course_grades',
        description: 'Retrieves all graded items for a specific course',
        category: 'grades',
        parameters: {
            type: 'object',
            properties: {
                courseCode: {
                    type: 'string',
                    description: 'Course code',
                },
                type: {
                    type: 'string',
                    enum: ['all', 'homework', 'quiz', 'exam', 'lab', 'essay', 'project'],
                    description: 'Filter by grade type',
                },
            },
            required: ['courseCode'],
        },
        execute: async (params) => {
            const courseId = params.courseCode.toLowerCase();
            let grades = gradeDatabase.grades[courseId] || [];

            if (params.type && params.type !== 'all') {
                grades = grades.filter(g => g.type === params.type);
            }

            // Sort by date
            grades.sort((a, b) => new Date(a.date) - new Date(b.date));

            return {
                courseCode: params.courseCode.toUpperCase(),
                count: grades.length,
                grades,
                formatted: grades.length > 0
                    ? `📝 **${params.courseCode.toUpperCase()} Grades**\n\n` +
                    grades.map(g => {
                        const percentage = ((g.score / g.maxScore) * 100).toFixed(1);
                        return `• **${g.title}** (${g.type})
   Score: ${g.score}/${g.maxScore} (${percentage}%)
   Weight: ${(g.weight * 100).toFixed(0)}% | Date: ${new Date(g.date).toLocaleDateString()}`;
                    }).join('\n\n')
                    : `No grades found for ${params.courseCode.toUpperCase()}`,
            };
        },
    },

    // Predict final grade
    predict_final_grade: {
        name: 'predict_final_grade',
        description: 'Predicts final grade based on current performance and remaining assignments',
        category: 'grades',
        parameters: {
            type: 'object',
            properties: {
                courseCode: {
                    type: 'string',
                    description: 'Course code',
                },
                targetGrade: {
                    type: 'string',
                    description: 'Target letter grade (e.g., "A", "B+")',
                },
            },
            required: ['courseCode'],
        },
        execute: async (params) => {
            const courseId = params.courseCode.toLowerCase();
            const grades = gradeDatabase.grades[courseId] || [];
            const weights = gradeDatabase.courseWeights[courseId] || {};

            const currentWeightedSum = grades.reduce((sum, g) => {
                const percentage = (g.score / g.maxScore) * 100;
                return sum + (percentage * g.weight);
            }, 0);

            const completedWeight = grades.reduce((sum, g) => sum + g.weight, 0);
            const remainingWeight = 1 - completedWeight;

            const currentAverage = completedWeight > 0 ? currentWeightedSum / completedWeight : 0;
            const currentLetter = percentageToLetter(currentAverage);

            // Calculate what's needed on remaining work
            let targetPercentage = null;
            let requiredOnRemaining = null;

            if (params.targetGrade) {
                const targetData = gradeDatabase.gradeScale[params.targetGrade];
                if (targetData) {
                    targetPercentage = targetData.min;
                    // Calculate: (current * completedWeight + required * remainingWeight) >= target
                    // required = (target - current * completedWeight) / remainingWeight
                    requiredOnRemaining = (targetPercentage - currentWeightedSum) / remainingWeight;
                }
            }

            // Predict based on current trajectory
            const predictedFinal = currentAverage;
            const predictedLetter = percentageToLetter(predictedFinal);

            return {
                courseCode: params.courseCode.toUpperCase(),
                current: {
                    average: currentAverage.toFixed(1),
                    letter: currentLetter.letter,
                    completedWeight: (completedWeight * 100).toFixed(0),
                },
                predicted: {
                    average: predictedFinal.toFixed(1),
                    letter: predictedLetter.letter,
                },
                target: params.targetGrade ? {
                    grade: params.targetGrade,
                    requiredOnRemaining: requiredOnRemaining?.toFixed(1),
                    achievable: requiredOnRemaining !== null && requiredOnRemaining <= 100,
                } : null,
                remainingWeight: (remainingWeight * 100).toFixed(0),
                formatted: `🎯 **Grade Prediction: ${params.courseCode.toUpperCase()}**

**Current Status:**
📊 Average: ${currentAverage.toFixed(1)}% (${currentLetter.letter})
✅ Weight completed: ${(completedWeight * 100).toFixed(0)}%
📝 Remaining: ${(remainingWeight * 100).toFixed(0)}%

**Prediction (if current trend continues):**
📈 Predicted Final: ${predictedFinal.toFixed(1)}% (${predictedLetter.letter})

${params.targetGrade ? `**To achieve ${params.targetGrade}:**
${requiredOnRemaining !== null && requiredOnRemaining <= 100
                            ? `✅ You need ${requiredOnRemaining.toFixed(1)}% on remaining work`
                            : `❌ Target grade may not be achievable with current scores`}` : ''}`,
            };
        },
    },

    // Get improvement recommendations
    get_improvement_tips: {
        name: 'get_improvement_tips',
        description: 'Provides personalized recommendations to improve grades',
        category: 'grades',
        parameters: {
            type: 'object',
            properties: {
                courseCode: {
                    type: 'string',
                    description: 'Course to get tips for (optional)',
                },
            },
        },
        execute: async (params) => {
            const tips = [];
            const coursesToAnalyze = params.courseCode
                ? [params.courseCode.toLowerCase()]
                : Object.keys(gradeDatabase.grades);

            for (const courseId of coursesToAnalyze) {
                const grades = gradeDatabase.grades[courseId] || [];
                if (grades.length === 0) continue;

                // Analyze by type
                const byType = {};
                for (const grade of grades) {
                    if (!byType[grade.type]) byType[grade.type] = [];
                    byType[grade.type].push(grade);
                }

                // Find weak areas
                for (const [type, typeGrades] of Object.entries(byType)) {
                    const avg = typeGrades.reduce((sum, g) => sum + (g.score / g.maxScore), 0) / typeGrades.length;

                    if (avg < 0.80) {
                        tips.push({
                            courseCode: courseId.toUpperCase(),
                            type,
                            currentAvg: (avg * 100).toFixed(1),
                            recommendation: getRecommendation(type, avg),
                            priority: avg < 0.70 ? 'high' : 'medium',
                        });
                    }
                }
            }

            // Sort by priority
            tips.sort((a, b) => (a.priority === 'high' ? -1 : 1));

            return {
                tips,
                formatted: tips.length > 0
                    ? `💡 **Improvement Recommendations**\n\n` +
                    tips.map((t, i) =>
                        `${t.priority === 'high' ? '🔴' : '🟡'} **${t.courseCode} - ${t.type}** (Current: ${t.currentAvg}%)
   📝 ${t.recommendation}`
                    ).join('\n\n')
                    : `✨ Great job! Your grades are looking strong across all areas. Keep up the excellent work!`,
            };
        },
    },
};

// Recommendation generator
function getRecommendation(type, average) {
    const recommendations = {
        homework: [
            'Start assignments earlier to have time for review',
            'Visit office hours for help with difficult problems',
            'Form a study group for homework collaboration',
        ],
        quiz: [
            'Review material more frequently - try spaced repetition',
            'Practice with flashcards before quizzes',
            'Identify patterns in quiz questions from past tests',
        ],
        lab: [
            'Prepare for labs by reviewing procedures beforehand',
            'Ask TAs for clarification during lab sessions',
            'Complete pre-lab assignments thoroughly',
        ],
        essay: [
            'Visit the writing center for feedback before submission',
            'Create detailed outlines before writing',
            'Give yourself time for multiple revision passes',
        ],
        exam: [
            'Start studying at least one week before exams',
            'Practice with old exams if available',
            'Focus on understanding concepts, not just memorization',
        ],
    };

    const typeRecs = recommendations[type] || recommendations.homework;
    return typeRecs[Math.floor(Math.random() * typeRecs.length)];
}
