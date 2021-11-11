import Admin from 'App/Models/Admin';
import Game from 'App/Models/Game';
import User from 'App/Models/User';
import test from 'japa';
import supertest from 'supertest';

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`;

test.group('Games', (group) => {
  group.before(async () => {
    await Game.truncate();
    await User.truncate();
    await Admin.truncate();
  });

  test('should create a game', async (assert) => {
    const user = await User.create({
      name: 'Admin',
      email: 'adm@tgl.com',
      password: '123456',
    });

    await Admin.create({ userId: user.id });

    const data = {
      type: 'Lotofácil',
      description: 'Escolha 15 números para apostar na lotofácil. Você ganha acertando 11, 12, 13, 14 ou 15 números. São muitas chances de ganhar, e agora você joga de onde estiver!',
      range: 25,
      price: 2.5,
      max_number: 15,
      color: '#7F3992'
    }

    const responseLogin = await supertest(BASE_URL).post('/sessions').send({
      email: user.email,
      password: '123456'
    });

    const response = await supertest(BASE_URL).post('/games').send(data).set('Authorization', `Bearer ${responseLogin.body.token}`);

    assert.equal(response.statusCode, 201);
  });

  test('should not create a game if not admin user', async (assert) => {
    const data = {
      type: 'Lotofácil',
      description: 'Escolha 15 números para apostar na lotofácil. Você ganha acertando 11, 12, 13, 14 ou 15 números. São muitas chances de ganhar, e agora você joga de onde estiver!',
      range: 25,
      price: 2.5,
      max_number: 15,
      color: '#7F3992'
    }

    const response = await supertest(BASE_URL).post('/games').send(data);

    assert.equal(response.statusCode, 401);
  });
  
  test('should show a unique game', async (assert) => {
    const responseLogin = await supertest(BASE_URL).post('/sessions').send({
      email: 'adm@tgl.com',
      password: '123456'
    });

    const response = await supertest(BASE_URL).get('/games/1').set('Authorization', `Bearer ${responseLogin.body.token}`);

    assert.equal(response.statusCode, 200);
  });
  
  test('should list all games', async (assert) => {
    const responseLogin = await supertest(BASE_URL).post('/sessions').send({
      email: 'adm@tgl.com',
      password: '123456'
    });

    const response = await supertest(BASE_URL).get('/games').set('Authorization', `Bearer ${responseLogin.body.token}`);

    assert.equal(response.body.length, 1);
  });

  test('should not update a game if not admin user', async (assert) => {
    const data = {
      type: 'Lotofácil',
      description: 'Escolha 15 números para apostar na lotofácil. Você ganha acertando 11, 12, 13, 14 ou 15 números. São muitas chances de ganhar, e agora você joga de onde estiver!',
      range: 25,
      price: 2.5,
      max_number: 15,
      color: '#7F3992'
    }

    const response = await supertest(BASE_URL).put('/games/1').send(data);

    assert.equal(response.statusCode, 401);
  });

  test('should update a game', async (assert) => {
    const data = {
      type: 'Lotofácil',
      description: 'Escolha 15 números para apostar na lotofácil. Você ganha acertando 11, 12, 13, 14 ou 15 números. São muitas chances de ganhar, e agora você joga de onde estiver!',
      range: 25,
      price: 2.5,
      max_number: 15,
      color: '#7F3992'
    }

    const responseLogin = await supertest(BASE_URL).post('/sessions').send({
      email: 'adm@tgl.com',
      password: '123456'
    });

    const response = await supertest(BASE_URL).put('/games/1').send(data).set('Authorization', `Bearer ${responseLogin.body.token}`);

    assert.equal(response.statusCode, 200);
  });

  test('should not delete a game if not admin user', async (assert) => {
    const response = await supertest(BASE_URL).delete('/games/1');

    assert.equal(response.statusCode, 401);
  });

  test('should delete a game', async (assert) => {
    const responseLogin = await supertest(BASE_URL).post('/sessions').send({
      email: 'adm@tgl.com',
      password: '123456'
    });

    const response = await supertest(BASE_URL).delete('/games/1').set('Authorization', `Bearer ${responseLogin.body.token}`);

    assert.equal(response.statusCode, 200);
  });
})