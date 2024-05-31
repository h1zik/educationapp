const db = require('../models');
const Enrollment = db.Enrollment;

exports.checkEnrollment = async (req, res, next) => {
  const courseId = req.params.courseId;
  const userId = req.user.id;

  try {
    const enrollment = await Enrollment.findOne({ where: { courseId, userId } });

    if (!enrollment) {
      // Redirect to the course page with an error message
      return res.redirect(`/courses/${courseId}?enroll_first=true`);
    }

    next();
  } catch (err) {
    console.error('Error checking enrollment:', err);
    res.status(500).send('Error checking enrollment');
  }
};
