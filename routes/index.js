const express = require('express');
const router = express.Router();
const Micropost = require('../models/Micropost');
const User = require('../models/User');

router.get('/', async (req, res) => {
  try {
    if (req.isAuthenticated()) {
      const microposts = await Micropost.findAll();
      const postCount = await User.getPostCount(req.user.id);
      const followingCount = await User.getFollowingCount(req.user.id);
      const followersCount = await User.getFollowersCount(req.user.id);

      res.render('home', {
        microposts,
        postCount,
        followingCount,
        followersCount
      });
    } else {
      res.render('welcome');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
