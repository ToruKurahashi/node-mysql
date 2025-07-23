const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Micropost = require('../models/Micropost');
const { ensureAuthenticated } = require('../middleware/auth');

router.post('/', ensureAuthenticated, [
  body('content').isLength({ min: 1, max: 255 }).withMessage('Content must be between 1 and 255 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash('error_msg', errors.array()[0].msg);
      return res.redirect('/');
    }

    await Micropost.create(req.body.content, req.user.id);
    req.flash('success_msg', 'Post created successfully!');
    res.redirect('/');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

router.post('/:id/delete', ensureAuthenticated, async (req, res) => {
  try {
    const micropost = await Micropost.findById(req.params.id);
    if (!micropost) {
      return res.status(404).send('Post not found');
    }

    if (micropost.user_id !== req.user.id) {
      return res.status(403).send('Unauthorized');
    }

    await Micropost.delete(req.params.id);
    req.flash('success_msg', 'Post deleted successfully!');
    res.redirect('back');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
