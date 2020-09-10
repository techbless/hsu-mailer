import { Request, Response, NextFunction } from 'express';
import AsyncHandled from 'express-safe-async';

import ReceivingOptionService from '../services/receiving_option';
import PermissionService from '../services/permission';
import EmailService from '../services/email';

class DashBoardController {
  @AsyncHandled
  public async getDashBoard(req: Request, res: Response) {
    const receivingDays = await ReceivingOptionService.getReceivingOption(req.user!.subscriberId);
    const permissions = await PermissionService.getPermissions(req.user!.subscriberId);

    res.render('dashboard', {
      receivingDays,
      permissions,
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

    await ReceivingOptionService.updateReceivingDays(
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

  public async broadcast(req: Request, res: Response) {
    const permission = await PermissionService.getPermissions(req.user!.subscriberId);

    if (!permission || !permission.broadcast) {
      return res.render('result', {
        title: '권한 없음',
        content: '관리자 권한이 없습니다.',
      });
    }

    const { subject, message } = req.body;
    await EmailService.sendCustomEmailToAll(subject, message);

    res.render('result', {
      title: '공지 발송 완료',
      content: '공지가 발송되었습니다.',
    });
  }
}

export default new DashBoardController();
