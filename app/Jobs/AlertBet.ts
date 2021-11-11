import { JobContract } from '@ioc:Rocketseat/Bull';
import User from 'App/Models/User';
import Mail from '@ioc:Adonis/Addons/Mail';
import { DateTime, Interval } from 'luxon';

/*
|--------------------------------------------------------------------------
| Job setup
|--------------------------------------------------------------------------
|
| This is the basic setup for creating a job, but you can override
| some settings.
|
| You can get more details by looking at the bullmq documentation.
| https://docs.bullmq.io/
*/

export default class AlertBet implements JobContract {
  public key = 'AlertBet';

  public async handle(job) {
    const users = await User.query().where('is_adm', 0);

    for (const user of users) {
      await user.load('bets', (betsQuery) => {
        betsQuery.orderBy('id', 'desc').limit(1);
      });

      const now = DateTime.now();
      const interval = Interval.fromDateTimes(user.bets[0].date, now);

      if (Math.round(interval.length('days')) === 7) {
        await Mail.send((message) => {
          message
            .from('info@tgl.com', 'TGL')
            .to(user.email)
            .subject('Sentimos a sua falta')
            .htmlView('emails/alert_bet', { name: user.name });
        });
      }
    }
  }
}
