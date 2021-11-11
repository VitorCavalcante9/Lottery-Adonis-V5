import Bet from 'App/Models/Bet';
import Game from 'App/Models/Game';
import User from 'App/Models/User';
import test from 'japa';
import supertest from 'supertest';

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`;

test.group('Bets', (group) => {
  group.beforeEach(async () => {
    await Bet.truncate();
    await Game.truncate();
    await User.truncate();
  });

  test('should create bets', async (assert) => {
    const user = await User.create({
      name: 'Vitor',
      email: 'vitor@gmail.com',
      password: '123456',
    });

    const game = await Game.create({
      type: 'Mega-Sena',
      description: 'Escolha 6 números dos 60 disponíveis na mega-sena. Ganhe com 6, 5 ou 4 acertos. São realizados dois sorteios semanais para você apostar e torcer para ficar milionário.',
      range: 60,
      price: 4.5,
      max_number: 6,
      color: '#01AC66'
    });

    const responseLogin = await supertest(BASE_URL).post('/sessions').send({
      email: user.email,
      password: '123456'
    });

    let bets: any = [];

    for(let i = 0; i < 3; i++) {
      let numbers: Array<number> = [];
      for (let j = 0; j < 6; j++) {
        numbers.push(Math.ceil(Math.random() * 60));
      }

      bets.push({
        game_id: game.id,
        numbers
      });
    }

    const response = await supertest(BASE_URL).post('/bets').send({ bets }).set('Authorization', `Bearer ${responseLogin.body.token}`);

    assert.equal(response.statusCode, 201);
  });

  test('should not create bets without login', async (assert) => {
    const game = await Game.create({
      type: 'Mega-Sena',
      description: 'Escolha 6 números dos 60 disponíveis na mega-sena. Ganhe com 6, 5 ou 4 acertos. São realizados dois sorteios semanais para você apostar e torcer para ficar milionário.',
      range: 60,
      price: 4.5,
      max_number: 6,
      color: '#01AC66'
    });

    let bets: any = [];

    for(let i = 0; i < 3; i++) {
      let numbers: Array<number> = [];
      for (let j = 0; j < 6; j++) {
        numbers.push(Math.ceil(Math.random() * 60));
      }

      bets.push({
        game_id: game.id,
        numbers
      });
    }

    const response = await supertest(BASE_URL).post('/bets').send({ bets });

    assert.equal(response.statusCode, 401);
  });

  test('should create bets missing numbers', async (assert) => {
    const user = await User.create({
      name: 'Vitor',
      email: 'vitor@gmail.com',
      password: '123456',
    });

    const game = await Game.create({
      type: 'Mega-Sena',
      description: 'Escolha 6 números dos 60 disponíveis na mega-sena. Ganhe com 6, 5 ou 4 acertos. São realizados dois sorteios semanais para você apostar e torcer para ficar milionário.',
      range: 60,
      price: 4.5,
      max_number: 6,
      color: '#01AC66'
    });

    const responseLogin = await supertest(BASE_URL).post('/sessions').send({
      email: user.email,
      password: '123456'
    });

    let bets: any = [];

    for(let i = 0; i < 3; i++) {
      let numbers: Array<number> = [];
      for (let j = 0; j < 5; j++) {
        numbers.push(Math.ceil(Math.random() * 60));
      }

      bets.push({
        game_id: game.id,
        numbers
      });
    }

    const response = await supertest(BASE_URL).post('/bets').send({ bets }).set('Authorization', `Bearer ${responseLogin.body.token}`);

    assert.equal(response.statusCode, 400);
  });
})