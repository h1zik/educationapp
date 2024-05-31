module.exports = (sequelize, DataTypes) => {
    const Content = sequelize.define('Content', {
      title: {
        type: DataTypes.STRING,
        allowNull: false
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false
      },
      url: {
        type: DataTypes.STRING,
        allowNull: true
      },
      text: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      courseId: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    });
  
    Content.associate = (models) => {
      Content.belongsTo(models.Course, { foreignKey: 'courseId' });
      Content.hasOne(models.Quiz, { foreignKey: 'contentId' });
    };
  
    return Content;
  };
  