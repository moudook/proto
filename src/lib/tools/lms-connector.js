/**
 * LMS Connector Tools
 * 
 * Simulates connections to Learning Management Systems (Canvas, Moodle, Blackboard)
 * In production, this would connect to actual LMS APIs.
 */

// Simulated LMS Database
const lmsDatabase = {
    courses: [
        {
            id: 'cs301',
            code: 'CS301',
            name: 'Algorithms',
            professor: 'Dr. Sarah Smith',
            email: 'ssmith@university.edu',
            office: 'Science Building 401',
            officeHours: 'Mon/Wed 2-4 PM',
            credits: 4,
            semester: 'Spring 2024',
            description: 'Advanced algorithm design and analysis',
            syllabus: 'https://lms.university.edu/cs301/syllabus.pdf',
            enrolled: true,
            progress: 68,
            grade: 'B+',
            gradePoints: 3.3,
        },
        {
            id: 'math202',
            code: 'MATH202',
            name: 'Linear Algebra',
            professor: 'Dr. Michael Johnson',
            email: 'mjohnson@university.edu',
            office: 'Math Building 205',
            officeHours: 'Tue/Thu 10 AM-12 PM',
            credits: 3,
            semester: 'Spring 2024',
            description: 'Linear equations, matrices, vector spaces',
            syllabus: 'https://lms.university.edu/math202/syllabus.pdf',
            enrolled: true,
            progress: 45,
            grade: 'B',
            gradePoints: 3.0,
        },
        {
            id: 'eng101',
            code: 'ENG101',
            name: 'Academic Writing',
            professor: 'Prof. Emily Williams',
            email: 'ewilliams@university.edu',
            office: 'Humanities 102',
            officeHours: 'Fri 1-3 PM',
            credits: 3,
            semester: 'Spring 2024',
            description: 'Fundamentals of academic writing and research',
            syllabus: 'https://lms.university.edu/eng101/syllabus.pdf',
            enrolled: true,
            progress: 82,
            grade: 'A-',
            gradePoints: 3.7,
        },
    ],

    assignments: [
        {
            id: 'asg_001',
            courseId: 'cs301',
            title: 'Project Proposal',
            description: 'Submit a proposal for your algorithms project including problem statement, approach, and timeline.',
            type: 'project',
            dueDate: '2024-03-20T23:59:00',
            points: 100,
            weight: 0.30,
            status: 'in_progress',
            submittedAt: null,
            grade: null,
            rubric: ['Problem Statement (20pts)', 'Approach (40pts)', 'Timeline (20pts)', 'References (20pts)'],
        },
        {
            id: 'asg_002',
            courseId: 'math202',
            title: 'Problem Set 5',
            description: 'Complete problems 1-15 from Chapter 5: Eigenvalues and Eigenvectors',
            type: 'homework',
            dueDate: '2024-03-22T23:59:00',
            points: 50,
            weight: 0.05,
            status: 'not_started',
            submittedAt: null,
            grade: null,
            rubric: null,
        },
        {
            id: 'asg_003',
            courseId: 'eng101',
            title: 'Essay Draft',
            description: 'First draft of your research essay (minimum 1500 words)',
            type: 'essay',
            dueDate: '2024-03-25T23:59:00',
            points: 75,
            weight: 0.15,
            status: 'not_started',
            submittedAt: null,
            grade: null,
            rubric: ['Thesis (15pts)', 'Evidence (25pts)', 'Analysis (25pts)', 'Writing (10pts)'],
        },
        {
            id: 'asg_004',
            courseId: 'cs301',
            title: 'Midterm Exam',
            description: 'Covers chapters 1-5: Sorting, Searching, Graph Algorithms',
            type: 'exam',
            dueDate: '2024-03-28T14:00:00',
            points: 100,
            weight: 0.25,
            status: 'upcoming',
            submittedAt: null,
            grade: null,
            rubric: null,
        },
    ],

    announcements: [
        {
            id: 'ann_001',
            courseId: 'cs301',
            title: 'Office Hours Cancelled This Week',
            content: 'Due to conference travel, office hours are cancelled this Thursday. Email me for questions.',
            postedAt: '2024-03-15T10:00:00',
            author: 'Dr. Sarah Smith',
        },
        {
            id: 'ann_002',
            courseId: 'math202',
            title: 'Extra Credit Opportunity',
            content: 'Attend the Math Colloquium on Friday for 5 bonus points on your next problem set.',
            postedAt: '2024-03-14T15:30:00',
            author: 'Dr. Michael Johnson',
        },
    ],

    materials: [
        {
            id: 'mat_001',
            courseId: 'cs301',
            title: 'Week 8 Slides: Graph Theory',
            type: 'slides',
            url: 'https://lms.university.edu/cs301/slides_week8.pdf',
            uploadedAt: '2024-03-18T09:00:00',
        },
        {
            id: 'mat_002',
            courseId: 'cs301',
            title: 'Graph Algorithms Cheat Sheet',
            type: 'document',
            url: 'https://lms.university.edu/cs301/graph_cheatsheet.pdf',
            uploadedAt: '2024-03-18T09:05:00',
        },
        {
            id: 'mat_003',
            courseId: 'math202',
            title: 'Eigenvalue Practice Problems',
            type: 'practice',
            url: 'https://lms.university.edu/math202/eigen_practice.pdf',
            uploadedAt: '2024-03-17T14:00:00',
        },
    ],
};

// Tool Implementations
export const lmsTools = {
    // Get all enrolled courses
    get_courses: {
        name: 'get_courses',
        description: 'Retrieves all courses the student is enrolled in for the current semester',
        category: 'lms',
        parameters: {
            type: 'object',
            properties: {
                semester: {
                    type: 'string',
                    description: 'Filter by semester (e.g., "Spring 2024")',
                },
                includeDetails: {
                    type: 'boolean',
                    description: 'Include detailed course information',
                },
            },
        },
        execute: async (params) => {
            let courses = [...lmsDatabase.courses];

            if (params.semester) {
                courses = courses.filter(c => c.semester === params.semester);
            }

            if (!params.includeDetails) {
                courses = courses.map(c => ({
                    id: c.id,
                    code: c.code,
                    name: c.name,
                    professor: c.professor,
                    progress: c.progress,
                    grade: c.grade,
                }));
            }

            return {
                count: courses.length,
                courses,
                formatted: courses.map(c =>
                    `📚 **${c.code}** - ${c.name} (${c.professor}) | Progress: ${c.progress}% | Grade: ${c.grade}`
                ).join('\n'),
            };
        },
    },

    // Get course details
    get_course_details: {
        name: 'get_course_details',
        description: 'Retrieves detailed information about a specific course',
        category: 'lms',
        parameters: {
            type: 'object',
            properties: {
                courseCode: {
                    type: 'string',
                    description: 'Course code (e.g., "CS301")',
                },
            },
            required: ['courseCode'],
        },
        execute: async (params) => {
            const course = lmsDatabase.courses.find(
                c => c.code.toLowerCase() === params.courseCode.toLowerCase()
            );

            if (!course) {
                return { found: false, message: `Course ${params.courseCode} not found` };
            }

            return {
                found: true,
                course,
                formatted: `
📚 **${course.code}: ${course.name}**
👨‍🏫 Professor: ${course.professor}
📧 Email: ${course.email}
🏢 Office: ${course.office}
⏰ Office Hours: ${course.officeHours}

📊 Progress: ${course.progress}%
📈 Current Grade: ${course.grade} (${course.gradePoints} GPA)
📖 Credits: ${course.credits}

📝 ${course.description}
        `.trim(),
            };
        },
    },

    // Get assignments
    get_assignments: {
        name: 'get_assignments',
        description: 'Retrieves assignments for a course or all courses',
        category: 'lms',
        parameters: {
            type: 'object',
            properties: {
                courseCode: {
                    type: 'string',
                    description: 'Filter by course code',
                },
                status: {
                    type: 'string',
                    enum: ['all', 'not_started', 'in_progress', 'submitted', 'graded', 'upcoming'],
                    description: 'Filter by assignment status',
                },
                limit: {
                    type: 'number',
                    description: 'Maximum number of assignments to return',
                },
            },
        },
        execute: async (params) => {
            let assignments = [...lmsDatabase.assignments];

            if (params.courseCode) {
                const course = lmsDatabase.courses.find(
                    c => c.code.toLowerCase() === params.courseCode.toLowerCase()
                );
                if (course) {
                    assignments = assignments.filter(a => a.courseId === course.id);
                }
            }

            if (params.status && params.status !== 'all') {
                assignments = assignments.filter(a => a.status === params.status);
            }

            // Sort by due date
            assignments.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

            if (params.limit) {
                assignments = assignments.slice(0, params.limit);
            }

            // Get course names
            const enrichedAssignments = assignments.map(a => {
                const course = lmsDatabase.courses.find(c => c.id === a.courseId);
                return {
                    ...a,
                    courseName: course?.name,
                    courseCode: course?.code,
                };
            });

            return {
                count: enrichedAssignments.length,
                assignments: enrichedAssignments,
                formatted: enrichedAssignments.map(a => {
                    const dueDate = new Date(a.dueDate);
                    const now = new Date();
                    const daysUntil = Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24));
                    const urgency = daysUntil <= 2 ? '🔴' : daysUntil <= 5 ? '🟡' : '🟢';

                    return `${urgency} **${a.title}** (${a.courseCode})
   📅 Due: ${dueDate.toLocaleDateString()} (${daysUntil} days)
   📊 Weight: ${(a.weight * 100).toFixed(0)}% | Points: ${a.points}
   📋 Status: ${a.status.replace('_', ' ')}`;
                }).join('\n\n'),
            };
        },
    },

    // Get announcements
    get_announcements: {
        name: 'get_announcements',
        description: 'Retrieves recent announcements from courses',
        category: 'lms',
        parameters: {
            type: 'object',
            properties: {
                courseCode: {
                    type: 'string',
                    description: 'Filter by course code',
                },
                limit: {
                    type: 'number',
                    description: 'Maximum number of announcements',
                },
            },
        },
        execute: async (params) => {
            let announcements = [...lmsDatabase.announcements];

            if (params.courseCode) {
                const course = lmsDatabase.courses.find(
                    c => c.code.toLowerCase() === params.courseCode.toLowerCase()
                );
                if (course) {
                    announcements = announcements.filter(a => a.courseId === course.id);
                }
            }

            // Sort by date (newest first)
            announcements.sort((a, b) => new Date(b.postedAt) - new Date(a.postedAt));

            if (params.limit) {
                announcements = announcements.slice(0, params.limit);
            }

            // Enrich with course info
            const enriched = announcements.map(a => {
                const course = lmsDatabase.courses.find(c => c.id === a.courseId);
                return { ...a, courseCode: course?.code };
            });

            return {
                count: enriched.length,
                announcements: enriched,
                formatted: enriched.map(a =>
                    `📢 **${a.title}** (${a.courseCode})\n   ${a.content}\n   — ${a.author}, ${new Date(a.postedAt).toLocaleDateString()}`
                ).join('\n\n'),
            };
        },
    },

    // Get course materials
    get_materials: {
        name: 'get_materials',
        description: 'Retrieves course materials (slides, documents, practice problems)',
        category: 'lms',
        parameters: {
            type: 'object',
            properties: {
                courseCode: {
                    type: 'string',
                    description: 'Filter by course code',
                },
                type: {
                    type: 'string',
                    enum: ['all', 'slides', 'document', 'practice', 'video'],
                    description: 'Filter by material type',
                },
            },
        },
        execute: async (params) => {
            let materials = [...lmsDatabase.materials];

            if (params.courseCode) {
                const course = lmsDatabase.courses.find(
                    c => c.code.toLowerCase() === params.courseCode.toLowerCase()
                );
                if (course) {
                    materials = materials.filter(m => m.courseId === course.id);
                }
            }

            if (params.type && params.type !== 'all') {
                materials = materials.filter(m => m.type === params.type);
            }

            // Enrich with course info
            const enriched = materials.map(m => {
                const course = lmsDatabase.courses.find(c => c.id === m.courseId);
                return { ...m, courseCode: course?.code };
            });

            return {
                count: enriched.length,
                materials: enriched,
                formatted: enriched.map(m =>
                    `📄 **${m.title}** (${m.courseCode})\n   Type: ${m.type} | Uploaded: ${new Date(m.uploadedAt).toLocaleDateString()}`
                ).join('\n\n'),
            };
        },
    },
};
