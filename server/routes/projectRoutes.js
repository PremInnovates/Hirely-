const router = require('express').Router();
const { listProjects, createProject, getProject, updateProject, deleteProject } = require('../controllers/projectController');
const { protect, authorize } = require('../middleware/authMiddleware');
router.use(protect);
router.route('/').get(listProjects).post(authorize('BUSINESS_OWNER'), createProject);
router.route('/:id').get(getProject).put(authorize('BUSINESS_OWNER'), updateProject).delete(authorize('BUSINESS_OWNER'), deleteProject);
module.exports = router;
