export function up(schema) {
  return schema.createTable('images', table => {
    table.increments('id');
    table.timestamps();

    table
      .string('url')
      .index()
      .notNullable();
  });
}

export function down(schema) {
  return schema.dropTable('images');
}
