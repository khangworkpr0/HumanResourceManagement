const Department = require('../models/Department');

// @desc    Get all departments
// @route   GET /api/departments
// @access  Private
const getAllDepartments = async (req, res) => {
  try {
    const departments = await Department.find({ isActive: true })
      .populate('manager', 'name email position')
      .sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: departments.length,
      data: departments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get department by ID
// @route   GET /api/departments/:id
// @access  Private
const getDepartmentById = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id)
      .populate('manager', 'name email position phone');

    if (!department) {
      return res.status(404).json({
        success: false,
        message: 'Department not found'
      });
    }

    res.status(200).json({
      success: true,
      data: department
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Create new department
// @route   POST /api/departments
// @access  Private (HR and Admin only)
const createDepartment = async (req, res) => {
  try {
    const {
      name,
      description,
      manager,
      location,
      budget
    } = req.body;

    // Check if department already exists
    const departmentExists = await Department.findOne({ name });
    if (departmentExists) {
      return res.status(400).json({
        success: false,
        message: 'Department with this name already exists'
      });
    }

    const department = await Department.create({
      name,
      description,
      manager,
      location,
      budget
    });

    await department.populate('manager', 'name email position');

    res.status(201).json({
      success: true,
      message: 'Department created successfully',
      data: department
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update department
// @route   PUT /api/departments/:id
// @access  Private (HR and Admin only)
const updateDepartment = async (req, res) => {
  try {
    const {
      name,
      description,
      manager,
      location,
      budget,
      isActive
    } = req.body;

    const department = await Department.findByIdAndUpdate(
      req.params.id,
      {
        name: name || undefined,
        description: description || undefined,
        manager: manager || undefined,
        location: location || undefined,
        budget: budget || undefined,
        isActive: isActive !== undefined ? isActive : undefined
      },
      {
        new: true,
        runValidators: true
      }
    ).populate('manager', 'name email position');

    if (!department) {
      return res.status(404).json({
        success: false,
        message: 'Department not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Department updated successfully',
      data: department
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Delete department
// @route   DELETE /api/departments/:id
// @access  Private (Admin only)
const deleteDepartment = async (req, res) => {
  try {
    const department = await Department.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!department) {
      return res.status(404).json({
        success: false,
        message: 'Department not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Department deactivated successfully'
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
  getAllDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment
};
