export function up(schema) {
  return schema.createTable('comments', table => {
    table.increments('id');
    table.timestamps();

    table
      .string('message')
      .notNullable();

    table
      .boolean('edited')
      .index()
      .notNullable()
      .defaultTo(false);
  });
}

export function down(schema) {
  return schema.dropTable('comments');
}
