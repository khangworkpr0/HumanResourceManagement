const OnboardingTask = require('../models/OnboardingTask');
const Employee = require('../models/Employee');

// Get onboarding tasks
const getOnboardingTasks = async (req, res) => {
    try {
        const { employeeId, status, category } = req.query;
        const options = { status, category };

        let tasks;
        if (employeeId) {
            tasks = await OnboardingTask.getTasksByEmployee(employeeId, options);
        } else {
            // Get all tasks for admin
            const query = {};
            if (status) query.status = status;
            if (category) query.category = category;

            tasks = await OnboardingTask.find(query)
                .populate('employeeId', 'fullName email department position')
                .populate('assignedTo', 'email profile.firstName profile.lastName')
                .sort({ dueDate: 1 });
        }

        res.status(200).json({
            success: true,
            data: { tasks }
        });
    } catch (error) {
        console.error('Get onboarding tasks error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Get single onboarding task
const getOnboardingTask = async (req, res) => {
    try {
        const { id } = req.params;

        const task = await OnboardingTask.findById(id)
            .populate('employeeId', 'fullName email department position')
            .populate('assignedTo', 'email profile.firstName profile.lastName')
            .populate('comments.user', 'email profile.firstName profile.lastName');

        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Onboarding task not found'
            });
        }

        res.status(200).json({
            success: true,
            data: { task }
        });
    } catch (error) {
        console.error('Get onboarding task error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Create onboarding task (admin only)
const createOnboardingTask = async (req, res) => {
    try {
        const taskData = {
            ...req.body,
            assignedTo: req.user._id // Assign to current user by default
        };

        // Verify employee exists
        const employee = await Employee.findById(taskData.employeeId);
        if (!employee) {
            return res.status(404).json({
                success: false,
                message: 'Employee not found'
            });
        }

        const task = new OnboardingTask(taskData);
        await task.save();

        const populatedTask = await OnboardingTask.findById(task._id)
            .populate('employeeId', 'fullName email department position')
            .populate('assignedTo', 'email profile.firstName profile.lastName');

        // Mock email notification
        console.log(`📧 Email Notification: New onboarding task created`);
        console.log(`   Task: ${task.taskName}`);
        console.log(`   Employee: ${employee.fullName} (${employee.email})`);
        console.log(`   Assigned to: ${req.user.email}`);
        console.log(`   Due date: ${task.dueDate}`);

        res.status(201).json({
            success: true,
            message: 'Onboarding task created successfully',
            data: { task: populatedTask }
        });
    } catch (error) {
        console.error('Create onboarding task error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Update onboarding task
const updateOnboardingTask = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const task = await OnboardingTask.findById(id);
        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Onboarding task not found'
            });
        }

        const updatedTask = await OnboardingTask.findByIdAndUpdate(
            id,
            { $set: updates },
            { new: true, runValidators: true }
        ).populate('employeeId', 'fullName email department position')
         .populate('assignedTo', 'email profile.firstName profile.lastName');

        // Mock email notification for status changes
        if (updates.status) {
            console.log(`📧 Email Notification: Onboarding task status updated`);
            console.log(`   Task: ${updatedTask.taskName}`);
            console.log(`   New status: ${updates.status}`);
            console.log(`   Employee: ${updatedTask.employeeId.fullName}`);
            console.log(`   Assigned to: ${updatedTask.assignedTo.email}`);
        }

        res.status(200).json({
            success: true,
            message: 'Onboarding task updated successfully',
            data: { task: updatedTask }
        });
    } catch (error) {
        console.error('Update onboarding task error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Delete onboarding task (admin only)
const deleteOnboardingTask = async (req, res) => {
    try {
        const { id } = req.params;

        const task = await OnboardingTask.findByIdAndDelete(id);
        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Onboarding task not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Onboarding task deleted successfully'
        });
    } catch (error) {
        console.error('Delete onboarding task error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Update task status
const updateTaskStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const task = await OnboardingTask.findById(id);
        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Onboarding task not found'
            });
        }

        await task.updateStatus(status, req.user._id);

        const updatedTask = await OnboardingTask.findById(id)
            .populate('employeeId', 'fullName email department position')
            .populate('assignedTo', 'email profile.firstName profile.lastName');

        res.status(200).json({
            success: true,
            message: 'Task status updated successfully',
            data: { task: updatedTask }
        });
    } catch (error) {
        console.error('Update task status error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Add comment to task
const addTaskComment = async (req, res) => {
    try {
        const { id } = req.params;
        const { comment } = req.body;

        const task = await OnboardingTask.findById(id);
        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Onboarding task not found'
            });
        }

        await task.addComment(req.user._id, comment);

        const updatedTask = await OnboardingTask.findById(id)
            .populate('employeeId', 'fullName email department position')
            .populate('assignedTo', 'email profile.firstName profile.lastName')
            .populate('comments.user', 'email profile.firstName profile.lastName');

        res.status(200).json({
            success: true,
            message: 'Comment added successfully',
            data: { task: updatedTask }
        });
    } catch (error) {
        console.error('Add task comment error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Get overdue tasks
const getOverdueTasks = async (req, res) => {
    try {
        const overdueTasks = await OnboardingTask.getOverdueTasks();

        res.status(200).json({
            success: true,
            data: { tasks: overdueTasks }
        });
    } catch (error) {
        console.error('Get overdue tasks error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Get onboarding statistics
const getOnboardingStatistics = async (req, res) => {
    try {
        const { employeeId } = req.query;
        
        const stats = await OnboardingTask.getStatistics(employeeId);
        
        // Get additional statistics
        const categoryStats = await OnboardingTask.aggregate([
            ...(employeeId ? [{ $match: { employeeId: require('mongoose').Types.ObjectId(employeeId) } }] : []),
            {
                $group: {
                    _id: '$category',
                    count: { $sum: 1 },
                    completed: {
                        $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
                    }
                }
            }
        ]);

        const priorityStats = await OnboardingTask.aggregate([
            ...(employeeId ? [{ $match: { employeeId: require('mongoose').Types.ObjectId(employeeId) } }] : []),
            {
                $group: {
                    _id: '$priority',
                    count: { $sum: 1 }
                }
            }
        ]);

        res.status(200).json({
            success: true,
            data: {
                overview: stats,
                categoryBreakdown: categoryStats,
                priorityBreakdown: priorityStats
            }
        });
    } catch (error) {
        console.error('Get onboarding statistics error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Create bulk onboarding tasks
const createBulkOnboardingTasks = async (req, res) => {
    try {
        const { employeeId, tasks } = req.body;

        // Verify employee exists
        const employee = await Employee.findById(employeeId);
        if (!employee) {
            return res.status(404).json({
                success: false,
                message: 'Employee not found'
            });
        }

        const taskPromises = tasks.map(taskData => {
            const task = new OnboardingTask({
                ...taskData,
                employeeId,
                assignedTo: req.user._id
            });
            return task.save();
        });

        const createdTasks = await Promise.all(taskPromises);

        // Mock email notification
        console.log(`📧 Email Notification: Bulk onboarding tasks created`);
        console.log(`   Employee: ${employee.fullName} (${employee.email})`);
        console.log(`   Tasks created: ${createdTasks.length}`);
        console.log(`   Assigned to: ${req.user.email}`);

        res.status(201).json({
            success: true,
            message: `${createdTasks.length} onboarding tasks created successfully`,
            data: { tasks: createdTasks }
        });
    } catch (error) {
        console.error('Create bulk onboarding tasks error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

module.exports = {
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
};
