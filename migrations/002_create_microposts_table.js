exports.up = function(knex) {
  return knex.schema.createTable('microposts', function(table) {
    table.increments('id').primary();
    table.string('content', 255).notNullable();
    table.integer('user_id').notNullable();
    table.datetime('created_at');
    table.datetime('updated_at');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('microposts');
};
