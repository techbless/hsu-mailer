import { Router, Response, Request } from 'express';
import EmailController from '../controllers/email';

class EmailRouter {
  public router!: Router;

  constructor() {
    this.router = Router();

    this.router.post('/emails/subscribe', EmailController.subscribe);
    this.router.post('/emails/unsubscribe', EmailController.unsubscribe);
    this.router.get('/verify/email/:email/:token', EmailController.verify);
  }
}

export default new EmailRouter().router;
