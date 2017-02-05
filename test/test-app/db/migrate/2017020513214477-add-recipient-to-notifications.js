export function up(schema) {
  return schema.alterTable('notifications', table => {
    table.references('recipient', 'users');
  });
}

export function down(schema) {
  return schema.alterTable('notifications', table => {
    table.dropReference('recipient');
  });
}
