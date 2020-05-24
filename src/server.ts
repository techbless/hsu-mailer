import 'reflect-metadata';
import * as dotenv from 'dotenv';

dotenv.config();

import * as cron from 'node-cron';
import updateChecker from './modules/updateChecker';
import { sequelize } from './models/index';
import app from './app';

function setScheduler(func: Function, min: number) {
  cron.schedule(`*/${min} * * * *`, () => {
    func();
  });
}

async function startAll() {
  try {
    await sequelize.sync({ force: false });

    const PERIOD_IN_MIN = 10;
    updateChecker.setUrl('http://www.hansung.ac.kr/web/www/1323');
    await updateChecker.initialize();
    setScheduler(updateChecker.checkAndSendEmail, PERIOD_IN_MIN);
    console.log('Scheduler Set: Check new post every ', PERIOD_IN_MIN, 'min');

    const PORT: number = +process.env.PORT! || 3000;
    app.listen(PORT, (err) => {
      if (err) throw err;
      console.log('Server Started: Listen on port ', PORT);
    });
  } catch (error) {
    console.log('Error! Failed to start the server.');
    console.log(error);
  }
}


startAll();
