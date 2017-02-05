export function up(schema) {
  return schema.alterTable('comments', table => {
    table.references('post');
  });
}

export function down(schema) {
  return schema.alterTable('comments', table => {
    table.dropReference('post');
  });
}
