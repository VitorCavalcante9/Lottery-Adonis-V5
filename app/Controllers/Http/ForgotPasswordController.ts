import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import User from 'App/Models/User';
import crypto from 'crypto';
import moment from 'moment';
import Bull from '@ioc:Rocketseat/Bull';
import Job from 'App/Jobs/ForgotPasswordMail';
import ForgotPasswordValidator from 'App/Validators/ForgotPasswordValidator';
import ResetPasswordValidator from 'App/Validators/ResetPasswordValidator';

export default class ForgotPasswordController {
  public async store({ request, response }: HttpContextContract) {
    try {
      const email = request.input('email');

      try {
        await request.validate(ForgotPasswordValidator);
      } catch (error) {
        console.log(error);
        return response.badRequest(error.messages);
      }

      const user = await User.findByOrFail('email', email);
      user.token = crypto.randomBytes(10).toString('hex');
      user.token_created_at = new Date();

      await user.save();

      Bull.add(new Job().key, {
        email,
        token: user.token,
        redirect_url: request.input('redirect_url'),
      });
    } catch (err) {
      console.log(err);
      return response.status(err.status).send({
        error: { message: 'Algo não deu certo, esse email existe?' },
      });
    }
  }

  public async update({ request, response }: HttpContextContract) {
    try {
      const { token, password } = request.only(['token', 'password']);

      try {
        await request.validate(ResetPasswordValidator);
      } catch (error) {
        return response.badRequest(error.messages);
      }

      const user = await User.findByOrFail('token', token);
      const tokenExpired = moment().subtract('2', 'days').isAfter(user.token_created_at);

      if (tokenExpired) {
        return response
          .status(401)
          .send({ error: { message: 'O token de recuperação está expirado' } });
      }

      user.token = null;
      user.token_created_at = null;
      user.password = password;

      await user.save();
    } catch (err) {
      return response
        .status(err.status)
        .send({ error: { message: 'Algo deu errado ao resetar sua senha' } });
    }
  }
}
