const db = require('../config/database');
const bcrypt = require('bcrypt');

class User {
  static async create(userData) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const [id] = await db('users').insert({
      name: userData.name,
      email: userData.email,
      password: hashedPassword,
      isAdmin: userData.isAdmin || 0,
      created_at: new Date(),
      updated_at: new Date()
    });
    return this.findById(id);
  }

  static async findByEmail(email) {
    return await db('users').where('email', email).first();
  }

  static async findById(id) {
    return await db('users').where('id', id).first();
  }

  static async findAll() {
    return await db('users').select('*').orderBy('created_at', 'desc');
  }

  static async update(id, userData) {
    const updateData = {
      name: userData.name,
      email: userData.email,
      updated_at: new Date()
    };

    if (userData.password) {
      updateData.password = await bcrypt.hash(userData.password, 10);
    }

    await db('users').where('id', id).update(updateData);
    return this.findById(id);
  }

  static async delete(id) {
    await db('microposts').where('user_id', id).del();
    await db('relationships').where('follower_id', id).orWhere('followed_id', id).del();
    return await db('users').where('id', id).del();
  }

  static async getPostCount(userId) {
    const result = await db('microposts').where('user_id', userId).count('id as count').first();
    return result.count;
  }

  static async getFollowingCount(userId) {
    const result = await db('relationships').where('follower_id', userId).count('id as count').first();
    return result.count;
  }

  static async getFollowersCount(userId) {
    const result = await db('relationships').where('followed_id', userId).count('id as count').first();
    return result.count;
  }
}

module.exports = User;
