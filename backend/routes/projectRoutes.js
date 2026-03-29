const express = require('express');
const {
    createProject,
    updateProject,
    getProjects,
    getAllProjects,
    getMyProjects,
    getAssignedProjects,
    getProjectById,
    deleteProject,
    getApplicants,
    assignWorker,
    assignWorkerToProject,
    requestWorker,
    applyToProject,
    getMyApplications,
    markDayComplete,
    getProjectWorkHistory,
    updateProgress,
    completeProject,
    completeProjectDay,
    updateProjectApplicationStatus
} = require('../controllers/projectController');

const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');

// ─── PUBLIC ───────────────────────────────────────────────────────────────────
router.get('/', getProjects);                    // Public listings for workers

// ─── WORKER ROUTES ────────────────────────────────────────────────────────────
router.get('/all', protect, getAllProjects);                         // All public projects
router.get('/assigned', protect, authorize('worker'), getAssignedProjects);  // My assigned projects
router.get('/my-applications', protect, authorize('worker'), getMyApplications);
router.post('/apply', protect, authorize('worker'), applyToProject);
router.post('/mark-day', protect, authorize('worker'), markDayComplete);
router.get('/work-history', protect, authorize('worker'), getProjectWorkHistory);
router.put('/application/:id', protect, authorize('worker'), updateProjectApplicationStatus);

// ─── CONTRACTOR ROUTES ───────────────────────────────────────────────────────
router.get('/my', protect, authorize('contractor'), getMyProjects);
router.post('/create', protect, authorize('contractor'), createProject);
router.post('/assign', protect, authorize('contractor'), assignWorker);
router.post('/assign-worker', protect, authorize('contractor'), assignWorkerToProject); // legacy
router.post('/request-worker', protect, authorize('contractor'), requestWorker);
router.post('/update-progress', protect, authorize('contractor'), updateProgress);
router.post('/complete', protect, authorize('contractor'), completeProject);

// ─── PARAMETERIZED (must come AFTER named routes) ────────────────────────────
router.get('/:id', protect, getProjectById);
router.patch('/:id', protect, authorize('contractor'), updateProject);
router.post('/:id/complete-day', protect, authorize('contractor'), completeProjectDay);
router.get('/:id/applicants', protect, authorize('contractor'), getApplicants);
router.delete('/:id', protect, authorize('contractor'), deleteProject);

module.exports = router;
