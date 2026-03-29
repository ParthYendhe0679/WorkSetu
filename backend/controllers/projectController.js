const Project = require('../models/Project');
const User = require('../models/User');
const WorkHistory = require('../models/WorkHistory');
const ProjectApplication = require('../models/ProjectApplication');
const DailyWorkLog = require('../models/DailyWorkLog');
const Transaction = require('../models/Transaction');

// ─────────────────────────────────────────────────────────────────────────────
// CONTRACTOR ENDPOINTS
// ─────────────────────────────────────────────────────────────────────────────

// @desc    Update project fields (isPublicPost, status, etc.)
// @route   PATCH /api/projects/:id
// @access  Private (Contractor Only)
exports.updateProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
        const ownerId = project.createdBy?.toString();
        if (ownerId !== req.user.id) {
            return res.status(401).json({ success: false, message: 'Not authorized' });
        }
        const allowedFields = ['isPublicPost', 'status', 'title', 'description', 'wagePerDay', 'totalBudget', 'duration', 'totalDays', 'totalWorkers', 'requiredSkills', 'location', 'monthlyDuration'];
        allowedFields.forEach(field => {
            if (req.body[field] !== undefined) project[field] = req.body[field];
        });
        await project.save();
        res.status(200).json({ success: true, data: project });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Create new project
// @route   POST /api/projects/create
// @access  Private (Contractor Only)
exports.createProject = async (req, res) => {
    try {
        req.body.createdBy = req.user.id;
        // Default to public post so workers can immediately see and apply!
        if (req.body.isPublicPost === undefined) {
             req.body.isPublicPost = true;
        }
        const project = await Project.create(req.body);
        res.status(201).json({ success: true, data: project });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Get all public projects (for workers to browse)
// @route   GET /api/projects
// @access  Public
exports.getProjects = async (req, res) => {
    try {
        const projects = await Project.find({ isPublicPost: true, status: { $ne: 'completed' } })
            .populate('createdBy', 'name location profileImage')
            .sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: projects.length, data: projects });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Get all projects (for workers to see applied + assigned)
// @route   GET /api/projects/all
// @access  Private
exports.getAllProjects = async (req, res) => {
    try {
        const projects = await Project.find({ isPublicPost: true })
            .populate('createdBy', 'name location profileImage')
            .sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: projects.length, data: projects });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Get my managed projects (contractor)
// @route   GET /api/projects/my
// @access  Private (Contractor Only)
exports.getMyProjects = async (req, res) => {
    try {
        const projects = await Project.find({ createdBy: req.user.id })
            .populate('assignedWorkers', 'name profileImage skills averageRating')
            .sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: projects.length, data: projects });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Get projects where I am assigned (worker)
// @route   GET /api/projects/assigned
// @access  Private (Worker Only)
exports.getAssignedProjects = async (req, res) => {
    try {
        const projects = await Project.find({ assignedWorkers: req.user.id })
            .populate('createdBy', 'name profileImage')
            .populate('assignedWorkers', 'name profileImage skills')
            .sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: projects.length, data: projects });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Get single project by ID
// @route   GET /api/projects/:id
// @access  Private
exports.getProjectById = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id)
            .populate('createdBy', 'name profileImage location')
            .populate('assignedWorkers', 'name profileImage skills averageRating completedJobs');
        if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
        res.status(200).json({ success: true, data: project });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private (Contractor Only)
exports.deleteProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
        const ownerId = project.createdBy?.toString();
        if (ownerId !== req.user.id) {
            return res.status(401).json({ success: false, message: 'Not authorized to delete this project' });
        }
        await Project.findByIdAndDelete(req.params.id);
        // Also clean up all associated data
        await ProjectApplication.deleteMany({ projectId: req.params.id });
        await DailyWorkLog.deleteMany({ projectId: req.params.id });
        res.status(200).json({ success: true, message: 'Project deleted successfully' });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Get applicants for a project
// @route   GET /api/projects/:id/applicants
// @access  Private (Contractor Only)
exports.getApplicants = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
        const ownerId = project.createdBy?.toString();
        if (ownerId !== req.user.id) {
            return res.status(401).json({ success: false, message: 'Not authorized' });
        }
        const applications = await ProjectApplication.find({ projectId: req.params.id })
            .populate('workerId', 'name profileImage skills averageRating completedJobs location')
            .sort({ appliedAt: -1 });
        res.status(200).json({ success: true, count: applications.length, data: applications });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Assign worker to project (from applicants or direct)
// @route   POST /api/projects/assign
// @access  Private (Contractor Only)
exports.assignWorker = async (req, res) => {
    try {
        const { projectId, workerId } = req.body;
        const project = await Project.findById(projectId);
        if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
        const ownerId = project.createdBy?.toString();
        if (ownerId !== req.user.id) {
            return res.status(401).json({ success: false, message: 'Not authorized' });
        }
        if (project.assignedWorkers.map(w => w.toString()).includes(workerId)) {
            return res.status(400).json({ success: false, message: 'Worker already assigned' });
        }
        project.assignedWorkers.push(workerId);
        if (project.status === 'open') project.status = 'in-progress';
        await project.save();

        // Update application status to accepted
        await ProjectApplication.findOneAndUpdate(
            { projectId, workerId },
            { status: 'accepted' }
        );

        res.status(200).json({ success: true, data: project });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Request specific worker directly (contractor invites worker)
// @route   POST /api/projects/request-worker
// @access  Private (Contractor Only)
exports.requestWorker = async (req, res) => {
    try {
        const { projectId, workerId } = req.body;
        const project = await Project.findById(projectId);
        if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
        const ownerId = project.createdBy?.toString();
        if (ownerId !== req.user.id) {
            return res.status(401).json({ success: false, message: 'Not authorized' });
        }

        // Create an application on behalf of the invite (status: pending but initiated by contractor)
        const existing = await ProjectApplication.findOne({ projectId, workerId });
        if (existing) {
            return res.status(400).json({ success: false, message: 'Request already sent to this worker' });
        }
        const application = await ProjectApplication.create({
            projectId,
            workerId,
            message: 'Direct invite from contractor',
            status: 'pending'
        });

        res.status(201).json({ success: true, data: application });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Update project status / complete with wage settlement
// @route   POST /api/projects/complete
// @access  Private (Contractor Only)
exports.completeProject = async (req, res) => {
    try {
        const { projectId, rating, comment } = req.body;
        const project = await Project.findById(projectId).populate('assignedWorkers');

        if (!project) {
            return res.status(404).json({ success: false, message: 'Project not found' });
        }

        const ownerId = project.createdBy?.toString();
        if (ownerId !== req.user.id) {
            return res.status(401).json({ success: false, message: 'Not authorized' });
        }

        if (project.status === 'completed') {
            return res.status(400).json({ success: false, message: 'Project is already completed' });
        }

        // Calculate remaining wages
        const remainingDays = Math.max(0, project.totalDays - project.completedDays);
        const assignedWorkersCount = project.assignedWorkers.length;
        const dailyWage = project.wagePerDay || 0;
        const totalPayout = remainingDays * dailyWage * assignedWorkersCount;

        // Perform wallet transfers
        const contractorUser = await User.findById(req.user.id);
        
        // Deduction from contractor
        contractorUser.wallet.balance -= totalPayout;
        await contractorUser.save();

        // Credit each worker
        for (const workerId of project.assignedWorkers) {
            const workerUser = await User.findById(workerId);
            if (!workerUser) continue;
            
            const workerPayout = remainingDays * dailyWage;
            workerUser.wallet.balance += workerPayout;
            workerUser.completedJobs += 1;
            
            // Adjust rating if provided
            if (rating) {
                workerUser.averageRating = ((workerUser.averageRating * (workerUser.completedJobs - 1)) + rating) / workerUser.completedJobs;
            }
            
            await workerUser.save();

            // Transaction for worker
            await Transaction.create({
                userId: workerId,
                amount: workerPayout,
                type: 'credit',
                status: 'completed',
                relatedTo: project._id,
                onModel: 'Project',
                description: `Final payout for project: ${project.title}`
            });
        }

        // Transaction for contractor
        if (totalPayout > 0) {
            await Transaction.create({
                userId: req.user.id,
                amount: totalPayout,
                type: 'debit',
                status: 'completed',
                relatedTo: project._id,
                onModel: 'Project',
                description: `Settlement for project completion: ${project.title}`
            });
        }

        // Update Project status
        project.status = 'completed';
        project.completedDays = project.totalDays;
        await project.save();

        res.status(200).json({
            success: true,
            message: 'Project completed and wages settled successfully',
            data: {
                project,
                payoutDetails: {
                    totalPayout,
                    remainingDays,
                    workersPaid: assignedWorkersCount
                }
            }
        });

    } catch (error) {
        console.error("Completion error:", error);
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Complete a daily work cycle for selected assigned workers
// @route   POST /api/projects/:id/complete-day
// @access  Private (Contractor Only)
exports.completeProjectDay = async (req, res) => {
    try {
        const { presentWorkerIds } = req.body;
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ success: false, message: 'Project not found' });
        }

        const ownerId = project.createdBy?.toString();
        if (ownerId !== req.user.id) {
            return res.status(401).json({ success: false, message: 'Not authorized' });
        }

        if (project.status === 'completed') {
            return res.status(400).json({ success: false, message: 'Project is already completed' });
        }

        if (!presentWorkerIds || presentWorkerIds.length === 0) {
            return res.status(400).json({ success: false, message: 'No workers selected for today' });
        }

        const today = new Date().toISOString().split('T')[0];
        const dailyWage = project.wagePerDay || 0;
        const totalPayout = dailyWage * presentWorkerIds.length;

        // Ensure every workerId is a valid string (handle populated objects)
        const workerIdStrings = presentWorkerIds.map(wid =>
            typeof wid === 'object' ? wid._id?.toString() || wid.toString() : wid
        );

        // Check if any of these workers are already paid for today (skip duplicates gracefully)
        const alreadyPaidWorkers = [];
        const workersToPay = [];
        for (const workerId of workerIdStrings) {
            const existingLog = await DailyWorkLog.findOne({ workerId, projectId: project._id, date: today });
            if (existingLog) {
                alreadyPaidWorkers.push(workerId);
            } else {
                workersToPay.push(workerId);
            }
        }

        if (workersToPay.length === 0) {
            return res.status(400).json({ 
                success: false, 
                message: `This worker has already been paid for today (${today}). You can only pay once per day per worker.`
            });
        }

        // Calculate actual payout for workers not yet paid today
        const actualPayout = dailyWage * workersToPay.length;

        // Deduct from contractor (allow the payment to go through even if balance goes negative - admin can top up)
        await User.findByIdAndUpdate(req.user.id, {
            $inc: { 'wallet.balance': -actualPayout }
        });

        if (actualPayout > 0) {
            await Transaction.create({
                userId: req.user.id,
                amount: actualPayout,
                type: 'debit',
                status: 'completed',
                relatedTo: project._id,
                onModel: 'Project',
                description: `Daily wage payout for ${workersToPay.length} worker(s) on project: ${project.title} (${today})`
            });
        }

        // Credit to each worker not yet paid today
        for (const workerId of workersToPay) {
            const workerExists = await User.exists({ _id: workerId });
            if (!workerExists) continue;

            await User.findByIdAndUpdate(workerId, {
                $inc: { 'wallet.balance': dailyWage }
            });

            await DailyWorkLog.create({
                workerId,
                projectId: project._id,
                date: today,
                wage: dailyWage,
                status: 'credited'
            });

            await Transaction.create({
                userId: workerId,
                amount: dailyWage,
                type: 'credit',
                status: 'completed',
                relatedTo: project._id,
                onModel: 'Project',
                description: `Daily wage for project: ${project.title} (${today})`
            });
        }

        // Progress update
        const newCompletedDays = project.completedDays + 1;
        const newStatus = (newCompletedDays >= project.totalDays) ? 'completed' : project.status;

        const updatedProject = await Project.findByIdAndUpdate(
            project._id,
            { $set: { completedDays: newCompletedDays, status: newStatus } },
            { new: true }
        ).populate('assignedWorkers', 'name profileImage skills averageRating');

        res.status(200).json({
            success: true,
            message: `✅ Successfully paid ${workersToPay.length} worker(s) ₹${dailyWage} each.`,
            data: updatedProject
        });

    } catch (error) {
        console.error("Complete Day error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// WORKER ENDPOINTS
// ─────────────────────────────────────────────────────────────────────────────

// @desc    Worker applies to a public project
// @route   POST /api/projects/apply
// @access  Private (Worker Only)
exports.applyToProject = async (req, res) => {
    try {
        const { projectId } = req.body;
        const project = await Project.findById(projectId);
        if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
        if (!project.isPublicPost) return res.status(400).json({ success: false, message: 'This project is not open for applications' });

        const existing = await ProjectApplication.findOne({ projectId, workerId: req.user.id });
        if (existing) return res.status(400).json({ success: false, message: 'You have already applied to this project' });

        const application = await ProjectApplication.create({
            projectId,
            workerId: req.user.id,
            status: 'pending'
        });

        res.status(201).json({ success: true, data: application });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Get my applications (worker view)
// @route   GET /api/projects/my-applications
// @access  Private (Worker Only)
exports.getMyApplications = async (req, res) => {
    try {
        const applications = await ProjectApplication.find({ workerId: req.user.id })
            .populate('projectId', 'title description wagePerDay duration requiredSkills status location');
        res.status(200).json({ success: true, data: applications });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Worker marks a day complete → wage credited to wallet
// @route   POST /api/projects/mark-day
// @access  Private (Worker Only)
exports.markDayComplete = async (req, res) => {
    try {
        const { projectId } = req.body;
        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

        const project = await Project.findById(projectId);
        if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

        // Check if this worker is in assignedWorkers
        const isAssigned = project.assignedWorkers.map(w => w.toString()).includes(req.user.id);
        if (!isAssigned) {
            return res.status(403).json({ success: false, message: 'You are not assigned to this project' });
        }

        // Prevent duplicate for same date
        const existing = await DailyWorkLog.findOne({ workerId: req.user.id, projectId, date: today });
        if (existing) {
            return res.status(400).json({ success: false, message: 'You already marked today as complete' });
        }

        const wage = project.wagePerDay;

        // Create daily log
        const log = await DailyWorkLog.create({
            workerId: req.user.id,
            projectId,
            date: today,
            wage,
            status: 'credited'
        });

        // Credit wage to worker wallet
        const worker = await User.findById(req.user.id);
        worker.wallet.balance += wage;
        await worker.save();

        // Create a transaction record
        await Transaction.create({
            userId: req.user.id,
            amount: wage,
            type: 'credit',
            status: 'completed',
            relatedTo: project._id,
            onModel: 'Project',
            description: `Daily wage for project: ${project.title} (${today})`
        });

        res.status(201).json({
            success: true,
            message: `Day marked! ₹${wage} credited to your wallet.`,
            data: log
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Get worker's project work history (all daily logs)
// @route   GET /api/projects/work-history
// @access  Private (Worker Only)
exports.getProjectWorkHistory = async (req, res) => {
    try {
        const logs = await DailyWorkLog.find({ workerId: req.user.id })
            .populate('projectId', 'title description wagePerDay location status')
            .sort({ date: -1 });

        // Group by project for summary
        const projectSummary = {};
        logs.forEach(log => {
            const pid = log.projectId?._id?.toString();
            if (!pid) return;
            if (!projectSummary[pid]) {
                projectSummary[pid] = {
                    project: log.projectId,
                    daysWorked: 0,
                    totalEarned: 0,
                    logs: []
                };
            }
            projectSummary[pid].daysWorked += 1;
            projectSummary[pid].totalEarned += log.wage;
            projectSummary[pid].logs.push(log);
        });

        res.status(200).json({
            success: true,
            data: Object.values(projectSummary),
            logs
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Assign worker (existing old route — kept for compatibility)
// @route   POST /api/projects/assign-worker
// @access  Private (Contractor Only)
exports.assignWorkerToProject = async (req, res) => {
    return exports.assignWorker(req, res);
};

// @desc    Update project progress
// @route   POST /api/projects/update-progress
// @access  Private (Contractor Only)
exports.updateProgress = async (req, res) => {
    try {
        const { projectId, completedDays } = req.body;
        const project = await Project.findById(projectId);
        if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
        const ownerId = project.createdBy?.toString();
        if (ownerId !== req.user.id) {
            return res.status(401).json({ success: false, message: 'Not authorized' });
        }
        project.completedDays = completedDays;
        await project.save();
        res.status(200).json({ success: true, data: project });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Worker accepts or rejects a project invitation
// @route   PUT /api/projects/application/:id
// @access  Private (Worker Only)
exports.updateProjectApplicationStatus = async (req, res) => {
    try {
        const { status } = req.body; // 'accepted' or 'rejected'
        const application = await ProjectApplication.findById(req.params.id);

        if (!application) {
            return res.status(404).json({ success: false, message: 'Application not found' });
        }

        // Verify worker
        if (application.workerId.toString() !== req.user.id) {
            return res.status(401).json({ success: false, message: 'Not authorized' });
        }

        application.status = status;
        await application.save();

        // If accepted, add worker to project
        if (status === 'accepted') {
            const project = await Project.findById(application.projectId);
            if (!project.assignedWorkers.includes(req.user.id)) {
                project.assignedWorkers.push(req.user.id);
                if (project.status === 'open') project.status = 'in-progress';
                await project.save();
            }
        }

        res.status(200).json({
            success: true,
            message: `Invitation ${status} successfully`,
            data: application
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
