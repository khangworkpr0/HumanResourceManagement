const express = require('express');
const {
  getAllDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment
} = require('../controllers/departmentController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// @route   GET /api/departments
// @desc    Get all departments
// @access  Private
router.get('/', protect, getAllDepartments);

// @route   GET /api/departments/:id
// @desc    Get department by ID
// @access  Private
router.get('/:id', protect, getDepartmentById);

// @route   POST /api/departments
// @desc    Create new department
// @access  Private (HR and Admin only)
router.post('/', protect, authorize('hr', 'admin'), createDepartment);

// @route   PUT /api/departments/:id
// @desc    Update department
// @access  Private (HR and Admin only)
router.put('/:id', protect, authorize('hr', 'admin'), updateDepartment);

// @route   DELETE /api/departments/:id
// @desc    Delete department
// @access  Private (Admin only)
router.delete('/:id', protect, authorize('admin'), deleteDepartment);

module.exports = router;
