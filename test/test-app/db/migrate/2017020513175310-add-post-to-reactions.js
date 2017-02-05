export function up(schema) {
  return schema.alterTable('reactions', table => {
    table.references('post');
  });
}

export function down(schema) {
  return schema.alterTable('reactions', table => {
    table.dropReference('post');
  });
}
