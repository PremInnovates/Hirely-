const router = require('express').Router();
const { listFreelancers, getFreelancer } = require('../controllers/freelancerController');
const { protect } = require('../middleware/authMiddleware');
router.use(protect);
router.get('/', listFreelancers);
router.get('/:id', getFreelancer);
module.exports = router;
