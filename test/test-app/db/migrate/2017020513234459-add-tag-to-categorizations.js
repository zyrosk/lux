export function up(schema) {
  return schema.alterTable('categorizations', table => {
    table.references('tag');
  });
}

export function down(schema) {
  return schema.alterTable('categorizations', table => {
    table.dropReference('tag');
  });
}
