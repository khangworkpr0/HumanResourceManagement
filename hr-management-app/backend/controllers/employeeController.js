const User = require('../models/User');

// @desc    Get all employees
// @route   GET /api/employees
// @access  Private (HR and Admin only)
const getAllEmployees = async (req, res) => {
  try {
    const { search, department, position, page = 1, limit = 10 } = req.query;
    
    // Build search query
    let query = { role: { $ne: 'admin' } };
    
    // Add search functionality
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { position: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Filter by department
    if (department) {
      query.department = department;
    }
    
    // Filter by position
    if (position) {
      query.position = { $regex: position, $options: 'i' };
    }

    // Calculate pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Get total count for pagination
    const total = await User.countDocuments(query);

    const employees = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    // Calculate pagination info
    const totalPages = Math.ceil(total / limitNum);
    const hasNextPage = pageNum < totalPages;
    const hasPrevPage = pageNum > 1;

    res.status(200).json({
      success: true,
      count: employees.length,
      total,
      currentPage: pageNum,
      totalPages,
      hasNextPage,
      hasPrevPage,
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
      birthYear,
      cccd,
      cccdIssueDate,
      cccdIssuePlace,
      phone,
      permanentAddress,
      birthPlace,
      socialInsuranceNumber,
      healthInsuranceNumber,
      department,
      position,
      educationLevel,
      major,
      school,
      startDate,
      officialDate,
      contractType,
      salary,
      allowances,
      documents,
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
      birthYear,
      cccd,
      cccdIssueDate,
      cccdIssuePlace,
      phone,
      permanentAddress,
      birthPlace,
      socialInsuranceNumber,
      healthInsuranceNumber,
      department,
      position,
      educationLevel,
      major,
      school,
      startDate,
      officialDate,
      contractType,
      salary,
      allowances: allowances || {
        meal: 0,
        transport: 0,
        additional: 0,
        hazardous: 0
      },
      documents: documents || {
        resume: null,
        healthCertificate: null,
        diploma: null,
        professionalCertificate: null,
        practiceScope: null
      },
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
      birthYear,
      cccd,
      cccdIssueDate,
      cccdIssuePlace,
      phone,
      permanentAddress,
      birthPlace,
      socialInsuranceNumber,
      healthInsuranceNumber,
      department,
      position,
      educationLevel,
      major,
      school,
      startDate,
      officialDate,
      contractType,
      salary,
      allowances,
      documents,
      role
    } = req.body;

    const employee = await User.findByIdAndUpdate(
      req.params.id,
      {
        name: name || undefined,
        email: email || undefined,
        birthYear: birthYear || undefined,
        cccd: cccd || undefined,
        cccdIssueDate: cccdIssueDate || undefined,
        cccdIssuePlace: cccdIssuePlace || undefined,
        phone: phone || undefined,
        permanentAddress: permanentAddress || undefined,
        birthPlace: birthPlace || undefined,
        socialInsuranceNumber: socialInsuranceNumber || undefined,
        healthInsuranceNumber: healthInsuranceNumber || undefined,
        department: department || undefined,
        position: position || undefined,
        educationLevel: educationLevel || undefined,
        major: major || undefined,
        school: school || undefined,
        startDate: startDate || undefined,
        officialDate: officialDate || undefined,
        contractType: contractType || undefined,
        salary: salary || undefined,
        allowances: allowances || undefined,
        documents: documents || undefined,
        role: role || undefined
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

// @desc    Upload employee profile image
// @route   PUT /api/employees/:id/profile-image
// @access  Private (HR and Admin only)
const uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image uploaded'
      });
    }

    // Create URL for the uploaded image
    const imageUrl = `${req.protocol}://${req.get('host')}/${req.file.path}`;
    
    const employee = await User.findByIdAndUpdate(
      req.params.id,
      { profileImage: imageUrl },
      { new: true }
    ).select('-password');

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Profile image uploaded successfully',
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

module.exports = {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployeesByDepartment,
  uploadProfileImage
};
