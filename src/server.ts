import 'reflect-metadata';
import * as dotenv from 'dotenv';

dotenv.config();

import * as puppeteer from 'puppeteer';
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
    const PORT: number = +process.env.PORT! || 3000;
    app.listen(PORT, () => {
      console.log('Server Started: Listen on port ', PORT);
    });

    const browser = await puppeteer.launch({
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
      ],
    });

    const hansungNotificationChecker = new UpdateChecker(NotificationType.hansung, browser);
    const academicNotificationChecker = new UpdateChecker(NotificationType.academic, browser);
    const hspointNotificationChecker = new UpdateChecker(NotificationType.hspoint, browser);
    const scholarshipNotificationChecker = new UpdateChecker(NotificationType.scholarship, browser);

    await hansungNotificationChecker.initialize();
    await academicNotificationChecker.initialize();
    await hspointNotificationChecker.initialize();
    await scholarshipNotificationChecker.initialize();

    setScheduler(async () => {
      await hansungNotificationChecker.checkAndSendEmail();
      await academicNotificationChecker.checkAndSendEmail();
      await hspointNotificationChecker.checkAndSendEmail();
      await scholarshipNotificationChecker.checkAndSendEmail();
    }, PERIOD_IN_MIN);

    console.log('Scheduler Set: Check new post every ', PERIOD_IN_MIN, 'min');
  } catch (error) {
    console.log('Error! Failed to start the server.');
    console.log(error);
  }
}

startAll();
