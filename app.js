const express = require('express');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const path = require('path');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const micropostRoutes = require('./routes/microposts');
const indexRoutes = require('./routes/index');

require('./config/passport');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
  secret: 'micropost-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use((req, res, next) => {
  res.locals.user = req.user;
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

app.use('/', indexRoutes);
app.use('/accounts', authRoutes);
app.use('/users', userRoutes);
app.use('/microposts', micropostRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
