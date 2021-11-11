import Factory from '@ioc:Adonis/Lucid/Factory';
import Bet from 'App/Models/Bet';

export const BetFactoryMega = Factory.define(Bet, ({ faker }) => {
  let numbers: Array<number> = [];
  for (let i = 0; i < 6; i++) {
    numbers.push(faker.datatype.number({ min: 1, max: 60 }));
  }

  return {};
});
