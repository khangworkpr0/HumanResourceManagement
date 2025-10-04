const express = require('express');
const router = express.Router();
const {
    getCandidates,
    getCandidate,
    createCandidate,
    updateCandidate,
    deleteCandidate,
    updateInterviewStatus,
    addInterview,
    getCandidateStatistics,
    getTopCandidates,
    uploadCV
} = require('../controllers/candidateController');
const { authenticate, authorizeAdmin } = require('../middleware/auth');

// All routes require authentication
router.use(authenticate);

// Public candidate routes (authenticated users)
router.get('/', getCandidates);
router.get('/statistics', getCandidateStatistics);
router.get('/top', getTopCandidates);
router.get('/:id', getCandidate);

// Admin only routes
router.post('/', authorizeAdmin, createCandidate);
router.put('/:id', updateCandidate);
router.put('/:id/status', updateInterviewStatus);
router.put('/:id/interview', addInterview);
router.put('/:id/cv', uploadCV);
router.delete('/:id', authorizeAdmin, deleteCandidate);

module.exports = router;
