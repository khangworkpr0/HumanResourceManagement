// EmployeeForm Component - Form to create/edit employee profiles
const { useState, useEffect } = React;

function EmployeeForm({ employee, onSave, onCancel, isEdit = false }) {
    const [formData, setFormData] = useState({
        fullName: '',
        age: '',
        address: '',
        phone: '',
        email: '',
        contractStartDate: '',
        contractEndDate: '',
        contractType: 'full-time',
        department: '',
        position: '',
        salary: '',
        workHistory: '',
        profilePicture: null,
        cv: null,
        status: 'active'
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    // Contract type options
    const contractTypes = [
        { value: 'full-time', label: 'Full Time' },
        { value: 'part-time', label: 'Part Time' },
        { value: 'contract', label: 'Contract' },
        { value: 'intern', label: 'Intern' }
    ];

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

    // Load employee data if editing
    useEffect(() => {
        if (employee && isEdit) {
            setFormData({
                fullName: employee.fullName || '',
                age: employee.age || '',
                address: employee.address || '',
                phone: employee.phone || '',
                email: employee.email || '',
                contractStartDate: employee.contractStartDate || '',
                contractEndDate: employee.contractEndDate || '',
                contractType: employee.contractType || 'full-time',
                department: employee.department || '',
                position: employee.position || '',
                salary: employee.salary || '',
                workHistory: employee.workHistory || '',
                profilePicture: employee.profilePicture || null,
                cv: employee.cv || null,
                status: employee.status || 'active'
            });
        }
    }, [employee?.id, isEdit]); // Only depend on employee ID instead of entire object

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    // Handle file uploads
    const handleFileChange = (e) => {
        const { name, files } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: files[0] || null
        }));
    };

    // Form validation
    const validateForm = () => {
        const newErrors = {};

        if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
        if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
        if (!formData.department) newErrors.department = 'Department is required';
        if (!formData.position.trim()) newErrors.position = 'Position is required';
        if (!formData.contractStartDate) newErrors.contractStartDate = 'Contract start date is required';
        if (formData.age && (formData.age < 18 || formData.age > 65)) {
            newErrors.age = 'Age must be between 18 and 65';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;

        setLoading(true);
        
        try {
            // Mock API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // In a real app, this would be an API call
            console.log('Saving employee:', formData);
            
            // Call parent callback
            onSave(formData);
        } catch (error) {
            console.error('Error saving employee:', error);
            alert('Failed to save employee. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto fade-in">
            <div className="glass-card-white p-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-3xl font-bold gradient-text">
                            {isEdit ? 'Edit Employee' : 'Add New Employee'}
                        </h2>
                        <p className="text-gray-600 mt-2">
                            {isEdit ? 'Update employee information' : 'Fill in the details to add a new team member'}
                        </p>
                    </div>
                    <button
                        onClick={onCancel}
                        className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors duration-200"
                    >
                        <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Personal Information */}
                    <div className="border-b border-gray-200 pb-8">
                        <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                            <span className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mr-3">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </span>
                            Personal Information
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Full Name *
                                </label>
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleInputChange}
                                    className={`form-input-modern w-full px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none ${
                                        errors.fullName ? 'border-red-300' : ''
                                    }`}
                                    placeholder="Enter full name"
                                />
                                {errors.fullName && (
                                    <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Age
                                </label>
                                <input
                                    type="number"
                                    name="age"
                                    value={formData.age}
                                    onChange={handleInputChange}
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                                        errors.age ? 'border-red-300' : 'border-gray-300'
                                    }`}
                                    placeholder="Enter age"
                                    min="18"
                                    max="65"
                                />
                                {errors.age && (
                                    <p className="mt-1 text-sm text-red-600">{errors.age}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email *
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                                        errors.email ? 'border-red-300' : 'border-gray-300'
                                    }`}
                                    placeholder="Enter email address"
                                />
                                {errors.email && (
                                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Phone *
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                                        errors.phone ? 'border-red-300' : 'border-gray-300'
                                    }`}
                                    placeholder="Enter phone number"
                                />
                                {errors.phone && (
                                    <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                                )}
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Address
                                </label>
                                <textarea
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    rows="3"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="Enter address"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Employment Information */}
                    <div className="border-b border-gray-200 pb-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Employment Information</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Department *
                                </label>
                                <select
                                    name="department"
                                    value={formData.department}
                                    onChange={handleInputChange}
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                                        errors.department ? 'border-red-300' : 'border-gray-300'
                                    }`}
                                >
                                    <option value="">Select Department</option>
                                    {departments.map(dept => (
                                        <option key={dept} value={dept}>{dept}</option>
                                    ))}
                                </select>
                                {errors.department && (
                                    <p className="mt-1 text-sm text-red-600">{errors.department}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Position *
                                </label>
                                <input
                                    type="text"
                                    name="position"
                                    value={formData.position}
                                    onChange={handleInputChange}
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                                        errors.position ? 'border-red-300' : 'border-gray-300'
                                    }`}
                                    placeholder="Enter position"
                                />
                                {errors.position && (
                                    <p className="mt-1 text-sm text-red-600">{errors.position}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Contract Type
                                </label>
                                <select
                                    name="contractType"
                                    value={formData.contractType}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    {contractTypes.map(type => (
                                        <option key={type.value} value={type.value}>
                                            {type.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Salary
                                </label>
                                <input
                                    type="number"
                                    name="salary"
                                    value={formData.salary}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="Enter salary"
                                    min="0"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Contract Start Date *
                                </label>
                                <input
                                    type="date"
                                    name="contractStartDate"
                                    value={formData.contractStartDate}
                                    onChange={handleInputChange}
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                                        errors.contractStartDate ? 'border-red-300' : 'border-gray-300'
                                    }`}
                                />
                                {errors.contractStartDate && (
                                    <p className="mt-1 text-sm text-red-600">{errors.contractStartDate}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Contract End Date
                                </label>
                                <input
                                    type="date"
                                    name="contractEndDate"
                                    value={formData.contractEndDate}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Status
                                </label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Work History */}
                    <div className="border-b border-gray-200 pb-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Work History</h3>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Previous Work Experience
                            </label>
                            <textarea
                                name="workHistory"
                                value={formData.workHistory}
                                onChange={handleInputChange}
                                rows="4"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="Describe previous work experience..."
                            />
                        </div>
                    </div>

                    {/* File Uploads */}
                    <div className="pb-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Documents</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Profile Picture
                                </label>
                                <input
                                    type="file"
                                    name="profilePicture"
                                    onChange={handleFileChange}
                                    accept="image/*"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                                <p className="mt-1 text-sm text-gray-500">Upload a profile picture (JPG, PNG)</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    CV/Resume
                                </label>
                                <input
                                    type="file"
                                    name="cv"
                                    onChange={handleFileChange}
                                    accept=".pdf,.doc,.docx"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                                <p className="mt-1 text-sm text-gray-500">Upload CV (PDF, DOC, DOCX)</p>
                            </div>
                        </div>
                    </div>

                    {/* Form Actions */}
                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 btn-hover transition-all duration-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-modern px-8 py-3 border border-transparent rounded-xl text-white bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                        >
                            {loading ? (
                                <span className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Saving...
                                </span>
                            ) : (
                                <span className="flex items-center">
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    {isEdit ? 'Update Employee' : 'Add Employee'}
                                </span>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
