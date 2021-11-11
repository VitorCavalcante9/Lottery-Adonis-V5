import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Bet from 'App/Models/Bet';
import Game from 'App/Models/Game';
import Bull from '@ioc:Rocketseat/Bull';
import Job from 'App/Jobs/NewBetMail';
import Env from '@ioc:Adonis/Core/Env';
import CreateBetValidator from 'App/Validators/CreateBetValidator';
import UpdateBetValidator from 'App/Validators/UpdateBetValidator';

export default class BetsController {
  public async index({ request, auth }: HttpContextContract) {
    const { page, game } = request.qs();
    let bets;

    if (game) {
      bets = (
        await Bet.query()
          .where('user_id', auth.user!.id)
          .where('game_id', game)
          .preload('game')
          .paginate(page)
      ).toJSON();
    } else {
      bets = (
        await Bet.query().where('user_id', auth.user!.id).preload('game').paginate(page)
      ).toJSON();
    }

    let formattedBets = { ...bets };
    formattedBets.data = bets.data.map((bet) => {
      const { type, color } = bet.game;
      const betJson = bet.toJSON();

      delete betJson.game;

      return {
        ...betJson,
        numbers: JSON.parse(bet.numbers),
        type,
        color,
      };
    });

    return formattedBets;
  }

  public async store({ request, response, auth }: HttpContextContract) {
    const bets = request.input('bets');

    try {
      await request.validate(CreateBetValidator);
    } catch (error) {
      return response.badRequest(error.messages);
    }

    try {
      let formattedBets: Array<any> = [];

      for (const bet of bets) {
        const game = await Game.findOrFail(bet.game_id);

        if (bet.numbers.length < game.max_number) {
          return response.status(400).json({
            message: `Escolha ${game.max_number} números para a aposta do jogo ${game.type}`,
          });
        }

        let newBet = {
          numbers: JSON.stringify(bet.numbers),
          user_id: auth.user!.id,
          game_id: bet.game_id,
          price: game.price,
        };

        formattedBets.push(newBet);
      }

      const createdBets = await Bet.createMany(formattedBets);

      for (const [index, bet] of createdBets.entries()) {
        const game = await bet.related('game').query();
        formattedBets[index] = {
          ...formattedBets[index],
          numbers: JSON.parse(bet.numbers),
          date: bet.date.setLocale('pt-BR').toLocaleString(),
          price: bet.price.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }),
          type: game[0].type,
          color: game[0].color,
        };
      }

      if (Env.get('NODE_ENV') !== 'testing') {
        Bull.add(new Job().key, {
          name: auth.user?.name,
          email: auth.user?.email,
          bets: formattedBets,
        });
      }

      return response.status(201).json({ message: 'Apostas registradas com sucesso!' });
    } catch (err) {
      console.log(err);
      return response.status(400).json({ message: 'Erro ao registrar as apostas' });
    }
  }

  public async show({ params, response }: HttpContextContract) {
    try {
      const bet = (await Bet.query().where('id', params.id).preload('game').firstOrFail()).toJSON();
      const { type, color } = bet.game;
      delete bet.game;

      return {
        ...bet,
        numbers: JSON.parse(bet.numbers),
        type,
        color,
      };
    } catch (err) {
      return response.status(400).json({ message: 'Esta aposta não existe' });
    }
  }

  public async update({ params, request, response }: HttpContextContract) {
    try {
      const bet = await Bet.query().where('id', params.id).preload('game').firstOrFail();
      const numbers = request.input('numbers');

      try {
        await request.validate(UpdateBetValidator);
      } catch (error) {
        return response.badRequest(error.messages);
      }

      if (numbers.length < bet.game.max_number) {
        return response.status(400).json({
          message: `Escolha ${bet.game.max_number} números para a aposta do jogo ${bet.game.type}`,
        });
      }

      bet.merge({ numbers: JSON.stringify(numbers) });
      await bet.save();

      return { ...bet.toJSON(), numbers };
    } catch (err) {
      return response.status(400).json({ message: 'Esta aposta não existe' });
    }
  }

  public async destroy({ params, response }: HttpContextContract) {
    try {
      const bet = await Bet.findOrFail(params.id);
      await bet.delete();
    } catch (err) {
      return response.status(400).json({ message: 'Esta aposta não existe' });
    }
  }
}
