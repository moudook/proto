'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import {
    ChevronRight,
    ChevronLeft,
    GraduationCap,
    BookOpen,
    Target,
    Sparkles,
    Clock,
    Check
} from 'lucide-react';

const ONBOARDING_STEPS = [
    {
        id: 'welcome',
        title: 'Welcome to StudyPilot! 🎓',
        subtitle: 'Let\'s personalize your academic experience',
    },
    {
        id: 'university',
        title: 'Your University',
        subtitle: 'Help us understand your academic environment',
    },
    {
        id: 'courses',
        title: 'Your Courses',
        subtitle: 'Tell us what you\'re studying this semester',
    },
    {
        id: 'goals',
        title: 'Academic Goals',
        subtitle: 'What do you want to achieve?',
    },
    {
        id: 'preferences',
        title: 'Study Preferences',
        subtitle: 'Customize your AI assistant',
    },
];

export default function OnboardingPage() {
    const router = useRouter();
    const { completeOnboarding, user } = useAuth();
    const [currentStep, setCurrentStep] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        university: '',
        major: '',
        year: '',
        courses: [],
        goals: [],
        studyPreferences: {
            preferredTime: 'afternoon',
            sessionLength: '45',
            aiProactivity: 'medium',
        },
    });

    const handleNext = () => {
        if (currentStep < ONBOARDING_STEPS.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            handleComplete();
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleComplete = async () => {
        setIsSubmitting(true);

        try {
            await completeOnboarding({
                university: formData.university,
                major: formData.major,
                year: formData.year,
                preferences: {
                    ...formData.studyPreferences,
                },
            });

            router.push('/');
        } catch (error) {
            console.error('Onboarding error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const updateFormData = (field, value) => {
        setFormData({ ...formData, [field]: value });
    };

    const renderStep = () => {
        switch (ONBOARDING_STEPS[currentStep].id) {
            case 'welcome':
                return <WelcomeStep user={user} />;
            case 'university':
                return <UniversityStep data={formData} update={updateFormData} />;
            case 'courses':
                return <CoursesStep data={formData} update={updateFormData} />;
            case 'goals':
                return <GoalsStep data={formData} update={updateFormData} />;
            case 'preferences':
                return <PreferencesStep data={formData} update={updateFormData} />;
            default:
                return null;
        }
    };

    return (
        <div className="onboarding-page">
            <div className="onboarding-container">
                {/* Progress Bar */}
                <div className="progress-bar">
                    {ONBOARDING_STEPS.map((step, index) => (
                        <div
                            key={step.id}
                            className={`progress-step ${index <= currentStep ? 'active' : ''} ${index < currentStep ? 'completed' : ''}`}
                        >
                            <div className="step-dot">
                                {index < currentStep ? <Check size={14} /> : index + 1}
                            </div>
                            <span className="step-label">{step.id}</span>
                        </div>
                    ))}
                </div>

                {/* Step Content */}
                <div className="step-content">
                    <div className="step-header">
                        <h1>{ONBOARDING_STEPS[currentStep].title}</h1>
                        <p>{ONBOARDING_STEPS[currentStep].subtitle}</p>
                    </div>

                    <div className="step-body">
                        {renderStep()}
                    </div>
                </div>

                {/* Navigation */}
                <div className="onboarding-nav">
                    <button
                        onClick={handleBack}
                        className="nav-btn back"
                        disabled={currentStep === 0}
                    >
                        <ChevronLeft size={20} />
                        Back
                    </button>

                    <button
                        onClick={handleNext}
                        className="nav-btn next"
                        disabled={isSubmitting}
                    >
                        {currentStep === ONBOARDING_STEPS.length - 1 ? (
                            isSubmitting ? 'Setting up...' : 'Get Started'
                        ) : (
                            'Continue'
                        )}
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>

            <style jsx>{`
        .onboarding-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: var(--space-6);
          background: linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-primary) 100%);
        }

        .onboarding-container {
          width: 100%;
          max-width: 640px;
          background: var(--bg-primary);
          border-radius: var(--radius-2xl);
          box-shadow: var(--shadow-xl);
          padding: var(--space-8);
        }

        .progress-bar {
          display: flex;
          justify-content: space-between;
          margin-bottom: var(--space-8);
          position: relative;
        }

        .progress-bar::before {
          content: '';
          position: absolute;
          top: 14px;
          left: 28px;
          right: 28px;
          height: 2px;
          background: var(--border-light);
        }

        .progress-step {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--space-2);
          position: relative;
          z-index: 1;
        }

        .step-dot {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: 600;
          background: var(--bg-secondary);
          border: 2px solid var(--border-light);
          color: var(--text-tertiary);
          transition: all var(--duration-fast) var(--ease-out);
        }

        .progress-step.active .step-dot {
          border-color: var(--accent-primary);
          color: var(--accent-primary);
        }

        .progress-step.completed .step-dot {
          background: var(--accent-primary);
          border-color: var(--accent-primary);
          color: white;
        }

        .step-label {
          font-size: 0.6875rem;
          text-transform: capitalize;
          color: var(--text-tertiary);
        }

        .progress-step.active .step-label {
          color: var(--accent-primary);
          font-weight: 500;
        }

        .step-content {
          min-height: 320px;
        }

        .step-header {
          text-align: center;
          margin-bottom: var(--space-8);
        }

        .step-header h1 {
          font-size: 1.75rem;
          font-weight: 700;
          margin-bottom: var(--space-2);
        }

        .step-header p {
          color: var(--text-secondary);
        }

        .step-body {
          min-height: 200px;
        }

        .onboarding-nav {
          display: flex;
          justify-content: space-between;
          margin-top: var(--space-8);
          padding-top: var(--space-6);
          border-top: 1px solid var(--border-light);
        }

        .nav-btn {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          padding: var(--space-3) var(--space-5);
          border-radius: var(--radius-md);
          font-weight: 500;
          transition: all var(--duration-fast) var(--ease-out);
        }

        .nav-btn.back {
          color: var(--text-secondary);
        }

        .nav-btn.back:hover:not(:disabled) {
          background: var(--bg-hover);
        }

        .nav-btn.back:disabled {
          opacity: 0.4;
        }

        .nav-btn.next {
          background: var(--accent-primary);
          color: white;
        }

        .nav-btn.next:hover:not(:disabled) {
          background: #5558E8;
        }

        @media (max-width: 640px) {
          .onboarding-container {
            padding: var(--space-5);
          }

          .step-label {
            display: none;
          }
        }
      `}</style>
        </div>
    );
}

// Step Components
function WelcomeStep({ user }) {
    return (
        <div className="welcome-step">
            <div className="welcome-icon">
                <Sparkles size={48} />
            </div>
            <p className="welcome-text">
                Hi {user?.name?.split(' ')[0] || 'there'}! I'm your AI-powered academic companion.
                Let me help you stay organized, ace your exams, and maintain a healthy work-life balance.
            </p>
            <div className="welcome-features">
                <div className="feature">
                    <BookOpen size={20} />
                    <span>Smart course tracking</span>
                </div>
                <div className="feature">
                    <Target size={20} />
                    <span>Personalized study plans</span>
                </div>
                <div className="feature">
                    <Clock size={20} />
                    <span>Deadline reminders</span>
                </div>
            </div>

            <style jsx>{`
        .welcome-step {
          text-align: center;
        }

        .welcome-icon {
          width: 80px;
          height: 80px;
          margin: 0 auto var(--space-6);
          background: var(--accent-gradient);
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .welcome-text {
          font-size: 1.0625rem;
          color: var(--text-secondary);
          line-height: 1.7;
          max-width: 440px;
          margin: 0 auto var(--space-8);
        }

        .welcome-features {
          display: flex;
          justify-content: center;
          gap: var(--space-6);
        }

        .feature {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          color: var(--text-secondary);
          font-size: 0.875rem;
        }

        .feature :global(svg) {
          color: var(--accent-primary);
        }
      `}</style>
        </div>
    );
}

function UniversityStep({ data, update }) {
    const years = ['Freshman', 'Sophomore', 'Junior', 'Senior', 'Graduate'];

    return (
        <div className="university-step">
            <div className="form-group">
                <label>University/College</label>
                <input
                    type="text"
                    placeholder="e.g., State University"
                    value={data.university}
                    onChange={(e) => update('university', e.target.value)}
                />
            </div>

            <div className="form-group">
                <label>Major/Field of Study</label>
                <input
                    type="text"
                    placeholder="e.g., Computer Science"
                    value={data.major}
                    onChange={(e) => update('major', e.target.value)}
                />
            </div>

            <div className="form-group">
                <label>Year</label>
                <div className="year-options">
                    {years.map(year => (
                        <button
                            key={year}
                            type="button"
                            className={`year-btn ${data.year === year ? 'active' : ''}`}
                            onClick={() => update('year', year)}
                        >
                            {year}
                        </button>
                    ))}
                </div>
            </div>

            <style jsx>{`
        .university-step {
          display: flex;
          flex-direction: column;
          gap: var(--space-5);
        }

        .form-group label {
          display: block;
          font-size: 0.875rem;
          font-weight: 500;
          margin-bottom: var(--space-2);
        }

        .form-group input {
          width: 100%;
          padding: var(--space-3) var(--space-4);
          background: var(--bg-secondary);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-md);
          font-size: 0.9375rem;
        }

        .form-group input:focus {
          outline: none;
          border-color: var(--accent-primary);
          box-shadow: 0 0 0 3px var(--accent-light);
        }

        .year-options {
          display: flex;
          flex-wrap: wrap;
          gap: var(--space-2);
        }

        .year-btn {
          padding: var(--space-2) var(--space-4);
          background: var(--bg-secondary);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-full);
          font-size: 0.875rem;
          transition: all var(--duration-fast) var(--ease-out);
        }

        .year-btn:hover {
          border-color: var(--accent-primary);
        }

        .year-btn.active {
          background: var(--accent-primary);
          border-color: var(--accent-primary);
          color: white;
        }
      `}</style>
        </div>
    );
}

function CoursesStep({ data, update }) {
    const [newCourse, setNewCourse] = useState('');

    const addCourse = () => {
        if (newCourse.trim() && !data.courses.includes(newCourse.trim())) {
            update('courses', [...data.courses, newCourse.trim()]);
            setNewCourse('');
        }
    };

    const removeCourse = (course) => {
        update('courses', data.courses.filter(c => c !== course));
    };

    return (
        <div className="courses-step">
            <div className="form-group">
                <label>Add your current courses</label>
                <div className="course-input">
                    <input
                        type="text"
                        placeholder="e.g., CS301 - Algorithms"
                        value={newCourse}
                        onChange={(e) => setNewCourse(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addCourse()}
                    />
                    <button type="button" onClick={addCourse}>Add</button>
                </div>
            </div>

            <div className="courses-list">
                {data.courses.length === 0 ? (
                    <p className="empty-message">No courses added yet. You can also skip and add them later.</p>
                ) : (
                    data.courses.map((course, index) => (
                        <div key={index} className="course-tag">
                            <GraduationCap size={16} />
                            <span>{course}</span>
                            <button onClick={() => removeCourse(course)}>×</button>
                        </div>
                    ))
                )}
            </div>

            <style jsx>{`
        .courses-step {
          display: flex;
          flex-direction: column;
          gap: var(--space-5);
        }

        .form-group label {
          display: block;
          font-size: 0.875rem;
          font-weight: 500;
          margin-bottom: var(--space-2);
        }

        .course-input {
          display: flex;
          gap: var(--space-2);
        }

        .course-input input {
          flex: 1;
          padding: var(--space-3) var(--space-4);
          background: var(--bg-secondary);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-md);
          font-size: 0.9375rem;
        }

        .course-input button {
          padding: var(--space-3) var(--space-5);
          background: var(--accent-primary);
          color: white;
          border-radius: var(--radius-md);
          font-weight: 500;
        }

        .courses-list {
          display: flex;
          flex-wrap: wrap;
          gap: var(--space-2);
        }

        .empty-message {
          color: var(--text-tertiary);
          font-size: 0.875rem;
        }

        .course-tag {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          padding: var(--space-2) var(--space-3);
          background: var(--accent-light);
          color: var(--accent-primary);
          border-radius: var(--radius-full);
          font-size: 0.875rem;
        }

        .course-tag button {
          margin-left: var(--space-1);
          font-size: 1.125rem;
          line-height: 1;
        }
      `}</style>
        </div>
    );
}

function GoalsStep({ data, update }) {
    const goalOptions = [
        'Maintain a 4.0 GPA',
        'Improve time management',
        'Reduce academic stress',
        'Better work-life balance',
        'Ace upcoming exams',
        'Complete assignments early',
        'Study more consistently',
        'Learn new skills',
    ];

    const toggleGoal = (goal) => {
        if (data.goals.includes(goal)) {
            update('goals', data.goals.filter(g => g !== goal));
        } else {
            update('goals', [...data.goals, goal]);
        }
    };

    return (
        <div className="goals-step">
            <p className="instruction">Select all that apply</p>

            <div className="goals-grid">
                {goalOptions.map((goal) => (
                    <button
                        key={goal}
                        type="button"
                        className={`goal-btn ${data.goals.includes(goal) ? 'active' : ''}`}
                        onClick={() => toggleGoal(goal)}
                    >
                        <Target size={18} />
                        <span>{goal}</span>
                        {data.goals.includes(goal) && <Check size={16} className="check" />}
                    </button>
                ))}
            </div>

            <style jsx>{`
        .goals-step {
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
        }

        .instruction {
          color: var(--text-tertiary);
          font-size: 0.875rem;
        }

        .goals-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: var(--space-3);
        }

        .goal-btn {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          padding: var(--space-3) var(--space-4);
          background: var(--bg-secondary);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-md);
          font-size: 0.875rem;
          text-align: left;
          transition: all var(--duration-fast) var(--ease-out);
          position: relative;
        }

        .goal-btn:hover {
          border-color: var(--accent-primary);
        }

        .goal-btn.active {
          background: var(--accent-light);
          border-color: var(--accent-primary);
          color: var(--accent-primary);
        }

        .goal-btn span {
          flex: 1;
        }

        .goal-btn :global(.check) {
          color: var(--success);
        }

        @media (max-width: 480px) {
          .goals-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
        </div>
    );
}

function PreferencesStep({ data, update }) {
    const updatePreference = (key, value) => {
        update('studyPreferences', { ...data.studyPreferences, [key]: value });
    };

    return (
        <div className="preferences-step">
            <div className="preference-group">
                <label>When do you prefer to study?</label>
                <div className="options">
                    {['morning', 'afternoon', 'evening', 'night'].map(time => (
                        <button
                            key={time}
                            type="button"
                            className={`option-btn ${data.studyPreferences.preferredTime === time ? 'active' : ''}`}
                            onClick={() => updatePreference('preferredTime', time)}
                        >
                            {time.charAt(0).toUpperCase() + time.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            <div className="preference-group">
                <label>Ideal study session length</label>
                <div className="options">
                    {[
                        { value: '25', label: '25 min' },
                        { value: '45', label: '45 min' },
                        { value: '60', label: '1 hour' },
                        { value: '90', label: '1.5 hours' },
                    ].map(option => (
                        <button
                            key={option.value}
                            type="button"
                            className={`option-btn ${data.studyPreferences.sessionLength === option.value ? 'active' : ''}`}
                            onClick={() => updatePreference('sessionLength', option.value)}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="preference-group">
                <label>How proactive should your AI assistant be?</label>
                <div className="options">
                    {[
                        { value: 'low', label: 'Only when asked' },
                        { value: 'medium', label: 'Helpful nudges' },
                        { value: 'high', label: 'Very proactive' },
                    ].map(option => (
                        <button
                            key={option.value}
                            type="button"
                            className={`option-btn ${data.studyPreferences.aiProactivity === option.value ? 'active' : ''}`}
                            onClick={() => updatePreference('aiProactivity', option.value)}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            </div>

            <style jsx>{`
        .preferences-step {
          display: flex;
          flex-direction: column;
          gap: var(--space-6);
        }

        .preference-group label {
          display: block;
          font-size: 0.875rem;
          font-weight: 500;
          margin-bottom: var(--space-3);
        }

        .options {
          display: flex;
          flex-wrap: wrap;
          gap: var(--space-2);
        }

        .option-btn {
          padding: var(--space-2) var(--space-4);
          background: var(--bg-secondary);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-full);
          font-size: 0.875rem;
          transition: all var(--duration-fast) var(--ease-out);
        }

        .option-btn:hover {
          border-color: var(--accent-primary);
        }

        .option-btn.active {
          background: var(--accent-primary);
          border-color: var(--accent-primary);
          color: white;
        }
      `}</style>
        </div>
    );
}
