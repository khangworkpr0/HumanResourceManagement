const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const { generateContract, getContractTemplates } = require('../controllers/contractController');
const { generateContractSimple } = require('../controllers/contractControllerSimple');

// @route   POST /api/contracts/generate
// @desc    Generate contract PDF
// @access  Private (HR and Admin only)
router.post('/generate', protect, authorize('hr', 'admin'), generateContract);

// @route   GET /api/contracts/templates
// @desc    Get available contract templates
// @access  Private (HR and Admin only)
router.get('/templates', protect, authorize('hr', 'admin'), getContractTemplates);

// @route   POST /api/contracts/generate-simple
// @desc    Generate contract HTML (fallback)
// @access  Private (HR and Admin only)
router.post('/generate-simple', protect, authorize('hr', 'admin'), generateContractSimple);

module.exports = router;
