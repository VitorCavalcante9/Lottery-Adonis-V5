/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route';

Route.get('/', ({ response }) => {
  return response.json({ hello: 'world' });
});

Route.post('/users', 'UsersController.store');
Route.group(() => {
  Route.get('/users', 'UsersController.show');
  Route.put('/users', 'UsersController.update');
  Route.patch('/users', 'UsersController.changePassword');
  Route.delete('/users', 'UsersController.destroy');
}).middleware(['auth']);
Route.post('/sessions', 'SessionController.store');
Route.post('/admin', 'AdminsController.store');

// passwords
Route.post('/passwords', 'ForgotPasswordController.store');
Route.put('/passwords', 'ForgotPasswordController.update');

// games
Route.resource('/games', 'GamesController').middleware({
  '*': ['auth'],
  'store': ['admin'],
  'update': ['admin'],
  'destroy': ['admin'],
});

// bets
Route.resource('/bets', 'BetsController')
  .middleware({
    '*': ['auth'],
  })
  .apiOnly();
