const express = require('express');
const router = express.Router();
const forumController = require('../controllers/forumController');
const { isAuthenticated } = require('../middlewares/authMiddleware');

router.get('/forums', forumController.viewThreads);
router.get('/forums/new', isAuthenticated, forumController.newThreadForm);
router.post('/forums/new', isAuthenticated, forumController.createThread);
router.get('/forums/:threadId', forumController.viewThread);
router.post('/forums/:threadId/comments', isAuthenticated, forumController.createComment);
router.get('/forums/:threadId/edit', isAuthenticated, forumController.editThreadForm);
router.post('/forums/:threadId/edit', isAuthenticated, forumController.updateThread);
router.post('/forums/:threadId/delete', isAuthenticated, forumController.deleteThread);

module.exports = router;
