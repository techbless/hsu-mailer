import { Router, Response, Request } from 'express';

import * as passportConfig from '../config/passport';
import DashBoardController from '../controllers/dashboard';

class DashBoardRouter {
  public router!: Router;

  constructor() {
    this.router = Router();

    this.router.get('/dashboard', passportConfig.isAuthenticated, DashBoardController.getDashBoard);
    this.router.post('/update/receiving_day', passportConfig.isAuthenticated, DashBoardController.updateReceivingDays);
    this.router.post('/broadcast', passportConfig.isAuthenticated, DashBoardController.broadcast);
  }
}

export default new DashBoardRouter().router;
