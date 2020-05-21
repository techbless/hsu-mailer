import { Router, Response, Request } from 'express';
import EmailController from '../controllers/email';

class EmailRouter {
  public router!: Router;

  constructor() {
    this.router = Router();

    this.router.post('/emails/subscribe', EmailController.subscribe);
  }
}

export default new EmailRouter().router;
