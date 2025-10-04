// ProfilePage Component - Employee view to see/edit own profile
const { useState, useEffect } = React;

function ProfilePage({ user, onNavigate }) {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        age: '',
        address: '',
        phone: '',
        email: '',
        department: '',
        position: '',
        contractType: '',
        contractStartDate: '',
        contractEndDate: '',
        salary: '',
        workHistory: ''
    });
    const [error, setError] = useState(null);

    // Mock profile data
    const mockProfile = {
        id: 1,
        fullName: 'John Doe',
        age: 28,
        email: 'john.doe@company.com',
        phone: '+1 (555) 123-4567',
        address: '123 Main Street, New York, NY 10001',
        department: 'Engineering',
        position: 'Software Engineer',
        contractType: 'full-time',
        contractStartDate: '2023-01-15',
        contractEndDate: '',
        salary: 75000,
        status: 'active',
        workHistory: '3 years experience in full-stack development with React and Node.js. Previously worked at TechCorp as a Junior Developer.',
        profilePicture: null,
        hireDate: '2023-01-15',
        lastLogin: '2024-01-20T10:30:00Z'
    };

    // Load profile on component mount
    useEffect(() => {
        loadProfile();
    }, []);

    // Mock API call to load profile
    const loadProfile = async () => {
        try {
            setLoading(true);
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            setProfile(mockProfile);
            setFormData({
                fullName: mockProfile.fullName,
                age: mockProfile.age,
                address: mockProfile.address,
                phone: mockProfile.phone,
                email: mockProfile.email,
                department: mockProfile.department,
                position: mockProfile.position,
                contractType: mockProfile.contractType,
                contractStartDate: mockProfile.contractStartDate,
                contractEndDate: mockProfile.contractEndDate,
                salary: mockProfile.salary,
                workHistory: mockProfile.workHistory
            });
        } catch (error) {
            setError('Failed to load profile');
            console.error('Error loading profile:', error);
        } finally {
            setLoading(false);
        }
    };

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle save profile
    const handleSaveProfile = async () => {
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Update profile with new data
            const updatedProfile = { ...profile, ...formData };
            setProfile(updatedProfile);
            setEditing(false);
            
            alert('Profile updated successfully!');
        } catch (error) {
            console.error('Error saving profile:', error);
            alert('Failed to save profile');
        }
    };

    // Handle cancel edit
    const handleCancelEdit = () => {
        setFormData({
            fullName: profile.fullName,
            age: profile.age,
            address: profile.address,
            phone: profile.phone,
            email: profile.email,
            department: profile.department,
            position: profile.position,
            contractType: profile.contractType,
            contractStartDate: profile.contractStartDate,
            contractEndDate: profile.contractEndDate,
            salary: profile.salary,
            workHistory: profile.workHistory
        });
        setEditing(false);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (error) {
        return (
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
        );
    }

    return (
        <div className="space-y-8 fade-in">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <h1 className="text-4xl font-bold gradient-text">My Profile</h1>
                    <p className="mt-2 text-gray-600 text-lg">View and manage your personal information</p>
                </div>
                <div className="mt-4 lg:mt-0">
                    {!editing && (
                        <button
                            onClick={() => setEditing(true)}
                            className="btn-modern inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 shadow-lg"
                        >
                            <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit Profile
                        </button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile Card */}
                <div className="lg:col-span-1">
                    <div className="bg-white shadow-lg rounded-lg p-6">
                        <div className="text-center">
                            <div className="mx-auto h-24 w-24 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                                {profile?.profilePicture ? (
                                    <img
                                        className="h-24 w-24 rounded-full object-cover"
                                        src={profile.profilePicture}
                                        alt={profile.fullName}
                                    />
                                ) : (
                                    <span className="text-2xl font-medium text-indigo-600">
                                        {profile?.fullName?.charAt(0).toUpperCase()}
                                    </span>
                                )}
                            </div>
                            <h3 className="text-xl font-medium text-gray-900">{profile?.fullName}</h3>
                            <p className="text-sm text-gray-500">{profile?.position}</p>
                            <p className="text-sm text-gray-500">{profile?.department}</p>
                            
                            <div className="mt-4">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    profile?.status === 'active' 
                                        ? 'bg-green-100 text-green-800' 
                                        : 'bg-red-100 text-red-800'
                                }`}>
                                    {profile?.status?.charAt(0).toUpperCase() + profile?.status?.slice(1)}
                                </span>
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="mt-6 space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Employee ID:</span>
                                <span className="font-medium text-gray-900">EMP{profile?.id?.toString().padStart(3, '0')}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Hire Date:</span>
                                <span className="font-medium text-gray-900">
                                    {new Date(profile?.hireDate).toLocaleDateString()}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Last Login:</span>
                                <span className="font-medium text-gray-900">
                                    {new Date(profile?.lastLogin).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Profile Details */}
                <div className="lg:col-span-2">
                    <div className="bg-white shadow-lg rounded-lg p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-medium text-gray-900">Personal Information</h3>
                            {editing && (
                                <div className="flex space-x-2">
                                    <button
                                        onClick={handleCancelEdit}
                                        className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 transition-colors duration-200"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSaveProfile}
                                        className="px-3 py-1 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors duration-200"
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="space-y-6">
                            {/* Basic Information */}
                            <div className="border-b border-gray-200 pb-6">
                                <h4 className="text-md font-medium text-gray-900 mb-4">Basic Information</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Full Name
                                        </label>
                                        {editing ? (
                                            <input
                                                type="text"
                                                name="fullName"
                                                value={formData.fullName}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            />
                                        ) : (
                                            <p className="text-sm text-gray-900">{profile?.fullName}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Age
                                        </label>
                                        {editing ? (
                                            <input
                                                type="number"
                                                name="age"
                                                value={formData.age}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            />
                                        ) : (
                                            <p className="text-sm text-gray-900">{profile?.age}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Email
                                        </label>
                                        {editing ? (
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            />
                                        ) : (
                                            <p className="text-sm text-gray-900">{profile?.email}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Phone
                                        </label>
                                        {editing ? (
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            />
                                        ) : (
                                            <p className="text-sm text-gray-900">{profile?.phone}</p>
                                        )}
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Address
                                        </label>
                                        {editing ? (
                                            <textarea
                                                name="address"
                                                value={formData.address}
                                                onChange={handleInputChange}
                                                rows="3"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            />
                                        ) : (
                                            <p className="text-sm text-gray-900">{profile?.address}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Employment Information */}
                            <div className="border-b border-gray-200 pb-6">
                                <h4 className="text-md font-medium text-gray-900 mb-4">Employment Information</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Department
                                        </label>
                                        <p className="text-sm text-gray-900">{profile?.department}</p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Position
                                        </label>
                                        <p className="text-sm text-gray-900">{profile?.position}</p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Contract Type
                                        </label>
                                        <p className="text-sm text-gray-900">
                                            {profile?.contractType?.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                        </p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Salary
                                        </label>
                                        <p className="text-sm text-gray-900">
                                            ${profile?.salary?.toLocaleString()}
                                        </p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Contract Start Date
                                        </label>
                                        <p className="text-sm text-gray-900">
                                            {new Date(profile?.contractStartDate).toLocaleDateString()}
                                        </p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Contract End Date
                                        </label>
                                        <p className="text-sm text-gray-900">
                                            {profile?.contractEndDate ? new Date(profile.contractEndDate).toLocaleDateString() : 'Not specified'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Work History */}
                            <div>
                                <h4 className="text-md font-medium text-gray-900 mb-4">Work History</h4>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Experience & Background
                                    </label>
                                    {editing ? (
                                        <textarea
                                            name="workHistory"
                                            value={formData.workHistory}
                                            onChange={handleInputChange}
                                            rows="4"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                    ) : (
                                        <p className="text-sm text-gray-900 whitespace-pre-line">{profile?.workHistory}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Additional Information */}
            <div className="bg-white shadow-lg rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Additional Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Account Information</h4>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-500">User Role:</span>
                                <span className="font-medium text-gray-900 capitalize">{user?.role}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Account Status:</span>
                                <span className="font-medium text-green-600">Active</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">System Access</h4>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Email Access:</span>
                                <span className="font-medium text-green-600">✓</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">System Access:</span>
                                <span className="font-medium text-green-600">✓</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Security</h4>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Password Last Changed:</span>
                                <span className="font-medium text-gray-900">30 days ago</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">2FA Enabled:</span>
                                <span className="font-medium text-red-600">✗</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
