const User = require('../models/User');

// @desc    Get all employees
// @route   GET /api/employees
// @access  Private (HR and Admin only)
const getAllEmployees = async (req, res) => {
  try {
    const employees = await User.find({ role: { $ne: 'admin' } })
      .select('-password')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: employees.length,
      data: employees
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get employee by ID
// @route   GET /api/employees/:id
// @access  Private
const getEmployeeById = async (req, res) => {
  try {
    const employee = await User.findById(req.params.id).select('-password');

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    // Check if user can access this employee data
    if (req.user.role === 'employee' && req.user.id !== req.params.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.status(200).json({
      success: true,
      data: employee
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Create new employee
// @route   POST /api/employees
// @access  Private (HR and Admin only)
const createEmployee = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      department,
      position,
      phone,
      address,
      salary,
      role = 'employee'
    } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'Employee with this email already exists'
      });
    }

    const employee = await User.create({
      name,
      email,
      password,
      department,
      position,
      phone,
      address,
      salary,
      role
    });

    res.status(201).json({
      success: true,
      message: 'Employee created successfully',
      data: employee
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update employee
// @route   PUT /api/employees/:id
// @access  Private (HR and Admin only)
const updateEmployee = async (req, res) => {
  try {
    const {
      name,
      email,
      department,
      position,
      phone,
      address,
      salary,
      role,
      isActive
    } = req.body;

    const employee = await User.findByIdAndUpdate(
      req.params.id,
      {
        name: name || undefined,
        email: email || undefined,
        department: department || undefined,
        position: position || undefined,
        phone: phone || undefined,
        address: address || undefined,
        salary: salary || undefined,
        role: role || undefined,
        isActive: isActive !== undefined ? isActive : undefined
      },
      {
        new: true,
        runValidators: true
      }
    ).select('-password');

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Employee updated successfully',
      data: employee
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Delete employee
// @route   DELETE /api/employees/:id
// @access  Private (Admin only)
const deleteEmployee = async (req, res) => {
  try {
    const employee = await User.findByIdAndDelete(req.params.id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Employee deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get employees by department
// @route   GET /api/employees/department/:departmentId
// @access  Private (HR and Admin only)
const getEmployeesByDepartment = async (req, res) => {
  try {
    const employees = await User.find({ 
      department: req.params.departmentId,
      role: { $ne: 'admin' }
    }).select('-password');

    res.status(200).json({
      success: true,
      count: employees.length,
      data: employees
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

module.exports = {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployeesByDepartment
};
