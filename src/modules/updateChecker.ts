import * as puppeteer from 'puppeteer';
import * as cron from 'node-cron';
import NotficationHistoryService from '../services/notification';
import EmailService from '../services/email';

interface Notification {
  idx: number;
  title: string;
  link: string;
}

class UpdateChecker {
  private url: string;

  private page!: puppeteer.Page;

  constructor(url: string) {
    this.url = url;
  }

  public async initialize() {
    try {
      const browser = await puppeteer.launch({
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
        ],
      });

      this.page = await browser.newPage();
      await this.page.setViewport({ width: 320, height: 600 });
      await this.page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 9_0_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13A404 Safari/601.1');
      await this.page.goto(this.url, { waitUntil: 'networkidle0' });
      await this.page.waitForSelector('tr');
      await this.page.addScriptTag({ url: 'https://code.jquery.com/jquery-3.2.1.min.js' });
    } catch (err) {
      console.log(err);
    }
  }

  private async getNotifications() {
    const result = await this.page.evaluate(() => {
      const notifications: Notification[] = [];
      const trs = $('tr');

      trs.each((index, element) => {
        const idx = $(element)
          .find('td')
          .first()
          .text()
          .trim();// Get a each post-id from the webpage.
        const subject = $(element).find('td.subject > a');
        const title = subject.text();
        const link = subject.attr('href')!;
        notifications.push({
          idx: +idx,
          title,
          link,
        });
      });

      return notifications;
    });

    return result;
  }

  public async checkAndSendEmail() {
    const beforeLatestIdx = await NotficationHistoryService.getLatestIdx();
    const notificationPosts = await this.getNotifications();

    console.log(notificationPosts);
    notificationPosts.forEach((elm) => {
      const { idx, title, link } = elm;

      if (idx === 0) {
        return;
      }

      if (idx > beforeLatestIdx) {
        console.log('New Post Detected!');
        console.log(idx, title);
        EmailService.sendNotificationEmail(title, link);
        NotficationHistoryService.addHistory(idx, title, link);
      }
    });
  }

  public checkEvery(min: number) {
    console.log(`Start checking new post every ${min}min from now on.`);
    cron.schedule(`*/${min} * * * *`, async () => {
      console.log('Start Check');
      await this.checkAndSendEmail();
      console.log('End Check');
    });
  }
}

export default UpdateChecker;
