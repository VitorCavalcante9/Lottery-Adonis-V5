import { JobContract } from '@ioc:Rocketseat/Bull';
import Mail from '@ioc:Adonis/Addons/Mail';

export default class ForgotPasswordMail implements JobContract {
  public key = 'ForgotPasswordMail';

  public async handle(job) {
    const { data } = job;

    await Mail.send((message) => {
      message
        .from('info@tgl.com', 'TGL')
        .to(data.email)
        .subject('Recuperação de senha')
        .htmlView('emails/forgot_password', {
          email: data.email,
          token: data.token,
          link: `${data.redirect_url}?token=${data.token}`,
        });
    });

    return data;
  }
}
