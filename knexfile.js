module.exports = {
  development: {
    client: 'mysql2',
    connection: {
      host: 'localhost',
      user: 'root',
      password: 'password',
      database: 'micropost'
    },
    migrations: {
      directory: './migrations'
    }
  }
};
