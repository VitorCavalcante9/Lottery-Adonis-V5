import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Game from 'App/Models/Game';
import GameValidator from 'App/Validators/GameValidator';

export default class GamesController {
  public async index({}: HttpContextContract) {
    const games = await Game.all();
    return games;
  }

  public async store({ request, response }: HttpContextContract) {
    const data = request.only(['type', 'description', 'range', 'price', 'max_number', 'color']);

    try {
      await request.validate(GameValidator);
    } catch (error) {
      return response.badRequest(error.messages);
    }

    const game = await Game.create(data);

    return response.status(201).json(game);
  }

  public async show({ params }: HttpContextContract) {
    const game = await Game.findOrFail(params.id);
    return game;
  }

  public async update({ params, request, response }: HttpContextContract) {
    const data = request.all();

    try {
      await request.validate(GameValidator);
    } catch (error) {
      return response.badRequest(error.messages);
    }

    const game = await Game.findOrFail(params.id);

    game.merge(data);
    await game.save();

    return game;
  }

  public async destroy({ params }: HttpContextContract) {
    const game = await Game.findOrFail(params.id);

    await game.delete();
  }
}
