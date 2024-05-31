const Sequelize = require('sequelize');
const sequelize = require('../config/database');

const User = require('./user')(sequelize, Sequelize.DataTypes);
const Course = require('./course')(sequelize, Sequelize.DataTypes);
const Enrollment = require('./enrollment')(sequelize, Sequelize.DataTypes);
const Content = require('./content')(sequelize, Sequelize.DataTypes);
const Quiz = require('./quiz')(sequelize, Sequelize.DataTypes);
const Question = require('./question')(sequelize, Sequelize.DataTypes);
const UserQuiz = require('./userQuiz')(sequelize, Sequelize.DataTypes);
const UserCourseProgress = require('./userCourseProgress')(sequelize, Sequelize.DataTypes);
const Thread = require('./thread')(sequelize, Sequelize.DataTypes);
const Comment = require('./comment')(sequelize, Sequelize.DataTypes);
const Notification = require('./notification')(sequelize, Sequelize.DataTypes);

User.belongsToMany(Course, { through: Enrollment, foreignKey: 'userId', onDelete: 'CASCADE' });
Course.belongsToMany(User, { through: Enrollment, foreignKey: 'courseId', onDelete: 'CASCADE' });
Course.hasMany(Content, { foreignKey: 'courseId', onDelete: 'CASCADE' });
Content.belongsTo(Course, { foreignKey: 'courseId', onDelete: 'CASCADE' });
Content.hasOne(Quiz, { foreignKey: 'contentId', onDelete: 'CASCADE' });
Quiz.belongsTo(Content, { foreignKey: 'contentId', onDelete: 'CASCADE' });
Quiz.belongsTo(Course, { foreignKey: 'courseId', onDelete: 'CASCADE' });
Quiz.hasMany(Question, { foreignKey: 'quizId', onDelete: 'CASCADE' });
Question.belongsTo(Quiz, { foreignKey: 'quizId', onDelete: 'CASCADE' });
UserQuiz.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });
UserQuiz.belongsTo(Quiz, { foreignKey: 'quizId', onDelete: 'CASCADE' });
UserCourseProgress.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });
UserCourseProgress.belongsTo(Course, { foreignKey: 'courseId', onDelete: 'CASCADE' });

// Forum associations
Thread.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });
Thread.hasMany(Comment, { foreignKey: 'threadId', onDelete: 'CASCADE' });
Comment.belongsTo(Thread, { foreignKey: 'threadId', onDelete: 'CASCADE' });
Comment.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });

// Notification association
Notification.belongsTo(User, { foreignKey: 'userId', as: 'User' });
User.hasMany(Notification, { foreignKey: 'userId', onDelete: 'CASCADE', as: 'Notifications' });

const db = {
  User,
  Course,
  Enrollment,
  Content,
  Quiz,
  Question,
  UserQuiz,
  UserCourseProgress,
  Thread,
  Comment,
  Notification,
  sequelize,
  Sequelize
};

// Use force: true only in development to recreate tables
// Use alter: true cautiously in production to update tables without losing data
db.sequelize.sync({ alter: true }).then(() => {
  console.log("All models were synchronized successfully.");
});

module.exports = db;
