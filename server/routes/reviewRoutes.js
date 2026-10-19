const router = require('express').Router();
const { createReview } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');
router.use(protect);
router.post('/', createReview);
module.exports = router;
