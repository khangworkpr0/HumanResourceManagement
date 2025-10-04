// OnboardingPage Component - Admin view to assign/track onboarding tasks
const { useState, useEffect, useMemo } = React;

function OnboardingPage({ user, onNavigate }) {
    const [onboardingLists, setOnboardingLists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingOnboarding, setEditingOnboarding] = useState(null);
    const [error, setError] = useState(null);

    // Mock onboarding data
    const mockOnboardingLists = [
        {
            id: 1,
            employeeId: 'EMP001',
            employeeName: 'John Smith',
            startDate: '2024-01-15',
            completionDate: '',
            tasks: [
                {
                    id: 1,
                    title: 'Account Setup',
                    description: 'Create email account, system access, and user profiles',
                    category: 'IT Setup',
                    dueDate: '2024-01-16',
                    completed: true,
                    completedDate: '2024-01-15',
                    assignedTo: 'IT Team',
                    notes: 'All accounts created successfully'
                },
                {
                    id: 2,
                    title: 'Orientation Meeting',
                    description: 'Welcome meeting with HR and team introduction',
                    category: 'Orientation',
                    dueDate: '2024-01-17',
                    completed: true,
                    completedDate: '2024-01-16',
                    assignedTo: 'HR Team',
                    notes: 'Great introduction, team welcomed John warmly'
                },
                {
                    id: 3,
                    title: 'Company Policies Review',
                    description: 'Review employee handbook and company policies',
                    category: 'Documentation',
                    dueDate: '2024-01-18',
                    completed: false,
                    completedDate: '',
                    assignedTo: 'HR Team',
                    notes: ''
                },
                {
                    id: 4,
                    title: 'Equipment Setup',
                    description: 'Laptop, phone, desk setup and equipment training',
                    category: 'IT Setup',
                    dueDate: '2024-01-16',
                    completed: true,
                    completedDate: '2024-01-15',
                    assignedTo: 'IT Team',
                    notes: 'Laptop configured, phone activated'
                }
            ]
        },
        {
            id: 2,
            employeeId: 'EMP002',
            employeeName: 'Sarah Johnson',
            startDate: '2024-01-20',
            completionDate: '',
            tasks: [
                {
                    id: 1,
                    title: 'Account Setup',
                    description: 'Create email account, system access, and user profiles',
                    category: 'IT Setup',
                    dueDate: '2024-01-21',
                    completed: true,
                    completedDate: '2024-01-20',
                    assignedTo: 'IT Team',
                    notes: 'Accounts created'
                },
                {
                    id: 2,
                    title: 'Orientation Meeting',
                    description: 'Welcome meeting with HR and team introduction',
                    category: 'Orientation',
                    dueDate: '2024-01-22',
                    completed: false,
                    completedDate: '',
                    assignedTo: 'HR Team',
                    notes: ''
                },
                {
                    id: 3,
                    title: 'Security Training',
                    description: 'Cybersecurity awareness and data protection training',
                    category: 'Training',
                    dueDate: '2024-01-25',
                    completed: false,
                    completedDate: '',
                    assignedTo: 'Security Team',
                    notes: ''
                }
            ]
        },
        {
            id: 3,
            employeeId: 'EMP003',
            employeeName: 'Mike Chen',
            startDate: '2024-01-10',
            completionDate: '2024-01-25',
            tasks: [
                {
                    id: 1,
                    title: 'Account Setup',
                    description: 'Create email account, system access, and user profiles',
                    category: 'IT Setup',
                    dueDate: '2024-01-11',
                    completed: true,
                    completedDate: '2024-01-10',
                    assignedTo: 'IT Team',
                    notes: 'All systems configured'
                },
                {
                    id: 2,
                    title: 'Orientation Meeting',
                    description: 'Welcome meeting with HR and team introduction',
                    category: 'Orientation',
                    dueDate: '2024-01-12',
                    completed: true,
                    completedDate: '2024-01-11',
                    assignedTo: 'HR Team',
                    notes: 'Excellent onboarding session'
                },
                {
                    id: 3,
                    title: 'Company Policies Review',
                    description: 'Review employee handbook and company policies',
                    category: 'Documentation',
                    dueDate: '2024-01-15',
                    completed: true,
                    completedDate: '2024-01-14',
                    assignedTo: 'HR Team',
                    notes: 'Policies reviewed and acknowledged'
                },
                {
                    id: 4,
                    title: 'Equipment Setup',
                    description: 'Laptop, phone, desk setup and equipment training',
                    category: 'IT Setup',
                    dueDate: '2024-01-11',
                    completed: true,
                    completedDate: '2024-01-10',
                    assignedTo: 'IT Team',
                    notes: 'Equipment ready'
                },
                {
                    id: 5,
                    title: 'Security Training',
                    description: 'Cybersecurity awareness and data protection training',
                    category: 'Training',
                    dueDate: '2024-01-18',
                    completed: true,
                    completedDate: '2024-01-17',
                    assignedTo: 'Security Team',
                    notes: 'Training completed successfully'
                },
                {
                    id: 6,
                    title: 'Benefits Enrollment',
                    description: 'Health insurance, 401k, and other benefits enrollment',
                    category: 'HR',
                    dueDate: '2024-01-20',
                    completed: true,
                    completedDate: '2024-01-19',
                    assignedTo: 'HR Team',
                    notes: 'All benefits enrolled'
                }
            ]
        }
    ];

    // Load onboarding lists on component mount
    useEffect(() => {
        loadOnboardingLists();
    }, []);

    // Mock API call to load onboarding lists
    const loadOnboardingLists = async () => {
        try {
            setLoading(true);
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            setOnboardingLists(mockOnboardingLists);
        } catch (error) {
            setError('Failed to load onboarding lists');
            console.error('Error loading onboarding lists:', error);
        } finally {
            setLoading(false);
        }
    };

    // Handle create new onboarding
    const handleCreateOnboarding = () => {
        setEditingOnboarding(null);
        setShowForm(true);
    };

    // Handle edit onboarding
    const handleEditOnboarding = (onboarding) => {
        setEditingOnboarding(onboarding);
        setShowForm(true);
    };

    // Handle save onboarding
    const handleSaveOnboarding = async (onboardingData) => {
        try {
            if (editingOnboarding) {
                // Update existing onboarding
                const updatedLists = onboardingLists.map(list =>
                    list.id === editingOnboarding.id
                        ? { ...list, ...onboardingData, id: editingOnboarding.id }
                        : list
                );
                setOnboardingLists(updatedLists);
            } else {
                // Add new onboarding
                const newOnboarding = {
                    ...onboardingData,
                    id: Math.max(...onboardingLists.map(o => o.id)) + 1
                };
                setOnboardingLists([newOnboarding, ...onboardingLists]);
            }
            
            setShowForm(false);
            setEditingOnboarding(null);
        } catch (error) {
            console.error('Error saving onboarding:', error);
            alert('Failed to save onboarding checklist');
        }
    };

    // Handle delete onboarding
    const handleDeleteOnboarding = async (onboardingId) => {
        try {
            setOnboardingLists(onboardingLists.filter(list => list.id !== onboardingId));
        } catch (error) {
            console.error('Error deleting onboarding:', error);
            alert('Failed to delete onboarding checklist');
        }
    };

    // Handle cancel form
    const handleCancelForm = () => {
        setShowForm(false);
        setEditingOnboarding(null);
    };

    // Calculate completion percentage for an onboarding list
    const calculateCompletionPercentage = (tasks) => {
        if (tasks.length === 0) return 0;
        const completedTasks = tasks.filter(task => task.completed).length;
        return Math.round((completedTasks / tasks.length) * 100);
    };

    // Get status based on completion
    const getOnboardingStatus = (onboarding) => {
        const percentage = calculateCompletionPercentage(onboarding.tasks);
        if (percentage === 100) return { status: 'completed', color: 'green' };
        if (percentage > 0) return { status: 'in-progress', color: 'yellow' };
        return { status: 'not-started', color: 'gray' };
    };

    // Statistics calculation - memoized to prevent unnecessary re-renders
    const stats = useMemo(() => ({
        total: onboardingLists.length,
        completed: onboardingLists.filter(list => calculateCompletionPercentage(list.tasks) === 100).length,
        inProgress: onboardingLists.filter(list => {
            const percentage = calculateCompletionPercentage(list.tasks);
            return percentage > 0 && percentage < 100;
        }).length,
        notStarted: onboardingLists.filter(list => calculateCompletionPercentage(list.tasks) === 0).length
    }), [onboardingLists]);

    // Status badge component
    const StatusBadge = ({ status, color }) => {
        const colorClasses = {
            green: 'bg-green-100 text-green-800',
            yellow: 'bg-yellow-100 text-yellow-800',
            gray: 'bg-gray-100 text-gray-800'
        };

        const statusLabels = {
            completed: 'Completed',
            'in-progress': 'In Progress',
            'not-started': 'Not Started'
        };

        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClasses[color]}`}>
                {statusLabels[status]}
            </span>
        );
    };

    // If showing form, render the form component
    if (showForm) {
        return (
            <OnboardingChecklist
                employee={editingOnboarding}
                onSave={handleSaveOnboarding}
                onCancel={handleCancelForm}
                isEdit={!!editingOnboarding}
            />
        );
    }

    return (
        <div className="space-y-6 fade-in">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <h1 className="text-4xl font-bold gradient-text">Onboarding Management</h1>
                    <p className="mt-2 text-gray-600 text-lg">Track and manage employee onboarding processes</p>
                </div>
                <div className="mt-4 lg:mt-0">
                    <button
                        onClick={handleCreateOnboarding}
                        className="btn-modern inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 shadow-lg"
                    >
                        <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Create Onboarding
                    </button>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                                    <span className="text-white text-sm font-medium">📋</span>
                                </div>
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">Total Onboarding</dt>
                                    <dd className="text-lg font-medium text-gray-900">{stats.total}</dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                                    <span className="text-white text-sm font-medium">✅</span>
                                </div>
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">Completed</dt>
                                    <dd className="text-lg font-medium text-gray-900">{stats.completed}</dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                                    <span className="text-white text-sm font-medium">⏳</span>
                                </div>
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">In Progress</dt>
                                    <dd className="text-lg font-medium text-gray-900">{stats.inProgress}</dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-gray-500 rounded-md flex items-center justify-center">
                                    <span className="text-white text-sm font-medium">📝</span>
                                </div>
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">Not Started</dt>
                                    <dd className="text-lg font-medium text-gray-900">{stats.notStarted}</dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-red-800">Error</h3>
                            <div className="mt-2 text-sm text-red-700">{error}</div>
                        </div>
                    </div>
                </div>
            )}

            {/* Onboarding Lists */}
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">
                        Onboarding Checklists ({onboardingLists.length})
                    </h3>
                </div>

                {loading ? (
                    <div className="p-6">
                        <div className="animate-pulse space-y-4">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="h-32 bg-gray-200 rounded"></div>
                            ))}
                        </div>
                    </div>
                ) : onboardingLists.length === 0 ? (
                    <div className="p-12 text-center">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No onboarding checklists</h3>
                        <p className="mt-1 text-sm text-gray-500">Get started by creating a new onboarding checklist.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-200">
                        {onboardingLists.map((onboarding) => {
                            const percentage = calculateCompletionPercentage(onboarding.tasks);
                            const statusInfo = getOnboardingStatus(onboarding);
                            
                            return (
                                <div key={onboarding.id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-4">
                                                <div className="flex-shrink-0">
                                                    <div className="h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center">
                                                        <span className="text-lg font-medium text-indigo-600">
                                                            {onboarding.employeeName.charAt(0).toUpperCase()}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center space-x-2">
                                                        <h4 className="text-lg font-medium text-gray-900">
                                                            {onboarding.employeeName}
                                                        </h4>
                                                        <StatusBadge status={statusInfo.status} color={statusInfo.color} />
                                                    </div>
                                                    <p className="text-sm text-gray-600">ID: {onboarding.employeeId}</p>
                                                    <p className="text-sm text-gray-500">
                                                        Start Date: {new Date(onboarding.startDate).toLocaleDateString()}
                                                    </p>
                                                    {onboarding.completionDate && (
                                                        <p className="text-sm text-green-600">
                                                            Completed: {new Date(onboarding.completionDate).toLocaleDateString()}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            
                                            {/* Progress Bar */}
                                            <div className="mt-4">
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="text-gray-600">Progress</span>
                                                    <span className="font-medium text-gray-900">{percentage}%</span>
                                                </div>
                                                <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                                                    <div
                                                        className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                                                        style={{ width: `${percentage}%` }}
                                                    ></div>
                                                </div>
                                                <p className="mt-1 text-xs text-gray-500">
                                                    {onboarding.tasks.filter(t => t.completed).length} of {onboarding.tasks.length} tasks completed
                                                </p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() => handleEditOnboarding(onboarding)}
                                                className="text-blue-600 hover:text-blue-900 text-sm font-medium transition-colors duration-200"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => {
                                                    if (window.confirm(`Are you sure you want to delete the onboarding checklist for ${onboarding.employeeName}?`)) {
                                                        handleDeleteOnboarding(onboarding.id);
                                                    }
                                                }}
                                                className="text-red-600 hover:text-red-900 text-sm font-medium transition-colors duration-200"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                    
                                    {/* Recent Tasks */}
                                    <div className="mt-4">
                                        <h5 className="text-sm font-medium text-gray-700 mb-2">Recent Tasks:</h5>
                                        <div className="space-y-1">
                                            {onboarding.tasks.slice(0, 3).map((task) => (
                                                <div key={task.id} className="flex items-center space-x-2 text-xs">
                                                    <span className={task.completed ? 'text-green-500' : 'text-gray-400'}>
                                                        {task.completed ? '✓' : '○'}
                                                    </span>
                                                    <span className={task.completed ? 'text-gray-500 line-through' : 'text-gray-700'}>
                                                        {task.title}
                                                    </span>
                                                    <span className="text-gray-400">({task.category})</span>
                                                </div>
                                            ))}
                                            {onboarding.tasks.length > 3 && (
                                                <p className="text-xs text-gray-500">
                                                    +{onboarding.tasks.length - 3} more tasks
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
