import { Request, Response, NextFunction } from 'express';
import AsyncHandled from 'express-safe-async';

import ReceivingDayService from '../services/receiving_days';

class DashBoardController {
  @AsyncHandled
  public async getDashBoard(req: Request, res: Response) {
    console.log(req.user);
    const receivingDays = await ReceivingDayService.getReceivingDays(req.user!.subscriberId);

    res.render('dashboard', {
      receivingDays,
    });
  }


  @AsyncHandled
  public async updateReceivingDays(req: Request, res: Response) {
    const {
      sun, mon, tue, wed, thu, fri, sat,
    } = req.body;

    const daysInString = [sun, mon, tue, wed, thu, fri, sat];

    // "on" should be true
    const daysInBool: boolean[] = daysInString.map((day: string) => {
      if (day === 'on') {
        return true;
      }
      return false;
    });

    await ReceivingDayService.updateReceivingDays(
      req.user!.subscriberId, {
        sunday: daysInBool[0],
        monday: daysInBool[1],
        tuesday: daysInBool[2],
        wednesday: daysInBool[3],
        thursday: daysInBool[4],
        friday: daysInBool[5],
        saturday: daysInBool[6],
      },
    );

    res.redirect('/dashboard');
  }
}

export default new DashBoardController();
