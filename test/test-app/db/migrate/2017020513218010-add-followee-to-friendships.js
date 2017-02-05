export function up(schema) {
  return schema.alterTable('friendships', table => {
    table.references('followee', 'users');
  });
}

export function down(schema) {
  return schema.alterTable('friendships', table => {
    table.dropReference('followee');
  });
}
