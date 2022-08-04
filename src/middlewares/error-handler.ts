import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log('Error Handling Middleware called');
  console.log('Path: ', req.path);
  console.error('Error: ', err);

  res.status(400).send('something went wrong');
};
