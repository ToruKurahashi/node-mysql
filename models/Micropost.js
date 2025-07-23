const db = require('../config/database');

class Micropost {
  static async create(content, userId) {
    const [id] = await db('microposts').insert({
      content: content,
      user_id: userId,
      created_at: new Date(),
      updated_at: new Date()
    });
    return this.findById(id);
  }

  static async findById(id) {
    return await db('microposts')
      .select('microposts.*', 'users.name as user_name')
      .join('users', 'microposts.user_id', 'users.id')
      .where('microposts.id', id)
      .first();
  }

  static async findByUserId(userId) {
    return await db('microposts')
      .select('microposts.*', 'users.name as user_name')
      .join('users', 'microposts.user_id', 'users.id')
      .where('microposts.user_id', userId)
      .orderBy('microposts.created_at', 'desc');
  }

  static async findAll() {
    return await db('microposts')
      .select('microposts.*', 'users.name as user_name')
      .join('users', 'microposts.user_id', 'users.id')
      .orderBy('microposts.created_at', 'desc');
  }

  static async delete(id) {
    return await db('microposts').where('id', id).del();
  }
}

module.exports = Micropost;
