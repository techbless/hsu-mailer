import * as AWS from 'aws-sdk';
import * as ejs from 'ejs';
import Email from '../models/email';

class EmailService {
  private ses: AWS.SES;

  constructor() {
    AWS.config.update({
      region: 'us-east-1',
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    });

    this.ses = new AWS.SES();
  }

  public subscribe(email: string) {
    return Email.create({
      email,
      isAuthenticated: false,
    });
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

  private distributeEmails(emails: Email[], nEach: number = 30) {
    const nEmails = emails.length;
    const nDistributed = Math.floor(nEmails / nEach);

    const distributedEmails = [];

    for (let i = 0; i <= nDistributed; i += 1) {
      const spliced = emails.splice(0, nEach);
      if (spliced.length !== 0) {
        distributedEmails.push(spliced);
      }
    }

    return distributedEmails;
  }

  public async sendWelcomeEmail(email: Email) {
    const bcc = [email.email];
    const subject: string = '비교과 메일링 구독을 마쳤습니다.';
    const text = '번거로운 비교과 공지 확인, 이제 메일로 빠르게 받아보세요!';
    const html = await ejs.renderFile(
      'welcome.ejs', {
        message: text,
      },
    );

    const params = this.generateParams(bcc, subject, html, text);
    this.ses.sendEmail(params, (err: AWS.AWSError, data: AWS.SES.SendEmailResponse) => {
      if (err) console.log(err);
      else console.log('Welcome Email Send -> ', bcc);
    });
  }
}

export default new EmailService();
