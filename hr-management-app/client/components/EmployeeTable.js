// EmployeeTable Component - Paginated table to display employee list with search and filters
const { useState, useEffect, useMemo, useCallback } = React;

function EmployeeTable({ employees, onEdit, onDelete, onView, loading = false }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [departmentFilter, setDepartmentFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [sortField, setSortField] = useState('fullName');
    const [sortDirection, setSortDirection] = useState('asc');
    const itemsPerPage = 10;

    // Department options
    const departments = [
        'Human Resources',
        'Engineering',
        'Marketing',
        'Sales',
        'Finance',
        'Operations',
        'Customer Support',
        'Product Management'
    ];

    // Filtered and sorted employees
    const filteredEmployees = useMemo(() => {
        let filtered = employees.filter(employee => {
            const matchesSearch = employee.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                employee.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                employee.position?.toLowerCase().includes(searchTerm.toLowerCase());
            
            const matchesDepartment = !departmentFilter || employee.department === departmentFilter;
            const matchesStatus = !statusFilter || employee.status === statusFilter;
            
            return matchesSearch && matchesDepartment && matchesStatus;
        });

        // Sort employees
        filtered.sort((a, b) => {
            const aValue = a[sortField] || '';
            const bValue = b[sortField] || '';
            
            if (sortDirection === 'asc') {
                return aValue.toString().localeCompare(bValue.toString());
            } else {
                return bValue.toString().localeCompare(aValue.toString());
            }
        });

        return filtered;
    }, [employees, searchTerm, departmentFilter, statusFilter, sortField, sortDirection]);

    // Pagination
    const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentEmployees = filteredEmployees.slice(startIndex, endIndex);

    // Handle sort
    const handleSort = (field) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    // Reset pagination when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, departmentFilter, statusFilter]);

    // Sort icon component - memoized to prevent re-renders
    const SortIcon = useCallback(({ field }) => {
        if (sortField !== field) {
            return <span className="text-gray-400">⇅</span>;
        }
        return sortDirection === 'asc' ? <span className="text-indigo-600">↑</span> : <span className="text-indigo-600">↓</span>;
    }, [sortField, sortDirection]);

    // Status badge component - memoized to prevent re-renders
    const StatusBadge = useCallback(({ status }) => {
        const baseClasses = "status-badge inline-flex items-center px-3 py-1.5 text-xs font-medium";
        const statusClasses = status === 'active' 
            ? `${baseClasses} bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200`
            : `${baseClasses} bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border border-red-200`;
        
        return (
            <span className={statusClasses}>
                <span className={`w-2 h-2 rounded-full mr-2 ${
                    status === 'active' ? 'bg-green-500 shadow-sm' : 'bg-red-500 shadow-sm'
                }`}></span>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    }, []);

    if (loading) {
        return (
            <div className="bg-white shadow-lg rounded-lg p-6">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
                    <div className="space-y-3">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="h-12 bg-gray-200 rounded"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="glass-card-white overflow-hidden fade-in">
            {/* Header with Search and Filters */}
            <div className="p-6 border-b border-gray-200">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                    <div>
                        <h2 className="text-2xl font-bold gradient-text">
                            Employees ({filteredEmployees.length})
                        </h2>
                        <p className="text-sm text-gray-600 mt-1">Manage your team members efficiently</p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                        {/* Search */}
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search employees..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="form-input-modern w-full sm:w-64 pl-10 pr-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none"
                            />
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        </div>

                        {/* Department Filter */}
                        <select
                            value={departmentFilter}
                            onChange={(e) => setDepartmentFilter(e.target.value)}
                            className="form-input-modern px-4 py-3 text-gray-900 focus:outline-none"
                        >
                            <option value="">All Departments</option>
                            {departments.map(dept => (
                                <option key={dept} value={dept}>{dept}</option>
                            ))}
                        </select>

                        {/* Status Filter */}
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="form-input-modern px-4 py-3 text-gray-900 focus:outline-none"
                        >
                            <option value="">All Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto scrollbar-modern">
                <table className="table-modern min-w-full divide-y divide-gray-200">
                    <thead>
                        <tr>
                            <th
                                className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider cursor-pointer transition-colors duration-200"
                                onClick={() => handleSort('fullName')}
                            >
                                <div className="flex items-center space-x-1">
                                    <span>Name</span>
                                    <SortIcon field="fullName" />
                                </div>
                            </th>
                            <th
                                className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider cursor-pointer transition-colors duration-200"
                                onClick={() => handleSort('email')}
                            >
                                <div className="flex items-center space-x-1">
                                    <span>Email</span>
                                    <SortIcon field="email" />
                                </div>
                            </th>
                            <th
                                className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider cursor-pointer transition-colors duration-200"
                                onClick={() => handleSort('department')}
                            >
                                <div className="flex items-center space-x-1">
                                    <span>Department</span>
                                    <SortIcon field="department" />
                                </div>
                            </th>
                            <th
                                className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider cursor-pointer transition-colors duration-200"
                                onClick={() => handleSort('position')}
                            >
                                <div className="flex items-center space-x-1">
                                    <span>Position</span>
                                    <SortIcon field="position" />
                                </div>
                            </th>
                            <th
                                className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider cursor-pointer transition-colors duration-200"
                                onClick={() => handleSort('contractType')}
                            >
                                <div className="flex items-center space-x-1">
                                    <span>Contract</span>
                                    <SortIcon field="contractType" />
                                </div>
                            </th>
                            <th
                                className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider cursor-pointer transition-colors duration-200"
                                onClick={() => handleSort('status')}
                            >
                                <div className="flex items-center space-x-1">
                                    <span>Status</span>
                                    <SortIcon field="status" />
                                </div>
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200 table-hover">
                        {currentEmployees.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                                    <div className="flex flex-col items-center">
                                        <svg className="w-12 h-12 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                        <p className="text-lg font-medium">No employees found</p>
                                        <p className="text-sm">Try adjusting your search or filters</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            currentEmployees.map((employee) => (
                                <tr key={employee.id} className="hover:bg-gray-50 transition-colors duration-200">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10">
                                                {employee.profilePicture ? (
                                                    <img
                                                        className="h-10 w-10 rounded-full object-cover"
                                                        src={employee.profilePicture}
                                                        alt={employee.fullName}
                                                    />
                                                ) : (
                                                    <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                                        <span className="text-sm font-medium text-indigo-600">
                                                            {employee.fullName?.charAt(0).toUpperCase()}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {employee.fullName}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {employee.phone}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{employee.email}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{employee.department}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{employee.position}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                            {employee.contractType?.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <StatusBadge status={employee.status} />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => onView && onView(employee)}
                                                className="text-indigo-600 hover:text-indigo-900 transition-colors duration-200"
                                                title="View Details"
                                            >
                                                👁️
                                            </button>
                                            <button
                                                onClick={() => onEdit && onEdit(employee)}
                                                className="text-blue-600 hover:text-blue-900 transition-colors duration-200"
                                                title="Edit"
                                            >
                                                ✏️
                                            </button>
                                            <button
                                                onClick={() => {
                                                    if (window.confirm(`Are you sure you want to delete ${employee.fullName}?`)) {
                                                        onDelete && onDelete(employee.id);
                                                    }
                                                }}
                                                className="text-red-600 hover:text-red-900 transition-colors duration-200"
                                                title="Delete"
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                    <div className="flex-1 flex justify-between sm:hidden">
                        <button
                            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1}
                            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Previous
                        </button>
                        <button
                            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                            disabled={currentPage === totalPages}
                            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next
                        </button>
                    </div>
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm text-gray-700">
                                Showing{' '}
                                <span className="font-medium">{startIndex + 1}</span>
                                {' '}to{' '}
                                <span className="font-medium">{Math.min(endIndex, filteredEmployees.length)}</span>
                                {' '}of{' '}
                                <span className="font-medium">{filteredEmployees.length}</span>
                                {' '}results
                            </p>
                        </div>
                        <div>
                            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                <button
                                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                    disabled={currentPage === 1}
                                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <span className="sr-only">Previous</span>
                                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </button>
                                
                                {[...Array(totalPages)].map((_, index) => {
                                    const page = index + 1;
                                    const isCurrentPage = page === currentPage;
                                    
                                    return (
                                        <button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
                                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                                isCurrentPage
                                                    ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                                                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                            }`}
                                        >
                                            {page}
                                        </button>
                                    );
                                })}
                                
                                <button
                                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                    disabled={currentPage === totalPages}
                                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <span className="sr-only">Next</span>
                                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </nav>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
