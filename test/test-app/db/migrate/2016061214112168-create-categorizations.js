export function up(schema) {
  return schema.createTable('categorizations', table => {
    table.increments('id');
    table.timestamps();
  });
}

export function down(schema) {
  return schema.dropTable('categorizations');
}
