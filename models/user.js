module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'user'
      }
    });
  
    User.associate = (models) => {
      User.hasMany(models.Enrollment, { foreignKey: 'userId', onDelete: 'CASCADE' });
      User.hasMany(models.UserQuiz, { foreignKey: 'userId', onDelete: 'CASCADE' });
      User.hasMany(models.UserCourseProgress, { foreignKey: 'userId', onDelete: 'CASCADE' });
      User.hasMany(models.Notification, { foreignKey: 'userId', onDelete: 'CASCADE', as: 'Notifications' });
    };
  
    return User;
  };
  