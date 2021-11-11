import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Admin from 'App/Models/Admin';

export default class AdminsController {
  public async store({ request, response }: HttpContextContract) {
    const data = request.input('user_id');
    try {
      await Admin.create({ userId: data });
      return response.status(200);
    } catch (err) {
      console.log(err);
      return response.status(400).json({ message: 'Erro ao adicioanr admin' });
    }
  }
}
