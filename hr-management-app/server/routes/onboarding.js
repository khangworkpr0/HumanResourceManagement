const express = require('express');
const router = express.Router();
const {
    getOnboardingTasks,
    getOnboardingTask,
    createOnboardingTask,
    updateOnboardingTask,
    deleteOnboardingTask,
    updateTaskStatus,
    addTaskComment,
    getOverdueTasks,
    getOnboardingStatistics,
    createBulkOnboardingTasks
} = require('../controllers/onboardingController');
const { authenticate, authorizeAdmin } = require('../middleware/auth');

// All routes require authentication
router.use(authenticate);

// Public onboarding routes (authenticated users)
router.get('/', getOnboardingTasks);
router.get('/statistics', getOnboardingStatistics);
router.get('/overdue', getOverdueTasks);
router.get('/:id', getOnboardingTask);

// Admin only routes
router.post('/', authorizeAdmin, createOnboardingTask);
router.post('/bulk', authorizeAdmin, createBulkOnboardingTasks);
router.put('/:id', updateOnboardingTask);
router.put('/:id/status', updateTaskStatus);
router.put('/:id/comment', addTaskComment);
router.delete('/:id', authorizeAdmin, deleteOnboardingTask);

module.exports = router;
