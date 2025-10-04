const express = require('express');
const {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployeesByDepartment
} = require('../controllers/employeeController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// @route   GET /api/employees
// @desc    Get all employees
// @access  Private (HR and Admin only)
router.get('/', protect, authorize('hr', 'admin'), getAllEmployees);

// @route   GET /api/employees/department/:departmentId
// @desc    Get employees by department
// @access  Private (HR and Admin only)
router.get('/department/:departmentId', protect, authorize('hr', 'admin'), getEmployeesByDepartment);

// @route   GET /api/employees/:id
// @desc    Get employee by ID
// @access  Private
router.get('/:id', protect, getEmployeeById);

// @route   POST /api/employees
// @desc    Create new employee
// @access  Private (HR and Admin only)
router.post('/', protect, authorize('hr', 'admin'), createEmployee);

// @route   PUT /api/employees/:id
// @desc    Update employee
// @access  Private (HR and Admin only)
router.put('/:id', protect, authorize('hr', 'admin'), updateEmployee);

// @route   DELETE /api/employees/:id
// @desc    Delete employee
// @access  Private (Admin only)
router.delete('/:id', protect, authorize('admin'), deleteEmployee);

module.exports = router;
