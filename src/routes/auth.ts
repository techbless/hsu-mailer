import { Router, Response, Request } from 'express';
import AuthController from '../controllers/auth';

class AuthRouter {
  public router!: Router;

  constructor() {
    this.router = Router();

    this.router.post('/login', AuthController.login);
  }
}

export default new AuthRouter().router;
