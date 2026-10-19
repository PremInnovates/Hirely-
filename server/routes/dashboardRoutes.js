const router = require('express').Router();
const { getDashboard } = require('../controllers/dashboardController');
const { protect } = require('../middleware/authMiddleware');
router.use(protect);
router.get('/', getDashboard);
module.exports = router;
