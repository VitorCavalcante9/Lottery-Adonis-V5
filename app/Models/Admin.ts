import { DateTime } from 'luxon';
import { v4 as uuid } from 'uuid';
import { BaseModel, beforeCreate, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm';
import User from './User';

export default class Admin extends BaseModel {
  @column({ isPrimary: true })
  public id: string;

  @column()
  public userId: string;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>;

  @beforeCreate()
  public static assignUuid(user: User) {
    user.id = uuid();
  }
}
