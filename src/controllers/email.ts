import { Request, Response } from 'express';
import AsyncHandled from 'express-safe-async';

import EmailService from '../services/email';


class EmailController {
  @AsyncHandled
  public async subscribe(req: Request, res: Response) {
    const { email } = req.body;

    if (await EmailService.checkSubscription(email)) {
      return res.render('result', {
        title: '이미 구독중인 메일입니다.',
        content: '이미 구독중인 메일 입니다. 다시 확인해주세요.',
      });
    }

    const insertedEmail = await EmailService.subscribe(email);
    await EmailService.sendVerificationEmail(insertedEmail, '구독');

    res.render('result', {
      title: '메일 인증',
      content: '인증메일이 발송되었습니다. 메일 인증을 마치면 구독이 완료됩니다.',
    });
  }
}

export default new EmailController();
