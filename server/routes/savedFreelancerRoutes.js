const router = require('express').Router();
const { listSaved, saveFreelancer, removeSaved } = require('../controllers/savedFreelancerController');
const { protect } = require('../middleware/authMiddleware');
router.use(protect);
router.route('/').get(listSaved).post(saveFreelancer).delete(removeSaved);
module.exports = router;
