exports.up = function(knex) {
  return knex.schema.createTable('users', function(table) {
    table.increments('id').primary();
    table.string('name', 255).unique();
    table.string('email', 255).unique();
    table.string('password', 255).notNullable();
    table.boolean('isAdmin').defaultTo(false);
    table.datetime('created_at');
    table.datetime('updated_at');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('users');
};
