require('dotenv').config();

module.exports = {
  development: {
    client: "mysql",
    connection: {
      database: process.env.DB_NAME || "todo_app",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "password",
    },
    pool: {
      min: 2,
      max: 10
    },
  },

  staging: {
    client: "mysql",
    connection: {
      database: process.env.DB_NAME || "todo_app",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "password",
    },
    pool: {
      min: 2,
      max: 10
    },
  },

  production: {
    client: "mysql",
    connection: {
      database: process.env.DB_NAME || "todo_app",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "password",
    },
    pool: {
      min: 2,
      max: 10
    },
  }
};
