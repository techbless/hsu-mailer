import { Router, Response, Request } from 'express';
import AuthController from '../controllers/auth';
import EmailController from '../controllers/email';

class AuthRouter {
  public router!: Router;

  constructor() {
    this.router = Router();

    this.router.post('/login', AuthController.login);
    this.router.get('/logout', AuthController.logout);
    this.router.get('/send/password_mail', AuthController.sendPasswordMail);
    this.router.get('/new/password/:email/:token', AuthController.showNewPasswordPage);
    this.router.post('/verify/email/:email/:token', EmailController.verify);
  }
}

export default new AuthRouter().router;
