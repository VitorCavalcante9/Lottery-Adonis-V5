import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class Bets extends BaseSchema {
  protected tableName = 'bets';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id');
      table
        .uuid('user_id')
        .references('id')
        .inTable('users')
        .onUpdate('CASCADE')
        .onDelete('SET NULL');
      table
        .integer('game_id')
        .unsigned()
        .references('id')
        .inTable('games')
        .onUpdate('CASCADE')
        .onDelete('SET NULL');
      table.json('numbers');
      table.timestamp('date');
      table.double('price');
      table.timestamps();
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
