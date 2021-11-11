import { DateTime } from 'luxon';
import { v4 as uuid } from 'uuid';
import {
  BaseModel,
  beforeCreate,
  beforeSave,
  column,
  HasMany,
  hasMany,
} from '@ioc:Adonis/Lucid/Orm';
import Token from './Token';
import Hash from '@ioc:Adonis/Core/Hash';
import Bet from './Bet';

export default class User extends BaseModel {
  public static selfAssignPrimaryKey = true;

  @column({ isPrimary: true })
  public id: string;

  @column()
  public is_adm: boolean;

  @column()
  public name: string;

  @column()
  public email: string;

  @column({ serializeAs: null })
  public password: string;

  @column()
  public token: string | null;

  @column()
  public token_created_at: Date | null;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  @hasMany(() => Token)
  public tokens: HasMany<typeof Token>;

  @hasMany(() => Bet)
  public bets: HasMany<typeof Bet>;

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password);
    }
  }

  @beforeCreate()
  public static assignUuid(user: User) {
    user.id = uuid();
  }
}
