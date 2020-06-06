import { Router, Response, Request } from 'express';
import AuthController from '../controllers/auth';

class AuthRouter {
  public router!: Router;

  constructor() {
    this.router = Router();

    this.router.post('/login', AuthController.login);
    this.router.get('/logout', AuthController.logout);
    this.router.post('/set/password', (req: Request, res: Response) => {
      res.send('Not Implemented');
    });
  }
}

export default new AuthRouter().router;
