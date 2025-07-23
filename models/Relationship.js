const db = require('../config/database');

class Relationship {
  static async follow(followerId, followedId) {
    const existing = await db('relationships')
      .where('follower_id', followerId)
      .where('followed_id', followedId)
      .first();

    if (!existing) {
      await db('relationships').insert({
        follower_id: followerId,
        followed_id: followedId,
        created_at: new Date(),
        updated_at: new Date()
      });
    }
  }

  static async unfollow(followerId, followedId) {
    return await db('relationships')
      .where('follower_id', followerId)
      .where('followed_id', followedId)
      .del();
  }

  static async isFollowing(followerId, followedId) {
    const relationship = await db('relationships')
      .where('follower_id', followerId)
      .where('followed_id', followedId)
      .first();
    return !!relationship;
  }

  static async getFollowing(userId) {
    return await db('relationships')
      .select('users.*')
      .join('users', 'relationships.followed_id', 'users.id')
      .where('relationships.follower_id', userId)
      .orderBy('relationships.created_at', 'desc');
  }

  static async getFollowers(userId) {
    return await db('relationships')
      .select('users.*')
      .join('users', 'relationships.follower_id', 'users.id')
      .where('relationships.followed_id', userId)
      .orderBy('relationships.created_at', 'desc');
  }
}

module.exports = Relationship;
