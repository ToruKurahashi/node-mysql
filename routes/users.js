const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Micropost = require('../models/Micropost');
const Relationship = require('../models/Relationship');
const { ensureAuthenticated, ensureAdmin } = require('../middleware/auth');

router.get('/', ensureAuthenticated, async (req, res) => {
  try {
    const users = await User.findAll();
    res.render('users/index', { users });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

router.get('/:id', ensureAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send('User not found');
    }

    const microposts = await Micropost.findByUserId(user.id);
    const postCount = await User.getPostCount(user.id);
    const followingCount = await User.getFollowingCount(user.id);
    const followersCount = await User.getFollowersCount(user.id);
    
    let isFollowing = false;
    if (req.user.id !== user.id) {
      isFollowing = await Relationship.isFollowing(req.user.id, user.id);
    }

    res.render('users/profile', {
      profileUser: user,
      microposts,
      postCount,
      followingCount,
      followersCount,
      isFollowing,
      isOwnProfile: req.user.id === user.id
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

router.get('/:id/following', ensureAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send('User not found');
    }

    const following = await Relationship.getFollowing(user.id);
    const postCount = await User.getPostCount(user.id);
    const followingCount = await User.getFollowingCount(user.id);
    const followersCount = await User.getFollowersCount(user.id);

    res.render('users/following', {
      profileUser: user,
      following,
      postCount,
      followingCount,
      followersCount
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

router.get('/:id/followers', ensureAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send('User not found');
    }

    const followers = await Relationship.getFollowers(user.id);
    const postCount = await User.getPostCount(user.id);
    const followingCount = await User.getFollowingCount(user.id);
    const followersCount = await User.getFollowersCount(user.id);

    res.render('users/followers', {
      profileUser: user,
      followers,
      postCount,
      followingCount,
      followersCount
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

router.post('/:id/follow', ensureAuthenticated, async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    if (userId === req.user.id) {
      return res.status(400).send('Cannot follow yourself');
    }

    await Relationship.follow(req.user.id, userId);
    res.redirect(`/users/${userId}`);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

router.post('/:id/unfollow', ensureAuthenticated, async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    await Relationship.unfollow(req.user.id, userId);
    res.redirect(`/users/${userId}`);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

router.post('/:id/delete', ensureAdmin, async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    if (userId === req.user.id) {
      req.flash('error_msg', 'Cannot delete your own account');
      return res.redirect('/users');
    }

    await User.delete(userId);
    req.flash('success_msg', 'User deleted successfully');
    res.redirect('/users');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
