import { Router, Response, Request } from 'express';

import * as passportConfig from '../config/passport';
import DashBoardController from '../controllers/dashboard';

class DashBoardRouter {
  public router!: Router;

  constructor() {
    this.router = Router();

    this.router.get('/dashboard', passportConfig.isAuthenticated, DashBoardController.getDashBoard);
  }
}

export default new DashBoardRouter().router;
