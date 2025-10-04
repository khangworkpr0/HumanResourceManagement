// CandidateDashboard Component - Admin view to manage candidates, view CVs, update interview status
const { useState, useEffect, useMemo } = React;

function CandidateDashboard({ user, onNavigate }) {
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingCandidate, setEditingCandidate] = useState(null);
    const [error, setError] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState('');

    // Mock candidate data
    const mockCandidates = [
        {
            id: 1,
            name: 'Alex Rodriguez',
            email: 'alex.rodriguez@email.com',
            phone: '+1 (555) 111-2222',
            position: 'Software Engineer',
            experience: '5 years in full-stack development with React, Node.js, and Python',
            education: 'Bachelor of Computer Science, MIT (2018)',
            skills: 'JavaScript, Python, React, Node.js, AWS, Docker',
            interviewStatus: 'interviewed',
            interviewDate: '2024-01-15T10:00',
            interviewNotes: 'Strong technical skills, good communication. Recommended for next round.',
            expectedSalary: '$80,000 - $90,000',
            availability: '2 weeks notice',
            appliedDate: '2024-01-10'
        },
        {
            id: 2,
            name: 'Maria Garcia',
            email: 'maria.garcia@email.com',
            phone: '+1 (555) 333-4444',
            position: 'UI/UX Designer',
            experience: '3 years in user experience design with focus on mobile applications',
            education: 'Master of Design, Stanford University (2020)',
            skills: 'Figma, Adobe Creative Suite, Sketch, Prototyping, User Research',
            interviewStatus: 'screening',
            interviewDate: '2024-01-20T14:00',
            interviewNotes: 'Creative portfolio, good understanding of user-centered design',
            expectedSalary: '$65,000 - $75,000',
            availability: 'Immediate',
            appliedDate: '2024-01-12'
        },
        {
            id: 3,
            name: 'James Wilson',
            email: 'james.wilson@email.com',
            phone: '+1 (555) 555-6666',
            position: 'DevOps Engineer',
            experience: '4 years in cloud infrastructure and automation',
            education: 'Bachelor of Information Technology, University of Washington (2019)',
            skills: 'AWS, Kubernetes, Docker, Terraform, Jenkins, Python',
            interviewStatus: 'offered',
            interviewDate: '2024-01-18T09:00',
            interviewNotes: 'Excellent technical knowledge, great cultural fit. Offer extended.',
            expectedSalary: '$85,000 - $95,000',
            availability: '3 weeks notice',
            appliedDate: '2024-01-08'
        },
        {
            id: 4,
            name: 'Lisa Chen',
            email: 'lisa.chen@email.com',
            phone: '+1 (555) 777-8888',
            position: 'Product Manager',
            experience: '6 years in product management with focus on B2B SaaS products',
            education: 'MBA, Harvard Business School (2017)',
            skills: 'Product Strategy, Agile, Analytics, Stakeholder Management, Jira',
            interviewStatus: 'rejected',
            interviewDate: '2024-01-16T15:00',
            interviewNotes: 'Good experience but not aligned with our current product direction.',
            expectedSalary: '$95,000 - $110,000',
            availability: '1 month notice',
            appliedDate: '2024-01-05'
        },
        {
            id: 5,
            name: 'David Kim',
            email: 'david.kim@email.com',
            phone: '+1 (555) 999-0000',
            position: 'Frontend Developer',
            experience: '2 years in frontend development with React and Vue.js',
            education: 'Bachelor of Computer Science, UC Berkeley (2021)',
            skills: 'React, Vue.js, TypeScript, CSS, HTML, JavaScript',
            interviewStatus: 'applied',
            interviewDate: '',
            interviewNotes: '',
            expectedSalary: '$60,000 - $70,000',
            availability: 'Immediate',
            appliedDate: '2024-01-22'
        }
    ];

    // Load candidates on component mount
    useEffect(() => {
        loadCandidates();
    }, []);

    // Mock API call to load candidates
    const loadCandidates = async () => {
        try {
            setLoading(true);
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            setCandidates(mockCandidates);
        } catch (error) {
            setError('Failed to load candidates');
            console.error('Error loading candidates:', error);
        } finally {
            setLoading(false);
        }
    };

    // Handle add new candidate
    const handleAddCandidate = () => {
        setEditingCandidate(null);
        setShowForm(true);
    };

    // Handle edit candidate
    const handleEditCandidate = (candidate) => {
        setEditingCandidate(candidate);
        setShowForm(true);
    };

    // Handle save candidate
    const handleSaveCandidate = async (candidateData) => {
        try {
            if (editingCandidate) {
                // Update existing candidate
                const updatedCandidates = candidates.map(cand =>
                    cand.id === editingCandidate.id
                        ? { ...cand, ...candidateData, id: editingCandidate.id }
                        : cand
                );
                setCandidates(updatedCandidates);
            } else {
                // Add new candidate
                const newCandidate = {
                    ...candidateData,
                    id: Math.max(...candidates.map(c => c.id)) + 1,
                    appliedDate: new Date().toISOString().split('T')[0]
                };
                setCandidates([newCandidate, ...candidates]);
            }
            
            setShowForm(false);
            setEditingCandidate(null);
        } catch (error) {
            console.error('Error saving candidate:', error);
            alert('Failed to save candidate');
        }
    };

    // Handle delete candidate
    const handleDeleteCandidate = async (candidateId) => {
        try {
            setCandidates(candidates.filter(cand => cand.id !== candidateId));
        } catch (error) {
            console.error('Error deleting candidate:', error);
            alert('Failed to delete candidate');
        }
    };

    // Handle view candidate details
    const handleViewCandidate = (candidate) => {
        // In a real app, this would open a detailed modal or navigate to a detail page
        alert(`Viewing details for ${candidate.name}\nEmail: ${candidate.email}\nPosition: ${candidate.position}\nStatus: ${candidate.interviewStatus}`);
    };

    // Handle cancel form
    const handleCancelForm = () => {
        setShowForm(false);
        setEditingCandidate(null);
    };

    // Handle status filter
    const filteredCandidates = selectedStatus 
        ? candidates.filter(candidate => candidate.interviewStatus === selectedStatus)
        : candidates;

    // Statistics calculation
    const stats = {
        total: candidates.length,
        applied: candidates.filter(cand => cand.interviewStatus === 'applied').length,
        interviewed: candidates.filter(cand => ['screening', 'interviewed', 'technical'].includes(cand.interviewStatus)).length,
        offered: candidates.filter(cand => cand.interviewStatus === 'offered').length,
        rejected: candidates.filter(cand => cand.interviewStatus === 'rejected').length
    };

    // Status badge component
    const StatusBadge = ({ status }) => {
        const statusConfig = {
            applied: { color: 'blue', label: 'Applied' },
            screening: { color: 'yellow', label: 'Screening' },
            interviewed: { color: 'purple', label: 'Interviewed' },
            technical: { color: 'indigo', label: 'Technical' },
            offered: { color: 'green', label: 'Offered' },
            rejected: { color: 'red', label: 'Rejected' },
            withdrawn: { color: 'gray', label: 'Withdrawn' }
        };

        const config = statusConfig[status] || { color: 'gray', label: status };
        const colorClasses = {
            blue: 'bg-blue-100 text-blue-800',
            yellow: 'bg-yellow-100 text-yellow-800',
            purple: 'bg-purple-100 text-purple-800',
            indigo: 'bg-indigo-100 text-indigo-800',
            green: 'bg-green-100 text-green-800',
            red: 'bg-red-100 text-red-800',
            gray: 'bg-gray-100 text-gray-800'
        };

        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClasses[config.color]}`}>
                {config.label}
            </span>
        );
    };

    // Statistics calculation - memoized to prevent unnecessary re-renders
    const stats = useMemo(() => ({
        total: candidates.length,
        applied: candidates.filter(c => c.status === 'applied').length,
        interviewed: candidates.filter(c => c.status === 'interviewed').length,
        offered: candidates.filter(c => c.status === 'offered').length,
        rejected: candidates.filter(c => c.status === 'rejected').length
    }), [candidates]);

    // If showing form, render the form component
    if (showForm) {
        return (
            <CandidateForm
                candidate={editingCandidate}
                onSave={handleSaveCandidate}
                onCancel={handleCancelForm}
                isEdit={!!editingCandidate}
            />
        );
    }

    return (
        <div className="space-y-6 fade-in">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <h1 className="text-4xl font-bold gradient-text">Candidate Management</h1>
                    <p className="mt-2 text-gray-600 text-lg">Manage job candidates and track interview progress</p>
                </div>
                <div className="mt-4 lg:mt-0">
                    <button
                        onClick={handleAddCandidate}
                        className="btn-modern inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 shadow-lg"
                    >
                        <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add Candidate
                    </button>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                <div className="stats-card card-hover">
                    <div className="p-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                                    <span className="text-white text-lg">👥</span>
                                </div>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Total</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                                    <span className="text-white text-sm font-medium">📝</span>
                                </div>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-gray-500">Applied</p>
                                <p className="text-lg font-semibold text-gray-900">{stats.applied}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                                    <span className="text-white text-sm font-medium">🎯</span>
                                </div>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-gray-500">Interviewed</p>
                                <p className="text-lg font-semibold text-gray-900">{stats.interviewed}</p>
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
                            <div className="ml-3">
                                <p className="text-sm font-medium text-gray-500">Offered</p>
                                <p className="text-lg font-semibold text-gray-900">{stats.offered}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-red-500 rounded-md flex items-center justify-center">
                                    <span className="text-white text-sm font-medium">❌</span>
                                </div>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-gray-500">Rejected</p>
                                <p className="text-lg font-semibold text-gray-900">{stats.rejected}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Status Filter */}
            <div className="bg-white shadow rounded-lg p-4">
                <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">Filter by status:</span>
                    <button
                        onClick={() => setSelectedStatus('')}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-colors duration-200 ${
                            selectedStatus === '' 
                                ? 'bg-indigo-100 text-indigo-800' 
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        All
                    </button>
                    {['applied', 'screening', 'interviewed', 'technical', 'offered', 'rejected'].map(status => (
                        <button
                            key={status}
                            onClick={() => setSelectedStatus(status)}
                            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors duration-200 ${
                                selectedStatus === status 
                                    ? 'bg-indigo-100 text-indigo-800' 
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            <StatusBadge status={status} />
                        </button>
                    ))}
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

            {/* Candidates List */}
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">
                        Candidates ({filteredCandidates.length})
                    </h3>
                </div>

                {loading ? (
                    <div className="p-6">
                        <div className="animate-pulse space-y-4">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="h-20 bg-gray-200 rounded"></div>
                            ))}
                        </div>
                    </div>
                ) : filteredCandidates.length === 0 ? (
                    <div className="p-12 text-center">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No candidates found</h3>
                        <p className="mt-1 text-sm text-gray-500">Get started by adding a new candidate.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-200">
                        {filteredCandidates.map((candidate) => (
                            <div key={candidate.id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-4">
                                            <div className="flex-shrink-0">
                                                <div className="h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center">
                                                    <span className="text-lg font-medium text-indigo-600">
                                                        {candidate.name.charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center space-x-2">
                                                    <h4 className="text-lg font-medium text-gray-900 truncate">
                                                        {candidate.name}
                                                    </h4>
                                                    <StatusBadge status={candidate.interviewStatus} />
                                                </div>
                                                <p className="text-sm text-gray-600">{candidate.position}</p>
                                                <p className="text-sm text-gray-500">{candidate.email}</p>
                                                <p className="text-xs text-gray-400">
                                                    Applied: {new Date(candidate.appliedDate).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() => handleViewCandidate(candidate)}
                                            className="text-indigo-600 hover:text-indigo-900 text-sm font-medium transition-colors duration-200"
                                        >
                                            View CV
                                        </button>
                                        <button
                                            onClick={() => handleEditCandidate(candidate)}
                                            className="text-blue-600 hover:text-blue-900 text-sm font-medium transition-colors duration-200"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => {
                                                if (window.confirm(`Are you sure you want to delete ${candidate.name}?`)) {
                                                    handleDeleteCandidate(candidate.id);
                                                }
                                            }}
                                            className="text-red-600 hover:text-red-900 text-sm font-medium transition-colors duration-200"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                                
                                {candidate.interviewNotes && (
                                    <div className="mt-4 p-3 bg-gray-50 rounded-md">
                                        <p className="text-sm text-gray-700">
                                            <span className="font-medium">Interview Notes:</span> {candidate.interviewNotes}
                                        </p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
