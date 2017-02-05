export function up(schema) {
  return schema.alterTable('friendships', table => {
    table.references('follower', 'users');
  });
}

export function down(schema) {
  return schema.alterTable('friendships', table => {
    table.dropReference('follower');
  });
}
