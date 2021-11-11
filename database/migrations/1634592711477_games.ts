import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class Games extends BaseSchema {
  protected tableName = 'games';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id');
      table.string('type').notNullable();
      table.text('description').notNullable();
      table.integer('range').notNullable();
      table.double('price').notNullable();
      table.integer('max_number').notNullable();
      table.string('color', 7).notNullable();
      table.timestamps();
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
