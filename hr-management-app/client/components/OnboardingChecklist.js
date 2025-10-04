// OnboardingChecklist Component - Interface to create/view onboarding tasks
const { useState, useEffect } = React;

function OnboardingChecklist({ employee, onSave, onCancel, isEdit = false }) {
    const [formData, setFormData] = useState({
        employeeId: '',
        employeeName: '',
        startDate: '',
        completionDate: '',
        tasks: [
            {
                id: 1,
                title: 'Account Setup',
                description: 'Create email account, system access, and user profiles',
                category: 'IT Setup',
                dueDate: '',
                completed: false,
                completedDate: '',
                assignedTo: '',
                notes: ''
            },
            {
                id: 2,
                title: 'Orientation Meeting',
                description: 'Welcome meeting with HR and team introduction',
                category: 'Orientation',
                dueDate: '',
                completed: false,
                completedDate: '',
                assignedTo: '',
                notes: ''
            },
            {
                id: 3,
                title: 'Company Policies Review',
                description: 'Review employee handbook and company policies',
                category: 'Documentation',
                dueDate: '',
                completed: false,
                completedDate: '',
                assignedTo: '',
                notes: ''
            },
            {
                id: 4,
                title: 'Equipment Setup',
                description: 'Laptop, phone, desk setup and equipment training',
                category: 'IT Setup',
                dueDate: '',
                completed: false,
                completedDate: '',
                assignedTo: '',
                notes: ''
            },
            {
                id: 5,
                title: 'Security Training',
                description: 'Cybersecurity awareness and data protection training',
                category: 'Training',
                dueDate: '',
                completed: false,
                completedDate: '',
                assignedTo: '',
                notes: ''
            },
            {
                id: 6,
                title: 'Benefits Enrollment',
                description: 'Health insurance, 401k, and other benefits enrollment',
                category: 'HR',
                dueDate: '',
                completed: false,
                completedDate: '',
                assignedTo: '',
                notes: ''
            }
        ]
    });

    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');

    // Task categories
    const categories = ['IT Setup', 'Orientation', 'Documentation', 'Training', 'HR', 'Other'];

    // Load onboarding data if editing
    useEffect(() => {
        if (employee && isEdit) {
            setFormData(prev => ({
                ...prev,
                employeeId: employee.id || '',
                employeeName: employee.name || '',
                startDate: employee.startDate || '',
                completionDate: employee.completionDate || '',
                tasks: employee.tasks || prev.tasks
            }));
        }
    }, [employee, isEdit]);

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle task changes
    const handleTaskChange = (taskId, field, value) => {
        setFormData(prev => ({
            ...prev,
            tasks: prev.tasks.map(task =>
                task.id === taskId
                    ? { ...task, [field]: value }
                    : task
            )
        }));
    };

    // Add new task
    const addNewTask = () => {
        const newTask = {
            id: Date.now(),
            title: '',
            description: '',
            category: 'Other',
            dueDate: '',
            completed: false,
            completedDate: '',
            assignedTo: '',
            notes: ''
        };

        setFormData(prev => ({
            ...prev,
            tasks: [...prev.tasks, newTask]
        }));
    };

    // Remove task
    const removeTask = (taskId) => {
        if (window.confirm('Are you sure you want to remove this task?')) {
            setFormData(prev => ({
                ...prev,
                tasks: prev.tasks.filter(task => task.id !== taskId)
            }));
        }
    };

    // Calculate completion percentage
    const completionPercentage = () => {
        const completedTasks = formData.tasks.filter(task => task.completed).length;
        return Math.round((completedTasks / formData.tasks.length) * 100);
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            // Mock API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // In a real app, this would be an API call
            console.log('Saving onboarding checklist:', formData);
            
            // Call parent callback
            onSave(formData);
        } catch (error) {
            console.error('Error saving onboarding checklist:', error);
            alert('Failed to save onboarding checklist. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Task component
    const TaskItem = ({ task, isEditable = true }) => (
        <div className={`border rounded-lg p-4 ${task.completed ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'}`}>
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <div className="flex items-center space-x-3">
                        <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={(e) => handleTaskChange(task.id, 'completed', e.target.checked)}
                            disabled={!isEditable}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <div className="flex-1">
                            <h4 className={`text-sm font-medium ${task.completed ? 'text-green-800 line-through' : 'text-gray-900'}`}>
                                {task.title}
                            </h4>
                            <p className={`text-sm ${task.completed ? 'text-green-600' : 'text-gray-600'}`}>
                                {task.description}
                            </p>
                        </div>
                    </div>
                    
                    <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                Category
                            </label>
                            {isEditable ? (
                                <select
                                    value={task.category}
                                    onChange={(e) => handleTaskChange(task.id, 'category', e.target.value)}
                                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                >
                                    {categories.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            ) : (
                                <span className="text-xs text-gray-600">{task.category}</span>
                            )}
                        </div>
                        
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                Due Date
                            </label>
                            {isEditable ? (
                                <input
                                    type="date"
                                    value={task.dueDate}
                                    onChange={(e) => handleTaskChange(task.id, 'dueDate', e.target.value)}
                                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                />
                            ) : (
                                <span className="text-xs text-gray-600">{task.dueDate || 'Not set'}</span>
                            )}
                        </div>
                        
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                Assigned To
                            </label>
                            {isEditable ? (
                                <input
                                    type="text"
                                    value={task.assignedTo}
                                    onChange={(e) => handleTaskChange(task.id, 'assignedTo', e.target.value)}
                                    placeholder="Team member name"
                                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                />
                            ) : (
                                <span className="text-xs text-gray-600">{task.assignedTo || 'Unassigned'}</span>
                            )}
                        </div>
                        
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                Completed Date
                            </label>
                            {task.completed ? (
                                <input
                                    type="date"
                                    value={task.completedDate}
                                    onChange={(e) => handleTaskChange(task.id, 'completedDate', e.target.value)}
                                    disabled={!isEditable}
                                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:bg-gray-100"
                                />
                            ) : (
                                <span className="text-xs text-gray-400">Not completed</span>
                            )}
                        </div>
                    </div>
                    
                    <div className="mt-3">
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                            Notes
                        </label>
                        {isEditable ? (
                            <textarea
                                value={task.notes}
                                onChange={(e) => handleTaskChange(task.id, 'notes', e.target.value)}
                                rows="2"
                                placeholder="Additional notes..."
                                className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            />
                        ) : (
                            <p className="text-xs text-gray-600">{task.notes || 'No notes'}</p>
                        )}
                    </div>
                </div>
                
                {isEditable && (
                    <button
                        onClick={() => removeTask(task.id)}
                        className="ml-4 text-red-400 hover:text-red-600 transition-colors duration-200"
                        title="Remove task"
                    >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                )}
            </div>
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto fade-in">
            <div className="bg-white shadow-lg rounded-lg p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">
                        {isEdit ? 'Edit Onboarding Checklist' : 'Create Onboarding Checklist'}
                    </h2>
                    <button
                        onClick={onCancel}
                        className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    >
                        <span className="text-2xl">×</span>
                    </button>
                </div>

                {/* Employee Information */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Employee ID
                            </label>
                            <input
                                type="text"
                                name="employeeId"
                                value={formData.employeeId}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="Employee ID"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Employee Name
                            </label>
                            <input
                                type="text"
                                name="employeeName"
                                value={formData.employeeName}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="Employee name"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Start Date
                            </label>
                            <input
                                type="date"
                                name="startDate"
                                value={formData.startDate}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                    </div>
                </div>

                {/* Progress Overview */}
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium text-gray-900">Progress Overview</h3>
                        <div className="text-right">
                            <div className="text-2xl font-bold text-indigo-600">
                                {completionPercentage()}%
                            </div>
                            <div className="text-sm text-gray-500">
                                {formData.tasks.filter(t => t.completed).length} of {formData.tasks.length} tasks completed
                            </div>
                        </div>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${completionPercentage()}%` }}
                        ></div>
                    </div>
                </div>

                {/* Tasks by Category */}
                <div className="space-y-6">
                    {categories.map(category => {
                        const categoryTasks = formData.tasks.filter(task => task.category === category);
                        if (categoryTasks.length === 0) return null;
                        
                        const completedCount = categoryTasks.filter(task => task.completed).length;
                        const categoryPercentage = categoryTasks.length > 0 ? Math.round((completedCount / categoryTasks.length) * 100) : 0;
                        
                        return (
                            <div key={category} className="border border-gray-200 rounded-lg p-4">
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="text-md font-medium text-gray-900">{category}</h4>
                                    <div className="text-sm text-gray-500">
                                        {completedCount}/{categoryTasks.length} completed ({categoryPercentage}%)
                                    </div>
                                </div>
                                
                                <div className="space-y-3">
                                    {categoryTasks.map(task => (
                                        <TaskItem key={task.id} task={task} />
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Add New Task */}
                <div className="mt-6">
                    <button
                        onClick={addNewTask}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
                    >
                        <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add New Task
                    </button>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 btn-hover transition-all duration-200"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="px-6 py-2 border border-transparent rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed btn-hover transition-all duration-200"
                    >
                        {loading ? (
                            <span className="flex items-center">
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Saving...
                            </span>
                        ) : (
                            isEdit ? 'Update Checklist' : 'Create Checklist'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
