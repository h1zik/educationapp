const express = require('express');
const { isAuthenticated } = require('../middlewares/authMiddleware');
const { checkEnrollment } = require('../middlewares/enrollmentMiddleware');
const userController = require('../controllers/userController');
const router = express.Router();

router.get('/dashboard', isAuthenticated, (req, res) => {
  res.render('user/dashboard', { user: req.user });
});

router.get('/profile', isAuthenticated, userController.viewProfile);
router.post('/profile', isAuthenticated, userController.updateProfile);
router.post('/profile/delete', isAuthenticated, userController.deleteAccount);
router.get('/courses', isAuthenticated, userController.viewCourses);
router.post('/courses/enroll/:id', isAuthenticated, userController.enrollInCourse);
router.get('/courses/enrolled', isAuthenticated, userController.viewEnrolledCourses);
router.get('/courses/:courseId/contents', isAuthenticated, checkEnrollment, userController.viewCourseContents);

router.get('/courses/:courseId/quizzes/:quizId', isAuthenticated, checkEnrollment, userController.viewQuiz);
router.post('/courses/:courseId/quizzes/:quizId/submit', isAuthenticated, checkEnrollment, userController.submitQuiz);
router.get('/courses/:courseId/quizzes/:quizId/result', isAuthenticated, checkEnrollment, userController.viewQuizResult);
router.get('/courses/progress', isAuthenticated, userController.viewCourseProgress);

module.exports = router;