// Navbar Component - Navigation bar with role-based access control
const { useState, useEffect, useMemo } = React;

function Navbar({ user, onLogout, onNavigate, currentPage }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Navigation items based on user role - memoized to prevent re-renders
    const navigationItems = useMemo(() => {
        if (!user) return [];
        
        const adminItems = [
            { id: 'dashboard', label: 'Employee Dashboard', icon: '👥' },
            { id: 'candidates', label: 'Candidate Management', icon: '📋' },
            { id: 'onboarding', label: 'Onboarding', icon: '✅' },
            { id: 'profile', label: 'Profile', icon: '👤' }
        ];

        const employeeItems = [
            { id: 'profile', label: 'Profile', icon: '👤' }
        ];

        return user.role === 'admin' ? adminItems : employeeItems;
    }, [user?.role]);

    return (
        <nav className="nav-modern sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Logo and Brand */}
                    <div className="flex items-center">
                        <div className="flex-shrink-0 flex items-center">
                            <div className="h-8 w-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center mr-3">
                                <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                </svg>
                            </div>
                            <span className="text-xl font-bold gradient-text">
                                HR Management
                            </span>
                        </div>
                        
                        {/* Desktop Navigation */}
                        <div className="hidden md:ml-8 md:flex md:space-x-2">
                            {navigationItems.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => onNavigate(item.id)}
                                    className={`nav-link-modern inline-flex items-center px-4 py-2 text-sm font-medium transition-all duration-300 ${
                                        currentPage === item.id
                                            ? 'text-white bg-gradient-to-r from-purple-500 to-blue-500 shadow-lg'
                                            : 'text-gray-700 hover:text-gray-900'
                                    }`}
                                >
                                    <span className="mr-2 text-lg">{item.icon}</span>
                                    {item.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* User Menu */}
                    <div className="flex items-center space-x-4">
                        {/* User Info */}
                        <div className="hidden md:flex md:items-center md:space-x-3">
                            <div className="text-right">
                                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                                <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                            </div>
                            <div className="relative">
                                <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
                                    <span className="text-sm font-medium text-white">
                                        {user?.name?.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full pulse-ring"></div>
                            </div>
                        </div>

                        {/* Logout Button */}
                        <button
                            onClick={onLogout}
                            className="btn-modern inline-flex items-center px-4 py-2 border border-transparent text-sm leading-4 font-medium rounded-xl text-white bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 shadow-lg"
                        >
                            <span className="mr-2">🚪</span>
                            Logout
                        </button>

                        {/* Mobile menu button */}
                        <div className="md:hidden">
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="inline-flex items-center justify-center p-2 rounded-xl text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500 transition-all duration-200"
                            >
                                <span className="sr-only">Open main menu</span>
                                <svg
                                    className={`${isMobileMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                                <svg
                                    className={`${isMobileMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Navigation Menu */}
                <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:hidden transition-all duration-300`}>
                    <div className="pt-2 pb-3 space-y-1">
                        {navigationItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => {
                                    onNavigate(item.id);
                                    setIsMobileMenuOpen(false);
                                }}
                                className={`block w-full text-left pl-3 pr-4 py-3 text-base font-medium rounded-xl transition-all duration-300 ${
                                    currentPage === item.id
                                        ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg'
                                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                                }`}
                            >
                                <span className="mr-3 text-lg">{item.icon}</span>
                                {item.label}
                            </button>
                        ))}
                    </div>
                    
                    {/* Mobile User Info */}
                    <div className="pt-4 pb-3 border-t border-gray-200">
                        <div className="flex items-center px-4">
                            <div className="relative">
                                <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
                                    <span className="text-lg font-medium text-white">
                                        {user?.name?.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full"></div>
                            </div>
                            <div className="ml-4">
                                <div className="text-base font-medium text-gray-900">{user?.name}</div>
                                <div className="text-sm font-medium text-gray-500 capitalize">{user?.role}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}
