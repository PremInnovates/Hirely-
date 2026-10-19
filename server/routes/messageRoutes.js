const router = require('express').Router();
const { listMessages, sendMessage } = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');
router.use(protect);
router.route('/').get(listMessages).post(sendMessage);
module.exports = router;
