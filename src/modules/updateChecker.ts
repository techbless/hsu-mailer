/* eslint-disable no-new-func */
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

  private boardId!: string;

  private browser!: puppeteer.Browser;

  private page!: puppeteer.Page;

  constructor(notificationType: NotificationType, browser: puppeteer.Browser) {
    this.type = notificationType;
    this.browser = browser;
    this.url = 'https://hansung.ac.kr/bbs/hansung/143/artclList.do';

    if (notificationType === NotificationType.hansung) {
      this.showingType = '한성공지';
      this.boardId = '166';
    } else if (notificationType === NotificationType.academic) {
      this.showingType = '학사공지';
      this.boardId = '238';
    } else if (notificationType === NotificationType.hspoint) {
      this.showingType = '비교과공지';
      this.boardId = '239';
    } else if (notificationType === NotificationType.scholarship) {
      this.showingType = '장학공지';
      this.boardId = '167';
    }

    this.checkAndSendEmail = this.checkAndSendEmail.bind(this);
  }

  public async initialize() {
    try {
      this.page = await this.browser.newPage();
      await this.page.setDefaultNavigationTimeout(120000);
      /* width should be over than 1281. */
      await this.page.setViewport({ width: 1400, height: 1000 });
      await this.page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 9_0_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13A404 Safari/601.1');
      await this.page.goto(this.url, {
        waitUntil: [
          'networkidle0',
          'domcontentloaded',
        ],
      });

      await this.page.evaluate((boardId) => {
        const scriptToChangeBoardInString = `jf_searchArtcl('bbsClSeq', '${boardId}')`;
        const moveToSpecificBoard = new Function(scriptToChangeBoardInString);
        moveToSpecificBoard();
      }, this.boardId);
      await this.page.waitForSelector('tr');
      await this.page.addScriptTag({ url: 'https://code.jquery.com/jquery-3.2.1.min.js' });
      console.log(`${this.showingType} Initialized`);
    } catch (err) {
      console.log(`Failed to initialize ${this.showingType}`);
      console.log(err);
    }
  }

  private async getNotifications() {
    // reload a page before checking new notifications.
    await this.page.reload({
      waitUntil: [
        'networkidle0',
        'domcontentloaded',
      ],
    });

    const result = await this.page.evaluate(() => {
      const notifications: Notification[] = [];
      const trs = $('tr');
      trs.each((index, element) => {
        const idx = $(element).find('td.td-num').text();
        const subjectInElement = $(element).find('td.td-subject > a');
        const title = subjectInElement.find('strong').text().trim();
        const link = subjectInElement.attr('href')!;

        notifications.push({
          idx: +idx,
          title,
          link,
        });
      });

      return notifications;
    });

    console.log(result);

    return result;
  }

  public async checkAndSendEmail() {
    console.log(`Start Checking ${this.showingType}`);

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

    console.log(`End Checking ${this.showingType}`);
  }
}

export default UpdateChecker;
