import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class Users extends BaseSchema {
  protected tableName = 'users';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary();
      table.string('name', 100).notNullable();
      table.string('email', 100).notNullable().unique();
      table.string('password', 255).notNullable();
      table.string('token');
      table.timestamp('token_created_at');
      table.timestamps();
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
