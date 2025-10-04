const express = require('express');
const router = express.Router();
const {
    getEmployees,
    getEmployee,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    getEmployeeStatistics,
    getEmployeesByDepartment,
    uploadProfilePicture
} = require('../controllers/employeeController');
const { authenticate, authorizeAdmin, authorizeEmployeeAccess } = require('../middleware/auth');

// All routes require authentication
router.use(authenticate);

// Public employee routes (authenticated users)
router.get('/', getEmployees);
router.get('/statistics', getEmployeeStatistics);
router.get('/department/:department', getEmployeesByDepartment);

// Employee-specific routes (admin or own data)
router.get('/:id', authorizeEmployeeAccess, getEmployee);
router.put('/:id', authorizeEmployeeAccess, updateEmployee);
router.put('/:id/profile-picture', authorizeEmployeeAccess, uploadProfilePicture);

// Admin only routes
router.post('/', authorizeAdmin, createEmployee);
router.delete('/:id', authorizeAdmin, deleteEmployee);

module.exports = router;
