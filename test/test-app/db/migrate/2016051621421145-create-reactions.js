import { REACTION_TYPES } from '../../app/models/reaction';

export function up(schema) {
  return schema.createTable('reactions', table => {
    table.increments('id');
    table.timestamps();

    table
      .enum('type', REACTION_TYPES)
      .index()
      .notNullable();
  });
}

export function down(schema) {
  return schema.dropTable('reactions');
}
