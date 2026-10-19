const router = require('express').Router();
const { listHiringRequests, createHiringRequest, updateHiringRequestStatus, createContract } = require('../controllers/hiringController');
const { protect } = require('../middleware/authMiddleware');
router.use(protect);
router.get('/', listHiringRequests);
router.post('/', createHiringRequest);
// Additional lifecycle endpoint required to accept/reject a request before contract creation.
router.patch('/:id/status', updateHiringRequestStatus);
module.exports = router;
