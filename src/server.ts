import 'reflect-metadata';
import * as dotenv from 'dotenv';

dotenv.config();

import * as cron from 'node-cron';
import UpdateChecker from './modules/updateChecker';
import { NotificationType } from './models/receiving_option';
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

    const PERIOD_IN_MIN = 5;

    const hansungNotificationChecker = new UpdateChecker(NotificationType.hansung);
    const academicNotificationChecker = new UpdateChecker(NotificationType.academic);
    const hspointNotificationChecker = new UpdateChecker(NotificationType.hspoint);
    const scholarshipNotificationChecker = new UpdateChecker(NotificationType.scholarship);

    await hansungNotificationChecker.initialize();
    await academicNotificationChecker.initialize();
    await hspointNotificationChecker.initialize();
    await scholarshipNotificationChecker.initialize();

    setScheduler(hansungNotificationChecker.checkAndSendEmail, PERIOD_IN_MIN);
    setScheduler(academicNotificationChecker.checkAndSendEmail, PERIOD_IN_MIN);
    setScheduler(hspointNotificationChecker.checkAndSendEmail, PERIOD_IN_MIN);
    setScheduler(scholarshipNotificationChecker.checkAndSendEmail, PERIOD_IN_MIN);

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
