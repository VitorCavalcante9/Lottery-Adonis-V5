import User from 'App/Models/User';
import test from 'japa';
import supertest from 'supertest';

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`;

test.group('Authentication', (group) => {
  group.beforeEach(async () => {
    await User.truncate();
  });

  test('should authenticate with valid credentials', async (assert) => {
    const user = await User.create({
      name: 'Vitor',
      email: 'vitor@gmail.com',
      password: '123456',
    });

    const response = await supertest(BASE_URL).post('/sessions').send({
      email: user.email,
      password: '123456'
    });

    assert.equal(response.statusCode, 200);
  });

  test('should not authenticate with invalid credentials', async (assert) => {
    const user = await User.create({
      name: 'Vitor',
      email: 'vitor@gmail.com',
      password: '123456',
    });

    const response = await supertest(BASE_URL).post('/sessions').send({
      email: user.email,
      password: '123123'
    });

    assert.equal(response.statusCode, 401);
  });

  test('should return jwt token when authenticated', async (assert) => {
    const user = await User.create({
      name: 'Vitor',
      email: 'vitor@gmail.com',
      password: '123456',
    });

    const response = await supertest(BASE_URL).post('/sessions').send({
      email: user.email,
      password: '123456'
    });

    assert.property(response.body, 'token');
  });
})