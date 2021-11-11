import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

export default class SessionsController {
  public async store({ request, auth, response }: HttpContextContract) {
    try {
      const { email, password } = request.only(['email', 'password']);

      const token = await auth.use('api').attempt(email, password);

      return token.toJSON();
    } catch (err) {
      return response.status(401).json({ message: 'Email e/ou senha incorretos' });
    }
  }
}
