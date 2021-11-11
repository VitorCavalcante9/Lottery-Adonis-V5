import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

export default class Admin {
  public async handle({ bouncer, response }: HttpContextContract, next: () => Promise<void>) {
    if (await bouncer.denies('manageGames')) {
      return response.unauthorized({ error: 'Only administrators can manage games' });
    }
    await next();
  }
}
