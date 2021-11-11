/*
|--------------------------------------------------------------------------
| Preloaded File
|--------------------------------------------------------------------------
|
| Any code written inside this file will be executed during the application
| boot.
|
*/

import Bull from '@ioc:Rocketseat/Bull';
import Env from '@ioc:Adonis/Core/Env';
import Job from 'App/Jobs/AlertBet';

const PORT = 9999;
const isDevelopment = Env.get('NODE_ENV') === 'development';

if (Env.get('NODE_ENV') !== 'testing') {
  Bull.process();
  Bull.add(
    new Job().key,
    {},
    {
      repeat: {
        cron: '00 09 ? * MON-FRI',
      },
    }
  );

  if (isDevelopment) {
    Bull.ui(PORT);
  }
}
