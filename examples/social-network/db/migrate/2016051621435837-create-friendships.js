export function up(schema) {
  return schema.createTable('friendships', table => {
    table.increments('id');

    table
      .integer('followee_id')
      .notNullable();

    table
      .integer('follower_id')
      .notNullable();

    table.timestamps();

    table.index([
      'id',
      'followee_id',
      'follower_id',
      'created_at',
      'updated_at'
    ]);
  });
}

export function down(schema) {
  return schema.dropTable('friendships');
}
