import { Request, Response, NextFunction } from 'express';
import AsyncHandled from 'express-safe-async';

import ReceivingDayService from '../services/receiving_days';

class DashBoardController {
  @AsyncHandled
  public async getDashBoard(req: Request, res: Response) {
    console.log(req.user);
    const receivingDays = await ReceivingDayService.getReceivingDays(req.user!.subscriberId);

    console.log(receivingDays);
    res.render('dashboard', {
      receivingDays,
    });
  }
}

export default new DashBoardController();
