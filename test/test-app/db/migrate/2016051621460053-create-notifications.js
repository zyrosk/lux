export function up(schema) {
  return schema.createTable('notifications', table => {
    table.increments('id');
    table.timestamps();

    table
      .string('message')
      .notNullable();

    table
      .boolean('unread')
      .index()
      .defaultTo(true)
      .notNullable();
  });
}

export function down(schema) {
  return schema.dropTable('notifications');
}
