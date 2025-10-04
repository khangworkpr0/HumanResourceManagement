const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema({
    date: Date,
    interviewer: String,
    type: {
        type: String,
        enum: ['phone', 'video', 'in-person', 'technical', 'hr']
    },
    score: {
        type: Number,
        min: 0,
        max: 100
    },
    notes: String,
    status: {
        type: String,
        enum: ['scheduled', 'completed', 'cancelled', 'rescheduled'],
        default: 'scheduled'
    }
});

const candidateSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Candidate name is required'],
        trim: true,
        maxlength: [100, 'Name cannot exceed 100 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    phone: {
        type: String,
        match: [/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number']
    },
    cvUrl: {
        type: String,
        required: [true, 'CV URL is required']
    },
    resumeText: {
        type: String,
        default: ''
    },
    position: {
        type: String,
        required: [true, 'Applied position is required']
    },
    department: {
        type: String,
        enum: ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations', 'IT', 'Customer Service'],
        required: [true, 'Department is required']
    },
    experience: {
        type: Number,
        min: [0, 'Experience cannot be negative'],
        default: 0
    },
    skills: [String],
    education: {
        degree: String,
        university: String,
        graduationYear: Number,
        gpa: Number
    },
    interviewStatus: {
        type: String,
        enum: ['applied', 'screening', 'interview-scheduled', 'interviewed', 'shortlisted', 'offered', 'hired', 'rejected', 'withdrawn'],
        default: 'applied'
    },
    interviews: [interviewSchema],
    cvScore: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
    },
    source: {
        type: String,
        enum: ['website', 'linkedin', 'referral', 'job-board', 'recruiter', 'other'],
        default: 'website'
    },
    expectedSalary: Number,
    availability: {
        type: String,
        enum: ['immediate', '2-weeks', '1-month', '2-months', 'negotiable'],
        default: 'negotiable'
    },
    notes: String,
    tags: [String],
    applicationDate: {
        type: Date,
        default: Date.now
    },
    lastContact: Date,
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

// Indexes for efficient queries
candidateSchema.index({ name: 'text', email: 'text', position: 'text' });
candidateSchema.index({ interviewStatus: 1 });
candidateSchema.index({ department: 1 });
candidateSchema.index({ applicationDate: -1 });
candidateSchema.index({ cvScore: -1 });
candidateSchema.index({ email: 1 }, { unique: true });

// Pre-save middleware to calculate CV score
candidateSchema.pre('save', function(next) {
    if (this.isModified('resumeText') || this.isModified('skills') || this.isModified('position')) {
        this.cvScore = this.calculateCVScore();
    }
    next();
});

// Method to calculate CV score based on keywords
candidateSchema.methods.calculateCVScore = function() {
    const resumeText = (this.resumeText || '').toLowerCase();
    const skills = (this.skills || []).map(skill => skill.toLowerCase());
    const position = (this.position || '').toLowerCase();
    
    let score = 0;
    
    // Define keywords for different positions
    const keywordSets = {
        'developer': ['javascript', 'python', 'java', 'react', 'node.js', 'sql', 'git', 'api', 'frontend', 'backend'],
        'engineer': ['javascript', 'python', 'java', 'react', 'node.js', 'sql', 'git', 'api', 'system design', 'architecture'],
        'designer': ['ui', 'ux', 'figma', 'photoshop', 'illustrator', 'sketch', 'prototyping', 'user research'],
        'marketing': ['seo', 'sem', 'social media', 'content marketing', 'analytics', 'google ads', 'facebook ads'],
        'sales': ['crm', 'lead generation', 'customer acquisition', 'negotiation', 'salesforce', 'pipeline'],
        'hr': ['recruitment', 'talent acquisition', 'employee relations', 'performance management', 'hris']
    };
    
    // Find matching keyword set based on position
    let relevantKeywords = [];
    for (const [key, keywords] of Object.entries(keywordSets)) {
        if (position.includes(key)) {
            relevantKeywords = keywords;
            break;
        }
    }
    
    // Calculate score based on keyword matches
    if (relevantKeywords.length > 0) {
        const textToSearch = resumeText + ' ' + skills.join(' ');
        let matches = 0;
        
        relevantKeywords.forEach(keyword => {
            if (textToSearch.includes(keyword)) {
                matches++;
            }
        });
        
        score = Math.round((matches / relevantKeywords.length) * 100);
    }
    
    // Bonus for having skills
    if (skills.length > 0) {
        score += Math.min(skills.length * 2, 20);
    }
    
    // Bonus for experience
    if (this.experience > 0) {
        score += Math.min(this.experience * 3, 30);
    }
    
    return Math.min(score, 100);
};

// Static method to get candidate statistics
candidateSchema.statics.getStatistics = async function() {
    const stats = await this.aggregate([
        {
            $group: {
                _id: '$interviewStatus',
                count: { $sum: 1 }
            }
        }
    ]);
    
    const statusStats = {
        total: 0,
        applied: 0,
        screening: 0,
        interviewed: 0,
        shortlisted: 0,
        hired: 0,
        rejected: 0
    };
    
    stats.forEach(stat => {
        statusStats.total += stat.count;
        statusStats[stat._id] = stat.count;
    });
    
    return statusStats;
};

// Method to update interview status
candidateSchema.methods.updateInterviewStatus = function(status, notes = '') {
    this.interviewStatus = status;
    if (notes) {
        this.notes = (this.notes || '') + '\n' + new Date().toISOString() + ': ' + notes;
    }
    this.lastContact = new Date();
    return this.save();
};

module.exports = mongoose.model('Candidate', candidateSchema);
