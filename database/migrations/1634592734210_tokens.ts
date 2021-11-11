import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class Tokens extends BaseSchema {
  protected tableName = 'tokens';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id');
      table.uuid('user_id').references('id').inTable('users');
      table.string('token', 255).notNullable().unique().index();
      table.string('type', 80).notNullable();
      table.boolean('is_revoked').defaultTo(false);
      table.timestamps();
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
