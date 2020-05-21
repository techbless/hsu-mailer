import * as express from 'express';
import * as session from 'express-session';
import * as passport from 'passport';
import * as helmet from 'helmet';

import EmailRouter from './routes/email';

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

    this.app.use('/', EmailRouter);
  }
}

export default new App().app;
