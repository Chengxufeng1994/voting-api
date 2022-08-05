import { Request, Response, NextFunction } from 'express';

export const adminAuthorization = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const remark = req.currentUser?.remark;
  if (remark !== 'admin') {
    return res.status(401).send('UnAuthorization');
  }

  next();
};
