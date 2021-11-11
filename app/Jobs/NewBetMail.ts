import { JobContract } from '@ioc:Rocketseat/Bull';
import Mail from '@ioc:Adonis/Addons/Mail';

export default class NewBetMail implements JobContract {
  public key = 'NewBetMail';

  public async handle(job) {
    const { data } = job;

    console.log(data);
    const bets = data.bets.map((bet) => {
      return {
        ...bet,
        numbers: bet.numbers.join(', '),
      };
    });

    await Mail.send((message) => {
      message
        .from('info@tgl.com', 'TGL')
        .to(data.email)
        .subject('Novas apostas')
        .htmlView('emails/new_bet', { name: data.name, bets });
    });

    return data;
  }
}
