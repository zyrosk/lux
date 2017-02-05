export function up(schema) {
  return schema.alterTable('reactions', table => {
    table.references('user');
  });
}

export function down(schema) {
  return schema.alterTable('reactions', table => {
    table.dropReference('user');
  });
}
