const db = require('../models');
const User = db.User;
const Course = db.Course;
const Enrollment = db.Enrollment;
const Content = db.Content;
const Quiz = db.Quiz;
const Question = db.Question;
const UserQuiz = db.UserQuiz; // Add this line
const UserCourseProgress = db.UserCourseProgress; // Add this line
const Notification = db.Notification; // Add this line
const bcrypt = require('bcryptjs');

exports.viewProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    res.render('user/profile', { user });
  } catch (err) {
    res.status(500).send('Error retrieving user profile');
  }
};

exports.updateProfile = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const user = await User.findByPk(req.user.id);
    user.username = username;
    user.email = email;
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }
    await user.save();
    res.redirect('/profile');
  } catch (err) {
    res.status(500).send('Error updating profile');
  }
};

exports.deleteAccount = async (req, res) => {
    const transaction = await db.sequelize.transaction();
    try {
      const userId = req.user.id;
      console.log(`Deleting account for user ID: ${userId}`);
  
      // Delete related data
      await UserQuiz.destroy({ where: { userId: userId }, transaction });
      console.log('Deleted user quizzes');
      
      await Enrollment.destroy({ where: { userId: userId }, transaction });
      console.log('Deleted user enrollments');
      
      await UserCourseProgress.destroy({ where: { userId: userId }, transaction });
      console.log('Deleted user course progress');
  
      // Delete the user account
      await User.destroy({ where: { id: userId }, transaction });
      console.log('Deleted user account');
  
      await transaction.commit();
      res.clearCookie('token');
      res.redirect('/register');
    } catch (err) {
      await transaction.rollback();
      console.error('Error deleting account:', err);
      res.status(500).send('Error deleting account');
    }
  };
  

exports.viewCourses = async (req, res) => {
  try {
    const courses = await Course.findAll();
    const enrollments = await Enrollment.findAll({ where: { userId: req.user.id } });
    const enrolledCourseIds = enrollments.map(enrollment => enrollment.courseId);

    res.render('user/courses', { user: req.user, courses, enrolledCourseIds });
  } catch (err) {
    res.status(500).send('Error retrieving courses');
  }
};

exports.enrollInCourse = async (req, res) => {
  const { id } = req.params;
  try {
    // Find the course by ID
    const course = await Course.findByPk(id);

    if (!course) {
      return res.status(404).send('Course not found');
    }

    // Enroll the user in the course
    await Enrollment.create({ userId: req.user.id, courseId: id });

    // Create a notification
    await Notification.create({
      userId: req.user.id,
      message: `You have successfully enrolled in ${course.title}.`
    });

    res.redirect('/courses/enrolled');
  } catch (err) {
    console.error('Error enrolling in course:', err);
    res.status(500).send('Error enrolling in course');
  }
};

exports.viewEnrolledCourses = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      include: {
        model: Course,
        through: {
          attributes: []
        }
      }
    });
    res.render('user/enrolledCourses', { user, courses: user.Courses });
  } catch (err) {
    res.status(500).send('Error retrieving enrolled courses');
  }
};

exports.viewCourseContents = async (req, res) => {
    try {
      const courseId = req.params.courseId;
      const enrollFirst = req.query.enroll_first;
      console.log(`Fetching course with ID: ${courseId}`);
      const course = await Course.findByPk(courseId, {
        include: {
          model: Content,
          include: [Quiz]
        }
      });
  
      if (!course) {
        console.error(`Course with ID ${courseId} not found`);
        return res.status(404).send('Course not found');
      }
  
      console.log('Course:', JSON.stringify(course, null, 2));
      res.render('user/courseContents', { user: req.user, course, contents: course.Contents, enrollFirst });
    } catch (err) {
      console.error('Error retrieving course contents:', err);
      res.status(500).send('Error retrieving course contents');
    }
  };
  
  

  exports.viewQuiz = async (req, res) => {
    try {
      const quiz = await Quiz.findByPk(req.params.quizId, {
        include: [Question]
      });
  
      if (!quiz) {
        console.error('Quiz not found');
        return res.status(404).send('Quiz not found');
      }
  
      // Check if user has already taken the quiz
      const userQuiz = await UserQuiz.findOne({
        where: {
          userId: req.user.id,
          quizId: req.params.quizId
        }
      });
  
      if (userQuiz) {
        console.log(`User has already taken quiz with ID ${req.params.quizId}`);
        return res.redirect(`/courses/${quiz.courseId}/quizzes/${quiz.id}/result`);
      }
  
      // Parse options as JSON
      quiz.Questions.forEach(question => {
        question.options = JSON.parse(question.options); // Correctly parse JSON
      });
  
      res.render('user/quiz', { user: req.user, quiz });
    } catch (err) {
      console.error('Error retrieving quiz:', err);
      res.status(500).send('Error retrieving quiz');
    }
  };
  
  
  
  

  exports.submitQuiz = async (req, res) => {
    const { answers } = req.body;
    try {
      const quiz = await Quiz.findByPk(req.params.quizId, {
        include: [Question]
      });
  
      if (!quiz) {
        return res.status(404).send('Quiz not found');
      }
  
      let score = 0;
      quiz.Questions.forEach((question, index) => {
        console.log(`Question ID: ${question.id}, Correct Answer: ${question.answer}, User Answer: ${parseInt(answers[index])}`);
        if (question.answer === parseInt(answers[index])) {
          score++;
        }
      });
  
      // Record the quiz attempt
      await UserQuiz.create({
        userId: req.user.id,
        quizId: req.params.quizId,
        score: score
      });
  
      // Update progress tracking
      let progress = await UserCourseProgress.findOne({
        where: {
          userId: req.user.id,
          courseId: quiz.courseId
        }
      });
  
      if (!progress) {
        // Calculate total quizzes in the course
        const totalQuizzes = await Quiz.count({
          where: {
            courseId: quiz.courseId
          }
        });
  
        progress = await UserCourseProgress.create({
          userId: req.user.id,
          courseId: quiz.courseId,
          quizzesCompleted: 1,
          totalQuizzes: totalQuizzes
        });
      } else {
        progress.quizzesCompleted += 1;
        await progress.save();
      }
  
      res.render('user/quizResult', { user: req.user, quiz, score, total: quiz.Questions.length });
    } catch (err) {
      console.error('Error submitting quiz:', err);
      res.status(500).send('Error submitting quiz');
    }
  };

  exports.viewQuizResult = async (req, res) => {
    try {
      const quiz = await Quiz.findByPk(req.params.quizId, {
        include: [Question]
      });
  
      const userQuiz = await UserQuiz.findOne({
        where: {
          userId: req.user.id,
          quizId: req.params.quizId
        }
      });
  
      if (!userQuiz) {
        console.error(`UserQuiz not found for user ID ${req.user.id} and quiz ID ${req.params.quizId}`);
        return res.redirect(`/courses/${quiz.courseId}/quizzes/${quiz.id}`);
      }
  
      res.render('user/quizResult', {
        user: req.user,
        quiz,
        score: userQuiz.score,
        total: quiz.Questions.length
      });
    } catch (err) {
      console.error('Error retrieving quiz result:', err);
      res.status(500).send('Error retrieving quiz result');
    }
  };
  exports.viewCourseProgress = async (req, res) => {
    try {
      const progress = await UserCourseProgress.findAll({
        where: {
          userId: req.user.id
        },
        include: [Course]
      });
  
      res.render('user/courseProgress', { user: req.user, progress });
    } catch (err) {
      console.error('Error retrieving course progress:', err);
      res.status(500).send('Error retrieving course progress');
    }
  };

  exports.getUnreadNotificationsCount = async (req, res, next) => {
    try {
      const unreadCount = await Notification.count({
        where: {
          userId: req.user.id,
          read: false
        }
      });
      req.user.unreadNotificationsCount = unreadCount;
      next();
    } catch (err) {
      console.error('Error fetching unread notifications count:', err);
      next();
    }
  };
  
  
  
  
