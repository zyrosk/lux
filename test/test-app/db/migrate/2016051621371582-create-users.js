export function up(schema) {
  return schema.createTable('users', table => {
    table.increments('id');
    table.timestamps();

    table
      .string('name')
      .index()
      .notNullable();

    table
      .string('email')
      .index()
      .unique()
      .notNullable();

    table
      .string('password')
      .notNullable();
  });
}

export function down(schema) {
  return schema.dropTable('users');
}
