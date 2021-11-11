import User from 'App/Models/User';
import test from 'japa';
import supertest from 'supertest';

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`;

test.group('User', (group) => {
  group.beforeEach(async () => {
    await User.truncate();
  });

  test('should create a user', async assert => {
    const response = await supertest(BASE_URL).post('/users').send({
      name: 'Vitor',
      email: 'vitor@gmail.com',
      password: '123456',
    });
    
    assert.equal(response.statusCode, 200);
  });

  test('should not create a user with invalid email', async assert => {
    const response = await supertest(BASE_URL).post('/users').send({
      name: 'Vitor',
      email: 'vitor',
      password: '123456',
    });
    
    assert.equal(response.statusCode, 400);
  });

  test('should not create user with an existing email', async assert => {
    await User.create({
      name: 'Vitor',
      email: 'vitor',
      password: '123456',
    });

    const response = await supertest(BASE_URL).post('/users').send({
      name: 'Vitor',
      email: 'vitor',
      password: '123456',
    });
    
    assert.equal(response.statusCode, 400);
  });
});