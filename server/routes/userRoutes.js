const router = require('express').Router();
const { getProfile, updateProfile } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
router.use(protect);
router.route('/profile').get(getProfile).put(updateProfile);
module.exports = router;
