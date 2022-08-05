import { Request, Response } from 'express';
import { User } from '../models/users';
import jwt from 'jsonwebtoken';

export const signup = async (req: Request, res: Response) => {
  const { identity, email, remark } = req.body;
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return res.status(400).send('Identity in use');
  }

  const created_at = new Date();
  const updated_at = created_at;
  const newUser = User.build({
    identity,
    email,
    remark,
    created_at,
    updated_at,
  });
  await newUser.save();

  const userJwt = jwt.sign(
    {
      id: newUser.id,
      email: newUser.email,
      remark: newUser.remark,
    },
    process.env.JWT_KEY!
  );

  req.session = {
    jwt: userJwt,
  };

  res.status(201).send(newUser);
};

export const signin = async (req: Request, res: Response) => {
  const { identity, email } = req.body;
  const existingUser = await User.findOne({ email });

  if (!existingUser) {
    return res.status(400).send('Invalid credentials');
  }

  if (identity !== existingUser?.identity) {
    return res.status(400).send('Invalid credentials');
  }

  const userJwt = jwt.sign(
    {
      id: existingUser?.id,
      email: existingUser?.email,
      remark: existingUser?.remark,
    },
    process.env.JWT_KEY!
  );

  req.session = {
    jwt: userJwt,
  };

  res.status(201).send(existingUser);
};

export const signout = async (req: Request, res: Response) => {
  req.session = null;
  res.send({});
};

export const currentUser = async (req: Request, res: Response) => {
  res.send({ currentUser: req.currentUser || null });
};
