const router = require('express').Router();
const { listContracts, createMilestone, updateContractStatus, listMilestones, updateMilestoneStatus } = require('../controllers/contractController');
const { createContract } = require('../controllers/hiringController');
const { protect } = require('../middleware/authMiddleware');
router.use(protect);
router.get('/', listContracts);
router.post('/', createContract);
router.patch('/:id/status', updateContractStatus); // additional lifecycle endpoint
router.get('/:id/milestones', listMilestones); // useful companion to the documented POST endpoint
router.post('/:id/milestones', createMilestone);
router.patch('/:id/milestones/:milestoneId/status', updateMilestoneStatus); // additional lifecycle endpoint
module.exports = router;
