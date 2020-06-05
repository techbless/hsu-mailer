import { Router, Response, Request } from 'express';

import * as passportConfig from '../config/passport';

class DashBoardRouter {
  public router!: Router;

  constructor() {
    this.router = Router();

    this.router.post('/dashboard', passportConfig.isAuthenticated, (req: Request, res: Response) => {
      res.send('DashBoard is not implemented yet.');
    });
  }
}

export default new DashBoardRouter().router;
