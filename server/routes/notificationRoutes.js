const router = require('express').Router();
const { listNotifications } = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');
router.use(protect);
router.get('/', listNotifications);
module.exports = router;
