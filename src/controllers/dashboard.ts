import { Request, Response, NextFunction } from 'express';
import AsyncHandled from 'express-safe-async';

class DashBoardController {
  @AsyncHandled
  public async getDashBoard(req: Request, res: Response) {
    res.render('dashboard', {
      message: 'Test DashBoard',
    });
  }
}

export default new DashBoardController();
