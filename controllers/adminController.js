const db = require('../models');
const Course = db.Course;
const Content = db.Content;
const Quiz = db.Quiz;
const UserQuiz = db.UserQuiz;
const Question = db.Question;

exports.viewCourses = async (req, res) => {
  try {
    const courses = await Course.findAll();
    res.render('admin/courses', { user: req.user, courses });
  } catch (err) {
    res.status(500).send('Error retrieving courses');
  }
};

exports.createCourse = async (req, res) => {
  const { title, description } = req.body;
  try {
    await Course.create({ title, description });
    res.redirect('/admin/courses');
  } catch (err) {
    res.status(500).send('Error creating course');
  }
};

exports.editCourse = async (req, res) => {
    try {
      const courseId = req.params.courseId;
      const course = await Course.findByPk(courseId);
  
      if (!course) {
        return res.status(404).send('Course not found');
      }
  
      res.render('admin/editCourse', { user: req.user, course });
    } catch (err) {
      console.error('Error retrieving course:', err);
      res.status(500).send('Error retrieving course');
    }
  };

  exports.updateCourse = async (req, res) => {
    try {
      const courseId = req.params.courseId;
      const { title, description } = req.body;
      const course = await Course.findByPk(courseId);
  
      if (!course) {
        return res.status(404).send('Course not found');
      }
  
      course.title = title;
      course.description = description;
      await course.save();
  
      res.redirect('/admin/courses');
    } catch (err) {
      console.error('Error updating course:', err);
      res.status(500).send('Error updating course');
    }
  };

exports.deleteCourse = async (req, res) => {
    const transaction = await db.sequelize.transaction();
    try {
      const courseId = req.params.courseId;
  
      // Find all quizzes related to the course
      const quizzes = await Quiz.findAll({
        where: {
          courseId: courseId
        }
      });
  
      // Delete all user quizzes related to the quizzes
      for (const quiz of quizzes) {
        await UserQuiz.destroy({
          where: {
            quizId: quiz.id
          },
          transaction
        });
      }
  
      // Delete all quizzes related to the course
      await Quiz.destroy({
        where: {
          courseId: courseId
        },
        transaction
      });
  
      // Delete all contents related to the course
      await Content.destroy({
        where: {
          courseId: courseId
        },
        transaction
      });
  
      // Delete the course
      await Course.destroy({
        where: {
          id: courseId
        },
        transaction
      });
  
      await transaction.commit();
      res.redirect('/admin/courses');
    } catch (err) {
      await transaction.rollback();
      console.error('Error deleting course:', err);
      res.status(500).send('Error deleting course');
    }
  };
  
  

exports.viewContents = async (req, res) => {
    try {
      const course = await Course.findByPk(req.params.courseId, {
        include: {
          model: Content,
          include: [Quiz] // Ensure quizzes are included in the content
        }
      });
  
      if (!course) {
        throw new Error('Course not found');
      }
  
      res.render('admin/contents', { user: req.user, course });
    } catch (err) {
      console.error(err); // Log the error details
      res.status(500).send('Error retrieving contents');
    }
  };
  
  

exports.newContentForm = (req, res) => {
  res.render('admin/newContent', { user: req.user, courseId: req.params.courseId });
};

exports.createContent = async (req, res) => {
    const { title, type, url, text, quizTitle } = req.body;
    try {
      const content = await Content.create({ title, type, url, text, courseId: req.params.courseId });
  
      // If the content type is quiz, create a corresponding quiz
      if (type === 'quiz') {
        await Quiz.create({ title: quizTitle, courseId: req.params.courseId, contentId: content.id });
      }
  
      res.redirect(`/admin/courses/${req.params.courseId}/contents`);
    } catch (err) {
      res.status(500).send('Error creating content');
    }
  };

exports.editContentForm = async (req, res) => {
  try {
    const content = await Content.findByPk(req.params.id);
    res.render('admin/editContent', { user: req.user, content });
  } catch (err) {
    res.status(500).send('Error retrieving content');
  }
};

exports.updateContent = async (req, res) => {
  const { title, type, url, text } = req.body;
  try {
    const content = await Content.findByPk(req.params.id);
    content.title = title;
    content.type = type;
    content.url = url;
    content.text = text;
    await content.save();
    res.redirect(`/admin/courses/${req.params.courseId}/contents`);
  } catch (err) {
    res.status(500).send('Error updating content');
  }
};

exports.deleteContent = async (req, res) => {
    const transaction = await db.sequelize.transaction();
    try {
      const contentId = req.params.contentId;
      console.log(`Attempting to delete content with ID: ${contentId}`);
  
      // Find the content to check its type
      const content = await Content.findByPk(contentId);
      if (!content) {
        console.error('Content not found');
        return res.status(404).send('Content not found');
      }
  
      // If the content is a quiz, delete related UserQuiz entries and Quiz
      if (content.type === 'quiz') {
        const quiz = await Quiz.findOne({ where: { contentId: contentId } });
  
        if (quiz) {
          await UserQuiz.destroy({
            where: {
              quizId: quiz.id
            },
            transaction
          });
  
          await Quiz.destroy({
            where: {
              id: quiz.id
            },
            transaction
          });
        }
      }
  
      // Delete the content
      await Content.destroy({
        where: {
          id: contentId
        },
        transaction
      });
  
      await transaction.commit();
      res.redirect(`/admin/courses/${content.courseId}/contents`);
    } catch (err) {
      await transaction.rollback();
      console.error('Error deleting content:', err);
      res.status(500).send('Error deleting content');
    }
  };
  

// Quiz management
exports.viewQuizzes = async (req, res) => {
    try {
      const courseId = req.params.courseId;
      console.log(`Retrieving quizzes for course ID: ${courseId}`); // Log the course ID
  
      const course = await Course.findByPk(courseId, {
        include: {
          model: Content,
          include: [Quiz]
        }
      });
  
      if (!course) {
        console.error(`Course with ID ${courseId} not found`);
        throw new Error('Course not found');
      }
  
      res.render('admin/contents', { user: req.user, course });
    } catch (err) {
      console.error('Error retrieving quizzes:', err); // Enhanced error logging
      res.status(500).send('Error retrieving quizzes');
    }
  };

exports.newQuizForm = (req, res) => {
  res.render('admin/newQuiz', { user: req.user, courseId: req.params.courseId });
};

exports.createQuiz = async (req, res) => {
  const { title } = req.body;
  try {
    await Quiz.create({ title, courseId: req.params.courseId });
    res.redirect(`/admin/courses/${req.params.courseId}/quizzes`);
  } catch (err) {
    res.status(500).send('Error creating quiz');
  }
};

exports.editQuizForm = async (req, res) => {
  try {
    const quiz = await Quiz.findByPk(req.params.id);
    res.render('admin/editQuiz', { user: req.user, quiz });
  } catch (err) {
    res.status(500).send('Error retrieving quiz');
  }
};

exports.updateQuiz = async (req, res) => {
  const { title } = req.body;
  try {
    const quiz = await Quiz.findByPk(req.params.id);
    quiz.title = title;
    await quiz.save();
    res.redirect(`/admin/courses/${req.params.courseId}/quizzes`);
  } catch (err) {
    res.status(500).send('Error updating quiz');
  }
};

exports.deleteQuiz = async (req, res) => {
  try {
    await Quiz.destroy({ where: { id: req.params.id } });
    res.redirect(`/admin/courses/${req.params.courseId}/quizzes`);
  } catch (err) {
    res.status(500).send('Error deleting quiz');
  }
};

// Question management
exports.newQuestionForm = (req, res) => {
  res.render('admin/newQuestion', { user: req.user, quizId: req.params.quizId });
};

exports.getQuizQuestions = async (req, res) => {
    const quizId = req.params.quizId;
    try {
      const quiz = await Quiz.findByPk(quizId, {
        include: [Question]
      });
  
      if (!quiz) {
        return res.status(404).send('Quiz not found');
      }
  
      res.render('admin/quizQuestions', { user: req.user, quiz });
    } catch (err) {
      console.error('Error retrieving quiz questions:', err);
      res.status(500).send('Error retrieving quiz questions');
    }
  };
  
  

exports.createQuestion = async (req, res) => {
    const { text, option1, option2, option3, option4, answer } = req.body;
    const quizId = req.params.quizId; // Make sure this is defined correctly
  
    try {
      const options = [option1, option2, option3, option4];
      await Question.create({
        text,
        options, // No need to serialize, Sequelize handles it
        answer,
        quizId
      });
  
      // Retrieve the quiz to get the courseId
      const quiz = await Quiz.findByPk(quizId);
      const courseId = quiz.courseId;
  
      // Redirect to the course contents page
      res.redirect(`/admin/courses/${courseId}/contents`);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error creating question');
    }
  };
  

  exports.editQuestionForm = async (req, res) => {
    try {
      const question = await Question.findByPk(req.params.id);
      if (!question) {
        return res.status(404).send('Question not found');
      }
      
      // Parse the options before passing them to the view
      const options = JSON.parse(question.options);
  
      res.render('admin/editQuestion', { user: req.user, question, options });
    } catch (err) {
      res.status(500).send('Error retrieving question');
    }
  };
  

  exports.updateQuestion = async (req, res) => {
    const { text, option1, option2, option3, option4, answer } = req.body;
    try {
      const options = [option1, option2, option3, option4];
      const question = await Question.findByPk(req.params.id);
  
      if (!question) {
        return res.status(404).send('Question not found');
      }
  
      question.text = text;
      question.options = JSON.stringify(options);
      question.answer = answer;
      await question.save();
  
      res.redirect(`/admin/quizzes/${question.quizId}/questions`);
    } catch (err) {
      console.error('Error updating question:', err);
      res.status(500).send('Error updating question');
    }
  };

  exports.deleteQuestion = async (req, res) => {
    try {
      const quizId = req.params.quizId;
      await Question.destroy({ where: { id: req.params.id } });
      res.redirect(`/admin/quizzes/${quizId}/questions`);
    } catch (err) {
      res.status(500).send('Error deleting question');
    }
  };
  
