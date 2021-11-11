import { JobContract } from '@ioc:Rocketseat/Bull';
import Mail from '@ioc:Adonis/Addons/Mail';

export default class UserRegisterEmail implements JobContract {
  public key = 'UserRegisterEmail';

  public async handle(job) {
    const { data } = job; // the 'data' variable has user data

    await Mail.send((message) => {
      message
        .from('info@tgl.com', 'TGL')
        .to(data.email)
        .subject('Welcome to TGL')
        .htmlView('emails/welcome', { name: data.name });
    });

    return data;
  }
}
