export function up(schema) {
  return schema.alterTable('categorizations', table => {
    table.references('post');
  });
}

export function down(schema) {
  return schema.alterTable('categorizations', table => {
    table.dropReference('post');
  });
}
