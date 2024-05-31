const express = require('express');
const { isAuthenticated, isAdmin } = require('../middlewares/authMiddleware');
const adminController = require('../controllers/adminController');
const router = express.Router();

router.get('/dashboard', isAuthenticated, isAdmin, (req, res) => {
  res.render('admin/dashboard', { user: req.user });
});

router.get('/courses', isAuthenticated, isAdmin, adminController.viewCourses);
router.get('/courses/new', isAuthenticated, isAdmin, (req, res) => {
  res.render('admin/newCourse', { user: req.user });
});
router.post('/courses', isAuthenticated, isAdmin, adminController.createCourse);
router.get('/courses/:courseId/edit', isAuthenticated, isAdmin, adminController.editCourse);
router.post('/courses/:courseId/edit', isAuthenticated, isAdmin, adminController.updateCourse);
router.post('/courses/:courseId/delete', isAuthenticated, isAdmin, adminController.deleteCourse);

// Content management routes
router.get('/courses/:courseId/contents', isAuthenticated, isAdmin, adminController.viewContents);
router.get('/courses/:courseId/contents/new', isAuthenticated, isAdmin, adminController.newContentForm);
router.post('/courses/:courseId/contents', isAuthenticated, isAdmin, adminController.createContent);
router.get('/courses/:courseId/contents/edit/:id', isAuthenticated, isAdmin, adminController.editContentForm);
router.post('/courses/:courseId/contents/edit/:id', isAuthenticated, isAdmin, adminController.updateContent);
router.post('/courses/:courseId/contents/:contentId/delete', isAuthenticated, isAdmin, adminController.deleteContent);

router.get('/courses/:courseId/quizzes', isAuthenticated, isAdmin, adminController.viewQuizzes);
router.get('/courses/:courseId/quizzes/new', isAuthenticated, isAdmin, adminController.newQuizForm);
router.post('/courses/:courseId/quizzes', isAuthenticated, isAdmin, adminController.createQuiz);
router.get('/courses/:courseId/quizzes/edit/:id', isAuthenticated, isAdmin, adminController.editQuizForm);
router.post('/courses/:courseId/quizzes/edit/:id', isAuthenticated, isAdmin, adminController.updateQuiz);
router.post('/courses/:courseId/quizzes/delete/:id', isAuthenticated, isAdmin, adminController.deleteQuiz);

router.get('/quizzes/:quizId/questions', isAuthenticated, isAdmin, adminController.getQuizQuestions);
router.get('/quizzes/:quizId/questions/new', isAuthenticated, isAdmin, adminController.newQuestionForm);
router.post('/quizzes/:quizId/questions', isAuthenticated, isAdmin, adminController.createQuestion);
router.get('/quizzes/:quizId/questions/edit/:id', isAuthenticated, isAdmin, adminController.editQuestionForm);
router.post('/quizzes/:quizId/questions/edit/:id', isAuthenticated, isAdmin, adminController.updateQuestion);
router.post('/quizzes/:quizId/questions/delete/:id', isAuthenticated, isAdmin, adminController.deleteQuestion);

module.exports = router;
