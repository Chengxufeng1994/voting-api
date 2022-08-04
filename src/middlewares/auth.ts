import { Request, Response, NextFunction } from 'express';

export const auth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.currentUser) {
    return res.status(401).send('User not found');
  }

  next();
};
