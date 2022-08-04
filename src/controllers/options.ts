import { Request, Response } from 'express';
import { Poll } from '../models/polls';
import { Option } from '../models/options';

export const addOption = async (req: Request, res: Response) => {
  const { pollId, option } = req.body;
  const poll = await Poll.findById(pollId);
  if (!poll) {
    throw new Error('Poll not found');
  }

  const created_at = new Date();
  const updated_at = created_at;
  const newOption = await Option.create({
    pollId,
    option,
    created_at,
    updated_at,
  });
  await newOption.save();

  const options = poll.options;
  options.push(newOption.id);
  poll.set({
    options,
    updated_at,
  });
  await poll.save();

  res.status(201).send(newOption);
};
