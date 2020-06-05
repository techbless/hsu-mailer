import * as passport from 'passport';
import * as passportLocal from 'passport-local';
import { Request, Response, NextFunction } from 'express';
import Subscriber from '../models/subscriber';

passport.serializeUser(async (user: Subscriber, done) => {
  done(null, user.subscriberId);
});

passport.deserializeUser(async (id: number, done) => {
  const user = await Subscriber.findOne({
    where: {
      subscriberId: id,
    },
  });

  done(null, user);
});


const LocalStrategy = passportLocal.Strategy;

passport.use(
  new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
  },
  async (email, password, done) => {
    const user = await Subscriber.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      return done(null, false, { message: 'Incorrect username' });
    }

    if (user.password !== password) {
      return done(null, false, { message: 'Incorrect password' });
    }

    return done(null, user);
  }),
);


export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) return next();
  res.redirect('/login.html');
};
