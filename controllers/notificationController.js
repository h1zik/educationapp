const db = require('../models');
const Notification = db.Notification;

exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']]
    });
    res.render('user/notifications', { user: req.user, notifications });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).send('Error fetching notifications');
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });

    if (notification) {
      notification.read = true;
      await notification.save();
    }

    res.redirect('/notifications');
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).send('Error marking notification as read');
  }
};
