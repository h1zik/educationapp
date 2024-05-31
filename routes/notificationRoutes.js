const express = require('express');
const { isAuthenticated } = require('../middlewares/authMiddleware');
const notificationController = require('../controllers/notificationController');
const router = express.Router();

router.get('/notifications', isAuthenticated, notificationController.getNotifications);
router.post('/notifications/markAsRead/:id', isAuthenticated, notificationController.markAsRead);

module.exports = router;
