import { Request, Response, NextFunction } from 'express';

const wrapAsync = (asyncFn: Function) => (
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      return await asyncFn(req, res, next);
    } catch (error) {
      return next(error);
    }
  }
);

export default wrapAsync;
