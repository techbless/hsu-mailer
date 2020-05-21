import { Request, Response } from 'express';
import AsyncHandled from 'express-safe-async';

import EmailService from '../services/email';

class EmailController {
  @AsyncHandled
  public async subscribe(req: Request, res: Response) {
    const { email } = req.body;
    const result = await EmailService.subscribe(email);

    // 인증 메일 발송
  }
}

export default new EmailController();
