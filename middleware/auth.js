const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash('error_msg', 'Please log in to access this page');
  res.redirect('/accounts/signin');
};

const ensureGuest = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
};

const ensureAdmin = (req, res, next) => {
  if (req.isAuthenticated() && req.user.isAdmin) {
    return next();
  }
  req.flash('error_msg', 'Access denied. Admin privileges required.');
  res.redirect('/');
};

module.exports = {
  ensureAuthenticated,
  ensureGuest,
  ensureAdmin
};
