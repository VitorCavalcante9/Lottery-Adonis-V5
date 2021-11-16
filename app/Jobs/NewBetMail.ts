import { JobContract } from '@ioc:Rocketseat/Bull';
import Mail from '@ioc:Adonis/Addons/Mail';
import Producer from 'App/KafkaService/Producer';
import Admin from 'App/Models/Admin';

export default class NewBetMail implements JobContract {
  public key = 'NewBetMail';

  public async handle(job) {
    const { data } = job;

    const bets = data.bets.map((bet) => {
      return {
        ...bet,
        numbers: bet.numbers.join(', '),
      };
    });

    const admins = await Admin.query().preload('user', (userQuery) => {
      userQuery.select('email');
    });

    const adminEmails = admins.map((admin) => {
      return admin.user.email;
    });

    const dataKafka = {
      emails: adminEmails,
      bets,
      name: data.name,
    };

    const producer = new Producer();
    producer.produce({ topic: 'new-bets', messages: [{ value: JSON.stringify(dataKafka) }] });

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
