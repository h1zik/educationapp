const db = require('../models');
const Thread = db.Thread;
const Comment = db.Comment;
const User = db.User;

exports.viewThreads = async (req, res) => {
  try {
    const threads = await Thread.findAll({
      include: {
        model: User,
        attributes: ['username']
      }
    });
    res.render('forums/threads', { user: req.user, threads });
  } catch (err) {
    res.status(500).send('Error retrieving threads');
  }
};

exports.newThreadForm = (req, res) => {
  res.render('forums/newThread', { user: req.user });
};

exports.createThread = async (req, res) => {
  const { title, content } = req.body;
  try {
    await Thread.create({ title, content, userId: req.user.id });
    res.redirect('/forums');
  } catch (err) {
    res.status(500).send('Error creating thread');
  }
};

exports.viewThread = async (req, res) => {
  try {
    const thread = await Thread.findByPk(req.params.threadId, {
      include: [
        {
          model: User,
          attributes: ['username']
        },
        {
          model: Comment,
          include: {
            model: User,
            attributes: ['username']
          }
        }
      ]
    });
    if (!thread) {
      return res.status(404).send('Thread not found');
    }
    res.render('forums/thread', { user: req.user, thread });
  } catch (err) {
    res.status(500).send('Error retrieving thread');
  }
};

exports.createComment = async (req, res) => {
  try {
    const { content } = req.body;
    const threadId = req.params.threadId;
    const userId = req.user.id;

    await Comment.create({
      content,
      threadId,
      userId
    });

    res.redirect(`/forums/${threadId}`);
  } catch (error) {
    console.error('Error creating comment:', error);
    res.status(500).send('Error creating comment');
  }
};

exports.editThreadForm = async (req, res) => {
  try {
    const thread = await Thread.findByPk(req.params.threadId);
    if (!thread) {
      return res.status(404).send('Thread not found');
    }
    res.render('forums/editThread', { user: req.user, thread });
  } catch (err) {
    res.status(500).send('Error retrieving thread');
  }
};

exports.updateThread = async (req, res) => {
  const { title, content } = req.body;
  try {
    const thread = await Thread.findByPk(req.params.threadId);
    if (!thread) {
      return res.status(404).send('Thread not found');
    }
    thread.title = title;
    thread.content = content;
    await thread.save();
    res.redirect(`/forums/${thread.id}`);
  } catch (err) {
    res.status(500).send('Error updating thread');
  }
};

exports.deleteThread = async (req, res) => {
  try {
    const thread = await Thread.findByPk(req.params.threadId);
    if (!thread) {
      return res.status(404).send('Thread not found');
    }
    await thread.destroy();
    res.redirect('/forums');
  } catch (err) {
    res.status(500).send('Error deleting thread');
  }
};
