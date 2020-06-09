import { Request, Response, NextFunction } from 'express';
import AsyncHandled from 'express-safe-async';

import * as passport from 'passport';
import { IVerifyOptions } from 'passport-local';
import Subscriber from '../models/subscriber';

import EmailService from '../services/email';
import SubscriptionService from '../services/subscription';

class AuthController {
  @AsyncHandled
  public async login(req: Request, res: Response, next: NextFunction) {
    passport.authenticate('local', (err: Error, user: Subscriber, info: IVerifyOptions) => {
      if (err) { return next(err); }
      if (!user) { return res.redirect('/login.html'); }

      // eslint-disable-next-line no-shadow
      req.logIn(user, (err: Error) => {
        if (err) { return next(err); }
        res.redirect('/dashboard');
      });
    })(req, res, next);
  }

  @AsyncHandled
  public async sendPasswordMail(req: Request, res: Response) {
    const { email } = req.query;

    const subscriber = await SubscriptionService.findSubscriberByEmail(email);
    if (!subscriber) {
      // 오류 메세지 여기에
      return;
    }

    await EmailService.sendVerificationEmail(subscriber, '비밀번호 설정');

    res.send(`${email}로 비밀번호 설정 링크가 발송되었습니다.`);
  }

  public async showNewPasswordPage(req: Request, res: Response) {
    const { email, token } = req.params;

    res.render('new_password', {
      token,
      email,
    });
  }

  @AsyncHandled
  public async logout(req: Request, res: Response) {
    req.logout();
    res.redirect('/');
  }
}

export default new AuthController();
