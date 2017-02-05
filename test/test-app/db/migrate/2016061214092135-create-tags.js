export function up(schema) {
  return schema.createTable('tags', table => {
    table.increments('id');
    table.timestamps();

    table
      .string('name')
      .index()
      .notNullable();
  });
}

export function down(schema) {
  return schema.dropTable('tags');
}
