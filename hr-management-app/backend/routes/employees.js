const express = require('express');
const multer = require('multer');
const path = require('path');
const {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployeesByDepartment,
  uploadProfileImage
} = require('../controllers/employeeController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Set up storage for profile images
const profileImageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/profile-images');
  },
  filename: (req, file, cb) => {
    cb(null, `profile-${Date.now()}${path.extname(file.originalname)}`);
  }
});

// File filter for profile images
const profileImageFilter = (req, file, cb) => {
  const allowedFileTypes = /jpeg|jpg|png|gif/;
  const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedFileTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files are allowed for profile images!'), false);
  }
};

const uploadProfileImageMiddleware = multer({
  storage: profileImageStorage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB file size limit
  fileFilter: profileImageFilter
});

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

// @route   PUT /api/employees/:id/profile-image
// @desc    Upload employee profile image
// @access  Private (HR and Admin only)
router.put('/:id/profile-image', protect, authorize('hr', 'admin'), uploadProfileImageMiddleware.single('profileImage'), uploadProfileImage);

module.exports = router;
