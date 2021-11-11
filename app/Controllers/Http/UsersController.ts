import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import User from 'App/Models/User';
import Env from '@ioc:Adonis/Core/Env';
import Bull from '@ioc:Rocketseat/Bull';
import Job from 'App/Jobs/UserRegisterEmail';
import ChangePasswordValidator from 'App/Validators/ChangePasswordValidator';
import CreateUserValidator from 'App/Validators/CreateUserValidator';
import UpdateUserValidator from 'App/Validators/UpdateUserValidator';

export default class UsersController {
  public async store({ request, response }: HttpContextContract) {
    const data = request.only(['name', 'email', 'password']);

    try {
      await request.validate(CreateUserValidator);
    } catch (error) {
      return response.badRequest(error.messages);
    }

    const user = await User.create(data);

    if (Env.get('NODE_ENV') !== 'testing') {
      Bull.add(new Job().key, user);
    }

    return user;
  }

  public async show({ auth }: HttpContextContract) {
    const user = await User.findOrFail(auth.user?.id);
    return user;
  }

  public async update({ auth, request, response }: HttpContextContract) {
    const user = await User.findOrFail(auth.user?.id);
    const { name, email } = request.only(['name', 'email']);

    try {
      await request.validate(UpdateUserValidator);
    } catch (error) {
      return response.badRequest(error.messages);
    }

    const verifyIfEmailExists = await User.findBy('email', email);

    if (verifyIfEmailExists && verifyIfEmailExists.id !== auth.user?.id) {
      throw new Error('Email já cadastrado');
    }

    user.merge({ name, email });
    await user.save();

    return user;
  }

  public async changePassword({ request, response, auth }: HttpContextContract) {
    const user = await User.findOrFail(auth.user?.id);
    const password = request.input('password');

    try {
      await request.validate(ChangePasswordValidator);
    } catch (error) {
      return response.badRequest(error.messages);
    }

    user.merge({ password });
    await user.save();
  }

  public async destroy({ auth }: HttpContextContract) {
    const user = await User.findOrFail(auth.user?.id);
    await user.delete();
  }
}
