const express = require('express');
const {
  upload,
  uploadFile,
  getEmployeeFiles,
  downloadFile,
  deleteFile
} = require('../controllers/employeeFileController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// @route   POST /api/employees/:id/files
// @desc    Upload file for employee
// @access  Private (HR and Admin only)
router.post('/:id/files', protect, authorize('hr', 'admin'), upload.single('file'), uploadFile);

// @route   GET /api/employees/:id/files
// @desc    Get all files for employee
// @access  Private
router.get('/:id/files', protect, getEmployeeFiles);

// @route   GET /api/employees/files/:fileId/download
// @desc    Download file
// @access  Private
router.get('/files/:fileId/download', protect, downloadFile);

// @route   DELETE /api/employees/files/:fileId
// @desc    Delete file
// @access  Private (HR and Admin only)
router.delete('/files/:fileId', protect, authorize('hr', 'admin'), deleteFile);

module.exports = router;
