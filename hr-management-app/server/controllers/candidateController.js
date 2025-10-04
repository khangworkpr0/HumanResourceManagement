const Candidate = require('../models/Candidate');

// Get all candidates with pagination and filters
const getCandidates = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            search,
            status,
            department,
            sortBy = 'applicationDate',
            sortOrder = 'desc'
        } = req.query;

        // Build query
        const query = {};
        
        if (search) {
            query.$text = { $search: search };
        }
        
        if (status) {
            query.interviewStatus = status;
        }
        
        if (department) {
            query.department = department;
        }

        // Build sort object
        const sort = {};
        sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

        const candidates = await Candidate.find(query)
            .populate('assignedTo', 'email profile.firstName profile.lastName')
            .sort(sort)
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Candidate.countDocuments(query);

        // Get statistics
        const stats = await Candidate.getStatistics();

        res.status(200).json({
            success: true,
            data: {
                candidates,
                pagination: {
                    current: parseInt(page),
                    pages: Math.ceil(total / limit),
                    total,
                    limit: parseInt(limit)
                },
                statistics: stats
            }
        });
    } catch (error) {
        console.error('Get candidates error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Get single candidate by ID
const getCandidate = async (req, res) => {
    try {
        const { id } = req.params;

        const candidate = await Candidate.findById(id)
            .populate('assignedTo', 'email profile.firstName profile.lastName');

        if (!candidate) {
            return res.status(404).json({
                success: false,
                message: 'Candidate not found'
            });
        }

        res.status(200).json({
            success: true,
            data: { candidate }
        });
    } catch (error) {
        console.error('Get candidate error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Create new candidate (admin only)
const createCandidate = async (req, res) => {
    try {
        const candidateData = req.body;

        // Check if candidate with email already exists
        const existingCandidate = await Candidate.findOne({ email: candidateData.email });
        if (existingCandidate) {
            return res.status(400).json({
                success: false,
                message: 'Candidate with this email already exists'
            });
        }

        // Create candidate
        const candidate = new Candidate({
            ...candidateData,
            assignedTo: req.user._id // Assign to current user
        });
        
        await candidate.save();

        const populatedCandidate = await Candidate.findById(candidate._id)
            .populate('assignedTo', 'email profile.firstName profile.lastName');

        res.status(201).json({
            success: true,
            message: 'Candidate created successfully',
            data: { candidate: populatedCandidate }
        });
    } catch (error) {
        console.error('Create candidate error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Update candidate
const updateCandidate = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const candidate = await Candidate.findById(id);
        if (!candidate) {
            return res.status(404).json({
                success: false,
                message: 'Candidate not found'
            });
        }

        // Check if updating email and if it already exists
        if (updates.email && updates.email !== candidate.email) {
            const existingCandidate = await Candidate.findOne({ email: updates.email });
            if (existingCandidate) {
                return res.status(400).json({
                    success: false,
                    message: 'Candidate with this email already exists'
                });
            }
        }

        const updatedCandidate = await Candidate.findByIdAndUpdate(
            id,
            { $set: updates },
            { new: true, runValidators: true }
        ).populate('assignedTo', 'email profile.firstName profile.lastName');

        res.status(200).json({
            success: true,
            message: 'Candidate updated successfully',
            data: { candidate: updatedCandidate }
        });
    } catch (error) {
        console.error('Update candidate error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Delete candidate (admin only)
const deleteCandidate = async (req, res) => {
    try {
        const { id } = req.params;

        const candidate = await Candidate.findByIdAndDelete(id);
        if (!candidate) {
            return res.status(404).json({
                success: false,
                message: 'Candidate not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Candidate deleted successfully'
        });
    } catch (error) {
        console.error('Delete candidate error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Update candidate interview status
const updateInterviewStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, notes } = req.body;

        const candidate = await Candidate.findById(id);
        if (!candidate) {
            return res.status(404).json({
                success: false,
                message: 'Candidate not found'
            });
        }

        await candidate.updateInterviewStatus(status, notes);

        const updatedCandidate = await Candidate.findById(id)
            .populate('assignedTo', 'email profile.firstName profile.lastName');

        res.status(200).json({
            success: true,
            message: 'Interview status updated successfully',
            data: { candidate: updatedCandidate }
        });
    } catch (error) {
        console.error('Update interview status error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Add interview record
const addInterview = async (req, res) => {
    try {
        const { id } = req.params;
        const interviewData = req.body;

        const candidate = await Candidate.findById(id);
        if (!candidate) {
            return res.status(404).json({
                success: false,
                message: 'Candidate not found'
            });
        }

        candidate.interviews.push(interviewData);
        await candidate.save();

        const updatedCandidate = await Candidate.findById(id)
            .populate('assignedTo', 'email profile.firstName profile.lastName');

        res.status(200).json({
            success: true,
            message: 'Interview added successfully',
            data: { candidate: updatedCandidate }
        });
    } catch (error) {
        console.error('Add interview error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Get candidate statistics
const getCandidateStatistics = async (req, res) => {
    try {
        const stats = await Candidate.getStatistics();
        
        // Get additional statistics
        const departmentStats = await Candidate.aggregate([
            {
                $group: {
                    _id: '$department',
                    count: { $sum: 1 },
                    averageScore: { $avg: '$cvScore' }
                }
            },
            {
                $sort: { count: -1 }
            }
        ]);

        const sourceStats = await Candidate.aggregate([
            {
                $group: {
                    _id: '$source',
                    count: { $sum: 1 }
                }
            }
        ]);

        res.status(200).json({
            success: true,
            data: {
                overview: stats,
                departmentBreakdown: departmentStats,
                sourceBreakdown: sourceStats
            }
        });
    } catch (error) {
        console.error('Get candidate statistics error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Get top candidates by CV score
const getTopCandidates = async (req, res) => {
    try {
        const { limit = 10, department } = req.query;
        const query = {};

        if (department) {
            query.department = department;
        }

        const candidates = await Candidate.find(query)
            .sort({ cvScore: -1 })
            .limit(parseInt(limit))
            .populate('assignedTo', 'email profile.firstName profile.lastName');

        res.status(200).json({
            success: true,
            data: { candidates }
        });
    } catch (error) {
        console.error('Get top candidates error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Upload CV (mock implementation)
const uploadCV = async (req, res) => {
    try {
        const { id } = req.params;
        const { cvUrl, resumeText } = req.body; // In real implementation, handle file upload

        const candidate = await Candidate.findByIdAndUpdate(
            id,
            { 
                cvUrl,
                resumeText: resumeText || '',
                lastContact: new Date()
            },
            { new: true }
        );

        if (!candidate) {
            return res.status(404).json({
                success: false,
                message: 'Candidate not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'CV uploaded successfully',
            data: { candidate }
        });
    } catch (error) {
        console.error('Upload CV error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

module.exports = {
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
};
