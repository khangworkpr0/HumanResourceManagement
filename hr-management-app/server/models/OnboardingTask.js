const mongoose = require('mongoose');

const onboardingTaskSchema = new mongoose.Schema({
    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: [true, 'Employee ID is required']
    },
    taskName: {
        type: String,
        required: [true, 'Task name is required'],
        trim: true,
        maxlength: [200, 'Task name cannot exceed 200 characters']
    },
    description: {
        type: String,
        trim: true,
        maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    status: {
        type: String,
        enum: ['pending', 'in-progress', 'completed', 'cancelled'],
        default: 'pending'
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'urgent'],
        default: 'medium'
    },
    dueDate: {
        type: Date,
        required: [true, 'Due date is required']
    },
    completedDate: Date,
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Assigned user is required']
    },
    category: {
        type: String,
        enum: ['documentation', 'training', 'equipment', 'access', 'orientation', 'other'],
        default: 'other'
    },
    dependencies: [{
        taskId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'OnboardingTask'
        },
        description: String
    }],
    attachments: [{
        name: String,
        url: String,
        uploadedAt: {
            type: Date,
            default: Date.now
        }
    }],
    comments: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        comment: String,
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    estimatedHours: {
        type: Number,
        min: [0, 'Estimated hours cannot be negative']
    },
    actualHours: {
        type: Number,
        min: [0, 'Actual hours cannot be negative']
    },
    checklist: [{
        item: String,
        completed: {
            type: Boolean,
            default: false
        },
        completedAt: Date
    }],
    notifications: {
        emailSent: {
            type: Boolean,
            default: false
        },
        reminderSent: {
            type: Boolean,
            default: false
        }
    }
}, {
    timestamps: true
});

// Indexes for efficient queries
onboardingTaskSchema.index({ employeeId: 1 });
onboardingTaskSchema.index({ status: 1 });
onboardingTaskSchema.index({ assignedTo: 1 });
onboardingTaskSchema.index({ dueDate: 1 });
onboardingTaskSchema.index({ category: 1 });
onboardingTaskSchema.index({ createdAt: -1 });

// Virtual for overdue status
onboardingTaskSchema.virtual('isOverdue').get(function() {
    return this.status !== 'completed' && this.dueDate < new Date();
});

// Virtual for days until due
onboardingTaskSchema.virtual('daysUntilDue').get(function() {
    if (this.status === 'completed') return 0;
    const now = new Date();
    const due = new Date(this.dueDate);
    const diffTime = due - now;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Pre-save middleware to set completed date
onboardingTaskSchema.pre('save', function(next) {
    if (this.isModified('status') && this.status === 'completed' && !this.completedDate) {
        this.completedDate = new Date();
    }
    next();
});

// Static method to get tasks by employee
onboardingTaskSchema.statics.getTasksByEmployee = async function(employeeId, options = {}) {
    const query = { employeeId };
    
    if (options.status) {
        query.status = options.status;
    }
    
    if (options.category) {
        query.category = options.category;
    }
    
    const tasks = await this.find(query)
        .populate('employeeId', 'fullName email department position')
        .populate('assignedTo', 'email profile.firstName profile.lastName')
        .sort({ dueDate: 1 });
    
    return tasks;
};

// Static method to get overdue tasks
onboardingTaskSchema.statics.getOverdueTasks = async function() {
    const overdueTasks = await this.find({
        status: { $in: ['pending', 'in-progress'] },
        dueDate: { $lt: new Date() }
    })
    .populate('employeeId', 'fullName email department')
    .populate('assignedTo', 'email profile.firstName profile.lastName');
    
    return overdueTasks;
};

// Static method to get task statistics
onboardingTaskSchema.statics.getStatistics = async function(employeeId = null) {
    const matchStage = employeeId ? { employeeId: mongoose.Types.ObjectId(employeeId) } : {};
    
    const stats = await this.aggregate([
        { $match: matchStage },
        {
            $group: {
                _id: '$status',
                count: { $sum: 1 }
            }
        }
    ]);
    
    const statusStats = {
        total: 0,
        pending: 0,
        inProgress: 0,
        completed: 0,
        cancelled: 0
    };
    
    stats.forEach(stat => {
        statusStats.total += stat.count;
        statusStats[stat._id] = stat.count;
    });
    
    return statusStats;
};

// Method to add comment
onboardingTaskSchema.methods.addComment = function(userId, comment) {
    this.comments.push({
        user: userId,
        comment: comment
    });
    return this.save();
};

// Method to update task status with notification
onboardingTaskSchema.methods.updateStatus = async function(status, userId = null) {
    const oldStatus = this.status;
    this.status = status;
    
    if (status === 'completed') {
        this.completedDate = new Date();
    }
    
    // Add comment about status change
    if (userId) {
        await this.addComment(userId, `Status changed from ${oldStatus} to ${status}`);
    }
    
    // Mock email notification
    console.log(`📧 Email Notification: Task "${this.taskName}" status changed to ${status}`);
    console.log(`   Employee: ${this.employeeId}`);
    console.log(`   Assigned to: ${this.assignedTo}`);
    console.log(`   Due date: ${this.dueDate}`);
    
    return this.save();
};

// Method to check if task has unmet dependencies
onboardingTaskSchema.methods.checkDependencies = async function() {
    if (!this.dependencies || this.dependencies.length === 0) {
        return true;
    }
    
    const dependencyIds = this.dependencies.map(dep => dep.taskId);
    const completedDependencies = await this.constructor.find({
        _id: { $in: dependencyIds },
        status: 'completed'
    });
    
    return completedDependencies.length === this.dependencies.length;
};

module.exports = mongoose.model('OnboardingTask', onboardingTaskSchema);
