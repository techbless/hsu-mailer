import { Request, Response, NextFunction } from 'express';
import AsyncHandled from 'express-safe-async';

import * as passport from 'passport';
import { IVerifyOptions } from 'passport-local';
import Subscriber from '../models/subscriber';

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
}

export default new AuthController();
