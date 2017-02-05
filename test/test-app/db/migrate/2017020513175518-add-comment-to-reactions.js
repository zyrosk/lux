export function up(schema) {
  return schema.alterTable('reactions', table => {
    table.references('comment');
  });
}

export function down(schema) {
  return schema.alterTable('reactions', table => {
    table.dropReference('comment');
  });
}
