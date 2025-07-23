const express = require('express');
const router = express.Router();
const passport = require('passport');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { ensureAuthenticated, ensureGuest } = require('../middleware/auth');

router.get('/signup', ensureGuest, (req, res) => {
  res.render('auth/signup');
});

router.post('/signup', ensureGuest, [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('password_confirmation').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Password confirmation does not match password');
    }
    return true;
  })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render('auth/signup', {
        errors: errors.array(),
        name: req.body.name,
        email: req.body.email
      });
    }

    const existingUser = await User.findByEmail(req.body.email);
    if (existingUser) {
      return res.render('auth/signup', {
        errors: [{ msg: 'Email already exists' }],
        name: req.body.name,
        email: req.body.email
      });
    }

    await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    });

    req.flash('success_msg', 'Registration successful! Please log in.');
    res.redirect('/accounts/signin');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

router.get('/signin', ensureGuest, (req, res) => {
  res.render('auth/signin');
});

router.post('/signin', ensureGuest, passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/accounts/signin',
  failureFlash: true
}));

router.get('/edit', ensureAuthenticated, (req, res) => {
  res.render('auth/edit', { user: req.user });
});

router.post('/edit', ensureAuthenticated, [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password_confirmation').custom((value, { req }) => {
    if (req.body.password && value !== req.body.password) {
      throw new Error('Password confirmation does not match password');
    }
    return true;
  })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render('auth/edit', {
        errors: errors.array(),
        user: req.user
      });
    }

    const updateData = {
      name: req.body.name,
      email: req.body.email
    };

    if (req.body.password) {
      updateData.password = req.body.password;
    }

    await User.update(req.user.id, updateData);
    req.flash('success_msg', 'Profile updated successfully!');
    res.redirect('/accounts/edit');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error(err);
    }
    req.flash('success_msg', 'You have been logged out');
    res.redirect('/');
  });
});

module.exports = router;
