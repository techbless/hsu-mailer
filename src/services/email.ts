import * as AWS from 'aws-sdk';
import * as ejs from 'ejs';
import Subscriber from '../models/subscriber';
import TokenService from '../services/token';

import { Purpose } from '../models/token';

class EmailService {
  private ses: AWS.SES;

  private templateLocation: string;

  constructor() {
    AWS.config.update({
      region: 'us-east-1',
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    });

    this.ses = new AWS.SES();
    this.templateLocation = `${__dirname}/../templates`;
  }

  private generateParams(bcc: string[], subject: string, html: string, text: string) {
    const params: AWS.SES.SendEmailRequest = {
      Destination: {
        ToAddresses: ['hspoint@techbless.live'], // 받는 사람 이메일 주소
        CcAddresses: [], // 참조
        BccAddresses: bcc, // 숨은 참조
      },
      Message: {
        Body: {
          Html: {
            Data: html,
            Charset: 'utf-8',
          },
          Text: {
            Data: text, // 본문 내용
            Charset: 'utf-8', // 인코딩 타입
          },
        },
        Subject: {
          Data: subject, // 제목 내용
          Charset: 'utf-8', // 인코딩 타입
        },
      },
      Source: '=?utf-8?B?67mE6rWQ6rO8IOqzteyngCDwn5SU?= <hspoint@techbless.live>', // 보낸 사람 주소
      ReplyToAddresses: ['hspoint@techbless.live'], // 답장 받을 이메일 주소
    };

    return params;
  }

  private async sendEmail(params: AWS.SES.SendEmailRequest) {
    this.ses.sendEmail(params, (err: AWS.AWSError, data: AWS.SES.SendEmailResponse) => {
      if (err) console.log(err);
      else console.log('Email Send -> ', params.Destination.BccAddresses);
    });
  }

  public async sendWelcomeEmail(email: string) {
    const bcc = [email];
    const subject: string = '비교과 메일링 구독을 마쳤습니다.';
    const text = '번거로운 비교과 공지 확인, 이제 메일로 빠르게 받아보세요!';
    const html = await ejs.renderFile(
      `${this.templateLocation}/welcome.ejs`, {
        message: text,
      },
    );

    const params = this.generateParams(bcc, subject, html, text);
    this.sendEmail(params);
  }

  public async sendVerificationEmail(subscriber: Subscriber, purpose: string) {
    let purposeForDB: Purpose = null;
    if (purpose === '구독') purposeForDB = 'subscribe';
    else if (purpose === '구독취소') purposeForDB = 'unsubscribe';

    const token = await TokenService.issueToken(subscriber.subscriberId, purposeForDB);

    const bcc = [subscriber.email];
    const subject = `${purpose}(을)를 위해 이메일 인증을 완료해주세요.`;
    const verificationUrl = `https://${process.env.SITE_URL}/verify/email/${subscriber.email}/${token}?purpose=${purposeForDB}`;
    const html = await ejs.renderFile(
      `${this.templateLocation}/verification.ejs`, {
        purpose,
        verificationUrl,
      },
    );

    const params = this.generateParams(bcc, subject, html, verificationUrl);
    this.sendEmail(params);
  }

  private distributeEmails(subscribers: Subscriber[], nEach: number = 30) {
    const nSubscribers = subscribers.length;
    const nDistributed = Math.floor(nSubscribers / nEach);

    const distributedEmails = [];

    for (let i = 0; i <= nDistributed; i += 1) {
      const spliced = subscribers.splice(0, nEach);
      if (spliced.length !== 0) {
        distributedEmails.push(spliced);
      }
    }

    return distributedEmails;
  }
}

export default new EmailService();
