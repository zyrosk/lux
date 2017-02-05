export function up(schema) {
  return schema.alterTable('comments', table => {
    table.references('user');
  });
}

export function down(schema) {
  return schema.alterTable('comments', table => {
    table.dropReference('user');
  });
}
