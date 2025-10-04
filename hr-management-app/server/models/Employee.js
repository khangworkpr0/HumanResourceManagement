const mongoose = require('mongoose');

const workHistorySchema = new mongoose.Schema({
    position: {
        type: String,
        required: [true, 'Position is required']
    },
    years: {
        type: Number,
        required: [true, 'Years of experience is required'],
        min: [0, 'Years cannot be negative']
    },
    company: {
        type: String,
        required: [true, 'Company name is required']
    },
    startDate: Date,
    endDate: Date,
    description: String
});

const contractSchema = new mongoose.Schema({
    startDate: {
        type: Date,
        required: [true, 'Contract start date is required']
    },
    endDate: Date,
    type: {
        type: String,
        enum: ['full-time', 'part-time', 'contract', 'internship'],
        default: 'full-time'
    },
    salary: {
        type: Number,
        min: [0, 'Salary cannot be negative']
    },
    benefits: [String]
});

const employeeSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, 'Full name is required'],
        trim: true,
        maxlength: [100, 'Name cannot exceed 100 characters']
    },
    age: {
        type: Number,
        required: [true, 'Age is required'],
        min: [18, 'Age must be at least 18'],
        max: [100, 'Age cannot exceed 100']
    },
    address: {
        street: String,
        city: String,
        state: String,
        zipCode: String,
        country: {
            type: String,
            default: 'Vietnam'
        }
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        match: [/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    department: {
        type: String,
        required: [true, 'Department is required'],
        enum: ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations', 'IT', 'Customer Service']
    },
    position: {
        type: String,
        required: [true, 'Position is required']
    },
    contract: {
        type: contractSchema,
        required: true
    },
    workHistory: [workHistorySchema],
    profilePicture: {
        type: String,
        default: null
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'on-leave', 'terminated'],
        default: 'active'
    },
    skills: [String],
    emergencyContact: {
        name: String,
        relationship: String,
        phone: String
    },
    documents: [{
        name: String,
        url: String,
        type: String,
        uploadedAt: {
            type: Date,
            default: Date.now
        }
    }],
    notes: String,
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        unique: true
    }
}, {
    timestamps: true
});

// Indexes for efficient queries
employeeSchema.index({ fullName: 'text', email: 'text', position: 'text' });
employeeSchema.index({ department: 1 });
employeeSchema.index({ status: 1 });
employeeSchema.index({ 'contract.startDate': 1 });
employeeSchema.index({ email: 1 }, { unique: true });

// Virtual for full address
employeeSchema.virtual('fullAddress').get(function() {
    const addr = this.address;
    if (!addr) return '';
    return [addr.street, addr.city, addr.state, addr.zipCode, addr.country]
        .filter(Boolean)
        .join(', ');
});

// Virtual for contract duration
employeeSchema.virtual('contractDuration').get(function() {
    if (!this.contract.startDate) return 0;
    const start = new Date(this.contract.startDate);
    const end = this.contract.endDate ? new Date(this.contract.endDate) : new Date();
    return Math.floor((end - start) / (1000 * 60 * 60 * 24 * 365.25)); // years
});

// Pre-save middleware to update user profile
employeeSchema.pre('save', async function(next) {
    if (this.isModified('fullName') || this.isModified('department') || this.isModified('position')) {
        try {
            if (this.userId) {
                const User = mongoose.model('User');
                const [firstName, ...lastNameParts] = this.fullName.split(' ');
                await User.findByIdAndUpdate(this.userId, {
                    'profile.firstName': firstName,
                    'profile.lastName': lastNameParts.join(' '),
                    'profile.department': this.department,
                    'profile.position': this.position
                });
            }
        } catch (error) {
            console.error('Error updating user profile:', error);
        }
    }
    next();
});

// Static method to get employee statistics
employeeSchema.statics.getStatistics = async function() {
    const stats = await this.aggregate([
        {
            $group: {
                _id: null,
                total: { $sum: 1 },
                active: {
                    $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] }
                },
                averageAge: { $avg: '$age' },
                departments: { $addToSet: '$department' }
            }
        },
        {
            $project: {
                _id: 0,
                total: 1,
                active: 1,
                averageAge: { $round: ['$averageAge', 1] },
                departmentCount: { $size: '$departments' }
            }
        }
    ]);
    
    return stats[0] || { total: 0, active: 0, averageAge: 0, departmentCount: 0 };
};

module.exports = mongoose.model('Employee', employeeSchema);
