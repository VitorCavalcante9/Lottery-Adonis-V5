import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class Admins extends BaseSchema {
  protected tableName = 'admins';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary();
      table
        .uuid('user_id')
        .references('id')
        .inTable('users')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
        .notNullable();
      table.timestamps();
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
