export function up(schema) {
  return schema.createTable('posts', table => {
    table.increments('id');
    table.text('body');
    table.timestamps();

    table
      .string('title')
      .index()
      .notNullable()
      .defaultTo('New Post');

    table
      .boolean('is_public')
      .index()
      .defaultTo(false)
      .notNullable();
  });
}

export function down(schema) {
  return schema.dropTable('posts');
}
