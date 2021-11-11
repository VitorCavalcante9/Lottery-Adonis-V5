import User from 'App/Models/User';
import test from 'japa';
import supertest from 'supertest';

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`;

test.group('Example', () => {
  test('teste', async (assert) => {
    const response = await supertest(BASE_URL).get('/').expect(200);

    assert.equal(response.body.hello, 'world');
  });

  test('ensure user password gets hashed during save', async (assert) => {
    const user = new User();
    user.name = 'teste';
    user.email = 'virk@adonisjs.com';
    user.password = 'secret';
    await user.save();

    assert.notEqual(user.password, 'secret');
  });

  test('should return jwt token when authenticated', async (assert) => {
    const user = await User.create({
      name: 'Vitor',
      email: 'vitor@gmail.com',
      password: '123456',
    });

    const response = await supertest(BASE_URL).post('/sessions').send({
      email: user.email,
      password: '123456',
    });

    assert.property(response.body, 'token');
  });
});
