// EmployeeDashboard Component - Admin view to list employees, search/filter, and manage profiles
const { useState, useEffect, useCallback, useMemo } = React;

function EmployeeDashboard({ user, onNavigate }) {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState(null);
    const [error, setError] = useState(null);

    // Mock employee data
    const mockEmployees = [
        {
            id: 1,
            fullName: 'John Smith',
            age: 28,
            email: 'john.smith@company.com',
            phone: '+1 (555) 123-4567',
            address: '123 Main St, New York, NY 10001',
            department: 'Engineering',
            position: 'Software Engineer',
            contractType: 'full-time',
            contractStartDate: '2023-01-15',
            contractEndDate: '',
            salary: 75000,
            status: 'active',
            profilePicture: null,
            workHistory: '3 years experience in full-stack development with React and Node.js'
        },
        {
            id: 2,
            fullName: 'Sarah Johnson',
            age: 32,
            email: 'sarah.johnson@company.com',
            phone: '+1 (555) 234-5678',
            address: '456 Oak Ave, San Francisco, CA 94102',
            department: 'Marketing',
            position: 'Marketing Manager',
            contractType: 'full-time',
            contractStartDate: '2022-08-20',
            contractEndDate: '',
            salary: 68000,
            status: 'active',
            profilePicture: null,
            workHistory: '5 years in digital marketing with expertise in social media and content strategy'
        },
        {
            id: 3,
            fullName: 'Mike Chen',
            age: 26,
            email: 'mike.chen@company.com',
            phone: '+1 (555) 345-6789',
            address: '789 Pine St, Seattle, WA 98101',
            department: 'Engineering',
            position: 'Frontend Developer',
            contractType: 'full-time',
            contractStartDate: '2023-03-10',
            contractEndDate: '',
            salary: 65000,
            status: 'active',
            profilePicture: null,
            workHistory: '2 years experience in React, Vue.js, and modern CSS frameworks'
        },
        {
            id: 4,
            fullName: 'Emily Davis',
            age: 30,
            email: 'emily.davis@company.com',
            phone: '+1 (555) 456-7890',
            address: '321 Elm St, Austin, TX 73301',
            department: 'Human Resources',
            position: 'HR Specialist',
            contractType: 'full-time',
            contractStartDate: '2022-11-05',
            contractEndDate: '',
            salary: 55000,
            status: 'active',
            profilePicture: null,
            workHistory: '4 years in HR with focus on recruitment and employee relations'
        },
        {
            id: 5,
            fullName: 'David Wilson',
            age: 35,
            email: 'david.wilson@company.com',
            phone: '+1 (555) 567-8901',
            address: '654 Maple Dr, Boston, MA 02101',
            department: 'Finance',
            position: 'Financial Analyst',
            contractType: 'contract',
            contractStartDate: '2023-06-01',
            contractEndDate: '2024-05-31',
            salary: 72000,
            status: 'active',
            profilePicture: null,
            workHistory: '7 years in financial analysis and reporting'
        }
    ];

    // Load employees on component mount
    useEffect(() => {
        loadEmployees();
    }, []);

    // Mock API call to load employees
    const loadEmployees = async () => {
        try {
            setLoading(true);
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            setEmployees(mockEmployees);
        } catch (error) {
            setError('Failed to load employees');
            console.error('Error loading employees:', error);
        } finally {
            setLoading(false);
        }
    };

    // Handle add new employee
    const handleAddEmployee = () => {
        setEditingEmployee(null);
        setShowForm(true);
    };

    // Handle edit employee
    const handleEditEmployee = (employee) => {
        setEditingEmployee(employee);
        setShowForm(true);
    };

    // Handle save employee
    const handleSaveEmployee = useCallback(async (employeeData) => {
        try {
            if (editingEmployee) {
                // Update existing employee
                const updatedEmployees = employees.map(emp =>
                    emp.id === editingEmployee.id
                        ? { ...emp, ...employeeData, id: editingEmployee.id }
                        : emp
                );
                setEmployees(updatedEmployees);
            } else {
                // Add new employee
                const newEmployee = {
                    ...employeeData,
                    id: Math.max(...employees.map(e => e.id)) + 1
                };
                setEmployees([...employees, newEmployee]);
            }
            
            setShowForm(false);
            setEditingEmployee(null);
        } catch (error) {
            console.error('Error saving employee:', error);
            alert('Failed to save employee');
        }
    }, [employees, editingEmployee]);

    // Handle delete employee
    const handleDeleteEmployee = async (employeeId) => {
        try {
            setEmployees(employees.filter(emp => emp.id !== employeeId));
        } catch (error) {
            console.error('Error deleting employee:', error);
            alert('Failed to delete employee');
        }
    };

    // Handle view employee details
    const handleViewEmployee = (employee) => {
        // In a real app, this would navigate to a detailed view
        alert(`Viewing details for ${employee.fullName}`);
    };

    // Handle cancel form
    const handleCancelForm = useCallback(() => {
        setShowForm(false);
        setEditingEmployee(null);
    }, []);

    // Statistics calculation - memoized to prevent unnecessary re-renders
    const stats = useMemo(() => ({
        total: employees.length,
        active: employees.filter(emp => emp.status === 'active').length,
        departments: [...new Set(employees.map(emp => emp.department))].length,
        averageAge: employees.length > 0 ? Math.round(employees.reduce((sum, emp) => sum + emp.age, 0) / employees.length) : 0
    }), [employees]);

    // If showing form, render the form component
    if (showForm) {
        return (
            <EmployeeForm
                employee={editingEmployee}
                onSave={handleSaveEmployee}
                onCancel={handleCancelForm}
                isEdit={!!editingEmployee}
            />
        );
    }

    return (
        <div className="space-y-6 fade-in">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Employee Dashboard</h1>
                    <p className="mt-2 text-gray-600">Manage your team members and their information</p>
                </div>
                <div className="mt-4 lg:mt-0">
                    <button
                        onClick={handleAddEmployee}
                        className="btn-modern inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 shadow-lg"
                    >
                        <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add Employee
                    </button>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="stats-card card-hover">
                    <div className="p-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                                        <span className="text-white text-lg">👥</span>
                                    </div>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Total Employees</p>
                                    <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-green-500 text-sm font-medium">+12%</div>
                                <div className="text-xs text-gray-500">vs last month</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="stats-card card-hover">
                    <div className="p-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                                        <span className="text-white text-lg">✅</span>
                                    </div>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Active Employees</p>
                                    <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-green-500 text-sm font-medium">98.5%</div>
                                <div className="text-xs text-gray-500">attendance rate</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="stats-card card-hover">
                    <div className="p-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                                        <span className="text-white text-lg">🏢</span>
                                    </div>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Departments</p>
                                    <p className="text-2xl font-bold text-gray-900">{stats.departments}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-blue-500 text-sm font-medium">8</div>
                                <div className="text-xs text-gray-500">active teams</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="stats-card card-hover">
                    <div className="p-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                                        <span className="text-white text-lg">📊</span>
                                    </div>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Average Age</p>
                                    <p className="text-2xl font-bold text-gray-900">{stats.averageAge}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-yellow-500 text-sm font-medium">Young</div>
                                <div className="text-xs text-gray-500">workforce</div>
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

            {/* Employee Table */}
            <EmployeeTable
                employees={employees}
                onEdit={handleEditEmployee}
                onDelete={handleDeleteEmployee}
                onView={handleViewEmployee}
                loading={loading}
            />

            {/* Quick Actions */}
            <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <button
                        onClick={handleAddEmployee}
                        className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 btn-hover transition-all duration-200"
                    >
                        <span className="mr-2">➕</span>
                        Add Employee
                    </button>
                    
                    <button
                        onClick={() => window.print()}
                        className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 btn-hover transition-all duration-200"
                    >
                        <span className="mr-2">🖨️</span>
                        Print Report
                    </button>
                    
                    <button
                        onClick={() => alert('Export functionality would be implemented here')}
                        className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 btn-hover transition-all duration-200"
                    >
                        <span className="mr-2">📊</span>
                        Export Data
                    </button>
                    
                    <button
                        onClick={() => loadEmployees()}
                        className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 btn-hover transition-all duration-200"
                    >
                        <span className="mr-2">🔄</span>
                        Refresh Data
                    </button>
                </div>
            </div>
        </div>
    );
}
