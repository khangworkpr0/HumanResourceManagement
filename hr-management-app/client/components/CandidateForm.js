// CandidateForm Component - Form to manage candidate profiles
const { useState, useEffect } = React;

function CandidateForm({ candidate, onSave, onCancel, isEdit = false }) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        position: '',
        experience: '',
        education: '',
        skills: '',
        interviewStatus: 'applied',
        interviewDate: '',
        interviewNotes: '',
        cv: null,
        coverLetter: '',
        expectedSalary: '',
        availability: '',
        references: ''
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    // Interview status options
    const interviewStatuses = [
        { value: 'applied', label: 'Applied', color: 'blue' },
        { value: 'screening', label: 'Phone Screening', color: 'yellow' },
        { value: 'interviewed', label: 'Interviewed', color: 'purple' },
        { value: 'technical', label: 'Technical Interview', color: 'indigo' },
        { value: 'offered', label: 'Offered', color: 'green' },
        { value: 'rejected', label: 'Rejected', color: 'red' },
        { value: 'withdrawn', label: 'Withdrawn', color: 'gray' }
    ];

    // Position options
    const positions = [
        'Software Engineer',
        'Frontend Developer',
        'Backend Developer',
        'Full Stack Developer',
        'DevOps Engineer',
        'UI/UX Designer',
        'Product Manager',
        'Marketing Specialist',
        'Sales Representative',
        'HR Specialist',
        'Data Analyst',
        'QA Engineer'
    ];

    // Load candidate data if editing
    useEffect(() => {
        if (candidate && isEdit) {
            setFormData({
                name: candidate.name || '',
                email: candidate.email || '',
                phone: candidate.phone || '',
                position: candidate.position || '',
                experience: candidate.experience || '',
                education: candidate.education || '',
                skills: candidate.skills || '',
                interviewStatus: candidate.interviewStatus || 'applied',
                interviewDate: candidate.interviewDate || '',
                interviewNotes: candidate.interviewNotes || '',
                cv: candidate.cv || null,
                coverLetter: candidate.coverLetter || '',
                expectedSalary: candidate.expectedSalary || '',
                availability: candidate.availability || '',
                references: candidate.references || ''
            });
        }
    }, [candidate, isEdit]);

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

    // Handle file upload
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

        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
        if (!formData.position) newErrors.position = 'Position is required';

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
            console.log('Saving candidate:', formData);
            
            // Call parent callback
            onSave(formData);
        } catch (error) {
            console.error('Error saving candidate:', error);
            alert('Failed to save candidate. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto fade-in">
            <div className="bg-white shadow-lg rounded-lg p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">
                        {isEdit ? 'Edit Candidate' : 'Add New Candidate'}
                    </h2>
                    <button
                        onClick={onCancel}
                        className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    >
                        <span className="text-2xl">×</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Information */}
                    <div className="border-b border-gray-200 pb-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Full Name *
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                                        errors.name ? 'border-red-300' : 'border-gray-300'
                                    }`}
                                    placeholder="Enter full name"
                                />
                                {errors.name && (
                                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
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
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="Enter phone number"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Position Applied For *
                                </label>
                                <select
                                    name="position"
                                    value={formData.position}
                                    onChange={handleInputChange}
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                                        errors.position ? 'border-red-300' : 'border-gray-300'
                                    }`}
                                >
                                    <option value="">Select Position</option>
                                    {positions.map(pos => (
                                        <option key={pos} value={pos}>{pos}</option>
                                    ))}
                                </select>
                                {errors.position && (
                                    <p className="mt-1 text-sm text-red-600">{errors.position}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Professional Information */}
                    <div className="border-b border-gray-200 pb-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Professional Information</h3>
                        
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Work Experience
                                </label>
                                <textarea
                                    name="experience"
                                    value={formData.experience}
                                    onChange={handleInputChange}
                                    rows="4"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="Describe relevant work experience..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Education
                                </label>
                                <textarea
                                    name="education"
                                    value={formData.education}
                                    onChange={handleInputChange}
                                    rows="3"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="Educational background..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Skills
                                </label>
                                <textarea
                                    name="skills"
                                    value={formData.skills}
                                    onChange={handleInputChange}
                                    rows="3"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="Technical skills, languages, tools, etc..."
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Expected Salary
                                    </label>
                                    <input
                                        type="text"
                                        name="expectedSalary"
                                        value={formData.expectedSalary}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        placeholder="e.g., $50,000 - $60,000"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Availability
                                    </label>
                                    <input
                                        type="text"
                                        name="availability"
                                        value={formData.availability}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        placeholder="e.g., 2 weeks notice, immediate"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Interview Information */}
                    <div className="border-b border-gray-200 pb-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Interview Information</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Interview Status
                                </label>
                                <select
                                    name="interviewStatus"
                                    value={formData.interviewStatus}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    {interviewStatuses.map(status => (
                                        <option key={status.value} value={status.value}>
                                            {status.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Interview Date
                                </label>
                                <input
                                    type="datetime-local"
                                    name="interviewDate"
                                    value={formData.interviewDate}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                        </div>

                        <div className="mt-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Interview Notes
                            </label>
                            <textarea
                                name="interviewNotes"
                                value={formData.interviewNotes}
                                onChange={handleInputChange}
                                rows="4"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="Interview feedback, observations, recommendations..."
                            />
                        </div>
                    </div>

                    {/* Documents */}
                    <div className="border-b border-gray-200 pb-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Documents</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    CV/Resume *
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

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Cover Letter
                                </label>
                                <textarea
                                    name="coverLetter"
                                    value={formData.coverLetter}
                                    onChange={handleInputChange}
                                    rows="4"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="Cover letter content..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* References */}
                    <div className="pb-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">References</h3>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Professional References
                            </label>
                            <textarea
                                name="references"
                                value={formData.references}
                                onChange={handleInputChange}
                                rows="3"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="Name, Company, Position, Contact Information..."
                            />
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
                                isEdit ? 'Update Candidate' : 'Add Candidate'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
