exports.up = function(knex) {
  return knex.schema.createTable('relationships', function(table) {
    table.increments('id').primary();
    table.integer('follower_id');
    table.integer('followed_id');
    table.datetime('created_at');
    table.datetime('updated_at');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('relationships');
};
