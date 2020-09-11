import * as puppeteer from 'puppeteer';
import * as cron from 'node-cron';
import NotficationHistoryService from '../services/notification';
import EmailService from '../services/email';
import { NotificationType } from '../models/receiving_option';

interface Notification {
  idx: number;
  title: string;
  link: string;
}

class UpdateChecker {
  private type!: NotificationType;

  private showingType!: string;

  private url!: string;

  private page!: puppeteer.Page;

  constructor(notificationType: NotificationType) {
    this.type = notificationType;

    if (notificationType === NotificationType.hansung) {
      this.url = 'https://www.hansung.ac.kr/web/www/cmty_01_01';
      this.showingType = '한성공지';
    } else if (notificationType === NotificationType.academic) {
      this.url = 'https://www.hansung.ac.kr/web/www/cmty_01_03';
      this.showingType = '학사공지';
    } else if (notificationType === NotificationType.hspoint) {
      this.url = 'https://www.hansung.ac.kr/web/www/1323';
      this.showingType = '비교과공지';
    } else if (notificationType === NotificationType.scholarship) {
      this.url = 'https://www.hansung.ac.kr/web/www/552';
      this.showingType = '장학공지';
    }

    this.checkAndSendEmail = this.checkAndSendEmail.bind(this);
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
      await this.page.goto(this.url, {
        timeout: 120000,
        waitUntil: [
          'networkidle0',
          'domcontentloaded',
        ],
      });
      await this.page.waitForSelector('tr');
      await this.page.addScriptTag({ url: 'https://code.jquery.com/jquery-3.2.1.min.js' });
    } catch (err) {
      console.log(err);
    }
  }

  private async getNotifications() {
    // reload a page before checking new notifications.
    await this.page.reload({
      timeout: 120000,
      waitUntil: [
        'networkidle0',
        'domcontentloaded',
      ],
    });

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
    console.log('Start Checking');

    const beforeLatestIdx = await NotficationHistoryService.getLatestIdx(this.type);
    const notificationPosts = await this.getNotifications();

    console.log(`Latest Index: ${beforeLatestIdx}`);

    notificationPosts.forEach((elm) => {
      const { idx, title, link } = elm;

      if (idx === 0) {
        return;
      }

      if (idx > beforeLatestIdx) {
        console.log('New Post Detected!');
        const titleForMail = `[${this.showingType}] ${title}`;
        console.log(idx, titleForMail);
        EmailService.sendNotificationEmail(titleForMail, link, this.type);
        NotficationHistoryService.addHistory(idx, title, link, this.type);
      }
    });

    console.log('End Checking');
  }
}

export default UpdateChecker;
