export function up(schema) {
  return schema.createTable('actions', table => {
    table.increments('id');
    table.timestamps();

    table
      .integer('trackable_id')
      .index()
      .unsigned()
      .notNullable();

    table
      .string('trackable_type')
      .index()
      .notNullable();
  });
}

export function down(schema) {
  return schema.dropTable('actions');
}
