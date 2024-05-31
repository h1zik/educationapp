const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const jwt = require('jsonwebtoken');
const db = require('./models');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const forumRoutes = require('./routes/forumRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const { isAuthenticated } = require('./middlewares/authMiddleware');
const { getUnreadNotificationsCount } = require('./controllers/userController');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('public'));
app.use(express.json());
app.set('view engine', 'ejs');

// Middleware to ensure user is available in all views
app.use((req, res, next) => {
  const token = req.cookies.token;
  if (token) {
    jwt.verify(token, 'your_jwt_secret', (err, decoded) => {
      if (!err) {
        req.user = decoded;
        res.locals.user = req.user;
      }
      next();
    });
  } else {
    next();
  }
});

db.sequelize.sync();

// Middleware to fetch unread notifications count
app.use((req, res, next) => {
  if (req.user) {
    return getUnreadNotificationsCount(req, res, next);
  }
  next();
});

// Routes
app.use(authRoutes);
app.use(userRoutes);
app.use('/admin', isAuthenticated, adminRoutes);
app.use('/', isAuthenticated, forumRoutes);
app.use('/', isAuthenticated, notificationRoutes);

app.get('/', (req, res) => res.redirect('/login'));

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
