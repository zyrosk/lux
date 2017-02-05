export function up(schema) {
  return schema.alterTable('posts', table => {
    table.references('user');
  });
}

export function down(schema) {
  return schema.alterTable('posts', table => {
    table.dropReference('user');
  });
}
