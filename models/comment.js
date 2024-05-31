module.exports = (sequelize, DataTypes) => {
    const Comment = sequelize.define('Comment', {
      content: {
        type: DataTypes.TEXT,
        allowNull: false
      }
    });
  
    Comment.associate = (models) => {
      Comment.belongsTo(models.Thread);
      Comment.belongsTo(models.User);
    };
  
    return Comment;
  };
  