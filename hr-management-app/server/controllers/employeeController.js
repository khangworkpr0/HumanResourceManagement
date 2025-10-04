const Employee = require('../models/Employee');
const User = require('../models/User');

// Get all employees with pagination and search
const getEmployees = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            search,
            department,
            status,
            sortBy = 'createdAt',
            sortOrder = 'desc'
        } = req.query;

        // Build query
        const query = {};
        
        if (search) {
            query.$text = { $search: search };
        }
        
        if (department) {
            query.department = department;
        }
        
        if (status) {
            query.status = status;
        }

        // Build sort object
        const sort = {};
        sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

        const employees = await Employee.find(query)
            .populate('userId', 'email lastLogin')
            .sort(sort)
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Employee.countDocuments(query);

        // Get statistics
        const stats = await Employee.getStatistics();

        res.status(200).json({
            success: true,
            data: {
                employees,
                pagination: {
                    current: parseInt(page),
                    pages: Math.ceil(total / limit),
                    total,
                    limit: parseInt(limit)
                },
                statistics: stats
            }
        });
    } catch (error) {
        console.error('Get employees error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Get single employee by ID
const getEmployee = async (req, res) => {
    try {
        const { id } = req.params;

        const employee = await Employee.findById(id)
            .populate('userId', 'email lastLogin')
            .populate('assignedTo', 'email profile.firstName profile.lastName');

        if (!employee) {
            return res.status(404).json({
                success: false,
                message: 'Employee not found'
            });
        }

        res.status(200).json({
            success: true,
            data: { employee }
        });
    } catch (error) {
        console.error('Get employee error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Create new employee (admin only)
const createEmployee = async (req, res) => {
    try {
        const employeeData = req.body;

        // Check if employee with email already exists
        const existingEmployee = await Employee.findOne({ email: employeeData.email });
        if (existingEmployee) {
            return res.status(400).json({
                success: false,
                message: 'Employee with this email already exists'
            });
        }

        // Create employee
        const employee = new Employee(employeeData);
        await employee.save();

        // Create user account if not exists
        const existingUser = await User.findOne({ email: employeeData.email });
        if (!existingUser) {
            const user = new User({
                email: employeeData.email,
                password: 'defaultPassword123', // Should be changed on first login
                role: 'employee',
                profile: {
                    firstName: employeeData.fullName.split(' ')[0],
                    lastName: employeeData.fullName.split(' ').slice(1).join(' '),
                    department: employeeData.department,
                    position: employeeData.position
                }
            });
            await user.save();
            employee.userId = user._id;
            await employee.save();
        }

        const populatedEmployee = await Employee.findById(employee._id)
            .populate('userId', 'email lastLogin');

        res.status(201).json({
            success: true,
            message: 'Employee created successfully',
            data: { employee: populatedEmployee }
        });
    } catch (error) {
        console.error('Create employee error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Update employee
const updateEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const employee = await Employee.findById(id);
        if (!employee) {
            return res.status(404).json({
                success: false,
                message: 'Employee not found'
            });
        }

        // Check if updating email and if it already exists
        if (updates.email && updates.email !== employee.email) {
            const existingEmployee = await Employee.findOne({ email: updates.email });
            if (existingEmployee) {
                return res.status(400).json({
                    success: false,
                    message: 'Employee with this email already exists'
                });
            }
        }

        const updatedEmployee = await Employee.findByIdAndUpdate(
            id,
            { $set: updates },
            { new: true, runValidators: true }
        ).populate('userId', 'email lastLogin');

        res.status(200).json({
            success: true,
            message: 'Employee updated successfully',
            data: { employee: updatedEmployee }
        });
    } catch (error) {
        console.error('Update employee error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Delete employee (admin only)
const deleteEmployee = async (req, res) => {
    try {
        const { id } = req.params;

        const employee = await Employee.findById(id);
        if (!employee) {
            return res.status(404).json({
                success: false,
                message: 'Employee not found'
            });
        }

        // Deactivate associated user account
        if (employee.userId) {
            await User.findByIdAndUpdate(employee.userId, { isActive: false });
        }

        await Employee.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: 'Employee deleted successfully'
        });
    } catch (error) {
        console.error('Delete employee error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Get employee statistics
const getEmployeeStatistics = async (req, res) => {
    try {
        const stats = await Employee.getStatistics();
        
        // Get additional statistics
        const departmentStats = await Employee.aggregate([
            {
                $group: {
                    _id: '$department',
                    count: { $sum: 1 },
                    averageAge: { $avg: '$age' }
                }
            },
            {
                $sort: { count: -1 }
            }
        ]);

        const contractTypeStats = await Employee.aggregate([
            {
                $group: {
                    _id: '$contract.type',
                    count: { $sum: 1 }
                }
            }
        ]);

        res.status(200).json({
            success: true,
            data: {
                overview: stats,
                departmentBreakdown: departmentStats,
                contractTypes: contractTypeStats
            }
        });
    } catch (error) {
        console.error('Get employee statistics error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Get employees by department
const getEmployeesByDepartment = async (req, res) => {
    try {
        const { department } = req.params;
        const { page = 1, limit = 10 } = req.query;

        const employees = await Employee.find({ department })
            .populate('userId', 'email lastLogin')
            .sort({ fullName: 1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Employee.countDocuments({ department });

        res.status(200).json({
            success: true,
            data: {
                employees,
                pagination: {
                    current: parseInt(page),
                    pages: Math.ceil(total / limit),
                    total,
                    limit: parseInt(limit)
                }
            }
        });
    } catch (error) {
        console.error('Get employees by department error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Upload employee profile picture (mock implementation)
const uploadProfilePicture = async (req, res) => {
    try {
        const { id } = req.params;
        const { imageUrl } = req.body; // In real implementation, handle file upload

        const employee = await Employee.findByIdAndUpdate(
            id,
            { profilePicture: imageUrl },
            { new: true }
        );

        if (!employee) {
            return res.status(404).json({
                success: false,
                message: 'Employee not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Profile picture updated successfully',
            data: { employee }
        });
    } catch (error) {
        console.error('Upload profile picture error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

module.exports = {
    getEmployees,
    getEmployee,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    getEmployeeStatistics,
    getEmployeesByDepartment,
    uploadProfilePicture
};
