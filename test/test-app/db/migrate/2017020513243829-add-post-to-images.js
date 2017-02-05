export function up(schema) {
  return schema.alterTable('images', table => {
    table.references('post');
  });
}

export function down(schema) {
  return schema.alterTable('images', table => {
    table.dropReference('post');
  });
}
