const multer = require('multer');
const path = require('path');
const fs = require('fs');
const EmployeeFile = require('../models/EmployeeFile');

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../../uploads/employee-files');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  // Allow common document types
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/png',
    'image/gif',
    'text/plain'
  ];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF, DOC, DOCX, JPG, PNG, GIF, and TXT files are allowed.'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// @desc    Upload file for employee
// @route   POST /api/employees/:id/files
// @access  Private (HR and Admin only)
const uploadFile = async (req, res) => {
  try {
    const { id } = req.params;
    const { category, description } = req.body;
    
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const employeeFile = await EmployeeFile.create({
      employeeId: id,
      fileName: req.file.filename,
      originalName: req.file.originalname,
      filePath: req.file.path,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
      category: category || 'other',
      description: description || '',
      uploadedBy: req.user.id
    });

    res.status(201).json({
      success: true,
      message: 'File uploaded successfully',
      data: employeeFile
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get all files for employee
// @route   GET /api/employees/:id/files
// @access  Private
const getEmployeeFiles = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if user can access this employee's files
    if (req.user.role === 'employee' && req.user.id !== id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const files = await EmployeeFile.find({ 
      employeeId: id, 
      isActive: true 
    })
    .populate('uploadedBy', 'name email')
    .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: files.length,
      data: files
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Download file
// @route   GET /api/employees/files/:fileId/download
// @access  Private
const downloadFile = async (req, res) => {
  try {
    const { fileId } = req.params;
    
    const file = await EmployeeFile.findById(fileId);
    
    if (!file) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    // Check if user can access this file
    if (req.user.role === 'employee' && req.user.id !== file.employeeId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    if (!fs.existsSync(file.filePath)) {
      return res.status(404).json({
        success: false,
        message: 'File not found on server'
      });
    }

    res.download(file.filePath, file.originalName);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Delete file
// @route   DELETE /api/employees/files/:fileId
// @access  Private (HR and Admin only)
const deleteFile = async (req, res) => {
  try {
    const { fileId } = req.params;
    
    const file = await EmployeeFile.findById(fileId);
    
    if (!file) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    // Delete physical file
    if (fs.existsSync(file.filePath)) {
      fs.unlinkSync(file.filePath);
    }

    // Delete database record
    await EmployeeFile.findByIdAndDelete(fileId);

    res.status(200).json({
      success: true,
      message: 'File deleted successfully'
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
  upload,
  uploadFile,
  getEmployeeFiles,
  downloadFile,
  deleteFile
};
