export function up(schema) {
  return schema.createTable('friendships', table => {
    table.increments('id');
    table.timestamps();
  });
}

export function down(schema) {
  return schema.dropTable('friendships');
}
