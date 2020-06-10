import { Request, Response } from 'express';
import AsyncHandled from 'express-safe-async';

import TokenService from '../services/token';
import EmailService from '../services/email';
import SubscriptionService from '../services/subscription';

import { TokenCommand, SubscribeCommand, UnSubscribeCommand } from './token_commands';

import { Purpose } from '../models/token';
import PasswordCommand from './token_commands/password_command';

class EmailController {
  @AsyncHandled
  public async subscribe(req: Request, res: Response) {
    const { email } = req.body;

    if (await SubscriptionService.checkSubscription(email)) {
      return res.render('result', {
        title: '이미 구독중인 메일입니다.',
        content: '이미 구독중인 메일 입니다. 다시 확인해주세요.',
      });
    }

    const subscriber = await SubscriptionService.subscribe(email);
    await EmailService.sendVerificationEmail(subscriber, '구독');

    res.render('result', {
      title: '메일 인증',
      content: '인증메일이 발송되었습니다. 메일 인증을 마치면 구독이 완료됩니다.',
    });
  }

  @AsyncHandled
  public async unsubscribe(req: Request, res: Response) {
    const { email } = req.body;

    const subscriber = await SubscriptionService.findSubscriberByEmail(email);

    if (!subscriber) {
      return res.render('result', {
        title: '구독중인 이메일이 아닙니다.',
        content: '구독중인 이메일이 아닙니다. 다시 확인해주세요.',
      });
    }

    await EmailService.sendVerificationEmail(subscriber, '구독취소');
    res.render('result', {
      title: '메일 인증',
      content: '인증메일이 발송되었습니다. 메일 인증을 마치면 구독취소가 완료됩니다.',
    });
  }

  @AsyncHandled
  public async verify(req: Request, res: Response) {
    const { email, token } = req.params;
    const { purpose } = req.query;

    const { password } = req.body;

    let tokenCommand!: TokenCommand;

    if (!await TokenService.verifyToken(email, token, purpose as Purpose)) {
      return res.render('result', {
        title: '인증 실패',
        content: '인증을 실패했습니다. 다시 확인해주세요.',
      });
    }

    const subscriber = await SubscriptionService.findSubscriberByEmail(email);

    if (purpose === 'subscribe') {
      tokenCommand = new SubscribeCommand(subscriber!);

      res.render('result', {
        title: '구독 성공',
        content: '비교과 공지 알림 구독을 성공적으로 마쳤습니다. 이제 새로운 공지를 편하게 확인하세요.',
      });
    } else if (purpose === 'unsubscribe') {
      tokenCommand = new UnSubscribeCommand(subscriber!);

      res.render('result', {
        title: '구독취소 성공',
        content: '비교과 공지 알림 구독을 취소했습니다. 더이상 알림을 받을 수 없습니다.',
      });
    } else if (purpose === 'password') {
      tokenCommand = new PasswordCommand(subscriber!, password);

      res.render('result', {
        title: '비밀번호 설정 완료',
        content: '비밀번호 설정이 완료 되었습니다.',
      });
    }

    tokenCommand.execute();
  }
}

export default new EmailController();
