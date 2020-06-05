import * as express from 'express';
import * as session from 'express-session';
import * as passport from 'passport';
import * as helmet from 'helmet';

import EmailRouter from './routes/email';
import AuthRouter from './routes/auth';
import DashBoardRouter from './routes/dashboard';

class App {
  public app!: express.Application;

  constructor() {
    this.app = express();

    this.app.set('view engine', 'ejs');
    this.app.set('views', `${__dirname}/views`);

    // Prevent Security Issues
    // this.app.disable('x-powered-by');
    this.app.use(helmet());
    this.app.use(express.static(`${__dirname}/public`));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));


    this.app.use(
      session({
        resave: true,
        saveUninitialized: true,
        secret: 'SDF32SDFdslkjfj238uyF',
      }),
    );

    this.app.use(passport.initialize());
    this.app.use(passport.session());

    this.app.use('/', EmailRouter);
    this.app.use('/', AuthRouter);
    this.app.use('/', DashBoardRouter);
  }
}

export default new App().app;
